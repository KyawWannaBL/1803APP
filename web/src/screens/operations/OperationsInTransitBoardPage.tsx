import { MapboxPanel } from '@/components/MapboxPanel';
import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsInTransitBoardPage() {
  const { t } = useI18n();
  const { inTransitTasks, error } = useOperationsWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.inTransit', 'In Transit')}</div>
        <h1>{t('common.inTransitBoard', 'In Transit Board')}</h1>
        <p>{t('common.inTransitWorkflowNote', 'Monitor active pickups and in-transit deliveries with map visibility and operational status.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.taskCode', 'Task Code')}</th><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.rider', 'Rider')}</th></tr></thead>
              <tbody>
                {inTransitTasks.length ? inTransitTasks.map((row) => (
                  <tr key={String(row.id)}>
                    <td>{row.task_code ?? row.id}</td>
                    <td>{row.order_id ?? '-'}</td>
                    <td>{row.status ?? '-'}</td>
                    <td>{row.assigned_rider_id ?? '-'}</td>
                  </tr>
                )) : <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-card">
          <MapboxPanel />
        </section>
      </div>
    </section>
  );
}
