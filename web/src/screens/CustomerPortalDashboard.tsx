// @ts-nocheck
import React from 'react';
import { LayoutGrid, Activity, ShieldCheck, Zap, ArrowUpRight, Plus, Globe, BarChart3, Package, Users, Wallet, Keyboard, ShoppingBag, Headphones, Server, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CustomerPortalDashboard() {
  const { t } = useLanguage();
  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-1000 max-w-[1600px] mx-auto">
      <div className="relative group acrylic-sheet acrylic-cyan rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
        <div className="p-8 bg-cyan-500/20 rounded-[2.5rem] border border-cyan-500/30 shadow-cyan-500/10 shadow-2xl relative z-10"><LayoutGrid className="h-12 w-12 text-cyan-400" /></div>
        <div className="flex-1 relative z-10">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{t("Public Access Terminal", "အများသုံး ပေါ်တယ်")}</h2>
          <div className="grandeur-label text-cyan-400 text-[10px] mt-6 flex items-center gap-6">
             <span className="flex items-center gap-2"><Globe size={14} /> {t("SYSTEM: ACTIVE", "စနစ်: အဆင်သင့်")}</span>
             <span className="flex items-center gap-2 text-white animate-pulse"><Zap size={14} /> {t("LIVE TELEMETRY", "တိုက်ရိုက် အချက်အလက်")}</span>
          </div>
        </div>
        <button className="relative z-10 px-8 py-5 rounded-[2rem] bg-white text-slate-900 font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center gap-3">
          <Plus size={16} /> {t("New Entry", "အသစ်ထည့်မည်")}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[ {l: t('Throughput', 'လုပ်ဆောင်မှုနှုန်း'), v:'1,284'}, {l: t('Efficiency', 'စွမ်းဆောင်ရည်'), v:'98.2%'}, {l: t('Active Nodes', 'အချက်များ'), v:'42'}, {l: t('Compliance', 'လိုက်နာမှု'), v:'100%'} ].map((s,i)=>(
          <div key={i} className="p-10 acrylic-sheet rounded-[3rem] bg-black/20 border-white/5 hover:border-cyan-500/40 transition-all">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.l}</span>
              <ArrowUpRight className="text-cyan-400" size={16} />
            </div>
            <div className="text-4xl font-black text-white tracking-tighter">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
