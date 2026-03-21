// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Monitor, FileText, Box, Zap, Activity } from 'lucide-react';
import { LogisticsApi } from '@/services/logistics-api';

export default function BranchOfficeDashboard() {
  const nav = useNavigate();
  const [status, setStatus] = useState('Syncing Telemetry...');

  useEffect(() => {
    LogisticsApi.getAdminMetrics().then(() => setStatus('Secure Node Active')).catch(() => setStatus('Local Override Mode'));
  }, []);

  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="relative group acrylic-sheet acrylic-emerald rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
        <div className="p-8 bg-emerald-500/20 rounded-[2.5rem] border border-emerald-500/30 shadow-emerald-500/10 shadow-2xl relative z-10"><Building2 className="h-12 w-12 text-emerald-400" /></div>
        <div className="flex-1 relative z-10">
          <h2 className="text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Branch Terminal</h2>
          <div className="grandeur-label text-emerald-400 text-xs mt-6 flex items-center gap-4"><Zap size={14} className="fill-current" /> <span>Local Hub</span><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="flex items-center gap-2"><Activity size={12} /> {status}</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button onClick={() => nav('/branch-office/dashboard')} className="p-12 acrylic-sheet acrylic-emerald rounded-[3.5rem] flex flex-col items-center justify-center gap-8 jelly-click group hover:bg-emerald-500/10 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]"><Monitor size={56} className="text-emerald-400 group-hover:scale-125 transition-transform duration-500" /><span className="grandeur-label text-white text-[11px] text-center leading-relaxed">Dashboard</span></button>
        <button onClick={() => nav('/branch-office/manifests')} className="p-12 acrylic-sheet acrylic-emerald rounded-[3.5rem] flex flex-col items-center justify-center gap-8 jelly-click group hover:bg-emerald-500/10 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]"><FileText size={56} className="text-emerald-400 group-hover:scale-125 transition-transform duration-500" /><span className="grandeur-label text-white text-[11px] text-center leading-relaxed">Manifests</span></button>
        <button onClick={() => nav('/branch-office/inventory')} className="p-12 acrylic-sheet acrylic-emerald rounded-[3.5rem] flex flex-col items-center justify-center gap-8 jelly-click group hover:bg-emerald-500/10 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]"><Box size={56} className="text-emerald-400 group-hover:scale-125 transition-transform duration-500" /><span className="grandeur-label text-white text-[11px] text-center leading-relaxed">Inventory</span></button>
      </div>
    </div>
  );
}
