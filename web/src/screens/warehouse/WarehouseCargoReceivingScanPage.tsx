import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { QRScanPanel } from '@/components/QRScanPanel';
import { advanceManifest, fetchWarehouseWorkspace, type GenericRecord } from '@/services/repositories';

export function WarehouseCargoReceivingScanPage() {
  const { t } = useI18n();
  const [manifests, setManifests] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchWarehouseWorkspace();
    const rows = workspace.inbound.filter((row) => String(row.status) === 'receiving');
    setManifests(rows);
    setSelected((current) => current ?? rows[0] ?? null);
  }

  useEffect(() => { void load(); }, []);

  async function confirmScan() {
    if (!selected) {
      setMessage('Select a manifest first.');
      return;
    }
    const expected = Number(selected.expected_count ?? selected.item_count ?? 1);
    const result = await advanceManifest('inbound_manifests', String(selected.id), 'receiving', {
      received_count: expected,
      last_scan_at: new Date().toISOString(),
    });
    if (result?.error) return setMessage(result.error.message ?? 'Unable to confirm scan.');
    setMessage('Receiving scan recorded.');
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.cargoReceivingScan', 'Cargo Receiving Scan')}</div>
        <h1>{t('common.cargoReceivingScan', 'Cargo Receiving Scan')}</h1>
        <p>{t('common.scanInboundWorkflowNote', 'Scan inbound cargo and register receiving evidence before staging.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="section-header">
            <div><div className="section-header__eyebrow">{t('common.scanQueue', 'Scan Queue')}</div><h2>{t('common.receiving', 'Receiving')}</h2></div>
            <button className="toolbar-button toolbar-button--primary" onClick={() => void confirmScan()}>{t('common.confirmScan', 'Confirm Scan')}</button>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.manifestCode', 'Manifest Code')}</th><th>{t('common.receivedCount', 'Received Count')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
              <tbody>
                {manifests.length ? manifests.map((row) => (
                  <tr key={String(row.id)} className={selected && String(selected.id) === String(row.id) ? 'row--selected' : ''}>
                    <td>{row.manifest_code ?? row.id}</td>
                    <td>{row.received_count ?? 0}</td>
                    <td><button className="toolbar-button" onClick={() => setSelected(row)}>{t('common.select', 'Select')}</button></td>
                  </tr>
                )) : <tr><td colSpan={3}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-card">
          <QRScanPanel />
        </section>
      </div>
    </section>
  );
}
