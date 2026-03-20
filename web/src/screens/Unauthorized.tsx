import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Globe } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0A0F1C] text-slate-100 px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0D121F]/90 backdrop-blur-2xl p-10 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.35em] uppercase text-rose-300/80">
              Access Control
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Unauthorized
            </h1>
          </div>
        </div>

        <p className="text-slate-300 leading-7 mb-8">
          Your account does not have permission to access this route or portal.
          Please return to your assigned workspace or contact an administrator.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-white/80 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={() => navigate('/portal-home')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-black text-[#05070A] transition hover:bg-emerald-500"
          >
            <Home size={16} />
            Portal Home
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-bold text-white/80 transition hover:bg-white/10"
          >
            <Globe size={16} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
