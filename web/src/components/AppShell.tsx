import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import screens from '@/data/screenCatalog.json';
import portals from '@/data/portalConfig.json';
import { useAuth } from '@/auth/AuthProvider';
import { env } from '@/lib/env';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useI18n } from '@/i18n/I18nProvider';
import { ActivityTimelineWidget } from '@/components/ActivityTimelineWidget';
import { TaskInboxPanel } from '@/components/TaskInboxPanel';
import { CommandPalette } from '@/components/CommandPalette';
import { inferPortalFromPath, getPortalBase, getRoleLanding } from '@/lib/roleRouting';

type PortalMeta = { name_en: string; name_mm: string; base: string; roles: string[] };

const curatedMenus: Record<string, Array<[string, string]>> = {
  rider: [['/rider/dashboard', 'Dashboard'], ['/rider/assigned-tasks', 'Assigned Tasks'], ['/rider/pickup', 'Pickup'], ['/rider/delivery', 'Delivery'], ['/rider/incidents', 'Incidents']],
  warehouse_hub_operations: [['/warehouse/dashboard', 'Dashboard'], ['/warehouse/inbound-manifest', 'Inbound Manifest'], ['/warehouse/receiving-bay', 'Receiving Bay'], ['/warehouse/cargo-receiving-scan', 'Cargo Receiving Scan'], ['/warehouse/shortage-damage-entry', 'Shortage / Damage Entry'], ['/warehouse/outbound-manifest', 'Outbound Manifest'], ['/warehouse/vehicle-load-verification', 'Vehicle Load Verification'], ['/warehouse/load-confirmation', 'Load Confirmation'], ['/warehouse/dispatch-handover', 'Dispatch Handover']],
  operations_dispatch: [['/operations/dashboard', 'Dashboard'], ['/operations/control-room', 'Control Room'], ['/operations/new-orders', 'New Orders'], ['/operations/assignment-workbench', 'Assignment Workbench'], ['/operations/rider-availability', 'Rider Availability'], ['/operations/in-transit-board', 'In Transit Board'], ['/operations/sla-risk-board', 'SLA Risk Board'], ['/operations/failed-deliveries', 'Failed Deliveries'], ['/operations/returns', 'Returns'], ['/operations/escalations', 'Escalations']],
  finance: [['/finance/dashboard', 'Dashboard'], ['/finance/cod-reconciliation', 'COD Reconciliation'], ['/finance/settlement-queue', 'Settlement Queue'], ['/finance/invoices', 'Invoices'], ['/finance/payment-records', 'Payment Records'], ['/finance/rider-payouts', 'Rider Payouts'], ['/finance/merchant-ledger', 'Merchant Ledger'], ['/finance/refund-review', 'Refund Review']],
  customer_support: [['/support/dashboard', 'Dashboard'], ['/support/ticket-inbox', 'Ticket Inbox'], ['/support/order-search', 'Order Search'], ['/support/customer-history', 'Customer History'], ['/support/complaint-logging', 'Complaint Logging'], ['/support/escalation-queue', 'Escalation Queue'], ['/support/knowledge-base', 'Knowledge Base']],
  merchant: [['/merchant/dashboard', 'Dashboard'], ['/merchant/create-order', 'Create Order'], ['/merchant/bulk-upload', 'Bulk Upload'], ['/merchant/orders', 'Orders'], ['/merchant/tracking', 'Tracking'], ['/merchant/returns', 'Returns'], ['/merchant/invoices', 'Invoices'], ['/merchant/settings', 'Settings']],
  customer: [['/customer/dashboard', 'Dashboard'], ['/customer/create-request', 'Create Request'], ['/customer/orders', 'My Orders'], ['/customer/tracking', 'Tracking'], ['/customer/support-tickets', 'My Tickets'], ['/customer/profile', 'Profile'], ['/customer/preferences', 'Preferences']],
  super_admin: [['/sys/dashboard', 'SYS Dashboard'], ['/super-admin/dashboard', 'Super Admin Dashboard'], ['/enterprise-admin/dashboard', 'Enterprise Admin'], ['/operations/dashboard', 'Operations'], ['/finance/dashboard', 'Finance'], ['/support/dashboard', 'Support']],
  enterprise_admin: [['/enterprise-admin/dashboard', 'Dashboard'], ['/branch-office/dashboard', 'Branch Office'], ['/data-entry/dashboard', 'Data Entry'], ['/supervisor/dashboard', 'Supervisor'], ['/bi/dashboard', 'BI / Reporting']],
  data_entry: [['/data-entry/dashboard', 'Dashboard']],
  supervisor: [['/supervisor/dashboard', 'Dashboard']],
  branch_office: [['/branch-office/dashboard', 'Dashboard']],
  bi_reporting: [['/bi/dashboard', 'Dashboard']],
};

