import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

export function PublicTrackingLandingPage() {
  const { t, locale } = useI18n();

  return (
    <section className="page-main-stack public-page">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.publicTracking', 'Public Tracking')}</div>
        <h1>{locale === 'en' ? 'Track Your Shipment' : 'Track Your Shipment'}</h1>
        <p>
          {locale === 'en'
            ? 'Enter your tracking number, order code, or reference to view current delivery progress.'
            : 'tracking number, order code သို့မဟုတ် reference ဖြင့် delivery progress ကို ကြည့်ရှုနိုင်ပါသည်။'}
        </p>
        <div className="quick-link-list">
          <Link to="/track/search" className="quick-link-card"><div className="quick-link-card__title">{t('common.startTracking', 'Start Tracking')}</div></Link>
          <Link to="/track/support" className="quick-link-card"><div className="quick-link-card__title">{t('common.needSupport', 'Need Support')}</div></Link>
        </div>
      </article>
    </section>
  );
}
