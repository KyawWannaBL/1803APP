import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export function MerchantBulkUploadPage() {
  const { t } = useI18n();
  const [message, setMessage] = useState('');

  function prepareUpload() {
    setMessage(t('common.bulkUploadPrepared', 'Bulk upload screen is ready. Connect CSV/XLSX parser and backend import job for production upload flow.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.bulkUpload', 'Bulk Upload')}</div>
        <h1>{t('common.bulkUpload', 'Bulk Upload')}</h1>
        <p>{t('common.bulkUploadWorkflowNote', 'Prepare CSV or spreadsheet-based order uploads with validation and import review.')}</p>
      </article>
      <section className="page-card">
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={prepareUpload}>{t('common.prepareUpload', 'Prepare Upload')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
