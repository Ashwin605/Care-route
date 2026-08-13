"use client";

import React, { useState, useEffect } from 'react';
import { HospitalProfile, CapacityMetric, SpecialistMetric } from '../../types/hospital';
import { MapPin, Navigation, Clock, Activity, Users, BedDouble, AlertTriangle, Send, CheckCircle2, ShieldAlert, Accessibility, X } from 'lucide-react';
import { openDirections } from '../../lib/location/navigationService';
import { getCurrentLocation } from '../../lib/location/geolocation';
import { calculateDistance, calculateETA } from '../../lib/intelligence/etaService';
import { Location } from '../../types/patient';
import HospitalLoadTrend from '../intelligence/HospitalLoadTrend';
import { analyzeHospitalLoad } from '../../lib/intelligence/capacityForecast';
import { useRouter } from 'next/navigation';
import StartJourneyDialog from '../journey/StartJourneyDialog';
import { analyzeHealthcareNetwork } from '../../lib/intelligence/networkAnalyzer';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';
import { Recommendation } from '../../types/recommendation';
import { CareRequirement } from '../../types/care';
import { Referral } from '../../types/referral';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------
// Sub-components
// ----------------------------------------------------

function HospitalFreshness({ lastUpdate }: { lastUpdate: string }) {
  const diff = Date.now() - new Date(lastUpdate).getTime();
  const minutes = Math.floor(diff / 60000);
  
  let freshnessStr = minutes < 1 ? 'Updated just now' : `Capacity updated ${minutes}m ago`;
  let isStale = minutes > 30;

  return (
    <div className={`p-4 rounded-xl border ${isStale ? 'bg-[var(--cr-warning)]/10 border-[var(--cr-warning)]/20' : 'bg-white border-[var(--cr-border)]'}`}>
      <div className="flex items-center gap-2">
        <Clock size={16} className={isStale ? 'text-[var(--cr-warning)]' : 'text-[var(--cr-muted)]'} />
        <span className={`text-sm font-medium ${isStale ? 'text-[var(--cr-warning)]' : 'text-[var(--cr-deep-text)]'}`}>
          {freshnessStr}
        </span>
      </div>
      {isStale && (
        <p className="text-xs text-[var(--cr-warning)] mt-1 ml-6 opacity-80">
          Availability may have changed. Verification recommended.
        </p>
      )}
    </div>
  );
}

