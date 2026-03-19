export type WaybillPaperSize = '4x3' | '4x6' | 'A5' | 'A4';

export type WaybillData = {
  companyName: string;
  serviceName: string;
  hotline: string;
  generatedAt: string;
  generatedByUserId: string;
  merchantName: string;
  merchantPhone?: string;
  merchantAddress?: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  townshipText?: string;
  serviceLevel: string;
  cbm?: string;
  weightKg?: string;
  itemPrice?: string;
  deliveryFee?: string;
  prepaidAmount?: string;
  codAmount?: string;
  remarks?: string;
  waybillNo: string;
  qrPayload: string;
  qrImageDataUrl?: string;
};

export const defaultWaybillData: WaybillData = {
  companyName: 'BRITIUM EXPRESS',
  serviceName: 'DELIVERY SERVICE',
  hotline: '09-897 44 77 44',
  generatedAt: '',
  generatedByUserId: '',
  merchantName: '',
  merchantPhone: '',
  merchantAddress: '',
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  townshipText: '',
  serviceLevel: 'Normal',
  cbm: '',
  weightKg: '',
  itemPrice: '',
  deliveryFee: '',
  prepaidAmount: '',
  codAmount: '',
  remarks: '',
  waybillNo: '',
  qrPayload: '',
};
