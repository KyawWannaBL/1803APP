import { useI18n } from '@/i18n/I18nProvider';
import { useMerchantWorkspace } from '@/screens/merchant/useMerchantWorkspace';

export function MerchantReturnsPage() {
  const { t } = useI18n();
  const { returns, busy, error } = useMerchantWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.returns', 'Returns')}</div>
        <h1>{t('common.returns', 'Returns')}</h1>
        <p>{t('common.returnsWorkflowNote', 'Review pending and completed return requests for merchant shipments.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.return', 'Return')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{returns.length ? returns.map((row) => <tr key={String(row.id)}><td>{row.return_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.order_id ?? row.reference_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
