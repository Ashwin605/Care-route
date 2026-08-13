'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { howItWorksSteps } from '@/lib/data';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — How It Works Section
// ============================================================
// Large editorial step-by-step with scroll-triggered animations.
// NOT a boring six-card grid.

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="how-it-works"
      className="py-28 md:py-40 bg-background"
      aria-label="How it works"
    >
      <div className="section-container" ref={ref}>
        {/* ─── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: animation.easeOut }}
          className="max-w-3xl mb-20 md:mb-28"
        >
          <p className="text-label mb-5">How it works</p>
          <h2 className="text-editorial text-3xl sm:text-4xl md:text-5xl text-primary">
            SIX STEPS FROM
            <br />
            NEED TO ADMISSION.
          </h2>
        </motion.div>

        {/* ─── Steps Timeline ─────────────────────────────── */}
        <div className="relative">
          {/* Vertical timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: animation.easeOut }}
            className="absolute left-0 md:left-[60px] top-0 bottom-0 w-px bg-border origin-top hidden md:block"
            aria-hidden="true"
          />

          <div className="space-y-0">
            {howItWorksSteps.map((step, i) => (
              <StepItem
                key={step.number}
                step={step}
                index={i}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  step,
  index,
  isInView,
}: {
  step: (typeof howItWorksSteps)[number];
  index: number;
  isInView: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const itemInView = useInView(itemRef, { once: true, margin: '-40px' });
  const visible = isInView || itemInView;

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.2 + index * 0.12,
        ease: animation.easeOut,
      }}
      className="relative flex items-start gap-6 md:gap-10 py-8 md:py-12 group"
    >
      {/* ─── Step Number ──────────────────────────────────── */}
      <div className="relative flex-shrink-0">
        {/* Node dot on timeline */}
        <div className="hidden md:flex absolute left-[52px] top-3 w-[17px] h-[17px] items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={visible ? { scale: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.4 + index * 0.12,
              ease: animation.easeOut,
            }}
            className="w-[9px] h-[9px] rounded-full bg-primary/20 border-2 border-primary/40 group-hover:bg-primary/40 transition-colors duration-300"
          />
        </div>

        <div className="md:ml-[90px]">
          <span className="text-[3rem] sm:text-[4rem] md:text-[5rem] font-extralight text-primary/8 tracking-[-0.04em] leading-none select-none">
            {step.number}
          </span>
        </div>
      </div>

      {/* ─── Content ──────────────────────────────────────── */}
      <div className="pt-3 md:pt-5 max-w-lg">
        <h3 className="text-xl md:text-2xl font-medium text-primary tracking-[-0.02em]">
          {step.title}
        </h3>
        <p className="mt-3 text-[0.9375rem] text-muted leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}
