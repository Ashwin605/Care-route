import React from 'react';
import { ReferralActivity } from '../../types/referral';
import { CheckCircle2, XCircle, Clock, Search, Activity, Flag } from 'lucide-react';

interface ReferralTimelineProps {
  activities: ReferralActivity[];
}

export default function ReferralTimeline({ activities }: ReferralTimelineProps) {
  
  // Ensure chronologically sorted (oldest first for visual flow top-to-bottom, or newest first?)
  // Usually top-to-bottom: Newest first is standard for activity feeds.
  const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIconForType = (type: string) => {
    switch (type) {
      case 'REFERRAL_CREATED': return <Clock size={16} className="text-[var(--cr-primary)]" />;
      case 'REVIEW_STARTED': return <Search size={16} className="text-yellow-600" />;
      case 'ACCEPTED': return <CheckCircle2 size={16} className="text-white" />;
      case 'DECLINED': return <XCircle size={16} className="text-white" />;
      case 'JOURNEY_STARTED': return <Activity size={16} className="text-[var(--cr-primary)]" />;
      case 'JOURNEY_COMPLETED': return <Flag size={16} className="text-[var(--cr-success)]" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getCircleStyles = (type: string) => {
    switch (type) {
      case 'ACCEPTED': return 'bg-[var(--cr-success)] shadow-[0_0_0_4px_rgba(20,184,166,0.2)] border-white border-2 z-10';
      case 'DECLINED': return 'bg-[var(--cr-critical)] shadow-[0_0_0_4px_rgba(239,68,68,0.2)] border-white border-2 z-10';
      case 'REFERRAL_CREATED': return 'bg-white border-2 border-[var(--cr-primary)] z-10';
      case 'REVIEW_STARTED': return 'bg-white border-2 border-yellow-500 z-10';
      default: return 'bg-white border-2 border-gray-300 z-10';
    }
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-6">
      <h2 className="text-sm font-bold text-[var(--cr-deep-text)] uppercase tracking-widest mb-6">Referral Timeline</h2>
      
      <div className="relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:via-gray-200 before:to-transparent">
        {sortedActivities.map((act, index) => {
          const { date, time } = formatDateTime(act.timestamp);
          return (
            <div key={act.id} className="relative flex items-start gap-4 mb-6 last:mb-0">
              <div className={`w-[2.8rem] h-[2.8rem] rounded-full shrink-0 flex items-center justify-center ${getCircleStyles(act.type)}`}>
                {getIconForType(act.type)}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-bold text-[var(--cr-deep-text)]">{act.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[var(--cr-primary)]">{date}</span>
                  <span className="text-[10px] text-[var(--cr-muted)] font-medium">• {time}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ml-2">{act.actorId.role.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
