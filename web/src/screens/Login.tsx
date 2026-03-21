import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Loader2, 
  Download, 
  UserPlus, 
  KeyRound, 
  ChevronRight, 
  ShieldCheck, 
  Globe 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import toast from "react-hot-toast";

/**
 * BRITIUM EXPRESS ENTERPRISE CONTROL TOWER - LOGIN
 * * FIX: "cannot unmarshal object into type string" error ကို ဖြေရှင်းရန်
 * email နှင့် password တို့ကို string စစ်စစ်ဖြစ်အောင် သေချာစွာ sanitized လုပ်ပြီးမှ
 * Supabase Auth သို့ ပို့ဆောင်ပေးထားပါသည်။
 */

export default function Login() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // email နှင့် password သည် string စစ်စစ်ဖြစ်ကြောင်း သေချာစေရန် String() constructor ကို သုံးထားသည်
    // ဤသို့ပြုလုပ်ခြင်းဖြင့် Supabase backend တွင် JSON parsing error မတက်အောင် ကာကွယ်ပေးသည်
    const sanitizedEmail = String(email).trim();
    const sanitizedPassword = String(password);

    if (!sanitizedEmail || !sanitizedPassword) {
      setErrorMsg(t("Please enter both email and password.", "ကျေးဇူးပြု၍ အီးမေးလ်နှင့် စကားဝှက် နှစ်ခုလုံးကို ထည့်သွင်းပါ။"));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.user) {
        toast.success(t("Access Authorized", "ဝင်ရောက်ခွင့် ပြုလိုက်ပါပြီ"));
        navigate("/portal-home");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans antialiased overflow-hidden">
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-100 via-white to-indigo-50" />
      
      {/* Main UI Container */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 mx-4">
        
        {/* Left Side: Brand & Hero Panel */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-slate-900 p-16 text-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative z-10">
            <div className="mb-12 inline-flex items-center rounded-full bg-white/10 px-4 py-2 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Enterprise Delivery Platform</span>
            </div>
            
            <h1 className="text-5xl font-black leading-tight tracking-tighter mb-8">
              Britium Express <br />
              <span className="text-indigo-400">Enterprise Control Tower</span>
            </h1>
            
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Premium multi-portal delivery operations for warehouse, dispatch, riders, branch offices, customer support, finance, and enterprise governance.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <FeatureItem 
              title="End-to-end scan control" 
              desc="Mandatory QR checkpoints from picking to final Delivery." 
            />
            <FeatureItem 
              title="Premium operations visibility" 
              desc="Role-based portal entry for governance and reporting." 
            />
            <FeatureItem 
              title="Bilingual workflow platform" 
              desc="Myanmar and English experience with structured status visibility." 
            />
          </div>

          <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/10 pt-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white">Britium Express</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Fast. Controlled. Auditable.</p>
            </div>
            <Globe size={20} className="text-slate-600" />
          </div>
        </div>

        {/* Right Side: Login Form Panel */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2 block">Sign In</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">Access your assigned portal securely and continue daily operations.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email"
                  required
                  placeholder="md@britiumexpress.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                  value={email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5"
                  value={password}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <ShieldCheck className="text-rose-600 shrink-0 mt-0.5" size={18} />
                <p className="text-xs font-bold text-rose-700 leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group flex items-center justify-center rounded-2xl bg-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                <UserPlus size={14} /> Sign Up
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                <KeyRound size={14} /> Forgot Password
              </button>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={14} /> Download APK Guide
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Need public tracking?</span>
            <button className="text-indigo-600 hover:text-indigo-800">Open Tracking</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-3xl bg-white/5 border border-white/5 p-6 transition-all hover:bg-white/10 hover:border-white/10">
      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}