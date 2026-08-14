'use client';

import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';
import Link from 'next/link';

// ============================================================
// CARE ROUTE — Authentication Layout
// ============================================================

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export default function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* ─── Left: Brand & Visual (Hidden on Mobile) ────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 lg:p-20 relative overflow-hidden">
        {/* Subtle background element (abstract nodes) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-32 h-32 rounded-full border border-white" />
          <div className="absolute top-[30%] left-[25%] w-64 h-px bg-white transform rotate-45" />
          <div className="absolute top-[45%] left-[45%] w-48 h-48 rounded-full border border-white" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-white hover:text-white/80 transition-colors">
            CARE ROUTE
          </Link>
        </div>

        <motion.div
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: animation.easeOut }}
        >
          <h1 className="text-editorial text-4xl xl:text-5xl text-white leading-[1.06] tracking-[-0.02em]">
            {heading.split(/\\n|\n/).map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <p className="mt-6 text-white/60 text-lg leading-relaxed font-light tracking-[-0.01em]">
            {subheading}
          </p>
        </motion.div>

        <div className="relative z-10 text-[0.75rem] text-white/30 uppercase tracking-[0.04em]">
          PROTOTYPE ENVIRONMENT
        </div>
      </div>

      {/* ─── Right: Form Area ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden">
          <Link href="/" className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-primary">
            CARE ROUTE
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
