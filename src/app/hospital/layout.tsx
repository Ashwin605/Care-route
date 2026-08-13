'use client';

import { useAuth } from '@/contexts/AuthContext';
import { HospitalProvider } from '@/contexts/HospitalContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import HospitalSidebar from '@/components/hospital/HospitalSidebar';
import HospitalHeader from '@/components/hospital/HospitalHeader';

// ============================================================
// CARE ROUTE — Hospital Workspace Layout
// ============================================================

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'HOSPITAL_STAFF')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !user || user.role !== 'HOSPITAL_STAFF') {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <HospitalProvider>
      <div className="flex min-h-screen bg-background">
        <HospitalSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <HospitalHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </HospitalProvider>
  );
}
