'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { DetailedReferral } from '@/types/hospital';
import { useHospital } from '@/contexts/HospitalContext';
import { useRouter } from 'next/navigation';
import { animation } from '@/lib/tokens';
import { CheckCircle2, XCircle } from 'lucide-react';

// ============================================================
// CARE ROUTE — Referral Decision Flow
// ============================================================

interface ReferralDecisionProps {
  referral: DetailedReferral;
}

export default function ReferralDecision({ referral }: ReferralDecisionProps) {
  const [step, setStep] = useState<'decision' | 'confirm-accept' | 'confirm-decline'>('decision');
  const [declineReason, setDeclineReason] = useState('');
  const { acceptReferral, declineReferral } = useHospital();
  const router = useRouter();

  const handleAccept = () => {
    acceptReferral(referral.id);
    router.push('/hospital/referrals');
  };

  const handleDecline = () => {
    if (!declineReason) return;
    declineReferral(referral.id, declineReason);
    router.push('/hospital/referrals');
  };

  const declineOptions = [
    'ICU capacity unavailable',
    'Specialist unavailable',
    'Required equipment unavailable',
    'Emergency capacity unavailable',
    'Capacity may change before arrival',
    'Other'
  ];

  return (
    <div className="bg-white border border-border rounded-xl p-8 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {step === 'decision' && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: animation.easeOut }}
          >
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-primary mb-2 text-center md:text-left">
              CAN CITYCARE ACCEPT THIS REFERRAL?
            </h2>
            <p className="text-muted text-[0.9375rem] mb-8 text-center md:text-left">
              Confirm your capacity to support this patient's requirements.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] justify-center"
                onClick={() => setStep('confirm-accept')}
              >
                Accept Referral
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] justify-center text-primary/70 hover:text-critical hover:border-critical/30 hover:bg-critical/5"
                onClick={() => setStep('confirm-decline')}
              >
                Decline Referral
              </Button>
            </div>
            <p className="text-[0.75rem] text-muted text-center md:text-left mt-6 max-w-lg">
              AI-assisted operational decision support. Final referral acceptance remains the responsibility of qualified healthcare professionals.
            </p>
          </motion.div>
        )}

        {step === 'confirm-accept' && (
          <motion.div
            key="confirm-accept"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: animation.easeOut }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-success" size={24} />
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-primary">
                CONFIRM REFERRAL
              </h2>
            </div>
            
            <p className="text-primary text-[0.9375rem] mb-6 max-w-lg leading-relaxed">
              You are confirming that CityCare can currently support the patient's stated requirements and expected arrival time ({referral.patientETA} min).
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="primary"
                className="w-full sm:w-auto bg-success hover:bg-success/90 text-white justify-center border-transparent shadow-[0_4px_14px_0_rgba(63,128,104,0.39)]"
                onClick={handleAccept}
              >
                Confirm Acceptance
              </Button>
              <Button
                variant="ghost"
                className="w-full sm:w-auto justify-center"
                onClick={() => setStep('decision')}
              >
                Go Back
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'confirm-decline' && (
          <motion.div
            key="confirm-decline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: animation.easeOut }}
          >
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-critical" size={24} />
              <h2 className="text-xl font-semibold tracking-[-0.01em] text-primary">
                DECLINE THIS REFERRAL?
              </h2>
            </div>

            <p className="text-muted text-[0.9375rem] mb-4">
              Please provide a reason. CARE ROUTE will automatically search for the next suitable hospital.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {declineOptions.map(option => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    declineReason === option 
                      ? 'border-critical bg-critical/5 text-primary' 
                      : 'border-border hover:border-primary/30 text-muted hover:text-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    value={option}
                    checked={declineReason === option}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="hidden"
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    declineReason === option ? 'border-critical' : 'border-border'
                  }`}>
                    {declineReason === option && <div className="w-2 h-2 rounded-full bg-critical" />}
                  </div>
                  <span className="text-[0.875rem] font-medium">{option}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="primary"
                className="w-full sm:w-auto bg-critical hover:bg-critical/90 text-white justify-center border-transparent shadow-[0_4px_14px_0_rgba(166,83,83,0.39)]"
                onClick={handleDecline}
                disabled={!declineReason}
              >
                Confirm Decline
              </Button>
              <Button
                variant="ghost"
                className="w-full sm:w-auto justify-center"
                onClick={() => setStep('decision')}
              >
                Go Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
