import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useSupportWorkspace } from '@/screens/support/useSupportWorkspace';

export function SupportDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, tickets, orders, customers, complaintTickets, escalatedTickets, busy, error } = useSupportWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.support', 'Support')}</div>
        <h1>{locale === 'en' ? 'Customer Support Dashboard' : 'Customer Support Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated support workspace for ticket review, complaint visibility, order lookup, and escalation handling.'
            : 'ticket review၊ complaint visibility၊ order lookup နှင့် escalation handling အတွက် dedicated support workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.tickets', 'Tickets')}</strong><span>{tickets.length}</span></div>
            <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
            <div className="focus-item"><strong>{t('common.customers', 'Customers')}</strong><span>{customers.length}</span></div>
            <div className="focus-item"><strong>{t('common.complaints', 'Complaints')}</strong><span>{complaintTickets.length}</span></div>
            <div className="focus-item"><strong>{t('common.escalations', 'Escalations')}</strong><span>{escalatedTickets.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/support/ticket-inbox" className="quick-link-card"><div className="quick-link-card__title">{t('common.ticketInbox', 'Ticket Inbox')}</div></Link>
            <Link to="/support/order-search" className="quick-link-card"><div className="quick-link-card__title">{t('common.orderSearch', 'Order Search')}</div></Link>
            <Link to="/support/customer-history" className="quick-link-card"><div className="quick-link-card__title">{t('common.customerHistory', 'Customer History')}</div></Link>
            <Link to="/support/escalation-queue" className="quick-link-card"><div className="quick-link-card__title">{t('common.escalationQueue', 'Escalation Queue')}</div></Link>
            <Link to="/support/knowledge-base" className="quick-link-card"><div className="quick-link-card__title">{t('common.knowledgeBase', 'Knowledge Base')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.ticket', 'Ticket')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.subject', 'Subject')}</th></tr></thead>
            <tbody>
              {tickets.length ? tickets.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.ticket_code ?? row.id}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.subject ?? row.title ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
