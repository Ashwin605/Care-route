'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_SPECIALISTS } from '@/data/mockSpecialists';
import { publishNetworkEvent } from '@/data/mockEvents';
import { SpecialistMetric } from '@/types/hospital';
import { ArrowLeft, Save, Plus, Minus, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSpecialistEditorPage() {
  const { id } = useParams();
  const hospital = MOCK_HOSPITALS.find(h => h.id === id);
  
  const [specialists, setSpecialists] = useState<SpecialistMetric[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Confirmation Modal State
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSpecId, setPendingSpecId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string>('');

  useEffect(() => {
    if (hospital) {
      setSpecialists(JSON.parse(JSON.stringify(MOCK_SPECIALISTS[hospital.id] || [])));
    }
  }, [hospital]);

  if (!hospital) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-[var(--cr-danger)]">Hospital Not Found</h2>
        <Link href="/admin/specialists" className="text-[var(--cr-primary)] mt-4 inline-block hover:underline">Return to Overview</Link>
      </div>
    );
  }

  const updateCount = (specId: string, delta: number) => {
    setSpecialists(prev => prev.map(s => {
      if (s.id !== specId) return s;
      const newCount = Math.max(0, s.availableCount + delta);
      // Auto-update status based on count if we want, but the prompt says 
      // admin maintains the status manually. We'll leave status alone unless count drops to 0.
      let newStatus = s.status;
      if (newCount === 0 && newStatus === 'AVAILABLE') newStatus = 'LIMITED';
      return { ...s, availableCount: newCount, status: newStatus };
    }));
    setHasUnsavedChanges(true);
  };

  const handleStatusChangeAttempt = (specId: string, newStatus: string) => {
    const spec = specialists.find(s => s.id === specId);
    if (!spec) return;

    if (newStatus === 'UNAVAILABLE' && spec.status !== 'UNAVAILABLE') {
      // Intercept and ask for confirmation
      setPendingSpecId(specId);
      setPendingStatus(newStatus);
      setShowConfirm(true);
    } else {
      // Apply directly
      setSpecialists(prev => prev.map(s => s.id === specId ? { ...s, status: newStatus as any } : s));
      setHasUnsavedChanges(true);
    }
  };

  const confirmStatusChange = () => {
    if (pendingSpecId && pendingStatus) {
      setSpecialists(prev => prev.map(s => 
        s.id === pendingSpecId ? { ...s, status: pendingStatus as any } : s
      ));
      setHasUnsavedChanges(true);
    }
    setShowConfirm(false);
    setPendingSpecId(null);
    setPendingStatus('');
  };

  const handleSave = () => {
    // Audit differences
    const oldSpecs = MOCK_SPECIALISTS[hospital.id] || [];
    specialists.forEach(newSpec => {
      const oldSpec = oldSpecs.find(s => s.id === newSpec.id);
      if (oldSpec) {
        if (oldSpec.status !== newSpec.status) {
          publishNetworkEvent({
            type: 'SPECIALIST_STATUS_CHANGED',
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            specialistId: newSpec.id,
            source: 'Admin User',
            previousState: oldSpec.status,
            newState: newSpec.status
          });
        }
      }
    });

    // Mutate the central store
    MOCK_SPECIALISTS[hospital.id] = JSON.parse(JSON.stringify(specialists));
    
    // Update hospital timestamp
    const hIdx = MOCK_HOSPITALS.findIndex(h => h.id === hospital.id);
    if (hIdx !== -1) {
      MOCK_HOSPITALS[hIdx].lastUpdate = new Date().toISOString();
    }

    setHasUnsavedChanges(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'border-[var(--cr-success)]/30 text-[var(--cr-success)] bg-[var(--cr-success)]/5';
      case 'LIMITED': return 'border-[var(--cr-warning)]/30 text-[var(--cr-warning)] bg-[var(--cr-warning)]/5';
      case 'UNAVAILABLE': return 'border-[var(--cr-danger)]/30 text-[var(--cr-danger)] bg-[var(--cr-danger)]/5';
      default: return 'border-gray-200 text-[var(--cr-muted)] bg-gray-50';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-8 relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6 sticky top-0 bg-[var(--cr-background)] z-10 py-4 -mt-4">
        <div>
          <Link href="/admin/specialists" className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-primary)] flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft size={14} /> Specialist Overview
          </Link>
          <h1 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight uppercase">
            {hospital.name}
          </h1>
          <div className="text-sm text-[var(--cr-muted)] mt-1">
            Specialist Manager
          </div>
        </div>
        
        <div>
          <button 
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all ${
              hasUnsavedChanges 
                ? 'bg-[var(--cr-primary)] text-white hover:bg-[var(--cr-primary)]/90 shadow-md shadow-[var(--cr-primary)]/20' 
                : 'bg-gray-100 text-[var(--cr-muted)] cursor-not-allowed'
            }`}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
        <AlertTriangle className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-900 leading-relaxed">
          <strong>Routing Impact:</strong> Marking a specialist as <code className="font-semibold">UNAVAILABLE</code> will immediately block patients requiring that specialty from being routed to this hospital. Use caution.
        </div>
      </div>

      {/* SPECIALISTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialists.map(spec => (
          <div key={spec.id} className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)]">
              <h3 className="font-bold text-[var(--cr-deep-text)] uppercase tracking-wide">
                {spec.specialty}
              </h3>
            </div>

            <div className="p-5 space-y-5">
              {/* STATUS */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Operational Status</label>
                <select 
                  value={spec.status}
                  onChange={e => handleStatusChangeAttempt(spec.id, e.target.value)}
                  className={`w-full p-2.5 text-xs font-bold uppercase tracking-widest border rounded outline-none cursor-pointer transition-colors ${getStatusBadgeClass(spec.status)}`}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="LIMITED">LIMITED</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                </select>
              </div>

              {/* COUNT */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Available Specialists</label>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => updateCount(spec.id, -1)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-[var(--cr-deep-text)] rounded-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex-1 text-center text-xl font-bold text-[var(--cr-deep-text)] p-1.5 border border-[var(--cr-border)] rounded-lg bg-gray-50">
                    {spec.availableCount}
                  </div>
                  <button 
                    onClick={() => updateCount(spec.id, 1)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-[var(--cr-deep-text)] rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-[var(--cr-border)] max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--cr-border)] bg-[var(--cr-critical)]/10 text-[var(--cr-critical)] flex items-center gap-3">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-semibold tracking-tight">Confirm Specialist Unavailability</h3>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-[var(--cr-deep-text)] leading-relaxed">
                  You are marking this specialist as <strong>UNAVAILABLE</strong>. 
                  <br/><br/>
                  This will immediately disqualify this hospital from the matching engine for any patients requiring this specialty. Are you sure?
                </p>
                <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 rounded-lg border border-[var(--cr-border)]">
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Previous</div>
                    <span className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border border-[var(--cr-success)]/30 text-[var(--cr-success)] bg-[var(--cr-success)]/5">
                      Available / Limited
                    </span>
                  </div>
                  <ChevronRight className="text-[var(--cr-muted)]" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">New</div>
                    <span className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border border-[var(--cr-critical)]/30 text-[var(--cr-critical)] bg-[var(--cr-critical)]/5">
                      Unavailable
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => {
                      setShowConfirm(false);
                      setPendingSpecId(null);
                      setPendingStatus('');
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmStatusChange}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-[var(--cr-critical)] hover:bg-[var(--cr-critical)]/90 rounded transition-colors"
                  >
                    Confirm Unavailability
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
