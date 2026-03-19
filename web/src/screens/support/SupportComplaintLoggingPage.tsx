import { useI18n } from '@/i18n/I18nProvider';
import { useSupportWorkspace } from '@/screens/support/useSupportWorkspace';

export function SupportComplaintLoggingPage() {
  const { t } = useI18n();
  const { complaintTickets, busy, error } = useSupportWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.complaintLogging', 'Complaint Logging')}</div>
        <h1>{t('common.complaintLogging', 'Complaint Logging')}</h1>
        <p>{t('common.complaintLoggingWorkflowNote', 'Review logged complaint tickets and prepare them for support investigation and escalation.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.ticket', 'Ticket')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.subject', 'Subject')}</th><th>{t('common.priority', 'Priority')}</th></tr></thead><tbody>{complaintTickets.length ? complaintTickets.map((row) => <tr key={String(row.id)}><td>{row.ticket_code ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.subject ?? row.title ?? '-'}</td><td>{row.priority ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
