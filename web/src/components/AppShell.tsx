import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import screens from '@/data/screenCatalog.json';
import portals from '@/data/portalConfig.json';
import { useAuth } from '@/auth/AuthProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useI18n } from '@/i18n/I18nProvider';

type PortalMeta = { name_en: string; name_mm: string; base: string; roles: string[] };

const riderMenu = [['/rider/dashboard','Dashboard'],['/rider/assigned-tasks','Assigned Tasks'],['/rider/pickup','Pickup'],['/rider/delivery','Delivery'],['/rider/incidents','Incidents']];
const warehouseMenu = [['/warehouse/dashboard','Dashboard'],['/warehouse/inbound-manifest','Inbound Manifest'],['/warehouse/receiving-bay','Receiving Bay'],['/warehouse/cargo-receiving-scan','Cargo Receiving Scan'],['/warehouse/shortage-damage-entry','Shortage / Damage Entry'],['/warehouse/outbound-manifest','Outbound Manifest'],['/warehouse/vehicle-load-verification','Vehicle Load Verification'],['/warehouse/load-confirmation','Load Confirmation'],['/warehouse/dispatch-handover','Dispatch Handover']];
const operationsMenu = [['/operations/dashboard','Dashboard'],['/operations/control-room','Control Room'],['/operations/new-orders','New Orders'],['/operations/assignment-workbench','Assignment Workbench'],['/operations/rider-availability','Rider Availability'],['/operations/in-transit-board','In Transit Board'],['/operations/sla-risk-board','SLA Risk Board'],['/operations/failed-deliveries','Failed Deliveries'],['/operations/returns','Returns'],['/operations/escalations','Escalations']];
const financeMenu = [['/finance/dashboard','Dashboard'],['/finance/cod-reconciliation','COD Reconciliation'],['/finance/settlement-queue','Settlement Queue'],['/finance/invoices','Invoices'],['/finance/payment-records','Payment Records'],['/finance/rider-payouts','Rider Payouts'],['/finance/merchant-ledger','Merchant Ledger'],['/finance/refund-review','Refund Review']];
const supportMenu = [['/support/dashboard','Dashboard'],['/support/ticket-inbox','Ticket Inbox'],['/support/order-search','Order Search'],['/support/customer-history','Customer History'],['/support/complaint-logging','Complaint Logging'],['/support/escalation-queue','Escalation Queue'],['/support/knowledge-base','Knowledge Base']];
const merchantMenu = [['/merchant/dashboard','Dashboard'],['/merchant/create-order','Create Order'],['/merchant/bulk-upload','Bulk Upload'],['/merchant/orders','Orders'],['/merchant/tracking','Tracking'],['/merchant/returns','Returns'],['/merchant/invoices','Invoices'],['/merchant/settings','Settings']];
const customerMenu = [['/customer/dashboard','Dashboard'],['/customer/create-request','Create Request'],['/customer/orders','My Orders'],['/customer/tracking','Tracking'],['/customer/support-tickets','My Tickets'],['/customer/profile','Profile'],['/customer/preferences','Preferences']];

function portalBase(key: string, base: string) {
  if (key === 'rider') return '/rider/dashboard';
  if (key === 'warehouse_hub_operations') return '/warehouse/dashboard';
  if (key === 'operations_dispatch') return '/operations/dashboard';
  if (key === 'finance') return '/finance/dashboard';
  if (key === 'customer_support') return '/support/dashboard';
  if (key === 'merchant') return '/merchant/dashboard';
  if (key === 'customer' || key === 'customer_portal') return '/customer/dashboard';
  return base;
}

