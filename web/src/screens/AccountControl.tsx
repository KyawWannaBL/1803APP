// @ts-nocheck
import React from 'react';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AccountControl() {
  const { lang } = useLanguage();
  const t = (en: string, my: string) => (lang === "en" ? en : my);
  return (
    <div className="p-12 space-y-12 bg-transparent min-h-screen">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 acrylic-sheet acrylic-indigo p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="flex items-center gap-10 relative z-10">
          <div className="p-8 bg-sky-500/20 rounded-[2.5rem] border border-sky-500/30 shadow-sky-500/10 shadow-2xl"><UserPlus className="text-sky-400" size={48} /></div>
          <div><h1 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{t("Account Control", "အကောင့်ထိန်းချုပ်မှု")}</h1><p className="grandeur-label text-sky-500 text-xs mt-6 flex items-center gap-3"><ShieldCheck size={14}/> Identity Sovereignty Hub</p></div>
        </div>
        <button className="h-20 px-14 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-[2rem] grandeur-label text-xs tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(2,132,199,0.4)] jelly-click">Create Personnel Account</button>
      </div>
    </div>
  );
}
