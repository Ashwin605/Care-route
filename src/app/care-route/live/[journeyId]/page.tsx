"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CareJourney } from '../../../../types/journey';
import { getActiveJourney, clearActiveJourney } from '../../../../lib/journeyState';
import { Navigation, Clock, Activity, AlertTriangle, ArrowLeft, MapPin, CheckCircle, RefreshCcw, Info, FastForward, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useJourneyMonitor } from '../../../../hooks/useJourneyMonitor';
import { publishNetworkEvent } from '../../../../data/mockEvents';
import JourneyTimeline from '../../../../components/journey/JourneyTimeline';
import RerouteRecommendationDialog from '../../../../components/journey/RerouteRecommendationDialog';
import { v4 as uuidv4 } from 'uuid';

// Dynamically import the map to avoid SSR issues with Leaflet
const ActiveRouteMap = dynamic(() => import('../../../../components/journey/ActiveRouteMap'), { ssr: false });

function LiveJourneyMonitor({ initialJourney, onCancel }: { initialJourney: CareJourney, onCancel: () => void }) {
  const { journey, latestChangeReasons, forceTick, fastForward, mutateJourney } = useJourneyMonitor(initialJourney);
  
  const [activeToast, setActiveToast] = useState<{ id: string, message: string, type: string } | null>(null);

  useEffect(() => {
    if (journey.events.length > 0) {
      const latest = journey.events[journey.events.length - 1];
      // Only show toast if event is very recent (less than 5 seconds ago) to avoid spam on reload
      const age = Date.now() - new Date(latest.timestamp).getTime();
      if (age < 5000) {
         setActiveToast({ id: latest.id, message: latest.description, type: latest.type });
         const timer = setTimeout(() => setActiveToast(null), 4000);
         return () => clearTimeout(timer);
      }
    }
  }, [journey.events]);

  const simulateIncident = () => {
    // 1. Mutate mock data so the engine actually fails
    const MOCK_CAPACITY = require('../../../../data/mockHospitalCapacity').MOCK_CAPACITY;
    const caps = MOCK_CAPACITY[journey.destinationHospitalId];
    if (caps && caps.length > 0) {
       caps[0].available = 0;
       if (caps[0].expectedAvailable !== undefined) {
         caps[0].expectedAvailable = 0;
       }
       
       // 2. Publish the Network Event
       publishNetworkEvent({
         id: uuidv4(),
         timestamp: new Date().toISOString(),
         type: 'CAPACITY_CHANGE',
         hospitalId: journey.destinationHospitalId,
         resourceId: 'ICU_BED',
         details: 'Simulated failure for demo purposes.'
       });
    }
  };

  const handleAcceptReroute = () => {
    if (!journey.latestRerouteEvaluation?.recommendedAlternative) return;
    
    const alt = journey.latestRerouteEvaluation.recommendedAlternative;
    const evalState = journey.latestRerouteEvaluation;
    const updatedJourney = { ...journey };
    
    // 1. Preserve History
    updatedJourney.previousDestinations = [
      ...(updatedJourney.previousDestinations || []),
      {
        hospitalId: journey.destinationHospitalId,
        hospitalName: journey.recommendationSnapshot.hospital.name,
        reroutedAt: new Date().toISOString(),
        reason: evalState.trigger.reason
      }
    ];

    // 2. Atomic Update
    updatedJourney.destinationHospitalId = alt.hospital.id;
    updatedJourney.recommendationSnapshot = alt;
    updatedJourney.destinationStatus = 'SUITABLE';
    updatedJourney.initialEta = alt.etaMinutes;
    updatedJourney.currentEta = alt.etaMinutes;
    updatedJourney.distanceRemaining = alt.distanceKm;
    updatedJourney.progress = 0; 
    
    updatedJourney.latestRerouteEvaluation = {
      ...evalState,
      decision: 'REROUTE_ACCEPTED'
    };

    updatedJourney.events.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'REROUTE_ACCEPTED',
      description: `Patient confirmed route change`
    });

    updatedJourney.events.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'DESTINATION_CHANGED',
      description: `Rerouted to ${alt.hospital.name}`
    });
    
    updatedJourney.events.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'ROUTE_UPDATED',
      description: `New ETA: ${alt.etaMinutes} mins`
    });

    mutateJourney(updatedJourney);

    // 3. High Priority Toast
    setActiveToast({
      id: uuidv4(),
      type: 'CARE ROUTE UPDATED',
      message: `Your destination has been changed to ${alt.hospital.name}. Estimated arrival: ${new Date(Date.now() + alt.etaMinutes * 60000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    });
    setTimeout(() => setActiveToast(null), 8000);
  };

  const handleDeclineReroute = () => {
    if (!journey.latestRerouteEvaluation?.recommendedAlternative) return;
    const altId = journey.latestRerouteEvaluation.recommendedAlternative.hospital.id;
    
    const updatedJourney = { ...journey };
    
    updatedJourney.declinedAlternatives = [
      ...(updatedJourney.declinedAlternatives || []),
      altId
    ];

    updatedJourney.latestRerouteEvaluation = {
      ...journey.latestRerouteEvaluation,
      decision: 'REROUTE_DECLINED'
    };
    
    updatedJourney.events.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'REROUTE_DECLINED',
      description: `Declined reroute to ${journey.latestRerouteEvaluation.recommendedAlternative.hospital.name}`
    });

    mutateJourney(updatedJourney);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[var(--cr-background)]">
      
      <RerouteRecommendationDialog 
        journey={journey} 
        onAccept={handleAcceptReroute} 
        onDecline={handleDeclineReroute} 
      />

      {/* Toast Notification Banner overlaying map */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-sm transition-all duration-300">
          {activeToast && (
            <div className={`p-4 rounded-xl shadow-2xl flex items-start gap-3 border ${
              activeToast.type === 'DESTINATION_STATUS_CHANGED' || activeToast.type === 'NETWORK_CHANGE_DETECTED'
                ? 'bg-white border-[var(--cr-warning)] text-[var(--cr-warning)]'
                : 'bg-[var(--cr-deep-text)] border-transparent text-white'
            }`}>
              {activeToast.type === 'DESTINATION_STATUS_CHANGED' || activeToast.type === 'NETWORK_CHANGE_DETECTED' ? (
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              ) : activeToast.type === 'ETA_UPDATED' ? (
                <Clock size={18} className="mt-0.5 shrink-0 text-gray-300" />
              ) : (
                <Info size={18} className="mt-0.5 shrink-0 text-[var(--cr-primary)]" />
              )}
              <div>
                 <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                   {activeToast.type.replace(/_/g, ' ')}
                 </div>
                 <div className={`text-sm font-bold ${activeToast.type === 'DESTINATION_STATUS_CHANGED' ? 'text-[var(--cr-deep-text)]' : 'text-white'}`}>
                   {activeToast.message}
                 </div>
              </div>
            </div>
          )}
        </div>

      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <ActiveRouteMap 
          patientLocation={journey.origin} 
          destination={journey.recommendationSnapshot.hospital} 
        />
        
        {/* Mobile Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center md:hidden pointer-events-none">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md flex items-center gap-2 pointer-events-auto">
            <div className={`w-2 h-2 rounded-full ${journey.monitoringStatus === 'MONITORING' ? 'bg-[var(--cr-success)] animate-pulse' : journey.monitoringStatus === 'ERROR' ? 'bg-[var(--cr-critical)]' : 'bg-[var(--cr-warning)]'}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">CARE ROUTE LIVE</span>
          </div>
          <button 
            onClick={onCancel}
            className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-[10px] font-bold uppercase tracking-widest text-red-500 pointer-events-auto"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Live Panel / Bottom Sheet */}
      <div className="w-full md:w-[400px] bg-white border-t md:border-t-0 md:border-l border-[var(--cr-border)] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none z-20 shrink-0 max-h-[50vh] md:max-h-none overflow-y-auto">
        
        {/* Desktop Header */}
        <header className="hidden md:flex p-6 border-b border-[var(--cr-border)] items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${journey.monitoringStatus === 'MONITORING' ? 'bg-[var(--cr-success)] animate-pulse' : journey.monitoringStatus === 'ERROR' ? 'bg-[var(--cr-critical)]' : 'bg-[var(--cr-warning)]'}`}></div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">CARE ROUTE LIVE</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
          >
            Cancel
          </button>
        </header>

        {/* Panel Content */}
        {journey.status === 'COMPLETED' ? (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-20 h-20 bg-[var(--cr-success)]/10 text-[var(--cr-success)] rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--cr-deep-text)] mb-2">Journey Completed</h2>
              <p className="text-[var(--cr-muted)]">You have arrived at <span className="font-bold text-[var(--cr-primary)]">{journey.recommendationSnapshot.hospital.name}</span>.</p>
            </div>
            <button 
              onClick={onCancel}
              className="mt-8 px-6 py-3 bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 text-white font-bold rounded-xl shadow-lg transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-8">
            
            {/* Destination Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <h2 className="text-xl font-bold text-[var(--cr-deep-text)] leading-tight">
                {journey.recommendationSnapshot.hospital.name}
              </h2>
            </div>
            <p className="text-sm text-[var(--cr-muted)] font-medium ml-10">Estimated route to care</p>
          </div>

          {/* Dynamic Status Banner */}
          {journey.destinationStatus === 'SUITABLE' && (
            <div className="bg-[var(--cr-success)]/10 border border-[var(--cr-success)]/20 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle size={18} className="text-[var(--cr-success)] mt-0.5 shrink-0" />
              <p className="text-sm font-bold text-[var(--cr-success)]">Destination remains suitable.</p>
            </div>
          )}
          
          {journey.destinationStatus === 'AT_RISK' && (
            <div className="bg-[var(--cr-warning)]/10 border border-[var(--cr-warning)]/20 p-4 rounded-xl flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-[var(--cr-warning)] mt-0.5 shrink-0" />
                <p className="text-sm font-bold text-[var(--cr-warning)]">Destination status changed.</p>
              </div>
              <div className="ml-7 mt-1">
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--cr-warning)] mb-1">What changed?</div>
                <ul className="text-xs text-[var(--cr-warning)] opacity-90 list-disc ml-4 space-y-1">
                  {latestChangeReasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                  {latestChangeReasons.length === 0 && <li>Capacity has become constrained.</li>}
                </ul>
              </div>
            </div>
          )}

          {journey.destinationStatus === 'UNAVAILABLE' && (
            <div className="bg-[var(--cr-critical)]/10 border border-[var(--cr-critical)]/20 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle size={18} className="text-[var(--cr-critical)] mt-0.5 shrink-0" />
              <p className="text-sm font-bold text-[var(--cr-critical)]">Your destination is currently unavailable.</p>
            </div>
          )}

          {/* Primary Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-[var(--cr-border)] p-4 rounded-xl relative overflow-hidden">
              <Clock size={16} className="text-[var(--cr-primary)] mb-2" />
              <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{journey.currentEta} <span className="text-sm font-medium text-[var(--cr-muted)]">min</span></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mt-1">Travel Time</div>
              
              {/* ETA change indicator */}
              {journey.currentEta < journey.initialEta - 2 && (
                <div className="absolute top-4 right-4 text-[9px] font-bold uppercase text-[var(--cr-success)] bg-[var(--cr-success)]/10 px-1.5 py-0.5 rounded">
                  Faster
                </div>
              )}
            </div>
            <div className="bg-gray-50 border border-[var(--cr-border)] p-4 rounded-xl">
              <Navigation size={16} className="text-[var(--cr-primary)] mb-2" />
              <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{journey.distanceRemaining} <span className="text-sm font-medium text-[var(--cr-muted)]">km</span></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mt-1">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
             <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Journey Progress</span>
                <span className="text-xs font-bold text-[var(--cr-deep-text)]">{Math.round(journey.progress)}%</span>
             </div>
             <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
               <div className="bg-[var(--cr-primary)] h-2.5 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${journey.progress}%` }}></div>
             </div>
          </div>

          {/* Status List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--cr-border)] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Estimated arrival</span>
              <span className="text-sm font-bold text-[var(--cr-deep-text)]">
                {new Date(journey.estimatedArrival).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--cr-border)] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Status</span>
              <span className="text-sm font-bold text-[var(--cr-primary)] bg-[var(--cr-primary)]/10 px-2 py-0.5 rounded">
                {journey.status === 'ARRIVING' ? 'Arriving soon' : 'Journey active'}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Destination</span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                journey.destinationStatus === 'SUITABLE' ? 'text-[var(--cr-success)] bg-[var(--cr-success)]/10' :
                journey.destinationStatus === 'AT_RISK' ? 'text-[var(--cr-warning)] bg-[var(--cr-warning)]/10' :
                'text-[var(--cr-critical)] bg-[var(--cr-critical)]/10'
              }`}>
                {journey.destinationStatus}
              </span>
            </div>
          </div>

          {/* Monitoring Indicator */}
          {journey.monitoringStatus === 'MONITORING' && (
            <div className="mt-2 bg-[var(--cr-success)]/5 border border-[var(--cr-success)]/20 p-4 rounded-xl flex items-center gap-3">
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cr-success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--cr-success)]"></span>
              </div>
              <p className="text-xs font-medium text-gray-700 leading-relaxed">
                Monitoring destination for capacity changes or disruptions.
              </p>
            </div>
          )}

          {journey.monitoringStatus === 'STALE' && (
            <div className="mt-2 bg-[var(--cr-warning)]/5 border border-[var(--cr-warning)]/20 p-4 rounded-xl flex items-center gap-3">
              <Info size={16} className="text-[var(--cr-warning)] shrink-0" />
              <p className="text-xs font-medium text-gray-700 leading-relaxed">
                Destination information may be outdated.
              </p>
            </div>
          )}

          {journey.monitoringStatus === 'ERROR' && (
            <div className="mt-2 bg-[var(--cr-critical)]/5 border border-[var(--cr-critical)]/20 p-4 rounded-xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[var(--cr-critical)] shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-critical)]">Monitoring Interrupted</span>
              </div>
              <p className="text-xs font-medium text-gray-700 leading-relaxed">
                CARE ROUTE could not verify the latest destination status.
              </p>
              <button onClick={forceTick} className="mt-2 flex items-center justify-center gap-2 text-xs font-bold text-white bg-[var(--cr-critical)] rounded py-2">
                <RefreshCcw size={14} /> Retry
              </button>
            </div>
          )}
          
          <JourneyTimeline events={journey.events} />

          {/* Simulator Controls */}
          {journey.destinationStatus === 'SUITABLE' && (
            <div className="mt-auto pt-4 border-t border-[var(--cr-border)] flex flex-col gap-2">
              <button onClick={() => fastForward(3)} className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[var(--cr-primary)]/50 text-[var(--cr-primary)] rounded text-xs font-bold uppercase tracking-widest hover:bg-[var(--cr-primary)]/10 transition-colors">
                <FastForward size={14} /> Demo: Fast Forward 3m
              </button>
              <button onClick={simulateIncident} className="w-full py-2 border border-dashed border-[var(--cr-warning)] text-[var(--cr-warning)] rounded text-xs font-bold uppercase tracking-widest hover:bg-[var(--cr-warning)]/10 transition-colors">
                Demo: Simulate Incident
              </button>
            </div>
          )}

        </div>
        )}
      </div>
    </div>
  );
}

export default function ActiveJourneyPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const router = useRouter();
  const [initialJourney, setInitialJourney] = useState<CareJourney | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Note: we can use params to fetch journey from a real backend in the future,
  // but for the prototype we are reading from localStorage which is a singleton.
  
  useEffect(() => {
    const active = getActiveJourney();
    if (!active) {
      router.push('/find-care');
    } else {
      setInitialJourney(active);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !initialJourney) {
    return <div className="min-h-screen bg-[var(--cr-background)] flex items-center justify-center">Loading journey...</div>;
  }

  const handleCancel = () => {
    clearActiveJourney();
    router.push('/find-care');
  };

  return <LiveJourneyMonitor initialJourney={initialJourney} onCancel={handleCancel} />;
}
