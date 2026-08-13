'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Final CTA Section
// ============================================================

export default function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      className="py-32 md:py-44 bg-background"
      aria-label="Call to action"
    >
      <div className="section-container" ref={ref}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: animation.easeOut }}
            className="text-editorial text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[4rem] text-primary leading-[1.06]"
          >
            BETTER REFERRALS
            <br />
            BEGIN WITH
            <br />
            BETTER INFORMATION.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: animation.easeOut,
            }}
            className="mt-7 text-muted text-base sm:text-lg leading-relaxed max-w-lg mx-auto"
          >
            Connect patient requirements with hospital capacity,
            specialist availability and referral confirmation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: animation.easeOut,
            }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="primary" size="lg">
              Start a Referral
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              For Hospitals
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
