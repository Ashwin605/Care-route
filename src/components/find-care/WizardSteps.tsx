import React, { useState } from 'react';
import { CareType, UrgencyLevel, CareRequirement } from '../../types/care';
import { ArrowLeft, Activity, Stethoscope, HeartPulse, Search, Scissors, RotateCcw, HelpCircle } from 'lucide-react';

// --- Reusable Option Button ---
const OptionBtn = ({ 
  label, 
  selected, 
  onClick, 
  subtext,
  icon: Icon
}: { 
  label: string, 
  selected: boolean, 
  onClick: () => void,
  subtext?: string,
  icon?: any
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
      selected 
        ? 'border-[var(--cr-primary)] bg-[var(--cr-primary)]/5 text-[var(--cr-primary)]' 
        : 'border-[var(--cr-border)] hover:border-[var(--cr-sage)] text-[var(--cr-deep-text)]'
    }`}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} className={selected ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-muted)]'} />}
      <span className="font-semibold">{label}</span>
    </div>
    {subtext && <span className={`text-sm ${selected ? 'text-[var(--cr-primary)]/80' : 'text-[var(--cr-muted)]'}`}>{subtext}</span>}
  </button>
);

// --------------------------------------------------
// STEP 1: CARE TYPE
// --------------------------------------------------
export function CareTypeStep({ value, onNext }: { value: CareType | null, onNext: (v: CareType) => void }) {
  const options: { value: CareType, label: string, desc: string, icon: any }[] = [
    { value: 'EMERGENCY', label: 'Emergency Care', desc: 'Find hospitals with appropriate emergency capabilities.', icon: Activity },
    { value: 'SPECIALIST', label: 'Specialist Consultation', desc: 'Find hospitals with the specialist you need.', icon: Stethoscope },
    { value: 'GENERAL', label: 'General Medical Care', desc: 'Standard medical attention and checkups.', icon: HeartPulse },
    { value: 'DIAGNOSTIC', label: 'Diagnostic Care', desc: 'Tests, imaging, and lab work.', icon: Search },
    { value: 'SURGERY', label: 'Surgery', desc: 'Surgical procedures and operations.', icon: Scissors },
    { value: 'FOLLOW_UP', label: 'Follow-up Care', desc: 'Post-treatment and ongoing care.', icon: RotateCcw },
    { value: 'UNKNOWN', label: 'I\'m not sure', desc: 'I don\'t know exactly what kind of care I need.', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] mb-2 tracking-wide">
          What kind of care are you looking for?
        </h2>
        <p className="text-[var(--cr-muted)]">Choose the option that best describes what you need.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {options.map(opt => (
          <OptionBtn 
            key={opt.value} 
            label={opt.label} 
            subtext={opt.desc}
            icon={opt.icon}
            selected={value === opt.value} 
            onClick={() => onNext(opt.value)} 
          />
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------
// STEP 2: URGENCY
// --------------------------------------------------
export function UrgencyStep({ value, onNext, onBack }: { value: UrgencyLevel | null, onNext: (v: UrgencyLevel) => void, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-4 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors rounded-full hover:bg-[var(--cr-border)]">
        <ArrowLeft size={20} />
      </button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] mb-2 tracking-wide">
          How urgent is your need?
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <OptionBtn 
          label="ROUTINE" 
          subtext="Care that can be planned."
          selected={value === 'ROUTINE'} 
          onClick={() => onNext('ROUTINE')} 
        />
        <OptionBtn 
          label="URGENT" 
          subtext="Care needed soon."
          selected={value === 'URGENT'} 
          onClick={() => onNext('URGENT')} 
        />
        <OptionBtn 
          label="CRITICAL" 
          subtext="Immediate hospital-level attention may be required."
          selected={value === 'CRITICAL'} 
          onClick={() => onNext('CRITICAL')} 
        />
        <OptionBtn 
          label="I'M NOT SURE" 
          subtext="I'm not sure how urgent this is."
          selected={value === 'UNKNOWN'} 
          onClick={() => onNext('UNKNOWN')} 
        />
      </div>

      {value === 'CRITICAL' && (
        <div className="mt-8 p-4 bg-[var(--cr-sage)]/10 text-[var(--cr-deep-text)] border border-[var(--cr-border)] rounded-lg text-sm font-medium">
          <p className="font-semibold mb-1">You selected critical care.</p>
          <p className="text-[var(--cr-muted)] mb-2">CARE ROUTE will prioritize hospitals with appropriate emergency capabilities.</p>
          <p className="text-[var(--cr-primary)]">If this is a medical emergency, seek immediate emergency assistance.</p>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// STEP 3: RESOURCES (OPTIONAL)
// --------------------------------------------------
export function ResourceStep({ value, onNext, onBack }: { value: string[], onNext: (v: string[]) => void, onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>(value);
  const options = [
    { id: 'ICU', label: 'ICU', desc: 'Specialized hospital care for patients who need continuous monitoring and intensive support.' },
    { id: 'VENTILATOR', label: 'Ventilator', desc: 'Respiratory support equipment.' },
    { id: 'EMERGENCY_DEPT', label: 'Emergency Department', desc: 'Immediate emergency medical care.' },
    { id: 'OPERATION_THEATRE', label: 'Operation Theatre', desc: 'Facility for surgical operations.' },
    { id: 'BLOOD_BANK', label: 'Blood Bank', desc: 'Access to blood and blood products.' },
    { id: 'IMAGING', label: 'Imaging', desc: 'X-ray, MRI, CT scanning facilities.' },
    { id: 'CATH_LAB', label: 'Cardiac Cath Lab', desc: 'Specialized imaging for heart conditions.' },
    { id: 'DIALYSIS', label: 'Dialysis', desc: 'Kidney support and blood filtration.' },
    { id: 'ISOLATION', label: 'Isolation Facility', desc: 'Specialized rooms for infection control.' }
  ];

  const toggle = (opt: string) => {
    if (selected.includes(opt)) setSelected(selected.filter(x => x !== opt));
    else setSelected([...selected, opt]);
  };

  return (
    <div className="flex flex-col h-full">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-4 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors rounded-full hover:bg-[var(--cr-border)]">
        <ArrowLeft size={20} />
      </button>
      
      <div className="mb-6">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] mb-2 tracking-wide">
          Does the care you need require specific hospital resources?
        </h2>
        <p className="text-[var(--cr-muted)]">You can skip this if you're not sure.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8 overflow-y-auto max-h-[45vh] pr-2 custom-scrollbar">
        {options.map(opt => (
          <OptionBtn 
            key={opt.id}
            label={opt.label}
            subtext={opt.desc}
            selected={selected.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button 
          onClick={() => onNext(selected)}
          className="w-full py-4 bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white font-medium rounded-xl transition-colors"
        >
          {selected.length > 0 ? 'Continue' : 'Skip'}
        </button>
        <button 
          onClick={() => onNext(['UNKNOWN'])}
          className="w-full py-3 text-[var(--cr-muted)] font-medium hover:text-[var(--cr-primary)] transition-colors"
        >
          I'm not sure
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------
// STEP 4: SPECIALIST (OPTIONAL)
// --------------------------------------------------
export function SpecialistStep({ value, onNext, onBack }: { value: string | null, onNext: (v: string | null) => void, onBack: () => void }) {
  const options = [
    { id: 'CARDIOLOGIST', label: 'Cardiologist' },
    { id: 'NEUROLOGIST', label: 'Neurologist' },
    { id: 'ORTHOPEDIC', label: 'Orthopedic Specialist' },
    { id: 'ONCOLOGIST', label: 'Oncologist' },
    { id: 'PEDIATRICIAN', label: 'Pediatrician' },
    { id: 'EMERGENCY_MED', label: 'Emergency Medicine' },
    { id: 'OTHER', label: 'Other' },
    { id: 'NONE', label: 'No specific specialist' },
    { id: 'UNKNOWN', label: 'I\'m not sure' }
  ];

  return (
    <div className="flex flex-col h-full">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-4 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors rounded-full hover:bg-[var(--cr-border)]">
        <ArrowLeft size={20} />
      </button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] mb-2 tracking-wide">
          Do you need a specific specialist?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {options.map(opt => (
          <OptionBtn 
            key={opt.id} 
            label={opt.label} 
            selected={value === opt.id} 
            onClick={() => onNext(opt.id)} 
          />
        ))}
      </div>
      
      <div className="p-4 bg-[var(--cr-muted)]/10 border border-[var(--cr-border)] rounded-xl mt-auto">
        <p className="text-sm font-medium text-[var(--cr-deep-text)]">
          CARE ROUTE helps you navigate healthcare options. It does not diagnose medical conditions.
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// STEP 5: LOCATION / RADIUS
// --------------------------------------------------
export function LocationStep({ value, onNext, onBack }: { value: number, onNext: (v: number) => void, onBack: () => void }) {
  const radiuses = [5, 10, 15, 25];

  return (
    <div className="flex flex-col h-full">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-4 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors rounded-full hover:bg-[var(--cr-border)]">
        <ArrowLeft size={20} />
      </button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] mb-2 tracking-wide">
          Search Area
        </h2>
      </div>

      <div className="p-4 bg-[var(--cr-background)] rounded-xl border border-[var(--cr-border)] mb-8 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] block mb-1">CARE LOCATION</span>
          <span className="text-sm font-medium text-[var(--cr-deep-text)]">Using your current location</span>
        </div>
        <button className="text-sm font-medium text-[var(--cr-primary)] hover:underline">Change location</button>
      </div>

      <h3 className="text-sm font-semibold text-[var(--cr-deep-text)] mb-4">Search Radius</h3>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {radiuses.map(r => (
          <button
            key={r}
            onClick={() => onNext(r)}
            className={`px-5 py-3 rounded-xl border-2 font-medium transition-colors ${
              value === r 
                ? 'bg-[var(--cr-primary)]/5 border-[var(--cr-primary)] text-[var(--cr-primary)]' 
                : 'bg-white border-[var(--cr-border)] text-[var(--cr-deep-text)] hover:border-[var(--cr-sage)]'
            }`}
          >
            {r} km
          </button>
        ))}
      </div>
      
      <div className="mt-auto flex flex-col gap-3">
        <button 
          onClick={() => onNext(value)}
          className="w-full py-4 bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white font-medium rounded-xl transition-colors"
        >
          Use recommended search area
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------
// STEP 6: ACCESSIBILITY NEEDS (OPTIONAL)
// --------------------------------------------------
export function AccessibilityStep({ value, onNext, onBack }: { value: string[], onNext: (v: string[]) => void, onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>(value);
  const options = [
    { id: 'WHEELCHAIR_ACCESS', label: 'Wheelchair accessible' },
    { id: 'ACCESSIBLE_ENTRANCE', label: 'Accessible entrance' },
    { id: 'ELEVATOR', label: 'Elevator' },
    { id: 'ACCESSIBLE_RESTROOM', label: 'Accessible restroom' },
    { id: 'MOBILITY_ASSISTANCE', label: 'Mobility assistance' },
    { id: 'SIGN_LANGUAGE', label: 'Sign-language support' },
    { id: 'VISUAL_ASSISTANCE', label: 'Visual assistance' },
    { id: 'ELDER_FRIENDLY', label: 'Elder-friendly access' },
    { id: 'OTHER', label: 'Other' },
    { id: 'NONE', label: 'No specific requirement' }
  ];

  const toggle = (optId: string) => {
    if (optId === 'NONE' || optId === 'UNKNOWN') {
      setSelected([optId]);
      return;
    }
    let newSelected = selected.filter(x => x !== 'NONE' && x !== 'UNKNOWN');
    if (newSelected.includes(optId)) {
      newSelected = newSelected.filter(x => x !== optId);
    } else {
      newSelected.push(optId);
    }
    setSelected(newSelected);
  };

  return (
    <div className="flex flex-col h-full">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-4 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors rounded-full hover:bg-[var(--cr-border)]">
        <ArrowLeft size={20} />
      </button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] mb-2 tracking-wide">
          Do you have any accessibility requirements?
        </h2>
        <p className="text-[var(--cr-muted)]">Optional. This helps CARE ROUTE identify hospitals that can better support your needs.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 overflow-y-auto max-h-[30vh] pr-2 custom-scrollbar">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
              selected.includes(opt.id) 
                ? 'bg-[var(--cr-primary)] text-white border-[var(--cr-primary)]' 
                : 'bg-white text-[var(--cr-deep-text)] border-[var(--cr-border)] hover:border-[var(--cr-sage)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button 
          onClick={() => onNext(selected)}
          className="w-full py-4 bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white font-medium rounded-xl transition-colors"
        >
          {selected.length > 0 ? 'Continue' : 'Skip'}
        </button>
        <button 
          onClick={() => onNext(['UNKNOWN'])}
          className="w-full py-3 text-[var(--cr-muted)] font-medium hover:text-[var(--cr-primary)] transition-colors"
        >
          I'm not sure
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------
// STEP 7: REVIEW
// --------------------------------------------------
export function ReviewStep({ reqs, onSubmit, onBack, onEdit }: { reqs: CareRequirement, onSubmit: () => void, onBack: () => void, onEdit: (stepIndex: number) => void }) {
  const SummaryRow = ({ label, value, stepIndex }: { label: string, value: string, stepIndex: number }) => (
    <div className="flex justify-between items-start py-3 border-b border-[var(--cr-border)] last:border-0">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-1">{label}</span>
        <span className="text-sm font-medium text-[var(--cr-deep-text)]">{value}</span>
      </div>
      <button 
        onClick={() => onEdit(stepIndex)}
        className="text-xs font-semibold text-[var(--cr-primary)] hover:underline"
      >
        [Edit]
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <button onClick={onBack} className="self-start p-2 -ml-2 mb-4 text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors rounded-full hover:bg-[var(--cr-border)]">
        <ArrowLeft size={20} />
      </button>
      
      <div className="mb-6">
        <h2 className="text-3xl font-light text-editorial text-[var(--cr-primary)] tracking-wide">
          YOUR CARE REQUIREMENTS
        </h2>
      </div>

      <div className="bg-[var(--cr-background)] rounded-xl p-5 mb-8 border border-[var(--cr-border)]">
        <SummaryRow label="Care Needed" value={reqs.careType || 'Not specified'} stepIndex={1} />
        <SummaryRow label="Urgency" value={reqs.urgency || 'Not specified'} stepIndex={2} />
        <SummaryRow label="Specialist" value={reqs.specialist || 'Not specified'} stepIndex={4} />
        <SummaryRow label="Resources" value={reqs.resources.length > 0 ? reqs.resources.join(', ') : 'None'} stepIndex={3} />
        <SummaryRow label="Accessibility" value={reqs.accessibilityNeeds && reqs.accessibilityNeeds.length > 0 ? reqs.accessibilityNeeds.join(', ') : 'None'} stepIndex={6} />
        <SummaryRow label="Location" value="Current location" stepIndex={5} />
        <SummaryRow label="Search Radius" value={`${reqs.radiusKm} km`} stepIndex={5} />
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button 
          onClick={onSubmit}
          className="w-full py-4 bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white font-semibold tracking-wide rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          Find Suitable Care
        </button>
      </div>
    </div>
  );
}
