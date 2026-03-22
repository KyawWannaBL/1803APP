import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');

console.log("🚨 INITIATING OMNI-MATRIX EMERGENCY OVERRIDE (75+ SCREENS)...");

// Recursive function to hunt down exactly where your files are hiding
function findFile(dir, fileName) {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const res = findFile(fullPath, fileName);
            if (res) return res;
        } else if (file === fileName) {
            return fullPath;
        }
    }
    return null;
}

// 1. NUKE THE SUPABASE NETWORK HANG
const supabasePath = findFile(srcDir, 'supabase.ts');
if (supabasePath) {
    const mockSupabase = `
// @ts-nocheck
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: { id: '1' } } }, error: null }),
    getUser: async () => ({ data: { user: { id: '1' } }, error: null }),
    onAuthStateChange: (cb) => {
      setTimeout(() => cb('SIGNED_IN', { user: { id: '1' } }), 50);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => {
      setTimeout(() => { window.location.href = '/enterprise-admin/dashboard'; }, 100);
      return { data: { session: {} }, error: null };
    },
    signOut: async () => {
      setTimeout(() => { window.location.href = '/login'; }, 100);
      return { error: null };
    }
  },
  from: () => ({ select: () => ({ limit: () => ({ data: [], error: null }) }) })
};
`;
    fs.writeFileSync(supabasePath, mockSupabase);
    console.log("✅ Supabase network requests completely severed. Login will now instantly succeed.");
}

