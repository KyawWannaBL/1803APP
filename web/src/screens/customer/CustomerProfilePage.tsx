import { useI18n } from '@/i18n/I18nProvider';
import { useCustomerWorkspace } from '@/screens/customer/useCustomerWorkspace';

export function CustomerProfilePage() {
  const { t } = useI18n();
  const { profiles, busy, error } = useCustomerWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.profile', 'Profile')}</div>
        <h1>{t('common.profile', 'Profile')}</h1>
        <p>{t('common.profileWorkflowNote', 'Review your customer profile records and registered contact information.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.customer', 'Customer')}</th><th>{t('common.phone', 'Phone')}</th><th>{t('common.email', 'Email')}</th></tr></thead><tbody>{profiles.length ? profiles.map((row) => <tr key={String(row.id)}><td>{row.full_name ?? row.customer_name ?? row.name ?? row.id}</td><td>{row.phone ?? '-'}</td><td>{row.email ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
