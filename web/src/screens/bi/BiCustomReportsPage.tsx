import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export function BiCustomReportsPage() {
  const { t } = useI18n();
  const [message, setMessage] = useState('');

  function prepareReport() {
    setMessage(t('common.customReportPrepared', 'Custom report builder entry point is prepared. Connect filters, export jobs, and saved report queries here.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.customReports', 'Custom Reports')}</div>
        <h1>{t('common.customReports', 'Custom Reports')}</h1>
        <p>{t('common.customReportsWorkflowNote', 'Prepare scheduled and on-demand analytics queries with export-ready filters.')}</p>
      </article>

      <section className="page-card">
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={prepareReport}>{t('common.prepareReport', 'Prepare Report')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
