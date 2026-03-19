import type { WaybillData, WaybillPaperSize } from './waybillSchema';
import { renderWaybillHtml } from './waybillTemplate';

export function openWaybillPrintPreview(data: WaybillData, size: WaybillPaperSize) {
  const html = renderWaybillHtml(data, size);
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1000,height=900');
  if (!printWindow) {
    throw new Error('Unable to open print preview window.');
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  return printWindow;
}

export function printSingleWaybill(data: WaybillData, size: WaybillPaperSize) {
  const preview = openWaybillPrintPreview(data, size);
  preview.focus();
  preview.print();
}

export function printBatchWaybills(items: WaybillData[], size: WaybillPaperSize) {
  const joined = items.map((item) => renderWaybillHtml(item, size)).join('<div style="page-break-after:always;"></div>');
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1100,height=950');
  if (!printWindow) {
    throw new Error('Unable to open batch print preview window.');
  }
  printWindow.document.open();
  printWindow.document.write(joined);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
