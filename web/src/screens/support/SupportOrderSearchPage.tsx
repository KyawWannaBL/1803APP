import { useI18n } from '@/i18n/I18nProvider';
import { useSupportWorkspace } from '@/screens/support/useSupportWorkspace';

export function SupportOrderSearchPage() {
  const { t } = useI18n();
  const { orders, busy, error } = useSupportWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.orderSearch', 'Order Search')}</div>
        <h1>{t('common.orderSearch', 'Order Search')}</h1>
        <p>{t('common.orderSearchWorkflowNote', 'Search and review orders for support investigations and status clarification.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.customer', 'Customer')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{orders.length ? orders.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.receiver_name ?? row.customer_name ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
