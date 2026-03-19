import { Link } from 'react-router-dom';
import portals from '@/data/portalConfig.json';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/auth/AuthProvider';

type UserLike = { role?: string; fullName?: string };
type PortalMeta = { name_en: string; name_mm: string; base: string; roles: string[] };

function getPortalHome(key: string, base: string) {
  if (key === 'rider') return '/rider/dashboard';
  if (key === 'warehouse_hub_operations') return '/warehouse/dashboard';
  if (key === 'operations_dispatch') return '/operations/dashboard';
  if (key === 'finance') return '/finance/dashboard';
  if (key === 'customer_support') return '/support/dashboard';
  if (key === 'merchant') return '/merchant/dashboard';
  if (key === 'customer' || key === 'customer_portal') return '/customer/dashboard';
  return base;
}

export function PortalLandingPage() {
  const { t, locale } = useI18n();
  const auth = useAuth() as unknown as { user?: UserLike | null };
  const user = auth?.user ?? null;

  const syntheticPortals: Record<string, PortalMeta> = {
    super_admin: { name_en: 'Super Admin', name_mm: 'Super Admin', base: '/super-admin/dashboard', roles: ['SYS', 'SUPER_ADMIN'] },
    enterprise_admin: { name_en: 'Enterprise Admin', name_mm: 'Enterprise Admin', base: '/enterprise-admin/dashboard', roles: ['EA', 'SYS', 'SUPER_ADMIN'] },
    branch_office: { name_en: 'Branch Office', name_mm: 'Branch Office', base: '/branch-office/dashboard', roles: ['BRANCH_MANAGER', 'BRANCH_OFFICER', 'EA', 'SYS', 'SUPER_ADMIN'] },
    data_entry: { name_en: 'Data Entry', name_mm: 'Data Entry', base: '/data-entry/dashboard', roles: ['DATA_ENTRY', 'DE', 'SUPERVISOR', 'EA', 'SYS', 'SUPER_ADMIN'] },
    supervisor: { name_en: 'Supervisor', name_mm: 'Supervisor', base: '/supervisor/dashboard', roles: ['SUPERVISOR', 'SV', 'EA', 'BRANCH_MANAGER', 'SYS', 'SUPER_ADMIN'] },
    bi_reporting: { name_en: 'BI / Reporting', name_mm: 'BI / Reporting', base: '/bi/dashboard', roles: ['SYS', 'SUPER_ADMIN', 'EA', 'BI', 'ANALYST', 'FINANCE_MANAGER'] },
  };

  const mergedPortals = { ...syntheticPortals, ...(portals as Record<string, PortalMeta>) };

  const accessiblePortals = Object.entries(mergedPortals)
    .filter(([, portal]) => user?.role && portal.roles.includes(user.role))
    .map(([key, portal]) => ({
      key,
      title: locale === 'en' ? portal.name_en : portal.name_mm,
      href: getPortalHome(key, portal.base),
      description:
        locale === 'en'
          ? `Open ${portal.name_en} workspace`
          : `${portal.name_mm} workspace ကိုဖွင့်ရန်`,
    }));

  const experienceGroups = [
    {
      title: locale === 'en' ? 'Operations & Fulfillment' : 'Operations & Fulfillment',
      portals: accessiblePortals.filter((item) =>
        ['operations_dispatch', 'warehouse_hub_operations', 'rider', 'branch_office', 'data_entry', 'supervisor'].includes(item.key),
      ),
    },
    {
      title: locale === 'en' ? 'Financial & Support Operations' : 'Financial & Support Operations',
      portals: accessiblePortals.filter((item) =>
        ['finance', 'customer_support', 'bi_reporting', 'enterprise_admin', 'super_admin'].includes(item.key),
      ),
    },
    {
      title: locale === 'en' ? 'Partner & Customer Experience' : 'Partner & Customer Experience',
      portals: accessiblePortals.filter((item) => ['merchant', 'customer', 'customer_portal'].includes(item.key)),
    },
  ].filter((group) => group.portals.length > 0);

  return (
    <section className="landing-shell">
      <article className="landing-hero">
        <div className="page-eyebrow">{t('common.portalDirectory', 'Portal Directory')}</div>
        <h1>{locale === 'en' ? `Welcome back, ${user?.fullName ?? 'Operator'}` : `Welcome back, ${user?.fullName ?? 'Operator'}`}</h1>
        <p>
          {locale === 'en'
            ? 'Every portal below is wired to a navigable route. In demo mode, actions use seeded data. With Supabase credentials, the same routes point at live backend resources.'
            : 'Every portal below is wired to a navigable route. In demo mode, actions use seeded data. With Supabase credentials, the same routes point at live backend resources.'}
        </p>
      </article>

      {experienceGroups.map((group) => (
        <section key={group.title} className="page-main-stack">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.availablePortals', 'Available Portals')}</div>
              <h2>{group.title}</h2>
            </div>
          </div>

          <div className="portal-grid">
            {group.portals.map((portal) => (
              <Link key={portal.key} to={portal.href} className="portal-card">
                <div className="portal-card__title">{portal.title}</div>
                <p className="portal-card__description">{portal.description}</p>
                <div className="portal-card__footer">
                  <span>{t('common.openPortal', 'Open Portal')}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {!experienceGroups.length ? (
        <section className="page-card">
          <div className="empty-state">No portal is assigned to the current user.</div>
        </section>
      ) : null}
    </section>
  );
}