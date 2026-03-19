import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function RolePermissionMatrixPage({ mode }: { mode: 'super-admin' | 'enterprise-admin' }) {
  const { t } = useI18n();
  const { roles, permissions, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.rolesAndPermissions', 'Roles & Permissions')}</div>
        <h1>{mode === 'super-admin' ? t('common.globalRoleMatrix', 'Global Role Matrix') : t('common.enterpriseRoleMatrix', 'Enterprise Role Matrix')}</h1>
        <p>{t('common.rolePermissionWorkflowNote', 'Review role definitions and permission catalog entries for governance and enforcement.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <h2>{t('common.roles', 'Roles')}</h2>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.role', 'Role')}</th><th>{t('common.status', 'Status')}</th></tr></thead><tbody>{roles.length ? roles.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.role_code ?? row.id}</td><td>{row.status ?? '-'}</td></tr>) : <tr><td colSpan={2}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div>
        </section>

        <section className="page-card">
          <h2>{t('common.permissions', 'Permissions')}</h2>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.permission', 'Permission')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{permissions.length ? permissions.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.permission_code ?? row.id}</td><td>{row.code ?? row.permission_code ?? '-'}</td></tr>) : <tr><td colSpan={2}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div>
        </section>
      </div>
    </section>
  );
}
