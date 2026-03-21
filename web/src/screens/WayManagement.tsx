// @ts-nocheck
import React, { useState } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Truck, Zap, Radio } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WayManagement() {
  const { lang } = useLanguage();
  const t = (en: string, my: string) => (lang === "en" ? en : my);
  
  // Safe default that won't trigger Github Secret Scanning
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_PUBLIC_TOKEN";
  
  const [viewState, setViewState] = useState({
    longitude: 96.1561, // Yangon Coordinates
    latitude: 16.8053,
    zoom: 11,
    pitch: 45
  });

  const activeNodes = [
    { id: 'TRK-091', lng: 96.16, lat: 16.81, status: 'In Transit' },
    { id: 'HUB-RGN', lng: 96.14, lat: 16.80, status: 'Dispatch Bay' }
  ];

  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-1000 max-w-[1600px] mx-auto h-[90vh] flex flex-col">
      <div className="relative group acrylic-sheet acrylic-sky rounded-[4rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl shrink-0">
         <div className="p-6 bg-sky-500/20 rounded-[2rem] border border-sky-500/30"><Navigation className="h-10 w-10 text-sky-400" /></div>
         <div className="flex-1">
           <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{t("Live Telemetry Grid", "တိုက်ရိုက် ကြည့်ရှုစစ်ဆေးခြင်း")}</h2>
           <p className="grandeur-label text-sky-400 text-[10px] mt-4 flex items-center gap-3"><Radio size={14} className="animate-pulse" /> Mapbox API Synchronized</p>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-10 min-h-0">
        
        {/* Sidebar Tracking List */}
        <div className="xl:col-span-1 acrylic-sheet acrylic-indigo rounded-[3.5rem] p-8 flex flex-col gap-6 overflow-hidden">
          <h3 className="grandeur-label text-[10px] text-indigo-400 border-b border-white/5 pb-4">Active Convoys</h3>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            {activeNodes.map((node) => (
              <div key={node.id} className="p-6 rounded-[2rem] bg-black/40 border border-white/5 jelly-click cursor-pointer hover:border-indigo-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Truck className="text-indigo-400" size={20} />
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">{node.status}</span>
                </div>
                <h4 className="text-lg font-black text-white">{node.id}</h4>
                <p className="text-[10px] font-mono text-slate-500 mt-2">LAT: {node.lat} | LNG: {node.lng}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mapbox Container */}
        <div className="xl:col-span-3 acrylic-sheet acrylic-slate rounded-[3.5rem] overflow-hidden shadow-2xl relative border border-white/10 group">
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-0">
             {/* Fallback if mapbox fails to load in preview */}
             <div className="text-center opacity-50"><MapPin size={64} className="mx-auto text-slate-700 mb-4 animate-bounce"/><p className="grandeur-label text-slate-600 text-xs">Initializing Mapbox GL Engine...</p></div>
          </div>
          
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={mapboxToken}
            style={{width: '100%', height: '100%', position: 'absolute', zIndex: 10}}
          >
            <FullscreenControl position="top-right" />
            <NavigationControl position="top-right" />
            
            {activeNodes.map((node) => (
              <Marker key={node.id} longitude={node.lng} latitude={node.lat} anchor="bottom">
                <div className="relative group cursor-pointer transform transition-transform hover:scale-125 hover:z-50">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    <p className="text-xs font-black text-white">{node.id}</p>
                  </div>
                  <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] border-2 border-white">
                    <Truck size={20} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500/50 rounded-full animate-ping -z-10" />
                </div>
              </Marker>
            ))}
          </Map>
        </div>
      </div>
    </div>
  );
}
