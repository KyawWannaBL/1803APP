import { useI18n } from '@/i18n/I18nProvider';
import { useMerchantWorkspace } from '@/screens/merchant/useMerchantWorkspace';

export function MerchantSettingsPage() {
  const { t } = useI18n();
  const { branches, merchantUsers, busy, error } = useMerchantWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.settings', 'Settings')}</div>
        <h1>{t('common.settings', 'Settings')}</h1>
        <p>{t('common.merchantSettingsWorkflowNote', 'Review merchant branches and user accounts for operational setup.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <h2>{t('common.branches', 'Branches')}</h2>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.branch', 'Branch')}</th><th>{t('common.status', 'Status')}</th></tr></thead><tbody>{branches.length ? branches.map((row) => <tr key={String(row.id)}><td>{row.name ?? row.branch_name ?? row.id}</td><td>{row.status ?? '-'}</td></tr>) : <tr><td colSpan={2}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div>
        </section>

        <section className="page-card">
          <h2>{t('common.users', 'Users')}</h2>
          <div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.user', 'User')}</th><th>{t('common.status', 'Status')}</th></tr></thead><tbody>{merchantUsers.length ? merchantUsers.map((row) => <tr key={String(row.id)}><td>{row.full_name ?? row.name ?? row.email ?? row.id}</td><td>{row.status ?? '-'}</td></tr>) : <tr><td colSpan={2}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div>
        </section>
      </div>
    </section>
  );
}
