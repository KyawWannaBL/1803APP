import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/auth/AuthProvider';

type AuthLike = {
  user?: { id?: string; fullName?: string; role?: string } | null;
  signIn?: ((email: string, password: string) => Promise<any>) | ((args: { email: string; password: string }) => Promise<any>);
};

async function trySignIn(auth: AuthLike, email: string, password: string) {
  if (!auth?.signIn) {
    throw new Error('Auth sign-in method is not wired yet.');
  }

  try {
    return await (auth.signIn as (email: string, password: string) => Promise<any>)(email, password);
  } catch {
    return await (auth.signIn as (args: { email: string; password: string }) => Promise<any>)({ email, password });
  }
}

export function LoginPage() {
  const { t, locale } = useI18n();
  const auth = useAuth() as unknown as AuthLike;
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@britiumexpress.app');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth?.user) {
      navigate('/portal-home', { replace: true });
    }
  }, [auth?.user, navigate]);

  const highlights = useMemo(
    () => [
      {
        title: locale === 'en' ? 'End-to-end scan control' : 'End-to-end scan control',
        body:
          locale === 'en'
            ? 'Mandatory QR checkpoints from picking, warehouse receiving, dispatch loading, branch handover, rider pickup, and final POD.'
            : 'picking မှ POD အထိ QR checkpoint များကို မဖြစ်မနေ အဆင့်လိုက် ထိန်းချုပ်နိုင်ပါသည်။',
      },
      {
        title: locale === 'en' ? 'Premium operations visibility' : 'Premium operations visibility',
        body:
          locale === 'en'
            ? 'Role-based portal entry for super admin, branch office, warehouse, operations, rider, finance, support, and reporting.'
            : 'super admin မှ reporting portal အထိ role-based portal entry ဖြင့် တိုက်ရိုက် လုပ်ဆောင်နိုင်ပါသည်။',
      },
      {
        title: locale === 'en' ? 'Bilingual workflow platform' : 'Bilingual workflow platform',
        body:
          locale === 'en'
            ? 'Myanmar and English experience with structured status visibility, auditability, and transition discipline.'
            : 'Myanmar နှင့် English နှစ်ဘာသာဖြင့် status visibility၊ auditability နှင့် workflow discipline ကို ပံ့ပိုးပါသည်။',
      },
    ],
    [locale],
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await trySignIn(auth, email.trim(), password);
      navigate('/portal-home', { replace: true });
    } catch (e: any) {
      setError(e?.message ?? t('common.loginFailed', 'Login failed.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-shell__panel auth-shell__panel--brand">
        <div className="auth-brand-badge">{t('common.enterprisePlatform', 'Enterprise Delivery Platform')}</div>
        <h1 className="auth-hero-title">
          {locale === 'en'
            ? 'Britium Express Enterprise Control Tower'
            : 'Britium Express Enterprise Control Tower'}
        </h1>
        <p className="auth-hero-text">
          {locale === 'en'
            ? 'Premium multi-portal delivery operations for warehouse, dispatch, riders, branch offices, customer support, finance, and enterprise governance.'
            : 'warehouse, dispatch, rider, branch office, customer support, finance နှင့် enterprise governance အတွက် premium multi-portal delivery operations platform ဖြစ်ပါသည်။'}
        </p>

        <div className="auth-feature-list">
          {highlights.map((item) => (
            <article key={item.title} className="auth-feature-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="auth-brand-footer">
          <strong>Britium Express</strong>
          <span>{locale === 'en' ? 'Fast. Controlled. Auditable.' : 'Fast. Controlled. Auditable.'}</span>
        </div>
      </div>

      <div className="auth-shell__panel auth-shell__panel--form">
        <article className="auth-form-card">
          <div className="page-eyebrow">{t('common.signIn', 'Sign In')}</div>
          <h2>{locale === 'en' ? 'Welcome back' : 'Welcome back'}</h2>
          <p>
            {locale === 'en'
              ? 'Access your assigned portal securely and continue daily operations.'
              : 'သင်၏ assigned portal သို့ လုံခြုံစွာ ဝင်ရောက်ပြီး daily operations ကို ဆက်လက် လုပ်ဆောင်နိုင်ပါသည်။'}
          </p>

          <form className="page-main-stack" onSubmit={onSubmit}>
            <label className="field">
              <span>{t('common.email', 'Email')}</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('common.emailPlaceholder', 'Enter your email')}
              />
            </label>

            <label className="field">
              <span>{t('common.password', 'Password')}</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('common.passwordPlaceholder', 'Enter your password')}
              />
            </label>

            {error ? <div className="callout">{error}</div> : null}

            <div className="toolbar auth-toolbar">
              <button type="submit" className="toolbar-button toolbar-button--primary">
                {busy ? t('common.signingIn', 'Signing in...') : t('common.signIn', 'Sign In')}
              </button>
            </div>
          </form>

          <div className="auth-form-footer">
            <span>{locale === 'en' ? 'Need public tracking?' : 'Need public tracking?'}</span>
            <Link to="/track" className="auth-inline-link">
              {t('common.openTracking', 'Open Tracking')}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default LoginPage;
