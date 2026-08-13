'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Clock } from 'lucide-react';
import { recommendedHospital } from '@/lib/data';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Capacity Forecasting Section
// ============================================================
// "Capacity isn't static."
// Elegant data visualization of ICU availability over time.

export default function CapacityForecastSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const forecast = recommendedHospital.capacity;
  const maxBeds = Math.max(...forecast.map((f) => f.beds), 1);
  const patientETA = 24;

  return (
    <section
      className="py-28 md:py-40 bg-primary"
      aria-label="Capacity Forecasting"
    >
      <div className="section-container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* ─── Left: Visualization ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: animation.easeOut }}
            className="bg-white/5 border border-white/8 rounded-xl p-7 md:p-9 order-2 lg:order-1"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[0.625rem] font-medium tracking-[0.1em] uppercase text-white/30 mb-1">
                  ICU Availability
                </p>
                <p className="text-sm text-white/60">
                  Predicted capacity timeline
                </p>
              </div>
              <span className="text-[0.625rem] font-medium tracking-[0.1em] uppercase text-white/20">
                Prototype
              </span>
            </div>

            {/* Capacity Bars */}
            <div className="space-y-5">
              {forecast.map((slot, i) => (
                <motion.div
                  key={slot.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.12,
                    ease: animation.easeOut,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60 font-medium min-w-[72px]">
                      {slot.label}
                    </span>
                    <span
                      className={`text-sm font-semibold tracking-[-0.02em] ${
                        slot.beds === 0
                          ? 'text-critical'
                          : slot.beds === 1
                          ? 'text-warning'
                          : 'text-success'
                      }`}
                    >
                      {slot.beds} {slot.beds === 1 ? 'bed' : 'beds'}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={
                        isInView
                          ? { width: `${Math.max((slot.beds / maxBeds) * 100, 4)}%` }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        delay: 0.6 + i * 0.12,
                        ease: animation.easeOut,
                      }}
                      className={`h-full rounded-full ${
                        slot.beds === 0
                          ? 'bg-critical/60'
                          : slot.beds === 1
                          ? 'bg-warning/60'
                          : 'bg-success/60'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Patient ETA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.0, ease: animation.easeOut }}
              className="mt-8 pt-6 border-t border-white/8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.6875rem] font-medium tracking-[0.06em] uppercase text-white/30 mb-1.5">
                    Patient ETA
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-white/40" />
                    <span className="text-2xl font-light text-white tracking-[-0.02em]">
                      {patientETA} min
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[0.6875rem] font-medium tracking-[0.06em] uppercase text-white/30 mb-1.5">
                    Recommendation
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success/15">
                      <Check size={11} className="text-success" strokeWidth={2.5} />
                    </span>
                    <span className="text-lg font-medium text-success">
                      Suitable
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Right: Editorial ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: animation.easeOut }}
            className="order-1 lg:order-2"
          >
            <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-white/40 mb-5">
              Capacity forecasting
            </p>
            <h2 className="text-editorial text-3xl sm:text-4xl md:text-5xl text-white leading-[1.06]">
              CAPACITY
              <br />
              ISN&apos;T
              <br />
              <span className="text-sage">STATIC.</span>
            </h2>
            <p className="mt-6 text-white/50 text-base sm:text-lg leading-relaxed max-w-md">
              A hospital with available beds right now may not have them when the
              patient arrives. CARE ROUTE forecasts capacity at the estimated
              time of arrival, not just current status.
            </p>
            <p className="mt-8 text-[0.75rem] text-white/25 max-w-sm leading-relaxed">
              Prototype forecasting using simulated capacity history.
              Does not represent clinical-grade prediction.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
