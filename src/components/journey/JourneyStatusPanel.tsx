import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Navigation, Activity } from 'lucide-react';
import { HospitalProfile } from '../../types/hospital';
import { TotalTimeToCareResult } from '../../types/intelligence';

interface JourneyStatusPanelProps {
  destination: HospitalProfile;
  etaMinutes: number;
  distanceKm: number;
  isRerouting?: boolean;
  totalTimeToCare?: TotalTimeToCareResult;
}

export default function JourneyStatusPanel({ destination, etaMinutes, distanceKm, isRerouting, totalTimeToCare }: JourneyStatusPanelProps) {
  return (
    <div className="bg-white border border-[var(--cr-border)] rounded-2xl p-6 shadow-lg relative overflow-hidden">
      {/* Network Pulse Background Animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--cr-primary)] via-[var(--cr-secondary)] to-[var(--cr-primary)] opacity-50 bg-[length:200%_100%] animate-[pulse_2s_ease-in-out_infinite]" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[var(--cr-success)] animate-pulse" />
            LIVE JOURNEY STATUS
          </span>
          <h2 className="text-2xl font-semibold text-[var(--cr-deep-text)]">
            En Route to {destination.name}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--cr-primary)] bg-[var(--cr-primary)]/10 px-3 py-1 rounded-full border border-[var(--cr-primary)]/20">
          <Activity size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          <span>Monitoring Network</span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-[var(--cr-border)]">
        <div className="pr-6">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--cr-muted)] mb-1">Expected Arrival In</span>
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={etaMinutes}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-5xl font-light tracking-tight flex items-end gap-2 ${isRerouting ? 'text-[var(--cr-warning)]' : 'text-[var(--cr-primary)]'}`}
            >
              {etaMinutes} <span className="text-lg font-medium text-[var(--cr-muted)] mb-1">min</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pl-6 flex flex-col justify-end">
          <div className="flex items-center gap-2 text-[var(--cr-deep-text)] font-medium mb-1">
            <Navigation size={16} className="text-[var(--cr-muted)]" />
            {distanceKm.toFixed(1)} km remaining
          </div>
          <div className="flex items-center gap-2 text-[var(--cr-deep-text)] font-medium">
            <Clock size={16} className="text-[var(--cr-muted)]" />
            ETA: {new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Total Time To Care Section */}
      {totalTimeToCare && (
        <div className="mt-6 pt-4 border-t border-[var(--cr-border)] flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[var(--cr-muted)] mb-1">Travel</span>
              <span className="text-sm font-medium text-[var(--cr-deep-text)]">{totalTimeToCare.travelMinutes} min</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[var(--cr-muted)] mb-1">Expected Intake</span>
              <span className="text-sm font-medium text-[var(--cr-deep-text)]">{totalTimeToCare.estimatedIntakeMinutes} min</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-[var(--cr-primary)] tracking-wider mb-1">TOTAL EXPECTED TIME TO CARE</span>
            <AnimatePresence mode="wait">
              <motion.span 
                key={totalTimeToCare.totalEstimatedMinutes}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-2xl font-semibold text-[var(--cr-primary)]"
              >
                {totalTimeToCare.totalEstimatedMinutes} min
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
