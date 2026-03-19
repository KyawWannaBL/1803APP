import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import {
  createRecord,
  deleteRecord,
  updateRecord,
  type GenericRecord,
} from '@/services/repositories';

type Props = {
  table: string;
  rows: GenericRecord[];
  busy?: boolean;
  onReload?: () => void;
  selectedId?: string | null;
  onSelect?: (row: GenericRecord | null) => void;
};

function defaultDraft(table: string) {
  return JSON.stringify({ status: 'draft', table }, null, 2);
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DatasetPanel({
  table,
  rows,
  busy = false,
  onReload,
  selectedId,
  onSelect,
}: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(defaultDraft(table));
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const term = query.toLowerCase();
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
  }, [rows, query]);

  const selectedRow = useMemo(
    () => rows.find((row) => String(row.id) === String(selectedId)) ?? null,
    [rows, selectedId],
  );

  async function safeReload() {
    await onReload?.();
  }

  function openCreateDraft() {
    setDraft(defaultDraft(table));
    setMessage(`Create mode ready for ${table}.`);
  }

  function openEditDraft() {
    if (!selectedRow) {
      setMessage('Select a record before editing.');
      return;
    }
    setDraft(JSON.stringify(selectedRow, null, 2));
    setMessage(`Editing ${selectedRow.id}.`);
  }

  async function saveDraft() {
    let payload: GenericRecord;
    try {
      payload = JSON.parse(draft);
    } catch {
      setMessage('Draft JSON is invalid.');
      return;
    }

    setSaving(true);
    try {
      if (payload.id) {
        const result = await updateRecord(table, String(payload.id), payload);
        if (result.error) {
          setMessage(result.error.message ?? 'Update failed.');
          return;
        }
        setMessage(`Updated ${payload.id}.`);
      } else {
        const result = await createRecord(table, payload);
        if (result.error) {
          setMessage(result.error.message ?? 'Create failed.');
          return;
        }
        setMessage(`Created record in ${table}.`);
      }
      await safeReload();
    } finally {
      setSaving(false);
    }
  }

  async function removeSelected() {
    if (!selectedRow) {
      setMessage('Select a record before deleting.');
      return;
    }
    setSaving(true);
    try {
      const result = await deleteRecord(table, String(selectedRow.id));
      if (result.error) {
        setMessage(result.error.message ?? 'Delete failed.');
        return;
      }
      setMessage(`Deleted ${selectedRow.id}.`);
      onSelect?.(null);
      await safeReload();
    } finally {
      setSaving(false);
    }
  }

  function exportRows() {
    if (!rows.length) {
      setMessage('No rows available to export.');
      return;
    }
    downloadJson(`${table}.json`, rows);
    setMessage(`Exported ${rows.length} rows from ${table}.`);
  }

  return (
    <section className="page-card">
      <div className="widget-card__title widget-card__title--space">
        <div>
          <strong>{table}</strong>
          <div className="muted">
            {rows.length} {t('common.records', 'records')}
            {busy ? ' · syncing' : ''}
          </div>
        </div>

        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button" type="button" onClick={() => void safeReload()}>
            {t('common.refresh', 'Refresh')}
          </button>
          <button className="toolbar-button" type="button" onClick={exportRows}>
            {t('common.export', 'Export')}
          </button>
          <button className="toolbar-button" type="button" onClick={openEditDraft}>
            {t('common.edit', 'Edit')}
          </button>
          <button className="toolbar-button" type="button" onClick={() => void removeSelected()}>
            {t('common.delete', 'Delete')}
          </button>
          <button className="toolbar-button toolbar-button--primary" type="button" onClick={openCreateDraft}>
            {t('common.create', 'Create')}
          </button>
        </div>
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
              <th>{t('common.actions', 'Actions')}</th>
              <th>ID</th>
              <th>{t('common.data', 'Data')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length ? (
              filteredRows.map((row) => (
                <tr
                  key={String(row.id)}
                  className={String(row.id) === String(selectedId) ? 'row--selected' : ''}
                >
                  <td>
                    <div className="toolbar">
                      <button
                        type="button"
                        className="toolbar-button"
                        onClick={() => {
                          onSelect?.(row);
                          setDraft(JSON.stringify(row, null, 2));
                          setMessage(`Selected ${row.id}.`);
                        }}
                      >
                        {t('common.select', 'Select')}
                      </button>
                    </div>
                  </td>
                  <td>{String(row.id)}</td>
                  <td>
                    <pre className="json-preview">{JSON.stringify(row, null, 2)}</pre>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>
                  <div className="empty-state">{t('common.noData', 'No data')}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section-divider" />
      <div className="page-main-stack">
        <div className="widget-card__title widget-card__title--space">
          <strong>{selectedRow ? `Editor · ${selectedRow.id}` : 'Editor'}</strong>
          <button className="toolbar-button toolbar-button--primary" type="button" onClick={() => void saveDraft()}>
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
        </div>
        <textarea
          className="json-preview json-editor"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={10}
        />
      </div>

      <div className="callout">
        <strong>{t('common.note', 'Note')}:</strong>{' '}
        {message || t('common.selectRecordForActions', 'Select a record to create, edit, export, or delete.')}
      </div>
    </section>
  );
}