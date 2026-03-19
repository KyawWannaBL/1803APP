import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';
import { useI18n } from '@/i18n/I18nProvider';
import {
  acceptDeliveryTask,
  confirmPickup,
  confirmDelivery,
  failDeliveryTask,
  fetchRiderWorkspace,
  startTransit,
  type GenericRecord,
} from '@/services/repositories';

export function RiderAssignedTasksPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [tasks, setTasks] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchRiderWorkspace(user?.id);
    setTasks(workspace.tasks);
    setSelected((current) => current ?? workspace.tasks[0] ?? null);
  }

  useEffect(() => {
    void load();
  }, [user?.id]);

  const status = String(selected?.status ?? 'assigned');
  const canAccept = status === 'assigned';
  const canPickup = status === 'accepted';
  const canTransit = status === 'picked_up';
  const canDeliver = status === 'in_transit';
  const canFail = status === 'in_transit';

  async function run(label: string, action: () => Promise<any>) {
    if (busy) {
      setMessage('Another rider action is already running.');
      return;
    }
    if (!selected) {
      setMessage('Select a task first.');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      const result = await action();
      if (result?.error) throw result.error;
      setMessage(`${label} successful.`);
      await load();
    } catch (error: any) {
      setMessage(error?.message ?? `${label} failed.`);
    } finally {
      setBusy(false);
    }
  }

  const upcoming = useMemo(
    () => tasks.filter((row) => ['assigned', 'accepted', 'picked_up', 'in_transit'].includes(String(row.status))),
    [tasks],
  );

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('menus.execution', 'Execution')}</div>
        <h1>{t('common.assignedTasks', 'Assigned Tasks')}</h1>
        <p>{t('common.selectTaskToAct', 'Select a task to run rider workflow actions.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="section-header">
            <div><div className="section-header__eyebrow">{t('common.taskList', 'Task List')}</div><h2>{t('common.upcomingTasks', 'Upcoming Tasks')}</h2></div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('common.taskCode', 'Task Code')}</th>
                  <th>{t('common.type', 'Type')}</th>
                  <th>{t('common.status', 'Status')}</th>
                  <th>{t('common.order', 'Order')}</th>
                  <th>{t('common.action', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.length ? upcoming.map((row) => (
                  <tr key={String(row.id)} className={selected && String(selected.id) === String(row.id) ? 'row--selected' : ''}>
                    <td>{row.task_code ?? row.id}</td>
                    <td>{row.task_type ?? '-'}</td>
                    <td>{row.status ?? '-'}</td>
                    <td>{row.order_id ?? '-'}</td>
                    <td><button className="toolbar-button" onClick={() => setSelected(row)}>{t('common.select', 'Select')}</button></td>
                  </tr>
                )) : <tr><td colSpan={5}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div><div className="section-header__eyebrow">{t('common.currentTask', 'Current Task')}</div><h2>{selected?.task_code ?? t('common.noTaskSelected', 'No task selected')}</h2></div>
            <span className="badge">{status}</span>
          </div>

          <div className="toolbar toolbar--wrap">
            <button className="toolbar-button" onClick={() => { if (!selected) return setMessage('Select a task first.'); if (!canAccept) return setMessage('Only assigned tasks can be accepted.'); void run('Accept Task', () => acceptDeliveryTask(String(selected.id))); }}>{t('common.acceptTask', 'Accept Task')}</button>
            <button className="toolbar-button" onClick={() => { if (!selected) return setMessage('Select a task first.'); if (!canPickup) return setMessage('Only accepted tasks can be picked up.'); void run('Confirm Pickup', () => confirmPickup(String(selected.id))); }}>{t('common.confirmPickup', 'Confirm Pickup')}</button>
            <button className="toolbar-button" onClick={() => { if (!selected) return setMessage('Select a task first.'); if (!canTransit) return setMessage('Pickup must be confirmed before transit.'); void run('Start Transit', () => startTransit(String(selected.id))); }}>{t('common.startTransit', 'Start Transit')}</button>
            <button className="toolbar-button toolbar-button--primary" onClick={() => { if (!selected) return setMessage('Select a task first.'); if (!canDeliver) return setMessage('Task must be in transit before delivery can be completed.'); void run('Complete Delivery', () => confirmDelivery(String(selected.id))); }}>{t('common.completeDelivery', 'Complete Delivery')}</button>
            <button className="toolbar-button" onClick={() => { if (!selected) return setMessage('Select a task first.'); if (!canFail) return setMessage('Only in-transit tasks can be marked as failed.'); void run('Failed Attempt', () => failDeliveryTask(String(selected.id), 'Customer unavailable')); }}>{t('common.failedAttempt', 'Failed Attempt')}</button>
          </div>

          <div className="callout">
            <strong>{t('common.nextRecommendedFlow', 'Next recommended flow')}:</strong>{' '}
            <Link to="/rider/pickup">{t('common.openPickupWorkspace', 'Open pickup workspace')}</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
