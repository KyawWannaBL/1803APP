// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
// Deduplicated massive import to prevent Vite parse errors
import { ShieldCheck, Activity, Zap, Database, RefreshCw, UploadCloud, Map, FileSpreadsheet, ScanLine, PenTool, Printer, Truck, FileText, Package, CheckCircle2, AlertTriangle, Wallet, Building2, ArrowDownRight, Inbox, AlertCircle, ArrowUpRight, Monitor, PlusCircle, Users, UserCheck, XCircle, Flame, DollarSign, Banknote, ListChecks, Coins, BookOpen, RefreshCcw, Headphones, Search, History, Edit3, AlertOctagon, Book, ShoppingBag, PlusSquare, RotateCcw, Receipt, Settings, Code, Home, Plus, MessageSquare, User, Sliders, Terminal, Server, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

// INLINE WAYBILL ENGINE
const WaybillTemplate = ({ data, size = "4x6", userId }) => {
  const getContainerClass = () => {
    switch(size) {
      case "A4": return "w-[210mm] h-[297mm] p-8 text-base bg-white text-black";
      case "A5": return "w-[148mm] h-[210mm] p-6 text-sm bg-white text-black";
      case "4x6": return "w-[4in] h-[6in] p-3 text-[11px] bg-white text-black";
      case "4x3": return "w-[4in] h-[3in] p-2 text-[9px] bg-white text-black";
      case "4x3_dual": return "w-[4in] h-[6in] flex flex-col bg-white text-black"; 
      default: return "w-[4in] h-[6in] p-3 text-[11px] bg-white text-black";
    }
  };

  const SingleWaybill = ({ item, isHalf = false }) => (
    <div className={`bg-white border-2 border-black text-black font-sans overflow-hidden ${isHalf ? 'h-[3in] p-2 text-[9px] border-b-dashed' : 'h-full flex flex-col'}`}>
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black italic text-xs shrink-0">BE</div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter leading-none">Britium Express</h1>
            <p className="text-[9px] font-bold text-slate-700">DELIVERY SERVICE</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <QRCodeSVG value={item.waybillId} size={isHalf ? 45 : 55} />
          <p className="text-[8px] font-mono mt-1 font-black">{item.waybillId}</p>
        </div>
      </div>

      <div className="border-b-2 border-black pb-2 mb-2 space-y-1">
        <div className="flex gap-2">
          <span className="font-bold w-14 text-[9px]">Merchant:</span>
          <div className="flex-1 leading-tight">
            <p className="font-bold">{item.merchantName}</p>
            <p className="text-[9px]">{item.merchantPhone}</p>
          </div>
        </div>
        <div className="flex gap-2 border-t border-black pt-1 mt-1">
          <span className="font-bold w-14 text-[9px]">Recipient:</span>
          <div className="flex-1 leading-tight">
            <p className="font-black text-base leading-none mb-1">{item.recipientName}</p>
            <p className="font-black text-[10px]">{item.recipientPhone}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b-2 border-black mb-2 text-center py-1 font-black text-xs uppercase bg-slate-50">
        <div className="border-r-2 border-black">** {item.origin} **</div>
        <div>** {item.destination} **</div>
      </div>

      <div className="bg-slate-300 border-2 border-black p-2 flex justify-between items-center mb-2">
        <span className="font-black text-xs">COD</span>
        <div className="text-right">
          <span className="text-2xl font-black">{item.cod}</span>
          <span className="block text-[8px] font-black uppercase text-slate-700 -mt-1">MMK</span>
        </div>
      </div>
    </div>
  );

  if (size === "4x3_dual" && Array.isArray(data) && data.length >= 2) {
    return (
      <div className={getContainerClass()}>
        <SingleWaybill item={data[0]} isHalf={true} />
        <div className="w-full border-t-2 border-dashed border-slate-400 relative">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[6px] font-black text-slate-400 tracking-[0.2em]">CUT HERE</span>
        </div>
        <SingleWaybill item={data[1]} isHalf={true} />
      </div>
    );
  }

  const itemData = Array.isArray(data) ? data[0] : data;
  return <div className={getContainerClass()}><SingleWaybill item={itemData} /></div>;
};

export default function EnterpriseAdminDashboard() {
  const { t } = useLanguage ? useLanguage() : { t: (en) => en };
  const [loading, setLoading] = useState(true);
  const sigPad = useRef(null);
  const [printSize, setPrintSize] = useState('4x6');

  const mockWaybills = [
    { waybillId: "YGN119874YGN", merchantName: "Mee Lay", merchantPhone: "09796491867", recipientName: "ဖြိုးမြတ်မွန်ကျော်", recipientPhone: "09792970776", origin: "မန္တလေး", destination: "အောင်မင်္ဂလာ", cod: "25000" },
    { waybillId: "YGN119875MDY", merchantName: "Mee Lay", merchantPhone: "09796491867", recipientName: "ဦးအောင်အောင်", recipientPhone: "095555555", origin: "ရန်ကုန်", destination: "မန္တလေး", cod: "53000" }
  ];

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const handleAction = () => toast.success("Secure Action Executed.");

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto text-white">
      <div className="relative group acrylic-sheet acrylic-indigo rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="p-6 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 relative z-10">
           <ShieldCheck className="h-10 w-10 text-indigo-400" />
        </div>
        <div className="flex-1 relative z-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white">Enterprise Admin</h2>
          <div className="text-indigo-400 text-[10px] mt-4 flex items-center gap-4 font-bold uppercase tracking-widest">
             <Database size={14} /> LIVE NODE ACTIVE
          </div>
        </div>
      </div>

      <div className="acrylic-sheet rounded-[3rem] bg-slate-900/90 border-white/20 p-10 min-h-[500px] flex flex-col items-center justify-center">
         {loading ? (
            <div className="text-center space-y-4">
               <Activity size={48} className="text-indigo-500/50 animate-bounce mx-auto" />
               <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Establishing Secure Link...</p>
            </div>
         ) : (
            <div className="text-center w-full max-w-2xl space-y-8">
               
               {'DASH' === 'BULK' && (
                 <div className="space-y-6">
                   <UploadCloud size={64} className="mx-auto text-indigo-400/50" />
                   <p className="font-bold text-slate-300">Drag and drop Excel (.xlsx) file here</p>
                   <input type="file" className="block w-full text-slate-400 file:py-3 file:px-6 file:rounded-xl file:bg-indigo-600 file:text-white cursor-pointer bg-white/5 rounded-xl border border-white/10" />
                 </div>
               )}

               {('DASH' === 'SCAN' || 'DASH' === 'OCR') && (
                 <div className="space-y-6">
                   <ScanLine size={64} className="mx-auto text-indigo-400/50" />
                   <div className="aspect-video bg-black rounded-2xl border border-white/20 relative overflow-hidden flex items-center justify-center">
                     <div className="h-1 w-full bg-indigo-500/50 absolute top-0 animate-[scan-line_3s_linear_infinite]" />
                     <p className="text-xs uppercase text-slate-600 font-black tracking-widest">Awaiting Peripheral Feed</p>
                   </div>
                 </div>
               )}

               {('DASH' === 'POD' || 'DASH' === 'SIGN') && (
                 <div className="w-full space-y-4">
                   <div className="bg-white rounded-2xl border-4 border-slate-700 h-64 w-full overflow-hidden">
                      <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ className: 'w-full h-full cursor-crosshair' }} />
                   </div>
                   <div className="flex gap-4">
                     <button onClick={() => sigPad.current?.clear()} className="px-6 py-3 bg-white/10 rounded-xl font-black text-white">CLEAR</button>
                     <button onClick={handleAction} className="flex-1 py-3 bg-indigo-600 rounded-xl font-black uppercase text-white">SUBMIT E-POD</button>
                   </div>
                 </div>
               )}

               {'DASH' === 'PRINT' && (
                 <div className="w-full space-y-6">
                   <div className="flex gap-4 justify-center">
                      <select value={printSize} onChange={(e) => setPrintSize(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                        <option value="4x6">4" x 6" Thermal</option>
                        <option value="4x3_dual">4" x 3" (Print 2 on 1)</option>
                      </select>
                      <button onClick={handleAction} className="px-8 py-3 bg-indigo-600 rounded-xl font-black text-white">PRINT BATCH</button>
                   </div>
                   <div className="bg-slate-200 p-4 rounded-xl flex items-center justify-center overflow-auto">
                      <div className="scale-[0.6] origin-top">
                        <WaybillTemplate data={printSize === '4x3_dual' ? mockWaybills : mockWaybills[0]} size={printSize} userId="SYS-USR-001" />
                      </div>
                   </div>
                 </div>
               )}

               {('DASH' === 'GRID' || 'DASH' === 'DASH') && (
                 <table className="w-full text-xs text-left">
                    <thead className="text-indigo-400/70 border-b border-white/10"><tr><th className="pb-2">ID</th><th className="pb-2">Status</th><th className="pb-2">Update</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {[1,2,3].map(i => (
                        <tr key={i}><td className="py-4 font-mono">BRT-LOG-{i}89</td><td className="py-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">SYNCED</span></td><td className="py-4 text-slate-500">Live</td></tr>
                      ))}
                    </tbody>
                 </table>
               )}

               {('DASH' === 'MAP') && (
                 <div className="aspect-video bg-slate-900/90 rounded-3xl flex items-center justify-center border border-white/10">
                   <Map size={64} className="text-indigo-400/50 animate-pulse" />
                 </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
}
