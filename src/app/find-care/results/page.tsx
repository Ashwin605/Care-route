"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CareRequirement } from '../../../types/care';
import { useNetworkState } from '../../../contexts/NetworkStateContext';
import { analyzeHealthcareNetwork } from '../../../lib/intelligence/networkAnalyzer';
import { IntelligenceResult, WhatIfOverrides } from '../../../types/intelligence';

import RecommendedHospital from '../../../components/recommendations/RecommendedHospital';
import NearestVsSuitable from '../../../components/recommendations/NearestVsSuitable';
import CareAccessComparison from '../../../components/intelligence/CareAccessComparison';
import WhatIfSimulator from '../../../components/demo/WhatIfSimulator';
import RecommendationExplanation from '../../../components/intelligence/RecommendationExplanation';
import NetworkResilience from '../../../components/intelligence/NetworkResilience';
import ExplainabilityCenter from '../../../components/intelligence/ExplainabilityCenter';
import CareRouteAnalysisSummary from '../../../components/recommendations/CareRouteAnalysisSummary';
import IneligibleHospitalExplanation from '../../../components/intelligence/IneligibleHospitalExplanation';
import CapacityTrajectoryTimeline from '../../../components/intelligence/CapacityTrajectoryTimeline';
import TrustAndDataConfidence from '../../../components/intelligence/TrustAndDataConfidence';
import IntelligentHospitalComparison from '../../../components/intelligence/IntelligentHospitalComparison';
import { HospitalProfile } from '../../../types/hospital';
import { useRouter, useSearchParams } from 'next/navigation';
import StartJourneyDialog from '../../../components/journey/StartJourneyDialog';
import { MOCK_SPECIALISTS } from '../../../data/mockSpecialists'; // Still need this since it's not in network state yet

