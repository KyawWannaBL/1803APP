import { useI18n } from '@/i18n/I18nProvider';
import { useBranchOfficeWorkspace } from '@/screens/branchOffice/useBranchOfficeWorkspace';

export function BranchOfficeShipmentsPage() {
  const { t } = useI18n();
  const { orders, busy, error } = useBranchOfficeWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.shipments', 'Shipments')}</div>
        <h1>{t('common.shipments', 'Shipments')}</h1>
        <p>{t('common.branchShipmentsWorkflowNote', 'Review local branch shipment list, statuses, and customer references.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th><th>{t('common.customer', 'Customer')}</th></tr></thead><tbody>{orders.length ? orders.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td><td>{row.receiver_name ?? row.customer_name ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
