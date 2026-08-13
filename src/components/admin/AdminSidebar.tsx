import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Building2, 
  BedDouble, 
  Stethoscope, 
  Network,
  Users,
  AlertCircle
} from 'lucide-react';

const ADMIN_NAVIGATION = [
  { name: 'Overview', href: '/admin/dashboard', icon: Activity },
  { name: 'Hospitals', href: '/admin/hospitals', icon: Building2 },
  { name: 'Capacity', href: '/admin/capacity', icon: BedDouble },
  { name: 'Resources', href: '/admin/resources', icon: Stethoscope },
  { name: 'Specialists', href: '/admin/specialists', icon: Users },
  { name: 'Network', href: '/admin/network', icon: Network },
  { name: 'What-If', href: '/admin/what-if', icon: Activity },
  { name: 'Alerts', href: '/admin/alerts', icon: AlertCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[var(--cr-border)] hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-[var(--cr-border)]">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-[var(--cr-primary)] flex items-center gap-2">
          CARE ROUTE
        </Link>
      </div>

      <div className="px-6 py-4">
        <div className="text-[0.625rem] font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-4">
          Control Center
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {ADMIN_NAVIGATION.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[var(--cr-primary)]/5 text-[var(--cr-primary)]' 
                  : 'text-[var(--cr-deep-text)] hover:bg-[var(--cr-background)] hover:text-[var(--cr-primary)]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-[var(--cr-primary)]' : 'text-[var(--cr-muted)]'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--cr-border)]">
        <div className="bg-[var(--cr-background)] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[var(--cr-success)] animate-pulse" />
            <span className="text-[10px] font-bold text-[var(--cr-deep-text)] uppercase tracking-widest">Network Live</span>
          </div>
          <p className="text-xs text-[var(--cr-muted)]">Connected to core services</p>
        </div>
      </div>
    </aside>
  );
}
