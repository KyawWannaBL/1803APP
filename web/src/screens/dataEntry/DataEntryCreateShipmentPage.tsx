import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { QRScanPanel } from '@/components/QRScanPanel';
import { SignaturePanel } from '@/components/SignaturePanel';
import { MapboxPanel } from '@/components/MapboxPanel';

export function DataEntryCreateShipmentPage() {
  const { t } = useI18n();
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [message, setMessage] = useState('');

  function submit() {
    if (!senderName || !receiverName || !receiverPhone || !pickupAddress || !dropoffAddress) {
      setMessage(t('common.completeRequiredFields', 'Please complete all required fields.'));
      return;
    }
    setMessage(t('common.intakeDraftPrepared', 'Shipment intake draft prepared. QR scan, address validation, and signature capture entry points are now embedded in this screen.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.createShipment', 'Create Shipment')}</div>
        <h1>{t('common.createShipment', 'Create Shipment')}</h1>
        <p>{t('common.createShipmentWorkflowNote', 'Register a new shipment with QR-assisted intake, map-based address review, and signature-ready sender authorization.')}</p>
      </article>

      <section className="page-card">
        <div className="form-grid">
          <label className="field"><span>{t('common.senderName', 'Sender Name')}</span><input value={senderName} onChange={(e) => setSenderName(e.target.value)} /></label>
          <label className="field"><span>{t('common.receiverName', 'Receiver Name')}</span><input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} /></label>
          <label className="field"><span>{t('common.phone', 'Phone')}</span><input value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} /></label>
          <label className="field"><span>{t('common.pickupAddress', 'Pickup Address')}</span><textarea rows={4} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} /></label>
          <label className="field"><span>{t('common.dropoffAddress', 'Dropoff Address')}</span><textarea rows={4} value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} /></label>
        </div>
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={submit}>{t('common.saveDraft', 'Save Draft')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>

      <div className="page-grid">
        <section className="page-card"><h2>{t('common.qrScan', 'QR Scan')}</h2><QRScanPanel /></section>
        <section className="page-card"><h2>{t('common.addressValidation', 'Address Validation')}</h2><MapboxPanel /></section>
      </div>

      <section className="page-card">
        <h2>{t('common.signatureAuthorization', 'Signature Authorization')}</h2>
        <SignaturePanel />
      </section>
    </section>
  );
}
