import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Loader2,
  Lock,
  ArrowLeft,
} from "lucide-react";

/**
 * PREVIEW ENVIRONMENT MOCKS
 * These mocks resolve path alias errors in the Canvas environment.
 * In your production build, these will be replaced by your project's actual imports.
 */

// Mocking Language Context
const useLanguage = () => ({
  lang: "en",
  t: (en: string, my: string) => en,
  toggleLang: () => console.log("Language toggle triggered")
});

// Mocking Supabase Client
const SUPABASE_CONFIGURED = true;
const supabase = {
  auth: {
    exchangeCodeForSession: async (code: string) => ({ error: null }),
    updateUser: async (data: any) => {
      console.log("Supabase Mock: Updating User", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { error: null };
    },
    getUser: async () => ({ data: { user: { id: "mock-user-123" } } })
  },
  from: (table: string) => ({
    update: (data: any) => ({
      eq: (field: string, val: any) => ({ error: null })
    })
  })
};

// Mocking UI Components for Preview Stability
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);
const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-8 ${className}`}>{children}</div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className={`w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-semibold text-white outline-none focus:border-rose-500/50 transition-all placeholder:text-slate-500 ${props.className}`} 
  />
);
const Button = ({ children, disabled, className, ...props }: any) => (
  <button 
    {...props} 
    disabled={disabled}
    className={`flex items-center justify-center gap-2 rounded-2xl font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

// Helper to convert unknown errors into readable text
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

export function ForcePasswordReset() {
  const nav = useNavigate();
  const { lang, t, toggleLang } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);

  const [pw, setPw] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!SUPABASE_CONFIGURED) {
        setLoading(false);
        return;
      }
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
        setLoading(false);
      } catch (error: unknown) {
        setErrorMsg(t("Invalid recovery link.", "Recovery link မမှန်ပါ။"));
        setLoading(false);
      }
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (pw !== pw2) {
      setErrorMsg(t("Passwords do not match.", "စကားဝှက်များ မကိုက်ညီပါ။"));
      return;
    }

    if (pw.length < 8) {
      setErrorMsg(t("Minimum 8 characters required.", "အနည်းဆုံး ၈ လုံး ရှိရပါမည်။"));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;

      // Update local profile flag if needed
      await supabase.from("profiles").update({ requires_password_change: false }).eq("id", "mock-user-123");

      setSuccessMsg(t("Security updated. Redirecting...", "ပြင်ဆင်ပြီးပါပြီ..."));
      setTimeout(() => nav("/login", { replace: true }), 1500);
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Cinematic Background Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 min-w-full min-h-full object-cover z-0 opacity-40"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-rose-950/30 backdrop-blur-[2px] z-10" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          onClick={toggleLang}
          className="bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 rounded-full px-4 py-2 backdrop-blur-md"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            {lang === "en" ? "MY" : "EN"}
          </span>
        </Button>
      </div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Brand Identity */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-[0_0_60px_rgba(255,255,255,0.15)] ring-1 ring-white/20 transform transition-transform hover:scale-105">
              <img src="/logo.png" alt="Britium Logo" className="h-16 w-auto object-contain" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-rose-400">
              {t("Update Required", "ပြင်ဆင်ရန်လိုအပ်သည်")}
            </h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              {t("Mandatory Security Rotation", "လုံခြုံရေးအရ မဖြစ်မနေပြောင်းရပါမည်")}
            </p>
          </div>

          <Card>
            <div className="h-1.5 w-full bg-rose-600/50" />
            <CardContent className="space-y-6">
              {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-300 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{errorMsg}</p>
                </div>
              )}

              {successMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{successMsg}</p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {t("Securing Session...", "ပြင်ဆင်နေသည်...")}
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
                    <Input
                      type="password"
                      required
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      className="pl-12 h-14"
                      placeholder={t("New Security Key", "စကားဝှက်အသစ်")}
                    />
                  </div>

                  <div className="relative group">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-rose-400 transition-colors" />
                    <Input
                      type="password"
                      required
                      value={pw2}
                      onChange={(e) => setPw2(e.target.value)}
                      className="pl-12 h-14"
                      placeholder={t("Confirm Key", "အတည်ပြုပါ")}
                    />
                  </div>

                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full h-14 bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-900/20"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      t("Update & Continue", "ပြင်ဆင်ပြီး ရှေ့ဆက်မည်")
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <button 
              onClick={() => nav("/login")}
              className="inline-flex items-center text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest gap-2"
            >
              <ArrowLeft className="h-3 w-3" />
              {t("Back to Login", "Login သို့ပြန်")}
            </button>
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
    
      <ForcePasswordReset />
    
  );
}