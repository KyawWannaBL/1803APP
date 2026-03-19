import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinancePaymentRecordsPage() {
  const { t } = useI18n();
  const { payments, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.paymentRecords', 'Payment Records')}</div>
        <h1>{t('common.paymentRecords', 'Payment Records')}</h1>
        <p>{t('common.paymentRecordsWorkflowNote', 'Review recorded payments, collection channels, payment references, and reconciliation evidence.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.payment', 'Payment')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{payments.length ? payments.map((row) => <tr key={String(row.id)}><td>{row.payment_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.amount ?? '-'}</td><td>{row.reference_no ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
