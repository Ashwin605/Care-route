'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { Bell, User } from 'lucide-react';
import NetworkStatusIndicator from './NetworkStatus';

// ============================================================
// CARE ROUTE — Hospital Header
// ============================================================

export default function HospitalHeader() {
  const { profile, incomingReferrals } = useHospital();
  
  const pendingCount = incomingReferrals.filter(r => r.status === 'AWAITING_RESPONSE').length;

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <h2 className="text-[0.9375rem] font-semibold text-primary">{profile.name}</h2>
        <div className="hidden sm:block w-px h-4 bg-border" />
        <div className="hidden sm:block">
          <NetworkStatusIndicator minimal />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-background">
          <Bell size={18} strokeWidth={1.5} />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full border border-white" />
          )}
        </button>
        
        <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-primary hover:bg-border/50 transition-colors">
          <User size={16} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
