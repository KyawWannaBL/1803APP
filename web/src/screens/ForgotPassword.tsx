import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

/**
 * PREVIEW ENVIRONMENT MOCKS
 * These mocks resolve the "Could not resolve" errors in the Canvas environment.
 * In your local project, these will be replaced by your actual imports from:
 * - @/contexts/LanguageContext
 * - @/lib/supabase
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
    resetPasswordForEmail: async (email: string, options: any) => {
      console.log("Mock ResetPassword call for:", email, options);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { error: null };
    }
  }
};

export function ForgotPassword() {
  const navigate = useNavigate();
  const langCtx = useLanguage();
  const lang = langCtx.lang ?? "en";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  
  const t = (en: string, my: string) => (lang === "en" ? en : my);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      toast.success(
        t(
          "Reset link sent. Please check your email.",
          "Reset link ပို့ပြီးပါပြီ။ သင့် email ကို စစ်ဆေးပါ။"
        )
      );
    } catch (error: any) {
      toast.error(
        error?.message || t("Could not send reset email.", "Reset email မပို့နိုင်ပါ။")
      );
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
        className="fixed top-0 left-0 min-w-full min-h-full object-cover z-0 opacity-40"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-950/95 via-slate-900/70 to-amber-950/30 backdrop-blur-[2px] z-10" />

      <div className="relative z-20 flex min-h-screen items-center justify-center p-6">
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
              Credential Recovery
            </p>
          </div>

          {/* Form Container (Glassmorphism) */}
          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl lg:p-10 ring-1 ring-white/5">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {t("Forgot Password", "စကားဝှက်မေ့")}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t("Secure Token Retrieval", "လုံခြုံရေး Token တောင်းဆိုမှု")}
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder={t("IDENTITY EMAIL", "အီးမေးလ်")}
                  className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-semibold text-white outline-none transition-all placeholder:text-slate-500 focus:border-amber-500/50 focus:bg-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-amber-900/20 transition-all hover:bg-amber-500 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <KeyRound size={16} />}
                {t("Send Reset Link", "Reset Link ပို့မည်")}
              </button>
            </form>

            <button
              onClick={() => navigate("/")}
              className="mt-8 flex w-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> {t("Back to Login", "အကောင့်ဝင်ရန် ပြန်သွားမည်")}
            </button>
          </div>

          {/* Utils Footer */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <Globe size={12} />
              <span>Recovery Protocol v4.2</span>
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
    
      <ForgotPassword />
    
  );
}