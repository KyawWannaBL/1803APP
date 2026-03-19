import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { QRScanPanel } from '@/components/QRScanPanel';

export function DataEntryBulkUploadPage() {
  const { t } = useI18n();
  const [message, setMessage] = useState('');

  function prepareUpload() {
    setMessage(t('common.bulkUploadPrepared', 'Bulk upload prepared. Connect spreadsheet parser, server-side validation, and QR-linked intake batching here.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.bulkUpload', 'Bulk Upload')}</div>
        <h1>{t('common.bulkUpload', 'Bulk Upload')}</h1>
        <p>{t('common.bulkUploadWorkflowNote', 'Prepare spreadsheet-based shipment uploads with validation, batching, and traceability support.')}</p>
      </article>
      <section className="page-card">
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={prepareUpload}>{t('common.prepareUpload', 'Prepare Upload')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>
      <section className="page-card">
        <h2>{t('common.batchQrVerification', 'Batch QR Verification')}</h2>
        <QRScanPanel />
      </section>
    </section>
  );
}
