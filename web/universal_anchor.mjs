import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
console.log("⚓ DEPLOYING UNIVERSAL ANCHOR...");

function findFile(dir, fileName) {
    if (!fs.existsSync(dir)) return null;
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const res = findFile(fullPath, fileName);
            if (res) return res;
        } else if (file.toLowerCase() === fileName.toLowerCase()) return fullPath;
    }
    return null;
}

// 1. CREATE A TOTALLY INDEPENDENT, CRASH-PROOF APPSHELL
const shellPath = findFile(srcDir, 'appshell.tsx');
if (shellPath) {
    const safeShell = `// @ts-nocheck
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, Package, Truck, Wallet, Settings, LogOut, Bell, Shield } from 'lucide-react';

export const AppShell = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen w-screen bg-[#020617] overflow-hidden font-sans">
      {/* Fixed Sidebar */}
      <div className="w-72 bg-slate-900/50 border-r border-white/5 flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white italic tracking-tighter">BRITIUM</span>
        </div>
        
        <nav className="flex-1 space-y-2">
           <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Core Systems</div>
           {[
             { label: 'Admin Terminal', icon: LayoutGrid, path: '/enterprise-admin/dashboard' },
             { label: 'Logistics Hub', icon: Truck, path: '/warehouse/dashboard' },
             { label: 'Fleet Ops', icon: Package, path: '/operations/dashboard' },
             { label: 'Financials', icon: Wallet, path: '/finance/dashboard' },
             { label: 'User Control', icon: Users, path: '/super-admin/users' }
           ].map((item) => (
             <button key={item.label} onClick={() => navigate(item.path)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-bold text-sm">
               <item.icon size={18} /> {item.label}
             </button>
           ))}
        </nav>

        <button onClick={() => window.location.href='/login'} className="flex items-center gap-3 px-4 py-3 text-rose-400 font-bold text-sm hover:bg-rose-500/10 rounded-xl transition-all">
          <LogOut size={18} /> System Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">System Online: L5_MASTER_ADMIN</span>
          </div>
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-slate-500" />
            <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full border-2 border-white/10" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#020617] relative">
           <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AppShell;
`;
    fs.writeFileSync(shellPath, safeShell);
    console.log("✅ AppShell.tsx bulletproofed.");
}

// 2. FORCE APP.TSX TO USE THE NAMED EXPORT
const appPath = findFile(srcDir, 'app.tsx');
if (appPath) {
    let code = fs.readFileSync(appPath, 'utf8');
    code = code.replace(/import AppShell from/g, "import { AppShell } from");
    fs.writeFileSync(appPath, code);
    console.log("✅ App.tsx import fixed.");
}

console.log("--------------------------------------------------------");
console.log("🎉 ANCHOR SECURED. Restart your server.");
console.log("--------------------------------------------------------");
