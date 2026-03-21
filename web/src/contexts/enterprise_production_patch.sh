#!/bin/bash

# Britium Express Enterprise Production Patch Script
# This script generates production-ready, backend-integrated files for the platform.

PROJECT_ROOT="apps/web/src"

# 1. Ensure directories exist
mkdir -p "$PROJECT_ROOT/services"
mkdir -p "$PROJECT_ROOT/screens"
mkdir -p "$PROJECT_ROOT/utils"
mkdir -p "$PROJECT_ROOT/components/logistics"

echo "🚀 Initializing Production Files Generation..."

# 2. Logistics API Service
cat << 'EOF' > "$PROJECT_ROOT/services/logistics-api.ts"
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});

export const LogisticsApi = {
  async getWaySummary() {
    const res = await api.get("/ops/way-management-summary");
    return res.data;
  },
  async searchWays(params: { q?: string; tab: string; page?: number }) {
    const res = await api.get("/ops/ways/search", { params });
    return res.data;
  },
  async updateWayStatus(payload: { wayId: string; status: string; note?: string; location?: string }) {
    const res = await api.patch(`/ways/${payload.wayId}/status`, payload);
    return res.data;
  },
  async submitProof(payload: {
    wayId: string;
    type: "PICKUP" | "DELIVERY";
    signerName: string;
    signatureBase64: string;
    photoUrls: string[];
    geoCoords: { lat: number; lng: number };
  }) {
    const res = await api.post(`/ways/${payload.wayId}/proof`, payload);
    return res.data;
  },
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  }
};
EOF

# 3. Logistics Utils (Photo Quality & ID Generation)
cat << 'EOF' > "$PROJECT_ROOT/utils/logisticsUtils.ts"
export function analyzePhotoQuality(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { tooDark: false, tooBright: false };
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
  let brightness = 0;
  for (let i = 0; i < pixels.length; i += 4) { brightness += pixels[i]; }
  brightness /= (pixels.length / 4);
  return { tooDark: brightness < 40, tooBright: brightness > 200 };
}

