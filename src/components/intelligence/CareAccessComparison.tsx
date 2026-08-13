import React from 'react';
import { Recommendation } from '../../types/recommendation';
import { HospitalProfile } from '../../types/hospital';
import { motion, AnimatePresence } from 'framer-motion';

interface CareAccessComparisonProps {
  nearest: { hospital: HospitalProfile; distanceKm: number; etaMinutes: number };
  bestMatch: Recommendation;
}

export default function CareAccessComparison({ nearest, bestMatch }: CareAccessComparisonProps) {
  if (nearest.hospital.id === bestMatch.hospitalId) return null;

  // In a real implementation this would come from the engine for the nearest hospital too.
  // For the demo, we simulate a congested nearest hospital if it wasn't recommended.
  const nearestIntake = 22;
  const nearestTotal = nearest.etaMinutes + nearestIntake;

  const bestTotal = bestMatch.totalTimeToCare?.totalEstimatedMinutes || (bestMatch.etaMinutes + 8);
  const bestIntake = bestMatch.totalTimeToCare?.estimatedIntakeMinutes || 8;

  return (
    <div className="bg-white rounded-2xl border border-[var(--cr-border)] shadow-sm overflow-hidden mb-12">
      
      {/* PRIMARY DISPLAY */}
      <div className="p-8 md:p-12 border-b border-[var(--cr-border)] text-center flex flex-col items-center">
        <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--cr-muted)] mb-4">
          Estimated Total Time to Care
        </h3>
        <AnimatePresence mode="wait">
          <motion.div 
            key={bestTotal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-light text-[var(--cr-deep-text)] mb-10 tracking-tight"
          >
            {bestTotal} MIN
          </motion.div>
        </AnimatePresence>

        {/* Stacked Calculation */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 w-full max-w-lg">
          <div className="flex flex-col items-center flex-1 bg-[var(--cr-background)] py-4 rounded-xl w-full border border-[var(--cr-border)]/50">
            <span className="text-xl md:text-2xl font-light text-[var(--cr-deep-text)]">{bestMatch.etaMinutes} min</span>
            <span className="text-[10px] uppercase text-[var(--cr-muted)] font-bold tracking-widest mt-1">Travel</span>
          </div>
          <div className="text-[var(--cr-muted)] font-light text-2xl hidden md:block">+</div>
          <div className="text-[var(--cr-muted)] font-light text-2xl md:hidden">+</div>
          <div className="flex flex-col items-center flex-1 bg-[var(--cr-background)] py-4 rounded-xl w-full border border-[var(--cr-border)]/50">
            <span className="text-xl md:text-2xl font-light text-[var(--cr-deep-text)]">{bestIntake} min</span>
            <span className="text-[10px] uppercase text-[var(--cr-muted)] font-bold tracking-widest mt-1">Expected intake</span>
          </div>
          <div className="text-[var(--cr-muted)] font-light text-2xl hidden md:block">=</div>
          <div className="text-[var(--cr-muted)] font-light text-2xl md:hidden">=</div>
          <div className="flex flex-col items-center flex-1 bg-[var(--cr-primary)]/5 py-4 rounded-xl w-full border border-[var(--cr-primary)]/20">
            <span className="text-xl md:text-2xl font-medium text-[var(--cr-primary)]">{bestTotal} min</span>
            <span className="text-[10px] uppercase text-[var(--cr-primary)] font-bold tracking-widest mt-1">Total Estimated</span>
          </div>
        </div>
      </div>

      {/* COMPARISON */}
      <div className="p-8 md:p-12 bg-[var(--cr-background)] flex flex-col items-center">
        <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--cr-muted)] mb-8 text-center">
          Comparison
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-10">
          
          {/* Best Match Stacked Card */}
          <div className="bg-white p-6 rounded-xl border border-[var(--cr-primary)]/30 shadow-sm relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--cr-primary)]" />
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-semibold text-[var(--cr-primary)] uppercase tracking-wide">{bestMatch.hospital.name}</h4>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] px-2 py-1 rounded">Recommended</span>
            </div>
            <div className="space-y-3 text-sm text-[var(--cr-deep-text)] flex-grow">
              <div className="flex justify-between items-center"><span className="text-[var(--cr-muted)]">Travel</span><span className="font-medium">{bestMatch.etaMinutes} min</span></div>
              <div className="flex justify-between items-center"><span className="text-[var(--cr-muted)]">Expected intake</span><span className="font-medium">{bestIntake} min</span></div>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-[var(--cr-border)] font-bold">
              <span className="text-[10px] uppercase tracking-widest text-[var(--cr-primary)]">Total Estimated</span>
              <span className="text-lg text-[var(--cr-primary)]">{bestTotal} min</span>
            </div>
          </div>

          {/* Nearest Stacked Card */}
          <div className="bg-white p-6 rounded-xl border border-[var(--cr-border)] shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-semibold text-[var(--cr-deep-text)] uppercase tracking-wide">{nearest.hospital.name}</h4>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-100 text-[var(--cr-muted)] px-2 py-1 rounded">Nearest</span>
            </div>
            <div className="space-y-3 text-sm text-[var(--cr-deep-text)] flex-grow">
              <div className="flex justify-between items-center"><span className="text-[var(--cr-muted)]">Travel</span><span className="font-medium">{nearest.etaMinutes} min</span></div>
              <div className="flex justify-between items-center"><span className="text-[var(--cr-muted)]">Expected intake</span><span className="font-medium">{nearestIntake} min</span></div>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-[var(--cr-border)] font-bold">
              <span className="text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Total Estimated</span>
              <span className="text-lg text-[var(--cr-deep-text)]">{nearestTotal} min</span>
            </div>
          </div>
          
        </div>

        <p className="text-center text-[var(--cr-deep-text)] text-sm font-medium italic mb-6">
          "Nearest does not always mean fastest path to suitable care."
        </p>
        
        <p className="text-center text-[9px] uppercase tracking-widest text-[var(--cr-muted)]">
          * Prototype operational estimate. Actual times may vary.
        </p>
      </div>
      
    </div>
  );
}