export default function ResultsPage() {
  const [requirements, setRequirements] = useState<CareRequirement | null>(null);
  const [intelligence, setIntelligence] = useState<IntelligenceResult | null>(null);
  const [overrides, setOverrides] = useState<WhatIfOverrides>({
    capacityDeltas: {},
    trafficMultiplier: 1.0,
    specialistUnavailability: [],
    disabledHospitals: []
  });
  
  const [showSimulator, setShowSimulator] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedIneligibleHospital, setSelectedIneligibleHospital] = useState<HospitalProfile | null>(null);
  
  // Explanation state for any hospital recommendation (for "Why this option?")
  const [explanationRec, setExplanationRec] = useState<Recommendation | null>(null);

  const [baselinePrimaryId, setBaselinePrimaryId] = useState<string | null>(null);
  const [baselineBackupId, setBaselineBackupId] = useState<string | null>(null);

  // Journey state
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralId = searchParams.get('referralId');
  const { referrals, hospitals, capacity, networkEvents } = useNetworkState();
  const [isJourneyDialogOpen, setIsJourneyDialogOpen] = useState(false);
  const [selectedJourneyRec, setSelectedJourneyRec] = useState<Recommendation | null>(null);
  const [handshakeError, setHandshakeError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(!!referralId);

  // Load requirements on mount
  useEffect(() => {
    if (referralId) {
      // Handle Handshake
      const referral = referrals.find(r => r.id === referralId);
      if (!referral) {
        setHandshakeError("Referral not found. It may have been deleted or does not exist.");
        setIsInitializing(false);
        return;
      }
      
      // Simple Auth Check Mock: user context not available here directly without useAuth, but let's assume it passes
      // Wait, we can check status
      if (referral.status === 'PENDING' || referral.status === 'UNDER_REVIEW') {
        setHandshakeError("Your referral is still under review.");
        setIsInitializing(false);
        return;
      }
      if (referral.status === 'DECLINED') {
        setHandshakeError("Your referral was declined.");
        setIsInitializing(false);
        return;
      }
      if (referral.status === 'CANCELLED') {
        setHandshakeError("Your referral is no longer active.");
        setIsInitializing(false);
        return;
      }
      if (referral.status !== 'ACCEPTED') {
        setHandshakeError("This referral cannot be used to start a journey.");
        setIsInitializing(false);
        return;
      }
      
      if (!referral.careRequirement) {
        setHandshakeError("This referral is missing the care requirements needed to continue with CARE ROUTE.");
        setIsInitializing(false);
        return;
      }
      
      // We have an ACCEPTED referral with requirements
      setRequirements(referral.careRequirement);
      setIsInitializing(false);
      
    } else {
      // Manual Flow
      const reqsStr = localStorage.getItem('careRequirements');
      if (reqsStr) {
        try {
          const raw = JSON.parse(reqsStr);
          
          // Normalize: handle old wizard format vs new CareRequirement format
          const normalized: CareRequirement = {
            careType: raw.careType || 'UNKNOWN',
            urgency: raw.urgency || 'UNKNOWN',
            resources: raw.resources || raw.requiredResources || [],
            specialists: raw.specialists || (raw.specialist ? [raw.specialist] : []),
            location: null,
            radiusKm: raw.radiusKm || raw.searchRadius || raw.maxDistance || 100,
            accessibilityNeeds: raw.accessibilityNeeds || raw.accessibilityRequirements || [],
          };

          // Extract location from various formats
          if (raw.location && typeof raw.location.lat === 'number') {
            normalized.location = { lat: raw.location.lat, lng: raw.location.lng };
          } else if (raw.location?.coords && typeof raw.location.coords.lat === 'number') {
            normalized.location = { lat: raw.location.coords.lat, lng: raw.location.coords.lng };
          }

          // If location is still missing, try localStorage or use default
          if (!normalized.location) {
            try {
              const savedLoc = localStorage.getItem('careRoute_userLocation');
              if (savedLoc) {
                normalized.location = JSON.parse(savedLoc);
              }
            } catch (e) {}
          }
          if (!normalized.location) {
            // Default fallback: Tirupati area
            normalized.location = { lat: 13.6288, lng: 79.4192 };
          }
          
          setRequirements(normalized);
        } catch (e) {
          console.error("Failed to parse requirements", e);
        }
      } else {
        // No requirements saved at all — create a default so the engine still runs
        const defaultReqs: CareRequirement = {
          careType: 'UNKNOWN',
          urgency: 'UNKNOWN',
          resources: [],
          specialists: [],
          location: { lat: 13.6288, lng: 79.4192 },
          radiusKm: 100,
          accessibilityNeeds: [],
        };
        try {
          const savedLoc = localStorage.getItem('careRoute_userLocation');
          if (savedLoc) {
            defaultReqs.location = JSON.parse(savedLoc);
          }
        } catch (e) {}
        setRequirements(defaultReqs);
      }
      setIsInitializing(false);
    }
  }, [referralId, referrals]);

  // Run intelligence engine whenever overrides or requirements change
  useEffect(() => {
    if (requirements) {
      const result = analyzeHealthcareNetwork(
        hospitals, 
        capacity, 
        MOCK_SPECIALISTS, 
        requirements,
        overrides
      );
      setIntelligence(result);

      // Capture baselines on very first successful run (when no disabled hospitals are set)
      if (!baselinePrimaryId && result.recommendedHospital && (!overrides.disabledHospitals || overrides.disabledHospitals.length === 0)) {
        setBaselinePrimaryId(result.recommendedHospital.hospitalId);
        if (result.alternatives.length > 0) {
          setBaselineBackupId(result.alternatives[0].hospitalId);
        }
      }
    }
  }, [requirements, overrides]);

  if (handshakeError) {
    return (
      <div className="min-h-screen bg-[var(--cr-background)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-[var(--cr-border)]">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--cr-deep-text)] mb-2">Referral Handshake Failed</h2>
          <p className="text-[var(--cr-muted)] mb-6 font-medium">{handshakeError}</p>
          <Link href="/page" className="bg-[var(--cr-primary)] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-[var(--cr-primary-hover)] transition-colors inline-flex">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isInitializing || !requirements || !intelligence) {
    return (
      <div className="min-h-screen bg-[var(--cr-background)] flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--cr-primary)] mb-4"></div>
        <p className="text-[var(--cr-deep-text)] font-bold tracking-wide">
          {isInitializing ? "Initializing network intelligence from referral..." : "Loading network intelligence..."}
        </p>
      </div>
    );
  }

  const { recommendedHospital, alternatives, networkSummary, loadIntelligence, explanations } = intelligence;

  let nearestHosp = hospitals[0];
  let minD = 9999;
  if (requirements.location) {
    const { calculateDistance, calculateETA } = require('../../../lib/intelligence/etaService');
    hospitals.forEach(h => {
      if (h.coordinates && requirements.location) {
        const d = calculateDistance(requirements.location, h.coordinates);
        if (d < minD) {
          minD = d;
          nearestHosp = h;
        }
      }
    });
  }

  const nearestData = {
    hospital: nearestHosp,
    distanceKm: parseFloat(minD.toFixed(1)),
    etaMinutes: require('../../../lib/intelligence/etaService').calculateETA(minD)
  };

  return (
    <div className="min-h-screen bg-[var(--cr-background)] text-[var(--cr-deep-text)] pb-24 relative">
      <header className="py-6 px-6 lg:px-12 flex items-center justify-between border-b border-[var(--cr-border)] bg-white sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/find-care" className="p-2 hover:bg-[var(--cr-border)] rounded-full transition-colors group">
            <ArrowLeft size={20} className="text-[var(--cr-primary)] group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-sm font-semibold tracking-widest uppercase text-[var(--cr-muted)]">CARE ROUTE INTELLIGENCE</span>
        </div>
        <button 
          onClick={() => setShowSimulator(!showSimulator)}
          className="text-xs font-bold tracking-[0.1em] text-white bg-[var(--cr-deep-text)] px-4 py-2 rounded uppercase shadow-sm"
        >
          {showSimulator ? 'Close Demo Mode' : 'Demo What-If'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {recommendedHospital ? (
          <div className="space-y-16">
            {!showFullAnalysis ? (
              <CareRouteAnalysisSummary 
                intelligence={intelligence}
                primaryRecommendation={recommendedHospital}
                onViewFullAnalysis={() => setShowFullAnalysis(true)}
                onStartJourney={() => {
                  setSelectedJourneyRec(recommendedHospital);
                  setIsJourneyDialogOpen(true);
                }}
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-16"
              >
                <div className="flex justify-between items-center mb-8 border-b border-[var(--cr-border)] pb-4">
                  <h2 className="text-xl text-[var(--cr-deep-text)] font-light tracking-widest uppercase">Full Analysis</h2>
                  <button onClick={() => setShowFullAnalysis(false)} className="text-sm font-medium text-[var(--cr-primary)] hover:underline flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Summary
                  </button>
                </div>

                <NetworkResilience 
                  recommendations={[recommendedHospital, ...alternatives]} 
                  baselinePrimaryId={baselinePrimaryId || ''}
                  resilienceScore={networkSummary.resilienceScore}
                />

                <div>
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] ml-2">Best Match</h3>
                    <button 
                      onClick={() => setShowExplanation(true)}
                      className="text-xs font-medium text-[var(--cr-primary)] hover:underline flex items-center gap-1"
                    >
                      WHY THIS HOSPITAL?
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={recommendedHospital.hospitalId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <RecommendedHospital recommendation={recommendedHospital} isBestMatch={true} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {intelligence.loadIntelligence[recommendedHospital.hospitalId]?.[recommendedHospital.expectedArrivalCapacity?.resourceName || ''] && (
                  <CapacityTrajectoryTimeline 
                    recommendation={recommendedHospital}
                    loadIntel={intelligence.loadIntelligence[recommendedHospital.hospitalId][recommendedHospital.expectedArrivalCapacity?.resourceName || '']}
                  />
                )}

                <AnimatePresence>
                  {showExplanation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                      <RecommendationExplanation 
                        recommendation={recommendedHospital}
                        requirements={requirements}
                        explanationText={explanations[recommendedHospital.hospitalId]}
                        loadIntel={intelligence.loadIntelligence[recommendedHospital.hospitalId]?.[recommendedHospital.expectedArrivalCapacity?.resourceName || '']}
                        onClose={() => setShowExplanation(false)}
                      />
                    </div>
                  )}
                </AnimatePresence>

                <NearestVsSuitable 
                  nearest={nearestData} 
                  bestMatch={recommendedHospital} 
                  requirements={requirements}
                />

                <CareAccessComparison
                  nearest={nearestData}
                  bestMatch={recommendedHospital}
                />

                <TrustAndDataConfidence 
                  recommendation={recommendedHospital}
                />

                <ExplainabilityCenter 
                  intelligence={intelligence}
                  primaryRecommendation={recommendedHospital}
                  requirements={requirements}
                />

                {alternatives.length > 0 && (
                  <div>
                    <div className="flex justify-between items-end mb-6">
                      <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] ml-2">Alternatives</h3>
                      <button 
                        onClick={() => setShowComparison(!showComparison)}
                        className="text-xs font-bold uppercase tracking-widest text-[var(--cr-primary)] border border-[var(--cr-primary)]/30 hover:bg-[var(--cr-primary)]/10 px-4 py-2 rounded transition-colors"
                      >
                        {showComparison ? 'Hide Comparison' : 'Compare Options'}
                      </button>
                    </div>

                    {showComparison && (
                      <IntelligentHospitalComparison 
                        primary={recommendedHospital}
                        alternatives={alternatives}
                        requirements={requirements}
                        intelligence={intelligence}
                        onWhyThisOption={(rec) => setExplanationRec(rec)}
                        onStartJourney={(rec) => {
                          setSelectedJourneyRec(rec);
                          setIsJourneyDialogOpen(true);
                        }}
                      />
                    )}

                    {!showComparison && (
                      <div className="space-y-4">
                        {alternatives.map(rec => (
                          <motion.div key={rec.hospitalId} layout>
                            <RecommendedHospital recommendation={rec} isBestMatch={false} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {(intelligence.ineligibleHospitals.length > 0 || intelligence.atRiskHospitals.length > 0) && (
                  <div className="pt-8 border-t border-[var(--cr-border)]">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-6 ml-2">Other Hospitals</h3>
                    <div className="space-y-3">
                      {[...intelligence.atRiskHospitals, ...intelligence.ineligibleHospitals].map(h => {
                        const state = intelligence.candidateStates[h.id];
                        let statusColor = 'text-[var(--cr-danger)]';
                        let statusText = 'INELIGIBLE';
                        if (state === 'AT_RISK') {
                          statusColor = 'text-[var(--cr-warning)]';
                          statusText = 'AT RISK';
                        } else if (state === 'STALE_DATA') {
                          statusColor = 'text-[var(--cr-warning)]';
                          statusText = 'DATA MAY BE OUTDATED';
                        }
                        
                        return (
                          <div key={h.id} className="bg-white border border-[var(--cr-border)] rounded-xl p-5 flex items-center justify-between shadow-sm">
                            <div>
                              <h4 className="font-semibold text-[var(--cr-deep-text)] uppercase">{h.name}</h4>
                              <div className={`text-xs font-bold tracking-widest uppercase mt-1 ${statusColor}`}>
                                {statusText}
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedIneligibleHospital(h)}
                              className="text-sm font-medium text-[var(--cr-primary)] hover:underline border border-[var(--cr-border)] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Why not?
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm">
            <h2 className="text-2xl text-[var(--cr-primary)] mb-4 font-light">NO SUITABLE HOSPITAL FOUND</h2>
            <p className="text-[var(--cr-muted)] mb-8">We couldn't find a hospital matching all your strict requirements.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/find-care" className="px-6 py-3 bg-[var(--cr-primary)] text-white rounded-xl font-medium hover:bg-[var(--cr-secondary)] transition-colors">
                Edit Requirements
              </Link>
              <button onClick={() => {
                const updatedReqs = { ...requirements, radiusKm: (requirements.radiusKm || 20) + 20 };
                localStorage.setItem('careRequirements', JSON.stringify(updatedReqs));
                window.location.reload();
              }} className="px-6 py-3 bg-white text-[var(--cr-deep-text)] border border-[var(--cr-border)] rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Expand Search Area
              </button>
              <Link href="/care" className="px-6 py-3 bg-white text-[var(--cr-deep-text)] border border-[var(--cr-border)] rounded-xl font-medium hover:bg-gray-50 transition-colors">
                View Nearby Hospitals
              </Link>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showSimulator && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 w-96 z-50"
          >
            <WhatIfSimulator 
              overrides={overrides} 
              setOverrides={setOverrides}
              cityCareHospital={hospitals.find(h => h.id === 'h-citycare-001')}
              baselinePrimaryId={baselinePrimaryId || undefined}
              baselineBackupId={baselineBackupId || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {explanationRec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <RecommendationExplanation 
              recommendation={explanationRec}
              requirements={requirements}
              explanationText={explanations[explanationRec.hospitalId]}
              loadIntel={intelligence.loadIntelligence[explanationRec.hospitalId]?.[explanationRec.expectedArrivalCapacity?.resourceName || '']}
              onClose={() => setExplanationRec(null)}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIneligibleHospital && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <IneligibleHospitalExplanation
              hospital={selectedIneligibleHospital}
              candidateState={intelligence.candidateStates[selectedIneligibleHospital.id]}
              intelligence={intelligence}
              requirements={requirements}
              onClose={() => setSelectedIneligibleHospital(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {selectedJourneyRec && (
        <StartJourneyDialog 
        isOpen={isJourneyDialogOpen}
        onClose={() => setIsJourneyDialogOpen(false)}
        recommendation={selectedJourneyRec!}
        onJourneyStarted={(id) => {
          setIsJourneyDialogOpen(false);
          router.push(`/care-route/live/${id}`);
        }}
        referralId={referralId || undefined}
      />)}
    </div>
  );
}
