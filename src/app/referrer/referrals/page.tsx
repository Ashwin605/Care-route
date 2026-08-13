import React from 'react';

export default function ReferralsHub() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Active Referrals</h1>
          <p className="text-[var(--cr-muted)] mt-1">Track and manage your outgoing patient referrals.</p>
        </div>
        <button className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors">
          Create Referral
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[var(--cr-primary)]/10 rounded-full flex items-center justify-center mb-4 text-[var(--cr-primary)]">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--cr-deep-text)] mb-2">No active referrals</h3>
        <p className="text-sm text-[var(--cr-muted)] max-w-md">
          You don't have any active referrals. Create a new referral to connect a patient with the CARE ROUTE network.
        </p>
      </div>
    </div>
  );
}