export function generateWayID(origin: string, dest: string): string {
  const prefix = "BRX";
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${origin.substring(0, 3)}-${dest.substring(0, 3)}-${dateStr}-${random}`.toUpperCase();
}
EOF

# 4. Way Management Command Center
cat << 'EOF' > "$PROJECT_ROOT/screens/WayManagement.tsx"
import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Search, Truck, Package, CheckCircle2, AlertTriangle } from "lucide-react";
import { LogisticsApi } from "@/services/logistics-api";
import { useI18n } from "@/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";

export default function WayManagement() {
  const { bi } = useI18n();
  const [activeTab, setActiveTab] = useState("pickup");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, itemRes] = await Promise.all([
        LogisticsApi.getWaySummary(),
        LogisticsApi.searchWays({ q: search, tab: activeTab })
      ]);
      setSummary(sumRes);
      setItems(itemRes.items || []);
    } catch (err) {
      toast.error(bi("Sync Failed", "ချိတ်ဆက်မှု မအောင်မြင်ပါ"));
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, bi]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
            {bi("Logistics Command Center", "ပို့ဆောင်ရေး ကွပ်ကဲမှု ဗဟိုဌာန")}
          </h1>
          <p className="text-slate-500 font-medium mt-1">L5 Enterprise Oversight Terminal</p>
        </div>
        <button onClick={loadData} className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title={bi("Pickup", "လက်ခံရန်")} value={summary?.pickupQueue || 0} icon={<Package className="text-amber-400" />} />
        <StatCard title={bi("Transit", "လမ်းခရီး")} value={summary?.transitCount || 0} icon={<Truck className="text-sky-400" />} />
        <StatCard title={bi("Delivered", "ပို့ပြီး")} value={summary?.deliveredCount || 0} icon={<CheckCircle2 className="text-emerald-400" />} />
        <StatCard title={bi("Exception", "ပြဿနာ")} value={summary?.anomalyCount || 0} icon={<AlertTriangle className="text-rose-400" />} />
      </div>

      <Card className="bg-[#05080F] border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <TabsList className="bg-black/40 border border-white/5 h-14 rounded-2xl">
              <TabsTrigger value="pickup" className="px-6 font-black uppercase text-[10px] tracking-widest">{bi("Pickup", "လက်ခံမှု")}</TabsTrigger>
              <TabsTrigger value="delivery" className="px-6 font-black uppercase text-[10px] tracking-widest">{bi("Delivery", "ပို့ဆောင်မှု")}</TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input 
                type="text" 
                placeholder={bi("Search Waybill...", "ရှာဖွေရန်...")}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                  <tr>
                    <th className="px-10 py-5">{bi("Waybill", "နံပါတ်")}</th>
                    <th className="px-6 py-5">{bi("Status", "အခြေအနေ")}</th>
                    <th className="px-6 py-5">{bi("Node", "ဌာနခွဲ")}</th>
                    <th className="px-10 py-5 text-right">{bi("Audit", "စစ်ဆေး")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-10 py-6 font-mono text-sm text-indigo-400 font-bold">{item.way_id}</td>
                      <td className="px-6 py-6 text-xs text-slate-300 font-bold uppercase">{item.status}</td>
                      <td className="px-6 py-6 text-sm text-slate-400">{item.origin_township}</td>
                      <td className="px-10 py-6 text-right font-black text-[10px] text-indigo-500 cursor-pointer">{bi("DETAILS", "အသေးစိတ်")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-[#05080F] border border-white/5 shadow-xl transition-all hover:border-indigo-500/30">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white/5 rounded-2xl">{icon}</div>
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</h4>
      <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
    </div>
  );
}
EOF

# 5. Delivery Proof Execution Screen
cat << 'EOF' > "$PROJECT_ROOT/screens/DeliveryProof.tsx"
import React, { useState, useRef } from "react";
import SignatureCanvas from 'react-signature-canvas';
import { Camera, CheckCircle, ShieldCheck, Loader2, Trash2 } from "lucide-react";
import { LogisticsApi } from "@/services/logistics-api";
import { useI18n } from "@/i18n";
import { toast } from "react-hot-toast";

export default function DeliveryProof({ wayId, onComplete }: { wayId: string; onComplete: () => void }) {
  const { bi } = useI18n();
  const sigPad = useRef<any>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signer, setSigner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFinalize = async () => {
    if (!photo || !signer || sigPad.current.isEmpty()) {
      return toast.error(bi("Evidence Incomplete", "အချက်အလက် မပြည့်စုံပါ"));
    }
    setSubmitting(true);
    try {
      const uploadedUrl = await LogisticsApi.uploadMedia(photo);
      const sigData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      await LogisticsApi.submitProof({
        wayId, type: "DELIVERY", signerName: signer,
        signatureBase64: sigData, photoUrls: [uploadedUrl],
        geoCoords: { lat: 16.8409, lng: 96.1735 }
      });
      toast.success(bi("POD Secured", "ပို့ဆောင်မှု အထောက်အထား သိမ်းဆည်းပြီးပါပြီ"));
      onComplete();
    } catch (err) {
      toast.error(bi("Failed to finalize", "အတည်ပြုရန် မအောင်မြင်ပါ"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-10 p-10 bg-[#05080F] rounded-[3rem] border border-white/5 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-black text-white uppercase italic">{bi("Secure Proof (ePOD)", "ပို့ဆောင်မှု အထောက်အထား")}</h3>
          <p className="text-slate-500 text-sm">{bi("Photo audit and recipient signature required.", "ဓာတ်ပုံနှင့် လက်မှတ် လိုအပ်ပါသည်။")}</p>
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-indigo-400">{bi("1. Capture Photo", "၁။ ဓာတ်ပုံရိုက်ပါ")}</label>
          <div className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
            {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <Camera size={48} className="text-indigo-500 opacity-30" />}
            <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
              const f = e.target.files?.[0]; if (f) { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)); }
            }} />
          </div>
        </div>
        <input 
          className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-indigo-500"
          placeholder={bi("Recipient Name", "လက်ခံသူအမည်")}
          value={signer} onChange={(e) => setSigner(e.target.value)}
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black uppercase text-indigo-400">{bi("2. Sign Here", "၂။ လက်မှတ်ထိုးပါ")}</label>
            <button onClick={() => sigPad.current.clear()} className="text-[9px] font-black uppercase text-rose-500 underline">{bi("Clear", "ဖျက်ရန်")}</button>
          </div>
          <div className="bg-white rounded-3xl h-64 overflow-hidden border-8 border-black/40 shadow-inner">
            <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ className: 'w-full h-full' }} />
          </div>
        </div>
        <button 
          onClick={handleFinalize} disabled={submitting}
          className="w-full h-20 mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all"
        >
          {submitting ? <Loader2 className="animate-spin" /> : bi("Finalize POD", "အတည်ပြုမည်")}
        </button>
      </div>
    </div>
  );
}
EOF

echo "✅ Production files updated successfully in $PROJECT_ROOT"
echo "--------------------------------------------------------"
echo "Run 'npm run build' to verify compilation."
EOF

# Make the script executable
chmod +x enterprise_production_patch.sh

echo "Script created. Please execute './enterprise_production_patch.sh' in your Git Bash terminal."