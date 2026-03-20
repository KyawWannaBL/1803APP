import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  Loader2, 
  Lock, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

/**
 * PREVIEW ENVIRONMENT MOCKS
 * These mocks resolve the "Could not resolve" errors in the Canvas environment.
 * In your local project, these will be replaced by your actual imports from:
 * - @/contexts/LanguageContext
 * - @/lib/supabase
 * - @/components/ui/*
 */

// Mocking @/contexts/LanguageContext
const useLanguage = () => ({
  lang: "en",
  setLanguage: (l: string) => console.log("Language set to:", l),
  toggleLang: () => console.log("Toggle language"),
});

// Mocking @/lib/supabase
const SUPABASE_CONFIGURED = true;
const supabase = {
  auth: {
    exchangeCodeForSession: async (code: string) => {
      console.log("Mock exchangeCodeForSession:", code);
      return { error: null };
    },
    setSession: async (session: any) => ({ error: null }),
    updateUser: async (data: any) => {
      console.log("Mock updateUser:", data);
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

// Inline UI Components to replace @/components/ui/* for the preview
const Card = ({ children, className }: any) => (
  <div className={`rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl overflow-hidden ${className}`}>
    {children}
  </div>
);
const CardContent = ({ children, className }: any) => <div className={`p-7 ${className}`}>{children}</div>;
const CardHeader = ({ children }: any) => <div className="p-6 pb-0">{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>;
const Input = ({ className, ...props }: any) => (
  <input 
    {...props} 
    className={`w-full bg-black/40 border border-white/10 text-white h-12 rounded-xl px-4 outline-none focus:border-indigo-500/50 transition-all ${className}`} 
  />
);
const Button = ({ children, className, disabled, ...props }: any) => (
  <button 
    {...props} 
    disabled={disabled}
    className={`flex items-center justify-center gap-2 rounded-xl font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

// --- Helper Functions ---
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

// --- Main Component ---
export function ResetPassword() {
  const nav = useNavigate();
  const { lang, setLanguage, toggleLang } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>(lang || "en");
  
  const t = (en: string, my: string): string => (currentLang === "en" ? en : my);

  const [configMissing, setConfigMissing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [pw, setPw] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (!SUPABASE_CONFIGURED) {
        setLoading(false);
        setConfigMissing(true);
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
        setErrorMsg(t("Invalid or expired recovery link.", "Recovery link မမှန် သို့မဟုတ် သက်တမ်းကုန်နေပါသည်။"));
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
      setErrorMsg(t("Password must be at least 8 characters.", "စကားဝှက်သည် အနည်းဆုံး ၈ လုံး ဖြစ်ရမည်။"));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;

      setSuccessMsg(t("Password updated. Redirecting to login...", "စကားဝှက် ပြောင်းပြီးပါပြီ။ Login သို့ ပြန်သွားနေသည်..."));
      setTimeout(() => nav("/", { replace: true }), 2000);
    } catch (error: unknown) {
      setErrorMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Cinematic Background Layer */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-40 z-0">
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-indigo-950/40 backdrop-blur-[2px] z-10" />

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <Button 
          onClick={() => setCurrentLang(currentLang === "en" ? "my" : "en")} 
          className="bg-white/5 border border-white/10 text-slate-200 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/10"
        >
          <Globe className="h-4 w-4" />
          <span className="text-[10px] font-black tracking-widest uppercase">{currentLang === "en" ? "MY" : "EN"}</span>
        </Button>
      </div>

      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center space-y-4 mb-10">
            <div className="mx-auto h-20 w-20 rounded-[1.5rem] bg-white p-4 shadow-2xl transform transition-all hover:scale-105">
              <img src="/logo.png" alt="Britium Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase sm:text-5xl">
                Britium <span className="text-indigo-400 italic font-light">Express</span>
              </h1>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
                Security Protocol L5
              </p>
            </div>

            <button 
              className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest gap-2" 
              onClick={() => nav("/")}
            >
              <ArrowLeft className="h-3 w-3" />
              {t("Back to Login", "Login သို့ပြန်")}
            </button>
          </div>

          {configMissing ? (
            <Card className="ring-1 ring-rose-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-400">
                  <AlertCircle className="h-5 w-5" />
                  {t("Configuration Required", "Config လိုအပ်သည်")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Supabase environment variables are missing. Please ensure your production environment has the correct keys configured.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600" />
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-black text-white uppercase tracking-wider">{t("Reset Password", "စကားဝှက် ပြန်သတ်မှတ်")}</h2>
                  <p className="text-xs text-slate-400 mt-1">Initialize your new access key</p>
                </div>

                {errorMsg && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold leading-relaxed">{errorMsg}</p>
                  </div>
                )}

                {successMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold leading-relaxed">{successMsg}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {t("Securing Session...", "ပြင်ဆင်နေသည်...")}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-5">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <Input
                        type="password"
                        required
                        value={pw}
                        onChange={(e: any) => setPw(e.target.value)}
                        className="pl-12 h-14"
                        placeholder={t("New Access Key", "စကားဝှက်အသစ်")}
                      />
                    </div>

                    <div className="relative group">
                      <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <Input
                        type="password"
                        required
                        value={pw2}
                        onChange={(e: any) => setPw2(e.target.value)}
                        className="pl-12 h-14"
                        placeholder={t("Confirm Key", "စကားဝှက် အတည်ပြု")}
                      />
                    </div>

                    <Button 
                      disabled={loading} 
                      type="submit" 
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/20"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        t("Update Security", "စကားဝှက် ပြောင်းမည်")
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-12 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">
              © 2024 Britium Express &bull; Encrypted Portal
            </p>
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
    
      <ResetPassword />
    
  );
}