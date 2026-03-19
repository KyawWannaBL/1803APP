import type { WaybillData, WaybillPaperSize } from './waybillSchema';

export function getWaybillDimensions(size: WaybillPaperSize) {
  switch (size) {
    case '4x3':
      return { width: '4in', height: '3in' };
    case '4x6':
      return { width: '4in', height: '6in' };
    case 'A5':
      return { width: '148mm', height: '210mm' };
    case 'A4':
      return { width: '210mm', height: '297mm' };
  }
}

export function renderWaybillHtml(data: WaybillData, size: WaybillPaperSize) {
  const dims = getWaybillDimensions(size);
  return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${data.waybillNo}</title>
<style>
  @page { size: ${dims.width} ${dims.height}; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; }
  .sheet { width: ${dims.width}; min-height: ${dims.height}; border: 1px solid #333; color: #111; }
  .row { display: flex; }
  .header { padding: 8px; border-bottom: 1px solid #333; }
  .left { flex: 1; }
  .right { width: 34%; text-align: center; }
  .brand { font-size: 20px; font-weight: 700; line-height: 1.1; }
  .service { font-size: 12px; font-weight: 700; }
  .hotline { font-size: 10px; font-weight: 700; margin-top: 4px; }
  .timestamp { text-align: right; font-size: 10px; font-weight: 700; margin-bottom: 6px; }
  .qr-box { border: 1px solid #333; min-height: 92px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .qr-box img { max-width: 100%; max-height: 100%; }
  .generated-by { font-size: 10px; font-weight: 700; margin-top: 4px; word-break: break-all; }
  .section { padding: 8px; border-bottom: 1px solid #333; }
  .label { font-size: 10px; color: #444; }
  .value { font-size: 14px; font-weight: 700; margin-top: 2px; }
  .value.normal { font-weight: 400; }
  .pair-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
  .summary { padding: 8px; border-bottom: 1px solid #333; display: grid; grid-template-columns: 1fr 1fr 150px; gap: 8px; align-items: stretch; }
  .cod-box { border: 1px solid #333; border-radius: 10px; padding: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center; }
  .cod-title { font-size: 11px; }
  .cod-amount { font-size: 24px; font-weight: 800; line-height: 1.1; margin-top: 8px; }
  .cod-currency { font-size: 10px; margin-top: 6px; }
  .remarks { padding: 8px; border-bottom: 1px solid #333; min-height: 46px; }
  .footer { padding: 8px; font-size: 11px; font-weight: 700; }
</style>
</head>
<body>
  <div class="sheet">
    <div class="row header">
      <div class="left">
        <div class="brand">${data.companyName}</div>
        <div class="service">${data.serviceName}</div>
        <div class="hotline">Hotline: ${data.hotline}</div>
      </div>
      <div class="right">
        <div class="timestamp">${data.generatedAt}</div>
        <div class="qr-box">${data.qrImageDataUrl ? `<img src="${data.qrImageDataUrl}" alt="QR" />` : `<span style="font-size:10px;padding:8px;">QR READY</span>`}</div>
        <div class="generated-by">${data.generatedByUserId}</div>
      </div>
    </div>

    <div class="section">
      <div class="label">Merchant</div>
      <div class="value">${data.merchantName}</div>
      <div class="value normal">${data.merchantPhone ?? ''}</div>
      <div class="value normal">${data.merchantAddress ?? ''}</div>
    </div>

    <div class="section">
      <div class="label">Recipient</div>
      <div class="value">${data.recipientName}</div>
      <div class="value">${data.recipientPhone}</div>
      <div class="value normal">${data.recipientAddress}</div>
    </div>

    <div class="section pair-grid">
      <div><div class="label">Township</div><div class="value normal">${data.townshipText ?? ''}</div></div>
      <div><div class="label">Service</div><div class="value normal">${data.serviceLevel}</div></div>
    </div>

    <div class="summary">
      <div>
        <div class="label">CBM</div><div class="value normal">${data.cbm ?? ''}</div>
        <div class="label">Weight (kg)</div><div class="value normal">${data.weightKg ?? ''}</div>
        <div class="label">Delivery</div><div class="value">${data.serviceLevel}</div>
      </div>
      <div>
        <div class="label">Item Price</div><div class="value normal">${data.itemPrice ?? ''}</div>
        <div class="label">Delivery Fees</div><div class="value normal">${data.deliveryFee ?? ''}</div>
        <div class="label">Prepaid to OS</div><div class="value normal">${data.prepaidAmount ?? ''}</div>
      </div>
      <div class="cod-box">
        <div class="cod-title">COD</div>
        <div class="cod-amount">${data.codAmount ?? ''}</div>
        <div class="cod-currency">MMK</div>
      </div>
    </div>

    <div class="remarks">
      <div class="label">Remarks</div>
      <div class="value normal">${data.remarks ?? ''}</div>
    </div>

    <div class="footer">
      Hotline သို့ ဆက်သွယ်၍ ပို့ဆောင်ရေး အချက်အလက်ကို စုံစမ်းနိုင်ပါသည်။
    </div>
  </div>
</body>
</html>
`;
}
