// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { LogisticsApi } from '@/services/logistics-api';
export const ActivityTimelineWidget = () => {
  const [activities, setActivities] = useState([]);
  useEffect(() => { LogisticsApi.getActivityTimeline().then(res => setActivities(res)).catch(() => {}); }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-white">Activity timeline</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">Live</span>
      </div>
      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={i} className={`p-5 rounded-2xl border border-white/5 transition-all cursor-pointer ${act.status === 'error' ? 'bg-rose-500/5' : 'bg-white/[0.02]'}`}>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">{act.title}</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-2">{act.desc}</p>
            <span className="text-[9px] font-mono font-bold text-slate-600">{act.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
