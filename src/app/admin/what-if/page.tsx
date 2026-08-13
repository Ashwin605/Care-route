'use client';

import React, { useState } from 'react';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '@/data/mockSpecialists';
import { CareRequirement } from '@/types/care';
import { SimulationChange, SimulationResult, SimulationScenario } from '@/types/simulation';
import { runSimulation } from '@/lib/simulation/simulationEngine';
import { Activity, Plus, Play, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight, X, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hardcoded Baseline Patients for Simulation
const PATIENT_PROFILES: Record<string, CareRequirement> = {
  'cardiac-emergency': {
    condition: 'Cardiac Arrest',
    severity: 'critical',
    requiredSpecialties: ['Cardiology', 'Emergency Medicine'],
    requiredResources: ['ICU', 'Ventilator', 'Cardiac Cath Lab'],
    location: { lat: 13.92, lng: 79.68 },
    transportMode: 'ambulance'
  },
  'stroke': {
    condition: 'Acute Stroke',
    severity: 'critical',
    requiredSpecialties: ['Neurology', 'Emergency Medicine'],
    requiredResources: ['ICU', 'Imaging'],
    location: { lat: 13.91, lng: 79.65 },
    transportMode: 'ambulance'
  }
};

export default function AdminWhatIfPage() {
  const [patientProfile, setPatientProfile] = useState<string>('cardiac-emergency');
  
  // Scenario Builder State
  const [scenarioName, setScenarioName] = useState('Network Stress Test');
  const [scenarioDesc, setScenarioDesc] = useState('');
  const [changes, setChanges] = useState<SimulationChange[]>([]);
  
  // Builder Form State
  const [targetHosp, setTargetHosp] = useState(MOCK_HOSPITALS[0].id);
  const [targetProp, setTargetProp] = useState('ICU');
  const [simValue, setSimValue] = useState('0');
  const [errorMsg, setErrorMsg] = useState('');

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic Current Baseline Helper
  const getCurrentBaseline = () => {
    if (targetHosp === 'GLOBAL_NETWORK' && targetProp === 'TRAFFIC') {
      return { val: '1.0', label: 'Normal Traffic (1.0x ETA)' };
    }

    const hosp = MOCK_HOSPITALS.find(h => h.id === targetHosp);
    if (!hosp) return { val: '--', label: 'Unknown' };

    if (targetProp === 'STATUS') {
      return { val: hosp.networkStatus, label: hosp.networkStatus };
    }
    
    if (targetProp === 'Cardiology' || targetProp === 'Neurology') {
      const specs = MOCK_SPECIALISTS[hosp.id] || [];
      const spec = specs.find(s => s.specialty === targetProp);
      return { val: spec?.status || 'UNKNOWN', label: spec?.status || 'Unknown' };
    }

    const caps = MOCK_CAPACITY[hosp.id] || [];
    const cap = caps.find(c => c.name.toLowerCase().includes(targetProp.toLowerCase()));
    if (cap) {
      return { val: String(cap.available), label: `${cap.available} available (Total: ${cap.total})`, capObj: cap };
    }
    
    return { val: '--', label: 'Not tracked' };
  };

  const currentBaseline = getCurrentBaseline();

  const addChange = () => {
    setErrorMsg('');

    // Duplicate Check
    const exists = changes.find(c => c.hospitalId === targetHosp && (c.targetName === targetProp || (!c.targetName && targetProp === 'STATUS')));
    if (exists) {
      setErrorMsg(`A variable for ${targetProp} at this location already exists. Remove it first.`);
      return;
    }

    // Validation
    if (targetHosp !== 'GLOBAL_NETWORK' && targetProp !== 'STATUS' && targetProp !== 'Cardiology' && targetProp !== 'Neurology') {
      const val = parseInt(simValue);
      if (isNaN(val) || val < 0) {
        setErrorMsg('Capacity cannot be negative.');
        return;
      }
      if (currentBaseline.capObj && val > currentBaseline.capObj.total) {
        setErrorMsg(`Capacity cannot exceed total hospital provision (${currentBaseline.capObj.total}).`);
        return;
      }
    }

    let type: any = 'CAPACITY_DELTA';
    let prev = currentBaseline.val;
    let name = targetHosp === 'GLOBAL_NETWORK' ? 'Entire Network' : MOCK_HOSPITALS.find(h => h.id === targetHosp)?.name || 'Unknown';

    if (targetHosp === 'GLOBAL_NETWORK' && targetProp === 'TRAFFIC') {
      type = 'TRAFFIC_MULTIPLIER';
    } else if (targetProp === 'Cardiology' || targetProp === 'Neurology') {
      type = 'SPECIALIST_STATUS';
    } else if (targetProp === 'STATUS') {
      type = 'HOSPITAL_STATUS';
    }

    const change: SimulationChange = {
      id: `chg-${Date.now()}`,
      hospitalId: targetHosp,
      hospitalName: name,
      type,
      targetName: targetProp === 'STATUS' ? undefined : targetProp,
      previousValue: prev,
      simulatedValue: simValue
    };

    setChanges([...changes, change]);
  };

  const removeChange = (id: string) => {
    setChanges(changes.filter(c => c.id !== id));
  };

  const resetScenario = () => {
    setChanges([]);
    setResult(null);
    setScenarioName('Network Stress Test');
    setScenarioDesc('');
    setErrorMsg('');
  };

  const executeSimulation = () => {
    if (changes.length === 0) {
      setErrorMsg('Add at least one network disruption to run a simulation.');
      return;
    }

    setIsSimulating(true);
    setErrorMsg('');
    setTimeout(() => {
      const scenario: SimulationScenario = {
        id: `scen-${Date.now()}`,
        name: scenarioName,
        description: scenarioDesc,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin User',
        changes
      };

      const res = runSimulation(
        MOCK_HOSPITALS,
        MOCK_CAPACITY,
        MOCK_SPECIALISTS,
        PATIENT_PROFILES[patientProfile],
        scenario
      );

      setResult(res);
      setIsSimulating(false);
    }, 800);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="bg-[var(--cr-success)] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">1st Choice</span>;
    if (rank === 2) return <span className="bg-[var(--cr-primary)]/20 text-[var(--cr-primary)] px-2 py-0.5 rounded text-[10px] font-bold uppercase">2nd Choice</span>;
    return <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Rank {rank}</span>;
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1 flex items-center gap-2">
            <Activity size={16} /> WHAT-IF INTELLIGENCE
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Network Simulation Engine
          </h2>
          <p className="text-sm text-[var(--cr-muted)] mt-2">
            Explore how hypothetical changes in the healthcare network affect care availability and algorithmic hospital recommendations.
          </p>
        </div>
        <div>
          <button 
            onClick={resetScenario}
            className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] transition-colors flex items-center gap-1"
          >
            <RefreshCcw size={14} /> Reset Scenario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SCENARIO BUILDER (LEFT) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)]">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--cr-deep-text)]">
                Scenario Configuration
              </h3>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Scenario Name</label>
                <input 
                  type="text" 
                  value={scenarioName}
                  onChange={e => setScenarioName(e.target.value)}
                  className="w-full text-sm font-semibold p-3 border border-[var(--cr-border)] rounded-lg outline-none focus:border-[var(--cr-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Optional Description</label>
                <input 
                  type="text" 
                  value={scenarioDesc}
                  onChange={e => setScenarioDesc(e.target.value)}
                  placeholder="E.g., Simulate mass casualty event occupying all ICU beds."
                  className="w-full text-xs p-3 border border-[var(--cr-border)] rounded-lg outline-none focus:border-[var(--cr-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Test Subject (Baseline Routing)</label>
                <select 
                  value={patientProfile}
                  onChange={e => setPatientProfile(e.target.value)}
                  className="w-full text-sm font-semibold p-3 border border-[var(--cr-border)] rounded-lg outline-none focus:border-[var(--cr-primary)] bg-gray-50"
                >
                  <option value="cardiac-emergency">Cardiac Emergency (Requires Cardiology & ICU)</option>
                  <option value="stroke">Acute Stroke (Requires Neurology & Imaging)</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-[var(--cr-border)] space-y-5 bg-gray-50/50">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">+ Add Network Change</h4>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Target</label>
                  <select 
                    value={targetHosp}
                    onChange={e => {
                      setTargetHosp(e.target.value);
                      if (e.target.value === 'GLOBAL_NETWORK') setTargetProp('TRAFFIC');
                      else if (targetProp === 'TRAFFIC') setTargetProp('ICU');
                    }}
                    className="w-full text-xs p-2.5 border border-[var(--cr-border)] rounded outline-none bg-white"
                  >
                    <option value="GLOBAL_NETWORK">Entire Network (Global)</option>
                    {MOCK_HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Variable</label>
                    <select 
                      value={targetProp}
                      onChange={e => setTargetProp(e.target.value)}
                      className="w-full text-xs p-2.5 border border-[var(--cr-border)] rounded outline-none bg-white"
                    >
                      {targetHosp === 'GLOBAL_NETWORK' ? (
                        <option value="TRAFFIC">Traffic Multiplier</option>
                      ) : (
                        <>
                          <option value="ICU">ICU Capacity</option>
                          <option value="Ventilator">Ventilators</option>
                          <option value="Cardiology">Cardiology Spec.</option>
                          <option value="Neurology">Neurology Spec.</option>
                          <option value="STATUS">Hospital Status</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Simulated Value</label>
                    {targetProp === 'TRAFFIC' ? (
                      <select value={simValue} onChange={e => setSimValue(e.target.value)} className="w-full text-xs p-2.5 border border-[var(--cr-border)] rounded outline-none bg-white font-semibold text-[var(--cr-danger)]">
                        <option value="1.0">Normal (1.0x)</option>
                        <option value="1.5">Heavy (1.5x)</option>
                        <option value="2.0">Gridlock (2.0x)</option>
                      </select>
                    ) : targetProp === 'STATUS' || targetProp === 'Cardiology' || targetProp === 'Neurology' ? (
                      <select value={simValue} onChange={e => setSimValue(e.target.value)} className="w-full text-xs p-2.5 border border-[var(--cr-border)] rounded outline-none bg-white font-semibold text-[var(--cr-danger)]">
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="LIMITED">LIMITED</option>
                        <option value="UNAVAILABLE">UNAVAILABLE</option>
                      </select>
                    ) : (
                      <input 
                        type="number"
                        min="0"
                        value={simValue} 
                        onChange={e => setSimValue(e.target.value)} 
                        className="w-full text-xs p-2.5 border border-[var(--cr-border)] rounded outline-none bg-white font-semibold text-[var(--cr-danger)]"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Baseline Context Panel */}
              <div className="bg-white border border-[var(--cr-border)] rounded-lg p-3 flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Current Network Baseline:</div>
                <div className="text-xs font-semibold text-[var(--cr-deep-text)]">{currentBaseline.label}</div>
              </div>

              {errorMsg && (
                <div className="text-xs font-semibold text-[var(--cr-danger)] bg-[var(--cr-danger)]/10 p-2 rounded flex items-center gap-2">
                  <AlertTriangle size={14} /> {errorMsg}
                </div>
              )}

              <button 
                onClick={addChange}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)] bg-white border border-[var(--cr-border)] hover:bg-gray-50 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Network Disruption
              </button>
            </div>

            {/* Changes List */}
            {changes.length > 0 && (
              <div className="p-5 border-t border-[var(--cr-border)] bg-gray-50 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Active Variables</h4>
                {changes.map(c => (
                  <div key={c.id} className="bg-white p-3 rounded-lg border border-[var(--cr-border)] flex items-center justify-between shadow-sm group">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[var(--cr-deep-text)]">{c.hospitalName}</div>
                      <div className="text-xs text-[var(--cr-muted)] mt-1 flex items-center gap-1.5">
                        <span className="font-medium">{c.targetName || 'Status'}</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{c.previousValue}</span>
                        <ArrowRight size={10} className="text-[var(--cr-primary)]" /> 
                        <span className="px-1.5 py-0.5 bg-[var(--cr-danger)]/10 text-[var(--cr-danger)] font-bold rounded text-[10px]">{c.simulatedValue}</span>
                      </div>
                    </div>
                    <button onClick={() => removeChange(c.id)} className="text-gray-400 hover:text-[var(--cr-danger)] p-2 rounded hover:bg-[var(--cr-danger)]/10 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-5 border-t border-[var(--cr-border)]">
              <button 
                onClick={executeSimulation}
                disabled={isSimulating}
                className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
                  changes.length === 0 
                    ? 'bg-gray-100 text-[var(--cr-muted)] cursor-not-allowed border border-[var(--cr-border)]' 
                    : 'bg-[var(--cr-primary)] text-white hover:bg-[var(--cr-primary)]/90'
                }`}
              >
                {isSimulating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={16} />}
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS PANE (RIGHT) */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !isSimulating && (
            <div className="h-full min-h-[500px] border-2 border-dashed border-[var(--cr-border)] rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-gray-50/50">
              <Activity size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-[var(--cr-deep-text)] mb-2">Simulation Engine Ready</h3>
              <p className="text-sm text-[var(--cr-muted)] max-w-md">
                Configure scenario variables on the left and run the simulation to instantly visualize how network constraints impact the routing algorithm.
              </p>
            </div>
          )}

          {isSimulating && (
             <div className="h-full min-h-[500px] border-2 border-[var(--cr-border)] rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-white shadow-sm">
             <div className="w-12 h-12 border-4 border-[var(--cr-primary)]/20 border-t-[var(--cr-primary)] rounded-full animate-spin mb-6" />
             <h3 className="text-lg font-semibold text-[var(--cr-deep-text)] mb-2">Running Thousands of Combinations</h3>
             <p className="text-sm text-[var(--cr-muted)] max-w-md">
               Isolating scenario state and re-running eligibility and ranking algorithms...
             </p>
           </div>
          )}

          <AnimatePresence>
            {result && !isSimulating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Meta Banner */}
                <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1 flex items-center gap-2">
                        <Activity size={14} /> WHAT-IF ANALYSIS • SIMULATION ONLY
                      </div>
                      <h3 className="text-xl font-bold text-[var(--cr-deep-text)]">Scenario: {result.scenario.name}</h3>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mt-2">
                        Test Patient: {PATIENT_PROFILES[patientProfile].condition} • Executed {new Date(result.executedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-700 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                      <AlertTriangle size={16} className="text-orange-500" /> This simulation does not modify the live healthcare network.
                    </div>
                  </div>
                </div>

                {/* SIMULATION TIMELINE */}
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-gray-400 justify-center">
                  <span>Scenario created</span> <ArrowRight size={10} /> 
                  <span>Changes applied</span> <ArrowRight size={10} /> 
                  <span>Network analyzed</span> <ArrowRight size={10} /> 
                  <span>Hospitals re-ranked</span> <ArrowRight size={10} /> 
                  <span className="text-[var(--cr-primary)]">Recommendation generated</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* BASELINE */}
                  <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-[var(--cr-border)] bg-gray-50 flex items-center gap-2 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Baseline Reality</h4>
                    </div>
                    <div className="p-4 space-y-3 flex-1 bg-[var(--cr-background)]">
                      {(() => {
                        const recs = [];
                        if (result.baseline.recommendedHospital) recs.push(result.baseline.recommendedHospital);
                        recs.push(...result.baseline.alternatives);
                        return recs.slice(0, 4).map((r, idx) => (
                        <div key={r.hospital.id} className="p-4 border border-[var(--cr-border)] rounded-lg bg-white flex items-center justify-between shadow-sm">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-sm text-[var(--cr-deep-text)]">{r.hospital.name}</span>
                              {getRankBadge(idx + 1)}
                            </div>
                            <div className="text-xs text-[var(--cr-muted)] flex items-center gap-3">
                              <span>Match Score: <span className="font-semibold text-[var(--cr-primary)]">{r.matchScore}%</span></span>
                              <span>ETA: <span className="font-semibold">{r.etaMinutes}m</span></span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-[var(--cr-muted)]" />
                        </div>
                        ));
                      })()}
                      {(!result.baseline.recommendedHospital && result.baseline.alternatives.length === 0) && (
                        <div className="text-sm text-gray-500 p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">No eligible hospitals found.</div>
                      )}
                    </div>
                  </div>

                  {/* SIMULATED */}
                  <div className="bg-white rounded-xl border border-[var(--cr-danger)] shadow-md overflow-hidden relative flex flex-col h-full">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--cr-danger)]"></div>
                    <div className="p-4 border-b border-[var(--cr-border)] bg-red-50/50 flex items-center gap-2 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[var(--cr-danger)] animate-pulse"></div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--cr-danger)]">Simulated Outcome</h4>
                    </div>
                    <div className="p-4 space-y-3 flex-1 bg-[var(--cr-background)]">
                      {(() => {
                        const baseRecs = [];
                        if (result.baseline.recommendedHospital) baseRecs.push(result.baseline.recommendedHospital);
                        baseRecs.push(...result.baseline.alternatives);

                        const simRecs = [];
                        if (result.simulated.recommendedHospital) simRecs.push(result.simulated.recommendedHospital);
                        simRecs.push(...result.simulated.alternatives);

                        return simRecs.slice(0, 4).map((r, idx) => {
                          const baselineIdx = baseRecs.findIndex(br => br.hospital.id === r.hospital.id);
                          const isNew = baselineIdx === -1 || baselineIdx > idx;

                          return (
                            <div key={r.hospital.id} className={`p-4 border rounded-lg flex items-center justify-between shadow-sm ${isNew ? 'bg-orange-50/50 border-orange-200' : 'border-[var(--cr-border)] bg-white'}`}>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-bold text-sm text-[var(--cr-deep-text)]">{r.hospital.name}</span>
                                  {getRankBadge(idx + 1)}
                                  {isNew && <span className="text-[9px] font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">Rerouted Here</span>}
                                </div>
                                <div className="text-xs text-[var(--cr-muted)] flex items-center gap-3">
                                  <span>Match Score: <span className="font-semibold text-[var(--cr-primary)]">{r.matchScore}%</span></span>
                                  <span>ETA: <span className="font-semibold text-[var(--cr-danger)]">{r.etaMinutes}m</span></span>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-[var(--cr-muted)]" />
                            </div>
                          )
                        });
                      })()}
                      {(!result.simulated.recommendedHospital && result.simulated.alternatives.length === 0) && (
                        <div className="text-sm text-red-600 p-8 text-center font-medium flex flex-col items-center justify-center gap-3 border-2 border-dashed border-red-200 rounded-lg bg-red-50/30">
                          <AlertTriangle size={24} className="text-red-400" />
                          Network Failure: No eligible hospitals remain under this scenario.
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* IMPACT SUMMARY PANEL */}
                <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden mt-6">
                  <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Simulation Impact Analysis</h4>
                  </div>
                  
                  {/* NETWORK IMPACT STATS */}
                  <div className="border-b border-[var(--cr-border)] bg-gray-50 p-4">
                    {(() => {
                      const hospitalsAffected = new Set(result.scenario.changes.map(c => c.hospitalId).filter(id => id && id !== 'GLOBAL_NETWORK')).size;
                      const constrainedCount = MOCK_HOSPITALS.filter(h => {
                        const b = result.baseline.candidateStates?.[h.id];
                        const s = result.simulated.candidateStates?.[h.id];
                        return (b === 'ELIGIBLE' || b === 'RECOMMENDED') && (s === 'AT_RISK' || s === 'LIMITED');
                      }).length;
                      const unavailableCount = MOCK_HOSPITALS.filter(h => {
                        const b = result.baseline.candidateStates?.[h.id];
                        const s = result.simulated.candidateStates?.[h.id];
                        return (b !== 'INELIGIBLE' && b !== 'UNAVAILABLE') && (s === 'INELIGIBLE' || s === 'UNAVAILABLE');
                      }).length;
                      
                      const topBase = result.baseline.recommendedHospital;
                      const topSim = result.simulated.recommendedHospital;
                      const recommendationChanges = topBase?.hospital.id !== topSim?.hospital.id ? 1 : 0;

                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Hospitals Affected</div>
                            <div className="text-xl font-bold text-[var(--cr-deep-text)]">{hospitalsAffected}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Newly Constrained</div>
                            <div className="text-xl font-bold text-[var(--cr-warning)]">{constrainedCount}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Newly Unavailable</div>
                            <div className="text-xl font-bold text-[var(--cr-danger)]">{unavailableCount}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Reroutes Triggered</div>
                            <div className="text-xl font-bold text-[var(--cr-primary)]">{recommendationChanges}</div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Routing Impact */}
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-4">Routing Impact</h5>
                      {(() => {
                        const baseRecs = [];
                        if (result.baseline.recommendedHospital) baseRecs.push(result.baseline.recommendedHospital);
                        baseRecs.push(...result.baseline.alternatives);

                        const simRecs = [];
                        if (result.simulated.recommendedHospital) simRecs.push(result.simulated.recommendedHospital);
                        simRecs.push(...result.simulated.alternatives);

                        const topBase = baseRecs[0];
                        const topSim = simRecs[0];
                        const changed = topBase?.hospital.id !== topSim?.hospital.id;

                        if (!topBase && !topSim) return <div className="text-sm text-gray-500">No routing available in either scenario.</div>;

                        // Check if traffic was a primary cause for routing
                        const trafficChange = result.scenario.changes.find(c => c.type === 'TRAFFIC_MULTIPLIER');

                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-[var(--cr-border)]">
                              <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Recommendation Changed:</span>
                              <span className={`text-xs font-bold px-2 py-1 rounded ${changed ? 'bg-[var(--cr-warning)]/20 text-[var(--cr-warning)]' : 'bg-gray-200 text-gray-600'}`}>
                                {changed ? 'YES' : 'NO'}
                              </span>
                            </div>

                            {changed && topBase && topSim && (
                              <div className="grid grid-cols-2 gap-2 text-sm border border-[var(--cr-border)] rounded-lg overflow-hidden">
                                <div className="p-3 bg-gray-50 border-r border-[var(--cr-border)]">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Previous</div>
                                  <div className="font-bold text-[var(--cr-deep-text)]">{topBase.hospital.name}</div>
                                </div>
                                <div className="p-3 bg-orange-50">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">New</div>
                                  <div className="font-bold text-[var(--cr-danger)]">{topSim.hospital.name}</div>
                                </div>
                              </div>
                            )}

                            {!changed && topBase && (
                              <div className="p-3 bg-gray-50 border border-[var(--cr-border)] rounded-lg">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">RECOMMENDATION UNCHANGED</div>
                                <div className="text-sm font-medium text-gray-700">Although network conditions changed, the current recommendation remains the strongest suitable option.</div>
                              </div>
                            )}

                            {topBase && topSim && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Score Shifts</div>
                                <div className="flex items-center justify-between text-sm py-1 border-b border-[var(--cr-border)]">
                                  <span className="font-semibold">{topBase.hospital.name}</span>
                                  <span className="text-gray-500">{topBase.matchScore}% &rarr; <span className={changed ? 'text-[var(--cr-danger)]' : ''}>{simRecs.find(r => r.hospital.id === topBase.hospital.id)?.matchScore || 0}%</span></span>
                                </div>
                                {changed && (
                                  <div className="flex items-center justify-between text-sm py-1">
                                    <span className="font-semibold">{topSim.hospital.name}</span>
                                    <span className="text-gray-500">{baseRecs.find(r => r.hospital.id === topSim.hospital.id)?.matchScore || 0}% &rarr; <span className="text-[var(--cr-success)] font-bold">{topSim.matchScore}%</span></span>
                                  </div>
                                )}
                              </div>
                            )}

                            {trafficChange && topBase && (
                              <div className="space-y-2 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Travel Impact</div>
                                <div className="text-sm font-medium text-blue-800 space-y-1">
                                  <div><span className="font-bold opacity-75">ETA:</span> {topBase.etaMinutes}m &rarr; {simRecs.find(r => r.hospital.id === topBase.hospital.id)?.etaMinutes || '--'}m</div>
                                  <div><span className="font-bold opacity-75">Total Time to Care:</span> {topBase.totalTimeToCare?.totalEstimatedMinutes || '--'}m &rarr; {simRecs.find(r => r.hospital.id === topBase.hospital.id)?.totalTimeToCare?.totalEstimatedMinutes || '--'}m</div>
                                </div>
                                {changed && (
                                  <div className="text-xs text-blue-700 mt-2 italic">
                                    {topBase.hospital.name}'s simulated travel time increased significantly, making {topSim.hospital.name} the faster suitable option.
                                  </div>
                                )}
                              </div>
                            )}

                            {changed && topBase && (
                              <div className="space-y-2 mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-red-600">Why was {topBase.hospital.name} Rerouted?</div>
                                <div className="text-sm font-medium text-[var(--cr-danger)]">
                                  {(() => {
                                    const reasons = result.simulated.allReasons?.[topBase.hospital.id] || [];
                                    const failures = reasons.filter((r: any) => !r.passed);
                                    if (failures.length > 0) {
                                      return failures.map((f: any) => f.message).join(' • ');
                                    }
                                    return `Score dropped by ${(topBase.matchScore - (simRecs.find(r => r.hospital.id === topBase.hospital.id)?.matchScore || 0)).toFixed(1)} points due to network constraints.`;
                                  })()}
                                </div>
                              </div>
                            )}

                            {(() => {
                              const eligibilityChanges = MOCK_HOSPITALS.map(h => {
                                const baseState = result.baseline.candidateStates?.[h.id];
                                const simState = result.simulated.candidateStates?.[h.id];
                                if (baseState && simState && baseState !== simState && baseState !== 'RECOMMENDED' && simState !== 'RECOMMENDED') {
                                  return { hospital: h.name, from: baseState, to: simState };
                                }
                                return null;
                              }).filter(Boolean);

                              if (!eligibilityChanges || eligibilityChanges.length === 0) return null;

                              return (
                                <div className="space-y-2 mt-4">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)]">Eligibility Shifts</div>
                                  {eligibilityChanges.map((ec, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-[var(--cr-border)]">
                                      <span className="font-semibold">{ec?.hospital}</span>
                                      <span className="text-gray-500 font-mono text-xs">{ec?.from} &rarr; <span className="font-bold text-[var(--cr-danger)]">{ec?.to}</span></span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Capacity / Network Impact */}
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-4">Variables Injected</h5>
                      <div className="space-y-3">
                        {result.scenario.changes.map(c => (
                          <div key={c.id} className="p-3 border border-[var(--cr-border)] rounded-lg text-sm bg-white">
                            <div className="font-bold text-[var(--cr-deep-text)] mb-1">{c.hospitalName}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-medium text-gray-700">{c.targetName || 'Status'}</span>
                              <span className="text-gray-400">|</span>
                              <span className="font-mono text-[var(--cr-danger)]">{c.previousValue} &rarr; {c.simulatedValue}</span>
                            </div>
                            {c.type === 'CAPACITY_DELTA' && parseInt(c.simulatedValue) === 0 && (
                              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-600 px-2 py-1 rounded inline-block">
                                AVAILABILITY: AVAILABLE &rarr; UNAVAILABLE
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* HOSPITAL COMPARISON TABLE */}
                <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden mt-6 overflow-x-auto">
                  <div className="p-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)] flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--cr-deep-text)]">Hospital Comparison Matrix</h4>
                  </div>
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-[var(--cr-border)]">
                      <tr>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Hospital</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Eligibility</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Match Score</th>
                        <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">ETA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--cr-border)]">
                      {(() => {
                        const baseRecs = [];
                        if (result.baseline.recommendedHospital) baseRecs.push(result.baseline.recommendedHospital);
                        baseRecs.push(...result.baseline.alternatives);

                        const simRecs = [];
                        if (result.simulated.recommendedHospital) simRecs.push(result.simulated.recommendedHospital);
                        simRecs.push(...result.simulated.alternatives);

                        const allHospitals = Array.from(new Set([...baseRecs, ...simRecs].map(r => r.hospital.id)))
                          .map(id => {
                            const b = baseRecs.find(r => r.hospital.id === id);
                            const s = simRecs.find(r => r.hospital.id === id);
                            return { id, hospital: b?.hospital || s?.hospital, base: b, sim: s };
                          }).slice(0, 5);

                        return allHospitals.map(row => {
                          const baseState = result.baseline.candidateStates?.[row.id] || 'INELIGIBLE';
                          const simState = result.simulated.candidateStates?.[row.id] || 'INELIGIBLE';
                          const stateChanged = baseState !== simState;
                          const scoreChanged = (row.base?.matchScore || 0) !== (row.sim?.matchScore || 0);

                          return (
                            <tr key={row.id} className="hover:bg-gray-50">
                              <td className="p-4 font-bold text-[var(--cr-deep-text)]">{row.hospital?.name}</td>
                              <td className="p-4">
                                <span className={stateChanged ? 'text-[var(--cr-danger)] font-semibold' : 'text-gray-500'}>
                                  {baseState} &rarr; {simState}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={scoreChanged ? 'text-[var(--cr-danger)] font-semibold' : 'text-gray-500'}>
                                  {row.base?.matchScore || 0}% &rarr; {row.sim?.matchScore || 0}%
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-gray-500">
                                  {row.base?.etaMinutes || '--'}m &rarr; {row.sim?.etaMinutes || '--'}m
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
