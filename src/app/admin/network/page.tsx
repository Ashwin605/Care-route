'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '@/data/mockSpecialists';
import HospitalMap from '@/components/patient/HospitalMap';
import { getFreshnessState } from '@/types/intelligence';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Clock, 
  X,
  Building2,
  BedDouble,
  Users,
  ChevronRight,
  Activity,
  Map as MapIcon
} from 'lucide-react';

interface ActiveAlert {
  id: string;
  hospitalId: string;
  hospitalName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  issue: string;
  actionLink: string;
  actionText: string;
  type: 'STATUS' | 'CAPACITY' | 'RESOURCE' | 'SPECIALIST' | 'STALE';
}

export default function AdminNetworkCenterPage() {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // DYNAMIC REAL-TIME ALERT GENERATOR
  // -------------------------------------------------------------
  const activeAlerts = useMemo(() => {
    const alerts: ActiveAlert[] = [];

    MOCK_HOSPITALS.forEach(h => {
      // 1. Hospital Status Alerts
      if (h.networkStatus === 'UNAVAILABLE') {
        alerts.push({
          id: `alert-stat-${h.id}`,
          hospitalId: h.id,
          hospitalName: h.name,
          severity: 'CRITICAL',
          issue: 'Hospital is completely unavailable.',
          type: 'STATUS',
          actionLink: `/admin/hospitals/${h.id}`,
          actionText: 'View Hospital'
        });
      } else if (h.networkStatus === 'LIMITED' || h.networkStatus === 'AT_RISK') {
        alerts.push({
          id: `alert-stat-${h.id}`,
          hospitalId: h.id,
          hospitalName: h.name,
          severity: 'WARNING',
          issue: `Hospital operating at ${h.networkStatus.toLowerCase()} status.`,
          type: 'STATUS',
          actionLink: `/admin/hospitals/${h.id}`,
          actionText: 'View Hospital'
        });
      }

      // 2. Data Freshness Alerts
      const freshness = getFreshnessState(h.lastUpdate);
      if (freshness === 'stale') {
        alerts.push({
          id: `alert-stale-${h.id}`,
          hospitalId: h.id,
          hospitalName: h.name,
          severity: 'WARNING',
          issue: 'Capacity data has not been synchronized recently.',
          type: 'STALE',
          actionLink: `/admin/resources/${h.id}`,
          actionText: 'Update Capacity'
        });
      }

      // 3. Capacity & Resource Alerts
      const caps = MOCK_CAPACITY[h.id] || [];
      caps.forEach(c => {
        if (c.total > 0 && c.available === 0) {
          alerts.push({
            id: `alert-cap-${h.id}-${c.id}`,
            hospitalId: h.id,
            hospitalName: h.name,
            severity: 'CRITICAL',
            issue: `${c.name} capacity critically low (0 available).`,
            type: 'CAPACITY',
            actionLink: `/admin/resources/${h.id}`,
            actionText: 'Manage Capacity'
          });
        } else if (c.status === 'UNAVAILABLE') {
          alerts.push({
            id: `alert-res-${h.id}-${c.id}`,
            hospitalId: h.id,
            hospitalName: h.name,
            severity: 'CRITICAL',
            issue: `Required resource ${c.name} is unavailable.`,
            type: 'RESOURCE',
            actionLink: `/admin/resources/${h.id}`,
            actionText: 'View Resource'
          });
        } else if (c.status === 'LIMITED') {
          alerts.push({
            id: `alert-res-${h.id}-${c.id}`,
            hospitalId: h.id,
            hospitalName: h.name,
            severity: 'WARNING',
            issue: `${c.name} is limited.`,
            type: 'RESOURCE',
            actionLink: `/admin/resources/${h.id}`,
            actionText: 'View Resource'
          });
        }
      });

      // 4. Specialist Alerts
      const specs = MOCK_SPECIALISTS[h.id] || [];
      specs.forEach(s => {
        if (s.status === 'UNAVAILABLE') {
          alerts.push({
            id: `alert-spec-${h.id}-${s.id}`,
            hospitalId: h.id,
            hospitalName: h.name,
            severity: 'CRITICAL',
            issue: `Required specialist (${s.specialty}) is unavailable.`,
            type: 'SPECIALIST',
            actionLink: `/admin/specialists/${h.id}`,
            actionText: 'View Specialists'
          });
        }
      });
    });

    // Sort: CRITICAL first, then WARNING, then INFO
    return alerts.sort((a, b) => {
      if (a.severity === b.severity) return 0;
      if (a.severity === 'CRITICAL') return -1;
      if (a.severity === 'WARNING' && b.severity !== 'CRITICAL') return -1;
      return 1;
    });
  }, [MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS]); // In a real app this depends on live data ticks

  // -------------------------------------------------------------
  // RENDER HELPERS
  // -------------------------------------------------------------
  const getSeverityIcon = (sev: string) => {
    if (sev === 'CRITICAL') return <ShieldAlert size={16} className="text-[var(--cr-danger)]" />;
    if (sev === 'WARNING') return <AlertTriangle size={16} className="text-[var(--cr-warning)]" />;
    return <Info size={16} className="text-[var(--cr-primary)]" />;
  };

  const getSeverityBadge = (sev: string) => {
    if (sev === 'CRITICAL') return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-danger)]/10 text-[var(--cr-danger)]">Critical</span>;
    if (sev === 'WARNING') return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-warning)]/10 text-[var(--cr-warning)]">Warning</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-primary)]/10 text-[var(--cr-primary)]">Info</span>;
  };

  // -------------------------------------------------------------
  // DRILL-DOWN LOGIC
  // -------------------------------------------------------------
  const selectedHospital = selectedHospitalId ? MOCK_HOSPITALS.find(h => h.id === selectedHospitalId) : null;
  const filteredAlerts = selectedHospitalId 
    ? activeAlerts.filter(a => a.hospitalId === selectedHospitalId)
    : activeAlerts;

  const criticalCount = filteredAlerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = filteredAlerts.filter(a => a.severity === 'WARNING').length;
  
  // Calculate synthetic capacity pressure (Normal, Moderate, High, Critical)
  const calculatePressure = (hId: string) => {
    const caps = MOCK_CAPACITY[hId] || [];
    if (caps.length === 0) return 'UNKNOWN';
    let totalPct = 0;
    let counted = 0;
    caps.forEach(c => {
      if (c.total > 0) {
        totalPct += (c.occupied / c.total);
        counted++;
      }
    });
    if (counted === 0) return 'UNKNOWN';
    const avgUsage = totalPct / counted;
    if (avgUsage > 0.9) return 'CRITICAL';
    if (avgUsage > 0.75) return 'HIGH';
    if (avgUsage > 0.5) return 'MODERATE';
    return 'NORMAL';
  };

  const currentPressure = selectedHospital ? calculatePressure(selectedHospital.id) : null;

  return (
    <div className="h-screen flex flex-col pt-16"> {/* Adjust pt-16 based on AdminHeader height */}
      
      {/* HEADER / TOOLBAR */}
      <div className="bg-white border-b border-[var(--cr-border)] px-6 py-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1">
            NETWORK COMMAND CENTER
          </h1>
          <h2 className="text-xl font-light text-[var(--cr-deep-text)] tracking-tight flex items-center gap-2">
            <Activity size={20} className="text-[var(--cr-muted)]" />
            Live Network Monitoring
          </h2>
        </div>
        
        {/* Global KPIs */}
        {!selectedHospital && (
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Critical</div>
              <div className="text-xl font-bold text-[var(--cr-danger)]">{activeAlerts.filter(a => a.severity === 'CRITICAL').length}</div>
            </div>
            <div className="w-px h-8 bg-[var(--cr-border)]"></div>
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Warnings</div>
              <div className="text-xl font-bold text-[var(--cr-warning)]">{activeAlerts.filter(a => a.severity === 'WARNING').length}</div>
            </div>
          </div>
        )}
      </div>

      {/* DUAL PANE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: MAP */}
        <div className="flex-1 relative bg-gray-50 border-r border-[var(--cr-border)]">
          {/* We reuse the patient HospitalMap, but ideally we'd pass activeAlerts to color pins red.
              Since we can't easily modify HospitalMap props without breaking patient view, we rely on the side panel. */}
          <HospitalMap 
            userLocation={{lat: 13.9, lng: 79.66}} // Mock central location
            hospitals={MOCK_HOSPITALS}
            selectedHospitalId={selectedHospitalId}
            onSelectHospital={setSelectedHospitalId}
            radiusKm={100}
            intelligenceStates={{}}
          />
          
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-[var(--cr-border)] shadow-sm pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">
              <MapIcon size={14} className="text-[var(--cr-primary)]" />
              Select facility to isolate
            </div>
          </div>
        </div>

        {/* RIGHT PANE: ALERT CENTER / DRILL-DOWN */}
        <div className="w-full md:w-[450px] lg:w-[500px] bg-white flex flex-col shrink-0 relative shadow-[-4px_0_15px_rgba(0,0,0,0.03)] z-10">
          
          {/* Pane Header */}
          <div className="p-6 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex items-center justify-between">
            {selectedHospital ? (
              <div className="w-full">
                <button 
                  onClick={() => setSelectedHospitalId(null)}
                  className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-primary)] flex items-center gap-1 mb-3 transition-colors"
                >
                  <X size={12} /> Clear Selection
                </button>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[var(--cr-deep-text)] truncate pr-4">{selectedHospital.name}</h3>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    selectedHospital.networkStatus === 'OPERATIONAL' ? 'bg-[var(--cr-success)]/10 text-[var(--cr-success)]' :
                    selectedHospital.networkStatus === 'UNAVAILABLE' ? 'bg-[var(--cr-danger)]/10 text-[var(--cr-danger)]' :
                    'bg-[var(--cr-warning)]/10 text-[var(--cr-warning)]'
                  }`}>
                    {selectedHospital.networkStatus}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-[var(--cr-deep-text)] flex items-center gap-2">
                  <ShieldAlert size={18} className="text-[var(--cr-primary)]" />
                  Active Alert Center
                </h3>
                <p className="text-xs text-[var(--cr-muted)] mt-1">Real-time network anomaly detection</p>
              </div>
            )}
          </div>

          {/* Contextual Stats (If hospital selected) */}
          {selectedHospital && (
            <div className="grid grid-cols-2 gap-px bg-[var(--cr-border)] border-b border-[var(--cr-border)]">
              <div className="bg-white p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1 flex items-center gap-1">
                  <Clock size={12} /> Data Freshness
                </div>
                <div className={`text-sm font-semibold ${getFreshnessState(selectedHospital.lastUpdate) === 'stale' ? 'text-[var(--cr-warning)]' : 'text-[var(--cr-success)]'}`}>
                  {getFreshnessState(selectedHospital.lastUpdate) === 'stale' ? 'Stale' : 'Live'}
                </div>
              </div>
              <div className="bg-white p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1 flex items-center gap-1">
                  <Activity size={12} /> Capacity Pressure
                </div>
                <div className={`text-sm font-semibold ${
                  currentPressure === 'CRITICAL' ? 'text-[var(--cr-danger)]' : 
                  currentPressure === 'HIGH' ? 'text-[var(--cr-warning)]' : 
                  'text-[var(--cr-success)]'
                }`}>
                  {currentPressure}
                </div>
              </div>
            </div>
          )}

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-4">
            
            {/* Summary Banner */}
            <div className="flex gap-2 mb-2">
              {criticalCount > 0 && (
                <div className="flex-1 bg-[var(--cr-danger)]/10 border border-[var(--cr-danger)]/20 text-[var(--cr-danger)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{criticalCount}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest">Critical Alerts</div>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex-1 bg-[var(--cr-warning)]/10 border border-[var(--cr-warning)]/20 text-[var(--cr-warning)] rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">{warningCount}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest">Warnings</div>
                </div>
              )}
            </div>

            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="w-16 h-16 rounded-full bg-[var(--cr-success)]/10 text-[var(--cr-success)] flex items-center justify-center mb-4">
                  <ShieldAlert size={32} />
                </div>
                <h4 className="font-semibold text-[var(--cr-deep-text)]">Network Stable</h4>
                <p className="text-sm text-[var(--cr-muted)] mt-1 max-w-[250px]">
                  {selectedHospital ? 'This hospital is operating normally with no active alerts.' : 'The entire network is operating normally with no active bottlenecks.'}
                </p>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`bg-white rounded-xl border p-4 shadow-sm relative overflow-hidden group ${
                    alert.severity === 'CRITICAL' ? 'border-[var(--cr-danger)]/30' : 
                    alert.severity === 'WARNING' ? 'border-[var(--cr-warning)]/30' : 
                    'border-[var(--cr-border)]'
                  }`}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    alert.severity === 'CRITICAL' ? 'bg-[var(--cr-danger)]' : 
                    alert.severity === 'WARNING' ? 'bg-[var(--cr-warning)]' : 
                    'bg-[var(--cr-primary)]'
                  }`} />
                  
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-3">
                      {!selectedHospital && (
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-deep-text)] flex items-center gap-1">
                          <Building2 size={12} className="text-[var(--cr-muted)]" />
                          {alert.hospitalName}
                        </div>
                      )}
                      <div className={selectedHospital ? '' : 'ml-auto'}>
                        {getSeverityBadge(alert.severity)}
                      </div>
                    </div>
                    
                    <div className="text-sm font-semibold text-[var(--cr-deep-text)] mb-4 pr-4">
                      {alert.issue}
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--cr-border)] pt-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">
                        {alert.type}
                      </div>
                      <Link 
                        href={alert.actionLink}
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/5 px-2 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        {alert.actionText} <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
