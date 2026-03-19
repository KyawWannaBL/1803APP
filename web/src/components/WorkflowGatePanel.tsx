import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import type { GenericRecord } from '@/services/repositories';
import {
  evaluateTransitionRequirements,
  getTransitions,
  transitionEntity,
  type WorkflowEntityType,
} from '@/services/workflowService';

type Props = {
  entityType: string;
  record: GenericRecord | null;
  onTransitioned?: () => void;
};

function getCurrentState(entityType: string, record: GenericRecord | null) {
  if (!record) return 'created';
  if (entityType === 'order') return String(record.status_code ?? record.status ?? 'created');
  return String(record.status ?? 'created');
}

export function WorkflowGatePanel({ entityType, record, onTransitioned }: Props) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const currentStatus = getCurrentState(entityType, record);
  const transitions = useMemo(
    () => getTransitions(entityType as WorkflowEntityType, currentStatus),
    [entityType, currentStatus],
  );
  const nextTransition = transitions[0] ?? null;
  const requirements = useMemo(
    () => evaluateTransitionRequirements(record ?? {}, nextTransition?.requirements ?? []),
    [record, nextTransition],
  );
  const unmet = requirements.filter((item) => !item.passed);

  async function handleProceed() {
    if (!record) {
      setMessage('Select a record before running workflow.');
      return;
    }
    if (!nextTransition) {
      setMessage('No further transition is available for this record.');
      return;
    }
    if (unmet.length) {
      setMessage('Complete the missing workflow evidence before continuing.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const result = await transitionEntity(
        entityType as WorkflowEntityType,
        String(record.id),
        nextTransition.action,
        {
          from: currentStatus,
          to: nextTransition.to,
          context: {
            updated_at: new Date().toISOString(),
            signature_captured: true,
            handover_signed_at: new Date().toISOString(),
            seal_checked_at: new Date().toISOString(),
          },
        },
      );

      if (result.error) {
        setMessage(result.error.message ?? 'Transition failed.');
        return;
      }

      setMessage(`Transitioned from ${currentStatus} to ${nextTransition.to}.`);
      await onTransitioned?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page-card">
      <div className="widget-card__title widget-card__title--space">
        <strong>{t('common.workflowControl', 'Workflow Control')}</strong>
        <span className="badge">{entityType}</span>
      </div>

      {!record ? (
        <div className="empty-state">
          {t('common.selectRecordForWorkflow', 'Select a record to control workflow transitions.')}
        </div>
      ) : (
        <div className="workflow-transition-grid">
          <div className="transition-card">
            <div className="transition-card__header">
              <strong>{t('common.currentStatus', 'Current Status')}</strong>
              <span className="badge">{currentStatus}</span>
            </div>
            <div className="muted">
              {nextTransition
                ? `${t('common.nextStep', 'Next Step')}: ${nextTransition.to}`
                : t('common.noFurtherTransition', 'No further transition available')}
            </div>
          </div>

          <div className="transition-card">
            <strong>{t('common.requiredCompletion', 'Required completion')}</strong>
            <div className="checklist">
              {requirements.length ? (
                requirements.map((item) => (
                  <div key={item.key} className={item.passed ? 'checklist__pass' : 'checklist__fail'}>
                    {item.passed ? '✓' : '✕'} {item.key}
                  </div>
                ))
              ) : (
                <div className="checklist__pass">
                  ✓ {t('common.allRequirementsSatisfied', 'All requirements satisfied')}
                </div>
              )}
            </div>

            <div className="toolbar">
              <button
                type="button"
                className="toolbar-button toolbar-button--primary"
                onClick={() => void handleProceed()}
              >
                {busy
                  ? t('common.processing', 'Processing…')
                  : nextTransition
                  ? `${t('common.proceedTo', 'Proceed to')} ${nextTransition.to}`
                  : t('common.completed', 'Completed')}
              </button>
            </div>
          </div>
        </div>
      )}

      {message ? <div className="callout">{message}</div> : null}
    </section>
  );
}