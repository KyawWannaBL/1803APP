import type { ReactNode } from 'react';

type DataRow = Record<string, unknown>;

export type DataSetPanelProps = {
  title?: string;
  subtitle?: string;
  table?: string;
  rows?: DataRow[];
  columns?: unknown[];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  busy?: boolean;
  onReload?: () => void | Promise<void>;
  selectedId?: string | null;
  onSelect?: (row: DataRow | null) => void;
};

export function DatasetPanel({
  title,
  subtitle,
  table,
  rows = [],
  actions,
  children,
  className = '',
  busy = false,
  onReload,
  selectedId,
  onSelect,
}: DataSetPanelProps) {
  const sectionClassName = ['dataset-panel', className].filter(Boolean).join(' ');
  const heading = title ?? table ?? 'Data';

  return (
    <section className={sectionClassName}>
      <div className="dataset-panel__header">
        <div>
          <h2 className="dataset-panel__title">{heading}</h2>
          {subtitle ? <p className="dataset-panel__subtitle">{subtitle}</p> : null}
        </div>

        <div className="dataset-panel__actions">
          {onReload ? (
            <button
              type="button"
              className="toolbar-button"
              onClick={() => void onReload()}
            >
              Reload
            </button>
          ) : null}
          {actions}
        </div>
      </div>

      <div className="dataset-panel__body">
        {children ? (
          children
        ) : busy ? (
          <div className="dataset-panel__empty">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="dataset-panel__empty">No data</div>
        ) : (
          <div className="dataset-panel__list">
            {rows.map((row, index) => {
              const rowId = String(row.id ?? index);
              const isSelected = selectedId === rowId;

              return (
                <button
                  key={rowId}
                  type="button"
                  className={`dataset-panel__row${isSelected ? ' is-selected' : ''}`}
                  onClick={() => onSelect?.(row)}
                >
                  <strong>{rowId}</strong>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export { DatasetPanel as DataSetPanel };
export default DatasetPanel;
