// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Database, RefreshCw, Search, ChevronRight } from 'lucide-react';

export const DatasetPanel = ({ table = "dataset", rows = [], busy = false, onReload = () => Promise.resolve(), selectedId = null, onSelect = (row: any) => {}, title = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const displayTitle = title || table.replace(/_/g, ' ').toUpperCase();
  const filteredRows = useMemo(() => rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))), [rows, searchTerm]);

  return (
    <div className="flex flex-col h-full acrylic-sheet acrylic-indigo rounded-[3.5rem] overflow-hidden shadow-2xl transition-all hover:border-indigo-500/30">
      <div className="px-12 py-10 border-b border-white/5 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="p-5 bg-indigo-500/20 rounded-[2rem] border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.3)]"><Database className="text-indigo-300" size={28} /></div>
            <div><h3 className="text-white grandeur-label text-sm italic">{displayTitle}</h3><p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-[0.3em] mt-2 italic">Secure Data Node</p></div>
          </div>
          <button onClick={onReload} className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white jelly-click transition-all"><RefreshCw size={20} className={busy ? 'animate-spin' : ''} /></button>
        </div>
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input placeholder="ENTER QUERY..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-xs font-black text-white grandeur-label outline-none focus:border-indigo-500/50 transition-all" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredRows.map((row, idx) => (
          <div key={idx} onClick={() => onSelect(row)} className={`p-8 rounded-[2rem] acrylic-sheet jelly-click cursor-pointer group ${selectedId && String(selectedId) === String(row.id) ? 'acrylic-indigo border-indigo-500/50 shadow-indigo-900/40' : 'bg-white/[0.01] border-transparent hover:bg-white/[0.04]'}`}>
            <div className="flex items-center justify-between"><div className="flex items-center gap-6"><div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black ${selectedId && String(selectedId) === String(row.id) ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>{idx + 1}</div><span className="text-slate-100 font-black text-base uppercase tracking-tighter group-hover:text-indigo-300 transition-colors">{row.name || row.title || `L5_ENTITY_${row.id || idx+1}`}</span></div><ChevronRight size={20} className="text-slate-700 group-hover:text-indigo-500 transition-all" /></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DatasetPanel;
