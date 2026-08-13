"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareRequirement } from '../../types/care';
import { getCurrentLocation } from '../../lib/location/geolocation';
import { useRouter } from 'next/navigation';
import { 
  CareTypeStep, 
  UrgencyStep, 
  ResourceStep, 
  SpecialistStep, 
  LocationStep, 
  AccessibilityStep,
  ReviewStep 
} from './WizardSteps';

export default function CareRequirementWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [reqs, setReqs] = useState<CareRequirement>({
    careType: 'UNKNOWN',
    urgency: 'UNKNOWN',
    resources: [],
    specialists: 'UNKNOWN',
    location: null,
    radiusKm: 20,
    accessibilityNeeds: []
  });

  // Get location in background
  useEffect(() => {
    getCurrentLocation().then(loc => setReqs(prev => ({ ...prev, location: loc }))).catch(() => {});
  }, []);

  const handleNext = (updates: Partial<CareRequirement>) => {
    setReqs(prev => ({ ...prev, ...updates }));
    if (step < 7) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 1 && stepIndex <= 7) {
      setStep(stepIndex);
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    
    // Ensure location is set — try again if it was missed earlier
    let finalReqs = { ...reqs };
    if (!finalReqs.location) {
      try {
        const loc = await getCurrentLocation();
        finalReqs.location = loc;
      } catch (e) {
        // Use a default location (Tirupati area) so the engine can still run
        finalReqs.location = { lat: 13.6288, lng: 79.4192 };
      }
    }

    // Ensure radiusKm is generous enough to find hospitals
    if (!finalReqs.radiusKm || finalReqs.radiusKm < 20) {
      finalReqs.radiusKm = 100;
    }
    
    // Save in the correct CareRequirement format
    localStorage.setItem('careRequirements', JSON.stringify(finalReqs));
    
    setTimeout(() => {
      router.push('/find-care/results');
    }, 2500);
  };

  // Variants for animation
  const variants: any = {
    initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' } }
  };

  if (isAnalyzing) {
    return (
      <div className="w-full max-w-md mx-auto">
        <AnalysisSequence />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-[var(--cr-border)] rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col relative">
      
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--cr-background)]">
        <motion.div 
          className="h-full bg-[var(--cr-primary)]"
          initial={{ width: `${((step - 1) / 7) * 100}%` }}
          animate={{ width: `${(step / 7) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-grow p-8 sm:p-12 relative overflow-hidden flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <CareTypeStep value={reqs.careType} onNext={(val) => handleNext({ careType: val })} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <UrgencyStep value={reqs.urgency} onNext={(val) => handleNext({ urgency: val })} onBack={handleBack} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <ResourceStep value={reqs.resources} onNext={(val) => handleNext({ resources: val })} onBack={handleBack} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <SpecialistStep value={reqs.specialists} onNext={(val) => handleNext({ specialists: val })} onBack={handleBack} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="step5" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <LocationStep value={reqs.radiusKm} onNext={(val) => handleNext({ radiusKm: val })} onBack={handleBack} />
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="step6" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <AccessibilityStep value={reqs.accessibilityNeeds} onNext={(val) => handleNext({ accessibilityNeeds: val })} onBack={handleBack} />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step7" variants={variants} initial="initial" animate="animate" exit="exit" className="w-full">
              <ReviewStep reqs={reqs} onSubmit={handleSubmit} onBack={handleBack} onEdit={goToStep} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Analysis Sequence Component
// --------------------------------------------------------

function AnalysisSequence() {
  const steps = [
    "UNDERSTANDING REQUIREMENTS",
    "CHECKING NEARBY HOSPITALS",
    "CHECKING SPECIALIST AVAILABILITY",
    "CHECKING CURRENT CAPACITY",
    "ESTIMATING ARRIVAL TIME",
    "CHECKING EXPECTED CAPACITY",
    "RANKING SUITABLE OPTIONS"
  ];
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Progress through steps quickly (total ~2.5 seconds)
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 350); // 350ms * 7 = 2.45s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-full space-y-4">
        {steps.map((text, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          
          return (
            <motion.div 
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isPast ? 0.4 : isActive ? 1 : 0,
                y: isPast || isActive ? 0 : 10
              }}
              className="flex items-center gap-4 text-sm tracking-widest font-medium"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {isPast ? (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[var(--cr-success)]">✓</motion.span>
                ) : isActive ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-3 h-3 border-2 border-[var(--cr-primary)] border-t-transparent rounded-full"
                  />
                ) : null}
              </div>
              <span className={isActive ? "text-[var(--cr-primary)]" : "text-[var(--cr-muted)]"}>
                {text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
