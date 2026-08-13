import React from 'react';
import { MapPin, MapPinOff, Loader2 } from 'lucide-react';

interface LocationStatusProps {
  status: 'LOADING' | 'GRANTED' | 'DENIED';
}

export default function LocationStatus({ status }: LocationStatusProps) {
  if (status === 'LOADING') {
    return (
      <div className="flex items-center gap-1.5 text-sm text-[var(--cr-muted)]">
        <Loader2 size={14} className="animate-spin" />
        <span>Detecting location...</span>
      </div>
    );
  }

  if (status === 'DENIED') {
    return (
      <div className="flex items-center gap-1.5 text-sm text-[var(--cr-warning)] bg-[var(--cr-warning)]/10 px-2 py-1 rounded">
        <MapPinOff size={14} />
        <span>Location disabled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-[var(--cr-sage)] bg-[var(--cr-sage)]/10 px-2 py-1 rounded">
      <MapPin size={14} />
      <span>Using current location</span>
    </div>
  );
}
