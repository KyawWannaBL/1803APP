import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: 'https://www.britiumexpress.app/login',
        },
      });

      if (signUpError) throw signUpError;

      setMessage(
        locale === 'en'
          ? 'Sign up submitted. Check your email to confirm your account.'
          : 'Sign up ပြီးပါပြီ။ သင့် account ကိုအတည်ပြုရန် email ကို စစ်ဆေးပါ။',
      );
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
        <h1 className="auth-hero-title">{locale === 'en' ? 'Britium Express Account Enrollment' : 'Britium Express Account Enrollment'}</h1>
        <p className="auth-hero-text">
          {locale === 'en'
            ? 'Create a secure account request for enterprise delivery operations and portal access.'
            : 'enterprise delivery operations နှင့် portal access အတွက် secure account request တင်နိုင်ပါသည်။'}
        </p>

        <div className="auth-feature-list">
          <article className="auth-feature-card">
            <h3>{locale === 'en' ? 'Role-aware access' : 'Role-aware access'}</h3>
            <p>{locale === 'en' ? 'New accounts can be assigned to controlled portal roles after verification.' : 'အတည်ပြုပြီးနောက် portal role များသို့ assign လုပ်နိုင်ပါသည်။'}</p>
          </article>
          <article className="auth-feature-card">
            <h3>{locale === 'en' ? 'Production-safe onboarding' : 'Production-safe onboarding'}</h3>
            <p>{locale === 'en' ? 'Sign-up integrates with Supabase Auth confirmation flow.' : 'Sign-up သည် Supabase Auth confirmation flow နှင့် ချိတ်ဆက်ထားပါသည်။'}</p>
          </article>
        </div>

        <div className="auth-brand-footer">
          <strong>Britium Express</strong>
          <span>{locale === 'en' ? 'Fast. Controlled. Auditable.' : 'Fast. Controlled. Auditable.'}</span>
        </div>
      </div>

      <div className="auth-shell__panel auth-shell__panel--form">
        <article className="auth-form-card">
          <div className="page-eyebrow">{locale === 'en' ? 'Sign Up' : 'Sign Up'}</div>
          <h2>{locale === 'en' ? 'Create account' : 'Create account'}</h2>
          <p>{locale === 'en' ? 'Submit your details to start using the platform.' : 'Platform ကို စတင်အသုံးပြုရန် သင့်အချက်အလက်များ ဖြည့်ပါ။'}</p>

          <form className="page-main-stack" onSubmit={onSubmit}>
            <label className="field">
              <span>{locale === 'en' ? 'Full name' : 'နာမည်အပြည့်အစုံ'}</span>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={locale === 'en' ? 'Enter full name' : 'နာမည်ထည့်ပါ'} />
            </label>
            <label className="field">
              <span>{t('common.email', 'Email')}</span>
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('common.emailPlaceholder', 'Enter your email')} />
            </label>
            <label className="field">
              <span>{t('common.password', 'Password')}</span>
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('common.passwordPlaceholder', 'Enter your password')} />
            </label>

            {error ? <div className="callout">{error}</div> : null}
            {message ? <div className="callout">{message}</div> : null}

            <div className="toolbar auth-toolbar">
              <button type="submit" className="toolbar-button toolbar-button--primary">
                {busy ? (locale === 'en' ? 'Submitting...' : 'Submitting...') : (locale === 'en' ? 'Create Account' : 'Create Account')}
              </button>
              <button type="button" className="toolbar-button" onClick={() => navigate('/login')}>
                {locale === 'en' ? 'Back to Login' : 'Back to Login'}
              </button>
            </div>
          </form>

          <div className="auth-form-footer">
            <span>{locale === 'en' ? 'Already have an account?' : 'Already have an account?'}</span>
            <Link to="/login" className="auth-inline-link">{locale === 'en' ? 'Sign In' : 'Sign In'}</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
