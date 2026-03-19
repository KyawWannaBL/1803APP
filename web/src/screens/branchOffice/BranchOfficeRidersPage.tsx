import { useI18n } from '@/i18n/I18nProvider';
import { useBranchOfficeWorkspace } from '@/screens/branchOffice/useBranchOfficeWorkspace';

export function BranchOfficeRidersPage() {
  const { t } = useI18n();
  const { riders, busy, error } = useBranchOfficeWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.riders', 'Riders')}</div>
        <h1>{t('common.riders', 'Riders')}</h1>
        <p>{t('common.branchRidersWorkflowNote', 'Review branch rider registry, status, and local availability references.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.rider', 'Rider')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.phone', 'Phone')}</th></tr></thead><tbody>{riders.length ? riders.map((row) => <tr key={String(row.id)}><td>{row.full_name ?? row.name ?? row.rider_name ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.phone ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
