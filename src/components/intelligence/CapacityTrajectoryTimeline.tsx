import React from 'react';
import { HospitalLoadIntelligence } from '../../types/intelligence';
import { Recommendation } from '../../types/recommendation';
import { AlertCircle, Clock } from 'lucide-react';

interface CapacityTrajectoryTimelineProps {
  recommendation: Recommendation;
  loadIntel: HospitalLoadIntelligence;
}

export default function CapacityTrajectoryTimeline({ recommendation, loadIntel }: CapacityTrajectoryTimelineProps) {
  const { hospital, expectedArrivalCapacity, totalTimeToCare } = recommendation;
  
  if (!expectedArrivalCapacity) return null;

  const diffMs = Date.now() - new Date(hospital.lastUpdate).getTime();
  const secondsAgo = Math.floor(diffMs / 1000);
  const isStale = secondsAgo > 300; // 5 minutes

  // Combine NOW and future forecast points for the timeline
  const nowPoint = loadIntel.historicalData[loadIntel.historicalData.length - 1];
  const allPoints = nowPoint ? [nowPoint, ...loadIntel.forecastData] : loadIntel.forecastData;

  // Arrival marker text
  const arrivalMinutes = recommendation.etaMinutes;
  
  // Parse trend string (e.g. 'STABLE', 'INCREASING', 'DECLINING', 'HIGH PRESSURE', 'CRITICAL')
  let trendColor = 'text-[var(--cr-deep-text)]';
  const trendUpper = loadIntel.trendDescription.toUpperCase();
  if (trendUpper.includes('DECLIN') || trendUpper.includes('CRITICAL')) trendColor = 'text-[var(--cr-danger)]';
  if (trendUpper.includes('INCREAS') || trendUpper.includes('STABLE')) trendColor = 'text-[var(--cr-success)]';

  let confidenceColor = 'text-[var(--cr-success)]';
  const conf = totalTimeToCare?.confidence || 'MEDIUM';
  if (conf === 'MEDIUM') confidenceColor = 'text-[var(--cr-warning)]';
  if (conf === 'LOW') confidenceColor = 'text-[var(--cr-danger)]';

  return (
    <div className="bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm overflow-hidden mb-12">
      <div className="p-6 border-b border-[var(--cr-border)] flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)]">
            Capacity Trajectory
          </h3>
          <h2 className="text-xl font-medium text-[var(--cr-deep-text)] uppercase mt-1">
            {expectedArrivalCapacity.resourceName} Capacity
          </h2>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] px-2 py-1 rounded">
            Expected Arrival
          </div>
          <div className="text-2xl font-bold text-[var(--cr-primary)] mt-2">
            {arrivalMinutes} MIN
          </div>
        </div>
      </div>

      <div className="p-6">
        
        {/* Horizontal Timeline */}
        <div className="relative w-full overflow-x-auto pb-6 custom-scrollbar">
          <div className="flex min-w-max gap-12 px-4 items-end h-32 relative pt-8">
            
            {/* Connecting line */}
            <div className="absolute top-[68%] left-0 w-full h-px bg-[var(--cr-border)] -z-10" />

            {allPoints.map((point, idx) => {
              const isArrival = point.timeLabel.includes('ARRIVAL') || point.timeLabel.includes(arrivalMinutes.toString());
              const isZero = point.expectedAvailable <= 0;
              
              return (
                <div key={idx} className="relative flex flex-col items-center justify-between h-full min-w-[80px]">
                  
                  {/* Value */}
                  <div className={`text-center mb-6`}>
                    <span className={`text-xl font-bold block ${isArrival ? (isZero ? 'text-[var(--cr-danger)]' : 'text-[var(--cr-primary)]') : 'text-[var(--cr-deep-text)]'}`}>
                      {point.expectedAvailable}
                    </span>
                    <span className="text-[10px] uppercase text-[var(--cr-muted)] font-medium">available</span>
                  </div>
                  
                  {/* Node */}
                  <div className={`w-4 h-4 rounded-full border-4 z-10 
                    ${isArrival 
                      ? (isZero ? 'border-[var(--cr-danger)] bg-white' : 'border-[var(--cr-primary)] bg-[var(--cr-primary)]') 
                      : (point.timeLabel === 'NOW' ? 'border-[var(--cr-deep-text)] bg-white' : 'border-[var(--cr-muted)] bg-white')
                    }`} 
                  />
                  
                  {/* Label */}
                  <div className={`mt-4 text-[10px] font-bold tracking-wider whitespace-nowrap 
                    ${isArrival ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-muted)]'}
                  `}>
                    {point.timeLabel.replace('m', ' MIN').replace('+', '+ ')}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Accessibility Text Summary */}
        <div className="mt-4 bg-[var(--cr-background)] p-4 rounded-lg text-sm text-[var(--cr-deep-text)] border border-[var(--cr-border)]/50">
          <span className="sr-only">Chart Summary: </span>
          {expectedArrivalCapacity.resourceName} capacity is currently {nowPoint?.expectedAvailable || 'Unknown'} available and is expected to be {expectedArrivalCapacity.expectedAvailable} available when you arrive.
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-[var(--cr-border)]">
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-2">Trend</span>
            <span className={`font-medium tracking-wide uppercase ${trendColor}`}>
              {loadIntel.pressure === 'CRITICAL' ? 'CRITICAL' : loadIntel.trendDescription.split(' ')[0]}
            </span>
          </div>
          
          <div className="flex flex-col border-l-0 md:border-l border-[var(--cr-border)] md:pl-6">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-2">Confidence</span>
            <span className={`font-medium tracking-wide uppercase ${confidenceColor}`}>
              {conf}
            </span>
          </div>
          
          <div className="flex flex-col border-l-0 md:border-l border-[var(--cr-border)] md:pl-6">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-2">Data Freshness</span>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[var(--cr-muted)]" />
              <span className="text-sm font-medium text-[var(--cr-deep-text)]">
                Capacity updated {secondsAgo < 60 ? `${secondsAgo} seconds ago` : `${Math.floor(secondsAgo/60)} minutes ago`}
              </span>
            </div>
            {isStale && (
              <div className="flex items-center gap-1 mt-1 text-xs text-[var(--cr-warning)]">
                <AlertCircle size={12} /> Capacity information may have changed.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
