import React from 'react';
import { TotalTimeToCareResult } from '../../types/intelligence';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TotalTimeToCareProps {
  data: TotalTimeToCareResult;
  className?: string;
}

export default function TotalTimeToCare({ data, className = '' }: TotalTimeToCareProps) {
  return (
    <div className={`border-t border-b border-[var(--cr-border)] py-4 my-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-[var(--cr-primary)]" />
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-primary)]">
          Total Time to Care
        </span>
      </div>

      <div className="flex items-end gap-3 mb-2">
        <motion.span 
          key={data.totalEstimatedMinutes}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-light text-[var(--cr-deep-text)] leading-none"
        >
          ~{data.totalEstimatedMinutes}
        </motion.span>
        <span className="text-sm font-medium text-[var(--cr-muted)] pb-1">min</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--cr-muted)]">Travel:</span>
          <motion.span 
            key={data.travelMinutes}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-medium text-[var(--cr-deep-text)]"
          >
            {data.travelMinutes} min
          </motion.span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[var(--cr-muted)]">Expected intake:</span>
          <motion.span 
            key={data.estimatedIntakeMinutes}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-medium text-[var(--cr-deep-text)]"
          >
            {data.estimatedIntakeMinutes} min
          </motion.span>
        </div>
        
        {(data.resourceAvailabilityFactor > 0 || data.specialistAvailabilityFactor > 0) && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--cr-warning)]">Resource delays:</span>
            <span className="font-medium text-[var(--cr-warning)]">
              +{data.resourceAvailabilityFactor + data.specialistAvailabilityFactor} min
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
