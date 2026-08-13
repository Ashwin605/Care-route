import React from 'react';
import { motion } from 'framer-motion';
import { DecisionTraceEvent } from '../../types/intelligence';
import { Network } from 'lucide-react';

interface DecisionTraceProps {
  trace: DecisionTraceEvent[];
}

export default function DecisionTrace({ trace }: DecisionTraceProps) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="bg-white border border-[var(--cr-border)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-[var(--cr-primary)]" />
          <h3 className="text-xs font-bold tracking-[0.1em] text-[var(--cr-muted)] uppercase">SIMULATED DECISION TRACE</h3>
        </div>
      </div>

      <div className="relative pl-3">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-[var(--cr-border)]" />

        <div className="space-y-4">
          {trace.map((event, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative flex items-start gap-4"
            >
              {/* Node */}
              <div className="relative z-10 w-2 h-2 mt-1.5 rounded-full bg-white border-2 border-[var(--cr-primary)] shadow-[0_0_0_4px_white]" />
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-[var(--cr-muted)]">{event.timestamp}</span>
                <span className="text-sm font-medium text-[var(--cr-deep-text)]">{event.description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
