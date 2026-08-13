'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { conceptFlowSteps } from '@/lib/data';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Our Difference Section
// ============================================================
// "CARE ROUTE doesn't just recommend. It coordinates."

export default function DifferenceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      className="py-28 md:py-40 bg-primary"
      aria-label="Our Difference"
    >
      <div className="section-container" ref={ref}>
        {/* ─── Statement ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: animation.easeOut }}
          className="max-w-4xl"
        >
          <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-white/40 mb-5">
            Our difference
          </p>
          <h2 className="text-editorial text-3xl sm:text-4xl md:text-[3.25rem] lg:text-[3.5rem] text-white leading-[1.06]">
            CARE ROUTE DOESN&apos;T
            <br />
            JUST RECOMMEND.
            <br />
            <span className="text-sage">IT COORDINATES.</span>
          </h2>
        </motion.div>

        {/* ─── Concept Flow ───────────────────────────────── */}
        <div className="mt-20 md:mt-28 max-w-2xl mx-auto">
          {conceptFlowSteps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.1,
                ease: animation.easeOut,
              }}
              className="relative"
            >
              {/* Connector line */}
              {i < conceptFlowSteps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + i * 0.1,
                    ease: animation.easeOut,
                  }}
                  className="absolute left-5 top-[44px] w-px h-full bg-white/10 origin-top"
                  aria-hidden="true"
                />
              )}

              <div className="flex items-start gap-5 py-4">
                {/* Node */}
                <div className="relative flex-shrink-0 mt-1">
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center text-[0.6875rem] font-semibold ${
                      i === 0
                        ? 'bg-white/10 border-white/20 text-white'
                        : i === conceptFlowSteps.length - 1
                        ? 'bg-success/20 border-success/30 text-success'
                        : 'bg-white/5 border-white/10 text-white/50'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Label */}
                <div className="pt-1.5">
                  <h3 className="text-lg font-medium text-white tracking-[-0.01em]">
                    {step.label}
                  </h3>
                  {step.description && (
                    <p className="mt-1 text-sm text-white/40 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
