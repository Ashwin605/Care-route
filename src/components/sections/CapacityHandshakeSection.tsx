'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Clock, AlertTriangle, Check, RotateCcw, Search } from 'lucide-react';
import { sampleReferralRequest } from '@/lib/data';
import { animation } from '@/lib/tokens';
import Button from '@/components/ui/Button';

// ============================================================
// CARE ROUTE — Capacity Handshake Section
// ============================================================
// Interactive accept/decline referral demonstration.
// "Before the patient moves, confirm the capacity."

type HandshakeState = 'pending' | 'accepted' | 'declined' | 'searching';

export default function CapacityHandshakeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [state, setState] = useState<HandshakeState>('pending');

  const handleAccept = () => setState('accepted');

  const handleDecline = () => {
    setState('declined');
    setTimeout(() => setState('searching'), 1200);
    setTimeout(() => setState('pending'), 3600);
  };

  const handleReset = () => setState('pending');

  const request = sampleReferralRequest;

  return (
    <section
      className="py-28 md:py-40 bg-background"
      aria-label="Capacity Handshake"
    >
      <div className="section-container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* ─── Left: Editorial ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: animation.easeOut }}
          >
            <p className="text-label mb-5">Capacity handshake</p>
            <h2 className="text-editorial text-3xl sm:text-4xl md:text-[3rem] text-primary leading-[1.06]">
              BEFORE THE
              <br />
              PATIENT MOVES,
              <br />
              <span className="text-secondary">CONFIRM THE CAPACITY.</span>
            </h2>
            <p className="mt-6 text-muted text-base sm:text-lg leading-relaxed max-w-md">
              CARE ROUTE sends a structured referral request to the receiving
              hospital before any patient transfer begins. Only after
              confirmation does the referral proceed.
            </p>
          </motion.div>

          {/* ─── Right: Interactive Card ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: animation.easeOut }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {/* ─── Pending State ────────────────────────── */}
              {state === 'pending' && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: animation.easeOut }}
                  className="bg-white rounded-xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-7 py-5 border-b border-border flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-critical/8">
                      <AlertTriangle size={14} className="text-critical" />
                    </span>
                    <div>
                      <p className="text-label-sm text-critical mb-0.5">New Referral</p>
                      <h3 className="text-lg font-medium text-primary tracking-[-0.01em]">
                        {request.condition}
                      </h3>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="px-7 py-5 border-b border-border/60">
                    <p className="text-label-sm mb-3">Required</p>
                    <div className="flex flex-wrap gap-2">
                      {request.requirements.map((req) => (
                        <span
                          key={req}
                          className="px-3 py-1.5 text-[0.8125rem] font-medium text-primary bg-primary/4 border border-primary/8 rounded-md"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ETA & Hospital */}
                  <div className="px-7 py-5 border-b border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted" />
                      <span className="text-sm text-primary font-medium">
                        ETA: {request.eta} min
                      </span>
                    </div>
                    <span className="text-sm text-muted">
                      {request.hospital.name}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="px-7 py-5 flex items-center gap-3">
                    <Button
                      variant="success"
                      size="md"
                      className="flex-1"
                      onClick={handleAccept}
                    >
                      <Check size={16} />
                      Accept Referral
                    </Button>
                    <Button
                      variant="critical-outline"
                      size="md"
                      className="flex-1"
                      onClick={handleDecline}
                    >
                      Decline
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ─── Accepted State ───────────────────────── */}
              {state === 'accepted' && (
                <motion.div
                  key="accepted"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: animation.easeOut }}
                  className="bg-white rounded-xl border border-success/20 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(63,128,104,0.1)] overflow-hidden"
                >
                  <div className="px-7 py-14 flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1, ease: animation.easeOut }}
                      className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6"
                    >
                      <Check size={28} className="text-success" strokeWidth={2} />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl font-medium text-primary tracking-[-0.02em]"
                    >
                      REFERRAL CONFIRMED
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="mt-3 text-sm text-muted max-w-xs"
                    >
                      The hospital has confirmed capacity. Patient transfer can proceed.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <button
                        onClick={handleReset}
                        className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        Reset demo
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ─── Declined / Searching State ───────────── */}
              {(state === 'declined' || state === 'searching') && (
                <motion.div
                  key="declined"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: animation.easeOut }}
                  className="bg-white rounded-xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  <div className="px-7 py-14 flex flex-col items-center text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 rounded-full bg-secondary/8 flex items-center justify-center mb-6"
                    >
                      <Search size={24} className="text-secondary" />
                    </motion.div>

                    <h3 className="text-xl font-medium text-primary tracking-[-0.02em]">
                      SEARCHING FOR NEXT
                      <br />
                      SUITABLE HOSPITAL...
                    </h3>

                    <p className="mt-3 text-sm text-muted max-w-xs">
                      Hospital declined. CARE ROUTE automatically moves to the next
                      ranked hospital in the suitability list.
                    </p>

                    <button
                      onClick={handleReset}
                      className="mt-8 inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      Reset demo
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Simulated label ─────────────────────────── */}
            <p className="mt-4 text-label-sm text-center">
              INTERACTIVE PROTOTYPE DEMONSTRATION
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
