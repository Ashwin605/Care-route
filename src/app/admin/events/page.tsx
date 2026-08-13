'use client';

import React, { useState } from 'react';
import { MOCK_NETWORK_EVENTS, NetworkEvent } from '@/data/mockEvents';
import { ShieldAlert, AlertTriangle, Info, Clock, X, Building2, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminEventsPage() {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);

  const filteredEvents = MOCK_NETWORK_EVENTS.filter(evt => {
    if (filterSeverity !== 'ALL' && evt.severity !== filterSeverity) return false;
    if (filterType !== 'ALL' && evt.type !== filterType) return false;
    return true;
  });

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

  const formatEventName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1">
            EVENT ENGINE
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Network Audit Log
          </h2>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cr-muted)]" size={16} />
          <select 
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="appearance-none pl-10 pr-10 py-3 bg-white border border-[var(--cr-border)] rounded-lg focus:outline-none focus:border-[var(--cr-primary)] text-sm font-medium text-[var(--cr-deep-text)] cursor-pointer min-w-[200px]"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warnings & Critical</option>
            <option value="INFO">Info</option>
          </select>
        </div>

        <div className="relative">
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="appearance-none px-4 py-3 bg-white border border-[var(--cr-border)] rounded-lg focus:outline-none focus:border-[var(--cr-primary)] text-sm font-medium text-[var(--cr-deep-text)] cursor-pointer min-w-[250px]"
          >
            <option value="ALL">All Event Types</option>
            <option value="HOSPITAL_STATUS_CHANGED">Hospital Status Changed</option>
            <option value="CAPACITY_CHANGED">Capacity Changed</option>
            <option value="RESOURCE_STATUS_CHANGED">Resource Status Changed</option>
            <option value="SPECIALIST_STATUS_CHANGED">Specialist Status Changed</option>
            <option value="DATA_BECAME_STALE">Data Became Stale</option>
          </select>
        </div>
      </div>

      {/* FEED LIST */}
      <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden max-w-4xl">
        <div className="divide-y divide-[var(--cr-border)]">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-[var(--cr-muted)]">No events match your criteria.</div>
          ) : (
            filteredEvents.map(evt => {
              const time = new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <button 
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getSeverityIcon(evt.severity)}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">{evt.hospitalName}</span>
                        {getSeverityBadge(evt.severity)}
                      </div>
                      <div className="text-sm font-semibold text-[var(--cr-deep-text)]">
                        {formatEventName(evt.type)}
                      </div>
                      <div className="text-xs text-[var(--cr-muted)] mt-1 flex items-center gap-1">
                        <Clock size={12} /> {time}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-[var(--cr-muted)] group-hover:text-[var(--cr-primary)] transition-colors" />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* SLIDE OUT DETAIL PANEL */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white border-l border-[var(--cr-border)] shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-[var(--cr-border)] flex items-center justify-between bg-[var(--cr-background)]">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)]">Event Details</h3>
                <button onClick={() => setSelectedEvent(null)} className="text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)]">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-[var(--cr-border)] pb-6">
                  <div className={`p-3 rounded-xl ${
                    selectedEvent.severity === 'CRITICAL' ? 'bg-[var(--cr-danger)]/10 text-[var(--cr-danger)]' : 
                    selectedEvent.severity === 'WARNING' ? 'bg-[var(--cr-warning)]/10 text-[var(--cr-warning)]' : 
                    'bg-[var(--cr-primary)]/10 text-[var(--cr-primary)]'
                  }`}>
                    {getSeverityIcon(selectedEvent.severity)}
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-[var(--cr-deep-text)] leading-tight mb-1">
                      {formatEventName(selectedEvent.type)}
                    </div>
                    <div className="text-sm text-[var(--cr-muted)] flex items-center gap-1.5">
                      <Clock size={14} /> {new Date(selectedEvent.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* State Change */}
                {(selectedEvent.previousState || selectedEvent.newState) && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-[var(--cr-border)]">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-4">State Transition</h4>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className="text-xs text-[var(--cr-muted)] mb-1">Previous</div>
                        <div className="font-semibold text-[var(--cr-deep-text)]">{selectedEvent.previousState || '--'}</div>
                      </div>
                      <ChevronRight className="text-[var(--cr-muted)] mx-2" />
                      <div className="text-center flex-1">
                        <div className="text-xs text-[var(--cr-muted)] mb-1">New</div>
                        <div className="font-semibold text-[var(--cr-deep-text)]">{selectedEvent.newState || '--'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] border-b border-[var(--cr-border)] pb-2">Context Metadata</h4>
                  
                  <div className="flex items-center gap-3 p-3 bg-white border border-[var(--cr-border)] rounded-lg">
                    <Building2 size={16} className="text-[var(--cr-muted)]" />
                    <div>
                      <div className="text-[10px] uppercase text-[var(--cr-muted)] font-bold">Hospital</div>
                      <div className="text-sm font-semibold text-[var(--cr-deep-text)]">{selectedEvent.hospitalName}</div>
                      <div className="text-xs text-[var(--cr-muted)]">{selectedEvent.hospitalId}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] uppercase text-[var(--cr-muted)] font-bold mb-1">Severity</div>
                      {getSeverityBadge(selectedEvent.severity)}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-[var(--cr-muted)] font-bold mb-1">Source</div>
                      <div className="text-sm font-medium text-[var(--cr-deep-text)]">{selectedEvent.source}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] uppercase text-[var(--cr-muted)] font-bold mb-1">Event ID</div>
                      <div className="text-xs font-mono text-[var(--cr-muted)] bg-gray-50 p-2 rounded">{selectedEvent.id}</div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
