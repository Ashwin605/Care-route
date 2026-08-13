import React from 'react';

export default function HealthcareNetwork() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Healthcare Network</h1>
          <p className="text-[var(--cr-muted)] mt-1">View the live operational status of CARE ROUTE hospitals.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-12 flex flex-col items-center justify-center text-center opacity-70">
        <h3 className="text-lg font-bold text-[var(--cr-deep-text)] mb-2">Network View Restricted</h3>
        <p className="text-sm text-[var(--cr-muted)] max-w-md">
          This feature provides live capacity and operational data across the network. Full access is granted upon verification of your organizational credentials.
        </p>
      </div>
    </div>
  );
}
