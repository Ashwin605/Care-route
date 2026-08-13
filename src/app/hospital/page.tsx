"use client";

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNetworkState } from '../../contexts/NetworkStateContext';
import { Activity, Clock, CheckCircle2, XCircle, AlertTriangle, Users, FileText, ChevronRight, Navigation, RefreshCw, MapPin } from 'lucide-react';
import { calculateDistance, calculateETA } from '@/lib/intelligence/etaService';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HospitalWorkspace() {
  const { user } = useAuth();
  const { hospitals, referrals, capacity: globalCapacity } = useNetworkState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Simulate data loading delay for demo testing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Hardcode to CityCare (id: hosp-1) for demo, or match user's organization if implemented
  const hospitalId = 'hosp-1'; 
  const hospital = hospitals.find(h => h.id === hospitalId) || hospitals[0];
  const capacity = globalCapacity[hospitalId] || [];
  
  const incomingReferrals = referrals.filter(r => r.destinationHospitalId === hospitalId);
  const pendingCount = incomingReferrals.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;
  const acceptedCount = incomingReferrals.filter(r => r.status === 'ACCEPTED').length;
  const declinedCount = incomingReferrals.filter(r => r.status === 'DECLINED').length;

  const warnings = capacity.filter(c => c.available === 0);

  const formatTimeAgo = (dateStr: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-[var(--cr-muted)] mb-4">
            Hospital Operations
          </p>
          <h1 className="text-4xl md:text-[3rem] font-bold text-[var(--cr-deep-text)] tracking-tight leading-[1.06] mb-2">
            {hospital.name}
          </h1>
          <p className="text-[var(--cr-muted)] text-lg max-w-xl">
            Monitor incoming referrals, manage capacity, and coordinate patient arrivals.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-4 py-3 rounded-xl border ${(hospital.networkStatus || 'OPERATIONAL') === 'OPERATIONAL' ? 'bg-[var(--cr-success)]/10 border-[var(--cr-success)]/20 text-[var(--cr-success)]' : 'bg-[var(--cr-warning)]/10 border-[var(--cr-warning)]/20 text-[var(--cr-warning)]'}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5">Operational Status</p>
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${(hospital.networkStatus || 'OPERATIONAL') === 'OPERATIONAL' ? 'bg-[var(--cr-success)]' : 'bg-[var(--cr-warning)]'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${(hospital.networkStatus || 'OPERATIONAL') === 'OPERATIONAL' ? 'bg-[var(--cr-success)]' : 'bg-[var(--cr-warning)]'}`}></span>
              </span>
              {(hospital.networkStatus || 'OPERATIONAL').replace(/_/g, ' ')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--cr-border)]">
          <p className="text-[var(--cr-muted)] font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={16}/> Pending Review</p>
          <p className="text-4xl font-black text-[var(--cr-deep-text)]">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--cr-border)]">
          <p className="text-[var(--cr-success)] font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> Accepted Today</p>
          <p className="text-4xl font-black text-[var(--cr-deep-text)]">{acceptedCount}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--cr-border)]">
          <p className="text-[var(--cr-primary)] font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><Users size={16}/> Active Journeys</p>
          <p className="text-4xl font-black text-[var(--cr-deep-text)]">2</p>
        </div>
        <div className="bg-[var(--cr-critical)]/5 rounded-2xl p-6 shadow-sm border border-[var(--cr-critical)]/20">
          <p className="text-[var(--cr-critical)] font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Resource Alerts</p>
          <p className="text-4xl font-black text-[var(--cr-critical)]">{warnings.length}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area - Incoming Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-[var(--cr-deep-text)] tracking-tight">Incoming Referrals</h2>
            <Link href="/hospital/referrals" className="text-sm font-bold text-[var(--cr-primary)] hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
          
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <RefreshCw size={32} className="text-[var(--cr-primary)] animate-spin mb-4" />
              <p className="text-sm font-bold text-[var(--cr-muted)] uppercase tracking-widest">Loading Referrals...</p>
            </div>
          ) : hasError ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <AlertTriangle size={32} className="text-[var(--cr-danger)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-2">Unable To Load Referrals</h3>
              <p className="text-sm font-medium text-[var(--cr-muted)] max-w-md mb-6">
                We couldn't retrieve referrals right now.
              </p>
              <button onClick={() => { setIsLoading(true); setHasError(false); setTimeout(() => setIsLoading(false), 800); }} className="bg-white border border-[var(--cr-border)] hover:bg-gray-50 text-[var(--cr-deep-text)] px-6 py-2 rounded-xl font-bold transition-colors">
                Try Again
              </button>
            </div>
          ) : incomingReferrals.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-[var(--cr-border)]">
                <CheckCircle2 size={32} className="text-[var(--cr-muted)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-2">No Active Referrals</h3>
              <p className="text-sm font-medium text-[var(--cr-muted)] max-w-md">
                There are no patient referrals requiring your attention right now. New referrals will appear here when they are received.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-[var(--cr-border)] text-[10px] uppercase tracking-widest text-[var(--cr-muted)] font-bold">
                    <th className="p-5">Patient Ref</th>
                    <th className="p-5">Requirements</th>
                    <th className="p-5">Travel</th>
                    <th className="p-5">Referrer</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cr-border)]">
                  {incomingReferrals.map(ref => (
                    <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-[var(--cr-deep-text)]">{ref.patientReference}</div>
                        <div className="text-xs text-[var(--cr-muted)] mt-1">{formatTimeAgo(ref.createdAt)}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1">
                          {(ref.careRequirement?.specialists || []).map(s => (
                            <span key={s} className="bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] text-[10px] font-bold px-2 py-1 rounded">
                              {s.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {(ref.careRequirement?.resources || []).map(r => (
                            <span key={r} className="bg-gray-100 text-[var(--cr-deep-text)] text-[10px] font-bold px-2 py-1 rounded">
                              {r.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {(!ref.careRequirement?.specialists || ref.careRequirement.specialists.length === 0) && 
                           (!ref.careRequirement?.resources || ref.careRequirement.resources.length === 0) && (
                            <span className="text-xs text-[var(--cr-muted)] italic">General Admission</span>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        {ref.careRequirement.location && hospital.coordinates ? (
                          (() => {
                            const dist = calculateDistance(ref.careRequirement.location, hospital.coordinates);
                            const eta = calculateETA(dist);
                            return (
                              <div>
                                <div className="text-sm font-bold text-[var(--cr-deep-text)]">{eta} min</div>
                                <div className="text-[10px] uppercase tracking-widest text-[var(--cr-muted)] mt-1 flex items-center gap-1">
                                  <Navigation size={10} /> {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-xs text-[var(--cr-muted)] italic">Unavailable</div>
                        )}
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium text-[var(--cr-deep-text)]">Dr. J. Smith</div>
                        <div className="text-[10px] uppercase tracking-widest text-[var(--cr-muted)] mt-1">Regional Health</div>
                      </td>
                      <td className="p-5">
                        {ref.status === 'PENDING' || ref.status === 'UNDER_REVIEW' ? (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Action Required</span>
                        ) : ref.status === 'ACCEPTED' ? (
                          <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Accepted</span>
                        ) : (
                          <span className="bg-[var(--cr-critical)]/10 text-[var(--cr-critical)] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Declined</span>
                        )}
                      </td>
                      <td className="p-5">
                        <button className="text-sm font-bold text-[var(--cr-primary)] hover:underline">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

        {/* Sidebar Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border border-[var(--cr-border)] rounded-xl p-4 text-left hover:border-[var(--cr-primary)] hover:shadow-sm transition-all group">
                <FileText size={20} className="text-[var(--cr-primary)] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--cr-deep-text)]">Review Referrals</span>
              </button>
              <button className="bg-white border border-[var(--cr-border)] rounded-xl p-4 text-left hover:border-[var(--cr-primary)] hover:shadow-sm transition-all group">
                <Activity size={20} className="text-[var(--cr-primary)] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--cr-deep-text)]">Update Capacity</span>
              </button>
              <button className="bg-white border border-[var(--cr-border)] rounded-xl p-4 text-left hover:border-[var(--cr-primary)] hover:shadow-sm transition-all group">
                <Users size={20} className="text-[var(--cr-primary)] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--cr-deep-text)]">Manage Resources</span>
              </button>
              <button className="bg-white border border-[var(--cr-border)] rounded-xl p-4 text-left hover:border-[var(--cr-primary)] hover:shadow-sm transition-all group">
                <MapPin size={20} className="text-[var(--cr-primary)] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[var(--cr-deep-text)]">View Network</span>
              </button>
            </div>
          </div>

          {/* Operational Status Alerts */}
          <div>
            <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-4">Live Capacity Alerts</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-6">
              {warnings.length === 0 ? (
                <div className="flex items-center gap-3 text-[var(--cr-success)]">
                  <CheckCircle2 size={24} />
                  <span className="text-sm font-bold">All monitored resources are available.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {warnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-[var(--cr-critical)]/5 border border-[var(--cr-critical)]/20 rounded-xl p-4">
                      <AlertTriangle size={20} className="text-[var(--cr-critical)] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[var(--cr-critical)]">{(w.name || w.id || 'Resource').replace(/_/g, ' ')} Unavailable</p>
                        <p className="text-xs text-[var(--cr-critical)]/80 mt-1">Capacity dropped to 0. Auto-routing is active to divert new arrivals.</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full text-center text-xs font-bold text-[var(--cr-primary)] hover:underline mt-2">
                    Manage Capacity Settings
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
}
