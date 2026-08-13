import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkSummary } from '../../types/intelligence';
import { Activity } from 'lucide-react';

interface NetworkPulseProps {
  summary: NetworkSummary;
}

export default function NetworkPulse({ summary }: NetworkPulseProps) {
  // Extract time from ISO string
  const timeStr = new Date(summary.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="bg-[var(--cr-background)] border border-[var(--cr-border)] rounded-xl p-4 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-[var(--cr-primary)]" />
        <h3 className="text-xs font-bold tracking-[0.1em] text-[var(--cr-muted)] uppercase">CARE ROUTE NETWORK PULSE</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`${summary.totalHospitals}-total`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-1">Nearby</span>
            <span className="text-lg font-medium text-[var(--cr-deep-text)]">{summary.totalHospitals} hospitals</span>
          </motion.div>
          
          <motion.div 
            key={`${summary.capacityMatched}-cap`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-1">Accepting Care</span>
            <span className="text-lg font-medium text-[var(--cr-deep-text)]">{summary.capacityMatched} available</span>
          </motion.div>

          <motion.div 
            key={`${summary.highConfidenceMatches}-conf`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <span className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-1">High Confidence</span>
            <span className="text-lg font-medium text-[var(--cr-deep-text)]">{summary.highConfidenceMatches} matches</span>
          </motion.div>
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[var(--cr-muted)] mb-1">Last Updated</span>
            <span className="text-sm font-medium text-[var(--cr-deep-text)] mt-1">{timeStr}</span>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
