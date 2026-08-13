import React from 'react';
import { Recommendation } from '../../types/recommendation';
import { CareRequirement } from '../../types/care';
import { IntelligenceResult } from '../../types/intelligence';

interface IntelligentHospitalComparisonProps {
  primary: Recommendation;
  alternatives: Recommendation[];
  requirements: CareRequirement;
  intelligence: IntelligenceResult;
  onWhyThisOption: (rec: Recommendation) => void;
  onStartJourney?: (rec: Recommendation) => void;
}

export default function IntelligentHospitalComparison({ 
  primary, 
  alternatives, 
  requirements,
  intelligence,
  onWhyThisOption,
  onStartJourney
}: IntelligentHospitalComparisonProps) {
  const allHospitals = [primary, ...alternatives];
  if (allHospitals.length <= 1) return null;

  // Helper to safely get capacities
  const getCapacity = (rec: Recommendation) => {
    const coreResource = requirements.resources.find(r => ['icu', 'ventilator', 'general beds'].includes(r.toLowerCase()));
    if (!coreResource) return { current: '--', expected: '--' };

    if (rec.expectedArrivalCapacity && rec.expectedArrivalCapacity.resourceName.toLowerCase() === coreResource.toLowerCase()) {
       return {
         current: rec.expectedArrivalCapacity.currentAvailable,
         expected: rec.expectedArrivalCapacity.expectedAvailable
       };
    }
    return { current: '--', expected: '--' };
  };

  // Find "best" values to highlight
  const minEta = Math.min(...allHospitals.map(h => h.etaMinutes));
  const minTotalTime = Math.min(...allHospitals.map(h => h.totalTimeToCare?.totalEstimatedMinutes || 999));
  
  const expectedCapacities = allHospitals.map(h => {
     const cap = getCapacity(h).expected;
     return typeof cap === 'number' ? cap : -1;
  });
  const maxExpectedCapacity = Math.max(...expectedCapacities);

  // Confidence mapping
  const confScore = (conf?: string) => {
    if (conf === 'HIGH') return 3;
    if (conf === 'MEDIUM') return 2;
    if (conf === 'LOW') return 1;
    return 0;
  };
  const maxConfScore = Math.max(...allHospitals.map(h => confScore(h.totalTimeToCare?.confidence)));

  const resourceName = requirements.resources.find(r => ['icu', 'ventilator', 'general beds'].includes(r.toLowerCase())) || 'Required';

  return (
    <div className="bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm overflow-hidden mb-12">
      <div className="p-6 border-b border-[var(--cr-border)] bg-[var(--cr-background)] text-center md:text-left flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--cr-muted)]">
            Intelligent Hospital Comparison
          </h3>
          <h2 className="text-xl font-light text-[var(--cr-deep-text)] uppercase mt-1 tracking-widest">
            Compare Options
          </h2>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-r border-[var(--cr-border)] w-1/4">Metric</th>
              {allHospitals.map((h, i) => (
                <th key={h.hospitalId} className={`px-6 py-4 font-bold border-b border-[var(--cr-border)] ${i === 0 ? 'text-[var(--cr-primary)] border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'text-[var(--cr-deep-text)] border-r border-[var(--cr-border)]'}`}>
                  {h.hospital.name}
                  {i === 0 && <span className="block text-[8px] tracking-widest bg-[var(--cr-primary)] text-white px-2 py-0.5 rounded mt-2 w-max">RECOMMENDED</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cr-border)] text-[var(--cr-deep-text)] font-medium">
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] border-r border-[var(--cr-border)] bg-[var(--cr-background)]">Match Score</td>
              {allHospitals.map((h, i) => <td key={h.hospitalId} className={`px-6 py-4 ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'}`}>{h.matchScore}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] border-r border-[var(--cr-border)] bg-[var(--cr-background)]">Distance</td>
              {allHospitals.map((h, i) => <td key={h.hospitalId} className={`px-6 py-4 ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'}`}>{h.distanceKm} km</td>)}
            </tr>
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] border-r border-[var(--cr-border)] bg-[var(--cr-background)]">ETA</td>
              {allHospitals.map((h, i) => (
                <td key={h.hospitalId} className={`px-6 py-4 ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'} ${h.etaMinutes === minEta ? 'text-[var(--cr-success)] bg-[var(--cr-success)]/5' : ''}`}>
                  {h.etaMinutes} min
                  {h.etaMinutes === minEta && <span className="block text-[9px] font-normal text-[var(--cr-muted)] mt-0.5 italic">Better ETA for this requirement</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] border-r border-[var(--cr-border)] bg-[var(--cr-background)]">{resourceName} Now</td>
              {allHospitals.map((h, i) => <td key={h.hospitalId} className={`px-6 py-4 ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'}`}>{getCapacity(h).current}</td>)}
            </tr>
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] border-r border-[var(--cr-border)] bg-[var(--cr-background)]">{resourceName} at Arrival</td>
              {allHospitals.map((h, i) => {
                const cap = getCapacity(h).expected;
                const isBest = typeof cap === 'number' && cap === maxExpectedCapacity && cap > 0;
                return (
                  <td key={h.hospitalId} className={`px-6 py-4 ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'} ${isBest ? 'text-[var(--cr-success)] bg-[var(--cr-success)]/5' : ''}`}>
                    {cap}
                    {isBest && <span className="block text-[9px] font-normal text-[var(--cr-muted)] mt-0.5 italic">Better arrival capacity</span>}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] font-bold border-r border-[var(--cr-border)] bg-[var(--cr-background)]">Total Time</td>
              {allHospitals.map((h, i) => {
                const tt = h.totalTimeToCare?.totalEstimatedMinutes || (h.etaMinutes + 8);
                const isBest = tt === minTotalTime;
                return (
                  <td key={h.hospitalId} className={`px-6 py-4 font-bold ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'} ${isBest ? 'text-[var(--cr-primary)] bg-[var(--cr-primary)]/5' : ''}`}>
                    {tt} min
                    {isBest && <span className="block text-[9px] font-normal text-[var(--cr-muted)] mt-0.5 italic">Better total time</span>}
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-6 py-4 text-[var(--cr-muted)] border-r border-[var(--cr-border)] bg-[var(--cr-background)]">Confidence</td>
              {allHospitals.map((h, i) => {
                const conf = h.totalTimeToCare?.confidence || 'MEDIUM';
                const isBest = confScore(conf) === maxConfScore && confScore(conf) > 1;
                return (
                  <td key={h.hospitalId} className={`px-6 py-4 ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'} ${isBest ? 'text-[var(--cr-success)] bg-[var(--cr-success)]/5' : ''}`}>
                    {conf}
                    {isBest && <span className="block text-[9px] font-normal text-[var(--cr-muted)] mt-0.5 italic">Better confidence</span>}
                  </td>
                );
              })}
            </tr>
            <tr className="bg-[var(--cr-background)]">
              <td className="px-6 py-4 border-r border-[var(--cr-border)]"></td>
              {allHospitals.map((h, i) => (
                <td key={h.hospitalId} className={`px-6 py-4 align-top ${i === 0 ? 'border-r border-[var(--cr-primary)]/20 bg-[var(--cr-primary)]/5' : 'border-r border-[var(--cr-border)]'}`}>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => onWhyThisOption(h)} className="w-full text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)] border border-[var(--cr-primary)]/30 hover:bg-[var(--cr-primary)]/10 px-4 py-2 rounded transition-colors whitespace-nowrap bg-white text-center">
                      Why this option?
                    </button>
                    {onStartJourney && (
                      <button onClick={() => onStartJourney(h)} className="w-full text-[10px] font-bold uppercase tracking-widest text-white border border-[var(--cr-primary)] bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 px-4 py-2 rounded transition-colors whitespace-nowrap text-center shadow-sm">
                        Start Route
                      </button>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* MOBILE SCROLLABLE CARDS */}
      <div className="md:hidden flex overflow-x-auto gap-4 p-4 snap-x custom-scrollbar pb-6">
        {allHospitals.map((h, i) => {
          const tt = h.totalTimeToCare?.totalEstimatedMinutes || (h.etaMinutes + 8);
          const cap = getCapacity(h).expected;
          const conf = h.totalTimeToCare?.confidence || 'MEDIUM';
          const isBestEta = h.etaMinutes === minEta;
          const isBestTotal = tt === minTotalTime;
          const isBestCap = typeof cap === 'number' && cap === maxExpectedCapacity && cap > 0;
          const isBestConf = confScore(conf) === maxConfScore && confScore(conf) > 1;

          return (
            <div key={h.hospitalId} className={`min-w-[280px] snap-center bg-white border ${i === 0 ? 'border-[var(--cr-primary)] border-2' : 'border-[var(--cr-border)]'} rounded-xl shadow-sm p-5 flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <h4 className={`font-semibold uppercase tracking-wide ${i === 0 ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-deep-text)]'}`}>{h.hospital.name}</h4>
                {i === 0 && <span className="text-[8px] font-bold uppercase tracking-widest bg-[var(--cr-primary)] text-white px-2 py-1 rounded">Recommended</span>}
              </div>
              
              <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between items-center border-b border-[var(--cr-border)]/50 pb-1">
                  <span className="text-[var(--cr-muted)]">Match Score</span>
                  <span className="font-medium text-[var(--cr-deep-text)]">{h.matchScore}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--cr-border)]/50 pb-1">
                  <span className="text-[var(--cr-muted)]">ETA</span>
                  <div className="text-right">
                    <span className={`font-medium ${isBestEta ? 'text-[var(--cr-success)]' : 'text-[var(--cr-deep-text)]'}`}>{h.etaMinutes} min</span>
                    {isBestEta && <span className="block text-[8px] text-[var(--cr-success)] italic">Better ETA</span>}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--cr-border)]/50 pb-1">
                  <span className="text-[var(--cr-muted)]">{resourceName} at Arrival</span>
                  <div className="text-right">
                    <span className={`font-medium ${isBestCap ? 'text-[var(--cr-success)]' : 'text-[var(--cr-deep-text)]'}`}>{cap}</span>
                    {isBestCap && <span className="block text-[8px] text-[var(--cr-success)] italic">Better capacity</span>}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--cr-border)]/50 pb-1">
                  <span className="text-[var(--cr-muted)] font-bold">Total Time</span>
                  <div className="text-right">
                    <span className={`font-bold ${isBestTotal ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-deep-text)]'}`}>{tt} min</span>
                    {isBestTotal && <span className="block text-[8px] text-[var(--cr-primary)] italic">Faster path</span>}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-[var(--cr-border)]/50 pb-1">
                  <span className="text-[var(--cr-muted)]">Confidence</span>
                  <div className="text-right">
                    <span className={`font-medium ${isBestConf ? 'text-[var(--cr-success)]' : 'text-[var(--cr-deep-text)]'}`}>{conf}</span>
                    {isBestConf && <span className="block text-[8px] text-[var(--cr-success)] italic">Better confidence</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <button onClick={() => onWhyThisOption(h)} className="w-full text-xs font-bold uppercase tracking-widest text-[var(--cr-primary)] border border-[var(--cr-primary)]/30 hover:bg-[var(--cr-primary)]/10 px-4 py-3 rounded transition-colors text-center">
                  Why this option?
                </button>
                {onStartJourney && (
                  <button onClick={() => onStartJourney(h)} className="w-full text-xs font-bold uppercase tracking-widest text-white bg-[var(--cr-primary)] hover:bg-[var(--cr-primary)]/90 px-4 py-3 rounded transition-colors text-center">
                    Start Route
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
