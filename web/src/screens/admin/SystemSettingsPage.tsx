import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function SystemSettingsPage({ mode }: { mode: 'super-admin' | 'enterprise-admin' }) {
  const { t } = useI18n();
  const { settings, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.systemSettings', 'System Settings')}</div>
        <h1>{mode === 'super-admin' ? t('common.systemSettings', 'System Settings') : t('common.enterpriseSettings', 'Enterprise Settings')}</h1>
        <p>{t('common.settingsWorkflowNote', 'Review configurable platform or enterprise settings and setting-value references.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.setting', 'Setting')}</th><th>{t('common.value', 'Value')}</th><th>{t('common.reference', 'Reference')}</th></tr></thead><tbody>{settings.length ? settings.map((row) => <tr key={String(row.id)}><td>{row.key ?? row.name ?? row.id}</td><td>{String(row.value ?? row.setting_value ?? '-')}</td><td>{row.code ?? row.reference_no ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
