'use client';

import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';
import NetworkStatusIndicator from '@/components/hospital/NetworkStatus';

export default function ResourcesPage() {
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
            Resource Management
          </p>
          <h1 className="text-editorial text-3xl md:text-4xl text-primary leading-[1.1]">
            HOSPITAL RESOURCES.
          </h1>
        </div>
        <div className="shrink-0">
          <NetworkStatusIndicator minimal />
        </div>
      </motion.div>

      <div className="bg-white border border-border rounded-xl p-12 text-center">
        <p className="text-muted">Detailed resource management (Operation Theatres, Blood Bank, Imaging) would be implemented here following the same Capacity Editor pattern.</p>
      </div>
    </div>
  );
}
