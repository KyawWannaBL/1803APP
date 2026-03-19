import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function BranchRegistryPage() {
  const { t } = useI18n();
  const { branches, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.branches', 'Branches')}</div>
        <h1>{t('common.branches', 'Branches')}</h1>
        <p>{t('common.branchesWorkflowNote', 'Review enterprise branch list, status, and branch-level setup references.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.branch', 'Branch')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{branches.length ? branches.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.branch_name ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.code ?? row.reference_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
