import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { fetchDataset, advanceManifest, type GenericRecord } from '@/services/repositories';

export function WarehouseDispatchPage() {
  const { t } = useI18n();
  const [rows, setRows] = useState<GenericRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [message, setMessage] = useState('');

  async function load() {
    const data = await fetchDataset('outbound_manifests', 30);
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
    const result = await advanceManifest('outbound_manifests', String(selected.id), status, extra);
    setMessage(result.error ? String(result.error.message ?? result.error) : `Outbound manifest moved to ${status}`);
    await load();
  }

  return (
    <div className="page-main-stack">
      <section className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.dispatch', 'Dispatch')}</div>
        <h1>{t('common.outboundDispatchWorkspace', 'Outbound Dispatch Workspace')}</h1>
        <p>
          {t(
            'common.dispatchDescription',
            'Verify load readiness, confirm vehicle loading, and hand over outbound manifests using controlled workflow steps.',
          )}
        </p>
      </section>

      {message ? <div className="alert-strip">{message}</div> : null}

      <div className="dashboard-grid">
        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.outboundManifest', 'Outbound Manifest')}</div>
              <h2>{t('common.dispatchQueue', 'Dispatch Queue')}</h2>
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
                <span>{row.destination_branch} · {row.vehicle_no}</span>
                <span className="badge">{row.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="page-card">
          <div className="section-header">
            <div>
              <div className="section-header__eyebrow">{t('common.dispatchExecution', 'Dispatch Execution')}</div>
              <h2>{selected?.manifest_no ?? '—'}</h2>
            </div>
            {selected ? <span className="badge">{selected.status}</span> : null}
          </div>

          {selected ? (
            <>
              <div className="detail-grid">
                <div>
                  <h3>{t('common.destination', 'Destination')}</h3>
                  <p>{selected.destination_branch}</p>
                </div>
                <div>
                  <h3>{t('common.vehicle', 'Vehicle')}</h3>
                  <p>{selected.vehicle_no ?? '—'}</p>
                </div>
              </div>

              <div className="toolbar toolbar--wrap">
                <button className="toolbar-button" type="button" onClick={() => void proceed('picked', { item_count: selected.item_count ?? 1 })}>
                  {t('common.pickItems', 'Pick Items')}
                </button>
                <button className="toolbar-button" type="button" onClick={() => void proceed('loaded', { load_completed_at: new Date().toISOString() })}>
                  {t('common.confirmLoad', 'Confirm Load')}
                </button>
                <button className="toolbar-button toolbar-button--primary" type="button" onClick={() => void proceed('handed_over', { handover_signed_at: new Date().toISOString() })}>
                  {t('common.handover', 'Handover')}
                </button>
              </div>

              <div className="callout">
                <strong>{t('common.transitionGuard', 'Transition Guard')}:</strong>{' '}
                {t(
                  'common.dispatchTransitionGuard',
                  'Dispatch cannot proceed to handover until loading is confirmed and manifest evidence is captured.',
                )}
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
