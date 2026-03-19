import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, codOrders, openSettlements, unpaidInvoices, payouts, refunds, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.finance', 'Finance')}</div>
        <h1>{locale === 'en' ? 'Finance Dashboard' : 'Finance Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Dedicated finance workspace for COD reconciliation, settlement review, invoice monitoring, payout visibility, and refund control.'
            : 'COD reconciliation၊ settlement review၊ invoice monitoring၊ payout visibility နှင့် refund control အတွက် dedicated finance workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.codOrders', 'COD Orders')}</strong><span>{codOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.settlementQueue', 'Settlement Queue')}</strong><span>{openSettlements.length}</span></div>
            <div className="focus-item"><strong>{t('common.unpaidInvoices', 'Unpaid Invoices')}</strong><span>{unpaidInvoices.length}</span></div>
            <div className="focus-item"><strong>{t('common.riderPayouts', 'Rider Payouts')}</strong><span>{payouts.length}</span></div>
            <div className="focus-item"><strong>{t('common.refunds', 'Refunds')}</strong><span>{refunds.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/finance/cod-reconciliation" className="quick-link-card"><div className="quick-link-card__title">{t('common.codReconciliation', 'COD Reconciliation')}</div></Link>
            <Link to="/finance/settlement-queue" className="quick-link-card"><div className="quick-link-card__title">{t('common.settlementQueue', 'Settlement Queue')}</div></Link>
            <Link to="/finance/invoices" className="quick-link-card"><div className="quick-link-card__title">{t('common.invoices', 'Invoices')}</div></Link>
            <Link to="/finance/rider-payouts" className="quick-link-card"><div className="quick-link-card__title">{t('common.riderPayouts', 'Rider Payouts')}</div></Link>
            <Link to="/finance/refund-review" className="quick-link-card"><div className="quick-link-card__title">{t('common.refundReview', 'Refund Review')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.invoice', 'Invoice')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th></tr></thead>
            <tbody>
              {unpaidInvoices.length ? unpaidInvoices.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.invoice_no ?? row.invoice_code ?? row.id}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.total_amount ?? row.amount ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
