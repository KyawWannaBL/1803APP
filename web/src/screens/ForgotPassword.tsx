import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      if (!email.trim()) {
        throw new Error('Email is required.');
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setMessage(
        locale === 'en'
          ? 'Password reset link sent. Please check your email.'
          : 'Password reset link ပို့ပြီးပါပြီ။ Email ကို စစ်ဆေးပါ။',
      );
    } catch (e: any) {
      setError(e?.message ?? t('common.requestFailed', 'Request failed.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-shell__panel auth-shell__panel--brand">
        <div className="auth-brand-badge">
          {t('common.enterprisePlatform', 'Enterprise Delivery Platform')}
        </div>

        <h1 className="auth-hero-title">
          {locale === 'en'
            ? 'Britium Express Credential Recovery'
            : 'Britium Express Credential Recovery'}
        </h1>

        <p className="auth-hero-text">
          {locale === 'en'
            ? 'Recover secure access for enterprise delivery operations, role-based workspaces, and protected customer workflows.'
            : 'enterprise delivery operations, role-based workspace များနှင့် protected customer workflow များအတွက် secure access ကို ပြန်လည်ရယူနိုင်ပါသည်။'}
        </p>

        <div className="auth-feature-list">
          <article className="auth-feature-card">
            <h3>{locale === 'en' ? 'Secure recovery flow' : 'Secure recovery flow'}</h3>
            <p>
              {locale === 'en'
                ? 'Password reset links are issued through the configured Supabase authentication flow.'
                : 'Password reset link များကို configured Supabase authentication flow မှတဆင့် ထုတ်ပေးပါသည်။'}
            </p>
          </article>

          <article className="auth-feature-card">
            <h3>{locale === 'en' ? 'Enterprise-ready access control' : 'Enterprise-ready access control'}</h3>
            <p>
              {locale === 'en'
                ? 'Recovery keeps users aligned with protected routes, role-aware landing, and controlled portal access.'
                : 'Recovery flow သည် protected route, role-aware landing နှင့် controlled portal access တို့နှင့် ကိုက်ညီစွာ အလုပ်လုပ်ပါသည်။'}
            </p>
          </article>
        </div>

        <div className="auth-brand-footer">
          <strong>Britium Express</strong>
          <span>{locale === 'en' ? 'Fast. Controlled. Auditable.' : 'Fast. Controlled. Auditable.'}</span>
        </div>
      </div>

      <div className="auth-shell__panel auth-shell__panel--form">
        <article className="auth-form-card">
          <div className="page-eyebrow">
            {locale === 'en' ? 'Credential Recovery' : 'Credential Recovery'}
          </div>

          <h2>{locale === 'en' ? 'Forgot password' : 'Forgot password'}</h2>

          <p>
            {locale === 'en'
              ? 'Enter your email address and we will send a reset link.'
              : 'သင့် email address ကိုဖြည့်ပြီး password reset link ကို ရယူနိုင်ပါသည်။'}
          </p>

          <form className="page-main-stack" onSubmit={onSubmit}>
            <label className="field">
              <span>{t('common.email', 'Email')}</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('common.emailPlaceholder', 'Enter your email')}
              />
            </label>

            {error ? <div className="callout">{error}</div> : null}
            {message ? <div className="callout">{message}</div> : null}

            <div className="toolbar auth-toolbar">
              <button type="submit" className="toolbar-button toolbar-button--primary">
                {busy
                  ? (locale === 'en' ? 'Sending...' : 'Sending...')
                  : (locale === 'en' ? 'Send Reset Link' : 'Send Reset Link')}
              </button>

              <button
                type="button"
                className="toolbar-button"
                onClick={() => navigate('/login')}
              >
                {locale === 'en' ? 'Back to Login' : 'Back to Login'}
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