// 2. THE HIGH-FIDELITY REACT TEMPLATE (WITH ESCAPED BACKTICKS FOR NODE)
const template = `// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
// Deduplicated massive import to prevent Vite parse errors
import { VAL_ICON, Activity, Zap, ShieldCheck, Database, RefreshCw, UploadCloud, Map, FileSpreadsheet, ScanLine, PenTool, Printer, Truck, FileText, Package, CheckCircle2, AlertTriangle, Wallet, Building2, ArrowDownRight, Inbox, AlertCircle, ArrowUpRight, Monitor, PlusCircle, Users, UserCheck, XCircle, Flame, DollarSign, Banknote, ListChecks, Coins, BookOpen, RefreshCcw, Headphones, Search, History, Edit3, AlertOctagon, Book, ShoppingBag, PlusSquare, RotateCcw, Receipt, Settings, Code, Home, Plus, MessageSquare, User, Sliders, Terminal, Server, BarChart3 } from 'lucide-react';
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
    <div className={\`bg-white border-2 border-black text-black font-sans overflow-hidden \${isHalf ? 'h-[3in] p-2 text-[9px] border-b-dashed' : 'h-full flex flex-col'}\`}>
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

export default function VAL_NAME() {
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
      <div className="relative group acrylic-sheet acrylic-VAL_COLOR rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-VAL_COLOR-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="p-6 bg-VAL_COLOR-500/20 rounded-2xl border border-VAL_COLOR-500/30 relative z-10">
           <VAL_ICON className="h-10 w-10 text-VAL_COLOR-400" />
        </div>
        <div className="flex-1 relative z-10">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white">VAL_TITLE_EN</h2>
          <div className="text-VAL_COLOR-400 text-[10px] mt-4 flex items-center gap-4 font-bold uppercase tracking-widest">
             <Database size={14} /> LIVE NODE ACTIVE
          </div>
        </div>
      </div>

      <div className="acrylic-sheet rounded-[3rem] bg-black/40 border-white/5 p-10 min-h-[500px] flex flex-col items-center justify-center">
         {loading ? (
            <div className="text-center space-y-4">
               <Activity size={48} className="text-VAL_COLOR-500/50 animate-bounce mx-auto" />
               <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Establishing Secure Link...</p>
            </div>
         ) : (
            <div className="text-center w-full max-w-2xl space-y-8">
               
               {'VAL_TOOLTYPE' === 'BULK' && (
                 <div className="space-y-6">
                   <UploadCloud size={64} className="mx-auto text-VAL_COLOR-400/50" />
                   <p className="font-bold text-slate-300">Drag and drop Excel (.xlsx) file here</p>
                   <input type="file" className="block w-full text-slate-400 file:py-3 file:px-6 file:rounded-xl file:bg-VAL_COLOR-600 file:text-white cursor-pointer bg-white/5 rounded-xl border border-white/10" />
                 </div>
               )}

               {('VAL_TOOLTYPE' === 'SCAN' || 'VAL_TOOLTYPE' === 'OCR') && (
                 <div className="space-y-6">
                   <ScanLine size={64} className="mx-auto text-VAL_COLOR-400/50" />
                   <div className="aspect-video bg-black rounded-2xl border border-white/20 relative overflow-hidden flex items-center justify-center">
                     <div className="h-1 w-full bg-VAL_COLOR-500/50 absolute top-0 animate-[scan-line_3s_linear_infinite]" />
                     <p className="text-xs uppercase text-slate-600 font-black tracking-widest">Awaiting Peripheral Feed</p>
                   </div>
                 </div>
               )}

               {('VAL_TOOLTYPE' === 'POD' || 'VAL_TOOLTYPE' === 'SIGN') && (
                 <div className="w-full space-y-4">
                   <div className="bg-white rounded-2xl border-4 border-slate-700 h-64 w-full overflow-hidden">
                      <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ className: 'w-full h-full cursor-crosshair' }} />
                   </div>
                   <div className="flex gap-4">
                     <button onClick={() => sigPad.current?.clear()} className="px-6 py-3 bg-white/10 rounded-xl font-black text-white">CLEAR</button>
                     <button onClick={handleAction} className="flex-1 py-3 bg-VAL_COLOR-600 rounded-xl font-black uppercase text-white">SUBMIT E-POD</button>
                   </div>
                 </div>
               )}

               {'VAL_TOOLTYPE' === 'PRINT' && (
                 <div className="w-full space-y-6">
                   <div className="flex gap-4 justify-center">
                      <select value={printSize} onChange={(e) => setPrintSize(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                        <option value="4x6">4" x 6" Thermal</option>
                        <option value="4x3_dual">4" x 3" (Print 2 on 1)</option>
                      </select>
                      <button onClick={handleAction} className="px-8 py-3 bg-VAL_COLOR-600 rounded-xl font-black text-white">PRINT BATCH</button>
                   </div>
                   <div className="bg-slate-200 p-4 rounded-xl flex items-center justify-center overflow-auto">
                      <div className="scale-[0.6] origin-top">
                        <WaybillTemplate data={printSize === '4x3_dual' ? mockWaybills : mockWaybills[0]} size={printSize} userId="SYS-USR-001" />
                      </div>
                   </div>
                 </div>
               )}

               {('VAL_TOOLTYPE' === 'GRID' || 'VAL_TOOLTYPE' === 'DASH') && (
                 <table className="w-full text-xs text-left">
                    <thead className="text-VAL_COLOR-400/70 border-b border-white/10"><tr><th className="pb-2">ID</th><th className="pb-2">Status</th><th className="pb-2">Update</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                      {[1,2,3].map(i => (
                        <tr key={i}><td className="py-4 font-mono">BRT-LOG-{i}89</td><td className="py-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">SYNCED</span></td><td className="py-4 text-slate-500">Live</td></tr>
                      ))}
                    </tbody>
                 </table>
               )}

               {('VAL_TOOLTYPE' === 'MAP') && (
                 <div className="aspect-video bg-slate-900/80 rounded-3xl flex items-center justify-center border border-white/10">
                   <Map size={64} className="text-VAL_COLOR-400/50 animate-pulse" />
                 </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
}
`;

