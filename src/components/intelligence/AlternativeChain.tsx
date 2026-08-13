import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '../../types/recommendation';
import { HospitalCandidateState } from '../../types/intelligence';
import { Activity, Clock, ShieldAlert, ArrowDown } from 'lucide-react';

interface AlternativeChainProps {
  primaryTargetId: string;
  recommendations: Recommendation[];
  candidateStates: Record<string, HospitalCandidateState>;
}

export default function AlternativeChain({ primaryTargetId, recommendations, candidateStates }: AlternativeChainProps) {
  // Sort recommendations so primary is at top, followed by the rest ranked by matchScore
  const sortedRecs = [...recommendations].sort((a, b) => {
    if (a.hospitalId === primaryTargetId) return -1;
    if (b.hospitalId === primaryTargetId) return 1;
    return b.matchScore - a.matchScore;
  });

  const getRoleLabel = (index: number) => {
    if (index === 0) return 'PRIMARY';
    return `BACKUP ${index}`;
  };

  const getStatusColor = (state?: HospitalCandidateState) => {
    if (state === 'RECOMMENDED') return 'text-[var(--cr-primary)] border-[var(--cr-primary)] bg-[var(--cr-primary)]/5';
    if (state === 'AT_RISK' || state === 'INELIGIBLE') return 'text-[var(--cr-warning)] border-[var(--cr-warning)] bg-[var(--cr-warning)]/5';
    return 'text-[var(--cr-secondary)] border-[var(--cr-border)] bg-white';
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-[var(--cr-border)] rounded-2xl p-6 shadow-xl font-sans">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)]">
          Smart Alternative Chain
        </h3>
        <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-[var(--cr-secondary)]/10 text-[var(--cr-secondary)] rounded">
          {Math.max(0, sortedRecs.length - 1)} suitable backups
        </span>
      </div>

      <div className="relative">
        <AnimatePresence mode="popLayout">
          {sortedRecs.map((rec, index) => {
            const state = candidateStates[rec.hospitalId];
            const isPrimary = index === 0;
            const isNextBest = index === 1 && state === 'RECOMMENDED';
            const statusClass = getStatusColor(state);
            
            return (
              <motion.div
                layout
                key={rec.hospitalId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative z-10"
              >
                {index > 0 && (
                  <div className="flex justify-center -my-2 relative z-0">
                    <ArrowDown size={16} className="text-[var(--cr-border)]" />
                  </div>
                )}
                
                <div className={`p-4 rounded-xl border ${statusClass} flex justify-between items-center transition-colors relative z-10 my-1`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                        {getRoleLabel(index)}
                      </span>
                      {isNextBest && (
                        <span className="text-[10px] font-bold uppercase bg-[var(--cr-primary)] text-white px-1.5 py-0.5 rounded">
                          Next Best Option
                        </span>
                      )}
                    </div>
                    <h4 className={`text-base font-semibold ${state === 'AT_RISK' ? 'text-[var(--cr-warning)]' : 'text-[var(--cr-deep-text)]'}`}>
                      {rec.hospital.name}
                    </h4>
                    {state === 'AT_RISK' && (
                      <span className="text-xs text-[var(--cr-warning)] font-medium flex items-center gap-1 mt-1">
                        <ShieldAlert size={12} /> Capacity Critical
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Score</span>
                        <span className="text-sm font-semibold">{rec.matchScore}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total Time</span>
                        <span className="text-sm font-semibold">{rec.totalTimeToCare?.totalEstimatedMinutes || rec.etaMinutes}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--cr-border)] text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">
          BACKUP COVERAGE: {Math.max(0, sortedRecs.length - 1)} alternatives ready
        </p>
      </div>
    </div>
  );
}
