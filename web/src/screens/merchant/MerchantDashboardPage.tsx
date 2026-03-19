import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useMerchantWorkspace } from '@/screens/merchant/useMerchantWorkspace';

export function MerchantDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, orders, invoices, pendingReturns, branches, merchantUsers, busy, error } = useMerchantWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.merchant', 'Merchant')}</div>
        <h1>{locale === 'en' ? 'Merchant Dashboard' : 'Merchant Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated merchant workspace for order entry, bulk upload, tracking, return visibility, and billing review.'
            : 'order entry၊ bulk upload၊ tracking၊ return visibility နှင့် billing review အတွက် dedicated merchant workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
            <div className="focus-item"><strong>{t('common.invoices', 'Invoices')}</strong><span>{invoices.length}</span></div>
            <div className="focus-item"><strong>{t('common.pendingReturns', 'Pending Returns')}</strong><span>{pendingReturns.length}</span></div>
            <div className="focus-item"><strong>{t('common.branches', 'Branches')}</strong><span>{branches.length}</span></div>
            <div className="focus-item"><strong>{t('common.users', 'Users')}</strong><span>{merchantUsers.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/merchant/create-order" className="quick-link-card"><div className="quick-link-card__title">{t('common.createOrder', 'Create Order')}</div></Link>
            <Link to="/merchant/bulk-upload" className="quick-link-card"><div className="quick-link-card__title">{t('common.bulkUpload', 'Bulk Upload')}</div></Link>
            <Link to="/merchant/orders" className="quick-link-card"><div className="quick-link-card__title">{t('common.orders', 'Orders')}</div></Link>
            <Link to="/merchant/tracking" className="quick-link-card"><div className="quick-link-card__title">{t('common.tracking', 'Tracking')}</div></Link>
            <Link to="/merchant/invoices" className="quick-link-card"><div className="quick-link-card__title">{t('common.invoices', 'Invoices')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.customer', 'Customer')}</th></tr></thead>
            <tbody>
              {orders.length ? orders.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.order_code ?? row.id}</td>
                  <td>{row.status_code ?? row.status ?? '-'}</td>
                  <td>{row.receiver_name ?? row.customer_name ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
