import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type CommandItem = {
  id: string;
  title: string;
  subtitle?: string;
  route: string;
};

type Props = {
  items: CommandItem[];
};

export function CommandPalette({ items }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items.slice(0, 14);
    return items
      .filter((item) => `${item.title} ${item.subtitle ?? ''} ${item.route}`.toLowerCase().includes(value))
      .slice(0, 14);
  }, [items, query]);

  if (!open) {
    return (
      <button type="button" className="toolbar-button toolbar-button--ghost" onClick={() => setOpen(true)}>
        ⌘K
      </button>
    );
  }

  return (
    <div className="palette-overlay" role="dialog" aria-modal="true">
      <div className="palette-card">
        <div className="palette-card__header">
          <strong>Command Palette</strong>
          <button type="button" className="toolbar-button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <label className="field">
          <span>Jump to any portal, workflow, or screen</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dashboard, manifest, assignment, support..."
          />
        </label>
        <div className="palette-list">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className="palette-list__item"
              onClick={() => {
                navigate(item.route);
                setOpen(false);
                setQuery('');
              }}
            >
              <strong>{item.title}</strong>
              <span>{item.subtitle ?? item.route}</span>
            </button>
          ))}
          {!filtered.length ? <div className="empty-state">No matching screens found.</div> : null}
        </div>
      </div>
    </div>
  );
}