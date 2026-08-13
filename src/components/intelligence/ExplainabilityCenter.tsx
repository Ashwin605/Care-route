import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligenceResult } from '../../types/intelligence';
import { Recommendation } from '../../types/recommendation';
import { CareRequirement } from '../../types/care';
import { ChevronDown, ChevronUp, BrainCircuit, Check, Activity, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface ExplainabilityCenterProps {
  intelligence: IntelligenceResult;
  primaryRecommendation: Recommendation;
  requirements: CareRequirement;
}

export default function ExplainabilityCenter({ intelligence, primaryRecommendation, requirements }: ExplainabilityCenterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'SIMPLE' | 'ADVANCED'>('SIMPLE');

  const { networkSummary, decisionTrace, explanations } = intelligence;
  const { hospital } = primaryRecommendation;
  
  const metReasons = primaryRecommendation.reasons.filter(r => r.met);
  const unmetReasons = primaryRecommendation.reasons.filter(r => !r.met);

  const pipelineSteps = [
    { label: 'CareRequirement', value: requirements.careType || 'General Care', active: true },
    { label: 'Nearby Hospitals', value: `${intelligence.nearbyHospitals?.length || networkSummary.totalHospitals} in regional network`, active: true },
    { label: 'Eligibility', value: 'Geospatial & basic screening', active: true },
    { label: 'Specialist Match', value: `${networkSummary.specialtyMatched} facilities compatible`, active: true },
    { label: 'Resource Match', value: `${networkSummary.resourceMatched} facilities equipped`, active: true },
    { label: 'Accessibility Match', value: 'Accessibility requirements validated', active: true },
    { label: 'Operational Status', value: hospital.networkStatus, active: true },
    { label: 'Current Capacity', value: 'Live availability verified', active: true },
    { label: 'ETA', value: `${primaryRecommendation.etaMinutes} min travel calculated`, active: true },
    { label: 'Arrival-Time Forecast', value: 'Capacity forecasted at arrival', active: true },
    { label: 'Total Time to Care', value: `${primaryRecommendation.totalTimeToCare?.totalEstimatedMinutes || '--'} min optimal path`, active: true },
    { label: 'Match Score', value: `Score: ${primaryRecommendation.matchScore}`, active: true },
    { label: 'Ranking', value: 'Highest suitable candidate selected', active: true },
    { label: 'Recommendation', value: hospital.name, active: true },
    { label: 'Alternatives', value: `${intelligence.alternatives?.length || 0} secondary options available`, active: true },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm overflow-hidden mb-12">
      {/* Header / Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] rounded-lg">
            <BrainCircuit size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold tracking-[0.1em] text-[var(--cr-deep-text)] uppercase">
              How Care Route Decided
            </h3>
            <p className="text-xs text-[var(--cr-muted)] mt-0.5">
              Transparency layer & intelligence breakdown
            </p>
          </div>
        </div>
        <div className="text-[var(--cr-muted)]">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--cr-border)]"
          >
            {/* View Toggle */}
            <div className="bg-[var(--cr-background)] p-4 flex justify-center border-b border-[var(--cr-border)]">
              <div className="inline-flex bg-white border border-[var(--cr-border)] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('SIMPLE')}
                  className={`px-6 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all ${
                    viewMode === 'SIMPLE' 
                      ? 'bg-[var(--cr-primary)] text-white shadow-sm' 
                      : 'text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)]'
                  }`}
                >
                  Simple Summary
                </button>
                <button
                  onClick={() => setViewMode('ADVANCED')}
                  className={`px-6 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all ${
                    viewMode === 'ADVANCED' 
                      ? 'bg-[var(--cr-primary)] text-white shadow-sm' 
                      : 'text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)]'
                  }`}
                >
                  Advanced Details
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {viewMode === 'SIMPLE' ? (
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Left: Pipeline */}
                  <div>
                    <h4 className="text-xs font-bold tracking-[0.1em] text-[var(--cr-muted)] uppercase mb-6">
                      Intelligence Pipeline
                    </h4>
                    <div className="relative pl-4 border-l border-[var(--cr-border)] space-y-6">
                      {pipelineSteps.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[var(--cr-primary)] shadow-[0_0_0_4px_white]" />
                          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--cr-primary)]">
                            {step.label}
                          </div>
                          <div className="text-sm font-medium text-[var(--cr-deep-text)]">
                            {step.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Summary & Explanations */}
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-xs font-bold tracking-[0.1em] text-[var(--cr-muted)] uppercase mb-6">
                        Network Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                          <span className="text-[var(--cr-muted)]">Hospitals analyzed</span>
                          <span className="font-semibold text-[var(--cr-deep-text)]">{networkSummary.totalHospitals}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                          <span className="text-[var(--cr-muted)]">Specialty-compatible</span>
                          <span className="font-semibold text-[var(--cr-deep-text)]">{networkSummary.specialtyMatched}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                          <span className="text-[var(--cr-muted)]">Resource-compatible</span>
                          <span className="font-semibold text-[var(--cr-deep-text)]">{networkSummary.resourceMatched}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                          <span className="text-[var(--cr-muted)]">Suitable at arrival</span>
                          <span className="font-semibold text-[var(--cr-deep-text)]">{networkSummary.capacityMatched}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                          <span className="text-[var(--cr-muted)]">High-confidence candidates</span>
                          <span className="font-semibold text-[var(--cr-deep-text)]">{networkSummary.highConfidenceMatches}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold tracking-[0.1em] text-[var(--cr-muted)] uppercase mb-6">
                        Decision Factors
                      </h4>
                      <div className="bg-[var(--cr-background)] p-4 rounded-xl border border-[var(--cr-border)] mb-4">
                        <p className="text-sm text-[var(--cr-deep-text)] font-medium leading-relaxed">
                          {explanations[hospital.id]}
                        </p>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        {metReasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-[var(--cr-deep-text)]">
                            <Check size={16} className="text-[var(--cr-success)] shrink-0 mt-0.5" />
                            <span>{r.description}</span>
                          </div>
                        ))}
                        {unmetReasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-[var(--cr-deep-text)]">
                            <X size={16} className="text-[var(--cr-danger)] shrink-0 mt-0.5" />
                            <span>{r.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="flex items-center justify-between border-b border-[var(--cr-border)] pb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className="text-[var(--cr-secondary)]" />
                      <h4 className="text-sm font-bold tracking-[0.1em] text-[var(--cr-deep-text)] uppercase">
                        Technical Telemetry
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-[var(--cr-muted)] uppercase bg-[var(--cr-background)] px-2 py-1 rounded">
                      PROTOTYPE DECISION MODEL
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[var(--cr-background)] rounded-xl p-5 border border-[var(--cr-border)]">
                      <h5 className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-4">Ranking Weights</h5>
                      <ul className="space-y-3 text-sm font-medium text-[var(--cr-deep-text)]">
                        <li className="flex justify-between"><span>Base Match</span> <span>100</span></li>
                        <li className="flex justify-between"><span>Distance Penalty</span> <span>-0.5/km</span></li>
                        <li className="flex justify-between"><span>Risk Penalty</span> <span>-40</span></li>
                        <li className="flex justify-between"><span>Total Time Penalty</span> <span>-0.5/min</span></li>
                        <li className="flex justify-between text-[var(--cr-warning)]"><span>Low Confidence</span> <span>-15</span></li>
                      </ul>
                    </div>

                    <div className="bg-[var(--cr-background)] rounded-xl p-5 border border-[var(--cr-border)]">
                      <h5 className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-4">Data Integrity</h5>
                      <ul className="space-y-3 text-sm font-medium text-[var(--cr-deep-text)]">
                        <li className="flex justify-between"><span>Last Sync</span> <span>{new Date(networkSummary.lastUpdated).toLocaleTimeString()}</span></li>
                        <li className="flex justify-between"><span>Confidence</span> <span className="text-[var(--cr-success)]">{hospital.dataConfidence}</span></li>
                        <li className="flex justify-between"><span>Override State</span> <span>Active</span></li>
                      </ul>
                    </div>

                    <div className="bg-[var(--cr-background)] rounded-xl p-5 border border-[var(--cr-border)]">
                      <h5 className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-4">Forecast Model</h5>
                      <ul className="space-y-3 text-sm font-medium text-[var(--cr-deep-text)]">
                        <li className="flex justify-between"><span>Traffic Multiplier</span> <span>Simulated</span></li>
                        <li className="flex justify-between"><span>Capacity Algorithm</span> <span>Deterministic</span></li>
                        <li className="flex justify-between"><span>Resilience Index</span> <span>{networkSummary.resilienceScore}</span></li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold tracking-[0.1em] text-[var(--cr-muted)] uppercase mb-6">
                      System Decision Trace
                    </h4>
                    <div className="bg-[var(--cr-background)] rounded-xl border border-[var(--cr-border)] p-6">
                      <div className="relative pl-3">
                        <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-[var(--cr-border)]" />
                        <div className="space-y-4">
                          {decisionTrace.map((event, i) => (
                            <div key={i} className="relative flex items-start gap-4">
                              <div className="relative z-10 w-2 h-2 mt-1.5 rounded-full bg-white border-2 border-[var(--cr-primary)] shadow-[0_0_0_4px_var(--cr-background)]" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold tracking-wider text-[var(--cr-muted)]">{event.timestamp}</span>
                                <span className="text-sm font-medium text-[var(--cr-deep-text)]">{event.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
