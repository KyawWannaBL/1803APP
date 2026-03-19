import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { advanceManifest, fetchWarehouseWorkspace, type GenericRecord } from '@/services/repositories';

export function WarehouseLoadConfirmationPage() {
  const { t } = useI18n();
  const [manifests, setManifests] = useState<GenericRecord[]>([]);
  const [selected, setSelected] = useState<GenericRecord | null>(null);
  const [message, setMessage] = useState('');

  async function load() {
    const workspace = await fetchWarehouseWorkspace();
    const rows = workspace.outbound.filter((row) => String(row.status) === 'loading');
    setManifests(rows);
    setSelected((current) => current ?? rows[0] ?? null);
  }

  useEffect(() => { void load(); }, []);

  async function confirmLoad() {
    if (!selected) {
      setMessage('Select a manifest first.');
      return;
    }
    const result = await advanceManifest('outbound_manifests', String(selected.id), 'loaded', {
      load_completed_at: new Date().toISOString(),
      loaded_count: Number(selected.expected_count ?? selected.item_count ?? 0),
    });
    if (result?.error) return setMessage(result.error.message ?? 'Unable to confirm load.');
    setMessage('Load confirmed.');
    await load();
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.loadConfirmation', 'Load Confirmation')}</div>
        <h1>{t('common.loadConfirmation', 'Load Confirmation')}</h1>
        <p>{t('common.loadConfirmationWorkflowNote', 'Confirm that manifest loading is complete before dispatch handover.')}</p>
      </article>

      {message ? <section className="page-card"><div className="callout">{message}</div></section> : null}

      <section className="page-card">
        <div className="section-header">
          <div><div className="section-header__eyebrow">{t('common.loadingQueue', 'Loading Queue')}</div><h2>{t('common.loadConfirmation', 'Load Confirmation')}</h2></div>
          <button className="toolbar-button toolbar-button--primary" onClick={() => void confirmLoad()}>{t('common.confirmLoad', 'Confirm Load')}</button>
        </div>

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
    </section>
  );
}
