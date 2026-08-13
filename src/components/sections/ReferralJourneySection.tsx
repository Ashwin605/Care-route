'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';
import { referralTimeline } from '@/lib/data';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Referral Journey Section
// ============================================================
// Animated timeline from Created → Admitted.

export default function ReferralJourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      className="py-28 md:py-40 bg-background"
      aria-label="Referral Journey"
    >
      <div className="section-container" ref={ref}>
        {/* ─── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: animation.easeOut }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
        >
          <p className="text-label mb-5">Referral journey</p>
          <h2 className="text-editorial text-3xl sm:text-4xl md:text-5xl text-primary">
            COMPLETE VISIBILITY
            <br />
            FROM <span className="text-secondary">REQUEST</span> TO{' '}
            <span className="text-secondary">ADMISSION.</span>
          </h2>
        </motion.div>

        {/* ─── Timeline ───────────────────────────────────── */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: animation.easeOut }}
              className="absolute left-[19px] top-2 bottom-2 w-px bg-border origin-top"
              aria-hidden="true"
            />

            {/* Steps */}
            <div className="space-y-0">
              {referralTimeline.map((event, i) => (
                <motion.div
                  key={event.status}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.1,
                    ease: animation.easeOut,
                  }}
                  className="relative flex items-center gap-5 py-4"
                >
                  {/* Node */}
                  <div className="relative z-10 flex-shrink-0">
                    {event.completed ? (
                      <div className="w-[38px] h-[38px] rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                        <Check
                          size={14}
                          className="text-success"
                          strokeWidth={2.5}
                        />
                      </div>
                    ) : event.active ? (
                      <div className="w-[38px] h-[38px] rounded-full bg-secondary/10 border border-secondary/25 flex items-center justify-center">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inset-0 rounded-full bg-secondary opacity-40 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
                        </span>
                      </div>
                    ) : (
                      <div className="w-[38px] h-[38px] rounded-full bg-white border border-border flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-border" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[0.9375rem] font-medium tracking-[-0.01em] ${
                      event.completed
                        ? 'text-primary'
                        : event.active
                        ? 'text-secondary'
                        : 'text-muted/50'
                    }`}
                  >
                    {event.label}
                  </span>

                  {/* Active indicator */}
                  {event.active && (
                    <span className="text-[0.6875rem] font-medium text-secondary/60 tracking-wide uppercase">
                      In progress
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Disclaimer ─────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 text-label-sm text-center"
        >
          SIMULATED REFERRAL JOURNEY
        </motion.p>
      </div>
    </section>
  );
}
