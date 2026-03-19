import { useI18n } from '@/i18n/I18nProvider';
import { useSupportWorkspace } from '@/screens/support/useSupportWorkspace';

export function SupportCustomerHistoryPage() {
  const { t } = useI18n();
  const { customers, busy, error } = useSupportWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.customerHistory', 'Customer History')}</div>
        <h1>{t('common.customerHistory', 'Customer History')}</h1>
        <p>{t('common.customerHistoryWorkflowNote', 'Review customer profiles, contacts, and historical relationship context for support cases.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.customer', 'Customer')}</th><th>{t('common.phone', 'Phone')}</th><th>{t('common.email', 'Email')}</th><th>{t('common.status', 'Status')}</th></tr></thead><tbody>{customers.length ? customers.map((row) => <tr key={String(row.id)}><td>{row.full_name ?? row.customer_name ?? row.name ?? row.id}</td><td>{row.phone ?? '-'}</td><td>{row.email ?? '-'}</td><td>{row.status ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
