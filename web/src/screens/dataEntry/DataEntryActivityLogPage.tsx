import { useI18n } from '@/i18n/I18nProvider';
import { useDataEntryWorkspace } from '@/screens/dataEntry/useDataEntryWorkspace';

export function DataEntryActivityLogPage() {
  const { t } = useI18n();
  const { activityLogs, busy, error } = useDataEntryWorkspace();

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.activityLog', 'Activity Log')}</div>
        <h1>{t('common.activityLog', 'Activity Log')}</h1>
        <p>{t('common.activityLogWorkflowNote', 'Review intake-level workflow events, audit traces, and processing milestones.')}</p>
      </article>
      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      <section className="page-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t('common.event', 'Event')}</th><th>{t('common.reference', 'Reference')}</th><th>{t('common.user', 'User')}</th></tr></thead><tbody>{activityLogs.length ? activityLogs.map((row) => <tr key={String(row.id)}><td>{row.action ?? row.event_name ?? row.name ?? row.id}</td><td>{row.reference_no ?? row.entity_id ?? '-'}</td><td>{row.user_id ?? row.actor_id ?? '-'}</td></tr>) : <tr><td colSpan={3}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}</tbody></table></div></section>
    </section>
  );
}
