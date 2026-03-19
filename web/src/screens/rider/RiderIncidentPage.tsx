import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { failDeliveryTask } from '@/services/repositories';

export function RiderIncidentPage() {
  const { t } = useI18n();
  const [taskId, setTaskId] = useState('');
  const [incidentType, setIncidentType] = useState('traffic_delay');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  async function submit() {
    if (!taskId.trim()) {
      setMessage(t('common.taskIdRequired', 'Task ID is required.'));
      return;
    }

    const result = await failDeliveryTask(taskId, `${incidentType}: ${notes || 'Incident reported'}`);
    if (result?.error) {
      setMessage(result.error.message ?? t('common.actionFailed', 'Action failed.'));
      return;
    }

    setMessage(t('common.incidentSubmittedMock', 'Incident logged and task marked as failed.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.incidents', 'Incidents')}</div>
        <h1>{t('common.reportIncident', 'Report Incident')}</h1>
        <p>{t('common.incidentWorkflowNote', 'Log operational issues during rider execution and route them to support or operations.')}</p>
      </article>

      <section className="page-card">
        <div className="form-grid">
          <label className="field">
            <span>{t('common.taskId', 'Task ID')}</span>
            <input value={taskId} onChange={(e) => setTaskId(e.target.value)} />
          </label>

          <label className="field">
            <span>{t('common.incidentType', 'Incident Type')}</span>
            <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
              <option value="traffic_delay">{t('common.trafficDelay', 'Traffic Delay')}</option>
              <option value="customer_unreachable">{t('common.customerUnreachable', 'Customer Unreachable')}</option>
              <option value="address_issue">{t('common.addressIssue', 'Address Issue')}</option>
              <option value="vehicle_issue">{t('common.vehicleIssue', 'Vehicle Issue')}</option>
            </select>
          </label>

          <label className="field">
            <span>{t('common.notes', 'Notes')}</span>
            <textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>

        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={() => void submit()}>
            {t('common.submitIncident', 'Submit Incident')}
          </button>
        </div>

        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
