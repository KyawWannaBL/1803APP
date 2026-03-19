import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { fetchDataset, type GenericRecord } from '@/services/repositories';
import { transitionEntity } from '@/services/workflowService';

export function OperationsShipmentsPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<GenericRecord[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const data = await fetchDataset('orders', 50);
    setRows(data);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  }, [rows, query]);

  async function runAction(orderId: string, to: string, action: string) {
    const result = await transitionEntity('order', orderId, action, { to, context: { status_code: to } });
    setMessage(result.error ? String(result.error.message ?? result.error) : `Order moved to ${to}`);
    await load();
  }

  return (
    <div className="page-main-stack">
      <section className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.orders', 'Orders')}</div>
        <h1>{t('common.shipmentsWorkspace', 'Shipments Workspace')}</h1>
        <p>
          {t(
            'common.shipmentsWorkspaceDescription',
            'Review orders, filter the queue, and move each shipment through validated operational states.',
          )}
        </p>
      </section>

      {message ? <div className="alert-strip">{message}</div> : null}

      <section className="page-card">
        <div className="section-header">
          <div>
            <div className="section-header__eyebrow">{t('common.shipments', 'Shipments')}</div>
            <h2>{t('common.orderQueue', 'Order Queue')}</h2>
          </div>
          <span className="badge">{filtered.length}</span>
        </div>

        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('common.search', 'Search')}
        />

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('common.order', 'Order')}</th>
                <th>{t('common.receiver', 'Receiver')}</th>
                <th>{t('common.status', 'Status')}</th>
                <th>{t('common.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={String(row.id)}>
                  <td>{row.order_number ?? row.id}</td>
                  <td>{row.receiver_name}<div className="muted">{row.receiver_address}</div></td>
                  <td><span className="badge">{row.status_code ?? row.status}</span></td>
                  <td>
                    <div className="toolbar">
                      <button className="toolbar-button" type="button" onClick={() => void runAction(String(row.id), 'validated', 'validate')}>
                        {t('common.validate', 'Validate')}
                      </button>
                      <button className="toolbar-button" type="button" onClick={() => void runAction(String(row.id), 'assigned', 'assign')}>
                        {t('common.assign', 'Assign')}
                      </button>
                      <button className="toolbar-button toolbar-button--primary" type="button" onClick={() => void runAction(String(row.id), 'delivered', 'deliver')}>
                        {t('common.complete', 'Complete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
