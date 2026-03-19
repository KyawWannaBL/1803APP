import { useI18n } from '@/i18n/I18nProvider';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';
import { SignaturePanel } from '@/components/SignaturePanel';

export function SupervisorAuditReviewPage() {
  const { t } = useI18n();
  const { auditLogs, busy, error } = useSupervisorWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.auditReview', 'Audit Review')}</div>
        <h1>{t('common.auditReview', 'Audit Review')}</h1>
        <p>{t('common.auditReviewWorkflowNote', 'Review audit trails, exception evidence, and supervisor sign-off capture for critical actions.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <div className="page-grid">
        <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.event', 'Event')}</th><th>{t('common.reference', 'Reference')}</th><th>{t('common.user', 'User')}</th></tr></thead><tbody>{auditLogs.length ? auditLogs.map((row) => <tr key={String(row.id)}><td>{row.action ?? row.event_name ?? row.name ?? row.id}</td><td>{row.reference_no ?? row.entity_id ?? '-'}</td><td>{row.user_id ?? row.actor_id ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
        <section className="page-card"><h2>{t('common.supervisorSignoff', 'Supervisor Sign-off')}</h2><SignaturePanel /></section>
      </div>
    </section>
  );
}
