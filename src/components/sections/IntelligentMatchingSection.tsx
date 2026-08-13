'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, MapPin, Clock, Info } from 'lucide-react';
import { recommendedHospital } from '@/lib/data';
import { animation } from '@/lib/tokens';
import StatusIndicator from '@/components/ui/StatusIndicator';

// ============================================================
// CARE ROUTE — Intelligent Matching Section
// ============================================================

export default function IntelligentMatchingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const hospital = recommendedHospital;

  return (
    <section
      className="py-28 md:py-40 bg-background"
      aria-label="Intelligent Matching"
    >
      <div className="section-container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* ─── Left: Editorial ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: animation.easeOut }}
          >
            <p className="text-label mb-5">Intelligent matching</p>
            <h2 className="text-editorial text-3xl sm:text-4xl md:text-5xl text-primary leading-[1.06]">
              EVERY
              <br />
              RECOMMENDATION
              <br />
              IS <span className="text-secondary">EXPLAINABLE.</span>
            </h2>
            <p className="mt-6 text-muted text-base sm:text-lg leading-relaxed max-w-md">
              Each hospital recommendation includes a transparent breakdown of
              capability matches, capacity predictions, and travel-time analysis.
            </p>

            {/* Why this hospital link */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: animation.easeOut }}
              className="mt-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-secondary/5 text-secondary text-sm font-medium cursor-pointer hover:bg-secondary/10 transition-colors duration-200"
            >
              <Info size={14} />
              Why this hospital?
            </motion.div>
          </motion.div>

          {/* ─── Right: Recommendation Card ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: animation.easeOut }}
            className="bg-white rounded-xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-7 py-5 border-b border-border flex items-start justify-between">
              <div>
                <p className="text-label-sm mb-1.5">Top recommendation</p>
                <h3 className="text-xl font-medium text-primary tracking-[-0.02em]">
                  {hospital.name}
                </h3>
              </div>
              <StatusIndicator status="available" pulse />
            </div>

            {/* Score */}
            <div className="px-7 py-6 border-b border-border/60">
              <div className="flex items-end gap-3">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5, ease: animation.easeOut }}
                  className="text-[3.5rem] font-extralight text-primary tracking-[-0.04em] leading-none"
                >
                  {hospital.suitabilityScore}
                  <span className="text-2xl text-primary/40">%</span>
                </motion.span>
                <div className="pb-2">
                  <p className="text-sm text-muted">Suitability</p>
                  <p className="text-label-sm mt-0.5 text-muted/60">SIMULATED SCORE</p>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="px-7 py-6 border-b border-border/60">
              <div className="space-y-3">
                {hospital.capabilities.map((cap, i) => (
                  <motion.div
                    key={cap.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.6 + i * 0.08,
                      ease: animation.easeOut,
                    }}
                    className="flex items-center gap-3"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success/10 flex-shrink-0">
                      <Check size={11} className="text-success" strokeWidth={2.5} />
                    </span>
                    <span className="text-sm text-primary">{cap.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Last Updated */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.0 }}
                className="mt-4 text-[0.75rem] text-muted/60"
              >
                Data updated {hospital.lastUpdated} seconds ago
              </motion.p>
            </div>

            {/* Distance & ETA */}
            <div className="px-7 py-5 flex items-center gap-8">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-muted" />
                <span className="text-sm font-medium text-primary">
                  {hospital.distance} km
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted" />
                <span className="text-sm font-medium text-primary">
                  {hospital.eta} min ETA
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Disclaimer ─────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 text-label-sm text-center"
        >
          SIMULATED PROTOTYPE DATA
        </motion.p>
      </div>
    </section>
  );
}
