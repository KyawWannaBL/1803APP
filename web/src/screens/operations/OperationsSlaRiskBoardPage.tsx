import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsSlaRiskBoardPage() {
  const { t } = useI18n();
  const { tasks, error } = useOperationsWorkspace();

  const risky = useMemo(() => {
    const now = Date.now();
    return tasks.filter((row) => {
      const status = String(row.status ?? '');
      if (['delivered', 'failed', 'returned'].includes(status)) return false;
      const planned = row.planned_at ? new Date(row.planned_at).getTime() : 0;
      return planned > 0 && planned < now + 2 * 60 * 60 * 1000;
    });
  }, [tasks]);

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.slaRiskBoard', 'SLA Risk Board')}</div>
        <h1>{t('common.slaRiskBoard', 'SLA Risk Board')}</h1>
        <p>{t('common.slaRiskWorkflowNote', 'Track deliveries that are close to SLA breach and intervene before failure.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.taskCode', 'Task Code')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.plannedAt', 'Planned At')}</th><th>{t('common.rider', 'Rider')}</th></tr></thead>
            <tbody>
              {risky.length ? risky.map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.task_code ?? row.id}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.planned_at ?? '-'}</td>
                  <td>{row.assigned_rider_id ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