export function AppShell() {
  const { user, signOut, mode } = useAuth();
  const { locale, t } = useI18n();
  const location = useLocation();
  const [openPortal, setOpenPortal] = useState<string | null>(null);

  const landing = getRoleLanding(user?.role);

  const allowedScreens = useMemo(
    () => (!user ? [] : screens.filter((i) => i.roles.includes(user.role))),
    [user],
  );

  const activeScreen = allowedScreens.find(
    (s) => s.route === location.pathname || s.legacy_route === location.pathname,
  );
  const activePortalKey = activeScreen?.portal ?? inferPortalFromPath(location.pathname);
  const portalMap = portals as Record<string, PortalMeta>;

  const roleMismatch =
    activePortalKey &&
    portalMap[activePortalKey] &&
    user &&
    !portalMap[activePortalKey].roles.includes(user.role);

  const grouped = useMemo(() => {
    return Object.entries(portalMap)
      .filter(([, p]) => user && p.roles.includes(user.role))
      .map(([key, p]) => ({
        key,
        name: locale === 'en' ? p.name_en : p.name_mm,
        base: getPortalBase(key, p.base),
        items: allowedScreens.filter((s) => s.portal === key),
      }))
      .sort((a, b) => (a.key === activePortalKey ? -1 : b.key === activePortalKey ? 1 : 0));
  }, [allowedScreens, activePortalKey, locale, user]);

  const expanded = openPortal ?? activePortalKey ?? grouped[0]?.key ?? null;

  const commandItems = useMemo(
    () =>
      grouped.flatMap((portal) => {
        const curated = curatedMenus[portal.key];
        if (curated) {
          return curated.map(([route, title]) => ({
            id: `${portal.key}:${route}`,
            title,
            subtitle: portal.name,
            route,
          }));
        }

        return portal.items.map((item) => ({
          id: item.code,
          title: t(`screens.${item.code}.title`, locale === 'en' ? item.title_en : item.title_mm),
          subtitle: portal.name,
          route: item.route,
        }));
      }),
    [grouped, locale, t],
  );

  if (roleMismatch) {
    return <Navigate to={landing.path} replace />;
  }

  return (
    <div className="shell shell--premium">
      <aside className="shell__sidebar">
        <div className="brand glass-card">
          <Link to="/portal-directory">Britium Enterprise Delivery Platform</Link>
          <span>
            Role-aware enterprise shell with realtime monitoring, workflow orchestration, and operational controls.
          </span>
          <div className="shell__meta">
            <span className={`status-chip ${mode === 'demo' ? 'status-chip--warn' : 'status-chip--ok'}`}>
              {mode === 'demo' ? 'Demo mode' : 'Backend mode'}
            </span>
            <span className="status-chip">{env.appEnv}</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink to={landing.path} end className="nav__home">
            Smart landing
          </NavLink>
          <NavLink to="/portal-directory" className="nav__secondary-link">
            {t('common.portalDirectory', 'Portal Directory')}
          </NavLink>

          {grouped.map((portal) => {
            const isOpen = expanded === portal.key;
            const menu = curatedMenus[portal.key];
            return (
              <div key={portal.key} className="nav__group">
                <button
                  type="button"
                  className={`nav__accordion ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpenPortal(isOpen ? null : portal.key)}
                >
                  <span>{portal.name}</span>
                  <span className="nav__count">{menu ? menu.length : portal.items.length}</span>
                </button>
                {isOpen ? (
                  <div className="nav__panel">
                    <NavLink to={portal.base} className="nav__portal-link">
                      {t('common.openPortal', 'Open Portal')}
                    </NavLink>
                    <div className="nav__screen-list">
                      {(menu
                        ? menu.map(([route, title]) => ({ route, title }))
                        : portal.items.slice(0, 10).map((item) => ({
                            route: item.route,
                            title: t(`screens.${item.code}.title`, locale === 'en' ? item.title_en : item.title_mm),
                          }))).map((item) => (
                        <NavLink key={item.route} to={item.route}>
                          {item.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <TaskInboxPanel userRole={user?.role} />
      </aside>

      <main className="shell__content">
        <header className="shell__topbar glass-card">
          <div>
            <div className="page-eyebrow">
              {activeScreen
                ? t(`menus.${activeScreen.menu}`, activeScreen.menu)
                : landing.label}
            </div>
            <strong className="page-title">
              {activeScreen
                ? t(`screens.${activeScreen.code}.title`, locale === 'en' ? activeScreen.title_en : activeScreen.title_mm)
                : `${landing.label} Workspace`}
            </strong>
            <div className="muted">{user?.fullName} · {t(`roles.${user?.role ?? 'USER'}`, user?.role ?? 'USER')}</div>
          </div>

          <div className="toolbar">
            <CommandPalette items={commandItems} />
            <LanguageToggle />
            <button className="toolbar-button" type="button" onClick={() => void signOut()}>
              {t('common.logout', 'Logout')}
            </button>
          </div>
        </header>

        <div className="shell__content-grid">
          <section className="shell__main">
            <Outlet />
          </section>
          <aside className="shell__right-rail">
            <ActivityTimelineWidget />
          </aside>
        </div>
      </main>
    </div>
  );
}