import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { WorkflowGatePanel } from '@/components/WorkflowGatePanel';
import { useSupervisorWorkspace } from '@/screens/supervisor/useSupervisorWorkspace';
import { getPrimaryEntityType } from '@/services/repositories';
import type { WorkflowEntityType } from '@/services/workflowService';
import type { GenericRecord } from '@/services/repositories';

export function SupervisorApprovalQueuePage() {
  const { t } = useI18n();
  const { approvalQueue, busy, error } = useSupervisorWorkspace();
  const [selectedId, setSelectedId] = useState('');
  const workflowEntityType = useMemo(() => getPrimaryEntityType('approvals') as WorkflowEntityType, []);
  const selectedRecord = useMemo<GenericRecord | null>(() => {
    if (!selectedId) return approvalQueue[0] ?? null;
    return approvalQueue.find((row) => String(row.id) === String(selectedId)) ?? approvalQueue[0] ?? null;
  }, [approvalQueue, selectedId]);

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.approvalQueue', 'Approval Queue')}</div>
        <h1>{t('common.approvalQueue', 'Approval Queue')}</h1>
        <p>{t('common.approvalQueueWorkflowNote', 'Review submitted records and enforce transition gating before approval decisions.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <label className="field">
          <span>{t('common.selectApprovalRecord', 'Select Approval Record')}</span>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {approvalQueue.map((row) => (
              <option key={String(row.id)} value={String(row.id)}>
                {row.reference_no ?? row.id}
              </option>
            ))}
          </select>
        </label>
        {!approvalQueue.length && <div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div>}
      </section>

      {selectedRecord ? (
        <section className="page-card">
          <WorkflowGatePanel entityType={workflowEntityType} record={selectedRecord} onTransitioned={() => undefined} />
        </section>
      ) : null}
    </section>
  );
}
