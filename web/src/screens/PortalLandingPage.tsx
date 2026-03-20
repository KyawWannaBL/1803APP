import { Link } from 'react-router-dom';
import portals from '@/data/portalConfig.json';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/auth/AuthProvider';
import { getPortalBase } from '@/lib/roleRouting';
import { PortalCard } from '@/components/PortalCard';
import { TelemetryRail } from '@/components/TelemetryRail';

type UserLike = { role?: string; fullName?: string };
type PortalMeta = { name_en: string; name_mm: string; base: string; roles: string[] };

export function PortalLandingPage() {
  const { t, locale } = useI18n();
  const auth = useAuth() as unknown as { user?: UserLike | null };
  const user = auth?.user ?? null;

  const mergedPortals = portals as Record<string, PortalMeta>;

  const accessiblePortals = Object.entries(mergedPortals)
    .filter(([, portal]) => user?.role && portal.roles.includes(user.role))
    .map(([key, portal]) => ({
      key,
      title: locale === 'en' ? portal.name_en : portal.name_mm,
      href: getPortalBase(key, portal.base),
      description:
        locale === 'en'
          ? `Open ${portal.name_en} workspace`
          : `${portal.name_mm} workspace ကိုဖွင့်ရန်`,
    }));

  const groups = [
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
    <section className="page-main-stack">
      <article className="page-card page-card--hero glass-card">
        <div className="page-eyebrow">{t('common.portalDirectory', 'Portal Directory')}</div>
        <h1>{locale === 'en' ? `Welcome back, ${user?.fullName ?? 'Operator'}` : `Welcome back, ${user?.fullName ?? 'Operator'}`}</h1>
        <p>
          One premium command center for admin, merchant, operations, finance, support, and customer journeys. Use the smart landing route for role-adaptive entry or pick any permitted portal below.
        </p>
        <div className="toolbar">
          <Link to="/portal-home" className="toolbar-button toolbar-button--primary">
            Open smart landing
          </Link>
        </div>
      </article>

      <TelemetryRail />

      {groups.map((group) => (
        <section key={group.title} className="page-main-stack">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.availablePortals', 'Available Portals')}</div>
              <h2>{group.title}</h2>
            </div>
          </div>

          <div className="portal-grid">
            {group.portals.map((portal) => (
              <PortalCard
                key={portal.key}
                name={portal.title}
                description={portal.description}
                route={portal.href}
                count={4}
              />
            ))}
          </div>
        </section>
      ))}

      {!groups.length ? (
        <section className="page-card">
          <div className="empty-state">No portal is assigned to the current user.</div>
        </section>
      ) : null}
    </section>
  );
}

export default PortalLandingPage;