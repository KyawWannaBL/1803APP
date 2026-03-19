import { useI18n } from '@/i18n/I18nProvider';
import { useBiWorkspace } from '@/screens/bi/useBiWorkspace';

export function BiMerchantPerformancePage() {
  const { t } = useI18n();
  const { merchants, busy, error } = useBiWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.merchantPerformance', 'Merchant Performance')}</div>
        <h1>{t('common.merchantPerformance', 'Merchant Performance')}</h1>
        <p>{t('common.merchantPerformanceWorkflowNote', 'Review merchant registry and relationship-level performance visibility.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.merchant', 'Merchant')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{merchants.length ? merchants.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.merchant_name ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.code ?? row.reference_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
