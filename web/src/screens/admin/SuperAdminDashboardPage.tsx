import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function SuperAdminDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, organizations, branches, users, roles, permissions, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.superAdmin', 'Super Admin')}</div>
        <h1>{locale === 'en' ? 'Super Admin Dashboard' : 'Super Admin Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Central governance workspace for organizations, branches, roles, users, settings, and direct entry into all platform portals.'
            : 'organizations, branches, roles, users, settings နှင့် platform portals အားလုံးသို့ direct entry အတွက် central governance workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.organizations', 'Organizations')}</strong><span>{organizations.length}</span></div>
            <div className="focus-item"><strong>{t('common.branches', 'Branches')}</strong><span>{branches.length}</span></div>
            <div className="focus-item"><strong>{t('common.users', 'Users')}</strong><span>{users.length}</span></div>
            <div className="focus-item"><strong>{t('common.roles', 'Roles')}</strong><span>{roles.length}</span></div>
            <div className="focus-item"><strong>{t('common.permissions', 'Permissions')}</strong><span>{permissions.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/super-admin/organizations" className="quick-link-card"><div className="quick-link-card__title">{t('common.organizations', 'Organizations')}</div></Link>
            <Link to="/super-admin/users" className="quick-link-card"><div className="quick-link-card__title">{t('common.usersAndAccess', 'Users & Access')}</div></Link>
            <Link to="/super-admin/roles" className="quick-link-card"><div className="quick-link-card__title">{t('common.rolesAndPermissions', 'Roles & Permissions')}</div></Link>
            <Link to="/super-admin/settings" className="quick-link-card"><div className="quick-link-card__title">{t('common.systemSettings', 'System Settings')}</div></Link>
            <Link to="/super-admin/portal-access" className="quick-link-card"><div className="quick-link-card__title">{t('common.portalAccess', 'Portal Access')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.organization', 'Organization')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead>
            <tbody>
              {organizations.length ? organizations.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.name ?? row.organization_name ?? row.id}</td>
                  <td>{row.status ?? '-'}</td>
                  <td>{row.code ?? row.reference_no ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
