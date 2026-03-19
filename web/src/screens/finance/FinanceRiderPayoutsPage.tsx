import { useI18n } from '@/i18n/I18nProvider';
import { useFinanceWorkspace } from '@/screens/finance/useFinanceWorkspace';

export function FinanceRiderPayoutsPage() {
  const { t } = useI18n();
  const { payouts, busy, error } = useFinanceWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.riderPayouts', 'Rider Payouts')}</div>
        <h1>{t('common.riderPayouts', 'Rider Payouts')}</h1>
        <p>{t('common.riderPayoutsWorkflowNote', 'Review rider payout batches, totals, and payment statuses before release.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.payout', 'Payout')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.amount', 'Amount')}</th><th>{t('common.rider', 'Rider')}</th></tr></thead><tbody>{payouts.length ? payouts.map((row) => <tr key={String(row.id)}><td>{row.payout_no ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.amount ?? '-'}</td><td>{row.rider_id ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
