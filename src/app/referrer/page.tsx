"use client";

import React from 'react';
import { useNetworkState } from '../../contexts/NetworkStateContext';
import { Activity, Clock, CheckCircle2, XCircle, ChevronRight, MapPin, Building2, AlertTriangle, FileText, RefreshCw, FilePlus } from 'lucide-react';
import Link from 'next/link';

export default function ReferrerDashboard() {
  const { referrals, activities, hospitals, capacity } = useNetworkState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const activeCount = referrals.filter(r => r.status === 'UNDER_REVIEW' || r.status === 'PENDING').length;
  const acceptedCount = referrals.filter(r => r.status === 'ACCEPTED').length;
  const declinedCount = referrals.filter(r => r.status === 'DECLINED').length;

  const formatTimeAgo = (dateStr: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACCEPTED': return <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-2 py-0.5 rounded text-xs font-bold uppercase">Accepted</span>;
      case 'DECLINED': return <span className="bg-[var(--cr-critical)]/10 text-[var(--cr-critical)] px-2 py-0.5 rounded text-xs font-bold uppercase">Declined</span>;
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Pending</span>;
      case 'UNDER_REVIEW': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Reviewing</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--cr-border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Referrer Control Center</h1>
          <p className="text-[var(--cr-muted)] mt-1 font-medium flex items-center gap-2">
            <Building2 size={16} /> Regional Health Partners
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-[var(--cr-deep-text)]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-[var(--cr-muted)]">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[var(--cr-border)] flex flex-col justify-center">
          <p className="text-[var(--cr-muted)] font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={14}/> Active / Pending</p>
          <p className="text-3xl font-bold text-[var(--cr-deep-text)]">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[var(--cr-border)] flex flex-col justify-center">
          <p className="text-[var(--cr-success)] font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><CheckCircle2 size={14}/> Accepted</p>
          <p className="text-3xl font-bold text-[var(--cr-deep-text)]">{acceptedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[var(--cr-border)] flex flex-col justify-center">
          <p className="text-[var(--cr-critical)] font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-1"><XCircle size={14}/> Declined</p>
          <p className="text-3xl font-bold text-[var(--cr-deep-text)]">{declinedCount}</p>
        </div>
        <div className="bg-[var(--cr-primary)]/5 rounded-xl p-5 shadow-sm border border-[var(--cr-primary)]/20 flex flex-col justify-center items-center">
          <button className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white w-full py-2.5 rounded-lg font-bold shadow-md shadow-[var(--cr-primary)]/20 transition-all text-sm flex items-center justify-center gap-2">
            <FileText size={16} /> Create Referral
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area - Recent Referrals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--cr-border)] flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-[var(--cr-deep-text)]">Recent Referrals</h2>
              <Link href="/referrer/referrals" className="text-sm font-bold text-[var(--cr-primary)] flex items-center gap-1 hover:underline">
                View all <ChevronRight size={16} />
              </Link>
            </div>
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
                  We couldn't retrieve your referrals right now.
                </p>
                <button onClick={() => { setIsLoading(true); setHasError(false); setTimeout(() => setIsLoading(false), 800); }} className="bg-white border border-[var(--cr-border)] hover:bg-gray-50 text-[var(--cr-deep-text)] px-6 py-2 rounded-xl font-bold transition-colors">
                  Try Again
                </button>
              </div>
            ) : referrals.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-[var(--cr-border)]">
                  <FilePlus size={32} className="text-[var(--cr-muted)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-2">No Referrals Yet</h3>
                <p className="text-sm font-medium text-[var(--cr-muted)] max-w-md mb-6">
                  You haven't created any patient referrals yet.
                </p>
                <Link href="/referrer/referrals/new" className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-[var(--cr-primary)]/20 transition-all flex items-center gap-2">
                  <FilePlus size={18} /> Create Referral
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-[var(--cr-border)] text-xs uppercase tracking-wider text-[var(--cr-muted)]">
                      <th className="p-4 font-bold">Patient Ref</th>
                      <th className="p-4 font-bold">Destination</th>
                      <th className="p-4 font-bold">Requirements</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cr-border)]">
                    {referrals.map(ref => (
                      <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[var(--cr-deep-text)]">{ref.patientReference}</div>
                          <div className="text-xs text-[var(--cr-muted)] mt-0.5">{ref.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-[var(--cr-deep-text)]">{ref.destinationHospitalName}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {ref.careRequirement.specialists.map(s => (
                              <span key={s} className="bg-gray-100 text-[var(--cr-muted)] text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[80px]">
                                {s.replace(/_/g, ' ')}
                              </span>
                            ))}
                            {ref.careRequirement.resources.map(r => (
                              <span key={r} className="bg-gray-100 text-[var(--cr-muted)] text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[80px]">
                                {r.replace(/_/g, ' ')}
                              </span>
                            ))}
                            {ref.careRequirement.specialists.length === 0 && ref.careRequirement.resources.length === 0 && (
                              <span className="text-xs text-gray-400">General Care</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(ref.status)}
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-[var(--cr-muted)]">{formatTimeAgo(ref.updatedAt)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Network Snapshot */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-5">
            <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={16} className="text-[var(--cr-primary)]" /> Network Snapshot
            </h2>
            <div className="space-y-4">
              {hospitals.slice(0, 3).map(h => {
                const caps = capacity[h.id] || [];
                const hasWarning = caps.some(c => c.available === 0);
                return (
                  <div key={h.id} className="border-l-2 pl-3 border-gray-200">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-[var(--cr-deep-text)] text-sm">{h.name}</p>
                      {hasWarning && <AlertTriangle size={14} className="text-[var(--cr-warning)] shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[var(--cr-muted)] bg-gray-100 px-1.5 py-0.5 rounded">{h.distanceKm} km</span>
                      <span className={`text-[10px] font-bold uppercase ${(h.operationalStatus || '').valueOf() === 'ACCEPTING_ALL' ? 'text-[var(--cr-success)]' : 'text-[var(--cr-warning)]'}`}>
                        {(h.operationalStatus || 'UNKNOWN').replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Link href="/referrer/network" className="block mt-4 text-center text-xs font-bold text-[var(--cr-primary)] hover:underline">
              View Full Network
            </Link>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-5">
            <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-4">Activity Feed</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {activities.slice(0, 4).map(act => (
                <div key={act.id} className="relative flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 z-10 ${
                    act.type === 'ACCEPTED' || act.type === 'JOURNEY_STARTED' ? 'bg-[var(--cr-success)] shadow-[0_0_0_3px_rgba(20,184,166,0.2)]' : 
                    act.type === 'DECLINED' ? 'bg-[var(--cr-critical)] shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 
                    'bg-[var(--cr-primary)] shadow-[0_0_0_3px_rgba(59,130,246,0.2)]'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-[var(--cr-deep-text)]">{act.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-[var(--cr-muted)] uppercase">{act.referralId}</span>
                      <span className="text-[10px] font-medium text-gray-400">• {formatTimeAgo(act.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