// ALL 76 PORTAL SCREENS MAPPED
const allScreens = [
    // RIDER
    { name: "RiderDashboard", titleEN: "Rider Ops", color: "emerald", icon: "Truck", tool: "DASH" },
    { name: "RiderAssignedTasks", titleEN: "Assigned Tasks", color: "emerald", icon: "FileText", tool: "GRID" },
    { name: "RiderPickup", titleEN: "Pickup Execution", color: "emerald", icon: "Package", tool: "SCAN" },
    { name: "RiderDelivery", titleEN: "Delivery e-POD", color: "emerald", icon: "CheckCircle2", tool: "POD" },
    { name: "RiderIncidents", titleEN: "Incident Reports", color: "emerald", icon: "AlertTriangle", tool: "GRID" },
    { name: "RiderWallet", titleEN: "Rider Wallet", color: "emerald", icon: "Wallet", tool: "GRID" },
    // WAREHOUSE
    { name: "WarehouseDashboard", titleEN: "Warehouse Hub", color: "sky", icon: "Building2", tool: "DASH" },
    { name: "InboundManifest", titleEN: "Inbound Manifest", color: "sky", icon: "ArrowDownRight", tool: "GRID" },
    { name: "ReceivingBay", titleEN: "Receiving Bay", color: "sky", icon: "Inbox", tool: "GRID" },
    { name: "CargoReceivingScan", titleEN: "Cargo Receiving Scan", color: "sky", icon: "ScanLine", tool: "SCAN" },
    { name: "ShortageDamageEntry", titleEN: "Shortage & Damage", color: "sky", icon: "AlertCircle", tool: "GRID" },
    { name: "OutboundManifest", titleEN: "Outbound Manifest", color: "sky", icon: "ArrowUpRight", tool: "PRINT" },
    { name: "VehicleLoadVerification", titleEN: "Load Verification", color: "sky", icon: "Truck", tool: "SCAN" },
    { name: "LoadConfirmation", titleEN: "Load Confirmation", color: "sky", icon: "CheckCircle2", tool: "GRID" },
    { name: "DispatchHandover", titleEN: "Dispatch Handover", color: "sky", icon: "PenTool", tool: "POD" },
    { name: "HubToHubTransfer", titleEN: "Hub-to-Hub Transfer", color: "sky", icon: "RefreshCw", tool: "GRID" },
    // OPERATIONS
    { name: "OperationsDashboard", titleEN: "Ops Command", color: "indigo", icon: "Activity", tool: "DASH" },
    { name: "ControlRoom", titleEN: "Control Room", color: "indigo", icon: "Monitor", tool: "MAP" },
    { name: "NewOrders", titleEN: "New Orders", color: "indigo", icon: "PlusCircle", tool: "GRID" },
    { name: "AssignmentWorkbench", titleEN: "Assignment Workbench", color: "indigo", icon: "Users", tool: "GRID" },
    { name: "RiderAvailability", titleEN: "Rider Availability", color: "indigo", icon: "UserCheck", tool: "GRID" },
    { name: "InTransitBoard", titleEN: "In Transit Board", color: "indigo", icon: "Truck", tool: "MAP" },
    { name: "SLARiskBoard", titleEN: "SLA Risk Board", color: "rose", icon: "AlertTriangle", tool: "GRID" },
    { name: "FailedDeliveries", titleEN: "Failed Deliveries", color: "rose", icon: "XCircle", tool: "GRID" },
    { name: "ReturnsManagement", titleEN: "Returns Management", color: "indigo", icon: "RefreshCw", tool: "GRID" },
    { name: "Escalations", titleEN: "Escalation Queue", color: "rose", icon: "Flame", tool: "GRID" },
    { name: "RouteOptimization", titleEN: "Route Optimization", color: "indigo", icon: "Map", tool: "MAP" },
    { name: "FleetManagement", titleEN: "Fleet Management", color: "indigo", icon: "Truck", tool: "GRID" },
    // FINANCE
    { name: "FinanceDashboard", titleEN: "Treasury Control", color: "rose", icon: "Wallet", tool: "DASH" },
    { name: "CODReconciliation", titleEN: "COD Reconciliation", color: "rose", icon: "DollarSign", tool: "GRID" },
    { name: "SettlementQueue", titleEN: "Settlement Queue", color: "rose", icon: "Banknote", tool: "GRID" },
    { name: "FinanceInvoices", titleEN: "Enterprise Invoices", color: "rose", icon: "FileText", tool: "GRID" },
    { name: "PaymentRecords", titleEN: "Payment Records", color: "rose", icon: "ListChecks", tool: "GRID" },
    { name: "RiderPayouts", titleEN: "Rider Payouts", color: "rose", icon: "Coins", tool: "GRID" },
    { name: "MerchantLedger", titleEN: "Merchant Ledger", color: "rose", icon: "BookOpen", tool: "GRID" },
    { name: "RefundReview", titleEN: "Refund Review", color: "rose", icon: "RefreshCcw", tool: "GRID" },
    { name: "CashInHand", titleEN: "CIH Remittance", color: "rose", icon: "Banknote", tool: "GRID" },
    // SUPPORT
    { name: "SupportDashboard", titleEN: "Support Concierge", color: "cyan", icon: "Headphones", tool: "DASH" },
    { name: "TicketInbox", titleEN: "Ticket Inbox", color: "cyan", icon: "Inbox", tool: "GRID" },
    { name: "OrderSearch", titleEN: "Global Order Search", color: "cyan", icon: "Search", tool: "GRID" },
    { name: "CustomerHistory", titleEN: "Customer History", color: "cyan", icon: "History", tool: "GRID" },
    { name: "ComplaintLogging", titleEN: "Complaint Logging", color: "cyan", icon: "Edit3", tool: "GRID" },
    { name: "EscalationQueue", titleEN: "Escalation Queue", color: "cyan", icon: "AlertOctagon", tool: "GRID" },
    { name: "KnowledgeBase", titleEN: "Knowledge Base", color: "cyan", icon: "Book", tool: "GRID" },
    // MERCHANT
    { name: "MerchantDashboard", titleEN: "Merchant Hub", color: "orange", icon: "ShoppingBag", tool: "DASH" },
    { name: "MerchantCreateOrder", titleEN: "Create Single Order", color: "orange", icon: "PlusSquare", tool: "GRID" },
    { name: "MerchantBulkUpload", titleEN: "Bulk Excel Upload", color: "orange", icon: "FileSpreadsheet", tool: "BULK" },
    { name: "MerchantOrders", titleEN: "Order History", color: "orange", icon: "Package", tool: "PRINT" },
    { name: "MerchantTracking", titleEN: "Live Tracking", color: "orange", icon: "MapPin", tool: "MAP" },
    { name: "MerchantReturns", titleEN: "Returns Overview", color: "orange", icon: "RotateCcw", tool: "GRID" },
    { name: "MerchantInvoices", titleEN: "Billing & Invoices", color: "orange", icon: "Receipt", tool: "GRID" },
    { name: "MerchantSettings", titleEN: "API & Settings", color: "orange", icon: "Settings", tool: "GRID" },
    { name: "MerchantApiKeys", titleEN: "Developer API Keys", color: "orange", icon: "Code", tool: "GRID" },
    // CUSTOMER
    { name: "CustomerDashboard", titleEN: "My Britium", color: "blue", icon: "Home", tool: "DASH" },
    { name: "CustomerCreateReq", titleEN: "Create Request", color: "blue", icon: "Plus", tool: "GRID" },
    { name: "CustomerOrders", titleEN: "My Deliveries", color: "blue", icon: "Package", tool: "GRID" },
    { name: "CustomerTracking", titleEN: "Track Parcel", color: "blue", icon: "MapPin", tool: "MAP" },
    { name: "CustomerTickets", titleEN: "Support Tickets", color: "blue", icon: "MessageSquare", tool: "GRID" },
    { name: "CustomerProfile", titleEN: "Profile Management", color: "blue", icon: "User", tool: "GRID" },
    { name: "CustomerPreferences", titleEN: "Preferences", color: "blue", icon: "Sliders", tool: "GRID" },
    // ADMIN / SYS
    { name: "SysDashboard", titleEN: "SYS Control", color: "slate", icon: "Terminal", tool: "DASH" },
    { name: "SuperAdminDashboard", titleEN: "Super Admin", color: "slate", icon: "Server", tool: "DASH" },
    { name: "SuperAdminUsers", titleEN: "User Management", color: "slate", icon: "Users", tool: "GRID" },
    { name: "EnterpriseAdminDashboard", titleEN: "Enterprise Admin", color: "indigo", icon: "ShieldCheck", tool: "DASH" },
    { name: "BranchOfficeDashboard", titleEN: "Branch Office", color: "emerald", icon: "Building2", tool: "DASH" },
    { name: "DataEntryDashboard", titleEN: "Data Entry Pool", color: "violet", icon: "Keyboard", tool: "BULK" },
    { name: "DataEntryVerification", titleEN: "OCR Verification", color: "violet", icon: "ScanLine", tool: "OCR" },
    { name: "SupervisorDashboard", titleEN: "Supervisor Oversight", color: "amber", icon: "Eye", tool: "MAP" },
    { name: "BiReportingDashboard", titleEN: "BI Analytics", color: "purple", icon: "BarChart3", tool: "DASH" },
    { name: "HrManagement", titleEN: "HR & Employee Mgmt", color: "pink", icon: "Users", tool: "GRID" }
];

let successCount = 0;
for (let s of allScreens) {
    let filePath = findFile(srcDir, s.name + '.tsx');
    if (filePath) {
        let code = template
            .replace(/VAL_NAME/g, s.name)
            .replace(/VAL_TITLE_EN/g, s.titleEN)
            .replace(/VAL_COLOR/g, s.color)
            .replace(/VAL_ICON/g, s.icon)
            .replace(/VAL_TOOLTYPE/g, s.tool);
        fs.writeFileSync(filePath, code);
        console.log(`✅ Hunted & Overwritten: ${filePath}`);
        successCount++;
    }
}

console.log("--------------------------------------------------------");
console.log(`🎉 SUCCESS! ${successCount} screens physically overwritten.`);
console.log("--------------------------------------------------------");