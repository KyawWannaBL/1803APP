import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceMerchantLedgerPage() {
  const { t } = useI18n();
  const { ledger, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.merchantLedger', 'Merchant Ledger')}</div>
        <h1>{t('common.merchantLedger', 'Merchant Ledger')}</h1>
        <p>{t('common.merchantLedgerWorkflowNote', 'Review debit, credit, and balance movement for merchant financial accounts.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.entry', 'Entry')}</th><th>{t('common.type', 'Type')}</th><th>{t('common.amount', 'Amount')}</th><th>{t('common.merchant', 'Merchant')}</th></tr></thead><tbody>{ledger.length ? ledger.map((row) => <tr key={String(row.id)}><td>{row.entry_no ?? row.id}</td><td>{row.entry_type ?? row.type ?? '-'}</td><td>{row.amount ?? '-'}</td><td>{row.merchant_id ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
