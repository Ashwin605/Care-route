'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { useEffect, useState } from 'react';

// ============================================================
// CARE ROUTE — Network Status Indicator
// ============================================================

export default function NetworkStatusIndicator({ minimal = false }: { minimal?: boolean }) {
  const { profile } = useHospital();
  const [timeAgo, setTimeAgo] = useState('just now');
  const [freshness, setFreshness] = useState<'fresh' | 'recent' | 'stale'>('fresh');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const last = new Date(profile.lastUpdate);
      const diffMs = now.getTime() - last.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);

      if (diffSec < 60) {
        setTimeAgo(`${diffSec} seconds ago`);
      } else if (diffMin === 1) {
        setTimeAgo('1 minute ago');
      } else {
        setTimeAgo(`${diffMin} minutes ago`);
      }

      if (diffMin < 5) setFreshness('fresh');
      else if (diffMin < 15) setFreshness('recent');
      else setFreshness('stale');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [profile.lastUpdate]);

  if (minimal) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${profile.networkStatus === 'OPERATIONAL' ? 'bg-success' : 'bg-warning'}`} />
        <span className="text-[0.75rem] font-medium text-primary tracking-[-0.01em]">
          {profile.networkStatus === 'OPERATIONAL' ? 'Operational' : 'Degraded'}
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 border border-border rounded-xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p className="text-[0.6875rem] font-medium text-muted uppercase tracking-[0.04em] mb-1">
          Network Status
        </p>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className={`w-2.5 h-2.5 rounded-full ${profile.networkStatus === 'OPERATIONAL' ? 'bg-success' : 'bg-warning'}`} />
            <div className={`absolute w-full h-full rounded-full animate-ping opacity-50 ${profile.networkStatus === 'OPERATIONAL' ? 'bg-success' : 'bg-warning'}`} />
          </div>
          <span className="text-[0.9375rem] font-semibold text-primary">
            {profile.networkStatus}
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-10 bg-border" />

      <div>
        <p className="text-[0.6875rem] font-medium text-muted uppercase tracking-[0.04em] mb-1">
          Capacity Data
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[0.9375rem] font-medium text-primary">
            {timeAgo}
          </span>
          <span className={`text-[0.6875rem] px-1.5 py-0.5 rounded-sm font-medium ${
            freshness === 'fresh' ? 'bg-success/10 text-success' :
            freshness === 'recent' ? 'bg-warning/10 text-warning' :
            'bg-critical/10 text-critical'
          }`}>
            {freshness.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-10 bg-border" />

      <div>
        <p className="text-[0.6875rem] font-medium text-muted uppercase tracking-[0.04em] mb-1">
          Data Confidence
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[0.9375rem] font-semibold text-primary">
            {profile.dataConfidence}
          </span>
        </div>
      </div>
    </div>
  );
}
