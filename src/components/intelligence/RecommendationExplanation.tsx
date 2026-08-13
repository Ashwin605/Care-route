import React from 'react';
import { motion } from 'framer-motion';
import { Recommendation } from '../../types/recommendation';
import { CareRequirement } from '../../types/care';
import { Check, X, AlertTriangle } from 'lucide-react';
import { HospitalLoadIntelligence } from '../../types/intelligence';

interface RecommendationExplanationProps {
  recommendation: Recommendation;
  requirements: CareRequirement;
  explanationText: string;
  loadIntel?: HospitalLoadIntelligence;
  onClose: () => void;
}

export default function RecommendationExplanation({ 
  recommendation, 
  requirements, 
  loadIntel,
  onClose 
}: RecommendationExplanationProps) {
  const { hospital, expectedArrivalCapacity, reasons, totalTimeToCare } = recommendation;
  
  const diffMs = Date.now() - new Date(hospital.lastUpdate).getTime();
  const secondsAgo = Math.floor(diffMs / 1000);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-[var(--cr-border)] overflow-y-auto z-50 flex flex-col"
    >
      <div className="bg-[var(--cr-background)] p-6 border-b border-[var(--cr-border)] flex justify-between items-start sticky top-0 z-10">
        <h2 className="text-sm font-bold tracking-[0.1em] text-[var(--cr-deep-text)] uppercase leading-snug">
          WHY CARE ROUTE RECOMMENDS <br/><span className="text-xl text-[var(--cr-primary)]">{hospital.name}</span>
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-[var(--cr-border)] rounded-full transition-colors text-[var(--cr-muted)]">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-10 flex-grow">
        
        {/* PRIMARY CONCLUSION */}
        <div className="bg-[var(--cr-background)] border-l-4 border-[var(--cr-primary)] p-4 rounded-r-lg">
          <p className="text-[var(--cr-deep-text)] font-medium text-sm leading-relaxed">
            {hospital.name} currently provides the strongest overall match for the requirements you selected.
          </p>
        </div>

        {/* CARE REQUIREMENT MATCH */}
        <section>
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
            Care Requirement Match
          </h3>
          <div className="space-y-3">
            {requirements.specialist && requirements.specialist !== 'UNKNOWN' && (
              <div className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                <span className="text-[var(--cr-deep-text)] font-medium">{requirements.specialist}</span>
                <span className="flex items-center gap-1 text-[var(--cr-success)] text-xs font-bold uppercase"><Check size={14}/> Available</span>
              </div>
            )}
            {requirements.resources.map(r => (
              <div key={r} className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                <span className="text-[var(--cr-deep-text)] font-medium">{r}</span>
                <span className="flex items-center gap-1 text-[var(--cr-success)] text-xs font-bold uppercase"><Check size={14}/> Available</span>
              </div>
            ))}
            {requirements.accessibilityNeeds?.map(a => (
              <div key={a} className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2">
                <span className="text-[var(--cr-deep-text)] font-medium">{a}</span>
                <span className="flex items-center gap-1 text-[var(--cr-success)] text-xs font-bold uppercase"><Check size={14}/> Available</span>
              </div>
            ))}
            {!requirements.specialist && requirements.resources.length === 0 && (
               <div className="text-sm text-[var(--cr-muted)] italic">General care requirements met.</div>
            )}
          </div>
        </section>

        {/* CAPACITY */}
        {expectedArrivalCapacity && (
          <section>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
              Capacity
            </h3>
            <div className="bg-white border border-[var(--cr-border)] rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--cr-muted)]">Current:</span>
                <span className="font-medium text-[var(--cr-deep-text)]">{expectedArrivalCapacity.currentAvailable} {expectedArrivalCapacity.resourceName} beds available</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--cr-muted)]">Arrival forecast:</span>
                <span className="font-medium text-[var(--cr-primary)]">{expectedArrivalCapacity.expectedAvailable} {expectedArrivalCapacity.resourceName} beds expected</span>
              </div>
              {loadIntel && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--cr-muted)]">Trend:</span>
                  <span className="font-medium text-[var(--cr-deep-text)] uppercase">{loadIntel.trendDescription.split(' ')[0] || 'STABLE'}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ETA */}
        <section>
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
            ETA
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--cr-background)] p-4 rounded-lg">
              <span className="block text-[10px] uppercase text-[var(--cr-muted)] mb-1">Distance</span>
              <span className="text-xl font-medium text-[var(--cr-deep-text)]">{recommendation.distanceKm} km</span>
            </div>
            <div className="bg-[var(--cr-background)] p-4 rounded-lg">
              <span className="block text-[10px] uppercase text-[var(--cr-muted)] mb-1">ETA</span>
              <span className="text-xl font-medium text-[var(--cr-primary)]">{recommendation.etaMinutes} minutes</span>
            </div>
          </div>
        </section>

        {/* TOTAL TIME TO CARE */}
        {totalTimeToCare && (
          <section>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
              Total Time To Care
            </h3>
            <div className="border border-[var(--cr-border)] rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[var(--cr-muted)] text-sm">Estimated:</span>
                <span className="text-xl font-medium text-[var(--cr-deep-text)]">{totalTimeToCare.totalEstimatedMinutes} minutes</span>
              </div>
              <div className="text-xs text-[var(--cr-muted)] pt-3 border-t border-[var(--cr-border)]">
                Breakdown: <span className="font-medium">{totalTimeToCare.travelMinutes} min travel</span> + <span className="font-medium">{totalTimeToCare.estimatedIntakeMinutes} min expected intake</span>
              </div>
            </div>
          </section>
        )}

        {/* DATA QUALITY */}
        <section>
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
            Data Quality
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[var(--cr-muted)] w-20">Capacity:</span>
              <span className="font-medium text-[var(--cr-deep-text)]">Updated {secondsAgo < 60 ? `${secondsAgo} seconds ago` : `${Math.floor(secondsAgo/60)} minutes ago`}</span>
            </div>
            {totalTimeToCare && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--cr-muted)] w-20">Forecast:</span>
                <span className={`font-bold tracking-wider text-xs uppercase ${totalTimeToCare.confidence === 'HIGH' ? 'text-[var(--cr-success)]' : 'text-[var(--cr-warning)]'}`}>
                  {totalTimeToCare.confidence} confidence
                </span>
              </div>
            )}
          </div>
        </section>

        {/* REASONS */}
        <section className="pb-8">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
            Reasons
          </h3>
          <div className="space-y-3">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-[var(--cr-deep-text)]">
                {r.met ? (
                  <Check size={16} className="text-[var(--cr-success)] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={16} className="text-[var(--cr-warning)] shrink-0 mt-0.5" />
                )}
                <span className={r.met ? 'font-medium' : 'text-[var(--cr-muted)]'}>{r.description}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
