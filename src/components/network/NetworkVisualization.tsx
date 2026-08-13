'use client';

import { Suspense, lazy } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Network Visualization Section
// ============================================================
// Lazy-loaded 3D visualization for performance.

const NetworkScene = lazy(() => import('./NetworkScene'));

function NetworkFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-border border-t-secondary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-label-sm">Loading visualization</p>
      </div>
    </div>
  );
}

export default function NetworkVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="py-28 md:py-40 bg-primary"
      aria-label="Network Visualization"
    >
      <div className="section-container" ref={ref}>
        {/* ─── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: animation.easeOut }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-white/40 mb-5">
            Connected network
          </p>
          <h2 className="text-editorial text-3xl sm:text-4xl md:text-5xl text-white">
            ONE PATIENT.
            <br />
            MULTIPLE HOSPITALS.
            <br />
            <span className="text-sage">THE RIGHT MATCH.</span>
          </h2>
        </motion.div>

        {/* ─── 3D Visualization ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: animation.easeOut }}
          className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-white/6 bg-white/3"
        >
          <Suspense fallback={<NetworkFallback />}>
            <NetworkScene />
          </Suspense>

          {/* Legend */}
          <div className="absolute bottom-5 left-5 flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary border border-white/20" />
              <span className="text-[0.6875rem] text-white/40">Patient</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sage opacity-70" />
              <span className="text-[0.6875rem] text-white/40">Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-[0.6875rem] text-white/40">Selected</span>
            </div>
          </div>

          {/* Interaction hint */}
          <p className="absolute bottom-5 right-5 text-[0.625rem] text-white/20">
            Drag to rotate
          </p>
        </motion.div>

        <p className="mt-5 text-[0.625rem] font-medium tracking-[0.1em] uppercase text-white/20 text-center">
          SIMULATED NETWORK VISUALIZATION
        </p>
      </div>
    </section>
  );
}