function inferPortalFromPath(pathname: string) {
  if (pathname.startsWith('/rider')) return 'rider';
  if (pathname.startsWith('/warehouse')) return 'warehouse_hub_operations';
  if (pathname.startsWith('/operations')) return 'operations_dispatch';
  if (pathname.startsWith('/finance')) return 'finance';
  if (pathname.startsWith('/support')) return 'customer_support';
  if (pathname.startsWith('/merchant')) return 'merchant';
  if (pathname.startsWith('/customer')) return 'customer';
  if (pathname.startsWith('/super-admin')) return 'super_admin';
  if (pathname.startsWith('/enterprise-admin')) return 'enterprise_admin';
  if (pathname.startsWith('/branch-office')) return 'branch_office';
  if (pathname.startsWith('/data-entry')) return 'data_entry';
  if (pathname.startsWith('/supervisor')) return 'supervisor';
  if (pathname.startsWith('/bi')) return 'bi_reporting';
  return null;
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const { locale, t } = useI18n();
  const location = useLocation();
  const [openPortal, setOpenPortal] = useState<string | null>(null);

  const allowedScreens = useMemo(
    () => (!user ? [] : screens.filter((i) => i.roles.includes(user.role))),
    [user],
  );

  const activeScreen = allowedScreens.find(
    (s) => s.route === location.pathname || s.legacy_route === location.pathname,
  );
  const activePortalKey = activeScreen?.portal ?? inferPortalFromPath(location.pathname);

  const grouped = useMemo(() => {
    return Object.entries(portals as Record<string, PortalMeta>)
      .filter(([, p]) => user && p.roles.includes(user.role))
      .map(([key, p]) => ({
        key,
        name: locale === 'en' ? p.name_en : p.name_mm,
        base: portalBase(key, p.base),
        items: allowedScreens.filter((s) => s.portal === key),
      }))
      .sort((a, b) => (a.key === activePortalKey ? -1 : b.key === activePortalKey ? 1 : 0));
  }, [allowedScreens, activePortalKey, locale, user]);

  const expanded = openPortal ?? activePortalKey ?? grouped[0]?.key ?? null;

  const getMenu = (key: string) => {
    if (key === 'rider') return riderMenu;
    if (key === 'warehouse_hub_operations') return warehouseMenu;
    if (key === 'operations_dispatch') return operationsMenu;
    if (key === 'finance') return financeMenu;
    if (key === 'customer_support') return supportMenu;
    if (key === 'merchant') return merchantMenu;
    if (key === 'customer' || key === 'customer_portal') return customerMenu;
    return null;
  };

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="brand">
          <Link to="/portal-home">Britium Enterprise Delivery Platform</Link>
          <span>
            {locale === 'en'
              ? 'Operational shell with all permitted portals wired to demo and backend data providers.'
              : 'Operational shell with all permitted portals wired to demo and backend data providers.'}
          </span>
        </div>

        <nav className="nav">
          <NavLink to="/portal-home" end className="nav__home">
            {t('common.portalDirectory', 'Portal Directory')}
          </NavLink>
          {grouped.map((portal) => {
            const isOpen = expanded === portal.key;
            const menu = getMenu(portal.key);
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
                      {menu
                        ? menu.map(([route, title]) => <NavLink key={route} to={route}>{title}</NavLink>)
                        : portal.items.slice(0, 8).map((item) => (
                            <NavLink key={item.code} to={item.route}>
                              {t(`screens.${item.code}.title`, locale === 'en' ? item.title_en : item.title_mm)}
                            </NavLink>
                          ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="shell__content">
        <header className="shell__topbar">
          <div>
            <div className="page-eyebrow">
              {activeScreen
                ? t(`menus.${activeScreen.menu}`, activeScreen.menu)
                : t('common.portalDirectory', 'Portal Directory')}
            </div>
            <strong className="page-title">
              {activeScreen
                ? t(`screens.${activeScreen.code}.title`, locale === 'en' ? activeScreen.title_en : activeScreen.title_mm)
                : t('common.portalDirectory', 'Portal Directory')}
            </strong>
            <div className="muted">{user?.fullName} · {t(`roles.${user?.role ?? 'USER'}`, user?.role ?? 'USER')}</div>
          </div>

          <div className="toolbar">
            <LanguageToggle />
            <button className="toolbar-button" type="button" onClick={() => void signOut()}>
              {t('common.logout', 'Logout')}
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}