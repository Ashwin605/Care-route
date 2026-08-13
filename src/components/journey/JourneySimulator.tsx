import React from 'react';
import { Settings2, MinusCircle, Car, CheckCircle, Navigation } from 'lucide-react';
import { HospitalProfile } from '../../types/hospital';
import { WhatIfOverrides } from '../../types/intelligence';

interface JourneySimulatorProps {
  targetHospital: HospitalProfile;
  currentEta: number;
  setSimulatedEta: React.Dispatch<React.SetStateAction<number>>;
  setOverrides: React.Dispatch<React.SetStateAction<WhatIfOverrides>>;
  onSimulateArrival: () => void;
}

export default function JourneySimulator({ 
  targetHospital, 
  currentEta, 
  setSimulatedEta, 
  setOverrides, 
  onSimulateArrival 
}: JourneySimulatorProps) {
  
  const handleTransit = () => {
    setSimulatedEta(prev => Math.max(1, prev - 5));
  };

  const handleCapacityCrisis = () => {
    setOverrides(prev => ({
      ...prev,
      capacityDeltas: {
        ...prev.capacityDeltas,
        [targetHospital.id]: {
          // Brutal hack for demo to guarantee a fail: drop ICU beds by a lot
          'ICU': -5,
          'Ventilator': -5
        }
      }
    }));
  };

  return (
    <div className="bg-[var(--cr-deep-text)] text-white p-6 rounded-xl shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 size={16} className="text-white/70" />
        <h3 className="text-xs font-bold tracking-[0.1em] text-white/70 uppercase">JOURNEY SIMULATOR</h3>
      </div>
      
      <p className="text-[10px] text-white/50 mb-6 uppercase tracking-wider">
        Demo Controls (Hackathon)
      </p>

      <div className="space-y-3">
        <button 
          onClick={handleTransit}
          className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg text-sm"
        >
          <span className="flex items-center gap-2"><Car size={16} /> Simulate Transit</span>
          <span className="text-xs font-mono text-white/50">-5 min</span>
        </button>

        <button 
          onClick={handleCapacityCrisis}
          className="w-full flex items-center justify-between bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-200 transition-colors p-3 rounded-lg text-sm"
        >
          <span className="flex items-center gap-2"><MinusCircle size={16} /> Simulate Capacity Crisis</span>
        </button>

        <button 
          onClick={() => setSimulatedEta(prev => prev + 14)}
          className="w-full flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 text-yellow-200 transition-colors p-3 rounded-lg text-sm"
        >
          <span className="flex items-center gap-2"><Navigation size={16} /> Increase Traffic</span>
          <span className="text-xs font-mono text-white/50">+14 min</span>
        </button>

        <div className="pt-4 border-t border-white/10 mt-4">
          <button 
            onClick={onSimulateArrival}
            className="w-full flex justify-center items-center gap-2 bg-[var(--cr-success)] text-white hover:bg-[var(--cr-success)]/90 transition-colors py-3 rounded-lg text-sm font-medium"
          >
            <CheckCircle size={16} /> Trigger Arrival
          </button>
        </div>
      </div>
    </div>
  );
}
