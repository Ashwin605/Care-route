import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ClipboardCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { HospitalProfile } from '../../types/hospital';

interface ArrivalScreenProps {
  destination: HospitalProfile;
}

export default function ArrivalScreen({ destination }: ArrivalScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--cr-background)] flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl p-8 border border-[var(--cr-border)] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[var(--cr-success)]" />
          
          <div className="mx-auto w-20 h-20 bg-[var(--cr-success)]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-[var(--cr-success)]" />
          </div>

          <h2 className="text-2xl font-light text-[var(--cr-deep-text)] mb-2 uppercase tracking-wide">
            PATIENT ARRIVED
          </h2>
          <h3 className="text-lg font-semibold text-[var(--cr-primary)] mb-6">
            {destination.name}
          </h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-[var(--cr-deep-text)] bg-[var(--cr-background)] p-3 rounded-lg border border-[var(--cr-border)]">
              <ClipboardCheck size={20} className="text-[var(--cr-success)]" />
              <div className="text-left">
                <div className="font-semibold">Handoff Complete</div>
                <div className="text-xs text-[var(--cr-muted)]">Digital referral accepted by ER staff</div>
              </div>
            </div>
          </div>

          <Link 
            href="/"
            className="flex items-center justify-center gap-2 text-sm font-medium text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors"
          >
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
