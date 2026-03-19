import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { advanceManifest, fetchWarehouseWorkspace, type GenericRecord } from '@/services/repositories';

export function WarehouseOutboundManifestPage() {
  const { t } = useI18n();
  const [manifests, setManifests] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchWarehouseWorkspace();
    setManifests(workspace.outbound);
    setSelected((current) => current ?? workspace.outbound[0] ?? null);
  }

  useEffect(() => { void load(); }, []);

  const status = String(selected?.status ?? 'draft');

  async function move(to: string, extra: Record<string, any> = {}) {
    if (!selected) {
      setMessage('Select a manifest first.');
      return;
    }
    const result = await advanceManifest('outbound_manifests', String(selected.id), to, extra);
    if (result?.error) return setMessage(result.error.message ?? 'Action failed.');
    setMessage(`Outbound manifest moved to ${to}.`);
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.outboundQueue', 'Outbound Queue')}</div>
        <h1>{t('common.outboundManifest', 'Outbound Manifest')}</h1>
        <p>{t('common.outboundWorkflowNote', 'Prepare outbound loading from draft through loading, loaded, and handover states.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>{t('common.manifestCode', 'Manifest Code')}</th><th>{t('common.status', 'Status')}</th><th>{t('common.branch', 'Branch')}</th><th>{t('common.action', 'Action')}</th></tr></thead>
              <tbody>
                {manifests.length ? manifests.map((row) => (
                  <tr key={String(row.id)} className={selected && String(selected.id) === String(row.id) ? 'row--selected' : ''}>
                    <td>{row.manifest_code ?? row.id}</td>
                    <td>{row.status ?? '-'}</td>
                    <td>{row.destination_branch ?? row.origin_branch ?? '-'}</td>
                    <td><button className="toolbar-button" onClick={() => setSelected(row)}>{t('common.select', 'Select')}</button></td>
                  </tr>
                )) : <tr><td colSpan={4}><div className="empty-state">{t('common.noData', 'No data')}</div></td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div><div className="section-header__eyebrow">{t('common.currentManifest', 'Current Manifest')}</div><h2>{selected?.manifest_code ?? t('common.noSelection', 'No selection')}</h2></div>
            <span className="badge">{status}</span>
          </div>

          <div className="toolbar toolbar--wrap">
            <button className="toolbar-button" onClick={() => { if (status !== 'draft') return setMessage('Only draft manifests can start loading.'); void move('loading', { vehicle_no: 'VH-01', driver_name: 'Dispatch Driver', seal_ok: true }); }}>{t('common.startLoading', 'Start Loading')}</button>
            <button className="toolbar-button" onClick={() => { if (status !== 'loading') return setMessage('Manifest must be loading before completion.'); void move('loaded', { load_completed_at: new Date().toISOString(), loaded_count: Number(selected?.expected_count ?? selected?.item_count ?? 0) }); }}>{t('common.completeLoading', 'Complete Loading')}</button>
            <button className="toolbar-button toolbar-button--primary" onClick={() => { if (status !== 'loaded') return setMessage('Manifest must be loaded before closing.'); void move('closed', { handover_signed_at: new Date().toISOString(), seal_checked_at: new Date().toISOString() }); }}>{t('common.closeManifest', 'Close Manifest')}</button>
          </div>
        </section>
      </div>
    </section>
  );
}
