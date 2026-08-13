'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { animation } from '@/lib/tokens';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

// ============================================================
// CARE ROUTE — Navigation Component
// ============================================================

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push('/login');
  };

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Home', href: '/' },
        { label: 'Find Care', href: '/find-care' },
        { label: 'About', href: '/about' },
      ];
    }
    
    switch (user?.role) {
      case 'ADMIN':
        return [
          { label: 'Control Center', href: '/admin/dashboard' },
        ];
      case 'HOSPITAL_STAFF':
        return [
          { label: 'Hospital Workspace', href: '/hospital' },
        ];
      case 'REFERRER':
        return [
          { label: 'Referrer Workspace', href: '/referrer' },
          { label: 'Create Referral', href: '/referrer/referrals/new' },
        ];
      default:
        // Treat as patient or pending role
        return [
          { label: 'Home', href: '/' },
          { label: 'Find Care', href: '/find-care' },
        ];
    }
  };

  const navLinks = getNavLinks();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: animation.easeOut }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled || pathname !== '/' 
            ? 'bg-white/90 backdrop-blur-sm border-b border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          className="section-container flex items-center justify-between h-16 md:h-[72px]"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ─── Logo ─────────────────────────────────────── */}
          <Link
            href="/"
            className={`text-[0.9375rem] font-semibold tracking-[0.04em] uppercase transition-colors duration-300 ${
              scrolled || pathname !== '/' ? 'text-primary' : 'text-white'
            }`}
            aria-label="CARE ROUTE Home"
          >
            CARE ROUTE
          </Link>

          {/* ─── Desktop Links ────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-4 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] rounded-md transition-all duration-200 ${
                    scrolled || pathname !== '/'
                      ? active ? 'text-primary bg-primary/10' : 'text-muted hover:text-primary hover:bg-primary/4'
                      : active ? 'text-white bg-white/20' : 'text-white/70 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ─── Desktop Actions ──────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 text-[0.8125rem] font-medium tracking-[-0.01em] rounded-md transition-all duration-200 ${
                    scrolled || pathname !== '/'
                      ? 'text-muted hover:text-primary'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Sign in
                </Link>
                <Button
                  variant={scrolled || pathname !== '/' ? 'primary' : 'inverted-ghost'}
                  size="sm"
                  href="/find-care"
                >
                  Find Care
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scrolled || pathname !== '/' ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white'}`}>
                    <UserIcon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${scrolled || pathname !== '/' ? 'text-[var(--cr-deep-text)]' : 'text-white'}`}>{user?.name}</span>
                    <span className={`text-[10px] tracking-widest uppercase ${scrolled || pathname !== '/' ? 'text-[var(--cr-muted)]' : 'text-white/70'}`}>{user?.role || 'Patient'}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${
                    scrolled || pathname !== '/' ? 'text-red-500 hover:bg-red-50' : 'text-white/90 hover:bg-white/20'
                  }`}
                  aria-label="Logout"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* ─── Mobile Menu Button ───────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors duration-200 ${
              scrolled || pathname !== '/'
                ? 'text-primary hover:bg-primary/5'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* ─── Mobile Menu ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: animation.easeOut }}
              className="absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white border-l border-border shadow-[-8px_0_30px_rgba(0,0,0,0.06)] flex flex-col"
            >
              <div className="flex flex-col flex-1 pt-20 px-6 pb-8 overflow-y-auto">
                {isAuthenticated && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-[var(--cr-border)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--cr-deep-text)] text-sm">{user?.name}</div>
                      <div className="text-[10px] tracking-widest uppercase text-[var(--cr-muted)] mt-0.5">{user?.role || 'Patient'}</div>
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                  {navLinks.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.06,
                          ease: animation.easeOut,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`block px-4 py-3 text-[0.9375rem] font-medium rounded-md transition-colors duration-200 ${
                            active ? 'text-primary bg-primary/10' : 'text-primary hover:bg-primary/4'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[var(--cr-border)]">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 text-center text-[0.875rem] font-medium text-muted hover:text-primary rounded-md transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                      <Button variant="primary" size="md" className="w-full" href="/find-care" onClick={() => setMobileOpen(false)}>
                        Find Care
                      </Button>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-3 w-full text-[0.875rem] font-bold uppercase tracking-wider text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
