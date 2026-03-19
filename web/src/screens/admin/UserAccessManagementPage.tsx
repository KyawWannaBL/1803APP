import { useI18n } from '@/i18n/I18nProvider';
import { useAdminWorkspace } from '@/screens/admin/useAdminWorkspace';

export function UserAccessManagementPage({ mode }: { mode: 'super-admin' | 'enterprise-admin' }) {
  const { t } = useI18n();
  const { users, busy, error } = useAdminWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.usersAndAccess', 'Users & Access')}</div>
        <h1>{mode === 'super-admin' ? t('common.globalUserAccess', 'Global User Access') : t('common.enterpriseUserAccess', 'Enterprise User Access')}</h1>
        <p>{t('common.userAccessWorkflowNote', 'Review users, status, role assignment, and access governance details.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.user', 'User')}</th><th>{t('common.role', 'Role')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.email', 'Email')}</th></tr></thead><tbody>{users.length ? users.map((row) => <tr key={String(row.id)}><td>{row.full_name ?? row.name ?? row.id}</td><td>{row.role ?? row.role_code ?? '-'}</td><td>{row.status ?? '-'}</td><td>{row.email ?? '-'}</td></tr>) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
