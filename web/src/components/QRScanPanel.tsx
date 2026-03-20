import { useEffect, useState } from 'react';
import type { GenericRecord } from '@/services/repositories';

type QRScanPanelProps = {
  record?: GenericRecord | null;
  onRecordChange?: (next: GenericRecord) => void;
};

export function QRScanPanel({ record, onRecordChange }: QRScanPanelProps) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Ready to scan.');

  useEffect(() => {
    setValue(String(record?.qr_payload ?? record?.last_scan_payload ?? ''));
  }, [record?.id]);

  function capture() {
    const payload = value.trim();

    if (!record) {
      setMessage('Select a record first.');
      return;
    }

    if (!payload) {
      setMessage('Enter a QR payload first.');
      return;
    }

    const now = new Date().toISOString();

    const next: GenericRecord = {
      ...record,
      qr_payload: payload,
      last_scan_payload: payload,
      qr_scanned: true,
      scan_completed: true,
      pickup_scan_completed: true,
      receiving_scans_complete: true,
      warehouse_checkpoint_scanned: true,
      qr_scanned_at: now,
      updated_at: now,
    };

    onRecordChange?.(next);
    setMessage(`Captured payload: ${payload}`);
  }

  return (
    <div className="page-main-stack">
      <div className="widget-card__title">QR Scan</div>
      <label className="field">
        <span>Parcel QR</span>
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Scan or type QR payload" />
      </label>
      <div className="toolbar">
        <button className="toolbar-button toolbar-button--primary" type="button" onClick={capture}>
          Capture
        </button>
      </div>
      <div className="callout">{message}</div>
    </div>
  );
}

export default QRScanPanel;