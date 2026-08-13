'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { publishNetworkEvent } from '@/data/mockEvents';
import { ArrowLeft, Save, Plus, Minus, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { CapacityMetric } from '@/types/hospital';

export default function AdminResourceEditorPage() {
  const { id } = useParams();
  const hospital = MOCK_HOSPITALS.find(h => h.id === id);
  
  const [capacities, setCapacities] = useState<CapacityMetric[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (hospital) {
      // Deep clone so we can edit without directly mutating before save
      setCapacities(JSON.parse(JSON.stringify(MOCK_CAPACITY[hospital.id] || [])));
    }
  }, [hospital]);

  if (!hospital) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-[var(--cr-danger)]">Hospital Not Found</h2>
        <Link href="/admin/capacity" className="text-[var(--cr-primary)] mt-4 inline-block hover:underline">Return to Overview</Link>
      </div>
    );
  }

  // Handle Capacity Changes (Numeric constraints)
  const updateNumericCapacity = (capId: string, field: 'total' | 'occupied', valStr: string) => {
    let val = parseInt(valStr);
    if (isNaN(val)) return; // Allow empty string for backspacing if needed, but parseInt handles numbers

    setCapacities(prev => prev.map(c => {
      if (c.id !== capId) return c;
      
      let newTotal = c.total;
      let newOccupied = c.occupied;

      if (field === 'total') {
        newTotal = Math.max(0, val);
        if (newOccupied > newTotal) newOccupied = newTotal; // mathematically bound
      } else {
        newOccupied = Math.max(0, Math.min(val, newTotal));
      }

      const available = newTotal - newOccupied;
      const pct = newTotal > 0 ? (available / newTotal) * 100 : 0;
      let newStatus = c.status;
      if (c.status !== 'UNAVAILABLE') { // Only auto-update if not manually disabled
        if (pct < 15 || available === 0) newStatus = 'LIMITED';
        else newStatus = 'AVAILABLE';
      }

      return { ...c, total: newTotal, occupied: newOccupied, available, status: newStatus };
    }));
    setHasUnsavedChanges(true);
  };

  // Handle Status Changes (Categorical)
  const updateStatus = (capId: string, status: any) => {
    setCapacities(prev => prev.map(c => {
      if (c.id !== capId) return c;
      return { ...c, status };
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Audit differences
    const oldCaps = MOCK_CAPACITY[hospital.id] || [];
    capacities.forEach(newCap => {
      const oldCap = oldCaps.find(c => c.id === newCap.id);
      if (oldCap) {
        if (oldCap.available !== newCap.available) {
          publishNetworkEvent({
            type: 'CAPACITY_CHANGED',
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            resourceId: newCap.id,
            source: 'Admin User',
            previousState: String(oldCap.available),
            newState: String(newCap.available)
          });
        }
        if (oldCap.status !== newCap.status) {
          publishNetworkEvent({
            type: 'RESOURCE_STATUS_CHANGED',
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            resourceId: newCap.id,
            source: 'Admin User',
            previousState: oldCap.status,
            newState: newCap.status
          });
        }
      }
    });

    // Mutate the central store
    MOCK_CAPACITY[hospital.id] = JSON.parse(JSON.stringify(capacities));
    
    // Update hospital timestamp to trigger freshness alerts
    const hIdx = MOCK_HOSPITALS.findIndex(h => h.id === hospital.id);
    if (hIdx !== -1) {
      MOCK_HOSPITALS[hIdx].lastUpdate = new Date().toISOString();
    }

    setHasUnsavedChanges(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6 sticky top-0 bg-[var(--cr-background)] z-10 py-4 -mt-4">
        <div>
          <div className="flex gap-4">
            <Link href="/admin/capacity" className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-primary)] flex items-center gap-1 mb-4 transition-colors">
              <ArrowLeft size={14} /> Capacity Overview
            </Link>
            <Link href="/admin/resources" className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-primary)] flex items-center gap-1 mb-4 transition-colors">
              Resource Overview
            </Link>
          </div>
          <h1 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight uppercase">
            {hospital.name}
          </h1>
          <div className="text-sm text-[var(--cr-muted)] mt-1">
            Capacity & Resource Manager
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
        <Clock className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-900 leading-relaxed">
          Editing values here will immediately update the hospital's <code className="font-semibold">lastUpdated</code> timestamp. Available capacity is mathematically locked as <code className="font-semibold">Total - Occupied</code> to prevent contradictory states.
        </div>
      </div>

      {/* RESOURCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capacities.map(c => {
          const isCapacityBased = c.total > 0 || c.occupied > 0;

          return (
            <div key={c.id} className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex justify-between items-center">
                <h3 className="font-bold text-[var(--cr-deep-text)] uppercase tracking-wide">
                  {c.name}
                </h3>
                <div className="w-40">
                  <select 
                    value={c.status}
                    onChange={e => updateStatus(c.id, e.target.value)}
                    className={`w-full p-1.5 text-xs font-bold uppercase tracking-widest border rounded outline-none cursor-pointer ${
                      c.status === 'AVAILABLE' ? 'border-[var(--cr-success)]/30 text-[var(--cr-success)] bg-[var(--cr-success)]/5' :
                      c.status === 'LIMITED' ? 'border-[var(--cr-warning)]/30 text-[var(--cr-warning)] bg-[var(--cr-warning)]/5' :
                      'border-[var(--cr-danger)]/30 text-[var(--cr-danger)] bg-[var(--cr-danger)]/5'
                    }`}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </div>
              </div>

              {isCapacityBased ? (
                <div className="p-6 grid grid-cols-3 gap-6">
                  {/* TOTAL */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] text-center">Total</label>
                    <input 
                      type="number" 
                      value={c.total}
                      onChange={e => updateNumericCapacity(c.id, 'total', e.target.value)}
                      min={0}
                      className="w-full text-center text-xl font-bold text-[var(--cr-deep-text)] p-2 border border-[var(--cr-border)] rounded-lg focus:border-[var(--cr-primary)] outline-none"
                    />
                  </div>

                  {/* OCCUPIED */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] text-center">Occupied</label>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateNumericCapacity(c.id, 'occupied', String(c.occupied - 1))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-[var(--cr-deep-text)] rounded-lg transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <input 
                        type="number" 
                        value={c.occupied}
                        onChange={e => updateNumericCapacity(c.id, 'occupied', e.target.value)}
                        min={0}
                        max={c.total}
                        className="w-full text-center text-xl font-bold text-[var(--cr-deep-text)] p-2 border border-[var(--cr-border)] rounded-lg focus:border-[var(--cr-primary)] outline-none"
                      />
                      <button 
                        onClick={() => updateNumericCapacity(c.id, 'occupied', String(c.occupied + 1))}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-[var(--cr-deep-text)] rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* AVAILABLE (COMPUTED) */}
                  <div className="space-y-2 flex flex-col items-center">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] text-center">Available</label>
                    <div className={`text-4xl font-light tracking-tighter ${c.available === 0 ? 'text-[var(--cr-danger)]' : 'text-[var(--cr-success)]'} h-full flex items-center justify-center`}>
                      {c.available}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    {c.status === 'AVAILABLE' ? <CheckCircle2 className="text-[var(--cr-success)]" /> :
                     c.status === 'LIMITED' ? <AlertTriangle className="text-[var(--cr-warning)]" /> :
                     <XCircle className="text-[var(--cr-danger)]" />}
                  </div>
                  <h4 className="text-sm font-bold text-[var(--cr-deep-text)]">Status-Only Resource</h4>
                  <p className="text-xs text-[var(--cr-muted)] mt-1 max-w-[200px]">
                    This resource does not track numeric capacity bounds.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
