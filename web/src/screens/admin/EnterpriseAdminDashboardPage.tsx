import { Link } from 'react-router-dom';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function EnterpriseAdminDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, branches, users, settings, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.enterpriseAdmin', 'Enterprise Admin')}</div>
        <h1>{locale === 'en' ? 'Enterprise Admin Dashboard' : 'Enterprise Admin Dashboard'}</h1>
        <p>
          {locale === 'en'
            ? 'Administrative workspace for branch control, company users, enterprise settings, and direct entry into operational portals.'
            : 'branch control, company users, enterprise settings နှင့် operational portals များသို့ direct entry အတွက် administrative workspace ဖြစ်ပါသည်။'}
        </p>
        <KpiStrip metrics={summary} />
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="focus-list">
            <div className="focus-item"><strong>{t('common.branches', 'Branches')}</strong><span>{branches.length}</span></div>
            <div className="focus-item"><strong>{t('common.users', 'Users')}</strong><span>{users.length}</span></div>
            <div className="focus-item"><strong>{t('common.settings', 'Settings')}</strong><span>{settings.length}</span></div>
          </div>
        </section>

        <section className="page-card">
          <div className="quick-link-list">
            <Link to="/enterprise-admin/branches" className="quick-link-card"><div className="quick-link-card__title">{t('common.branches', 'Branches')}</div></Link>
            <Link to="/enterprise-admin/users" className="quick-link-card"><div className="quick-link-card__title">{t('common.usersAndAccess', 'Users & Access')}</div></Link>
            <Link to="/enterprise-admin/settings" className="quick-link-card"><div className="quick-link-card__title">{t('common.settings', 'Settings')}</div></Link>
            <Link to="/enterprise-admin/portal-access" className="quick-link-card"><div className="quick-link-card__title">{t('common.portalAccess', 'Portal Access')}</div></Link>
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.branch', 'Branch')}</th><th>{t('common.status', 'Status')}</th></tr></thead>
            <tbody>
              {branches.length ? branches.slice(0, 10).map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.name ?? row.branch_name ?? row.id}</td>
                  <td>{row.status ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={2}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
