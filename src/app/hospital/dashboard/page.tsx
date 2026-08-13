'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';
import NetworkStatusIndicator from '@/components/hospital/NetworkStatus';
import CapacityOverview from '@/components/hospital/CapacityOverview';
import QuickActions from '@/components/hospital/QuickActions';

// ============================================================
// CARE ROUTE — Hospital Dashboard Overview
// ============================================================

export default function HospitalDashboard() {
  const { profile } = useHospital();

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full">
      
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: animation.easeOut }}
        className="mb-12"
      >
        <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-muted mb-4">
          Hospital Workspace
        </p>
        <h1 className="text-editorial text-4xl md:text-[3rem] text-primary leading-[1.06] mb-6">
          GOOD MORNING,
          <br />
          <span className="text-sage uppercase">{profile.name}.</span>
        </h1>
        <p className="text-muted text-lg max-w-xl">
          Monitor capacity, respond to referrals and keep your hospital's availability current.
        </p>
      </motion.div>

      {/* ─── Network Status ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: animation.easeOut }}
        className="mb-12"
      >
        <NetworkStatusIndicator />
      </motion.div>

      {/* ─── Capacity Overview ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: animation.easeOut }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-primary">
            Current Capacity Overview
          </h2>
          <span className="text-[0.75rem] text-muted">SIMULATED FORECAST</span>
        </div>
        
        <CapacityOverview />
      </motion.div>

      {/* ─── Quick Actions ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: animation.easeOut }}
        className="mb-12"
      >
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-primary mb-2">
          Quick Actions
        </h2>
        
        <QuickActions />
      </motion.div>

    </div>
  );
}
