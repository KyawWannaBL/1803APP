import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { advanceManifest, fetchWarehouseWorkspace, type GenericRecord } from '@/services/repositories';

export function WarehouseReceivingBayPage() {
  const { t } = useI18n();
  const [manifests, setManifests] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [bayCode, setBayCode] = useState('RB-01');
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchWarehouseWorkspace();
    const rows = workspace.inbound.filter((row) => ['draft', 'receiving'].includes(String(row.status)));
    setManifests(rows);
    setSelected((current) => current ?? rows[0] ?? null);
  }

  useEffect(() => { void load(); }, []);

  async function startReceiving() {
    if (!selected) {
      setMessage('Select a manifest first.');
      return;
    }
    const result = await advanceManifest('inbound_manifests', String(selected.id), 'receiving', {
      bay_code: bayCode,
      arrival_confirmed: true,
      vehicle_arrived_at: new Date().toISOString(),
    });
    if (result?.error) return setMessage(result.error.message ?? 'Unable to start receiving.');
    setMessage('Receiving started.');
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.receivingBay', 'Receiving Bay')}</div>
        <h1>{t('common.receivingBay', 'Receiving Bay')}</h1>
        <p>{t('common.receivingBayWorkflowNote', 'Assign a receiving bay and start the inbound receiving process.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.manifestCode', 'Manifest Code')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
              <tbody>
                {manifests.length ? manifests.map((row) => (
                  <tr key={String(row.id)} className={selected && String(selected.id) === String(row.id) ? 'row--selected' : ''}>
                    <td>{row.manifest_code ?? row.id}</td>
                    <td>{row.status ?? '-'}</td>
                    <td><button className="toolbar-button" onClick={() => setSelected(row)}>{t('common.select', 'Select')}</button></td>
                  </tr>
                )) : <tr><td colSpan={3}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-card">
          <div className="form-grid">
            <label className="field">
              <span>{t('common.receivingBay', 'Receiving Bay')}</span>
              <input value={bayCode} onChange={(e) => setBayCode(e.target.value)} />
            </label>
          </div>

          <div className="toolbar toolbar--wrap">
            <button className="toolbar-button toolbar-button--primary" onClick={() => void startReceiving()}>{t('common.startReceiving', 'Start Receiving')}</button>
          </div>
        </section>
      </div>
    </section>
  );
}
