'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { publishNetworkEvent } from '@/data/mockEvents';
import { getFreshnessState } from '@/types/intelligence';
import { ArrowLeft, Building2, MapPin, Activity, AlertTriangle, CheckCircle2, XCircle, Clock, Edit2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminHospitalDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [hospital, setHospital] = useState(() => MOCK_HOSPITALS.find(h => h.id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  
  // Edit State
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    networkStatus: '',
    emergencyStatus: '',
  });
  const [pendingStatus, setPendingStatus] = useState('');

  useEffect(() => {
    if (hospital) {
      setEditForm({
        name: hospital.name,
        address: hospital.address,
        networkStatus: hospital.networkStatus,
        emergencyStatus: hospital.emergencyStatus,
      });
    }
  }, [hospital]);

  if (!hospital) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-[var(--cr-danger)]">Hospital Not Found</h2>
        <Link href="/admin/hospitals" className="text-[var(--cr-primary)] mt-4 inline-block hover:underline">Return to List</Link>
      </div>
    );
  }

  const capacity = MOCK_CAPACITY[hospital.id] || [];
  const { state: freshState, secondsAgo } = getFreshnessState(hospital.lastUpdate);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'OPERATIONAL': return <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center w-max gap-1.5"><CheckCircle2 size={14}/> Operational</span>;
      case 'LIMITED': return <span className="bg-[var(--cr-warning)]/10 text-[var(--cr-warning)] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center w-max gap-1.5"><AlertTriangle size={14}/> Limited</span>;
      case 'AT_RISK': return <span className="bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center w-max gap-1.5"><AlertTriangle size={14}/> At Risk</span>;
      case 'UNAVAILABLE': return <span className="bg-[var(--cr-danger)]/10 text-[var(--cr-danger)] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center w-max gap-1.5"><XCircle size={14}/> Unavailable</span>;
      default: return <span className="bg-gray-100 text-[var(--cr-muted)] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest">{status}</span>;
    }
  };

  const handleStatusChangeAttempt = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    if (newVal !== hospital.networkStatus) {
      setPendingStatus(newVal);
      setShowStatusConfirm(true);
    } else {
      setEditForm({ ...editForm, networkStatus: newVal });
    }
  };

  const applyStatusChange = () => {
    const idx = MOCK_HOSPITALS.findIndex(h => h.id === hospital.id);
    if (idx !== -1) {
      publishNetworkEvent({
        type: 'HOSPITAL_STATUS_CHANGED',
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        source: 'Admin User',
        previousState: hospital.networkStatus,
        newState: pendingStatus
      });
      
      MOCK_HOSPITALS[idx] = { 
        ...MOCK_HOSPITALS[idx], 
        networkStatus: pendingStatus as any,
        lastUpdate: new Date().toISOString()
      };
      setHospital(MOCK_HOSPITALS[idx]);
      setEditForm({ ...editForm, networkStatus: pendingStatus });
    }
    setShowStatusConfirm(false);
  };

  const handleSaveAll = () => {
    const idx = MOCK_HOSPITALS.findIndex(h => h.id === hospital.id);
    if (idx !== -1) {
      MOCK_HOSPITALS[idx] = { 
        ...MOCK_HOSPITALS[idx], 
        name: editForm.name,
        address: editForm.address,
        emergencyStatus: editForm.emergencyStatus as any,
        lastUpdate: new Date().toISOString()
      };
      setHospital(MOCK_HOSPITALS[idx]);
      
      // (A status update is better for the profile, but we don't track all fields in events yet)
    }
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <Link href="/admin/hospitals" className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-primary)] flex items-center gap-1 mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Network
          </Link>
          {isEditing ? (
            <input 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})}
              className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight uppercase border-b border-[var(--cr-border)] focus:border-[var(--cr-primary)] outline-none bg-transparent w-full pb-1"
            />
          ) : (
            <h1 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight uppercase">
              {hospital.name}
            </h1>
          )}
          <div className="flex items-center gap-2 text-sm text-[var(--cr-muted)] mt-2">
            <MapPin size={14} /> 
            {isEditing ? (
              <input 
                value={editForm.address} 
                onChange={e => setEditForm({...editForm, address: e.target.value})}
                className="border-b border-[var(--cr-border)] focus:border-[var(--cr-primary)] outline-none bg-transparent w-64 pb-1"
              />
            ) : (
              hospital.address
            )}
            <span className="mx-2">•</span>
            ID: {hospital.id}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: hospital.name,
                    address: hospital.address,
                    networkStatus: hospital.networkStatus,
                    emergencyStatus: hospital.emergencyStatus,
                  });
                }} 
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAll}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[var(--cr-primary)] text-white rounded hover:bg-[var(--cr-primary)]/90 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white border border-[var(--cr-border)] text-[var(--cr-deep-text)] rounded hover:border-[var(--cr-primary)] hover:text-[var(--cr-primary)] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Edit2 size={14} /> Edit Details
            </button>
          )}
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: IDENTITY & STATUS */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)] flex items-center gap-2">
                <Activity size={16} /> Operational Control
              </h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-3">Network Status</label>
                {isEditing ? (
                  <select 
                    value={editForm.networkStatus}
                    onChange={handleStatusChangeAttempt}
                    className="w-full p-2 border border-[var(--cr-border)] rounded focus:outline-none focus:border-[var(--cr-primary)] text-sm font-semibold text-[var(--cr-deep-text)]"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="AT_RISK">AT RISK</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                  </select>
                ) : (
                  getStatusBadge(hospital.networkStatus)
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-3">Emergency Status</label>
                {isEditing ? (
                  <select 
                    value={editForm.emergencyStatus}
                    onChange={e => setEditForm({...editForm, emergencyStatus: e.target.value})}
                    className="w-full p-2 border border-[var(--cr-border)] rounded focus:outline-none focus:border-[var(--cr-primary)] text-sm font-semibold text-[var(--cr-deep-text)]"
                  >
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="DIVERT">DIVERT</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                  </select>
                ) : (
                  getStatusBadge(hospital.emergencyStatus)
                )}
              </div>

              <div className="md:col-span-2 pt-4 border-t border-[var(--cr-border)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={freshState === 'STALE' ? 'text-[var(--cr-warning)]' : 'text-[var(--cr-muted)]'} />
                    <span className="text-sm font-medium text-[var(--cr-deep-text)]">
                      Last Synchronized: <span className={freshState === 'STALE' ? 'text-[var(--cr-warning)]' : ''}>{secondsAgo < 60 ? `${secondsAgo} seconds ago` : `${Math.floor(secondsAgo/60)} minutes ago`}</span>
                    </span>
                  </div>
                  {freshState === 'STALE' && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--cr-warning)]/10 text-[var(--cr-warning)] px-2 py-1 rounded">
                      Stale Data Warning
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)] flex items-center gap-2">
                <Building2 size={16} /> Accessibility & Features
              </h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {hospital.accessibilityFeatures.map(feat => (
                  <span key={feat} className="px-3 py-1.5 bg-gray-100 text-[var(--cr-deep-text)] text-xs font-medium rounded-full border border-[var(--cr-border)]">
                    {feat}
                  </span>
                ))}
              </div>
              {isEditing && (
                <p className="text-xs text-[var(--cr-muted)] mt-4 italic">
                  Note: Editing features directly is managed through the features JSON config. (Not enabled in this prototype view).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CAPACITY */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)] flex items-center gap-2">
                Current Capacity
              </h3>
              <Link href="/admin/capacity" className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)] hover:underline">
                Manage
              </Link>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-[var(--cr-border)]">
                  {capacity.map(c => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-semibold text-[var(--cr-deep-text)] uppercase">{c.resourceName}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${c.currentAvailable === 0 ? 'text-[var(--cr-danger)]' : 'text-[var(--cr-success)]'}`}>
                          {c.currentAvailable}
                        </span>
                        <span className="text-[var(--cr-muted)]"> / {c.totalCapacity}</span>
                      </td>
                    </tr>
                  ))}
                  {capacity.length === 0 && (
                    <tr><td colSpan={2} className="px-4 py-6 text-center text-sm text-[var(--cr-muted)]">No capacity tracked.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
            <ShieldAlert className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-blue-900 leading-relaxed">
              <strong>Source of Truth.</strong> Modifying operational status here immediately flags the hospital across the CARE ROUTE matching engine and patient maps. Calculated metrics like Total Time to Care and Match Score cannot be manually overridden.
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showStatusConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-[var(--cr-border)] max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--cr-border)] bg-[var(--cr-warning)]/10 text-[var(--cr-warning)] flex items-center gap-3">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-semibold tracking-tight">Confirm Status Change</h3>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-[var(--cr-deep-text)] leading-relaxed">
                  You are about to change the core operational status for <strong>{hospital.name}</strong>. This will immediately affect intelligent routing.
                </p>
                <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 rounded-lg border border-[var(--cr-border)]">
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Previous</div>
                    {getStatusBadge(hospital.networkStatus)}
                  </div>
                  <ChevronRight className="text-[var(--cr-muted)]" />
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">New</div>
                    {getStatusBadge(pendingStatus)}
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    onClick={() => {
                      setShowStatusConfirm(false);
                      setEditForm({...editForm, networkStatus: hospital.networkStatus});
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)] bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={applyStatusChange}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 rounded transition-colors"
                  >
                    Confirm Change
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
