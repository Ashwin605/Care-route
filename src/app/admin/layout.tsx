'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// ============================================================
// CARE ROUTE — Admin Workspace Layout
// ============================================================

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prevent unauthenticated or non-admin access
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Loading state or unauthorized state (returns empty screen to avoid flashing content)
  if (isLoading || !user || user.role !== 'ADMIN') {
    return <div className="min-h-screen bg-[var(--cr-background)]" />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--cr-background)]">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-[var(--cr-background)]">
          {children}
        </main>
      </div>
    </div>
  );
}
