import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { assignDeliveryTask, updateOrderStatus, type GenericRecord } from '@/services/repositories';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

function scoreRider(task: GenericRecord, rider: GenericRecord, allTasks: GenericRecord[]) {
  const riderId = String(rider.id ?? rider.rider_id ?? '');
  const currentLoad = allTasks.filter((row) => String(row.assigned_rider_id ?? '') === riderId && ['assigned','accepted','picked_up','in_transit'].includes(String(row.status))).length;
  const availability = String(rider.status ?? rider.availability_status ?? 'available');
  const zoneMatch = task.zone_id && rider.zone_id && String(task.zone_id) === String(rider.zone_id);
  const branchMatch = task.branch_id && rider.branch_id && String(task.branch_id) === String(rider.branch_id);

  let score = 0;
  if (availability === 'available') score += 50;
  if (zoneMatch) score += 30;
  if (branchMatch) score += 20;
  score -= currentLoad * 10;

  return { rider, riderId, currentLoad, score };
}

export function OperationsAssignmentWorkbenchPage() {
  const { t, locale } = useI18n();
  const { unassignedTasks, riders, tasks, reload, busy, error } = useOperationsWorkspace();
  const [selectedTask, setSelectedTask] = useState<GenericRecord | null>(null);
  const [message, setMessage] = useState('');

  const activeTask = selectedTask ?? unassignedTasks[0] ?? null;
  const suggestions = useMemo(() => {
    if (!activeTask) return [];
    return riders.map((rider) => scoreRider(activeTask, rider, tasks)).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [activeTask, riders, tasks]);

  async function confirmAssign(riderId: string) {
    if (!activeTask) {
      setMessage('Select a task before assigning a rider.');
      return;
    }
    setMessage('');
    const taskResult = await assignDeliveryTask(String(activeTask.id), riderId);
    if (taskResult?.error) return setMessage(taskResult.error.message ?? 'Unable to assign task.');

    if (activeTask.order_id) {
      const orderResult = await updateOrderStatus(String(activeTask.order_id), 'assigned', {
        assigned_rider_id: riderId,
        assigned_at: new Date().toISOString(),
      });
      if (orderResult?.error) return setMessage(orderResult.error.message ?? 'Task assigned but order update failed.');
    }

    setMessage(locale === 'en' ? 'Task assigned successfully.' : 'Task ကို အောင်မြင်စွာ assign လုပ်ပြီးပါပြီ။');
    await reload();
    setSelectedTask(null);
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.assignmentWorkbench', 'Assignment Workbench')}</div>
        <h1>{t('common.assignmentWorkbench', 'Assignment Workbench')}</h1>
        <p>
          {locale === 'en'
            ? 'Manual-first production assignment with ranked rider suggestions, controlled confirmation, and audit-friendly dispatch decisions.'
            : 'Manual-first production assignment၊ ranked rider suggestions၊ controlled confirmation နှင့် audit-friendly dispatch decisions အတွက် workspace ဖြစ်ပါသည်။'}
        </p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.taskCode', 'Task Code')}</th><th>{t('common.order', 'Order')}</th><th>{t('common.type', 'Type')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
              <tbody>
                {unassignedTasks.length ? unassignedTasks.map((row) => (
                  <tr key={String(row.id)} className={activeTask && String(activeTask.id) === String(row.id) ? 'row--selected' : ''}>
                    <td>{row.task_code ?? row.id}</td>
                    <td>{row.order_id ?? '-'}</td>
                    <td>{row.task_type ?? '-'}</td>
                    <td><button className="toolbar-button" onClick={() => setSelectedTask(row)}>{t('common.select', 'Select')}</button></td>
                  </tr>
                )) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.rider', 'Rider')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.currentLoad', 'Current Load')}</th><th>{t('common.score', 'Score')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
              <tbody>
                {suggestions.length ? suggestions.map((item) => (
                  <tr key={item.riderId}>
                    <td>{item.rider.name ?? item.rider.full_name ?? item.rider.rider_code ?? item.riderId}</td>
                    <td>{item.rider.status ?? item.rider.availability_status ?? '-'}</td>
                    <td>{item.currentLoad}</td>
                    <td>{item.score}</td>
                    <td><button className="toolbar-button toolbar-button--primary" onClick={() => void confirmAssign(item.riderId)}>{t('common.assign', 'Assign')}</button></td>
                  </tr>
                )) : <tr><td colSpan={5}><div className="empty-state">{t('common.noRecommendation', 'No recommendation')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
