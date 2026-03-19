import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';
import { TimelinePanel } from '@/components/TimelinePanel';

export function SupervisorEscalationsPage() {
  const { t } = useI18n();
  const { escalations, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.escalations', 'Escalations')}</div>
        <h1>{t('common.escalations', 'Escalations')}</h1>
        <p>{t('common.escalationsWorkflowNote', 'Review escalated tickets and incident paths with timeline-based governance visibility.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="page-grid">
        <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.ticket', 'Ticket')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.priority', 'Priority')}</th></tr></thead><tbody>{escalations.length ? escalations.map((row) => <tr key={String(row.id)}><td>{row.ticket_code ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.priority ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
        <section className="page-card"><TimelinePanel /></section>
      </div>
    </section>
  );
}
