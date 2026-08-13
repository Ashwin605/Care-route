import React from 'react';
import { Recommendation } from '../../types/recommendation';
import { DataFreshnessState, DataFreshnessThresholds, ForecastConfidence, getFreshnessState } from '../../types/intelligence';
import { ShieldCheck, Clock, AlertTriangle, Info } from 'lucide-react';

interface TrustAndDataConfidenceProps {
  recommendation: Recommendation;
}

export default function TrustAndDataConfidence({ recommendation }: TrustAndDataConfidenceProps) {
  const { hospital, totalTimeToCare } = recommendation;
  
  // Calculate Freshness
  const { state: freshnessState, secondsAgo } = getFreshnessState(hospital.lastUpdate);
  
  let freshnessColor = 'text-[var(--cr-muted)]';
  let freshnessBg = 'bg-gray-100';
  let freshnessIcon = <Clock size={16} />;
  
  if (freshnessState === 'FRESH') {
    freshnessColor = 'text-[var(--cr-success)]';
    freshnessBg = 'bg-[var(--cr-success)]/10';
  } else if (freshnessState === 'RECENT') {
    freshnessColor = 'text-[var(--cr-deep-text)]';
    freshnessBg = 'bg-gray-100';
  } else if (freshnessState === 'STALE') {
    freshnessColor = 'text-[var(--cr-warning)]';
    freshnessBg = 'bg-[var(--cr-warning)]/10';
    freshnessIcon = <AlertTriangle size={16} />;
  }

  // Calculate Confidence
  const confidence: ForecastConfidence = totalTimeToCare?.confidence || 'MEDIUM';
  let confidenceColor = 'text-[var(--cr-warning)]';
  let confidenceBg = 'bg-[var(--cr-warning)]/10';
  
  if (confidence === 'HIGH') {
    confidenceColor = 'text-[var(--cr-success)]';
    confidenceBg = 'bg-[var(--cr-success)]/10';
  } else if (confidence === 'LOW') {
    confidenceColor = 'text-[var(--cr-danger)]';
    confidenceBg = 'bg-[var(--cr-danger)]/10';
  }

  let confidenceExplanation = '';
  if (confidence === 'HIGH') {
    confidenceExplanation = 'Capacity observations are recent and the current trend is stable.';
  } else if (confidence === 'MEDIUM') {
    confidenceExplanation = 'Standard variance is expected during the estimated travel time.';
  } else if (confidence === 'LOW') {
    confidenceExplanation = 'Significant volatility or stale data reduces forecast reliability.';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      
      {/* Forecast Confidence Card */}
      <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-[var(--cr-muted)]">
          <ShieldCheck size={18} />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Forecast Confidence</h3>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded text-sm font-bold tracking-widest uppercase ${confidenceBg} ${confidenceColor}`}>
              {confidence}
            </span>
          </div>
          {confidenceExplanation && (
            <p className="text-sm text-[var(--cr-deep-text)] font-medium leading-relaxed">
              {confidenceExplanation}
            </p>
          )}
        </div>
      </div>

      {/* Data Freshness Card */}
      <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-[var(--cr-muted)]">
          <Clock size={18} />
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Data Freshness</h3>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded flex items-center gap-1.5 text-sm font-bold tracking-widest uppercase ${freshnessBg} ${freshnessColor}`}>
              {freshnessIcon}
              {freshnessState}
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-[var(--cr-deep-text)] font-medium">
              {freshnessState === 'UNKNOWN' ? 'Last updated time unknown.' : (
                `Updated ${secondsAgo < 60 ? `${secondsAgo} seconds` : `${Math.floor(secondsAgo/60)} minutes`} ago.`
              )}
            </p>
            
            {freshnessState === 'STALE' && (
              <p className="text-sm text-[var(--cr-warning)] font-medium flex items-center gap-1.5 bg-[var(--cr-warning)]/5 p-2 rounded">
                <Info size={14} /> Capacity information may have changed.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
