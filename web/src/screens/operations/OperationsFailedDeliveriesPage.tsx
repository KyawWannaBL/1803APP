import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { updateDeliveryTaskStatus, updateOrderStatus } from '@/services/repositories';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsFailedDeliveriesPage() {
  const { t, locale } = useI18n();
  const { failedTasks, reload, error } = useOperationsWorkspace();
  const [message, setMessage] = useState('');

  async function move(taskId: string, orderId: string | null, mode: 'reattempt_pending' | 'return_pending') {
    const taskResult = await updateDeliveryTaskStatus(taskId, 'failed', { next_action: mode });
    if (taskResult?.error) return setMessage(taskResult.error.message ?? 'Unable to update task.');
    if (orderId) {
      const orderResult = await updateOrderStatus(orderId, mode, { next_action: mode });
      if (orderResult?.error) return setMessage(orderResult.error.message ?? 'Order update failed.');
    }
    setMessage(locale === 'en' ? `Marked as ${mode}.` : `${mode} အဖြစ် သတ်မှတ်ပြီးပါပြီ။`);
    await reload();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.failedDeliveries', 'Failed Deliveries')}</div>
        <h1>{t('common.failedDeliveries', 'Failed Deliveries')}</h1>
        <p>{t('common.failedDeliveryWorkflowNote', 'Review failed delivery tasks and route them to reattempt or return processing.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.taskCode', 'Task Code')}</th><th>{t('common.order', 'Order')}</th><th>{t('common.reason', 'Reason')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
            <tbody>
              {failedTasks.length ? failedTasks.map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.task_code ?? row.id}</td>
                  <td>{row.order_id ?? '-'}</td>
                  <td>{row.failure_reason ?? '-'}</td>
                  <td>
                    <div className="toolbar toolbar--wrap">
                      <button className="toolbar-button" onClick={() => void move(String(row.id), row.order_id ? String(row.order_id) : null, 'reattempt_pending')}>{t('common.sendToReattempt', 'Send to Reattempt')}</button>
                      <button className="toolbar-button toolbar-button--primary" onClick={() => void move(String(row.id), row.order_id ? String(row.order_id) : null, 'return_pending')}>{t('common.sendToReturn', 'Send to Return')}</button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
