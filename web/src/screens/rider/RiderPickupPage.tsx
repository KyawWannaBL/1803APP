import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { useI18n } from '@/i18n/I18nProvider';
import { QRScanPanel } from '@/components/QRScanPanel';
import { MapboxPanel } from '@/components/MapboxPanel';
import { confirmPickup, fetchRiderWorkspace, type GenericRecord } from '@/services/repositories';

export function RiderPickupPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [tasks, setTasks] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchRiderWorkspace(user?.id);
    const pickupTasks = workspace.tasks.filter((row) => String(row.status) === 'accepted');
    setTasks(pickupTasks);
    setSelected((current) => current ?? pickupTasks[0] ?? null);
  }

  useEffect(() => { void load(); }, [user?.id]);

  async function handlePickup() {
    if (!selected) {
      setMessage('Select a task first.');
      return;
    }
    const result = await confirmPickup(String(selected.id));
    if (result?.error) {
      setMessage(result.error.message ?? 'Pickup failed.');
      return;
    }
    setMessage('Pickup confirmed.');
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.pickup', 'Pickup')}</div>
        <h1>{t('common.confirmPickup', 'Confirm Pickup')}</h1>
        <p>{t('common.pickupWorkflowNote', 'Scan parcel, verify pickup, and confirm the task before moving to transit.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="section-header">
            <div><div className="section-header__eyebrow">{t('common.pickupTasks', 'Pickup Tasks')}</div><h2>{t('common.availableTasks', 'Available Tasks')}</h2></div>
            <button className="toolbar-button toolbar-button--primary" onClick={() => void handlePickup()}>{t('common.confirmPickup', 'Confirm Pickup')}</button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.taskCode', 'Task Code')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.order', 'Order')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
              <tbody>
                {tasks.length ? tasks.map((row) => (
                  <tr key={String(row.id)} className={selected && String(selected.id) === String(row.id) ? 'row--selected' : ''}>
                    <td>{row.task_code ?? row.id}</td>
                    <td>{row.status ?? '-'}</td>
                    <td>{row.order_id ?? '-'}</td>
                    <td><button className="toolbar-button" onClick={() => setSelected(row)}>{t('common.select', 'Select')}</button></td>
                  </tr>
                )) : <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-main-stack">
          <section className="page-card"><QRScanPanel /></section>
          <section className="page-card"><MapboxPanel /></section>
        </section>
      </div>
    </section>
  );
}
