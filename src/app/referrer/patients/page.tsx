import React from 'react';

export default function PatientsDirectory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Patient Directory</h1>
          <p className="text-[var(--cr-muted)] mt-1">Manage your patients and their care journeys.</p>
        </div>
        <button className="bg-white hover:bg-gray-50 border border-[var(--cr-border)] text-[var(--cr-deep-text)] px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors">
          + Add Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--cr-deep-text)] mb-2">No patients yet</h3>
        <p className="text-sm text-[var(--cr-muted)] max-w-md">
          You haven't added any patients to your workspace. Add a patient to begin managing their care and generating referrals.
        </p>
      </div>
    </div>
  );
}
