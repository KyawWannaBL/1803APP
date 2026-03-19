import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { WorkflowGatePanel } from '@/components/WorkflowGatePanel';
import { useDataEntryWorkspace } from '@/screens/dataEntry/useDataEntryWorkspace';
import { getPrimaryEntityType } from '@/services/repositories';
import type { WorkflowEntityType } from '@/services/workflowService';
import type { GenericRecord } from '@/services/repositories';

export function DataEntrySubmitApprovalPage() {
  const { t } = useI18n();
  const { draftOrders, busy, error } = useDataEntryWorkspace();
  const [selectedId, setSelectedId] = useState<string>('');
  const workflowEntityType = useMemo(() => getPrimaryEntityType('orders') as WorkflowEntityType, []);
  const selectedRecord = useMemo<GenericRecord | null>(() => {
    if (!selectedId) return draftOrders[0] ?? null;
    return draftOrders.find((row) => String(row.id) === String(selectedId)) ?? draftOrders[0] ?? null;
  }, [draftOrders, selectedId]);

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.submitForApproval', 'Submit for Approval')}</div>
        <h1>{t('common.submitForApproval', 'Submit for Approval')}</h1>
        <p>{t('common.submitForApprovalWorkflowNote', 'Workflow transition is gated so the record should not proceed until required intake steps are complete.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <label className="field">
          <span>{t('common.selectDraftOrder', 'Select Draft Order')}</span>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {draftOrders.map((row) => (
              <option key={String(row.id)} value={String(row.id)}>
                {row.order_code ?? row.reference_no ?? row.id}
              </option>
            ))}
          </select>
        </label>
        {!draftOrders.length && <div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div>}
      </section>

      {selectedRecord ? (
        <section className="page-card">
          <WorkflowGatePanel entityType={workflowEntityType} record={selectedRecord} onTransitioned={() => undefined} />
        </section>
      ) : null}
    </section>
  );
}
