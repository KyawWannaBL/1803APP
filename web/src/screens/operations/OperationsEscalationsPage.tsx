import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsEscalationsPage() {
  const { t } = useI18n();
  const { tickets, error } = useOperationsWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.escalations', 'Escalations')}</div>
        <h1>{t('common.escalations', 'Escalations')}</h1>
        <p>{t('common.escalationWorkflowNote', 'Review operational tickets, customer complaints, and dispatch exceptions requiring intervention.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.ticket', 'Ticket')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.subject', 'Subject')}</th></tr></thead>
            <tbody>
              {tickets.length ? tickets.map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.ticket_code ?? row.id}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.subject ?? row.title ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
