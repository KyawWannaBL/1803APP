import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { updateOrderStatus } from '@/services/repositories';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsNewOrdersPage() {
  const { t } = useI18n();
  const { newOrders, reload, busy, error } = useOperationsWorkspace();
  const [message, setMessage] = useState('');

  async function validateOrder(orderId: string, status?: string) {
    if (busy) {
      setMessage('Wait for the current validation to finish.');
      return;
    }
    if (status && status !== 'created') {
      setMessage('Only newly created orders can be validated from this screen.');
      return;
    }
    const result = await updateOrderStatus(orderId, 'validated', { validated_at: new Date().toISOString() });
    if (result?.error) return setMessage(result.error.message ?? 'Unable to validate order.');
    setMessage('Order validated.');
    await reload();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.newOrders', 'New Orders')}</div>
        <h1>{t('common.newOrders', 'New Orders')}</h1>
        <p>{t('common.newOrdersWorkflowNote', 'Review newly created orders, validate records, and send them to assignment.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}
      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.customer', 'Customer')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
            <tbody>
              {newOrders.length ? newOrders.map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.order_code ?? row.id}</td>
                  <td>{row.status_code ?? row.status ?? '-'}</td>
                  <td>{row.receiver_name ?? row.customer_name ?? '-'}</td>
                  <td>
                    <button
                      className="toolbar-button toolbar-button--primary"
                      onClick={() => void validateOrder(String(row.id), String(row.status_code ?? row.status))}
                    >
                      {t('common.validate', 'Validate')}
                    </button>
                  </td>
                </tr>
              )) : <tr><td colSpan={4}><div className="empty-state">{busy ? t('common.loading', 'Loading...') : t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
