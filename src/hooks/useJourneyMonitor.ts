import { useState, useEffect, useCallback } from 'react';
import { CareJourney, JourneyEvent, DestinationStatus, MonitoringStatus } from '../types/journey';
import { saveActiveJourney } from '../lib/journeyState';
import { analyzeHealthcareNetwork } from '../lib/intelligence/networkAnalyzer';
import { MOCK_HOSPITALS } from '../data/mockHospitals';
import { MOCK_CAPACITY } from '../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../data/mockSpecialists';
import { CareRequirement } from '../types/care';
import { v4 as uuidv4 } from 'uuid';
import { evaluateReroute } from '../lib/intelligence/rerouteEngine';
import { detectRerouteTriggers, isDuplicateTrigger } from '../lib/intelligence/triggerEngine';

interface MonitorResult {
  journey: CareJourney;
  latestChangeReasons: string[];
}

export function useJourneyMonitor(initialJourney: CareJourney, pollingIntervalMs: number = 5000) {
  const [journey, setJourney] = useState<CareJourney>(initialJourney);
  const [latestChangeReasons, setLatestChangeReasons] = useState<string[]>([]);
  
  // For the prototype simulator
  const [tick, setTick] = useState(0);
  const [timeOffsetMs, setTimeOffsetMs] = useState(0);

  const forceTick = useCallback(() => setTick(t => t + 1), []);
  const fastForward = useCallback((minutes: number) => {
    setTimeOffsetMs(prev => prev + (minutes * 60000));
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkDestination = () => {
      try {
        // 1. Get Requirements
        let reqs: CareRequirement = { resources: [], specialists: [], radiusKm: 50 };
        const reqsStr = localStorage.getItem('careRequirements');
        if (reqsStr) {
          try { reqs = JSON.parse(reqsStr); } catch (e) {}
        }

        // 2. Run Intelligence Engine against LIVE data (mock data for prototype)
        const intel = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, reqs);
        
        // 3. Find Candidate State for the destination
        const destState = intel.candidateStates[journey.destinationHospitalId];
        if (!destState) {
          // If completely missing from intelligence
          updateJourneyStatus('UNKNOWN', 'MONITORING', ["Hospital could not be evaluated by the network."]);
          return;
        }

        // 4. Map Network Engine status to Journey Destination Status
        let newStatus: DestinationStatus = 'SUITABLE';
        if (destState === 'INELIGIBLE') {
          newStatus = 'UNAVAILABLE';
        } else if (destState === 'AT_RISK' || destState === 'STALE_DATA') {
          newStatus = 'AT_RISK';
        }

        // 5. Check Freshness
        const hospital = MOCK_HOSPITALS.find(h => h.id === journey.destinationHospitalId);
        let newMonitorStatus: MonitoringStatus = 'MONITORING';
        if (hospital) {
           const diff = Date.now() - new Date(hospital.lastUpdate).getTime();
           if (diff > 5 * 60000) { // > 5 minutes
             newMonitorStatus = 'STALE';
           }
        } else {
          newMonitorStatus = 'ERROR';
        }

        // 6. Update Journey if status changed or verify for the first time
        if (newStatus !== journey.destinationStatus || newMonitorStatus !== journey.monitoringStatus) {
           const rawReasons = intel.allReasons?.[journey.destinationHospitalId] || [];
           const reasons = rawReasons.map((r: any) => r.description ?? String(r));
           updateJourneyStatus(newStatus, newMonitorStatus, reasons);
        } else if (newStatus === 'SUITABLE' && !journey.events.some(e => e.type === 'DESTINATION_VERIFIED')) {
           // Log verification if it hasn't been logged yet
           updateJourneyStatus(newStatus, newMonitorStatus, []);
        }

      } catch (e) {
        console.error("Monitoring failed", e);
        updateJourneyStatus(journey.destinationStatus, 'ERROR', ["CARE ROUTE could not verify the latest destination status."]);
      }
    };

    const updateJourneyStatus = (newDestStatus: DestinationStatus, newMonStatus: MonitoringStatus, reasons: string[]) => {
      if (!mounted) return;
      
      setJourney(prev => {
        const now = new Date().toISOString();
        const newEvents = [...prev.events];
        
        if (prev.destinationStatus !== newDestStatus) {
           newEvents.push({
             id: uuidv4(),
             timestamp: now,
             type: 'DESTINATION_STATUS_CHANGED',
             description: `Status changed from ${prev.destinationStatus} to ${newDestStatus}`,
             data: { reasons }
           });
        } else if (newDestStatus === 'SUITABLE' && !prev.events.some(e => e.type === 'DESTINATION_VERIFIED')) {
           newEvents.push({
             id: uuidv4(),
             timestamp: now,
             type: 'DESTINATION_VERIFIED',
             description: `Destination hospital remains suitable`
           });
        }

        if (newMonStatus === 'ERROR' && prev.monitoringStatus !== 'ERROR') {
           newEvents.push({
             id: uuidv4(),
             timestamp: now,
             type: 'CANCELLED',
             description: `Could not verify destination status`
           });
        }

        const updated = {
          ...prev,
          destinationStatus: newDestStatus,
          monitoringStatus: newMonStatus,
          events: newEvents
        };

        // Rerouting Foundation: Trigger Reroute Evaluation using robust Trigger Engine
        const reqsStr = localStorage.getItem('careRequirements');
        if (reqsStr) {
          try {
            const reqs = JSON.parse(reqsStr);
            const trigger = detectRerouteTriggers(updated, reqs);
            if (trigger && !isDuplicateTrigger(updated, trigger)) {
               updated.events.push({
                 id: uuidv4(),
                 timestamp: new Date().toISOString(),
                 type: 'REROUTE_TRIGGERED',
                 description: `Trigger: ${trigger.reason}`
               });
               
               const evalResult = evaluateReroute(updated, trigger);
               updated.latestRerouteEvaluation = evalResult;

               if (evalResult.decision === 'REROUTE_RECOMMENDED') {
                  updated.events.push({
                    id: uuidv4(),
                    timestamp: new Date().toISOString(),
                    type: 'REROUTE_RECOMMENDED',
                    description: `Recommended alternative: ${evalResult.recommendedAlternative?.hospital.name}`
                  });
               }
            }
          } catch (e) {}
        }
        
        saveActiveJourney(updated);
        setLatestChangeReasons(reasons);
        return updated;
      });
    };

    // Progression Loop
    const updateProgression = () => {
      if (!mounted) return;
      
      setJourney(prev => {
        if (prev.status === 'COMPLETED' || prev.status === 'CANCELLED') return prev;

        const now = Date.now() + timeOffsetMs;
        const start = new Date(prev.startedAt).getTime();
        const end = new Date(prev.estimatedArrival).getTime();
        const totalDuration = end - start;
        
        // Guard: if duration is invalid, don't progress
        if (totalDuration <= 0) return prev;
        
        const elapsed = now - start;

        let newProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
        if (isNaN(newProgress)) return prev;
        
        let newStatus = prev.status;
        if (newProgress >= 100) {
          newProgress = 100;
          newStatus = 'COMPLETED';
        } else if (newProgress >= 90) {
          newStatus = 'ARRIVING';
        }

        const initialDistance = prev.recommendationSnapshot.distanceKm;
        const newDistance = Math.max(0, Number((initialDistance * (1 - newProgress / 100)).toFixed(1)));
        const newEta = Math.max(0, Math.round(prev.initialEta * (1 - newProgress / 100)));

        // Interpolate coordinates
        const destCoords = prev.recommendationSnapshot.hospital.coordinates;
        let newLat = prev.origin.lat;
        let newLng = prev.origin.lng;

        if (destCoords && newProgress > prev.progress) {
          // Calculate original start coords based on current progress vs original
          // Actually, it's easier to just interpolate between the very first origin and the destination
          // But we don't store the *very first* origin, we update `origin` in place.
          // Let's store `initialOrigin` if we wanted to be perfect. 
          // But wait, if we just interpolate from the current `origin` to `destCoords` based on the REMAINING progress...
          // Let's just approximate the move.
          const remainingFactor = (newProgress - prev.progress) / (100 - prev.progress);
          if (remainingFactor > 0 && remainingFactor <= 1) {
            newLat = prev.origin.lat + (destCoords.lat - prev.origin.lat) * remainingFactor;
            newLng = prev.origin.lng + (destCoords.lng - prev.origin.lng) * remainingFactor;
          }
        }

        if (newProgress === prev.progress && newStatus === prev.status) return prev;

        const updatedEvents = [...prev.events];
        if (newEta !== prev.currentEta && newEta % 5 === 0 && prev.currentEta % 5 !== 0) {
          // Log major ETA updates (every 5 mins) just to avoid spam
          updatedEvents.push({
            id: uuidv4(),
            timestamp: new Date(now).toISOString(),
            type: 'ETA_UPDATED',
            description: `ETA updated to ${newEta} min`
          });
        }
        
        if (newStatus === 'ARRIVING' && prev.status !== 'ARRIVING') {
           updatedEvents.push({
            id: uuidv4(),
            timestamp: new Date(now).toISOString(),
            type: 'ARRIVING',
            description: `Arriving at destination shortly`
          });
        }

        if (newStatus === 'COMPLETED' && prev.status !== 'COMPLETED') {
           updatedEvents.push({
            id: uuidv4(),
            timestamp: new Date(now).toISOString(),
            type: 'COMPLETED',
            description: `Arrived at ${prev.recommendationSnapshot.hospital.name}`
          });
        }

        const updated = {
          ...prev,
          progress: newProgress,
          currentEta: newEta,
          distanceRemaining: newDistance,
          status: newStatus,
          origin: { ...prev.origin, lat: newLat, lng: newLng },
          events: updatedEvents
        };
        
        saveActiveJourney(updated);
        return updated;
      });
    };

    // Run immediately, then on interval
    checkDestination();
    updateProgression();
    
    const monitorInterval = setInterval(checkDestination, pollingIntervalMs);
    const progressInterval = setInterval(updateProgression, 1000); // update progress every second

    // Listen for cross-component intelligence events
    const handleJourneyUpdated = () => {
      const active = localStorage.getItem('careRoute_activeJourney');
      if (active) {
        try {
          const parsed = JSON.parse(active);
          setJourney(prev => {
             // Only update if something changed
             if (parsed.destinationStatus !== prev.destinationStatus || parsed.monitoringStatus !== prev.monitoringStatus) {
                // Determine latest reasons if any
                const latestEvent = parsed.events.reverse().find((e: any) => e.type === 'DESTINATION_STATUS_CHANGED');
                if (latestEvent && latestEvent.data && latestEvent.data.reasons) {
                   setLatestChangeReasons(latestEvent.data.reasons);
                }
                return parsed;
             }
             return prev;
          });
        } catch (e) {}
      }
    };
    
    window.addEventListener('careRouteJourneyUpdated', handleJourneyUpdated);

    return () => {
      mounted = false;
      clearInterval(monitorInterval);
      clearInterval(progressInterval);
      window.removeEventListener('careRouteJourneyUpdated', handleJourneyUpdated);
    };
  }, [journey.destinationHospitalId, journey.destinationStatus, journey.monitoringStatus, pollingIntervalMs, tick, timeOffsetMs]);

  const mutateJourney = useCallback((newJourney: CareJourney) => {
    setJourney(newJourney);
    saveActiveJourney(newJourney);
  }, []);

  return { journey, latestChangeReasons, forceTick, fastForward, mutateJourney };
}
