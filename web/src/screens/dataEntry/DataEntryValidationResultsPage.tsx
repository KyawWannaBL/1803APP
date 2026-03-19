import { useI18n } from '@/i18n/I18nProvider';
import { useDataEntryWorkspace } from '@/screens/dataEntry/useDataEntryWorkspace';
import { TimelinePanel } from '@/components/TimelinePanel';

export function DataEntryValidationResultsPage() {
  const { t } = useI18n();
  const { validationIssues, busy, error } = useDataEntryWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.validationResults', 'Validation Results')}</div>
        <h1>{t('common.validationResults', 'Validation Results')}</h1>
        <p>{t('common.validationResultsWorkflowNote', 'Review validation failures and trace each intake item through workflow checkpoints.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="page-grid">
        <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{validationIssues.length ? validationIssues.map((row) => <tr key={String(row.id)}><td>{row.order_code ?? row.id}</td><td>{row.status_code ?? row.status ?? '-'}</td><td>{row.reference_no ?? row.tracking_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
        <section className="page-card"><TimelinePanel /></section>
      </div>
    </section>
  );
}
