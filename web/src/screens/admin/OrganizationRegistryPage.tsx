import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function OrganizationRegistryPage({ mode }: { mode: 'super-admin' | 'enterprise-admin' }) {
  const { t } = useI18n();
  const { organizations, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{mode === 'super-admin' ? t('common.organizations', 'Organizations') : t('common.registry', 'Registry')}</div>
        <h1>{t('common.organizations', 'Organizations')}</h1>
        <p>{t('common.organizationsWorkflowNote', 'Review organization-level registry data, status, and reference codes.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.organization', 'Organization')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{organizations.length ? organizations.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.organization_name ?? row.id}</td><td>{row.status ?? '-'}</td><td>{row.code ?? row.reference_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
