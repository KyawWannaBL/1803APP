// @ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import portals from "@/data/portalConfig.json";
import { getPortalBase } from "@/lib/roleRouting";
import { ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { useI18n } from "@/i18n/I18nProvider";

export default function PortalDirectory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { locale } = useI18n();

  const availablePortals = Object.entries(portals).filter(([, p]) => user && p.roles.includes(user?.role));
  const colors = ["acrylic-indigo", "acrylic-emerald", "acrylic-sky", "acrylic-amber", "acrylic-rose"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05080F] text-white font-sans antialiased p-8 lg:p-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1e1b4b,_#05080f_50%)] z-0" />
      
      <div className="relative z-10 mb-16 animate-in fade-in slide-in-from-top-10 duration-1000 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Secure Environment Verified</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl leading-none">
          Portal Directory
        </h1>
        <p className="grandeur-label text-indigo-400 text-xs mt-8 flex items-center gap-3">
          <Layers size={16} /> Select an active workspace to initialize command module
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {availablePortals.map(([key, p], index) => {
          const colorClass = colors[index % colors.length];
          const targetUrl = getPortalBase ? getPortalBase(key, p.base) : p.base;
          const name = locale === "en" ? p.name_en : p.name_mm;

          return (
            <div 
              key={key}
              onClick={() => navigate(targetUrl)}
              className={`relative group acrylic-sheet ${colorClass} rounded-[3.5rem] p-12 flex flex-col justify-between min-h-[340px] cursor-pointer jelly-click overflow-hidden shadow-2xl hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]`}
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
              
              <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-6 drop-shadow-lg group-hover:text-white transition-colors">
                  {name || key.replace("_", " ")}
                </h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed max-w-[90%]">
                  Initialize the {name || key} operational environment and connect to the secure backend node.
                </p>
              </div>

              <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/10 pt-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-white/50" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Level {p.roles?.length || 1} Access</span>
                </div>
                <div className="flex items-center gap-3 text-white grandeur-label text-[10px] group-hover:text-white group-hover:translate-x-2 transition-all">
                  Open Node <ArrowRight size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

