// @ts-nocheck
import React, { useState } from 'react';
import { Calculator, Globe, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TariffManagement() {
  const { lang } = useLanguage();
  const t = (en: string, my: string) => (lang === "en" ? en : my);
  const [calc, setCalc] = useState({ weight: 1 });
  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-1000">
      <div className="relative group acrylic-sheet acrylic-indigo rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
        <div className="p-8 bg-indigo-500/20 rounded-[2.5rem] border border-indigo-500/30 shadow-indigo-500/10 shadow-2xl"><Globe className="h-12 w-12 text-indigo-400" /></div>
        <div className="flex-1">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{t("National Tariff System", "နိုင်ငံအဆင့် ပို့ဆောင်ခသတ်မှတ်ချက်")}</h2>
          <p className="grandeur-label text-indigo-400 text-xs mt-6 flex items-center gap-3"><Zap size={14} className="fill-current" /> Global Logistics Master Node</p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-5 acrylic-sheet acrylic-indigo rounded-[3.5rem] p-12 shadow-2xl">
           <h3 className="grandeur-label text-xs text-indigo-400 mb-12 flex items-center gap-4"><Calculator size={20} /> Rate Engine</h3>
           <div className="space-y-8">
              <input type="number" value={calc.weight} onChange={(e)=>setCalc({...calc, weight: Number(e.target.value)})} className="w-full h-24 bg-black/60 border border-white/10 rounded-[2.5rem] px-10 text-6xl font-black text-white font-mono outline-none focus:border-indigo-500 shadow-inner" />
              <div className="p-12 bg-indigo-600 rounded-[3rem] text-center shadow-[0_30px_60px_rgba(79,70,229,0.4)] jelly-click cursor-pointer"><p className="grandeur-label text-indigo-200 text-xs mb-4">Total Sovereign Rate</p><p className="text-6xl font-black text-white tracking-tighter">{(calc.weight * 3500).toLocaleString()} Ks</p></div>
           </div>
        </div>
      </div>
    </div>
  );
}
