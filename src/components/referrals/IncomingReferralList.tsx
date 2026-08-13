'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';
import Link from 'next/link';
import { Clock, Navigation, AlertTriangle, CheckCircle2, UserRound, MapPin } from 'lucide-react';
import { DetailedReferral } from '@/types/hospital';
import Button from '@/components/ui/Button';

// ============================================================
// CARE ROUTE — Incoming Referral List
// ============================================================

export default function IncomingReferralList() {
  const { incomingReferrals } = useHospital();

  const getUrgencyColor = (urgency: DetailedReferral['urgency']) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-critical/10 text-critical border-critical/20';
      case 'URGENT': return 'bg-warning/10 text-warning border-warning/20';
      case 'STANDARD': return 'bg-primary/5 text-primary border-border';
      default: return 'bg-primary/5 text-primary border-border';
    }
  };

  const getTimeAgo = (isoString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    return `${diff} min ago`;
  };

  if (incomingReferrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-border border-dashed rounded-xl bg-white/50">
        <CheckCircle2 size={48} className="text-muted/30 mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium text-primary mb-2">No incoming referrals</h3>
        <p className="text-muted text-[0.9375rem] max-w-sm">
          You have responded to all pending requests. New referrals will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {incomingReferrals.map((referral, i) => (
        <motion.div
          key={referral.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: animation.easeOut }}
          className="bg-white border border-border rounded-xl p-6 transition-all hover:border-primary/20 hover:shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Header & Urgency */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[0.8125rem] font-bold tracking-[0.04em] text-primary">
                  {referral.id}
                </span>
                <span className={`text-[0.6875rem] font-bold uppercase tracking-[0.04em] px-2 py-0.5 rounded-sm border ${getUrgencyColor(referral.urgency)}`}>
                  {referral.urgency}
                </span>
                <span className="text-[0.8125rem] font-medium text-muted flex items-center gap-1.5 ml-auto lg:ml-0">
                  <Clock size={14} />
                  Received {getTimeAgo(referral.receivedAt)}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-primary tracking-[-0.01em] mb-1 truncate">
                {referral.condition}
              </h3>
              <div className="text-[0.9375rem] text-muted flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <UserRound size={16} /> Patient {referral.patientId} (Age {referral.age})
                </span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} /> {referral.distance} km
                </span>
              </div>
            </div>

            {/* Requirements & ETA */}
            <div className="flex-1 lg:border-l lg:border-border lg:pl-6 py-2 lg:py-0 min-w-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[0.6875rem] uppercase tracking-[0.04em] font-medium text-muted mb-2">
                    Patient ETA
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                    <Navigation size={18} className="text-primary/50" />
                    {referral.patientETA} min
                  </div>
                </div>
                <div>
                  <p className="text-[0.6875rem] uppercase tracking-[0.04em] font-medium text-muted mb-2">
                    Required Resources
                  </p>
                  <p className="text-[0.875rem] text-primary truncate" title={referral.requiredResources.join(', ')}>
                    {referral.requiredResources.slice(0, 2).join(', ')}
                    {referral.requiredResources.length > 2 && (
                      <span className="text-muted"> +{referral.requiredResources.length - 2}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="lg:w-48 flex justify-end shrink-0">
              <Button
                href={`/hospital/referrals/${referral.id}`}
                variant="primary"
                className="w-full justify-center"
              >
                Review Referral →
              </Button>
            </div>

          </div>
        </motion.div>
      ))}
    </div>
  );
}
