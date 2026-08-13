import React from 'react';
import { Recommendation } from '../../types/recommendation';
import { CareJourney } from '../../types/journey';
import { saveActiveJourney } from '../../lib/journeyState';
import { X, Navigation, AlertCircle, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface StartJourneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: Recommendation;
  onJourneyStarted: (journeyId: string) => void;
  referralId?: string;
}

export default function StartJourneyDialog({ isOpen, onClose, recommendation, onJourneyStarted, referralId }: StartJourneyDialogProps) {
  if (!isOpen) return null;

  const now = new Date();
  // Ensure ETA is at least 5 min for display purposes, even if distance couldn't be calculated
  const eta = recommendation.etaMinutes || Math.max(5, Math.round(recommendation.distanceKm || 10));
  const arrivalTime = new Date(now.getTime() + eta * 60000);

  // DEMO MODE: Journey completes in 30 seconds of real time regardless of actual ETA
  const DEMO_DURATION_SECONDS = 30;
  
  const handleStart = () => {
    const startTime = new Date();
    // The "estimated arrival" is set to 30 seconds from now for the demo timer
    const demoArrival = new Date(startTime.getTime() + DEMO_DURATION_SECONDS * 1000);

    // Try to get user's actual location from localStorage (set by geolocation service)
    let originLat = 13.6288; // Default: Tirupati area
    let originLng = 79.4192;
    try {
      const savedLoc = localStorage.getItem('careRoute_userLocation');
      if (savedLoc) {
        const loc = JSON.parse(savedLoc);
        originLat = loc.lat;
        originLng = loc.lng;
      }
    } catch (e) {}

    // Generate the Journey record
    const journey: CareJourney = {
      id: uuidv4(),
      patientId: 'patient-123',
      origin: {
        lat: originLat,
        lng: originLng,
        address: 'Current Location'
      },
      destinationHospitalId: recommendation.hospital.id,
      selectedRecommendationId: recommendation.hospital.id,
      status: 'ACTIVE',
      startedAt: startTime.toISOString(),
      estimatedArrival: demoArrival.toISOString(), // 30s from now for demo
      initialEta: eta,
      currentEta: eta,
      distanceRemaining: recommendation.distanceKm || 10,
      progress: 0,
      destinationStatus: 'SUITABLE',
      monitoringStatus: 'MONITORING',
      recommendationSnapshot: {
        ...recommendation,
        etaMinutes: eta,
        distanceKm: recommendation.distanceKm || 10,
        matchScore: recommendation.matchScore || 0,
      },
      events: [
        {
          id: uuidv4(),
          timestamp: startTime.toISOString(),
          type: 'STARTED',
          description: `Journey started to ${recommendation.hospital.name}`,
        }
      ],
      referralId: referralId
    };
    
    // Persist to local state
    saveActiveJourney(journey);
    
    // Callback to navigate
    onJourneyStarted(journey.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[var(--cr-background)] p-5 border-b border-[var(--cr-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] rounded-full flex items-center justify-center">
              <Navigation size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest">Start CARE ROUTE?</h2>
              <p className="text-xs text-[var(--cr-muted)] mt-0.5">Initialize live journey monitoring</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-[var(--cr-border)] rounded-xl">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Destination</div>
                <div className="text-base font-bold text-[var(--cr-deep-text)]">{recommendation.hospital.name}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Status</div>
                <div className="text-sm font-bold text-[var(--cr-success)] bg-[var(--cr-success)]/10 px-2 py-0.5 rounded">Suitable</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-[var(--cr-border)] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] font-bold flex items-center justify-center text-sm">
                  {Math.round(recommendation.matchScore || 0)}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)]">CARE ROUTE MATCH</div>
                  <div className="text-xs text-[var(--cr-muted)] font-medium">Snapshot generated for routing</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Data Freshness</div>
                <div className="text-xs font-medium text-gray-700">
                  {(() => {
                    const diff = Math.floor((Date.now() - new Date(recommendation.hospital.lastUpdate).getTime()) / 1000);
                    if (diff < 0) return 'Updated just now';
                    return diff < 60 ? `Updated ${diff} seconds ago` : `Updated ${Math.floor(diff/60)} minutes ago`;
                  })()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-[var(--cr-border)] rounded-xl bg-white">
                <Clock size={16} className="text-[var(--cr-primary)] mb-2" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Estimated Journey</div>
                <div className="text-lg font-bold text-[var(--cr-deep-text)]">{eta} min</div>
              </div>
              
              <div className="p-4 border border-[var(--cr-border)] rounded-xl bg-white">
                <Navigation size={16} className="text-[var(--cr-primary)] mb-2" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Estimated Arrival</div>
                <div className="text-lg font-bold text-[var(--cr-deep-text)]">
                  {arrivalTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>
              By starting this CARE ROUTE, we will actively monitor your destination. If a critical constraint occurs, you will be notified and given rerouting options.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 border-t border-[var(--cr-border)] flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-gray-600 bg-white border border-[var(--cr-border)] hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleStart}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 transition-colors shadow-lg shadow-[var(--cr-primary)]/30"
          >
            Start Journey
          </button>
        </div>
      </div>
    </div>
  );
}
