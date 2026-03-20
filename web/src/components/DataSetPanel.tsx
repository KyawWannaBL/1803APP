import React from 'react';
import { Database, Activity, RefreshCw } from 'lucide-react';

interface DataSetPanelProps {
  table: string;
  rows: any[];
  busy?: boolean;
  onReload?: () => void;
  selectedId?: string | null;
  onSelect?: (row: any) => void;
  title?: string;
}

// Named export အဖြစ် ထားရှိသည်
export const DatasetPanel: React.FC<DataSetPanelProps> = ({ 
  table,
  rows = [], 
  busy = false,
  onReload,
  selectedId,
  onSelect,
  title
}) => {
  // ခေါင်းစဉ်ကို မြန်မာဘာသာသို့ အလိုအလျောက် ပြောင်းလဲခြင်း သို့မဟုတ် ပေးထားသော ခေါင်းစဉ်ကို သုံးခြင်း
  const displayTitle = title || table.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-indigo-500/30">
      {/* Header အပိုင်း */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center space-x-3">
          <Database className="text-indigo-400" size={18} />
          <h3 className="text-white font-bold text-sm uppercase tracking-widest">{displayTitle}</h3>
        </div>
        <div className="flex items-center space-x-4">
          {onReload && (
            <button 
              onClick={onReload}
              disabled={busy}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-30"
              title="ဒေတာ ပြန်လည်စတင်ရန်"
            >
              <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${busy ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              {busy ? 'လုပ်ဆောင်နေသည်' : 'တိုက်ရိုက် ချိတ်ဆက်မှု'}
            </span>
          </div>
        </div>
      </div>
      
      {/* List အပိုင်း */}
      <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {busy && rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3 opacity-50">
            <Activity className="text-indigo-500 animate-bounce" size={24} />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ဒေတာ စတင်ဖတ်နေသည်...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl m-2">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">လက်ရှိ ဒေတာအစုအဝေးတွင် မှတ်တမ်းမရှိပါ</p>
          </div>
        ) : (
          <div className="space-y-1">
            {rows.map((row, idx) => {
              const isSelected = selectedId && String(row.id) === String(selectedId);
              return (
                <div 
                  key={row.id || idx}
                  onClick={() => onSelect?.(row)}
                  className={`
                    group cursor-pointer p-4 rounded-xl border transition-all duration-300
                    ${isSelected 
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.1)]' 
                      : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-xs">
                        {row.name || row.title || row.label || `မှတ်တမ်း #${row.id}`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1">
                        ID: {row.id}
                      </span>
                    </div>
                    {isSelected && <Activity size={14} className="text-indigo-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Default export ကို ထည့်သွင်းပေးထားပါသည် (Runtime error ကို ဖြေရှင်းရန်)
export default DatasetPanel;