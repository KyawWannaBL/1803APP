import { useI18n } from '@/i18n/I18nProvider';
import { useSupportWorkspace } from '@/screens/support/useSupportWorkspace';

export function SupportTicketInboxPage() {
  const { t } = useI18n();
  const { tickets, busy, error } = useSupportWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.ticketInbox', 'Ticket Inbox')}</div>
        <h1>{t('common.ticketInbox', 'Ticket Inbox')}</h1>
        <p>{t('common.ticketInboxWorkflowNote', 'Review support tickets by status, subject, and priority.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.ticket', 'Ticket')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.priority', 'Priority')}</th><th>{t('common.subject', 'Subject')}</th></tr></thead><tbody>{tickets.length ? tickets.map((row) => <tr key={String(row.id)}><td>{row.ticket_code ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.priority ?? '-'}</td><td>{row.subject ?? row.title ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
