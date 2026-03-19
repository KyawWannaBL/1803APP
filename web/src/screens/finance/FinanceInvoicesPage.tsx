import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceInvoicesPage() {
  const { t } = useI18n();
  const { invoices, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.invoices', 'Invoices')}</div>
        <h1>{t('common.invoices', 'Invoices')}</h1>
        <p>{t('common.invoicesWorkflowNote', 'Review issued invoices, status progress, amount values, and merchant references.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.invoice', 'Invoice')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th><th>{t('common.merchant', 'Merchant')}</th></tr></thead><tbody>{invoices.length ? invoices.map((row) => <tr key={String(row.id)}><td>{row.invoice_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.total_amount ?? row.amount ?? '-'}</td><td>{row.merchant_id ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
