'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { getFreshnessState } from '@/types/intelligence';
import { Search, Filter, AlertTriangle, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';

export default function AdminHospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [freshnessFilter, setFreshnessFilter] = useState('ALL');

  const filteredHospitals = useMemo(() => {
    return MOCK_HOSPITALS.filter(h => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        h.name.toLowerCase().includes(search) || 
        (h.address || "").toLowerCase().includes(search) || 
        h.id.toLowerCase().includes(search);
      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter !== 'ALL' && h.networkStatus !== statusFilter) return false;

      // Freshness Filter
      if (freshnessFilter !== 'ALL') {
        const { state } = getFreshnessState(h.lastUpdate);
        if (state !== freshnessFilter) return false;
      }

      return true;
    });
  }, [searchTerm, statusFilter, freshnessFilter]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'OPERATIONAL': return <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-2 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center w-max gap-1"><CheckCircle2 size={12}/> Operational</span>;
      case 'LIMITED': return <span className="bg-[var(--cr-warning)]/10 text-[var(--cr-warning)] px-2 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center w-max gap-1"><AlertTriangle size={12}/> Limited</span>;
      case 'AT_RISK': return <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center w-max gap-1"><AlertTriangle size={12}/> At Risk</span>;
      case 'UNAVAILABLE': return <span className="bg-[var(--cr-danger)]/10 text-[var(--cr-danger)] px-2 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center w-max gap-1"><XCircle size={12}/> Unavailable</span>;
      default: return <span className="bg-gray-100 text-[var(--cr-muted)] px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1">
            HOSPITAL MANAGEMENT
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Network Hospitals
          </h2>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cr-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--cr-border)] rounded-lg focus:outline-none focus:border-[var(--cr-primary)] focus:ring-1 focus:ring-[var(--cr-primary)] transition-all text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cr-muted)]" size={16} />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-[var(--cr-border)] rounded-lg focus:outline-none focus:border-[var(--cr-primary)] text-sm font-medium text-[var(--cr-deep-text)] cursor-pointer min-w-[200px]"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="LIMITED">Limited</option>
              <option value="AT_RISK">At Risk</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cr-muted)]" size={16} />
            <select 
              value={freshnessFilter}
              onChange={e => setFreshnessFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-[var(--cr-border)] rounded-lg focus:outline-none focus:border-[var(--cr-primary)] text-sm font-medium text-[var(--cr-deep-text)] cursor-pointer min-w-[200px]"
            >
              <option value="ALL">All Data Freshness</option>
              <option value="FRESH">Fresh</option>
              <option value="RECENT">Recent</option>
              <option value="STALE">Stale</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--cr-background)] border-b border-[var(--cr-border)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Hospital</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)] hidden md:table-cell">Emergency Status</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Network Status</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)] hidden lg:table-cell">Last Updated</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cr-border)]">
              {filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--cr-muted)] font-medium">
                    No hospitals found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredHospitals.map(h => {
                  const { state: freshState, secondsAgo } = getFreshnessState(h.lastUpdate);
                  const timeAgo = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo/60)}m ago`;

                  return (
                    <tr key={h.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[var(--cr-deep-text)] uppercase">{h.name}</div>
                        <div className="text-xs text-[var(--cr-muted)] mt-1">{h.id} • {(h.address || "")}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {getStatusBadge(h.emergencyStatus)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(h.networkStatus)}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${freshState === 'STALE' ? 'bg-[var(--cr-warning)]' : 'bg-[var(--cr-success)]'}`} />
                          <span className={freshState === 'STALE' ? 'text-[var(--cr-warning)] font-semibold' : 'text-[var(--cr-deep-text)]'}>{timeAgo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/hospitals/${h.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)] bg-[var(--cr-primary)]/5 hover:bg-[var(--cr-primary)]/10 px-3 py-2 rounded transition-colors"
                        >
                          Manage <ChevronRight size={14}/>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
