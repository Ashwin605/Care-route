"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CheckCircle2, XCircle, AlertTriangle, Building2, User, Clock, Activity, Settings2, Navigation } from 'lucide-react';
import { MOCK_SPECIALISTS } from '../../../../data/mockSpecialists';
import { calculateDistance, calculateETA } from '../../../../lib/intelligence/etaService';
import Link from 'next/link';
import ReferralTimeline from '../../../../components/referrals/ReferralTimeline';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNetworkState } from '../../../../contexts/NetworkStateContext';

export default function ReferralReview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { referrals, activities, hospitals, capacity, acceptReferral, declineReferral } = useNetworkState();
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  
  const localReferral = referrals.find(r => r.id === params.id);
  const localActivities = activities.filter(a => a.referralId === params.id);

  if (!localReferral) {
    return <div className="p-12 text-center text-[var(--cr-muted)]">Referral not found.</div>;
  }

  const hospital = hospitals.find(h => h.id === localReferral.destinationHospitalId)!;
  const currentCapacity = capacity[hospital.id] || [];
  // For specialists we are still missing a global specialist state, but we can just use MOCK_SPECIALISTS for now or omit it.
  // Wait, I should import MOCK_SPECIALISTS if it's used. Let me re-import it.
  const currentSpecialists = MOCK_SPECIALISTS[hospital.id] || [];

  const handleAccept = () => {
    acceptReferral(
      localReferral!.id,
      user?.id || 'sys',
      'HOSPITAL_STAFF',
      hospital.name
    );
    setShowAcceptModal(false);
  };

  const handleDecline = () => {
    if (!declineReason) return;
    declineReferral(
      localReferral!.id,
      user?.id || 'sys',
      'HOSPITAL_STAFF',
      hospital.name,
      declineReason
    );
    setShowDeclineModal(false);
  };

  const formatTimeAgo = (dateStr: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px] mx-auto w-full animate-fade-in relative pb-24">
      
      {/* Modals */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--cr-border)] w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[var(--cr-border)] bg-gray-50/50">
              <h2 className="text-xl font-bold text-[var(--cr-deep-text)] tracking-tight">Confirm Acceptance</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--cr-muted)] font-medium">
                You are about to accept referral <strong className="text-[var(--cr-deep-text)]">{localReferral.id}</strong> for patient <strong className="text-[var(--cr-deep-text)]">{localReferral.patientReference}</strong>.
              </p>
              
              <div className="bg-gray-50 border border-[var(--cr-border)] rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Required Capabilities Verification</p>
                <ul className="space-y-1">
                  {localReferral.careRequirement.resources.map(r => {
                    const cap = currentCapacity.find(c => c.type === r);
                    const isAvail = cap && cap.available > 0;
                    return (
                      <li key={r} className="text-sm flex items-center gap-2">
                        {isAvail ? <CheckCircle2 size={16} className="text-[var(--cr-success)]" /> : <AlertTriangle size={16} className="text-[var(--cr-warning)]" />}
                        <span className="font-medium text-[var(--cr-deep-text)]">{r.replace(/_/g, ' ')}:</span>
                        <span className={isAvail ? 'text-[var(--cr-muted)]' : 'text-[var(--cr-warning)] font-bold'}>{cap?.available || 0} available</span>
                      </li>
                    );
                  })}
                  {localReferral.careRequirement.specialists.map(s => {
                    const isAvail = currentSpecialists.includes(s);
                    return (
                      <li key={s} className="text-sm flex items-center gap-2">
                        {isAvail ? <CheckCircle2 size={16} className="text-[var(--cr-success)]" /> : <AlertTriangle size={16} className="text-[var(--cr-warning)]" />}
                        <span className="font-medium text-[var(--cr-deep-text)]">{s.replace(/_/g, ' ')}:</span>
                        <span className={isAvail ? 'text-[var(--cr-muted)]' : 'text-[var(--cr-warning)] font-bold'}>{isAvail ? 'Available' : 'Unavailable'}</span>
                      </li>
                    );
                  })}
                  {localReferral.careRequirement.resources.length === 0 && localReferral.careRequirement.specialists.length === 0 && (
                    <li className="text-sm text-[var(--cr-muted)]"><CheckCircle2 size={16} className="text-[var(--cr-success)] inline mr-2" /> General admission requirements met.</li>
                  )}
                </ul>
              </div>
              <p className="text-[10px] text-[var(--cr-muted)] italic font-bold">Note: Acceptance notifies the referrer but does not automatically reserve capacity.</p>
            </div>
            <div className="p-6 border-t border-[var(--cr-border)] bg-gray-50/50 flex items-center justify-end gap-3">
              <button onClick={() => setShowAcceptModal(false)} className="px-6 py-2 rounded-xl font-bold text-[var(--cr-muted)] hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleAccept} className="px-6 py-2 rounded-xl font-bold text-white bg-[var(--cr-success)] hover:bg-green-600 transition-colors shadow-md shadow-green-500/20">Accept Referral</button>
            </div>
          </div>
        </div>
      )}

      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--cr-border)] w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[var(--cr-border)] bg-gray-50/50">
              <h2 className="text-xl font-bold text-[var(--cr-deep-text)] tracking-tight">Decline Referral</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--cr-muted)] font-medium">
                Please provide a structured reason for declining referral <strong className="text-[var(--cr-deep-text)]">{localReferral.id}</strong>.
              </p>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)] mb-2">Decline Reason *</label>
                <select 
                  value={declineReason} 
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full border border-[var(--cr-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/50 focus:border-[var(--cr-primary)] font-medium bg-white"
                >
                  <option value="" disabled>Select a reason...</option>
                  <option value="RESOURCE_UNAVAILABLE">Required Resource Unavailable</option>
                  <option value="SPECIALIST_UNAVAILABLE">Required Specialist Unavailable</option>
                  <option value="CAPACITY_CONSTRAINT">General Capacity Constraint</option>
                  <option value="OPERATIONAL_LIMITATION">Operational Limitation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)] mb-2">Additional Explanation (Optional)</label>
                <textarea 
                  placeholder="Provide brief context for the referrer..."
                  rows={3}
                  className="w-full border border-[var(--cr-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/50 focus:border-[var(--cr-primary)] transition-all resize-none font-medium"
                />
              </div>
            </div>
            <div className="p-6 border-t border-[var(--cr-border)] bg-gray-50/50 flex items-center justify-end gap-3">
              <button onClick={() => setShowDeclineModal(false)} className="px-6 py-2 rounded-xl font-bold text-[var(--cr-muted)] hover:bg-gray-200 transition-colors">Cancel</button>
              <button 
                onClick={handleDecline} 
                disabled={!declineReason}
                className="px-6 py-2 rounded-xl font-bold text-white bg-[var(--cr-critical)] hover:bg-red-600 transition-colors shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <Link href="/hospital" className="text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] font-bold flex items-center gap-1 mb-6 w-fit transition-colors">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.08em] uppercase text-[var(--cr-muted)] mb-1">
              Referral Request
            </p>
            <h1 className="text-3xl font-bold text-[var(--cr-deep-text)] tracking-tight flex items-center gap-3">
              {localReferral.id}
              {localReferral.status === 'PENDING' || localReferral.status === 'UNDER_REVIEW' ? (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-200">Pending Review</span>
              ) : localReferral.status === 'ACCEPTED' ? (
                <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--cr-success)]/20">Accepted</span>
              ) : (
                <span className="bg-[var(--cr-critical)]/10 text-[var(--cr-critical)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--cr-critical)]/20">Declined</span>
              )}
            </h1>
            <p className="text-[var(--cr-muted)] mt-2 font-medium flex items-center gap-2">
              <Clock size={16} /> Created {formatTimeAgo(localReferral.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Patient Header Block */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-6 md:p-8">
            <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-[var(--cr-border)] pb-4">
              <User size={18} className="text-[var(--cr-primary)]" /> Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-1">Patient Reference</p>
                <p className="text-xl font-bold text-[var(--cr-deep-text)]">{localReferral.patientReference}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-1">Referring Organization</p>
                <p className="text-lg font-medium text-[var(--cr-deep-text)]">Regional Health Partners</p>
              </div>
            </div>
            {localReferral.notes && (
              <div className="mt-6 pt-6 border-t border-[var(--cr-border)]">
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-2">Clinical Notes</p>
                <p className="text-[var(--cr-deep-text)] italic bg-gray-50/50 p-4 rounded-xl border border-[var(--cr-border)]">"{localReferral.notes}"</p>
              </div>
            )}
          </div>

          {/* Care Requirements Block */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-6 md:p-8">
            <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-[var(--cr-border)] pb-4">
              <Activity size={18} className="text-[var(--cr-primary)]" /> Care Requirements
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-3">Required Specialists</p>
                <div className="flex flex-wrap gap-2">
                  {localReferral.careRequirement.specialists.length > 0 ? localReferral.careRequirement.specialists.map(s => (
                    <span key={s} className="bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] font-bold px-3 py-1.5 rounded-lg text-sm border border-[var(--cr-primary)]/20">
                      {s.replace(/_/g, ' ')}
                    </span>
                  )) : <span className="text-sm text-[var(--cr-muted)] italic">None specified</span>}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-3">Required Resources</p>
                <div className="flex flex-wrap gap-2">
                  {localReferral.careRequirement.resources.length > 0 ? localReferral.careRequirement.resources.map(r => (
                    <span key={r} className="bg-gray-100 text-[var(--cr-deep-text)] font-bold px-3 py-1.5 rounded-lg text-sm border border-[var(--cr-border)]">
                      {r.replace(/_/g, ' ')}
                    </span>
                  )) : <span className="text-sm text-[var(--cr-muted)] italic">None specified</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Hospital Compatibility */}
        <div className="space-y-8">
          
          {/* Dynamic Operational Warning (Phase 7 Feature 8) */}
          {localReferral.status === 'ACCEPTED' && localReferral.careRequirement.resources.some(r => {
            const cap = currentCapacity.find(c => c.type === r);
            return !cap || cap.available === 0;
          }) && (
            <div className="bg-[var(--cr-warning)]/10 border border-[var(--cr-warning)]/20 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-[var(--cr-warning)] shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--cr-warning)]">Operational Conditions Changed</h3>
                  <p className="text-xs text-[var(--cr-warning)] font-medium mt-1">
                    This referral was accepted, but the hospital no longer has availability for one or more required resources. The referral status remains ACCEPTED, but network routing algorithms may automatically divert this patient.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dynamic Travel Intelligence */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
            <div className="p-6 bg-gray-50/50 border-b border-[var(--cr-border)]">
              <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest flex items-center gap-2">
                <Navigation size={18} className="text-[var(--cr-primary)]" /> Travel Intelligence
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {localReferral.careRequirement.location && hospital.coordinates ? (
                (() => {
                  const dist = calculateDistance(localReferral.careRequirement.location, hospital.coordinates);
                  const eta = calculateETA(dist);
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-1">Calculated ETA</p>
                        <p className="text-2xl font-black text-[var(--cr-deep-text)]">{eta} <span className="text-sm font-medium">min</span></p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-1">Distance</p>
                        <p className="text-xl font-bold text-[var(--cr-deep-text)]">{dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}</p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-[var(--cr-border)]">
                  <p className="text-sm font-bold text-[var(--cr-muted)]">Travel Intelligence Unavailable</p>
                  <p className="text-xs text-[var(--cr-muted)] mt-1">Origin coordinates missing.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
            <div className="p-6 bg-gray-50/50 border-b border-[var(--cr-border)]">
              <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest flex items-center gap-2">
                <Settings2 size={18} className="text-[var(--cr-primary)]" /> Hospital Compatibility
              </h2>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-2">Hospital Status</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${hospital.operationalStatus === 'ACCEPTING_ALL' ? 'bg-[var(--cr-success)]/10 text-[var(--cr-success)] border-[var(--cr-success)]/20' : 'bg-[var(--cr-warning)]/10 text-[var(--cr-warning)] border-[var(--cr-warning)]/20'}`}>
                  {hospital.operationalStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-3">Capacity Validation</p>
                <ul className="space-y-3">
                  {localReferral.careRequirement.resources.map(r => {
                    const cap = currentCapacity.find(c => c.type === r);
                    const isAvail = cap && cap.available > 0;
                    return (
                      <li key={r} className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-[var(--cr-deep-text)]">{r.replace(/_/g, ' ')}</span>
                        {isAvail ? (
                          <span className="text-[var(--cr-success)] font-bold flex items-center gap-1"><CheckCircle2 size={14}/> {cap.available} Avail</span>
                        ) : (
                          <span className="text-[var(--cr-critical)] font-bold flex items-center gap-1"><XCircle size={14}/> 0 Avail</span>
                        )}
                      </li>
                    );
                  })}
                  {localReferral.careRequirement.specialists.map(s => {
                    const isAvail = currentSpecialists.includes(s);
                    return (
                      <li key={s} className="flex justify-between items-center text-sm border-b border-[var(--cr-border)] pb-2 last:border-0 last:pb-0">
                        <span className="font-medium text-[var(--cr-deep-text)]">{s.replace(/_/g, ' ')}</span>
                        {isAvail ? (
                          <span className="text-[var(--cr-success)] font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Avail</span>
                        ) : (
                          <span className="text-[var(--cr-critical)] font-bold flex items-center gap-1"><XCircle size={14}/> Unavail</span>
                        )}
                      </li>
                    );
                  })}
                  {localReferral.careRequirement.resources.length === 0 && localReferral.careRequirement.specialists.length === 0 && (
                    <li className="text-sm text-[var(--cr-muted)] italic">No specific constraints.</li>
                  )}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-[var(--cr-border)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] text-right">Data Freshness: &lt; 1 minute ago</p>
              </div>
            </div>
          </div>

          <ReferralTimeline activities={localActivities} />
        </div>

      </div>

      {/* Sticky Action Footer */}
      {(localReferral.status === 'PENDING' || localReferral.status === 'UNDER_REVIEW') && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--cr-border)] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-40 p-4 md:p-6 animate-fade-in md:pl-64">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-[var(--cr-deep-text)] hidden md:block">
              Decision Required
            </p>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowDeclineModal(true)}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-[var(--cr-critical)] bg-[var(--cr-critical)]/10 hover:bg-[var(--cr-critical)] hover:text-white transition-all shadow-sm"
              >
                Decline
              </button>
              <button 
                onClick={() => setShowAcceptModal(true)}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-white bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] transition-all shadow-md shadow-[var(--cr-primary)]/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
