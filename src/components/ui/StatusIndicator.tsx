'use client';

// ============================================================
// CARE ROUTE — Status Indicator Component
// ============================================================

type StatusType = 'available' | 'limited' | 'unavailable' | 'active' | 'pending';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  pulse?: boolean;
  className?: string;
}

const statusColors: Record<StatusType, string> = {
  available: 'bg-success',
  active: 'bg-success',
  limited: 'bg-warning',
  pending: 'bg-warning',
  unavailable: 'bg-critical',
};

const statusLabels: Record<StatusType, string> = {
  available: 'Available',
  active: 'Active',
  limited: 'Limited',
  pending: 'Pending',
  unavailable: 'Unavailable',
};

export default function StatusIndicator({
  status,
  label,
  pulse = true,
  className = '',
}: StatusIndicatorProps) {
  const displayLabel = label || statusLabels[status];

  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.75rem] font-medium ${className}`}
      role="status"
      aria-label={displayLabel}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (status === 'available' || status === 'active') && (
          <span
            className={`absolute inset-0 rounded-full ${statusColors[status]} opacity-40 animate-ping`}
            aria-hidden="true"
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${statusColors[status]}`}
          aria-hidden="true"
        />
      </span>
      <span className="text-muted">{displayLabel}</span>
    </span>
  );
}
