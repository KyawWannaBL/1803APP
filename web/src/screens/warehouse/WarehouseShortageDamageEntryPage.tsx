import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { fetchWarehouseWorkspace, logWarehouseException, type GenericRecord } from '@/services/repositories';

export function WarehouseShortageDamageEntryPage() {
  const { t } = useI18n();
  const [manifests, setManifests] = useState<GenericRecord[]>([]);
  const [manifestId, setManifestId] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const workspace = await fetchWarehouseWorkspace();
      setManifests(workspace.inbound);
      setManifestId(String(workspace.inbound[0]?.id ?? ''));
    }
    void load();
  }, []);

  async function submit() {
    if (!manifestId) return setMessage(t('common.manifestRequired', 'Manifest is required.'));
    const result = await logWarehouseException(manifestId, notes || 'Shortage / Damage reported');
    if (result?.error) return setMessage(result.error.message ?? 'Unable to log exception.');
    setMessage('Exception logged.');
    setNotes('');
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.shortageDamage', 'Shortage / Damage')}</div>
        <h1>{t('common.shortageDamageEntry', 'Shortage / Damage Entry')}</h1>
        <p>{t('common.shortageDamageWorkflowNote', 'Log shortage or damage cases and attach them to the manifest workflow.')}</p>
      </article>

      <section className="page-card">
        <div className="form-grid">
          <label className="field">
            <span>{t('common.manifest', 'Manifest')}</span>
            <select value={manifestId} onChange={(e) => setManifestId(e.target.value)}>
              {manifests.map((row) => (
                <option key={String(row.id)} value={String(row.id)}>
                  {row.manifest_code ?? row.id}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t('common.notes', 'Notes')}</span>
            <textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>

        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={() => void submit()}>{t('common.logException', 'Log Exception')}</button>
        </div>

        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
