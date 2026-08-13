import RoleSelector from '@/components/auth/RoleSelector';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Select Role | CARE ROUTE',
};

export default function RolePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6 border-b border-border bg-white flex justify-between items-center">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-primary">
          CARE ROUTE
        </Link>
        <div className="text-[0.75rem] text-muted uppercase tracking-[0.04em]">
          PROTOTYPE ENVIRONMENT
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        <RoleSelector />
      </main>
    </div>
  );
}
