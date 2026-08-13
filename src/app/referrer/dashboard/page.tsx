'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ReferrerDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'REFERRER')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 border-b border-border bg-white flex justify-between items-center">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-primary">
          CARE ROUTE
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-primary">{user.name}</span>
          <Button variant="outline" size="sm" onClick={logout}>Sign out</Button>
        </div>
      </header>
      
      <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
        <div className="p-12 border border-border bg-white rounded-xl text-center">
          <h1 className="text-2xl font-semibold text-primary mb-2">Referrer Workspace</h1>
          <p className="text-muted mb-8">Workspace initialization complete. Ready for development.</p>
          <div className="w-16 h-16 rounded-full bg-primary/5 mx-auto flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">R</span>
          </div>
        </div>
      </main>
    </div>
  );
}
