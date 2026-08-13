'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Define Route Access Rules
    const isPublicRoute = 
      pathname === '/' || 
      pathname === '/login' || 
      pathname === '/about' || 
      pathname.startsWith('/find-care') || 
      pathname.startsWith('/journey');

    // 1. If Unauthenticated:
    if (!isAuthenticated) {
      if (pathname.startsWith('/admin') || (pathname.startsWith('/hospital') && !pathname.startsWith('/hospitals')) || pathname.startsWith('/referrer')) {
         router.replace('/');
      } else {
        setIsAuthorized(true);
      }
      return;
    }

    // 2. If Authenticated:
    const role = user?.role;

    // Admin constraints
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      router.replace('/');
      return;
    }
    
    // Hospital constraints
    if (pathname.startsWith('/hospital') && !pathname.startsWith('/hospitals') && role !== 'HOSPITAL_STAFF') {
      router.replace('/');
      return;
    }

    // Referrer constraints
    if (pathname.startsWith('/referrer') && role !== 'REFERRER') {
      router.replace('/');
      return;
    }

    // If passed all constraints
    setIsAuthorized(true);

  }, [pathname, user, isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthorized) {
    // Render a subtle loading state while verifying authorization to prevent UI flashes
    return (
      <div className="min-h-screen bg-[var(--cr-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--cr-primary)]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
