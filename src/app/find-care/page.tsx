import React from 'react';
import CareRequirementWizard from '../../components/find-care/CareRequirementWizard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FindCarePage() {
  return (
    <div className="min-h-screen bg-[var(--cr-background)] text-[var(--cr-deep-text)] flex flex-col">
      <header className="py-6 px-6 lg:px-12 flex items-center gap-4">
        <Link href="/care" className="p-2 hover:bg-[var(--cr-border)] rounded-full transition-colors group">
          <ArrowLeft size={20} className="text-[var(--cr-primary)] group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <span className="text-sm font-semibold tracking-widest uppercase text-[var(--cr-muted)]">CARE ROUTE</span>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-6">
        <CareRequirementWizard />
      </main>
    </div>
  );
}
