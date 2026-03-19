import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { advanceManifest, fetchWarehouseWorkspace, type GenericRecord } from '@/services/repositories';

export function WarehouseVehicleLoadVerificationPage() {
  const { t } = useI18n();
  const [manifests, setManifests] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [vehicleNo, setVehicleNo] = useState('VH-01');
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchWarehouseWorkspace();
    const rows = workspace.outbound.filter((row) => ['draft', 'loading'].includes(String(row.status)));
    setManifests(rows);
    setSelected((current) => current ?? rows[0] ?? null);
  }

  useEffect(() => { void load(); }, []);

  async function verify() {
    if (!selected) {
      setMessage('Select a manifest first.');
      return;
    }
    const result = await advanceManifest('outbound_manifests', String(selected.id), 'loading', {
      vehicle_no: vehicleNo,
      driver_name: 'Dispatch Driver',
      seal_ok: true,
      seal_checked_at: new Date().toISOString(),
    });
    if (result?.error) return setMessage(result.error.message ?? 'Unable to verify load.');
    setMessage('Vehicle load verification recorded.');
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.vehicleLoadVerification', 'Vehicle Load Verification')}</div>
        <h1>{t('common.vehicleLoadVerification', 'Vehicle Load Verification')}</h1>
        <p>{t('common.vehicleLoadWorkflowNote', 'Verify assigned vehicle, seal checks, and loading readiness before load confirmation.')}</p>
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
              <span>{t('common.vehicleNo', 'Vehicle No')}</span>
              <input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
            </label>
          </div>

          <div className="toolbar toolbar--wrap">
            <button className="toolbar-button toolbar-button--primary" onClick={() => void verify()}>{t('common.verifyLoad', 'Verify Load')}</button>
          </div>
        </section>
      </div>
    </section>
  );
}
