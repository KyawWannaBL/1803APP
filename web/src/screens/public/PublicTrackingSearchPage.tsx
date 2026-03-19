import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

export function PublicTrackingSearchPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function search() {
    const normalized = query.trim();
    if (!normalized) return;
    navigate(`/track/result?q=${encodeURIComponent(normalized)}`);
  }

  return (
    <section className="page-main-stack public-page">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.trackingSearch', 'Tracking Search')}</div>
        <h1>{t('common.trackingSearch', 'Tracking Search')}</h1>
        <p>{t('common.trackingSearchWorkflowNote', 'Search by tracking number, order code, AWB, or reference number.')}</p>
      </article>

      <section className="page-card">
        <div className="form-grid">
          <label className="field">
            <span>{t('common.trackingReference', 'Tracking Reference')}</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('common.enterTrackingReference', 'Enter tracking number or order code')} />
          </label>
        </div>
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={search}>{t('common.search', 'Search')}</button>
        </div>
      </section>
    </section>
  );
}
