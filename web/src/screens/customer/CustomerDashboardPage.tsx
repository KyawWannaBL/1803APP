import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useCustomerWorkspace } from '@/screens/customer/useCustomerWorkspace';

export function CustomerDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, orders, tickets, activeOrders, profiles, busy, error } = useCustomerWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.customer', 'Customer')}</div>
        <h1>{locale === 'en' ? 'Customer Dashboard' : 'Customer Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated customer workspace for personal delivery requests, tracking, support tickets, and profile management.'
            : 'personal delivery requests၊ tracking၊ support tickets နှင့် profile management အတွက် dedicated customer workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
            <div className="focus-item"><strong>{t('common.activeOrders', 'Active Orders')}</strong><span>{activeOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.tickets', 'Tickets')}</strong><span>{tickets.length}</span></div>
            <div className="focus-item"><strong>{t('common.profiles', 'Profiles')}</strong><span>{profiles.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/customer/create-request" className="quick-link-card"><div className="quick-link-card__title">{t('common.createRequest', 'Create Request')}</div></Link>
            <Link to="/customer/orders" className="quick-link-card"><div className="quick-link-card__title">{t('common.myOrders', 'My Orders')}</div></Link>
            <Link to="/customer/tracking" className="quick-link-card"><div className="quick-link-card__title">{t('common.tracking', 'Tracking')}</div></Link>
            <Link to="/customer/support-tickets" className="quick-link-card"><div className="quick-link-card__title">{t('common.myTickets', 'My Tickets')}</div></Link>
            <Link to="/customer/profile" className="quick-link-card"><div className="quick-link-card__title">{t('common.profile', 'Profile')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead>
            <tbody>
              {orders.length ? orders.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.order_code ?? row.id}</td>
                  <td>{row.status_code ?? row.status ?? '-'}</td>
                  <td>{row.reference_no ?? row.tracking_no ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
