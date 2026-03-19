import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export function CustomerCreateRequestPage() {
  const { t } = useI18n();
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');

  function submit() {
    if (!pickupAddress || !dropoffAddress || !contactPhone) {
      setMessage(t('common.completeRequiredFields', 'Please complete all required fields.'));
      return;
    }
    setMessage(t('common.requestDraftPrepared', 'Customer request draft prepared. Connect this screen to your real request creation endpoint.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.createRequest', 'Create Request')}</div>
        <h1>{t('common.createRequest', 'Create Request')}</h1>
        <p>{t('common.createRequestWorkflowNote', 'Create a personal delivery request with bilingual validation and structured form fields.')}</p>
      </article>

      <section className="page-card">
        <div className="form-grid">
          <label className="field"><span>{t('common.pickupAddress', 'Pickup Address')}</span><textarea rows={4} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} /></label>
          <label className="field"><span>{t('common.dropoffAddress', 'Dropoff Address')}</span><textarea rows={4} value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} /></label>
          <label className="field"><span>{t('common.phone', 'Phone')}</span><input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></label>
        </div>
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={submit}>{t('common.submit', 'Submit')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
