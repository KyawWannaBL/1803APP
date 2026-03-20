import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data } = await supabase.auth.getSession();

        if (!mounted) return;

        if (data.session) {
          setReady(true);
        } else {
          setError(locale === 'en' ? 'Invalid or expired recovery link.' : 'Recovery link မမှန် သို့မဟုတ် သက်တမ်းကုန်နေပါသည်။');
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? (locale === 'en' ? 'Invalid or expired recovery link.' : 'Recovery link မမှန် သို့မဟုတ် သက်တမ်းကုန်နေပါသည်။'));
      } finally {
        if (mounted) setBusy(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true);
        setBusy(false);
      }
    });

    void init();

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [locale]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError(locale === 'en' ? 'Both password fields are required.' : 'Password field နှစ်ခုလုံး လိုအပ်ပါသည်။');
      return;
    }
    if (password !== confirmPassword) {
      setError(locale === 'en' ? 'Passwords do not match.' : 'စကားဝှက်များ မကိုက်ညီပါ။');
      return;
    }
    if (password.length < 8) {
      setError(locale === 'en' ? 'Password must be at least 8 characters.' : 'စကားဝှက်သည် အနည်းဆုံး ၈ လုံး ဖြစ်ရမည်။');
      return;
    }

    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setMessage(locale === 'en' ? 'Password updated successfully. Redirecting to login...' : 'စကားဝှက် ပြောင်းပြီးပါပြီ။ Login သို့ ပြန်သွားနေသည်...');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (e: any) {
      setError(e?.message ?? t('common.requestFailed', 'Request failed.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-shell__panel auth-shell__panel--brand">
        <div className="auth-brand-badge">{t('common.enterprisePlatform', 'Enterprise Delivery Platform')}</div>
        <h1 className="auth-hero-title">
          {locale === 'en' ? 'Britium Express Password Recovery' : 'Britium Express Password Recovery'}
        </h1>
        <p className="auth-hero-text">
          {locale === 'en'
            ? 'Set a new password securely and restore access to your assigned enterprise workspace.'
            : 'သင့် enterprise workspace သို့ ပြန်လည်ဝင်ရောက်နိုင်ရန် စကားဝှက်အသစ်ကို လုံခြုံစွာ သတ်မှတ်ပါ။'}
        </p>

        <div className="auth-feature-list">
          <article className="auth-feature-card">
            <h3>{locale === 'en' ? 'Secure reset session' : 'Secure reset session'}</h3>
            <p>
              {locale === 'en'
                ? 'Recovery links are validated through Supabase authentication before password updates are allowed.'
                : 'Password update မပြုမီ recovery link ကို Supabase authentication ဖြင့် စစ်ဆေးပါသည်။'}
            </p>
          </article>
          <article className="auth-feature-card">
            <h3>{locale === 'en' ? 'Production-safe access recovery' : 'Production-safe access recovery'}</h3>
            <p>
              {locale === 'en'
                ? 'Users are redirected back to login after password rotation so they can sign in with the new credential.'
                : 'စကားဝှက်ပြောင်းပြီးနောက် login သို့ပြန်လည်ညွှန်ပေးပြီး credential အသစ်ဖြင့် ဝင်ရောက်နိုင်ပါသည်။'}
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
          <div className="page-eyebrow">{locale === 'en' ? 'Password Reset' : 'Password Reset'}</div>
          <h2>{locale === 'en' ? 'Set a new password' : 'Set a new password'}</h2>
          <p>
            {locale === 'en'
              ? 'Enter and confirm your new password to complete recovery.'
              : 'Recovery ကို ပြီးစီးစေရန် စကားဝှက်အသစ်ကို ဖြည့်ပြီး အတည်ပြုပါ။'}
          </p>

          {busy && !ready ? <div className="callout">{locale === 'en' ? 'Preparing password recovery...' : 'Password recovery ကို ပြင်ဆင်နေသည်...'}</div> : null}

          {!busy || ready ? (
            <form className="page-main-stack" onSubmit={onSubmit}>
              <label className="field">
                <span>{locale === 'en' ? 'New password' : 'စကားဝှက်အသစ်'}</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={locale === 'en' ? 'Enter new password' : 'စကားဝှက်အသစ် ထည့်ပါ'}
                  disabled={!ready}
                />
              </label>

              <label className="field">
                <span>{locale === 'en' ? 'Confirm password' : 'စကားဝှက် အတည်ပြု'}</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={locale === 'en' ? 'Confirm new password' : 'စကားဝှက်အသစ် အတည်ပြုပါ'}
                  disabled={!ready}
                />
              </label>

              {error ? <div className="callout">{error}</div> : null}
              {message ? <div className="callout">{message}</div> : null}

              <div className="toolbar auth-toolbar">
                <button type="submit" className="toolbar-button toolbar-button--primary" disabled={!ready || busy}>
                  {busy ? (locale === 'en' ? 'Updating...' : 'Updating...') : (locale === 'en' ? 'Update Password' : 'Update Password')}
                </button>
                <button type="button" className="toolbar-button" onClick={() => navigate('/login')}>
                  {locale === 'en' ? 'Back to Login' : 'Back to Login'}
                </button>
              </div>
            </form>
          ) : null}

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
