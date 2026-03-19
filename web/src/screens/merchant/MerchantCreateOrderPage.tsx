import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export function MerchantCreateOrderPage() {
  const { t } = useI18n();
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  function submit() {
    if (!receiverName || !phone || !address) {
      setMessage(t('common.completeRequiredFields', 'Please complete all required fields.'));
      return;
    }
    setMessage(t('common.orderDraftPrepared', 'Order draft prepared. Connect this form to your order creation repository endpoint.'));
  }

  return (
    <section className="page-main-stack">
      <article className="page-card page-card--hero">
        <div className="page-eyebrow">{t('common.createOrder', 'Create Order')}</div>
        <h1>{t('common.createOrder', 'Create Order')}</h1>
        <p>{t('common.createOrderWorkflowNote', 'Create a single merchant delivery order with bilingual-ready validation fields.')}</p>
      </article>

      <section className="page-card">
        <div className="form-grid">
          <label className="field"><span>{t('common.receiverName', 'Receiver Name')}</span><input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} /></label>
          <label className="field"><span>{t('common.phone', 'Phone')}</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label className="field"><span>{t('common.address', 'Address')}</span><textarea rows={5} value={address} onChange={(e) => setAddress(e.target.value)} /></label>
        </div>
        <div className="toolbar toolbar--wrap">
          <button className="toolbar-button toolbar-button--primary" onClick={submit}>{t('common.submit', 'Submit')}</button>
        </div>
        {message ? <div className="callout">{message}</div> : null}
      </section>
    </section>
  );
}
