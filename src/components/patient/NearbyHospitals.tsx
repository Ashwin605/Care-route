import React, { useEffect, useRef } from 'react';
import { HospitalProfile } from '../../types/hospital';
import { Location } from '../../types/patient';
import { calculateDistance, calculateETA } from '../../lib/intelligence/etaService';
import { Activity, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';

interface NearbyHospitalsProps {
  hospitals: HospitalProfile[];
  userLocation: Location | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function NearbyHospitals({ hospitals, userLocation, selectedId, onSelect }: NearbyHospitalsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId && containerRef.current) {
      const selectedEl = containerRef.current.querySelector(`[data-hospital-id="${selectedId}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedId]);
  
  return (
    <div className="flex flex-col gap-3 pb-8" ref={containerRef}>
      {hospitals.map((hospital) => {
        const isSelected = selectedId === hospital.id;
        let distanceStr = '';
        let etaStr = '';
        
        if (userLocation && hospital.coordinates) {
          const dist = calculateDistance(userLocation, hospital.coordinates);
          const eta = calculateETA(dist);
          distanceStr = `${dist.toFixed(1)} km`;
          etaStr = `${eta} min`;
        }

        // Get key resources (ICU, Emergency, Ventilator)
        const capacity = MOCK_CAPACITY[hospital.id] || [];
        const icu = capacity.find(c => c.name === 'ICU');
        const emergency = capacity.find(c => c.name === 'Emergency');

        // Get specialties (Cardiology or Neurology or top one)
        const specialists = MOCK_SPECIALISTS[hospital.id] || [];
        const cardiology = specialists.find(s => s.specialty === 'Cardiology');
        const availableSpec = cardiology || specialists.find(s => s.status === 'AVAILABLE');

        // Freshness
        const diff = Date.now() - new Date(hospital.lastUpdate).getTime();
        const minsAgo = Math.max(0, Math.floor(diff / 60000));
        let freshnessStr = minsAgo < 1 ? 'Updated just now' : `Updated: ${minsAgo}m ago`;

        return (
          <div 
            key={hospital.id}
            data-hospital-id={hospital.id}
            onClick={() => onSelect(hospital.id)}
            className={`
              p-4 rounded-xl border transition-all cursor-pointer
              ${isSelected 
                ? 'border-[var(--cr-secondary)] bg-[var(--cr-background)] shadow-sm' 
                : 'border-[var(--cr-border)] bg-white hover:border-[var(--cr-sage)]'}
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[var(--cr-deep-text)] leading-tight">{hospital.name}</h4>
              {distanceStr && (
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-medium text-[var(--cr-primary)]">{distanceStr}</span>
                  <span className="text-xs text-[var(--cr-muted)]">{etaStr}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                hospital.networkStatus === 'OPERATIONAL' ? 'bg-[var(--cr-success)]' :
                hospital.networkStatus === 'DEGRADED' ? 'bg-[var(--cr-warning)]' : 'bg-[var(--cr-muted)]'
              }`} />
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--cr-muted)]">
                {hospital.networkStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {icu && (
                <div className="bg-[var(--cr-background)] p-2 rounded">
                  <span className="block text-[10px] text-[var(--cr-muted)] uppercase font-bold tracking-wider mb-0.5">ICU</span>
                  <span className="text-sm font-medium text-[var(--cr-deep-text)]">
                    {icu.available > 0 ? `${icu.available} available` : 'Unavailable'}
                  </span>
                </div>
              )}
              {emergency && (
                <div className="bg-[var(--cr-background)] p-2 rounded">
                  <span className="block text-[10px] text-[var(--cr-muted)] uppercase font-bold tracking-wider mb-0.5">Emergency</span>
                  <span className="text-sm font-medium text-[var(--cr-deep-text)]">
                    {emergency.status === 'AVAILABLE' ? 'Operational' : 'Limited'}
                  </span>
                </div>
              )}
              {availableSpec && (
                <div className="bg-[var(--cr-background)] p-2 rounded col-span-2 sm:col-span-1">
                  <span className="block text-[10px] text-[var(--cr-muted)] uppercase font-bold tracking-wider mb-0.5">{availableSpec.specialty}</span>
                  <span className="text-sm font-medium text-[var(--cr-deep-text)]">
                    {availableSpec.status === 'AVAILABLE' ? `${availableSpec.availableCount} available` : 'Unavailable'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--cr-border)]">
              <span className="text-xs text-[var(--cr-muted)] flex items-center gap-1">
                <Clock size={12} />
                {freshnessStr}
              </span>
              <Link 
                href={`/hospitals/${hospital.id}`}
                className="text-sm font-medium text-[var(--cr-primary)] hover:text-[var(--cr-secondary)] flex items-center gap-1 transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevent selecting the card when clicking the link
              >
                View Hospital <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
