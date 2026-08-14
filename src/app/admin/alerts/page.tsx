'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock active alerts specifically for this page
const MOCK_ALERTS = [
  {
    id: 'alt-101',
    severity: 'CRITICAL',
    title: 'Capacity Overload at CityCare Hospital',
    message: 'CityCare Hospital has reached 100% ICU capacity. Incoming critical referrals are being automatically rerouted.',
    timestamp: '10 minutes ago',
    status: 'ACTIVE',
    hospitalId: 'hosp-1'
  },
  {
    id: 'alt-102',
    severity: 'WARNING',
    title: 'Cardiologist Shortage',
    message: 'Regional Health Center has reported 2 unexpected cardiologist absences. Coverage is currently limited.',
    timestamp: '45 minutes ago',
    status: 'ACTIVE',
    hospitalId: 'hosp-2'
  },
  {
    id: 'alt-103',
    severity: 'CRITICAL',
    title: 'System Integration Error',
    message: 'EHR sync failed for Memorial Hospital. Referrals are falling back to manual confirmation.',
    timestamp: '2 hours ago',
    status: 'INVESTIGATING',
    hospitalId: 'hosp-3'
  },
  {
    id: 'alt-104',
    severity: 'INFO',
    title: 'Scheduled Maintenance',
    message: 'Matching engine will undergo routine maintenance at 02:00 AM EST. Minimal disruption expected.',
    timestamp: '5 hours ago',
    status: 'ACTIVE',
    hospitalId: 'system'
  }
];

export default function AdminAlertsPage() {
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const filteredAlerts = MOCK_ALERTS.filter(alert => {
    if (filterStatus !== 'ALL' && alert.status !== filterStatus) return false;
    return true;
  });

  const getSeverityIcon = (sev: string) => {
    if (sev === 'CRITICAL') return <ShieldAlert size={20} className="text-[var(--cr-critical)]" />;
    if (sev === 'WARNING') return <AlertTriangle size={20} className="text-[var(--cr-warning)]" />;
    return <Info size={20} className="text-[var(--cr-primary)]" />;
  };

  const getSeverityBadge = (sev: string) => {
    if (sev === 'CRITICAL') return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-critical)]/10 text-[var(--cr-critical)]">Critical</span>;
    if (sev === 'WARNING') return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-warning)]/10 text-[var(--cr-warning)]">Warning</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-primary)]/10 text-[var(--cr-primary)]">Info</span>;
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1">
            MONITORING
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Active System Alerts
          </h2>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white border border-[var(--cr-border)] rounded-lg text-sm font-bold text-[var(--cr-deep-text)] focus:outline-none focus:border-[var(--cr-primary)]"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* ALERTS LIST */}
      <div className="grid gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 border border-[var(--cr-border)] border-dashed rounded-xl bg-gray-50/50">
            <CheckCircle2 size={32} className="mx-auto text-[var(--cr-muted)] mb-3 opacity-50" />
            <p className="text-[var(--cr-muted)] font-medium">No alerts matching current filters.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row gap-6 items-start transition-colors hover:bg-gray-50/50 ${alert.severity === 'CRITICAL' ? 'border-[var(--cr-critical)]/30' : 'border-[var(--cr-border)]'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-[var(--cr-critical)]/10' : alert.severity === 'WARNING' ? 'bg-[var(--cr-warning)]/10' : 'bg-[var(--cr-primary)]/10'}`}>
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(alert.severity)}
                    <h3 className="text-lg font-bold text-[var(--cr-deep-text)]">
                      {alert.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)]">
                    <Clock size={14} />
                    {alert.timestamp}
                  </div>
                </div>
                
                <p className="text-sm text-[var(--cr-muted)] leading-relaxed max-w-4xl">
                  {alert.message}
                </p>
                
                <div className="flex items-center gap-4 pt-2">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${alert.status === 'ACTIVE' ? 'bg-gray-100 text-[var(--cr-deep-text)]' : 'bg-[var(--cr-warning)]/10 text-[var(--cr-warning)]'}`}>
                    Status: {alert.status}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)]">
                    Ref: {alert.id}
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-[var(--cr-border)] pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
                <button className="flex-1 px-4 py-2 bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 text-white rounded font-bold text-xs uppercase tracking-widest transition-colors">
                  Acknowledge
                </button>
                <button className="flex-1 px-4 py-2 bg-white border border-[var(--cr-border)] hover:bg-gray-50 text-[var(--cr-deep-text)] rounded font-bold text-xs uppercase tracking-widest transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
