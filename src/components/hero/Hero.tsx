'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { trustIndicators } from '@/lib/data';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Hero Section
// ============================================================
// Uses the uploaded video as an integrated visual background.
// Typography animates in with staggered Framer Motion.

const stagger = animation.stagger;
const ease = animation.easeOut;

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[100dvh] flex items-end overflow-hidden"
      aria-label="Hero"
    >
      {/* ─── Video Background ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/assets/Modern_hospital_building_exterior_202608091110.mp4" type="video/mp4" />
        </video>

        {/* Subtle readability layer — preserves video character */}
        <div
          className="absolute inset-0 bg-[#0A1A1F]/40"
          aria-hidden="true"
        />

        {/* Bottom gradient for content legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              'linear-gradient(to top, rgba(10, 26, 31, 0.7) 0%, rgba(10, 26, 31, 0.3) 50%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ─── Content ──────────────────────────────────────── */}
      <div className="relative z-10 section-container pb-16 md:pb-24 pt-32 w-full">
        <div className="max-w-3xl">
          {/* ─── Headline ─────────────────────────────────── */}
          <div className="overflow-hidden">
            <motion.h1
              className="text-editorial-tight text-white text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              {['THE RIGHT', 'CARE.', 'AT THE RIGHT', 'TIME.'].map(
                (line, i) => (
                  <motion.span
                    key={i}
                    className="block"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + i * stagger,
                      ease,
                    }}
                  >
                    {line}
                  </motion.span>
                )
              )}
            </motion.h1>
          </div>

          {/* ─── Supporting Copy ───────────────────────────── */}
          <motion.p
            className="mt-7 text-white/60 text-base sm:text-lg max-w-lg leading-relaxed font-light tracking-[-0.01em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
          >
            Intelligent healthcare referral orchestration
            for faster, capacity-aware hospital coordination.
          </motion.p>

          {/* ─── CTAs ──────────────────────────────────────── */}
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease }}
          >
            <Button
              variant="inverted"
              size="lg"
              href="/care"
            >
              Start a Referral
              <ArrowRight size={16} />
            </Button>

            <a
              href="#problem"
              className="inline-flex items-center gap-2 px-5 py-3.5 text-[0.875rem] font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              Explore How It Works
              <ChevronDown size={16} className="animate-bounce" style={{ animationDuration: '2.5s' }} />
            </a>
          </motion.div>

          {/* ─── Trust Indicators ──────────────────────────── */}
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4, ease }}
          >
            {trustIndicators.map((indicator) => (
              <Badge
                key={indicator}
                variant="default"
                dot
                className="bg-white/8 text-white/60 border-white/12"
              >
                {indicator}
              </Badge>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Scroll Indicator ─────────────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-white/50"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
