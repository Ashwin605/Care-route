import React from 'react';
import { IntelligenceResult } from '../../types/intelligence';
import { Recommendation } from '../../types/recommendation';
import { Check, ChevronRight, Navigation } from 'lucide-react';

interface Props {
  intelligence: IntelligenceResult;
  primaryRecommendation: Recommendation;
  onViewFullAnalysis: () => void;
  onStartJourney: () => void;
}

export default function CareRouteAnalysisSummary({
  intelligence,
  primaryRecommendation,
  onViewFullAnalysis,
  onStartJourney
}: Props) {
  const { networkSummary } = intelligence;
  const { hospital, matchScore, distanceKm, etaMinutes, totalTimeToCare, reasons } = primaryRecommendation;

  // Filter for reasons that are met for the "WHY THIS HOSPITAL?" section
  const metReasons = reasons.filter(r => r.met);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-[var(--cr-border)] overflow-hidden shadow-sm">
      
      {/* Network Stats Section */}
      <div className="p-8 md:p-10 text-center flex flex-col items-center">
        <h2 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--cr-muted)] mb-8">
          Care Route Analysis
        </h2>
        
        <div className="flex flex-col gap-2 items-center text-[var(--cr-deep-text)] font-medium mb-2">
          <div className="text-xl md:text-2xl font-light">
            {networkSummary.totalHospitals} <span className="text-[var(--cr-muted)]">hospitals analyzed</span>
          </div>
          <div className="text-xl md:text-2xl font-light">
            {networkSummary.capacityMatched} <span className="text-[var(--cr-muted)]">suitable</span>
          </div>
          <div className="text-xl md:text-2xl font-light">
            {networkSummary.highConfidenceMatches} <span className="text-[var(--cr-muted)]">high-confidence</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[var(--cr-border)]"></div>

      {/* Primary Recommendation Section */}
      <div className="p-8 md:p-10 flex flex-col items-center text-center">
        <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--cr-primary)] mb-6">
          Recommended For You
        </h3>
        
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--cr-deep-text)] mb-8 uppercase">
          {hospital.name}
        </h1>
        
        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-md mb-10 text-[var(--cr-deep-text)]">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-light text-[var(--cr-primary)]">{matchScore}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mt-1">Match</span>
          </div>
          <div className="flex flex-col items-center border-l border-[var(--cr-border)]">
            <span className="text-2xl font-light">{distanceKm}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mt-1">km</span>
          </div>
          <div className="flex flex-col items-center border-l border-[var(--cr-border)]">
            <span className="text-2xl font-light">{etaMinutes}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mt-1">min</span>
          </div>
        </div>

        {/* Total Time & Confidence */}
        <div className="flex flex-col gap-6 w-full max-w-xs mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Estimated Total Time to Care</span>
            <span className="text-xl font-medium text-[var(--cr-deep-text)]">
              {totalTimeToCare?.totalEstimatedMinutes || '--'} min
            </span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Forecast Confidence</span>
            <span className={`text-xl font-medium tracking-wide ${
              totalTimeToCare?.confidence === 'HIGH' ? 'text-[var(--cr-success)]' 
              : totalTimeToCare?.confidence === 'MEDIUM' ? 'text-[var(--cr-warning)]'
              : 'text-[var(--cr-critical)]'
            }`}>
              {totalTimeToCare?.confidence || 'UNKNOWN'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[var(--cr-border)]"></div>

      {/* Why This Hospital & CTA Section */}
      <div className="bg-[var(--cr-background)] p-8 md:p-10 flex flex-col items-center">
        <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--cr-muted)] mb-6 text-center">
          Why This Hospital?
        </h3>
        
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto mb-10">
          {metReasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check size={16} className="text-[var(--cr-primary)] mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-[var(--cr-deep-text)] leading-tight">
                {reason.description}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button 
            onClick={onStartJourney}
            className="group flex items-center justify-center gap-2 w-full py-4 bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-[var(--cr-primary)]/30"
          >
            <Navigation size={18} />
            Start CARE ROUTE
          </button>
          
          <button 
            onClick={onViewFullAnalysis}
            className="group flex items-center justify-center gap-2 w-full py-4 border border-[var(--cr-border)] hover:border-[var(--cr-primary)] hover:text-[var(--cr-primary)] text-[var(--cr-deep-text)] rounded-xl font-medium transition-all bg-white"
          >
            View Full Analysis
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}
