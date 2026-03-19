import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceRefundReviewPage() {
  const { t } = useI18n();
  const { refunds, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.refundReview', 'Refund Review')}</div>
        <h1>{t('common.refundReview', 'Refund Review')}</h1>
        <p>{t('common.refundReviewWorkflowNote', 'Review refund requests, amounts, approval status, and related payment context.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.refund', 'Refund')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{refunds.length ? refunds.map((row) => <tr key={String(row.id)}><td>{row.refund_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.amount ?? '-'}</td><td>{row.payment_id ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
