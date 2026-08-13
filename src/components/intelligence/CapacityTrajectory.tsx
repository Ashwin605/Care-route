import React from 'react';
import { motion } from 'framer-motion';
import { CapacityTrajectoryPoint } from '../../types/intelligence';

interface CapacityTrajectoryProps {
  points: CapacityTrajectoryPoint[];
  etaMinutes: number;
}

export default function CapacityTrajectory({ points, etaMinutes }: CapacityTrajectoryProps) {
  if (!points || points.length === 0) return null;

  const maxVal = Math.max(...points.map(p => p.expectedAvailable), 1) + 1;

  return (
    <div className="relative w-full h-32 mt-8">
      {/* Background grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full h-[1px] bg-[var(--cr-border)] opacity-50" />
        ))}
      </div>

      {/* Trajectory visualization */}
      <div className="absolute inset-0 flex justify-between items-end">
        {points.map((point, index) => {
          const heightPercent = (point.expectedAvailable / maxVal) * 100;
          const isArrival = point.timeLabel.includes('ARRIVAL');
          const isZero = point.expectedAvailable <= 0;

          return (
            <div key={index} className="relative flex flex-col items-center flex-1 h-full justify-end group">
              {/* Connecting line (css hack for minimal design) */}
              {index < points.length - 1 && (
                <div className={`absolute top-1/2 left-1/2 w-full h-[1px] -z-10 ${point.isHistorical ? 'bg-[var(--cr-border)] opacity-50' : 'bg-[var(--cr-border)]'}`} />
              )}

              {/* Data Point */}
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${heightPercent}%`, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
                className="relative flex flex-col items-center justify-end w-full"
              >
                {/* Number above dot */}
                <span className={`absolute -top-6 text-sm font-semibold transition-colors
                  ${isArrival ? (isZero ? 'text-[var(--cr-danger)]' : 'text-[var(--cr-primary)]') : (point.isHistorical ? 'text-[var(--cr-muted)] opacity-70' : 'text-[var(--cr-deep-text)]')}
                `}>
                  {point.expectedAvailable}
                </span>

                {/* The Dot */}
                <div className={`w-3 h-3 rounded-full border-2 bg-white z-10 transition-colors
                  ${isArrival 
                    ? (isZero ? 'border-[var(--cr-danger)]' : 'border-[var(--cr-primary)] bg-[var(--cr-primary)]/10') 
                    : (point.isHistorical ? 'border-[var(--cr-muted)] bg-[var(--cr-background)]' : 'border-[var(--cr-deep-text)]')}
                `} />

                {/* Arrival Marker Line */}
                {isArrival && (
                  <div className="absolute top-3 w-[1px] h-full bg-[var(--cr-primary)]/30 border-l border-dashed border-[var(--cr-primary)]" />
                )}
                {/* NOW Marker Line */}
                {point.timeLabel === 'NOW' && (
                  <div className="absolute top-3 w-[1px] h-full bg-[var(--cr-border)]/50 border-l border-dotted border-[var(--cr-muted)]" />
                )}
              </motion.div>

              {/* Time Label */}
              <div className={`absolute -bottom-8 text-[10px] font-bold tracking-widest whitespace-nowrap
                ${isArrival ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-muted)]'}
              `}>
                {isArrival ? 'ARRIVAL ↓' : point.timeLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
