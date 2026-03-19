import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

export function PublicTrackingNotFoundPage() {
  const { t } = useI18n();

  return (
    <section className="page-main-stack public-page">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.trackingNotFound', 'Tracking Not Found')}</div>
        <h1>{t('common.trackingNotFound', 'Tracking Not Found')}</h1>
        <p>{t('common.trackingNotFoundWorkflowNote', 'No shipment matched the provided reference. Verify the code or request support assistance.')}</p>
      </article>
      <section className="page-card">
        <div className="toolbar toolbar--wrap">
          <Link to="/track/search" className="toolbar-button toolbar-button--primary">{t('common.tryAgain', 'Try Again')}</Link>
          <Link to="/track/support" className="toolbar-button">{t('common.needSupport', 'Need Support')}</Link>
        </div>
      </section>
    </section>
  );
}
