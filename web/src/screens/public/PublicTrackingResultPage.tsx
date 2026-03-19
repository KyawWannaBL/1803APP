import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { usePublicTrackingWorkspace } from '@/screens/public/usePublicTrackingWorkspace';

export function PublicTrackingResultPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const { firstResult, busy, error } = usePublicTrackingWorkspace(query);

  if (!query) {
    return <section className="page-main-stack public-page"><section className="page-card"><div className="callout">{t('common.noTrackingQuery', 'No tracking query provided.')}</div></section></section>;
  }

  if (busy) {
    return <section className="page-main-stack public-page"><section className="page-card"><div className="empty-state">{t('common.loading', 'Loading...')}</div></section></section>;
  }

  if (error) {
    return <section className="page-main-stack public-page"><section className="page-card"><div className="callout">{error}</div></section></section>;
  }

  if (!firstResult) {
    return <section className="page-main-stack public-page"><section className="page-card"><div className="callout">{t('common.trackingNotFound', 'Tracking record was not found.')}</div><div className="toolbar toolbar--wrap"><Link to="/track/not-found" className="toolbar-button">{t('common.openNotFoundPage', 'Open Not Found Page')}</Link></div></section></section>;
  }

  return (
    <section className="page-main-stack public-page">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.trackingResult', 'Tracking Result')}</div>
        <h1>{t('common.trackingResult', 'Tracking Result')}</h1>
        <p>{t('common.trackingResultWorkflowNote', 'Review the latest public delivery status for the matched tracking record.')}</p>
      </article>

      <section className="page-card">
        <div className="detail-grid">
          <div><h3>{t('common.order', 'Order')}</h3><p>{firstResult.order_code ?? firstResult.id}</p></div>
          <div><h3>{t('common.status', 'Status')}</h3><p>{firstResult.status_code ?? firstResult.status ?? '-'}</p></div>
          <div><h3>{t('common.reference', 'Reference')}</h3><p>{firstResult.reference_no ?? firstResult.tracking_no ?? firstResult.awb_no ?? '-'}</p></div>
          <div><h3>{t('common.customer', 'Customer')}</h3><p>{firstResult.receiver_name ?? firstResult.customer_name ?? '-'}</p></div>
        </div>
      </section>

      <section className="page-card">
        <div className="toolbar toolbar--wrap">
          <Link to="/track/support" className="toolbar-button">{t('common.needSupport', 'Need Support')}</Link>
          <Link to="/track/search" className="toolbar-button toolbar-button--primary">{t('common.searchAgain', 'Search Again')}</Link>
        </div>
      </section>
    </section>
  );
}
