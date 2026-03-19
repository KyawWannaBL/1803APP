import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useBranchOfficeWorkspace } from '@/screens/branchOffice/useBranchOfficeWorkspace';

export function BranchOfficeDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, orders, riders, localExceptions, branches, busy, error } = useBranchOfficeWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.branchOffice', 'Branch Office')}</div>
        <h1>{locale === 'en' ? 'Branch Office Dashboard' : 'Branch Office Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated branch office workspace for local shipments, dispatch coordination, rider oversight, exception handling, and branch reporting.'
            : 'local shipments၊ dispatch coordination၊ rider oversight၊ exception handling နှင့် branch reporting အတွက် dedicated branch office workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
            <div className="focus-item"><strong>{t('common.riders', 'Riders')}</strong><span>{riders.length}</span></div>
            <div className="focus-item"><strong>{t('common.exceptions', 'Exceptions')}</strong><span>{localExceptions.length}</span></div>
            <div className="focus-item"><strong>{t('common.branches', 'Branches')}</strong><span>{branches.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/branch-office/shipments" className="quick-link-card"><div className="quick-link-card__title">{t('common.shipments', 'Shipments')}</div></Link>
            <Link to="/branch-office/dispatch" className="quick-link-card"><div className="quick-link-card__title">{t('common.dispatchView', 'Dispatch View')}</div></Link>
            <Link to="/branch-office/exceptions" className="quick-link-card"><div className="quick-link-card__title">{t('common.exceptions', 'Exceptions')}</div></Link>
            <Link to="/branch-office/riders" className="quick-link-card"><div className="quick-link-card__title">{t('common.riders', 'Riders')}</div></Link>
            <Link to="/branch-office/reports" className="quick-link-card"><div className="quick-link-card__title">{t('common.reports', 'Reports')}</div></Link>
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
