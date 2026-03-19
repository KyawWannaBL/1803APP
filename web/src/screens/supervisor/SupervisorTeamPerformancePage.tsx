import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';

export function SupervisorTeamPerformancePage() {
  const { t } = useI18n();
  const { riders, approvals, failedDeliveries, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.teamPerformance', 'Team Performance')}</div>
        <h1>{t('common.teamPerformance', 'Team Performance')}</h1>
        <p>{t('common.teamPerformanceWorkflowNote', 'Review oversight indicators for riders, approval throughput, and failure trends.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card">
        <div className="focus-list">
          <div className="focus-item"><strong>{t('common.riders', 'Riders')}</strong><span>{riders.length}</span></div>
          <div className="focus-item"><strong>{t('common.approvals', 'Approvals')}</strong><span>{approvals.length}</span></div>
          <div className="focus-item"><strong>{t('common.failedDeliveries', 'Failed Deliveries')}</strong><span>{failedDeliveries.length}</span></div>
        </div>
        {busy ? <div className="empty-state">{t('common.loading', 'Loading...')}</div> : null}
      </section>
    </section>
  );
}
