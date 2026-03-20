import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Loader2,
  Fingerprint,
  Download,
  UserPlus,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * PREVIEW ENVIRONMENT MOCKS
 * These mocks resolve the "Could not resolve" errors in the Canvas environment.
 * In your local project, these will be replaced by your actual imports.
 */

// Mocking @/contexts/LanguageContext
const useLanguage = () => ({
  lang: "en",
  setLang: (l: string) => console.log("Language changed to:", l),
  t: (en: string, my: string) => en
});

// Mocking @/lib/supabase
const supabase = {
  auth: {
    signInWithPassword: async (creds: any) => ({ data: { user: { id: "123" } }, error: null }),
    signOut: async () => {},
    updateUser: async (data: any) => ({ error: null }),
    getUser: async () => ({ data: { user: { id: "123" } } })
  },
  from: (table: string) => ({
    select: () => ({ eq: () => ({ single: () => ({ data: { role: "ADMIN", requires_password_change: false }, error: null }) }) }),
    update: () => ({ eq: () => ({ error: null }) }),
    upsert: () => ({ error: null })
  })
};

// Mocking @/lib/portalRouting
const resolvePortalPath = (role: string) => "/portal-home";

// Mocking Capacitor Plugins
const NativeBiometric = {
  isAvailable: async () => ({ isAvailable: true }),
  verifyIdentity: async () => {}
};
const Preferences = {
  set: async (data: any) => {},
  get: async (data: any) => ({ value: null })
};

type ViewState = "login" | "force_change";

// Main Login Component
export function Login() {
  const navigate = useNavigate();
  const langCtx = useLanguage();
  const lang = langCtx.lang ?? "en";
  const setLang = langCtx.setLang;

  const [view, setView] = useState<ViewState>("login");
  const [loading, setLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [tempRole, setTempRole] = useState("");

  const t = (en: string, my: string) => (lang === "en" ? en : my);
  const forceChangeExemptRoles = useMemo(() => ["SUPER_ADMIN", "SYS", "APP_OWNER"], []);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const { isAvailable } = await NativeBiometric.isAvailable();
        setIsBiometricAvailable(Boolean(isAvailable));
      } catch {
        setIsBiometricAvailable(false);
      }
    };
    checkBiometrics();
  }, []);

  const routeUser = (role: string) => {
    const destination = resolvePortalPath(role);
    if (destination) {
      navigate(destination);
      return;
    }
    toast.error(t("Access Denied", "ဝင်ရောက်ခွင့်မရှိပါ"));
    void supabase.auth.signOut();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (authData?.user) {
        const client = supabase as any;
        const { data: profile, error: profileError }: any = await client
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError) throw profileError;
        const role = String(profile?.role || "");
        setTempUserId(authData.user.id);
        setTempRole(role);
        if (profile?.requires_password_change && !forceChangeExemptRoles.includes(role.toUpperCase())) {
          setView("force_change");
        } else {
          await Preferences.set({ key: "secure_email", value: email });
          await Preferences.set({ key: "secure_password", value: password });
          routeUser(role);
        }
      }
    } catch (error: any) {
      toast.error(error?.message || t("Login Failed", "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans antialiased text-slate-900">
      {/* Cinematic Background Layer */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="fixed top-0 left-0 min-w-full min-h-full object-cover z-0 opacity-50"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950/95 via-slate-900/70 to-indigo-950/50 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Brand Identity */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-[0_0_60px_rgba(255,255,255,0.15)] ring-1 ring-white/20 transform transition-all hover:scale-105">
              <img src="/logo.png" alt="Britium Logo" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
              Britium <span className="text-indigo-400 italic font-light">Express</span>
            </h1>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
              Enterprise Control Gateway
            </p>
          </div>

          {/* Login Container (Glassmorphism) */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl lg:p-10 ring-1 ring-white/5">
            {view === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">System Authorization</h2>
                  <p className="text-xs text-slate-400 mt-1">Please enter your verified credentials</p>
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      placeholder={t("IDENTITY EMAIL", "အီးမေးလ်")}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-semibold text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-white/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="password"
                      required
                      placeholder={t("ACCESS KEY", "စကားဝှက်")}
                      className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-semibold text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-white/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : t("Authorize Access", "ဝင်ရောက်မည်")}
                  </button>

                  {isBiometricAvailable && (
                    <button
                      type="button"
                      className="flex w-16 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 transition-all hover:bg-emerald-600/30 active:scale-95"
                    >
                      <Fingerprint size={24} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button type="button" onClick={() => navigate("/signup")} className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-colors hover:bg-white/10">
                    <UserPlus size={14} /> {t("Sign Up", "အကောင့်ဖွင့်ရန်")}
                  </button>
                  <button type="button" onClick={() => navigate("/forgot-password")} className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 py-3 text-[10px] font-bold uppercase tracking-wider text-amber-400 transition-colors hover:bg-amber-500/20">
                    <KeyRound size={14} /> {t("Forgot", "စကားဝှက်မေ့")}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black uppercase tracking-wider text-rose-400">Security Update</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">Account rotation policy requires a new security key.</p>
                </div>
                <input
                  type="password"
                  required
                  placeholder="NEW ACCESS KEY"
                  className="w-full rounded-2xl border border-rose-500/20 bg-rose-500/5 px-5 py-4 text-sm font-semibold text-white outline-none focus:border-rose-500/50"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" onClick={() => setView("login")} className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <button onClick={() => setLang(lang === "en" ? "my" : "en")} className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              <Globe size={14} /> <span>{lang === "en" ? "Myanmar" : "English"}</span>
            </button>
            <div className="flex items-center space-x-6">
              <a href="/app-debug.apk" download className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400 transition-colors">
                <Download size={14} /> <span>APK</span>
              </a>
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">v2.4.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PREVIEW WRAPPER
 * This ensures the component has the necessary Router context during Canvas preview.
 */
export default function App() {
  return (
    
      <Login />
    
  );
}