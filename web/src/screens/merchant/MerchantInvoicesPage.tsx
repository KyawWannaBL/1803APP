import { useI18n } from '@/i18n/I18nProvider';
import { useMerchantWorkspace } from '@/screens/merchant/useMerchantWorkspace';

export function MerchantInvoicesPage() {
  const { t } = useI18n();
  const { invoices, busy, error } = useMerchantWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.invoices', 'Invoices')}</div>
        <h1>{t('common.invoices', 'Invoices')}</h1>
        <p>{t('common.merchantInvoicesWorkflowNote', 'Review merchant invoice status, amount, and billing references.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.invoice', 'Invoice')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th></tr></thead><tbody>{invoices.length ? invoices.map((row) => <tr key={String(row.id)}><td>{row.invoice_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.total_amount ?? row.amount ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
