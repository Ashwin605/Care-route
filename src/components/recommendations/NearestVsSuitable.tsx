import React from 'react';
import { Recommendation } from '../../types/recommendation';
import { HospitalProfile } from '../../types/hospital';
import { X, Check } from 'lucide-react';
import { CareRequirement } from '../../types/care';

interface NearestVsSuitableProps {
  nearest: { hospital: HospitalProfile; distanceKm: number; etaMinutes: number };
  bestMatch: Recommendation;
  requirements: CareRequirement;
}

export default function NearestVsSuitable({ nearest, bestMatch, requirements }: NearestVsSuitableProps) {
  if (nearest.hospital.id === bestMatch.hospitalId) return null;

  const reqResource = requirements.resources.length > 0 ? requirements.resources[0] : 'General Bed';

  return (
    <div className="bg-[var(--cr-background)] border border-[var(--cr-border)] rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 text-center border-b border-[var(--cr-border)] bg-white">
        <h2 className="text-xl font-light text-editorial text-[var(--cr-primary)] tracking-wide">
          THE NEAREST HOSPITAL<br/>ISN'T ALWAYS THE RIGHT HOSPITAL.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--cr-border)]">
        
        {/* Nearest (Rejected) */}
        <div className="p-6 bg-white/50">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-[var(--cr-deep-text)]">{nearest.hospital.name}</h3>
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--cr-deep-text)]">{nearest.distanceKm} km</div>
              <div className="text-xs text-[var(--cr-muted)]">{nearest.etaMinutes} min</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--cr-muted)]">{reqResource} Capacity:</span>
              <span className="font-medium text-[var(--cr-danger)] flex items-center gap-1">
                0 available
              </span>
            </div>
            {requirements.specialist && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--cr-muted)]">{requirements.specialist}:</span>
                <span className="font-medium text-[var(--cr-success)] flex items-center gap-1">
                  Available
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--cr-border)]">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--cr-danger)] mb-1">Result</div>
            <div className="text-sm font-semibold text-[var(--cr-deep-text)] mb-1">NOT SUITABLE</div>
            <div className="text-xs text-[var(--cr-muted)]">Reason: Required capacity unavailable.</div>
          </div>
        </div>

        {/* Suitable (Recommended) */}
        <div className="p-6 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--cr-primary)]" />
          
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-[var(--cr-primary)]">{bestMatch.hospital.name}</h3>
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--cr-deep-text)]">{bestMatch.distanceKm} km</div>
              <div className="text-xs text-[var(--cr-muted)]">{bestMatch.etaMinutes} min</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--cr-muted)]">{reqResource} Now:</span>
              <span className="font-medium text-[var(--cr-deep-text)]">
                {bestMatch.expectedArrivalCapacity?.currentAvailable || 3} available
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--cr-primary)] font-medium">Predicted at arrival:</span>
              <span className="font-bold text-[var(--cr-primary)]">
                {bestMatch.expectedArrivalCapacity?.expectedAvailable || 2}
              </span>
            </div>
            {requirements.specialist && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--cr-muted)]">{requirements.specialist}:</span>
                <span className="font-medium text-[var(--cr-success)] flex items-center gap-1">
                  Available
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--cr-border)]">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--cr-primary)] mb-1">Result</div>
            <div className="text-sm font-semibold text-[var(--cr-deep-text)] flex items-center gap-1">
              <Check size={16} className="text-[var(--cr-primary)]" />
              BEST MATCH
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
