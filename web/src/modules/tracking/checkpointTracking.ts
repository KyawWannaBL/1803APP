export type TrackingCheckpointRecord = {
  shipmentId: string;
  checkpointCode: string;
  latitude?: number;
  longitude?: number;
  actorUserId: string;
  scannedAtIso: string;
};

export function buildTrackingEventSummary(record: TrackingCheckpointRecord) {
  return {
    shipmentId: record.shipmentId,
    event: record.checkpointCode,
    location: record.latitude && record.longitude ? `${record.latitude},${record.longitude}` : null,
    actorUserId: record.actorUserId,
    scannedAtIso: record.scannedAtIso,
  };
}
