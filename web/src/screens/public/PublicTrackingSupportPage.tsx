import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

export function PublicTrackingSupportPage() {
  const { t } = useI18n();

  return (
    <section className="page-main-stack public-page">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.publicSupport', 'Public Support')}</div>
        <h1>{t('common.publicSupport', 'Public Support')}</h1>
        <p>{t('common.publicSupportWorkflowNote', 'Use public support guidance when tracking details are unclear or shipment issues need follow-up.')}</p>
      </article>

      <section className="page-card">
        <div className="quick-link-list">
          <Link to="/track/search" className="quick-link-card"><div className="quick-link-card__title">{t('common.searchAgain', 'Search Again')}</div></Link>
          <Link to="/login" className="quick-link-card"><div className="quick-link-card__title">{t('common.login', 'Login')}</div></Link>
        </div>
      </section>
    </section>
  );
}
