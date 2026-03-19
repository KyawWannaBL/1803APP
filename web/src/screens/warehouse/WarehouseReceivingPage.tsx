import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { fetchDataset, advanceManifest, logWarehouseException, type GenericRecord } from '@/services/repositories';

export function WarehouseReceivingPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<GenericRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [issueNote, setIssueNote] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const data = await fetchDataset('inbound_manifests', 30);
    setRows(data);
    if (data[0] && !selectedId) setSelectedId(String(data[0].id));
  }

  useEffect(() => {
    void load();
  }, []);

  const selected = useMemo(
    () => rows.find((row) => String(row.id) === selectedId) ?? null,
    [rows, selectedId],
  );

  async function proceed(status: string, extra: Record<string, any> = {}) {
    if (!selected) return;
    const result = await advanceManifest('inbound_manifests', String(selected.id), status, extra);
    setMessage(result.error ? String(result.error.message ?? result.error) : `Inbound manifest moved to ${status}`);
    await load();
  }

  async function reportIssue() {
    if (!selected || !issueNote.trim()) return;
    const result = await logWarehouseException(String(selected.id), issueNote);
    setMessage(result.error ? String(result.error.message ?? result.error) : 'Exception logged');
    setIssueNote('');
  }

  return (
    <div className="page-main-stack">
      <section className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.receiving', 'Receiving')}</div>
        <h1>{t('common.inboundReceivingWorkspace', 'Inbound Receiving Workspace')}</h1>
        <p>
          {t(
            'common.receivingDescription',
            'Receive incoming cargo, capture exceptions, and move inbound manifests through controlled receiving steps.',
          )}
        </p>
      </section>

      {message ? <div className="alert-strip">{message}</div> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.inboundManifest', 'Inbound Manifest')}</div>
              <h2>{t('common.receivingQueue', 'Receiving Queue')}</h2>
            </div>
          </div>

          <div className="ops-list">
            {rows.map((row) => (
              <button
                key={String(row.id)}
                type="button"
                className={`ops-select-card ${String(row.id) === selectedId ? 'is-active' : ''}`}
                onClick={() => setSelectedId(String(row.id))}
              >
                <strong>{row.manifest_no}</strong>
                <span>{row.origin_branch} → {row.destination_warehouse}</span>
                <span className="badge">{row.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.currentManifest', 'Current Manifest')}</div>
              <h2>{selected?.manifest_no ?? '—'}</h2>
            </div>
            {selected ? <span className="badge">{selected.status}</span> : null}
          </div>

          {selected ? (
            <>
              <div className="detail-grid">
                <div>
                  <h3>{t('common.origin', 'Origin')}</h3>
                  <p>{selected.origin_branch}</p>
                </div>
                <div>
                  <h3>{t('common.destination', 'Destination')}</h3>
                  <p>{selected.destination_warehouse}</p>
                </div>
              </div>

              <div className="toolbar toolbar--wrap">
                <button className="toolbar-button" type="button" onClick={() => void proceed('receiving', { arrival_confirmed: true })}>
                  {t('common.startReceiving', 'Start Receiving')}
                </button>
                <button className="toolbar-button" type="button" onClick={() => void proceed('staged', { receiving_completed_at: new Date().toISOString() })}>
                  {t('common.completeReceiving', 'Complete Receiving')}
                </button>
                <button className="toolbar-button toolbar-button--primary" type="button" onClick={() => void proceed('reconciled', { reconciled_at: new Date().toISOString() })}>
                  {t('common.reconcile', 'Reconcile')}
                </button>
              </div>

              <div className="field">
                <span>{t('common.exceptionNote', 'Exception Note')}</span>
                <textarea rows={4} value={issueNote} onChange={(event) => setIssueNote(event.target.value)} />
              </div>
              <div className="toolbar">
                <button className="toolbar-button" type="button" onClick={() => void reportIssue()}>
                  {t('common.logException', 'Log Exception')}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">{t('common.noManifestSelected', 'No manifest selected')}</div>
          )}
        </section>
      </div>
    </div>
  );
}
