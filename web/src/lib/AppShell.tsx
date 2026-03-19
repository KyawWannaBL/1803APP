import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import screens from '@/data/screenCatalog.json';
import portals from '@/data/portalConfig.json';
import { useAuth } from '@/auth/AuthProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useI18n } from '@/i18n/I18nProvider';

type PortalMeta = {
  name_en: string;
  name_mm: string;
  base: string;
  roles: string[];
};

export function AppShell() {
  const { user, signOut } = useAuth();
  const { locale, t } = useI18n();
  const location = useLocation();

  const allowedScreens = screens.filter((item) => user && item.roles.includes(user.role));

  const grouped = Object.entries(portals as Record<string, PortalMeta>)
    .filter(([, portal]) => user && portal.roles.includes(user.role))
    .map(([key, portal]) => ({
      key,
      name: locale === 'en' ? portal.name_en : portal.name_mm,
      base: portal.base,
      items: allowedScreens.filter((screen) => screen.portal === key),
    }));

  const activeScreen = allowedScreens.find(
    (screen) => screen.route === location.pathname || screen.legacy_route === location.pathname,
  );

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="brand">
          <Link to="/portal-home">{t('app.name')}</Link>
          <span>{t('app.tagline')}</span>
        </div>

        <nav className="nav">
          <NavLink to="/portal-home" end className="nav__home">
            {t('common.portalDirectory', 'Portal Directory')}
          </NavLink>

          {grouped.map((portal) => (
            <div key={portal.key} className="nav__group">
              <NavLink to={portal.base} className="nav__portal-link">
                {portal.name}
              </NavLink>

              <div className="nav__group-title">
                {portal.items.length} {t('common.screens', 'screens')}
              </div>

              <div className="nav__screen-list">
                {portal.items.slice(0, 10).map((item) => (
                  <NavLink key={item.code} to={item.route}>
                    {t(`screens.${item.code}.title`, locale === 'en' ? item.title_en : item.title_mm)}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
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
                ? t(
                    `screens.${activeScreen.code}.title`,
                    locale === 'en' ? activeScreen.title_en : activeScreen.title_mm,
                  )
                : t('common.portalDirectory', 'Portal Directory')}
            </strong>

            <div className="muted">
              {user?.fullName} · {t(`roles.${user?.role ?? 'EA'}`, user?.role ?? 'EA')}
            </div>
          </div>

          <div className="toolbar">
            <LanguageToggle />
            <button
              className="toolbar-button"
              type="button"
              onClick={() => void signOut()}
            >
              {t('common.logout', 'Logout')}
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}