import React from 'react';
import { HospitalLoadIntelligence } from '../../types/intelligence';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import CapacityPressure from './CapacityPressure';

interface HospitalLoadTrendProps {
  resourceName: string;
  currentAvailable: number;
  total: number;
  status?: string;
  loadIntel?: HospitalLoadIntelligence;
}

export default function HospitalLoadTrend({ resourceName, currentAvailable, total, status, loadIntel }: HospitalLoadTrendProps) {
  // Extract trend direction from historical data if available
  let trendIcon = <Minus size={14} className="text-[var(--cr-muted)]" />;
  if (loadIntel && loadIntel.historicalData.length > 0) {
    const isDeclining = loadIntel.historicalData.some(p => p.trend === 'DECLINING');
    if (isDeclining) {
      trendIcon = <TrendingDown size={14} className="text-[var(--cr-warning)]" />;
    } else {
      trendIcon = <Minus size={14} className="text-[var(--cr-success)]" />;
    }
  }

  return (
    <div className="p-4 bg-[var(--cr-background)] rounded-xl border border-[var(--cr-border)] hover:border-[var(--cr-muted)]/50 transition-all flex flex-col justify-between h-full overflow-hidden shadow-none">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--cr-muted)] truncate" title={resourceName}>
            {resourceName}
          </span>
          {loadIntel && (
            <CapacityPressure pressure={loadIntel.pressure} size="sm" className="shrink-0" />
          )}
        </div>

        {total > 0 ? (
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-2 gap-2">
              <span className={`text-2xl font-light ${currentAvailable > 0 ? 'text-[var(--cr-deep-text)]' : 'text-[var(--cr-critical)]'}`}>
                {currentAvailable} <span className="text-xs font-medium text-[var(--cr-muted)]">available</span>
              </span>
              <span className="text-xs font-medium text-[var(--cr-muted)] whitespace-nowrap">
                {total - currentAvailable} / {total} occupied
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-200/80 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  loadIntel?.pressure === 'CRITICAL' ? 'bg-[var(--cr-critical)]' :
                  loadIntel?.pressure === 'HIGH' ? 'bg-[var(--cr-warning)]' :
                  currentAvailable > 0 ? 'bg-[var(--cr-primary)]' : 'bg-[var(--cr-critical)]'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, ((total - currentAvailable) / total) * 100))}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4 py-2 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--cr-success)] animate-pulse" />
              <span className={`text-base font-semibold ${status === 'AVAILABLE' ? 'text-[var(--cr-success)]' : 'text-[var(--cr-critical)]'}`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-[var(--cr-muted)] mt-1">Operational & on standby</p>
          </div>
        )}
      </div>

      {loadIntel && (
        <div className="pt-3 border-t border-[var(--cr-border)] flex items-center justify-between gap-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-[var(--cr-muted)] text-[11px] shrink-0">Trend:</span>
          <div className="inline-flex items-center gap-1.5 bg-white px-2 py-1 rounded text-xs font-medium text-[var(--cr-deep-text)] shadow-sm border border-[var(--cr-border)]/60 min-w-0">
            <span className="shrink-0">{trendIcon}</span>
            <span className="truncate text-xs" title={loadIntel.trendDescription}>
              {loadIntel.trendDescription}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
