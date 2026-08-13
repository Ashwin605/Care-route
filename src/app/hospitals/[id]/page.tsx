import React from 'react';
import HospitalDetail from '../../../components/hospitals/HospitalDetail';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MOCK_HOSPITALS } from '../../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../../data/mockSpecialists';

export default async function HospitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hospital = MOCK_HOSPITALS.find(h => h.id === id);
  
  if (!hospital) {
    return (
      <div className="min-h-screen bg-[var(--cr-background)] text-[var(--cr-deep-text)] p-12 text-center">
        <h1 className="text-2xl font-light text-[var(--cr-primary)]">Hospital not found</h1>
        <Link href="/care" className="text-sm font-medium text-[var(--cr-primary)] hover:underline mt-4 inline-block">Return to map</Link>
      </div>
    );
  }

  const capacity = MOCK_CAPACITY[hospital.id] || [];
  const specialists = MOCK_SPECIALISTS[hospital.id] || [];

  return (
    <div className="min-h-screen bg-[var(--cr-background)] text-[var(--cr-deep-text)] flex flex-col">
      <header className="py-6 px-6 lg:px-12 flex items-center justify-between border-b border-[var(--cr-border)] bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/care" className="flex items-center gap-2 p-2 hover:bg-[var(--cr-border)] rounded-full transition-colors group">
            <ArrowLeft size={20} className="text-[var(--cr-primary)] group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium text-[var(--cr-deep-text)] hidden sm:inline">Back to Network</span>
          </Link>
          <span className="text-sm font-semibold tracking-widest uppercase text-[var(--cr-muted)]">CARE ROUTE</span>
        </div>
      </header>
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-8">
        <HospitalDetail hospital={hospital} capacity={capacity} specialists={specialists} />
      </main>
    </div>
  );
}
