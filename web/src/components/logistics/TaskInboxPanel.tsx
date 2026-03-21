// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { LogisticsApi } from '@/services/logistics-api';
export const TaskInboxPanel = ({ userRole }) => {
  const [tasks, setTasks] = useState([]);
  const [escalations, setEscalations] = useState([{ title: 'New branch sync delayed' }, { title: 'Role assignment pending approval' }]);
  useEffect(() => {
    if(userRole === 'super_admin' || userRole === 'enterprise_admin') {
      LogisticsApi.getPendingApprovals().then(res => setTasks(res)).catch(() => {});
    }
  }, [userRole]);
  if (userRole !== 'super_admin' && userRole !== 'enterprise_admin') return null;
  return (
    <div className="mt-8 pt-8 border-t border-white/5 space-y-6 px-2 text-white">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Task inbox & escalation queue</h3>
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-indigo-400/60">Inbox</p>
        <ul className="space-y-3">{tasks.map((t, i) => (<li key={i} className="flex items-start gap-3 group cursor-pointer"><div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" /><span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{t.title}</span></li>))}</ul>
        <p className="text-[10px] font-black uppercase text-rose-400/60 pt-2">Escalations</p>
        <ul className="space-y-3">{escalations.map((t, i) => (<li key={i} className="flex items-start gap-3 group cursor-pointer"><div className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" /><span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{t.title}</span></li>))}</ul>
      </div>
    </div>
  );
};
