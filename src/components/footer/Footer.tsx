// ============================================================
// CARE ROUTE — Footer
// ============================================================

import Link from 'next/link';

const footerLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'For Hospitals', href: '/login' },
  { label: 'For Referrers', href: '/care' },
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-border bg-white"
      role="contentinfo"
    >
      <div className="section-container py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* ─── Brand ────────────────────────────────────── */}
          <div className="max-w-xs">
            <p className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-primary">
              CARE ROUTE
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Predictive healthcare referral orchestration.
            </p>
          </div>

          {/* ─── Links ────────────────────────────────────── */}
          <nav
            className="flex flex-wrap gap-x-8 gap-y-3"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.8125rem] text-muted hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ─── Disclaimer ─────────────────────────────────── */}
        <div className="mt-14 pt-8 border-t border-border">
          <p className="text-[0.75rem] text-muted/60 leading-relaxed max-w-2xl">
            CARE ROUTE provides AI-assisted decision support.
            It does not replace qualified healthcare professionals
            or emergency medical services.
          </p>
          <p className="mt-4 text-[0.6875rem] text-muted/40">
            © {new Date().getFullYear()} CARE ROUTE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
