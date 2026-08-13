"use client";

import React from 'react';
import { HospitalProfile } from '../../types/hospital';
import { Activity, Clock, ChevronRight, Navigation } from 'lucide-react';
import Link from 'next/link';
import { calculateDistance, calculateETA } from '../../lib/intelligence/etaService';
import { calculateTotalTimeToCare } from '../../lib/intelligence/totalTimeToCare';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';
import { getCurrentLocation } from '../../lib/location/geolocation';
import { Location } from '../../types/patient';

interface HospitalPreviewProps {
  hospital: HospitalProfile;
}

export default function HospitalPreview({ hospital }: HospitalPreviewProps) {
  const [userLocation, setUserLocation] = React.useState<Location | null>(null);

  React.useEffect(() => {
    getCurrentLocation().then(setUserLocation).catch(() => {
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'text-[var(--cr-success)] bg-[var(--cr-success)]/10';
      case 'DEGRADED': return 'text-[var(--cr-warning)] bg-[var(--cr-warning)]/10';
      case 'MAINTENANCE': return 'text-[var(--cr-muted)] bg-[var(--cr-muted)]/10';
      default: return 'text-[var(--cr-primary)] bg-[var(--cr-primary)]/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'Operational';
      case 'DEGRADED': return 'Limited Capacity';
      case 'MAINTENANCE': return 'Maintenance';
      default: return status;
    }
  };

  // Simple relative time formatted
  const getRelativeTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Updated just now';
    if (minutes < 60) return `Updated ${minutes}m ago`;
    return `Updated ${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="w-[240px] p-1 font-sans">
      <h3 className="text-base font-semibold text-[var(--cr-deep-text)] mb-1 leading-tight">
        {hospital.name}
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(hospital.networkStatus)}`}>
          <Activity size={10} />
          {getStatusText(hospital.networkStatus)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[var(--cr-muted)] mb-4">
        <Clock size={12} />
        <span>{getRelativeTime(hospital.lastUpdate)}</span>
      </div>

      {(() => {
        if (!userLocation || !hospital.coordinates) return null;
        const dist = calculateDistance(userLocation, hospital.coordinates);
        const eta = calculateETA(dist);
        // Mock requirement for demo purposes to get a valid time to care
        const mockReq = { careType: null, urgency: 'URGENT' as const, resources: [], specialist: null, location: userLocation, radiusKm: 50, accessibilityNeeds: [] };
        const timeToCare = calculateTotalTimeToCare(hospital, mockReq, eta, MOCK_CAPACITY[hospital.id] || [], MOCK_SPECIALISTS[hospital.id] || []);
        
        return (
          <div className="mb-4 p-2 bg-[var(--cr-background)] border border-[var(--cr-border)] rounded text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[var(--cr-muted)]">Travel:</span>
              <span className="font-medium text-[var(--cr-deep-text)]">{timeToCare.travelMinutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--cr-muted)]">Expected intake:</span>
              <span className="font-medium text-[var(--cr-deep-text)]">{timeToCare.estimatedIntakeMinutes} min</span>
            </div>
            <div className="flex justify-between border-t border-[var(--cr-border)] mt-1 pt-1">
              <span className="font-bold text-[var(--cr-primary)]">Total:</span>
              <span className="font-bold text-[var(--cr-primary)]">{timeToCare.totalEstimatedMinutes} min</span>
            </div>
          </div>
        );
      })()}

      <Link 
        href={`/hospitals/${hospital.id}`}
        className="w-full flex items-center justify-between bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white text-sm font-medium py-2 px-3 rounded transition-colors group"
      >
        <span>View Details</span>
        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
