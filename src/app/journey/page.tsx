"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CareJourney } from '../../types/journey';
import { getActiveJourney, clearActiveJourney } from '../../lib/journeyState';
import { Navigation, Clock, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ActiveJourneyPage() {
  const router = useRouter();
  const [journey, setJourney] = useState<CareJourney | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = getActiveJourney();
    if (!active) {
      router.push('/find-care');
    } else {
      setJourney(active);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !journey) {
    return <div className="min-h-screen bg-[var(--cr-background)] flex items-center justify-center">Loading journey...</div>;
  }

  const handleCancel = () => {
    clearActiveJourney();
    router.push('/find-care');
  };

  return (
    <div className="min-h-screen bg-[var(--cr-background)] flex flex-col">
      <header className="bg-white border-b border-[var(--cr-border)] p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--cr-primary)]/10 rounded-full flex items-center justify-center text-[var(--cr-primary)]">
            <Navigation size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Active Care Route</h1>
            <p className="text-xs text-[var(--cr-muted)] font-medium mt-0.5 tracking-wide">Monitoring Journey</p>
          </div>
        </div>
        <button 
          onClick={handleCancel}
          className="text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 px-4 py-2 rounded transition-colors"
        >
          Cancel Journey
        </button>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* Foundation Placeholder */}
        <div className="bg-white rounded-2xl border border-[var(--cr-border)] p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border-4 border-blue-100">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--cr-deep-text)] mb-1">Live Monitoring Established</h2>
            <p className="text-sm text-[var(--cr-muted)]">
              Your journey to <span className="font-bold text-[var(--cr-primary)]">{journey.recommendationSnapshot.hospital.name}</span> is active. 
              The CARE ROUTE system is now continuously monitoring the network for constraints.
            </p>
          </div>
        </div>

        {/* Current State */}
        <div className="bg-white rounded-2xl border border-[var(--cr-border)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--cr-border)] pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)]">Current Status</h3>
            <div className="text-xs font-bold text-[var(--cr-success)] bg-[var(--cr-success)]/10 px-2 py-1 rounded">
              {journey.destinationStatus}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-[var(--cr-border)]">
              <Clock size={16} className="text-[var(--cr-primary)] mb-2" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">ETA</div>
              <div className="text-xl font-bold text-[var(--cr-deep-text)]">{journey.currentEta} min</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-[var(--cr-border)]">
              <Navigation size={16} className="text-[var(--cr-primary)] mb-2" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Arrival</div>
              <div className="text-xl font-bold text-[var(--cr-deep-text)]">
                {new Date(journey.estimatedArrival).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
