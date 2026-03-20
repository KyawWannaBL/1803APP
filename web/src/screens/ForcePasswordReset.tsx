import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { supabase } from '@/lib/supabase';

export default function ForcePasswordReset() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

      setMessage(locale === 'en' ? 'Password updated successfully.' : 'စကားဝှက် ပြောင်းပြီးပါပြီ။');
      setTimeout(() => navigate('/portal-home', { replace: true }), 1000);
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
        <h1 className="auth-hero-title">{locale === 'en' ? 'Britium Express Password Rotation' : 'Britium Express Password Rotation'}</h1>
        <p className="auth-hero-text">
          {locale === 'en'
            ? 'Update your password before continuing to protected portals.'
            : 'protected portal များသို့ မသွားမီ သင့် password ကို ပြောင်းပါ။'}
        </p>
      </div>

      <div className="auth-shell__panel auth-shell__panel--form">
        <article className="auth-form-card">
          <div className="page-eyebrow">{locale === 'en' ? 'Required Password Change' : 'Required Password Change'}</div>
          <h2>{locale === 'en' ? 'Change password' : 'Change password'}</h2>
          <p>{locale === 'en' ? 'Your account requires an immediate password update.' : 'သင့် account သည် စကားဝှက်ကို ချက်ချင်းပြောင်းရန် လိုအပ်ပါသည်။'}</p>

          <form className="page-main-stack" onSubmit={onSubmit}>
            <label className="field">
              <span>{locale === 'en' ? 'New password' : 'စကားဝှက်အသစ်'}</span>
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="field">
              <span>{locale === 'en' ? 'Confirm password' : 'စကားဝှက် အတည်ပြု'}</span>
              <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </label>

            {error ? <div className="callout">{error}</div> : null}
            {message ? <div className="callout">{message}</div> : null}

            <div className="toolbar auth-toolbar">
              <button type="submit" className="toolbar-button toolbar-button--primary">
                {busy ? (locale === 'en' ? 'Updating...' : 'Updating...') : (locale === 'en' ? 'Update Password' : 'Update Password')}
              </button>
              <button type="button" className="toolbar-button" onClick={() => navigate('/login')}>
                {locale === 'en' ? 'Back to Login' : 'Back to Login'}
              </button>
            </div>
          </form>

          <div className="auth-form-footer">
            <span>{locale === 'en' ? 'Need public tracking?' : 'Need public tracking?'}</span>
            <Link to="/track" className="auth-inline-link">{t('common.openTracking', 'Open Tracking')}</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
