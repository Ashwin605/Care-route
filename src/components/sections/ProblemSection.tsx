'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { X, Check } from 'lucide-react';
import { problemHospitals } from '@/lib/data';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Problem Section
// ============================================================
// "The nearest hospital isn't always the right hospital."
// Visualizes why distance alone is insufficient.

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="problem"
      className="py-28 md:py-40 bg-background"
      aria-label="The Problem"
    >
      <div className="section-container" ref={ref}>
        {/* ─── Statement ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: animation.easeOut }}
          className="max-w-4xl"
        >
          <p className="text-label mb-5">The problem</p>
          <h2 className="text-editorial text-3xl sm:text-4xl md:text-[3.25rem] lg:text-[3.75rem] text-primary leading-[1.06]">
            THE NEAREST HOSPITAL
            <br />
            ISN&apos;T ALWAYS
            <br />
            <span className="text-critical">THE RIGHT HOSPITAL.</span>
          </h2>
        </motion.div>

        {/* ─── Hospital Comparison ─────────────────────────── */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {problemHospitals.map((hospital, i) => (
            <motion.div
              key={hospital.name}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.3 + i * 0.15,
                ease: animation.easeOut,
              }}
              className={`relative rounded-lg border p-6 md:p-8 transition-all duration-300 ${
                hospital.recommended
                  ? 'border-success/30 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(63,128,104,0.08)]'
                  : 'border-border bg-white/60'
              }`}
            >
              {/* Recommended label */}
              {hospital.recommended && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success text-white text-[0.625rem] font-semibold tracking-[0.08em] uppercase rounded-full">
                    <Check size={10} strokeWidth={3} />
                    Recommended
                  </span>
                </div>
              )}

              {/* Hospital Name */}
              <h3
                className={`text-lg font-medium tracking-[-0.01em] ${
                  hospital.recommended ? 'text-primary' : 'text-muted'
                }`}
              >
                {hospital.name}
              </h3>

              {/* Distance */}
              <p
                className={`mt-1 text-2xl font-light tracking-[-0.02em] ${
                  hospital.recommended ? 'text-primary' : 'text-primary/60'
                }`}
              >
                {hospital.distance}
              </p>

              {/* Capabilities */}
              <div className="mt-6 space-y-2.5">
                {hospital.capabilities.map((cap) => (
                  <div
                    key={cap.name}
                    className="flex items-center gap-2.5"
                  >
                    {cap.available ? (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success/10">
                        <Check size={12} className="text-success" strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-critical/10">
                        <X size={12} className="text-critical" strokeWidth={2.5} />
                      </span>
                    )}
                    <span
                      className={`text-sm ${
                        cap.available ? 'text-primary' : 'text-muted line-through'
                      }`}
                    >
                      {cap.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Issue callout */}
              {hospital.issues.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  {hospital.issues.map((issue) => (
                    <p
                      key={issue}
                      className="text-[0.8125rem] text-critical font-medium"
                    >
                      {issue}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ─── Disclaimer ─────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 text-label-sm text-center"
        >
          SIMULATED PROTOTYPE DATA
        </motion.p>
      </div>
    </section>
  );
}
