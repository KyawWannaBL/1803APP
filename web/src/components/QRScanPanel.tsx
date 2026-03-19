import { useState } from 'react';

export function QRScanPanel() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Ready to scan.');
  return (
    <div className="page-main-stack">
      <div className="widget-card__title">QR Scan</div>
      <label className="field">
        <span>Parcel QR</span>
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Scan or type QR payload" />
      </label>
      <div className="toolbar">
        <button className="toolbar-button toolbar-button--primary" type="button" onClick={() => setMessage(value ? `Captured payload: ${value}` : 'Enter a QR payload first.')}>
          Capture
        </button>
      </div>
      <div className="callout">{message}</div>
    </div>
  );
}