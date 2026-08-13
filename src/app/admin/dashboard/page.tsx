'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useNetworkState } from '@/contexts/NetworkStateContext';
import { getFreshnessState } from '@/types/intelligence';
import HospitalMap from '@/components/patient/HospitalMap';
import { 
  Building2, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Settings,
  BedDouble,
  Stethoscope,
  ChevronRight,
  Info,
  Map as MapIcon
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { hospitals, capacity, networkEvents, referrals } = useNetworkState();
  
  // ---------------------------------------------------------
  // AGGREGATION LOGIC
  // ---------------------------------------------------------
  const data = useMemo(() => {
    const total = hospitals.length;
    let operational = 0;
    let limited = 0;
    let unavailable = 0;
    let staleCount = 0;
    
    // Alerts and events
    const criticalAlerts: { id: string, hospitalId: string, hospital: string, problem: string, severity: 'CRITICAL' | 'WARNING', timeAgo: string }[] = [];
    const pressureHospitals: { hospitalId: string, hospital: string, resource: string, available: number, pressure: 'High' | 'Critical' }[] = [];

    // Capacity aggregation
    const capacitySums = {
      icu: { total: 0, available: 0 },
      general: { total: 0, available: 0 },
      ventilator: { total: 0, available: 0 },
      emergency: { total: 0, available: 0 }
    };

    // Intelligence states for the map
    const intelligenceStates: Record<string, string> = {};

    hospitals.forEach(h => {
      // 1. Status count
      if (h.networkStatus === 'OPERATIONAL') operational++;
      else if (h.networkStatus === 'LIMITED') limited++;
      else unavailable++;

      // 2. Freshness check
      const { state: freshState, secondsAgo } = getFreshnessState(h.lastUpdate);
      const timeAgo = secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo/60)}m ago`;
      if (freshState === 'STALE') {
        staleCount++;
        criticalAlerts.push({
          id: `stale-${h.id}`,
          hospitalId: h.id,
          hospital: h.name,
          problem: 'Capacity data stale',
          severity: 'WARNING',
          timeAgo
        });
      }

      // 3. Status Alerts
      if (h.networkStatus === 'LIMITED') {
        criticalAlerts.push({
          id: `lim-${h.id}`,
          hospitalId: h.id,
          hospital: h.name,
          problem: 'Operational status LIMITED',
          severity: 'WARNING',
          timeAgo
        });
      } else if (h.networkStatus === 'UNAVAILABLE') {
        criticalAlerts.push({
          id: `unav-${h.id}`,
          hospitalId: h.id,
          hospital: h.name,
          problem: 'Hospital UNAVAILABLE',
          severity: 'CRITICAL',
          timeAgo
        });
      }

      // 4. Map states
      intelligenceStates[h.id] = h.networkStatus === 'OPERATIONAL' ? 'ELIGIBLE' : (h.networkStatus === 'LIMITED' ? 'AT_RISK' : 'UNAVAILABLE');

      // 5. Capacity parsing
      const caps = capacity[h.id] || [];
      caps.forEach(cap => {
        const name = cap.name.toLowerCase();
        if (name.includes('icu')) {
          capacitySums.icu.total += cap.total;
          capacitySums.icu.available += cap.available;
          if (cap.available === 0) {
            criticalAlerts.push({
              id: `icu-empty-${h.id}`,
              hospitalId: h.id,
              hospital: h.name,
              problem: 'ICU capacity critically low (0)',
              severity: 'CRITICAL',
              timeAgo
            });
            pressureHospitals.push({ hospitalId: h.id, hospital: h.name, resource: 'ICU', available: 0, pressure: 'Critical' });
          } else if (cap.available <= 2) {
            pressureHospitals.push({ hospitalId: h.id, hospital: h.name, resource: 'ICU', available: cap.available, pressure: 'High' });
          }
        } else if (name.includes('general')) {
          capacitySums.general.total += cap.total;
          capacitySums.general.available += cap.available;
        } else if (name.includes('ventilator')) {
          capacitySums.ventilator.total += cap.total;
          capacitySums.ventilator.available += cap.available;
          if (cap.available === 0) {
            pressureHospitals.push({ hospitalId: h.id, hospital: h.name, resource: 'Ventilator', available: 0, pressure: 'Critical' });
          }
        } else if (name.includes('emergency')) {
          capacitySums.emergency.total += cap.total;
          capacitySums.emergency.available += cap.available;
        }
      });
    });

    // 6. Network Health Algorithm
    let healthScore = 100;
    healthScore -= (limited * 2);
    healthScore -= (unavailable * 5);
    const icuAvailPct = capacitySums.icu.total > 0 ? (capacitySums.icu.available / capacitySums.icu.total) * 100 : 100;
    if (icuAvailPct < 15) healthScore -= 10;
    if (icuAvailPct < 5) healthScore -= 15;
    
    healthScore = Math.max(0, Math.min(100, healthScore));

    let healthStatus = 'Healthy';
    let healthColor = 'text-[var(--cr-success)]';
    if (healthScore < 70) {
      healthStatus = 'Critical';
      healthColor = 'text-[var(--cr-danger)]';
    } else if (healthScore < 90) {
      healthStatus = 'Constrained';
      healthColor = 'text-[var(--cr-warning)]';
    }

    // 7. Referral Aggregation
    const refData = {
      total: referrals.length,
      pending: referrals.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length,
      accepted: referrals.filter(r => r.status === 'ACCEPTED').length,
      declined: referrals.filter(r => r.status === 'DECLINED').length,
      completed: referrals.filter(r => r.status === 'COMPLETED').length
    };

    return {
      total,
      operational,
      limited,
      unavailable,
      staleCount,
      criticalAlerts: criticalAlerts.sort((a, b) => b.severity.localeCompare(a.severity)),
      pressureHospitals: pressureHospitals.slice(0, 5),
      capacitySums,
      intelligenceStates,
      recentEvents: networkEvents.slice(0, 6),
      referrals: refData
    };
  }, [hospitals, capacity, networkEvents, referrals]);

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1">
            CARE ROUTE CONTROL CENTER
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Healthcare Network Operations
          </h2>
        </div>
        <div className="text-sm text-[var(--cr-muted)] font-medium bg-white border border-[var(--cr-border)] px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm">
          <Activity size={16} className="text-[var(--cr-success)] animate-pulse" />
          Last synchronized: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-[var(--cr-border)] p-4 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2 flex items-center gap-1.5"><Building2 size={14}/> Total Hospitals</div>
          <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{data.total}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--cr-border)] p-4 shadow-sm border-l-4 border-l-[var(--cr-success)]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Operational</div>
          <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{data.operational}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--cr-border)] p-4 shadow-sm border-l-4 border-l-[var(--cr-warning)]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Limited</div>
          <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{data.limited}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--cr-border)] p-4 shadow-sm border-l-4 border-l-orange-500">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">At Risk</div>
          <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{data.pressureHospitals.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--cr-border)] p-4 shadow-sm border-l-4 border-l-[var(--cr-danger)]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Unavailable</div>
          <div className="text-2xl font-bold text-[var(--cr-deep-text)]">{data.unavailable}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MAP & QUICK ACTIONS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* NETWORK MAP */}
          <div className="bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)] flex items-center gap-2">
                <MapIcon size={16} /> Operational Network Map
              </h3>
            </div>
            <div className="flex-1 bg-gray-50 relative">
              <HospitalMap 
                userLocation={{lat: 13.9, lng: 79.66}}
                hospitals={hospitals}
                selectedHospitalId={null}
                onSelectHospital={() => {}}
                radiusKm={50}
                intelligenceStates={data.intelligenceStates}
              />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/hospitals" className="p-4 rounded-xl border border-[var(--cr-border)] hover:border-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/5 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <Building2 size={24} className="text-[var(--cr-primary)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Manage<br/>Hospitals</span>
              </Link>
              <Link href="/admin/capacity" className="p-4 rounded-xl border border-[var(--cr-border)] hover:border-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/5 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <BedDouble size={24} className="text-[var(--cr-primary)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Update<br/>Capacity</span>
              </Link>
              <Link href="/admin/resources" className="p-4 rounded-xl border border-[var(--cr-border)] hover:border-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/5 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <Stethoscope size={24} className="text-[var(--cr-primary)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Manage<br/>Resources</span>
              </Link>
              <Link href="/admin/network" className="p-4 rounded-xl border border-[var(--cr-border)] hover:border-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/5 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <Activity size={24} className="text-[var(--cr-primary)]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">View<br/>Network</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATUS & CAPACITY */}
        <div className="space-y-8">
          
          {/* NETWORK HEALTH */}
          <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-6 text-center">Network Health</h3>
            <div className="flex flex-col items-center justify-center mb-4">
              <div className={`text-6xl font-light tracking-tighter ${data.healthColor} mb-2 leading-none`}>
                {data.healthScore}%
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border ${
                data.healthScore >= 90 ? 'border-[var(--cr-success)]/30 bg-[var(--cr-success)]/10 text-[var(--cr-success)]' :
                data.healthScore >= 70 ? 'border-[var(--cr-warning)]/30 bg-[var(--cr-warning)]/10 text-[var(--cr-warning)]' :
                'border-[var(--cr-danger)]/30 bg-[var(--cr-danger)]/10 text-[var(--cr-danger)]'
              }`}>
                {data.healthStatus}
              </div>
            </div>
          </div>

          {/* CAPACITY SUMMARY */}
          <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-6">Capacity Summary</h3>
            <div className="space-y-6">
              {[
                { label: 'ICU', sums: data.capacitySums.icu },
                { label: 'General Beds', sums: data.capacitySums.general },
                { label: 'Ventilators', sums: data.capacitySums.ventilator },
                { label: 'Emergency', sums: data.capacitySums.emergency }
              ].map(cat => {
                const pct = cat.sums.total > 0 ? (cat.sums.available / cat.sums.total) * 100 : 0;
                let barColor = 'bg-[var(--cr-success)]';
                if (pct < 15) barColor = 'bg-[var(--cr-danger)]';
                else if (pct < 30) barColor = 'bg-[var(--cr-warning)]';

                return (
                  <div key={cat.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-[var(--cr-deep-text)] uppercase">{cat.label}</span>
                      <span className="text-[var(--cr-muted)] font-medium">
                        <strong className="text-[var(--cr-deep-text)]">{cat.sums.available}</strong> / {cat.sums.total} available
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CRITICAL ALERTS */}
          <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm flex flex-col max-h-[400px]">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-4 flex justify-between items-center">
              Critical Alerts
              <span className="bg-[var(--cr-danger)] text-white px-2 py-0.5 rounded text-[10px]">{data.criticalAlerts.length}</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {data.criticalAlerts.length === 0 ? (
                <div className="text-sm text-[var(--cr-muted)] text-center py-6 bg-gray-50 rounded-lg">
                  No active critical alerts.
                </div>
              ) : (
                data.criticalAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-lg border text-sm ${alert.severity === 'CRITICAL' ? 'bg-[var(--cr-danger)]/5 border-[var(--cr-danger)]/20' : 'bg-[var(--cr-warning)]/5 border-[var(--cr-warning)]/20'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[var(--cr-deep-text)]">{alert.hospital}</span>
                      <span className="text-[10px] text-[var(--cr-muted)]">{alert.timeAgo}</span>
                    </div>
                    <div className={`font-medium flex items-center gap-2 ${alert.severity === 'CRITICAL' ? 'text-[var(--cr-danger)]' : 'text-[var(--cr-warning)]'}`}>
                      {alert.severity === 'CRITICAL' ? <ShieldAlert size={14} /> : <AlertTriangle size={14} />}
                      {alert.problem}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* DATA FRESHNESS & PRESSURE (ACTIVE EVENTS) */}
          <div className="bg-white rounded-xl border border-[var(--cr-border)] p-6 shadow-sm">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)] mb-4">Data Freshness</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[var(--cr-border)] mb-6">
              <div className="flex items-center gap-3">
                <Clock className="text-[var(--cr-primary)]" size={20} />
                <div className="text-sm font-medium text-[var(--cr-deep-text)]">
                  {data.total - data.staleCount} synchronized recently
                </div>
              </div>
              {data.staleCount > 0 && (
                <div className="text-xs font-bold text-[var(--cr-warning)]">
                  {data.staleCount} stale
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 mb-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)]">Recent Network Events</h3>
              <Link href="/admin/events" className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)] hover:underline">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {networkEvents.length === 0 ? (
                <div className="text-sm text-[var(--cr-muted)] text-center py-6 border border-dashed rounded-lg">
                  No recent events.
                </div>
              ) : (
                networkEvents.slice(0, 4).map((evt) => {
                  const isCrit = evt.severity === 'CRITICAL';
                  const isWarn = evt.severity === 'WARNING';
                  const time = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={evt.id} className="flex justify-between items-start p-3 border-b border-[var(--cr-border)] last:border-0 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {isCrit ? <ShieldAlert size={14} className="text-[var(--cr-danger)]" /> : 
                           isWarn ? <AlertTriangle size={14} className="text-[var(--cr-warning)]" /> : 
                           <Info size={14} className="text-[var(--cr-primary)]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase text-[var(--cr-deep-text)] mb-0.5">{evt.hospitalName}</div>
                          <div className="text-xs text-[var(--cr-muted)]">
                            {evt.type.replace(/_/g, ' ')}
                            {(evt.previousState || evt.newState) && (
                              <span className="font-semibold ml-1">({evt.previousState || '--'} → {evt.newState || '--'})</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-[var(--cr-muted)] whitespace-nowrap ml-2">
                        {time}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* ─── REFERRAL ACTIVITY OVERVIEW (PHASE 7) ─────────────────────────── */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--cr-border)] bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest flex items-center gap-2">
            <Activity size={18} className="text-[var(--cr-primary)]" /> Referral Activity (Network-Wide)
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border border-[var(--cr-border)] rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-1">Total</p>
              <p className="text-3xl font-black text-[var(--cr-deep-text)]">{data.referrals.total}</p>
            </div>
            <div className="border border-[var(--cr-border)] rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Pending</p>
              <p className="text-3xl font-black text-yellow-700">{data.referrals.pending}</p>
            </div>
            <div className="border border-[var(--cr-border)] rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-[var(--cr-success)] uppercase tracking-widest mb-1">Accepted</p>
              <p className="text-3xl font-black text-[var(--cr-success)]">{data.referrals.accepted}</p>
            </div>
            <div className="border border-[var(--cr-border)] rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-[var(--cr-critical)] uppercase tracking-widest mb-1">Declined</p>
              <p className="text-3xl font-black text-[var(--cr-critical)]">{data.referrals.declined}</p>
            </div>
            <div className="border border-[var(--cr-border)] rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-[var(--cr-primary)] uppercase tracking-widest mb-1">Completed</p>
              <p className="text-3xl font-black text-[var(--cr-primary)]">{data.referrals.completed}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
