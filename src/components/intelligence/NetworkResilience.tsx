import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '../../types/recommendation';
import { ResilienceScore } from '../../types/intelligence';
import { Shield, ShieldAlert, ShieldCheck, Activity, ArrowDown } from 'lucide-react';

interface NetworkResilienceProps {
  recommendations: Recommendation[];
  baselinePrimaryId: string;
  resilienceScore: ResilienceScore;
}

export default function NetworkResilience({ recommendations, baselinePrimaryId, resilienceScore }: NetworkResilienceProps) {
  if (recommendations.length === 0) return null;

  const currentPrimaryId = recommendations[0].hospitalId;
  const isPrimaryLost = currentPrimaryId !== baselinePrimaryId;

  const getScoreDisplay = () => {
    switch (resilienceScore) {
      case 'HIGH':
        return { icon: <ShieldCheck size={16} />, color: 'text-[var(--cr-success)] bg-[var(--cr-success)]/10', label: 'HIGH' };
      case 'MEDIUM':
        return { icon: <Shield size={16} />, color: 'text-[var(--cr-secondary)] bg-[var(--cr-secondary)]/10', label: 'MEDIUM' };
      case 'LOW':
        return { icon: <ShieldAlert size={16} />, color: 'text-[var(--cr-warning)] bg-[var(--cr-warning)]/10', label: 'LOW' };
    }
  };
  const scoreData = getScoreDisplay();

  return (
    <div className="bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] flex items-center gap-2">
            <Activity size={14} /> Network Resilience
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] bg-white border border-[var(--cr-border)] text-[var(--cr-muted)] px-1.5 py-0.5 rounded tracking-widest uppercase">
            Prototype Operational Indicator
          </span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold tracking-wider ${scoreData.color}`}>
            {scoreData.icon} {scoreData.label}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-xl mx-auto space-y-4">
          
          {isPrimaryLost && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[var(--cr-danger)]/10 border border-[var(--cr-danger)]/20 text-[var(--cr-danger)] px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mb-4"
            >
              <ShieldAlert size={18} /> PRIMARY LOST
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {recommendations.slice(0, 4).map((rec, idx) => {
              const isPrimary = idx === 0;
              const isBackupActivated = isPrimary && isPrimaryLost;

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
                  {idx > 0 && (
                    <div className="flex justify-center -my-3 relative z-0">
                      <ArrowDown size={16} className="text-[var(--cr-border)]" />
                    </div>
                  )}

                  <div className={`p-4 rounded-xl border flex justify-between items-center transition-colors relative z-10 my-2 ${
                    isBackupActivated ? 'bg-[var(--cr-primary)]/5 border-[var(--cr-primary)]' : 
                    isPrimary ? 'bg-white border-[var(--cr-primary)]/30 shadow-sm' : 
                    'bg-[var(--cr-background)] border-[var(--cr-border)] opacity-70'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isPrimary ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-muted)]'}`}>
                          {isBackupActivated ? 'BACKUP ACTIVATED' : isPrimary ? 'PRIMARY' : `BACKUP ${idx}`}
                        </span>
                      </div>
                      <h4 className={`text-base font-semibold ${isPrimary ? 'text-[var(--cr-deep-text)]' : 'text-[var(--cr-deep-text)]'}`}>
                        {rec.hospital.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--cr-muted)]">Score</div>
                      <div className={`text-lg font-semibold ${isPrimary ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-muted)]'}`}>
                        {rec.matchScore}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {recommendations.length === 0 && (
            <div className="text-center text-[var(--cr-muted)] text-sm py-4">
              No suitable alternatives available.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
