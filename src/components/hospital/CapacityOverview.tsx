'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Capacity Overview
// ============================================================

export default function CapacityOverview() {
  const { capacity } = useHospital();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {capacity.map((metric, i) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: animation.easeOut }}
          className="bg-white border border-border rounded-xl p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[0.8125rem] font-semibold text-primary uppercase tracking-[0.04em]">
              {metric.name}
            </h3>
            {metric.status && (
              <span className={`text-[0.6875rem] font-bold px-2 py-0.5 rounded-sm ${
                metric.status === 'AVAILABLE' ? 'bg-success/10 text-success' :
                metric.status === 'LIMITED' ? 'bg-warning/10 text-warning' :
                'bg-critical/10 text-critical'
              }`}>
                {metric.status}
              </span>
            )}
          </div>

          {!metric.status ? (
            <>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-light text-primary leading-none">
                  {metric.available}
                </span>
                <span className="text-[0.8125rem] text-muted mb-1">
                  available
                </span>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex justify-between text-[0.75rem] text-muted mb-1.5">
                  <span>Occupied: {metric.occupied}</span>
                  <span>Total: {metric.total}</span>
                </div>
                
                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-primary/20" 
                    style={{ width: `${(metric.occupied / metric.total) * 100}%` }} 
                  />
                  <div 
                    className={`h-full ${metric.available > 0 ? 'bg-success/50' : 'bg-critical/50'}`}
                    style={{ width: `${(metric.available / metric.total) * 100}%` }} 
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center pt-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                metric.status === 'AVAILABLE' ? 'border-success/20 text-success' :
                metric.status === 'LIMITED' ? 'border-warning/20 text-warning' :
                'border-critical/20 text-critical'
              }`}>
                <div className={`w-10 h-10 rounded-full ${
                  metric.status === 'AVAILABLE' ? 'bg-success/10' :
                  metric.status === 'LIMITED' ? 'bg-warning/10' :
                  'bg-critical/10'
                }`} />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
