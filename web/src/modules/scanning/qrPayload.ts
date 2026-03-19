export type QrEntityType = 'shipment' | 'manifest' | 'task' | 'waybill';

export type QrPayloadInput = {
  entityType: QrEntityType;
  shipmentId?: string;
  orderCode?: string;
  waybillNo?: string;
  manifestNo?: string;
  taskCode?: string;
  tenantId?: string;
  branchId?: string;
  generatedBy: string;
  generatedAtIso: string;
  nonce: string;
};

export function buildQrPayload(input: QrPayloadInput) {
  return JSON.stringify({
    v: 1,
    entityType: input.entityType,
    shipmentId: input.shipmentId ?? null,
    orderCode: input.orderCode ?? null,
    waybillNo: input.waybillNo ?? null,
    manifestNo: input.manifestNo ?? null,
    taskCode: input.taskCode ?? null,
    tenantId: input.tenantId ?? null,
    branchId: input.branchId ?? null,
    generatedBy: input.generatedBy,
    generatedAtIso: input.generatedAtIso,
    nonce: input.nonce,
  });
}
