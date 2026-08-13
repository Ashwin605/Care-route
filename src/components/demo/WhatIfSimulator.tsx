import React from 'react';
import { Settings2, Car, Users, Bed } from 'lucide-react';
import { WhatIfOverrides } from '../../types/intelligence';
import { HospitalProfile } from '../../types/hospital';

interface WhatIfSimulatorProps {
  overrides: WhatIfOverrides;
  setOverrides: React.Dispatch<React.SetStateAction<WhatIfOverrides>>;
  cityCareHospital?: HospitalProfile; // for the signature demo
  baselinePrimaryId?: string;
  baselineBackupId?: string;
}

export default function WhatIfSimulator({ overrides, setOverrides, cityCareHospital, baselinePrimaryId, baselineBackupId }: WhatIfSimulatorProps) {
  const cityCareId = cityCareHospital?.id || 'h-citycare-001'; // Fallback if not found

  const toggleHospitalDisabled = (hospitalId: string) => {
    if (!hospitalId) return;
    setOverrides(prev => {
      const disabled = prev.disabledHospitals || [];
      const isCurrentlyDisabled = disabled.includes(hospitalId);
      return {
        ...prev,
        disabledHospitals: isCurrentlyDisabled 
          ? disabled.filter(id => id !== hospitalId)
          : [...disabled, hospitalId]
      };
    });
  };

  const handleCapacityChange = (delta: number) => {
    setOverrides(prev => ({
      ...prev,
      capacityDeltas: {
        ...prev.capacityDeltas,
        [cityCareId]: {
          ...prev.capacityDeltas[cityCareId],
          'ICU': delta
        }
      }
    }));
  };

  const handleTrafficChange = (multiplier: number) => {
    setOverrides(prev => ({
      ...prev,
      trafficMultiplier: multiplier
    }));
  };

  const toggleSpecialist = (specialty: string) => {
    setOverrides(prev => {
      const isUnavailable = prev.specialistUnavailability.includes(specialty);
      return {
        ...prev,
        specialistUnavailability: isUnavailable 
          ? prev.specialistUnavailability.filter(s => s !== specialty)
          : [...prev.specialistUnavailability, specialty]
      };
    });
  };

  const currentIcuDelta = overrides.capacityDeltas[cityCareId]?.['ICU'] || 0;
  const isCardioUnavailable = overrides.specialistUnavailability.includes('Cardiologist');
  const disabledHospitals = overrides.disabledHospitals || [];
  const isPrimaryDisabled = baselinePrimaryId ? disabledHospitals.includes(baselinePrimaryId) : false;
  const isBackupDisabled = baselineBackupId ? disabledHospitals.includes(baselineBackupId) : false;

  return (
    <div className="bg-[var(--cr-deep-text)] text-white p-6 rounded-xl shadow-2xl relative overflow-hidden h-[80vh] overflow-y-auto">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6">
        <Settings2 size={20} className="text-white" />
        <h3 className="text-sm font-bold tracking-[0.1em] text-white uppercase">WHAT IF? SIMULATOR</h3>
      </div>
      
      <p className="text-xs text-white/60 mb-6">
        Simulate network changes to observe how CARE ROUTE dynamically recalculates rankings and predictions.
      </p>

      <div className="space-y-6 relative z-10">
        
        {/* Scenario 0: Network Failures */}
        {(baselinePrimaryId || baselineBackupId) && (
          <div className="pt-2">
             <div className="text-xs font-bold tracking-[0.1em] text-white/50 uppercase mb-3 border-b border-white/10 pb-2">
                Simulate Network Failures
             </div>
             
             <div className="space-y-2">
               {baselinePrimaryId && (
                 <button
                   onClick={() => toggleHospitalDisabled(baselinePrimaryId)}
                   className={`w-full py-2 text-xs rounded transition-colors flex items-center justify-center gap-2 ${
                     isPrimaryDisabled 
                       ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                       : 'bg-white/10 text-white hover:bg-white/20 border border-transparent'
                   }`}
                 >
                   <div className={`w-2 h-2 rounded-full ${isPrimaryDisabled ? 'bg-red-500' : 'bg-white/30'}`} />
                   {isPrimaryDisabled ? 'Primary Hospital Offline' : 'Disable Primary Hospital'}
                 </button>
               )}
               {baselineBackupId && (
                 <button
                   onClick={() => toggleHospitalDisabled(baselineBackupId)}
                   className={`w-full py-2 text-xs rounded transition-colors flex items-center justify-center gap-2 ${
                     isBackupDisabled 
                       ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                       : 'bg-white/10 text-white hover:bg-white/20 border border-transparent'
                   }`}
                 >
                   <div className={`w-2 h-2 rounded-full ${isBackupDisabled ? 'bg-red-500' : 'bg-white/30'}`} />
                   {isBackupDisabled ? 'Backup 1 Offline' : 'Disable Backup 1'}
                 </button>
               )}
             </div>
          </div>
        )}

        <div className="text-xs font-bold tracking-[0.1em] text-white/50 uppercase mb-3 border-b border-white/10 pb-2 pt-2">
           Simulate Condition Changes
        </div>
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Bed size={16} />
              <span>CityCare ICU Capacity</span>
            </div>
            <span className="text-xs font-mono text-white/50">{currentIcuDelta} beds</span>
          </div>
          <input 
            type="range" 
            min="-3" 
            max="0" 
            step="1"
            value={currentIcuDelta}
            onChange={(e) => handleCapacityChange(parseInt(e.target.value))}
            className="w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40 mt-1">
            <span>Lose 3 beds</span>
            <span>Current (Normal)</span>
          </div>
        </div>

        {/* Scenario 2: Traffic */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Car size={16} />
              <span>Traffic Conditions</span>
            </div>
            <span className="text-xs font-mono text-white/50">{overrides.trafficMultiplier}x ETA</span>
          </div>
          <div className="flex gap-2">
            {[1.0, 1.5, 2.0].map(mult => (
              <button
                key={mult}
                onClick={() => handleTrafficChange(mult)}
                className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                  overrides.trafficMultiplier === mult 
                    ? 'bg-white text-[var(--cr-deep-text)] font-medium' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {mult === 1.0 ? 'Normal' : mult === 1.5 ? 'Heavy' : 'Severe'}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario 3: Specialist */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Users size={16} />
              <span>Cardiologist Status</span>
            </div>
          </div>
          <button
            onClick={() => toggleSpecialist('Cardiologist')}
            className={`w-full py-2 text-xs rounded transition-colors flex items-center justify-center gap-2 ${
              isCardioUnavailable 
                ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                : 'bg-green-500/20 text-green-300 border border-green-500/50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isCardioUnavailable ? 'bg-red-500' : 'bg-green-500'}`} />
            {isCardioUnavailable ? 'Simulating: Unavailable' : 'Available'}
          </button>
        </div>

      </div>
    </div>
  );
}
