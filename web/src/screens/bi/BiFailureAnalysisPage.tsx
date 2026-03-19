import { useI18n } from '@/i18n/I18nProvider';
import { useBiWorkspace } from '@/screens/bi/useBiWorkspace';

export function BiFailureAnalysisPage() {
  const { t } = useI18n();
  const { failedOrders, escalatedTickets, busy, error } = useBiWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.failureAnalysis', 'Failure Analysis')}</div>
        <h1>{t('common.failureAnalysis', 'Failure Analysis')}</h1>
        <p>{t('common.failureAnalysisWorkflowNote', 'Review failed orders and escalated tickets to understand operational breakdowns.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="dashboard-grid">
        <section className="page-card">
          <h2>{t('common.failedDeliveries', 'Failed Deliveries')}</h2>
          <div className="focus-list"><div className="focus-item"><strong>{t('common.failed', 'Failed')}</strong><span>{failedOrders.length}</span></div></div>
        </section>
        <section className="page-card">
          <h2>{t('common.escalations', 'Escalations')}</h2>
          <div className="focus-list"><div className="focus-item"><strong>{t('common.escalations', 'Escalations')}</strong><span>{escalatedTickets.length}</span></div></div>
        </section>
      </div>
      {busy ? <section className="page-card"><div className="empty-state">{t('common.loading', 'Loading...')}</div></section> : null}
    </section>
  );
}
