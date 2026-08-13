"use client";

import Navigation from '@/components/navigation/Navigation';
import Hero from '@/components/hero/Hero';
import ProblemSection from '@/components/sections/ProblemSection';
import DifferenceSection from '@/components/sections/DifferenceSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import IntelligentMatchingSection from '@/components/sections/IntelligentMatchingSection';
import CapacityForecastSection from '@/components/sections/CapacityForecastSection';
import CapacityHandshakeSection from '@/components/sections/CapacityHandshakeSection';
import ReferralJourneySection from '@/components/sections/ReferralJourneySection';
import NetworkVisualization from '@/components/network/NetworkVisualization';
import FinalCTASection from '@/components/sections/FinalCTASection';
import Footer from '@/components/footer/Footer';
import { useNetworkState } from '@/contexts/NetworkStateContext';
import { CheckCircle2, Navigation as NavigationIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { referrals } = useNetworkState();
  const patientReferral = referrals.find(r => r.status === 'ACCEPTED');
  return (
    <>
      <Navigation />
      
      {/* ─── PATIENT REFERRAL INTEGRATION (PHASE 7) ───────────────────── */}
      {patientReferral && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] sm:w-auto max-w-md animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="bg-[#0A1A1F]/80 backdrop-blur-xl border border-white/10 text-white rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 pl-2">
              <div className="bg-[var(--cr-success)] p-2 rounded-full text-white shadow-[0_0_20px_rgba(47,133,90,0.4)] shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="py-1 pr-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Referral Accepted</p>
                <p className="text-sm font-medium line-clamp-1">{patientReferral.destinationHospitalName}</p>
              </div>
            </div>
            <Link 
              href={`/find-care/results?referralId=${patientReferral.id}`}
              className="bg-white text-[#0A1A1F] px-4 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors shrink-0"
            >
              View Route <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}

      <main>
        <Hero />
        <ProblemSection />
        <DifferenceSection />
        <HowItWorksSection />
        <IntelligentMatchingSection />
        <CapacityForecastSection />
        <CapacityHandshakeSection />
        <ReferralJourneySection />
        <NetworkVisualization />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
