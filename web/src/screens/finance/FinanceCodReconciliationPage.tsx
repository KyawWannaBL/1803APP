import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceCodReconciliationPage() {
  const { t } = useI18n();
  const { codOrders, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.codReconciliation', 'COD Reconciliation')}</div>
        <h1>{t('common.codReconciliation', 'COD Reconciliation')}</h1>
        <p>{t('common.codReconciliationWorkflowNote', 'Review COD order amounts, collected amounts, and reconciliation readiness.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.codAmount', 'COD Amount')}</th><th>{t('common.collected', 'Collected')}</th><th>{t('common.status', 'Status')}</th></tr></thead><tbody>{codOrders.length ? codOrders.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.cod_amount ?? '-'}</td><td>{row.cod_collected_amount ?? '-'}</td><td>{row.status_code ?? row.status ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
