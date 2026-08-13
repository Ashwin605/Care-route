'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';
import NetworkStatusIndicator from '@/components/hospital/NetworkStatus';

export default function SpecialistsPage() {
  const { specialists, updateSpecialist } = useHospital();

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: animation.easeOut }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
      >
        <div>
          <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-muted mb-3">
            Roster Management
          </p>
          <h1 className="text-editorial text-3xl md:text-4xl text-primary leading-[1.1]">
            SPECIALIST AVAILABILITY.
          </h1>
        </div>
        <div className="shrink-0">
          <NetworkStatusIndicator minimal />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialists.map((spec, i) => (
          <motion.div
            key={spec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: animation.easeOut }}
            className="bg-white border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-primary tracking-[-0.01em] mb-4">
              {spec.specialty}
            </h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-[0.75rem] font-medium text-muted mb-1.5">Available Specialists</label>
                <input
                  type="number"
                  value={spec.availableCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 0) {
                      updateSpecialist(spec.id, { availableCount: val });
                    }
                  }}
                  className="w-full bg-white border border-border rounded-md px-3 py-2 text-[0.9375rem] text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {(['AVAILABLE', 'UNAVAILABLE'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => updateSpecialist(spec.id, { status })}
                  className={`flex-1 py-1.5 text-[0.75rem] font-medium rounded-md border transition-all ${
                    spec.status === status
                      ? status === 'AVAILABLE' ? 'bg-success/10 border-success/30 text-success' : 'bg-critical/10 border-critical/30 text-critical'
                      : 'bg-white border-border text-muted hover:border-primary/20 hover:text-primary'
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
