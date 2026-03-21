// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Building2, Users, Activity, RefreshCw } from 'lucide-react';
import { LogisticsApi } from '@/services/logistics-api';
import { useI18n } from '@/i18n';
import { toast } from 'react-hot-toast';

export default function EnterpriseAdminDashboard() {
  const { bi } = useI18n();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [loads, setLoads] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, l] = await Promise.all([LogisticsApi.getAdminMetrics(), LogisticsApi.getRegionalLoads()]);
      setMetrics(m); setLoads(l);
    } catch (err) {
      toast.error(bi("Sync error", "ဒေတာရယူမှု မအောင်မြင်ပါ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const kpis = [
    { name: bi('Branches', 'ရုံးခွဲများ'), value: metrics?.activeBranches || '0', icon: Building2, color: 'text-indigo-400' },
    { name: bi('Users', 'အသုံးပြုသူများ'), value: metrics?.totalUsers || '0', icon: Users, color: 'text-emerald-400' },
    { name: bi('Health', 'စနစ် ကျန်းမာရေး'), value: metrics?.healthScore || '100%', icon: Activity, color: 'text-blue-400' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{bi("Control Tower", "ထိန်းချုပ်မှု ဗဟို")}</h1>
        <button onClick={loadData} className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="p-8 rounded-[2rem] bg-[#05080F] border border-white/5 shadow-xl transition-all">
            <div className={`mb-4 p-3 rounded-xl bg-white/5 w-fit ${kpi.color}`}><kpi.icon size={20} /></div>
            <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{kpi.name}</h4>
            <div className="text-3xl font-black text-white mt-1">{kpi.value}</div>
          </div>
        ))}
      </div>
      <div className="p-8 rounded-[2.5rem] bg-[#05080F] border border-white/5 shadow-2xl">
        <h3 className="text-lg font-black text-white mb-6 uppercase italic">{bi("Hub Throughput", "ဂိုဒေါင်အလိုက် လုပ်ငန်းပမာဏ")}</h3>
        <div className="space-y-4">
          {loads.map((hub: any) => (
            <div key={hub.name} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>{hub.name}</span><span>{hub.load}%</span></div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${hub.load > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${hub.load}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
