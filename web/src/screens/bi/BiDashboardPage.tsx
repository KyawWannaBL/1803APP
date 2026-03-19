import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useBiWorkspace } from '@/screens/bi/useBiWorkspace';

export function BiDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, orders, deliveredOrders, failedOrders, revenueInvoices, escalatedTickets, busy, error } = useBiWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.bi', 'BI / Reporting')}</div>
        <h1>{locale === 'en' ? 'BI / Reporting Dashboard' : 'BI / Reporting Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Executive analytics workspace for KPI monitoring, delivery trends, operational health, revenue visibility, and report access.'
            : 'KPI monitoring၊ delivery trends၊ operational health၊ revenue visibility နှင့် report access အတွက် executive analytics workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
            <div className="focus-item"><strong>{t('common.delivered', 'Delivered')}</strong><span>{deliveredOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.failed', 'Failed')}</strong><span>{failedOrders.length}</span></div>
            <div className="focus-item"><strong>{t('common.invoices', 'Invoices')}</strong><span>{revenueInvoices.length}</span></div>
            <div className="focus-item"><strong>{t('common.escalations', 'Escalations')}</strong><span>{escalatedTickets.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/bi/delivery-performance" className="quick-link-card"><div className="quick-link-card__title">{t('common.deliveryPerformance', 'Delivery Performance')}</div></Link>
            <Link to="/bi/sla-performance" className="quick-link-card"><div className="quick-link-card__title">{t('common.slaPerformance', 'SLA Performance')}</div></Link>
            <Link to="/bi/rider-performance" className="quick-link-card"><div className="quick-link-card__title">{t('common.riderPerformance', 'Rider Performance')}</div></Link>
            <Link to="/bi/revenue" className="quick-link-card"><div className="quick-link-card__title">{t('common.revenueAnalytics', 'Revenue Analytics')}</div></Link>
            <Link to="/bi/custom-reports" className="quick-link-card"><div className="quick-link-card__title">{t('common.customReports', 'Custom Reports')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        {busy ? <div className="empty-state">{t('common.loading', 'Loading...')}</div> : null}
      </section>
    </section>
  );
}
