'use client';

import { DetailedReferral } from '@/types/hospital';
import { useHospital } from '@/contexts/HospitalContext';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

// ============================================================
// CARE ROUTE — Capacity Check Visualization
// ============================================================

interface CapacityCheckProps {
  referral: DetailedReferral;
}

export default function CapacityCheck({ referral }: CapacityCheckProps) {
  const { capacity, specialists } = useHospital();

  return (
    <div className="bg-white border border-border rounded-xl p-8">
      <h2 className="text-xl font-semibold tracking-[-0.01em] text-primary mb-6">
        CAN WE ACCEPT THIS PATIENT?
      </h2>

      <div className="space-y-4">
        {referral.requiredResources.map((req, i) => {
          // Look up resource in capacity or specialists
          const capMatch = capacity.find(c => c.name.toLowerCase().includes(req.toLowerCase()));
          const specMatch = specialists.find(s => s.specialty.toLowerCase().includes(req.toLowerCase()));

          const isAvailable = (capMatch && (capMatch.status === 'AVAILABLE' || capMatch.available > 0)) || 
                              (specMatch && (specMatch.status === 'AVAILABLE' || specMatch.availableCount > 0));
          
          let availableText = 'Unknown';
          if (capMatch) {
            if (capMatch.status) availableText = capMatch.status;
            else availableText = `${capMatch.available} available`;
          } else if (specMatch) {
            if (specMatch.status) availableText = specMatch.status;
            else availableText = `${specMatch.availableCount} specialists`;
          }

          return (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-background border border-border/50 gap-4">
              <div className="flex-1">
                <p className="font-semibold text-primary">{req}</p>
                <div className="flex gap-4 mt-1 text-[0.8125rem] text-muted">
                  <span>Required: 1</span>
                  <span>Available: {availableText}</span>
                </div>
              </div>
              
              <div className="shrink-0 flex items-center justify-end min-w-[120px]">
                {isAvailable ? (
                  <div className="flex items-center gap-1.5 text-success font-bold text-[0.75rem] tracking-[0.04em] uppercase">
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                    Available
                  </div>
                ) : capMatch || specMatch ? (
                  <div className="flex items-center gap-1.5 text-critical font-bold text-[0.75rem] tracking-[0.04em] uppercase">
                    <AlertCircle size={16} strokeWidth={2.5} />
                    Unavailable
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-warning font-bold text-[0.75rem] tracking-[0.04em] uppercase">
                    <HelpCircle size={16} strokeWidth={2.5} />
                    Unmapped
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] uppercase tracking-[0.04em] font-medium text-muted mb-1">
            Expected at arrival ({referral.patientETA} min)
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[0.9375rem] font-semibold text-primary">All required resources expected available</span>
          </div>
        </div>
        <div className="shrink-0 px-3 py-1 bg-sage/10 rounded border border-sage/20 text-[0.6875rem] text-sage font-bold tracking-[0.04em] uppercase">
          High Confidence
        </div>
      </div>
    </div>
  );
}
