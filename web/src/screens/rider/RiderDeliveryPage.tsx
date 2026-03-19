import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { useI18n } from '@/i18n/I18nProvider';
import { MapboxPanel } from '@/components/MapboxPanel';
import { SignaturePanel } from '@/components/SignaturePanel';
import { QRScanPanel } from '@/components/QRScanPanel';
import { confirmDelivery, fetchRiderWorkspace, startTransit, type GenericRecord } from '@/services/repositories';

export function RiderDeliveryPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [tasks, setTasks] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchRiderWorkspace(user?.id);
    const deliveryTasks = workspace.tasks.filter((row) => ['picked_up', 'in_transit'].includes(String(row.status)));
    setTasks(deliveryTasks);
    setSelected((current) => current ?? deliveryTasks[0] ?? null);
  }

  useEffect(() => { void load(); }, [user?.id]);

  async function handleTransit() {
    if (!selected) {
      setMessage('Select a task first.');
      return;
    }
    if (String(selected.status) !== 'picked_up') {
      setMessage('Only picked-up tasks can start transit.');
      return;
    }
    const result = await startTransit(String(selected.id));
    if (result?.error) return setMessage(result.error.message ?? 'Unable to start transit.');
    setMessage('Transit started.');
    await load();
  }

  async function handleDeliver() {
    if (!selected) {
      setMessage('Select a task first.');
      return;
    }
    if (String(selected.status) !== 'in_transit') {
      setMessage('Task must be in transit before delivery can be completed.');
      return;
    }
    const result = await confirmDelivery(String(selected.id));
    if (result?.error) return setMessage(result.error.message ?? 'Unable to complete delivery.');
    setMessage('Delivery completed.');
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.delivery', 'Delivery')}</div>
        <h1>{t('common.completeDelivery', 'Complete Delivery')}</h1>
        <p>{t('common.deliveryWorkflowNote', 'Start transit, collect proof, then complete the delivery workflow.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="section-header">
            <div><div className="section-header__eyebrow">{t('common.deliveryTasks', 'Delivery Tasks')}</div><h2>{t('common.inProgress', 'In Progress')}</h2></div>
            <div className="toolbar">
              <button className="toolbar-button" onClick={() => void handleTransit()}>{t('common.startTransit', 'Start Transit')}</button>
              <button className="toolbar-button toolbar-button--primary" onClick={() => void handleDeliver()}>{t('common.completeDelivery', 'Complete Delivery')}</button>
            </div>
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
          <section className="page-card"><MapboxPanel /></section>
          <section className="page-card"><QRScanPanel /></section>
          <section className="page-card"><SignaturePanel /></section>
        </section>
      </div>
    </section>
  );
}
