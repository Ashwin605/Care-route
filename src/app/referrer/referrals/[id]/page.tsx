import React from 'react';

export default function ReferralDetails({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <a href="/referrer/referrals" className="text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] transition-colors">
          ← Back to Referrals
        </a>
        <div>
          <h1 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Referral Details</h1>
          <p className="text-[var(--cr-muted)] mt-1">ID: {params.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-8">
        <p className="text-[var(--cr-muted)]">This referral is currently being processed by the CARE ROUTE network.</p>
      </div>
    </div>
  );
}
