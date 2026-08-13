import React, { useState } from 'react';
import { CareJourney } from '../../types/journey';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

interface RerouteRecommendationDialogProps {
  journey: CareJourney;
  onAccept: () => void;
  onDecline: () => void;
}

export default function RerouteRecommendationDialog({ journey, onAccept, onDecline }: RerouteRecommendationDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const evalState = journey.latestRerouteEvaluation;
  if (!evalState || evalState.decision !== 'REROUTE_RECOMMENDED' || !evalState.recommendedAlternative) return null;

  const currentHospital = MOCK_HOSPITALS.find(h => h.id === journey.destinationHospitalId);
  const alt = evalState.recommendedAlternative;

  return (
    <div className="fixed inset-0 z-[2000] bg-[var(--cr-deep-text)]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--cr-background)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-[var(--cr-border)]">
        
        {/* Header */}
        <div className="bg-[var(--cr-warning)]/10 p-6 border-b border-[var(--cr-warning)]/20">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-[var(--cr-warning)]" size={24} />
            <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--cr-warning)]">Destination Update</h2>
          </div>
          <p className="text-[var(--cr-deep-text)] font-medium text-lg leading-snug">
             {evalState.explanation}
          </p>
        </div>

        {showConfirmation ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-[var(--cr-deep-text)] mb-2">Switch Destination?</h3>
            <p className="text-sm font-medium text-[var(--cr-muted)] mb-6">
              You are about to cancel your route to <span className="font-bold text-[var(--cr-deep-text)]">{currentHospital?.name}</span> and reroute to <span className="font-bold text-[var(--cr-primary)]">{alt.hospital.name}</span>.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2 rounded-xl text-sm font-bold border border-[var(--cr-border)] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onAccept}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white shadow-lg shadow-[var(--cr-primary)]/20 transition-all"
              >
                Confirm New Destination
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Comparison */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Current */}
              <div className="border border-[var(--cr-border)] rounded-xl p-4 bg-gray-50 flex flex-col relative opacity-70">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-3">Current Destination</div>
                <h3 className="text-xl font-bold text-[var(--cr-deep-text)] mb-1">{currentHospital?.name}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-xs font-bold text-[var(--cr-critical)] bg-[var(--cr-critical)]/10 px-2 py-0.5 rounded flex items-center gap-1">
                     <XCircle size={12} /> {evalState.currentDestinationStatus}
                   </span>
                   <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                     <Clock size={12} /> {journey.initialEta} min ETA
                   </span>
                </div>
                
                <div className="space-y-2 mt-auto">
                   <div className="text-xs font-bold text-[var(--cr-critical)]">Issues:</div>
                   <ul className="text-xs text-[var(--cr-muted)] space-y-1">
                      <li><XCircle size={10} className="inline mr-1 text-[var(--cr-critical)]" /> {evalState.trigger.reason}</li>
                   </ul>
                </div>
              </div>

              {/* Alternative */}
              <div className="border-2 border-[var(--cr-primary)] rounded-xl p-4 bg-white flex flex-col relative shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--cr-primary)] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
                  Recommended Alternative
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-transparent mb-3">.</div>
                <h3 className="text-xl font-bold text-[var(--cr-deep-text)] mb-1">{alt.hospital.name}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-xs font-bold text-[var(--cr-success)] bg-[var(--cr-success)]/10 px-2 py-0.5 rounded flex items-center gap-1">
                     <CheckCircle2 size={12} /> SUITABLE
                   </span>
                   <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                     <Clock size={12} /> {alt.etaMinutes} min ETA
                   </span>
                </div>
                
                <div className="space-y-2 mt-auto">
                   <div className="text-xs font-bold text-[var(--cr-primary)]">Why suitable?</div>
                   <ul className="text-xs text-[var(--cr-muted)] space-y-1">
                      {alt.reasons.map((r, i) => (
                        <li key={i} className={!r.met ? 'text-[var(--cr-critical)] font-medium' : ''}>
                          {r.met ? <CheckCircle2 size={10} className="inline mr-1 text-[var(--cr-success)]" /> : <AlertTriangle size={10} className="inline mr-1 text-[var(--cr-critical)]" />}
                          {r.description}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="p-6 pt-2 bg-gray-50 border-t border-[var(--cr-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                onClick={onDecline}
                className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] transition-colors"
              >
                Keep Current Destination
              </button>
              <button 
                onClick={() => setShowConfirmation(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--cr-primary)]/20 transition-all"
              >
                Switch to {alt.hospital.name} <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
