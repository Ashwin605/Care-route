import React from 'react';
import { JourneyEvent } from '../../types/journey';
import { CheckCircle, Clock, AlertTriangle, Navigation, Info, Activity } from 'lucide-react';

export default function JourneyTimeline({ events }: { events: JourneyEvent[] }) {
  // Sort events newest first
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'JOURNEY_STARTED':
      case 'JOURNEY_ARRIVING':
      case 'COMPLETED':
        return <Navigation size={14} className="text-white" />;
      case 'ETA_UPDATED':
        return <Clock size={14} className="text-white" />;
      case 'DESTINATION_VERIFIED':
        return <CheckCircle size={14} className="text-white" />;
      case 'DESTINATION_STATUS_CHANGED':
      case 'NETWORK_CHANGE_DETECTED':
        return <AlertTriangle size={14} className="text-white" />;
      case 'MONITORING_INTERRUPTED':
        return <Activity size={14} className="text-white" />;
      default:
        return <Info size={14} className="text-white" />;
    }
  };

  const getEventColor = (type: string, data?: any) => {
    if (type === 'DESTINATION_STATUS_CHANGED' || type === 'NETWORK_CHANGE_DETECTED') {
       if (data && data.reasons && data.reasons.some((r: string) => r.toLowerCase().includes('unavailable'))) {
         return 'bg-[var(--cr-critical)]';
       }
       return 'bg-[var(--cr-warning)]';
    }
    if (type === 'DESTINATION_VERIFIED' || type === 'COMPLETED') return 'bg-[var(--cr-success)]';
    return 'bg-[var(--cr-primary)]';
  };

  return (
    <div className="w-full mt-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] mb-4">Journey Timeline</h3>
      <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
        {sortedEvents.map((event, index) => {
          const colorClass = getEventColor(event.type, event.data);
          
          return (
            <div key={event.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${colorClass}`}>
                {getEventIcon(event.type)}
              </div>
              
              {/* Event Content */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[var(--cr-muted)] mb-1">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`text-sm font-bold ${
                  (event.type === 'DESTINATION_STATUS_CHANGED' || event.type === 'NETWORK_CHANGE_DETECTED') 
                    ? 'text-[var(--cr-warning)]' 
                    : 'text-[var(--cr-deep-text)]'
                }`}>
                  {event.type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-[var(--cr-muted)] mt-1 font-medium">
                  {event.description}
                </span>
                
                {/* Specific data payload rendering */}
                {event.data && event.data.reasons && event.data.reasons.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-500 list-disc ml-4 space-y-1">
                    {event.data.reasons.map((reason: string, i: number) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
