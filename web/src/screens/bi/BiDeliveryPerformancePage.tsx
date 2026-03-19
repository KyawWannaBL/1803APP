import { useI18n } from '@/i18n/I18nProvider';
import { useBiWorkspace } from '@/screens/bi/useBiWorkspace';

export function BiDeliveryPerformancePage() {
  const { t } = useI18n();
  const { orders, deliveredOrders, failedOrders, busy, error } = useBiWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.deliveryPerformance', 'Delivery Performance')}</div>
        <h1>{t('common.deliveryPerformance', 'Delivery Performance')}</h1>
        <p>{t('common.deliveryPerformanceWorkflowNote', 'Review delivery outcome totals and compare completed versus failed operational results.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card">
        <div className="focus-list">
          <div className="focus-item"><strong>{t('common.orders', 'Orders')}</strong><span>{orders.length}</span></div>
          <div className="focus-item"><strong>{t('common.delivered', 'Delivered')}</strong><span>{deliveredOrders.length}</span></div>
          <div className="focus-item"><strong>{t('common.failed', 'Failed')}</strong><span>{failedOrders.length}</span></div>
        </div>
        {busy ? <div className="empty-state">{t('common.loading', 'Loading...')}</div> : null}
      </section>
    </section>
  );
}
