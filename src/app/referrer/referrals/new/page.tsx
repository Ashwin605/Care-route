"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_HOSPITALS } from '../../../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../../../data/mockSpecialists';
import { analyzeHealthcareNetwork } from '../../../../lib/intelligence/networkAnalyzer';
import { CareRequirement } from '../../../../types/care';
import { RecommendationResult } from '../../../../types/recommendation';
import { v4 as uuidv4 } from 'uuid';
import { ChevronRight, ChevronLeft, CheckCircle2, User, Activity, MapPin, Search, FileText } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

export default function NewReferralWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 State
  const [patientRef, setPatientRef] = useState('');
  const [notes, setNotes] = useState('');
  const [zipCode, setZipCode] = useState('90210');

  // Validation State
  const [validationError, setValidationError] = useState<string | null>(null);

  // Step 2 State
  const [specialists, setSpecialists] = useState<string[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(50);

  // Step 3 State
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<RecommendationResult | null>(null);

  const availableSpecialists = ['CARDIOLOGIST', 'NEUROLOGIST', 'ONCOLOGIST', 'TRAUMA_SURGEON', 'BURN_SPECIALIST'];
  const availableResources = ['ICU_BED', 'VENTILATOR', 'NICU_BED', 'BURN_BED', 'ECMO', 'MRI', 'CT_SCANNER'];

  const toggleSpecialist = (s: string) => {
    setValidationError(null); // Clear error when user makes a selection
    setSpecialists(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]);
  };

  const toggleResource = (r: string) => {
    setResources(prev => prev.includes(r) ? prev.filter(i => i !== r) : [...prev, r]);
  };

  const handleRunIntelligence = () => {
    if (specialists.length === 0) {
      setValidationError("Please select at least one required specialist.");
      const element = document.getElementById('specialists-section');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const reqs: CareRequirement = { careType: 'SPECIALIST', urgency: 'URGENT', specialists, resources, maxDistance, radiusKm: maxDistance, location: null, accessibilityNeeds: [] };
    // Origin is hardcoded for demo, but normally geocoded from ZipCode
    const origin = { lat: 34.0522, lng: -118.2437 }; 
    const result = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, reqs, origin);
    
    // Sort by Match Score and separate Eligible vs Ineligible
    const sorted = [...result.recommendations].sort((a, b) => b.matchScore - a.matchScore);
    const eligible = sorted.filter(r => r.eligibility.status === 'ELIGIBLE');
    
    setRecommendations(eligible);
    if (eligible.length > 0) {
      setSelectedHospital(eligible[0]);
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    if (specialists.length === 0 || !patientRef) {
      setValidationError("Missing required fields. Please ensure patient reference and specialists are provided.");
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would POST this to the backend.
    // For now, we mock the delay and redirect.
    setTimeout(() => {
      // Mocked Creation logic handled globally or just assumed success for demo
      router.push('/referrer');
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step === i ? 'bg-[var(--cr-primary)] text-white shadow-md' :
              step > i ? 'bg-[var(--cr-success)] text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            <span className={`text-xs mt-2 font-bold uppercase tracking-widest ${
              step === i ? 'text-[var(--cr-primary)]' :
              step > i ? 'text-[var(--cr-success)]' :
              'text-gray-400'
            }`}>
              {i === 1 ? 'Patient' : i === 2 ? 'Clinical' : i === 3 ? 'Hospital' : 'Review'}
            </span>
          </div>
          {i < 4 && (
            <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
              step > i ? 'bg-[var(--cr-success)]' : 'bg-gray-100'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--cr-deep-text)] tracking-tight">Create Referral</h1>
        <p className="text-[var(--cr-muted)] mt-1">Connect your patient with the CARE ROUTE network.</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
        
        {/* STEP 1: PATIENT */}
        {step === 1 && (
          <div className="p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--cr-deep-text)] mb-6 flex items-center gap-2">
              <User className="text-[var(--cr-primary)]" /> Patient Information
            </h2>
            <div className="space-y-6 max-w-xl">
              <div>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-2">Patient Reference ID *</label>
                <input 
                  type="text" 
                  value={patientRef}
                  onChange={(e) => setPatientRef(e.target.value.toUpperCase())}
                  placeholder="e.g. PT-8429"
                  className="w-full border border-[var(--cr-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/50 focus:border-[var(--cr-primary)] transition-all font-medium uppercase"
                />
                <p className="text-xs text-[var(--cr-muted)] mt-2">Use an internal EHR reference ID to protect patient PII.</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-2">Patient ZIP Code (For Routing)</label>
                <input 
                  type="text" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g. 90210"
                  className="w-full border border-[var(--cr-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/50 focus:border-[var(--cr-primary)] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-2">Clinical Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Brief context for the receiving hospital..."
                  rows={4}
                  className="w-full border border-[var(--cr-border)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--cr-primary)]/50 focus:border-[var(--cr-primary)] transition-all resize-none font-medium"
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--cr-border)] flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!patientRef}
                className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[var(--cr-primary)]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CLINICAL REQUIREMENTS */}
        {step === 2 && (
          <div className="p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-[var(--cr-deep-text)] mb-6 flex items-center gap-2">
              <Activity className="text-[var(--cr-primary)]" /> Care Requirements
            </h2>
            
            <div className="space-y-8">
              {/* Specialists */}
              <div id="specialists-section" className={`p-4 rounded-xl border transition-colors ${validationError ? 'border-[var(--cr-danger)] bg-[var(--cr-danger)]/5' : 'border-transparent'}`}>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-3 uppercase tracking-widest text-xs flex items-center justify-between">
                  <span>Required Specialists *</span>
                  {validationError && (
                    <span className="text-[var(--cr-danger)] flex items-center gap-1 normal-case text-sm">
                      <AlertTriangle size={14} /> {validationError}
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSpecialists.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSpecialist(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                        specialists.includes(s) 
                          ? 'bg-[var(--cr-primary)] border-[var(--cr-primary)] text-white shadow-sm' 
                          : 'bg-white border-[var(--cr-border)] text-[var(--cr-muted)] hover:border-[var(--cr-primary)]/50'
                      }`}
                    >
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-3 uppercase tracking-widest text-xs">Required Resources</label>
                <div className="flex flex-wrap gap-2">
                  {availableResources.map(r => (
                    <button
                      key={r}
                      onClick={() => toggleResource(r)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                        resources.includes(r) 
                          ? 'bg-[var(--cr-primary)] border-[var(--cr-primary)] text-white shadow-sm' 
                          : 'bg-white border-[var(--cr-border)] text-[var(--cr-muted)] hover:border-[var(--cr-primary)]/50'
                      }`}
                    >
                      {r.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Distance Slider */}
              <div className="max-w-xl">
                <label className="flex items-center justify-between text-sm font-bold text-[var(--cr-deep-text)] mb-4">
                  <span className="uppercase tracking-widest text-xs">Maximum Distance Search Range</span>
                  <span className="text-[var(--cr-primary)]">{maxDistance} km</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="150" 
                  step="5"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-[var(--cr-primary)]"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--cr-border)] flex items-center justify-between">
              <button 
                onClick={() => setStep(1)}
                className="text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] font-bold px-4 py-2 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button 
                onClick={handleRunIntelligence}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Search size={18} /> Find Suitable Hospitals
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: HOSPITAL SELECTION */}
        {step === 3 && (
          <div className="p-8 animate-fade-in bg-gray-50/50">
            <h2 className="text-xl font-bold text-[var(--cr-deep-text)] mb-6 flex items-center gap-2">
              <MapPin className="text-[var(--cr-primary)]" /> Intelligent Referral Routing
            </h2>

            {recommendations.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-[var(--cr-critical)]/20 shadow-sm text-center">
                <div className="w-16 h-16 bg-[var(--cr-critical)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[var(--cr-critical)] font-bold text-2xl">!</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--cr-deep-text)]">No Suitable Hospitals Found</h3>
                <p className="text-[var(--cr-muted)] mt-2 max-w-md mx-auto">
                  CARE ROUTE could not find any hospitals within {maxDistance}km that meet the strict clinical requirements requested.
                </p>
                <button 
                  onClick={() => setStep(2)}
                  className="mt-6 text-[var(--cr-primary)] font-bold hover:underline"
                >
                  Adjust Requirements
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* RECOMMENDED DESTINATION (TOP MATCH) */}
                <div>
                  <h3 className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-3">Recommended Destination</h3>
                  <div 
                    onClick={() => setSelectedHospital(recommendations[0])}
                    className={`bg-white p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                      selectedHospital?.hospital.id === recommendations[0].hospital.id 
                        ? 'border-[var(--cr-primary)] shadow-md ring-4 ring-[var(--cr-primary)]/10' 
                        : 'border-[var(--cr-border)] hover:border-[var(--cr-primary)]/50 shadow-sm'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[var(--cr-primary)]/10 to-transparent w-64 h-full pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-[var(--cr-deep-text)]">{recommendations[0].hospital.name}</h3>
                          <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[var(--cr-success)]/20 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Top Match
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6">
                          <span className="flex items-center gap-1 text-[var(--cr-deep-text)] bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Activity size={16} className="text-[var(--cr-primary)]" /> {recommendations[0].etaMinutes} min ETA
                          </span>
                          <span className="flex items-center gap-1 text-[var(--cr-muted)]">
                            <MapPin size={16} /> {recommendations[0].distanceKm} km
                          </span>
                          <span className="flex items-center gap-1 text-[var(--cr-success)] bg-[var(--cr-success)]/10 px-3 py-1.5 rounded-lg">
                            Confidence: {recommendations[0].confidence}
                          </span>
                        </div>

                        {/* Why This Hospital? */}
                        <div className="bg-gray-50 border border-[var(--cr-border)] rounded-xl p-5">
                          <p className="text-xs font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-3">Why This Hospital?</p>
                          <ul className="space-y-2">
                            {recommendations[0].explanations.map((exp, i) => (
                              <li key={i} className="text-sm text-[var(--cr-deep-text)] flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-[var(--cr-success)] shrink-0 mt-0.5" /> {exp}
                              </li>
                            ))}
                            {resources.map(r => (
                              <li key={r} className="text-sm text-[var(--cr-deep-text)] flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-[var(--cr-success)] shrink-0 mt-0.5" /> {r.replace(/_/g, ' ')}: Available
                              </li>
                            ))}
                            {specialists.map(s => (
                              <li key={s} className="text-sm text-[var(--cr-deep-text)] flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-[var(--cr-success)] shrink-0 mt-0.5" /> {s.replace(/_/g, ' ')}: Available
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="text-center md:text-right bg-white p-4 rounded-xl border border-[var(--cr-border)] shadow-sm shrink-0">
                        <div className="text-5xl font-black text-[var(--cr-primary)]">{recommendations[0].matchScore}</div>
                        <p className="text-xs uppercase tracking-widest font-bold text-[var(--cr-muted)] mt-2">Match Score</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ALTERNATIVES */}
                {recommendations.length > 1 && (
                  <div>
                    <h3 className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-3 mt-8">Suitable Alternatives</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.slice(1).map((rec) => (
                        <div 
                          key={rec.hospital.id}
                          onClick={() => setSelectedHospital(rec)}
                          className={`bg-white p-5 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedHospital?.hospital.id === rec.hospital.id 
                              ? 'border-[var(--cr-primary)] shadow-md bg-[var(--cr-primary)]/5' 
                              : 'border-[var(--cr-border)] hover:border-gray-300 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-[var(--cr-deep-text)]">{rec.hospital.name}</h3>
                              <p className="text-xs text-[var(--cr-muted)] flex items-center gap-1 mt-0.5">
                                ETA: <span className="font-bold text-[var(--cr-deep-text)]">{rec.etaMinutes}m</span> • {rec.distanceKm}km
                              </p>
                            </div>
                            <div className="text-xl font-black text-[var(--cr-deep-text)]">{rec.matchScore}</div>
                          </div>
                          <div className="text-xs font-medium text-[var(--cr-muted)] flex items-center gap-2 mb-3">
                            <span className="bg-gray-100 px-2 py-1 rounded">Confidence: {rec.confidence}</span>
                          </div>
                          <ul className="space-y-1">
                            {rec.explanations.slice(0, 2).map((exp, i) => (
                              <li key={i} className="text-xs text-[var(--cr-muted)] flex items-start gap-1 line-clamp-1">
                                <span className="text-[var(--cr-success)]">•</span> {exp}
                              </li>
                            ))}
                            {rec.explanations.length > 2 && (
                              <li className="text-[10px] text-[var(--cr-muted)] font-bold italic pl-2">+ {rec.explanations.length - 2} more reasons</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--cr-border)] flex items-center justify-between">
              <button 
                onClick={() => setStep(2)}
                className="text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] font-bold px-4 py-2 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={18} /> Edit Requirements
              </button>
              <button 
                onClick={() => setStep(4)}
                disabled={!selectedHospital}
                className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[var(--cr-primary)]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review & Confirm <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && selectedHospital && (
          <div className="p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[var(--cr-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--cr-primary)]">
                <FileText size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Review Referral</h2>
              <p className="text-[var(--cr-muted)] mt-1">Please confirm the details below before submitting to the network.</p>
            </div>
            
            <div className="bg-gray-50 border border-[var(--cr-border)] rounded-xl p-6 space-y-6 max-w-2xl mx-auto">
              
              <div className="flex justify-between items-start pb-4 border-b border-[var(--cr-border)]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Patient</p>
                  <p className="font-bold text-[var(--cr-deep-text)] text-lg">{patientRef}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Referrer</p>
                  <p className="font-bold text-[var(--cr-deep-text)]">{user?.name}</p>
                </div>
              </div>

              <div className="pb-4 border-b border-[var(--cr-border)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Destination Hospital</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-[var(--cr-border)] rounded-lg flex items-center justify-center shadow-sm">
                    <Building2 size={20} className="text-[var(--cr-primary)]" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--cr-deep-text)] text-lg">{selectedHospital.hospital.name}</p>
                    <p className="text-sm text-[var(--cr-muted)] font-medium">ETA: {selectedHospital.etaMinutes} mins • {selectedHospital.distanceKm} km</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-2">Clinical Context</p>
                <div className="bg-white p-4 rounded-lg border border-[var(--cr-border)] shadow-sm">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {specialists.map(s => <span key={s} className="bg-gray-100 text-[var(--cr-deep-text)] text-xs font-bold px-2 py-1 rounded">{s.replace(/_/g, ' ')}</span>)}
                    {resources.map(r => <span key={r} className="bg-gray-100 text-[var(--cr-deep-text)] text-xs font-bold px-2 py-1 rounded">{r.replace(/_/g, ' ')}</span>)}
                    {specialists.length === 0 && resources.length === 0 && <span className="text-sm text-gray-500">General admission</span>}
                  </div>
                  {notes && (
                    <div className="mt-3 pt-3 border-t border-[var(--cr-border)]">
                      <p className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">Notes</p>
                      <p className="text-sm text-[var(--cr-deep-text)] italic">"{notes}"</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-[var(--cr-border)] flex items-center justify-between max-w-2xl mx-auto">
              <button 
                onClick={() => setStep(3)}
                disabled={isSubmitting}
                className="text-[var(--cr-muted)] hover:text-[var(--cr-deep-text)] font-bold px-4 py-2 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[var(--cr-primary)]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait min-w-[200px]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Submit Referral <CheckCircle2 size={18} /></>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
