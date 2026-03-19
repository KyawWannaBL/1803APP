import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

const portalLinks = [
  ['/super-admin/dashboard', 'Super Admin'],
  ['/enterprise-admin/dashboard', 'Enterprise Admin'],
  ['/branch-office/dashboard', 'Branch Office'],
  ['/data-entry/dashboard', 'Data Entry'],
  ['/supervisor/dashboard', 'Supervisor'],
  ['/bi/dashboard', 'BI / Reporting'],
  ['/operations/dashboard', 'Operations'],
  ['/warehouse/dashboard', 'Warehouse'],
  ['/rider/dashboard', 'Rider'],
  ['/finance/dashboard', 'Finance'],
  ['/support/dashboard', 'Customer Support'],
  ['/merchant/dashboard', 'Merchant'],
  ['/customer/dashboard', 'Customer'],
  ['/portal-home', 'Portal Directory'],
];

export function PortalAccessHubPage({ mode }: { mode: 'super-admin' | 'enterprise-admin' }) {
  const { t, locale } = useI18n();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.portalAccess', 'Portal Access')}</div>
        <h1>{mode === 'super-admin' ? t('common.globalPortalAccess', 'Global Portal Access') : t('common.enterprisePortalAccess', 'Enterprise Portal Access')}</h1>
        <p>
          {locale === 'en'
            ? 'Authorized admins can directly enter operational portals from this governance hub, including BI / Reporting.'
            : 'Authorized admins များသည် BI / Reporting အပါအဝင် operational portals များသို့ ဤ governance hub မှ တိုက်ရိုက် ဝင်ရောက်နိုင်ပါသည်။'}
        </p>
      </article>

      <section className="page-card">
        <div className="quick-link-list">
          {portalLinks.map(([route, label]) => (
            <Link key={route} to={route} className="quick-link-card">
              <div className="quick-link-card__title">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-card">
        <div className="callout">
          {t('common.portalAccessNote', 'Use RBAC and route guards to ensure each portal only opens for authorized roles. This screen provides the direct entry point from admin portals to all other operational portals.')}
        </div>
      </section>
    </section>
  );
}
