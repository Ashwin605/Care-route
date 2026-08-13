'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { motion } from 'framer-motion';
import { animation } from '@/lib/tokens';
import NetworkStatusIndicator from '@/components/hospital/NetworkStatus';
import { DetailedReferral } from '@/types/hospital';

// ============================================================
// CARE ROUTE — Referral History
// ============================================================

export default function HistoryPage() {
  const { referralHistory } = useHospital();

  const getStatusStyle = (status: DetailedReferral['status']) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-success/10 text-success border-success/20';
      case 'DECLINED': return 'bg-critical/10 text-critical border-critical/20';
      case 'REROUTED': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-primary/5 text-primary border-border';
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: animation.easeOut }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
      >
        <div>
          <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-muted mb-3">
            Referral Management
          </p>
          <h1 className="text-editorial text-3xl md:text-4xl text-primary leading-[1.1]">
            REFERRAL HISTORY
          </h1>
        </div>
        <div className="shrink-0">
          <NetworkStatusIndicator minimal />
        </div>
      </motion.div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted">ID</th>
                <th className="px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted">Condition</th>
                <th className="px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted">Urgency</th>
                <th className="px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted">Decision</th>
                <th className="px-6 py-4 text-[0.75rem] font-medium uppercase tracking-[0.04em] text-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {referralHistory.map((ref, i) => (
                <motion.tr
                  key={ref.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-background/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-[0.875rem] font-semibold text-primary">{ref.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[0.875rem] font-medium text-primary">{ref.condition}</div>
                    <div className="text-[0.75rem] text-muted">{ref.specialty}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[0.8125rem] font-medium text-primary">{ref.urgency}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[0.6875rem] font-bold uppercase tracking-[0.04em] px-2 py-1 rounded-sm border ${getStatusStyle(ref.status)}`}>
                      {ref.status}
                    </span>
                    {ref.status === 'DECLINED' && ref.declineReason && (
                      <div className="text-[0.75rem] text-muted mt-1 max-w-[200px] truncate" title={ref.declineReason}>
                        {ref.declineReason}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[0.8125rem] text-muted">
                    {new Date(ref.receivedAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
              {referralHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">
                    No historical referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
