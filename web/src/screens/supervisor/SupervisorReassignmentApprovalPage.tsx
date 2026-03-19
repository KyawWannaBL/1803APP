import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';
import { MapboxPanel } from '@/components/MapboxPanel';

export function SupervisorReassignmentApprovalPage() {
  const { t } = useI18n();
  const { riders, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.reassignmentApproval', 'Reassignment Approval')}</div>
        <h1>{t('common.reassignmentApproval', 'Reassignment Approval')}</h1>
        <p>{t('common.reassignmentApprovalWorkflowNote', 'Review rider capacity and route context before approving reassignment decisions.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="page-grid">
        <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.rider', 'Rider')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.phone', 'Phone')}</th></tr></thead><tbody>{riders.length ? riders.map((row) => <tr key={String(row.id)}><td>{row.full_name ?? row.name ?? row.rider_name ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.phone ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
        <section className="page-card"><h2>{t('common.routeContext', 'Route Context')}</h2><MapboxPanel /></section>
      </div>
    </section>
  );
}
