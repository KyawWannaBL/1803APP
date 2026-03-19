import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceSettlementQueuePage() {
  const { t } = useI18n();
  const { openSettlements, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.settlementQueue', 'Settlement Queue')}</div>
        <h1>{t('common.settlementQueue', 'Settlement Queue')}</h1>
        <p>{t('common.settlementQueueWorkflowNote', 'Review merchant settlements that are pending approval, release, or completion.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.settlement', 'Settlement')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th><th>{t('common.merchant', 'Merchant')}</th></tr></thead><tbody>{openSettlements.length ? openSettlements.map((row) => <tr key={String(row.id)}><td>{row.settlement_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.total_amount ?? row.amount ?? '-'}</td><td>{row.merchant_id ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
