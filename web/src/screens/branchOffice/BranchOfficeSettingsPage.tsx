import { useI18n } from '@/i18n/I18nProvider';
import { useBranchOfficeWorkspace } from '@/screens/branchOffice/useBranchOfficeWorkspace';

export function BranchOfficeSettingsPage() {
  const { t } = useI18n();
  const { branches, busy, error } = useBranchOfficeWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.settings', 'Settings')}</div>
        <h1>{t('common.settings', 'Settings')}</h1>
        <p>{t('common.branchSettingsWorkflowNote', 'Review branch-level settings and registry records for local operations.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.branch', 'Branch')}</th><th>{t('common.status', 'Status')}</th></tr></thead><tbody>{branches.length ? branches.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.branch_name ?? row.id}</td><td>{row.status ?? '-'}</td></tr>) : <tr><td colSpan={2}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
