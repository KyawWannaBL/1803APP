import { useI18n } from '@/i18n/I18nProvider';
import { useDataEntryWorkspace } from '@/screens/dataEntry/useDataEntryWorkspace';

export function DataEntryDraftOrdersPage() {
  const { t } = useI18n();
  const { draftOrders, busy, error } = useDataEntryWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.draftOrders', 'Draft Orders')}</div>
        <h1>{t('common.draftOrders', 'Draft Orders')}</h1>
        <p>{t('common.draftOrdersWorkflowNote', 'Review draft intake records before validation and supervisor approval handoff.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{draftOrders.length ? draftOrders.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
