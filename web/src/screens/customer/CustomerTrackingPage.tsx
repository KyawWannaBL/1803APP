import { useI18n } from '@/i18n/I18nProvider';
import { useCustomerWorkspace } from '@/screens/customer/useCustomerWorkspace';

export function CustomerTrackingPage() {
  const { t } = useI18n();
  const { activeOrders, busy, error } = useCustomerWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.tracking', 'Tracking')}</div>
        <h1>{t('common.tracking', 'Tracking')}</h1>
        <p>{t('common.customerTrackingWorkflowNote', 'Track your active delivery requests and latest shipment progress.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{activeOrders.length ? activeOrders.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
