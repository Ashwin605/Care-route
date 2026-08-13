"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CareRequirement } from '../../../types/care';
import { MOCK_HOSPITALS } from '../../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../../data/mockSpecialists';
import { analyzeHealthcareNetwork } from '../../../lib/intelligence/networkAnalyzer';
import { WhatIfOverrides } from '../../../types/intelligence';
import { Recommendation } from '../../../types/recommendation';

import ActiveRouteMap from '../../../components/journey/ActiveRouteMap';
import JourneyStatusPanel from '../../../components/journey/JourneyStatusPanel';
import JourneySimulator from '../../../components/journey/JourneySimulator';
import RerouteAlert from '../../../components/journey/RerouteAlert';
import ArrivalScreen from '../../../components/journey/ArrivalScreen';
import AlternativeChain from '../../../components/intelligence/AlternativeChain';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ActiveJourneyPage() {
  const params = useParams();
  const router = useRouter();
  
  const initialTargetId = typeof params.id === 'string' ? params.id : '';
  
  const [requirements, setRequirements] = useState<CareRequirement | null>(null);
  const [targetId, setTargetId] = useState<string>(initialTargetId);
  
  const [simulatedEta, setSimulatedEta] = useState<number | null>(null);
  const [hasArrived, setHasArrived] = useState(false);
  
  const [overrides, setOverrides] = useState<WhatIfOverrides>({
    capacityDeltas: {},
    trafficMultiplier: 1.0,
    specialistUnavailability: [],
    disabledHospitals: []
  });

  const [rerouteSuggestion, setRerouteSuggestion] = useState<{
    newRecommendation: Recommendation,
    reason: string
  } | null>(null);

  const [lastIntelligence, setLastIntelligence] = useState<{
    candidateStates: Record<string, any>;
    allRecommendations: Recommendation[];
  } | null>(null);

  // Load requirements on mount
  useEffect(() => {
    const reqsStr = localStorage.getItem('careRequirements');
    if (reqsStr) {
      try {
        setRequirements(JSON.parse(reqsStr));
      } catch (e) {
        console.error("Failed to parse requirements", e);
      }
    }
  }, []);

  // Continuous Intelligence Monitoring
  useEffect(() => {
    if (!requirements || hasArrived) return;

    // Run the network analyzer with current overrides
    const result = analyzeHealthcareNetwork(
      MOCK_HOSPITALS, 
      MOCK_CAPACITY, 
      MOCK_SPECIALISTS, 
      requirements,
      overrides
    );

    const targetHospitalProfile = MOCK_HOSPITALS.find(h => h.id === targetId);
    if (!targetHospitalProfile) return;

    // Is our target hospital still the best, or at least eligible?
    const targetState = result.candidateStates[targetId];
    
    // Set initial ETA if not set
    if (simulatedEta === null) {
      // Find what the ETA was for the target
      // If it's in the recommendations, use that. Otherwise compute manually.
      const rec = result.alternatives.concat(result.recommendedHospital ? [result.recommendedHospital] : []).find(r => r.hospitalId === targetId);
      if (rec) {
        setSimulatedEta(rec.etaMinutes);
      }
    }

    // Logic for REROUTE
    // If the target is AT_RISK or INELIGIBLE, and the recommendedHospital is DIFFERENT
    if ((targetState === 'AT_RISK' || targetState === 'INELIGIBLE') && 
        result.recommendedHospital && 
        result.recommendedHospital.hospitalId !== targetId) 
    {
      // Only set suggestion if we aren't already suggesting it
      if (rerouteSuggestion?.newRecommendation.hospitalId !== result.recommendedHospital.hospitalId) {
        const reason = result.alternatives.find(a => a.hospitalId === targetId)?.reasons.find(r => !r.met)?.description || 'Capacity critically constrained.';
        
        setRerouteSuggestion({
          newRecommendation: result.recommendedHospital,
          reason
        });
      }
    }

    const allRecs = [...result.alternatives];
    if (result.recommendedHospital && !allRecs.find(r => r.hospitalId === result.recommendedHospital?.hospitalId)) {
      allRecs.push(result.recommendedHospital);
    }
    // Also include target if it's not in the list (e.g., if it became ineligible)
    if (!allRecs.find(r => r.hospitalId === targetId)) {
      const targetAsRec = {
        hospitalId: targetId,
        hospital: targetHospitalProfile,
        matchScore: 0,
        distanceKm: 0,
        etaMinutes: simulatedEta || 0,
        reasons: []
      } as Recommendation;
      allRecs.push(targetAsRec);
    }

    setLastIntelligence({
      candidateStates: result.candidateStates,
      allRecommendations: allRecs
    });
  }, [requirements, targetId, overrides, hasArrived, simulatedEta, rerouteSuggestion]);

  // Handle Arrival Trigger
  useEffect(() => {
    if (simulatedEta !== null && simulatedEta <= 0) {
      setHasArrived(true);
    }
  }, [simulatedEta]);

  if (!requirements) {
    return <div className="min-h-screen bg-[var(--cr-background)] flex items-center justify-center">Loading journey data...</div>;
  }

  const targetHospitalProfile = MOCK_HOSPITALS.find(h => h.id === targetId);
  if (!targetHospitalProfile) return null;

  if (hasArrived) {
    return <ArrivalScreen destination={targetHospitalProfile} />;
  }

  const handleAcceptReroute = () => {
    if (rerouteSuggestion) {
      setTargetId(rerouteSuggestion.newRecommendation.hospitalId);
      setSimulatedEta(rerouteSuggestion.newRecommendation.etaMinutes);
      setRerouteSuggestion(null);
    }
  };

  // Mock distance for display since we are overriding ETA manually in demo
  // 1 minute ~ 0.4 km at 25km/h
  const displayDistance = (simulatedEta || 0) * 0.4;

  return (
    <div className="min-h-screen bg-[var(--cr-background)] flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="py-4 px-6 absolute top-0 left-0 w-full z-40 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-[var(--cr-border)]">
        <Link href="/find-care/results" className="flex items-center gap-2 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors">
          <ArrowLeft size={16} /> 
          <span className="text-xs font-bold tracking-widest uppercase">Cancel Journey</span>
        </Link>
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)]">
          CARE ROUTE LIVE
        </div>
      </header>

      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <ActiveRouteMap 
          patientLocation={requirements.location!} 
          destination={targetHospitalProfile}
        />
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 flex-grow flex flex-col justify-end p-6 pointer-events-none">
        
        <div className="max-w-2xl w-full pointer-events-auto mb-6">
          <JourneyStatusPanel 
            destination={targetHospitalProfile}
            etaMinutes={simulatedEta || 0}
            distanceKm={displayDistance}
            isRerouting={!!rerouteSuggestion}
            totalTimeToCare={
              (() => {
                // Run the network analyzer just to get the recommendation for target
                const result = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, requirements, overrides);
                const rec = result.alternatives.concat(result.recommendedHospital ? [result.recommendedHospital] : []).find(r => r.hospitalId === targetId);
                // Adjust for simulatedEta
                if (rec && rec.totalTimeToCare) {
                  return {
                    ...rec.totalTimeToCare,
                    travelMinutes: simulatedEta || 0,
                    totalEstimatedMinutes: (simulatedEta || 0) + rec.totalTimeToCare.estimatedIntakeMinutes + rec.totalTimeToCare.resourceAvailabilityFactor + rec.totalTimeToCare.specialistAvailabilityFactor
                  };
                }
                return undefined;
              })()
            }
          />
        </div>

        {/* Alternative Chain Panel */}
        {lastIntelligence && lastIntelligence.allRecommendations.length > 1 && (
          <div className="max-w-2xl w-full pointer-events-auto">
            <AlternativeChain 
              primaryTargetId={targetId}
              recommendations={lastIntelligence.allRecommendations}
              candidateStates={lastIntelligence.candidateStates}
            />
          </div>
        )}

      </div>

      {/* Simulator Panel (top right) */}
      <div className="absolute top-20 right-6 w-80 z-20 shadow-2xl rounded-xl">
        <JourneySimulator 
          targetHospital={targetHospitalProfile}
          currentEta={simulatedEta || 0}
          setSimulatedEta={setSimulatedEta as React.Dispatch<React.SetStateAction<number>>}
          setOverrides={setOverrides}
          onSimulateArrival={() => setHasArrived(true)}
        />
      </div>

      {/* Reroute Alert Modal */}
      <AnimatePresence>
        {rerouteSuggestion && (
          <RerouteAlert 
            previousTarget={targetHospitalProfile.name}
            newRecommendation={rerouteSuggestion.newRecommendation}
            reason={rerouteSuggestion.reason}
            onAccept={handleAcceptReroute}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
}
