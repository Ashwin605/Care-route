import React from 'react';
import { Recommendation, MatchReason } from '../../types/recommendation';
import Link from 'next/link';
import { ChevronRight, Check, X, Clock, Navigation } from 'lucide-react';
import { openDirections } from '../../lib/location/navigationService';
import TotalTimeToCare from '../intelligence/TotalTimeToCare';

export function RecommendationReasons({ reasons }: { reasons: MatchReason[] }) {
  return (
    <div className="flex flex-col gap-2">
      {reasons.map((reason, idx) => (
        <div key={idx} className="flex items-start gap-2 text-sm">
          {reason.met ? (
            <Check size={16} className="text-[var(--cr-success)] mt-0.5 flex-shrink-0" />
          ) : (
            <X size={16} className="text-[var(--cr-critical)] mt-0.5 flex-shrink-0" />
          )}
          <span className={reason.met ? "text-[var(--cr-deep-text)]" : "text-[var(--cr-muted)] line-through opacity-70"}>
            {reason.description}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HospitalAccessibility({ features }: { features?: string[] }) {
  if (!features || features.length === 0) return null;
  return (
    <div className="mb-6">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--cr-muted)] block mb-3">Accessibility</span>
      <div className="flex flex-col gap-2">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-[var(--cr-deep-text)]">
            <Check size={16} className="text-[var(--cr-primary)] flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArrivalCapacity({ recommendation }: { recommendation: Recommendation }) {
  const cap = recommendation.expectedArrivalCapacity;
  if (!cap) return null;

  return (
    <div className="bg-[var(--cr-background)] border border-[var(--cr-border)] rounded-xl p-4 mt-6">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--cr-muted)] mb-4">Capacity Forecast</h4>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="block text-[10px] uppercase font-bold text-[var(--cr-muted)] mb-1">Available Now</span>
          <span className="text-lg font-medium text-[var(--cr-deep-text)]">{cap.currentAvailable} {cap.resourceName} beds</span>
        </div>
        
        <div>
          <span className="block text-[10px] uppercase font-bold text-[var(--cr-muted)] mb-1">Patient ETA</span>
          <span className="text-lg font-medium text-[var(--cr-primary)] flex items-center gap-1">
            <Clock size={16} /> {recommendation.etaMinutes} min
          </span>
        </div>

        <div>
          <span className="block text-[10px] uppercase font-bold text-[var(--cr-muted)] mb-1">Expected at Arrival</span>
          <span className={`text-lg font-bold flex items-center gap-1 ${cap.expectedAvailable > 0 ? 'text-[var(--cr-success)]' : 'text-[var(--cr-critical)]'}`}>
            {cap.expectedAvailable} {cap.resourceName} beds
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RecommendedHospital({ recommendation, isBestMatch }: { recommendation: Recommendation, isBestMatch: boolean }) {
  const { hospital, matchScore, distanceKm, etaMinutes, reasons } = recommendation;

  return (
    <div className={`relative bg-white rounded-2xl border transition-all ${
      isBestMatch ? 'border-[var(--cr-primary)] shadow-lg' : 'border-[var(--cr-border)] shadow-sm hover:border-[var(--cr-sage)]'
    }`}>
      {isBestMatch && (
        <div className="absolute -top-3 right-6 bg-[var(--cr-primary)] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
          Top Recommendation
        </div>
      )}

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold text-[var(--cr-deep-text)] mb-2 leading-tight">
              {hospital.name}
            </h2>
            
            <div className="flex items-center gap-4 text-sm font-medium text-[var(--cr-muted)] mb-6">
              <span className="flex items-center gap-1 text-[var(--cr-primary)]"><Navigation size={14}/> {distanceKm} km</span>
              <span className="flex items-center gap-1"><Clock size={14}/> {etaMinutes} min ETA</span>
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--cr-muted)] block mb-3">Why this hospital?</span>
              <RecommendationReasons reasons={reasons} />
            </div>

            <HospitalAccessibility features={hospital.accessibilityFeatures} />

            {recommendation.totalTimeToCare && (
              <TotalTimeToCare data={recommendation.totalTimeToCare} />
            )}

            {isBestMatch && <ArrivalCapacity recommendation={recommendation} />}
          </div>

          <div className="flex flex-col items-end flex-shrink-0 min-w-[120px]">
            <div className="text-right mb-6">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--cr-muted)] mb-1">Match Score</span>
              <span className="text-4xl font-light text-[var(--cr-primary)]">{matchScore}%</span>
              <span className="block text-[8px] text-[var(--cr-muted)] mt-1 opacity-70">SIMULATED MATCH</span>
            </div>

            <div className="w-full space-y-2">
              <Link 
                href={isBestMatch ? `/journey/${hospital.id}` : `/hospitals/${hospital.id}`}
                className={`w-full flex items-center justify-center gap-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  isBestMatch 
                    ? 'bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white shadow-sm'
                    : 'bg-[var(--cr-background)] border border-[var(--cr-border)] hover:border-[var(--cr-primary)] text-[var(--cr-primary)]'
                }`}
              >
                {isBestMatch ? 'Confirm & Start Journey' : 'View Hospital'} <ChevronRight size={16} />
              </Link>
              
              {hospital.coordinates && (
                <button
                  onClick={() => openDirections(hospital.coordinates!)}
                  className="w-full py-2.5 text-sm font-medium text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors"
                >
                  Get Directions
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
