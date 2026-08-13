import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { Recommendation } from '../../types/recommendation';

interface RerouteAlertProps {
  previousTarget: string; // Hospital Name
  newRecommendation: Recommendation;
  reason: string;
  onAccept: () => void;
}

export default function RerouteAlert({ previousTarget, newRecommendation, reason, onAccept }: RerouteAlertProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--cr-deep-text)]/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-[var(--cr-border)]"
      >
        <div className="bg-[var(--cr-warning)]/10 border-b border-[var(--cr-warning)]/20 p-6 flex items-start gap-4">
          <div className="bg-[var(--cr-warning)]/20 p-3 rounded-full text-[var(--cr-warning)] mt-1">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--cr-deep-text)] mb-1">
              NETWORK CONDITIONS CHANGED
            </h2>
            <p className="text-sm font-medium text-[var(--cr-warning)]">
              REROUTE SUGGESTED TO ENSURE CARE CAPABILITY
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-2">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)]">THE SITUATION</div>
            <p className="text-[var(--cr-deep-text)] text-sm leading-relaxed font-medium">
              <span className="line-through opacity-60 mr-2">{previousTarget}</span> 
              is no longer the optimal destination. 
              <br/><br/>
              <span className="text-[var(--cr-warning)] bg-[var(--cr-warning)]/10 px-2 py-1 rounded">Reason: {reason}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)]">NEW BEST MATCH</div>
            
            <div className="border border-[var(--cr-primary)] rounded-xl p-4 bg-[var(--cr-background)] flex justify-between items-center relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--cr-primary)]" />
              <div>
                <h3 className="text-lg font-semibold text-[var(--cr-primary)] mb-1">{newRecommendation.hospital.name}</h3>
                <div className="text-sm text-[var(--cr-muted)]">
                  {newRecommendation.distanceKm} km &bull; {newRecommendation.etaMinutes} min ETA
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-[var(--cr-success)] flex items-center justify-end gap-1 mb-1">
                  <Check size={14} /> Expected Capacity Available
                </div>
                <div className="text-[10px] text-[var(--cr-muted)] uppercase tracking-wider">
                  {newRecommendation.matchScore}% Match
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onAccept}
            className="w-full py-4 bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] transition-colors text-white rounded-xl font-medium flex justify-center items-center gap-2 uppercase tracking-wide text-sm"
          >
            Accept Reroute to {newRecommendation.hospital.name} <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
