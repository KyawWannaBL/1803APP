import { useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useOperationsWorkspace } from '@/screens/operations/useOperationsWorkspace';

export function OperationsReturnsPage() {
  const { t } = useI18n();
  const { orders, error } = useOperationsWorkspace();

  const returns = useMemo(
    () => orders.filter((row) => ['return_pending', 'returned'].includes(String(row.status_code ?? row.status))),
    [orders],
  );

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.returns', 'Returns')}</div>
        <h1>{t('common.returns', 'Returns')}</h1>
        <p>{t('common.returnsWorkflowNote', 'Track reverse logistics and return-to-sender orders after failed delivery decisions.')}</p>
      </article>

      {error ? <section className="page-card"><div className="callout">{error}</div></section> : null}

      <section className="page-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>{t('common.order', 'Order')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.customer', 'Customer')}</th></tr></thead>
            <tbody>
              {returns.length ? returns.map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.order_code ?? row.id}</td>
                  <td>{row.status_code ?? row.status ?? '-'}</td>
                  <td>{row.receiver_name ?? row.customer_name ?? '-'}</td>
                </tr>
              )) : <tr><td colSpan={3}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