function HospitalCapacity({ capacity }: { capacity: CapacityMetric[] }) {
  if (capacity.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--cr-deep-text)]">
          <BedDouble size={20} className="text-[var(--cr-primary)]" />
          Current Capacity
        </h3>
        <span className="text-[10px] font-bold tracking-widest text-[var(--cr-muted)] uppercase bg-[var(--cr-background)] px-2 py-1 rounded">
          SIMULATED PROTOTYPE DATA
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {capacity.map(c => {
          const loadIntel = analyzeHospitalLoad('h-detail', c, 0, 0); 
          
          return (
            <HospitalLoadTrend 
              key={c.id}
              resourceName={c.name}
              currentAvailable={c.available}
              total={c.total}
              status={c.status}
              loadIntel={c.total > 0 ? loadIntel : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

function HospitalSpecialists({ specialists }: { specialists: SpecialistMetric[] }) {
  if (specialists.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--cr-deep-text)] mb-6">
        <Users size={20} className="text-[var(--cr-primary)]" />
        Specialists
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {specialists.map(s => (
          <div key={s.id} className="flex items-center gap-2 px-3 py-2 bg-[var(--cr-background)] rounded-lg border border-[var(--cr-border)]">
            <div className={`w-2 h-2 rounded-full ${
              s.status === 'AVAILABLE' ? 'bg-[var(--cr-success)]' :
              s.status === 'LIMITED' ? 'bg-[var(--cr-warning)]' : 'bg-[var(--cr-critical)]'
            }`} />
            <span className="text-sm font-medium text-[var(--cr-deep-text)]">{s.specialty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HospitalAccessibility({ features }: { features?: string[] }) {
  if (!features || features.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm mt-8">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--cr-deep-text)] mb-6">
        <Accessibility size={20} className="text-[var(--cr-primary)]" />
        Accessibility
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[var(--cr-background)] rounded-lg border border-[var(--cr-border)]">
            <CheckCircle2 size={16} className="text-[var(--cr-success)]" />
            <span className="text-sm font-medium text-[var(--cr-deep-text)]">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Send Referral Dialog
// ----------------------------------------------------

interface SendReferralDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: HospitalProfile;
  onReferralSent: (referral: Referral) => void;
}

function SendReferralDialog({ isOpen, onClose, hospital, onReferralSent }: SendReferralDialogProps) {
  const [patientRef, setPatientRef] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const availableResources = ['ICU', 'Ventilator', 'General Beds', 'Emergency', 'Operating Theatre'];

  const toggleResource = (r: string) => {
    setSelectedResources(prev => 
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const now = new Date().toISOString();
    const referral: Referral = {
      id: uuidv4(),
      patientReference: patientRef || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      referrerId: 'current-user', // Will be overridden by auth context
      destinationHospitalId: hospital.id,
      destinationHospitalName: hospital.name,
      careRequirement: {
        resources: selectedResources,
        specialists: [],
        radiusKm: 50,
      },
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      notes: notes || undefined,
    };

    // Get the current user from localStorage
    try {
      const storedUser = localStorage.getItem('care_route_mock_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        referral.referrerId = user.id || user.email || 'current-user';
      }
    } catch (e) {}

    // Save to localStorage
    const existingRaw = localStorage.getItem('careRoute_referrals');
    const existing: Referral[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(referral);
    localStorage.setItem('careRoute_referrals', JSON.stringify(existing));

    // Dispatch event for cross-component updates
    window.dispatchEvent(new CustomEvent('careRouteReferralCreated', { detail: referral }));

    setIsSending(false);
    onReferralSent(referral);
    onClose();
    
    // Reset form
    setPatientRef('');
    setNotes('');
    setSelectedResources([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--cr-border)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--cr-border)]">
          <div>
            <h2 className="text-xl font-semibold text-[var(--cr-deep-text)]">Send Referral</h2>
            <p className="text-sm text-[var(--cr-muted)] mt-1">to {hospital.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--cr-background)] rounded-full transition-colors">
            <X size={20} className="text-[var(--cr-muted)]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Patient Reference */}
          <div>
            <label className="block text-sm font-medium text-[var(--cr-deep-text)] mb-1.5">
              Patient Reference
            </label>
            <input
              type="text"
              value={patientRef}
              onChange={e => setPatientRef(e.target.value)}
              placeholder="e.g. PT-8429 (auto-generated if empty)"
              className="w-full px-4 py-2.5 text-sm border border-[var(--cr-border)] rounded-xl bg-[var(--cr-background)] text-[var(--cr-deep-text)] placeholder:text-[var(--cr-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/20 focus:border-[var(--cr-primary)] transition-all"
            />
          </div>

          {/* Required Resources */}
          <div>
            <label className="block text-sm font-medium text-[var(--cr-deep-text)] mb-2">
              Required Resources
            </label>
            <div className="flex flex-wrap gap-2">
              {availableResources.map(r => (
                <button
                  key={r}
                  onClick={() => toggleResource(r)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedResources.includes(r)
                      ? 'bg-[var(--cr-primary)] text-white border-[var(--cr-primary)] shadow-sm'
                      : 'bg-white text-[var(--cr-deep-text)] border-[var(--cr-border)] hover:border-[var(--cr-primary)]/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[var(--cr-deep-text)] mb-1.5">
              Clinical Notes <span className="text-[var(--cr-muted)] font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Brief summary of patient condition and care needs..."
              rows={3}
              className="w-full px-4 py-2.5 text-sm border border-[var(--cr-border)] rounded-xl bg-[var(--cr-background)] text-[var(--cr-deep-text)] placeholder:text-[var(--cr-muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/20 focus:border-[var(--cr-primary)] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--cr-border)]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-[var(--cr-deep-text)] bg-white border border-[var(--cr-border)] rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[var(--cr-primary)] rounded-xl shadow-lg shadow-[var(--cr-primary)]/20 hover:bg-[var(--cr-primary)]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Referral
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Main Hospital Detail Component
// ----------------------------------------------------

interface HospitalDetailProps {
  hospital: HospitalProfile;
  capacity: CapacityMetric[];
  specialists: SpecialistMetric[];
}

export default function HospitalDetail({ hospital, capacity, specialists }: HospitalDetailProps) {
  const [userLoc, setUserLoc] = useState<Location | null>(null);
  const [distStr, setDistStr] = useState<string | null>(null);
  const [etaStr, setEtaStr] = useState<string | null>(null);
  const [referralSent, setReferralSent] = useState(false);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [sentReferralId, setSentReferralId] = useState<string | null>(null);
  const [isJourneyDialogOpen, setIsJourneyDialogOpen] = useState(false);
  const [journeyRec, setJourneyRec] = useState<Recommendation | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentLocation().then(loc => {
      setUserLoc(loc);
      if (loc && hospital.coordinates) {
        const d = calculateDistance(loc, hospital.coordinates);
        setDistStr(`${d.toFixed(1)} km`);
        setEtaStr(`${calculateETA(d)} min`);
      }
    }).catch(() => {});
  }, [hospital.coordinates]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'text-[var(--cr-success)] bg-[var(--cr-success)]/10';
      case 'DEGRADED': return 'text-[var(--cr-warning)] bg-[var(--cr-warning)]/10';
      case 'MAINTENANCE': return 'text-[var(--cr-muted)] bg-[var(--cr-muted)]/10';
      default: return 'text-[var(--cr-primary)] bg-[var(--cr-primary)]/10';
    }
  };

  const handleStartJourney = () => {
    let reqs: CareRequirement = { resources: [], specialists: [], radiusKm: 50 };
    const reqsStr = localStorage.getItem('careRequirements');
    if (reqsStr) {
      try {
        reqs = JSON.parse(reqsStr);
      } catch (e) {}
    }

    const intel = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, reqs);
    let rec = intel.recommendedHospital?.hospital.id === hospital.id ? intel.recommendedHospital : null;
    if (!rec) rec = intel.alternatives.find(a => a.hospital.id === hospital.id) || null;
    
    if (!rec) {
      rec = {
        hospital: hospital,
        matchScore: 0,
        distanceKm: userLoc && hospital.coordinates ? calculateDistance(userLoc, hospital.coordinates) : 0,
        etaMinutes: userLoc && hospital.coordinates ? calculateETA(calculateDistance(userLoc, hospital.coordinates)) : 0,
        reasons: [],
        missingRequirements: []
      };
    }
    
    setJourneyRec(rec);
    setIsJourneyDialogOpen(true);
  };

  const handleReferralSent = (referral: Referral) => {
    setReferralSent(true);
    setSentReferralId(referral.id);
    // Auto-dismiss success banner after 8 seconds
    setTimeout(() => setReferralSent(false), 8000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Referral success banner */}
      {referralSent && (
        <div className="flex items-center gap-3 p-4 bg-[var(--cr-success)]/10 border border-[var(--cr-success)]/20 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 size={20} className="text-[var(--cr-success)] flex-shrink-0" />
          <div className="flex-grow">
            <p className="text-sm font-semibold text-[var(--cr-deep-text)]">Referral sent successfully!</p>
            <p className="text-xs text-[var(--cr-muted)] mt-0.5">
              Your referral to {hospital.name} is now pending review. You can track its status in the referrals dashboard.
            </p>
          </div>
          <button onClick={() => setReferralSent(false)} className="p-1 hover:bg-[var(--cr-success)]/10 rounded-full transition-colors">
            <X size={16} className="text-[var(--cr-muted)]" />
          </button>
        </div>
      )}
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-[var(--cr-border)]">
        <div>
          <h1 className="text-4xl font-semibold text-[var(--cr-deep-text)] mb-3 leading-tight">
            {hospital.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(hospital.networkStatus)}`}>
              <Activity size={12} />
              {hospital.networkStatus}
            </span>
            {hospital.emergencyStatus && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(hospital.emergencyStatus)}`}>
                <ShieldAlert size={12} />
                EMERGENCY: {hospital.emergencyStatus}
              </span>
            )}
            {hospital.address && (
              <span className="flex items-center gap-1.5 text-[var(--cr-muted)]">
                <MapPin size={16} /> {hospital.address}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
          {distStr && (
            <div className="flex items-center justify-between md:justify-end gap-6 text-sm font-medium p-3 bg-white border border-[var(--cr-border)] rounded-xl">
              <span className="flex items-center gap-1.5 text-[var(--cr-muted)]"><Navigation size={16}/> {distStr}</span>
              <span className="flex items-center gap-1.5 text-[var(--cr-primary)]"><Clock size={16}/> {etaStr} ETA</span>
            </div>
          )}
          {hospital.coordinates && (
            <>
              <button
                onClick={handleStartJourney}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--cr-primary)] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[var(--cr-primary)]/20 hover:bg-[var(--cr-primary)]/90"
              >
                <Navigation size={18} /> Start CARE ROUTE
              </button>
              <button
                onClick={() => setIsReferralDialogOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[var(--cr-primary)]/30 text-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/5 font-medium rounded-xl transition-colors shadow-sm"
              >
                <Send size={16} />
                Send Referral
              </button>
            </>
          )}
        </div>
      </div>

      {/* Freshness */}
      <HospitalFreshness lastUpdate={hospital.lastUpdate} />

      {/* Grid for Capacity and Specialists */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <HospitalCapacity capacity={capacity} />
        <HospitalSpecialists specialists={specialists} />
      </div>

    {/* Accessibility Features */}
      <HospitalAccessibility features={hospital.accessibilityFeatures} />

      {/* Modals */}
      {journeyRec && (
        <StartJourneyDialog 
          isOpen={isJourneyDialogOpen}
          onClose={() => setIsJourneyDialogOpen(false)}
          recommendation={journeyRec}
          onJourneyStarted={(id) => router.push(`/care-route/live/${id}`)}
        />
      )}

      <SendReferralDialog
        isOpen={isReferralDialogOpen}
        onClose={() => setIsReferralDialogOpen(false)}
        hospital={hospital}
        onReferralSent={handleReferralSent}
      />

    </div>
  );
}
