import React from 'react';
import { motion } from 'framer-motion';
import { HospitalProfile } from '../../types/hospital';
import { HospitalCandidateState, IntelligenceResult } from '../../types/intelligence';
import { Check, X, AlertTriangle } from 'lucide-react';
import { CareRequirement } from '../../types/care';

interface IneligibleHospitalExplanationProps {
  hospital: HospitalProfile;
  candidateState: HospitalCandidateState;
  intelligence: IntelligenceResult;
  requirements: CareRequirement;
  onClose: () => void;
}

export default function IneligibleHospitalExplanation({ 
  hospital, 
  candidateState,
  intelligence,
  requirements,
  onClose 
}: IneligibleHospitalExplanationProps) {
  
  const reasons = intelligence.allReasons[hospital.id] || [];
  const diffMs = Date.now() - new Date(hospital.lastUpdate).getTime();
  const secondsAgo = Math.floor(diffMs / 1000);

  // Parse status display
  let statusText = 'INELIGIBLE';
  let statusColor = 'text-[var(--cr-danger)]';
  let statusBg = 'bg-[var(--cr-danger)]/10';

  if (candidateState === 'AT_RISK') {
    statusText = 'AT RISK';
    statusColor = 'text-[var(--cr-warning)]';
    statusBg = 'bg-[var(--cr-warning)]/10';
  } else if (candidateState === 'STALE_DATA') {
    statusText = 'DATA MAY BE OUTDATED';
    statusColor = 'text-[var(--cr-warning)]';
    statusBg = 'bg-[var(--cr-warning)]/10';
  }

  // Find primary concern
  const unmetReasons = reasons.filter(r => !r.met);
  let primaryConcern = '';
  
  if (candidateState === 'AT_RISK') {
    primaryConcern = 'Required resource availability could not be confidently verified.';
  } else if (candidateState === 'STALE_DATA') {
    primaryConcern = 'Availability information may have changed.';
  } else if (unmetReasons.length > 0) {
    // Priority sorting: Resource > Specialist > Operational > Accessibility > Capacity > Others
    // Since checkEligibility adds reasons in order, the first unmet is usually the most critical blocker
    // We will just pick the first unmet reason
    primaryConcern = unmetReasons[0].description;
  } else {
    primaryConcern = 'Did not meet all required criteria.';
  }

  // Determine capacity to show (we can try to grab it from requirements)
  let capacityToShow = 'Unknown';
  const coreResource = requirements.resources.find(r => ['icu', 'ventilator', 'general beds'].includes(r.toLowerCase()));
  if (coreResource) {
    // We can extract this directly from the mock capacity or load intelligence if it ran
    const intelObj = intelligence.loadIntelligence[hospital.id];
    if (intelObj) {
      // Find the resource match ignoring case
      const resKey = Object.keys(intelObj).find(k => k.toLowerCase() === coreResource.toLowerCase());
      if (resKey) {
        const intel = intelObj[resKey];
        if (intel && intel.historicalData.length > 0) {
          const current = intel.historicalData[intel.historicalData.length - 1].expectedAvailable;
          capacityToShow = `${current} available`;
        }
      }
    }
    
    // If we didn't find it via intelObj (e.g. ineligible early), just look for the reason that says "Required ICU capacity unavailable"
    if (capacityToShow === 'Unknown') {
      capacityToShow = '0 available'; // Default fallback if unavailable
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-[var(--cr-border)] overflow-y-auto z-50 flex flex-col"
    >
      <div className="bg-[var(--cr-background)] p-6 border-b border-[var(--cr-border)] flex justify-between items-start sticky top-0 z-10">
        <h2 className="text-sm font-bold tracking-[0.1em] text-[var(--cr-deep-text)] uppercase leading-snug">
          WHY NOT <br/><span className="text-xl text-[var(--cr-primary)]">{hospital.name}?</span>
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-[var(--cr-border)] rounded-full transition-colors text-[var(--cr-muted)]">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-10 flex-grow">
        
        {/* STATUS BAR */}
        <div className={`p-4 rounded-lg flex items-center gap-3 ${statusBg}`}>
          <AlertTriangle size={18} className={statusColor} />
          <span className={`font-bold tracking-widest text-xs uppercase ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* PRIMARY CONCERN */}
        <section>
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-3 uppercase">
            Primary Concern
          </h3>
          <p className="text-[var(--cr-deep-text)] font-medium text-sm leading-relaxed">
            {primaryConcern}
          </p>
        </section>

        {/* ADDITIONAL REASONS */}
        {reasons.length > 0 && (
          <section>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
              Additional Details
            </h3>
            <div className="space-y-3">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-[var(--cr-deep-text)]">
                  {r.met ? (
                    <Check size={16} className="text-[var(--cr-success)] shrink-0 mt-0.5" />
                  ) : (
                    <X size={16} className="text-[var(--cr-danger)] shrink-0 mt-0.5" />
                  )}
                  <span className={r.met ? 'font-medium' : 'text-[var(--cr-danger)]'}>{r.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CAPACITY */}
        {coreResource && (
          <section>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--cr-muted)] mb-4 uppercase">
              Capacity ({coreResource})
            </h3>
            <div className="bg-white border border-[var(--cr-border)] rounded-lg p-4 text-sm font-medium text-[var(--cr-deep-text)]">
              {capacityToShow}
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
              <span className="text-[var(--cr-muted)] w-20">Updated:</span>
              <span className="font-medium text-[var(--cr-deep-text)]">{secondsAgo < 60 ? `${secondsAgo} seconds ago` : `${Math.floor(secondsAgo/60)} minutes ago`}</span>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}
