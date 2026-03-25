import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Settings,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { KpiStrip } from '@/components/KpiStrip';
import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

type QuickLinkItem = {
  to: string;
  title: string;
  description: string;
};

export function EnterpriseAdminDashboardPage() {
  const { t, locale } = useI18n();
  const { summary, branches, users, settings, busy, error } = useAdminWorkspace();

  const quickLinks: QuickLinkItem[] = [
    {
      to: '/enterprise-admin/branches',
      title: t('common.branches', 'Branches'),
      description:
        locale === 'en'
          ? 'Manage branch registry, status, and operational readiness.'
          : 'branch registry၊ status နှင့် operational readiness ကို စီမံနိုင်ပါသည်။',
    },
    {
      to: '/enterprise-admin/users',
      title: t('common.usersAndAccess', 'Users & Access'),
      description:
        locale === 'en'
          ? 'Control enterprise users, access assignments, and portal permissions.'
          : 'enterprise users၊ access assignments နှင့် portal permissions ကို စီမံနိုင်ပါသည်။',
    },
    {
      to: '/enterprise-admin/settings',
      title: t('common.settings', 'Settings'),
      description:
        locale === 'en'
          ? 'Maintain enterprise-level configuration and operating policies.'
          : 'enterprise-level configuration နှင့် operating policies များကို ထိန်းသိမ်းနိုင်ပါသည်။',
    },
    {
      to: '/enterprise-admin/portal-access',
      title: t('common.portalAccess', 'Portal Access'),
      description:
        locale === 'en'
          ? 'Open governed routes into operational workspaces.'
          : 'governed operational workspaces များသို့ route access ဖွင့်နိုင်ပါသည်။',
    },
  ];

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '1.25rem',
                display: 'grid',
                placeItems: 'center',
                background:
                  'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(99,102,241,0.22))',
                border: '1px solid rgba(148,163,184,0.22)',
                boxShadow: '0 16px 40px rgba(15,23,42,0.16)',
              }}
            >
              <ShieldCheck size={28} />
            </div>

            <div>
              <div className="page-eyebrow">{t('menus.enterpriseAdmin', 'Enterprise Admin')}</div>
              <h1>{locale === 'en' ? 'Enterprise Admin Dashboard' : 'Enterprise Admin Dashboard'}</h1>
              <p>
                {locale === 'en'
                  ? 'Administrative workspace for branch governance, enterprise users, portal access, and configuration control.'
                  : 'branch governance၊ enterprise users၊ portal access နှင့် configuration control အတွက် administrative workspace ဖြစ်ပါသည်။'}
              </p>
            </div>
          </div>

          <div className="badge-row">
            <span className="badge">
              <Activity size={14} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
              {locale === 'en' ? 'Production' : 'Production'}
            </span>
            <span className="badge">
              {locale === 'en' ? 'Live workspace' : 'Live workspace'}
            </span>
          </div>
        </div>

        <KpiStrip metrics={summary} />
      </article>

      {error ? (
        <section className="page-card">
          <div className="callout">{error}</div>
        </section>
      ) : null}

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">
                {t('common.controlSnapshot', 'Control Snapshot')}
              </div>
              <h2>{locale === 'en' ? 'Enterprise Coverage' : 'Enterprise Coverage'}</h2>
            </div>
          </div>

          <div className="focus-list">
            <div className="focus-item">
              <strong>
                <Building2 size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                {t('common.branches', 'Branches')}
              </strong>
              <span>{branches.length}</span>
            </div>

            <div className="focus-item">
              <strong>
                <Users size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                {t('common.users', 'Users')}
              </strong>
              <span>{users.length}</span>
            </div>

            <div className="focus-item">
              <strong>
                <Settings size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                {t('common.settings', 'Settings')}
              </strong>
              <span>{settings.length}</span>
            </div>
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">
                {t('common.quickAccess', 'Quick Access')}
              </div>
              <h2>{locale === 'en' ? 'Enterprise Actions' : 'Enterprise Actions'}</h2>
            </div>
          </div>

          <div className="quick-link-list">
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className="quick-link-card">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div className="quick-link-card__title">{item.title}</div>
                    <p className="portal-card__description" style={{ marginTop: '.35rem' }}>
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="page-card">
        <div className="section-header">
          <div>
            <div className="section-header__eyebrow">
              {t('common.branchRegistry', 'Branch Registry')}
            </div>
            <h2>{t('common.latestBranches', 'Latest Branches')}</h2>
          </div>

          <Link to="/enterprise-admin/branches" className="toolbar-button toolbar-button--primary">
            {t('common.openBranchRegistry', 'Open Branch Registry')}
          </Link>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.branch', 'Branch')}</th>
                <th>{t('common.status', 'Status')}</th>
                <th>{t('common.reference', 'Reference')}</th>
              </tr>
            </thead>
            <tbody>
              {branches.length ? (
                branches.slice(0, 10).map((row) => (
                  <tr key={String(row.id)}>
                    <td>{row.name ?? row.branch_name ?? row.id}</td>
                    <td>{row.status ?? '-'}</td>
                    <td>{row.code ?? row.branch_code ?? row.reference_no ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>
                    <div className="empty-state">
                      {busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="dashboard-grid dashboard-grid--top">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">
                {t('common.userAdministration', 'User Administration')}
              </div>
              <h2>{t('common.usersAndAccess', 'Users & Access')}</h2>
            </div>
            <Link to="/enterprise-admin/users" className="toolbar-button">
              {t('common.openUsers', 'Open Users')}
            </Link>
          </div>

          <div className="focus-list">
            {users.length ? (
              users.slice(0, 5).map((row) => (
                <div key={String(row.id)} className="focus-item">
                  <strong>{row.full_name ?? row.name ?? row.email ?? row.id}</strong>
                  <span>{row.role_code ?? row.role ?? '-'}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                {busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}
              </div>
            )}
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">
                {t('common.configuration', 'Configuration')}
              </div>
              <h2>{t('common.settings', 'Settings')}</h2>
            </div>
            <Link to="/enterprise-admin/settings" className="toolbar-button">
              {t('common.openSettings', 'Open Settings')}
            </Link>
          </div>

          <div className="focus-list">
            {settings.length ? (
              settings.slice(0, 5).map((row) => (
                <div key={String(row.id)} className="focus-item">
                  <strong>{row.setting_name ?? row.name ?? row.key ?? row.id}</strong>
                  <span>{row.status ?? row.value ?? '-'}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                {busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default EnterpriseAdminDashboardPage;
