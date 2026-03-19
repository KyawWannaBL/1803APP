export type CheckpointCode =
  | 'picking_completed'
  | 'waybill_generated'
  | 'waybill_printed'
  | 'warehouse_receiving_scan'
  | 'staging_scan'
  | 'sortation_scan'
  | 'outbound_manifest_scan'
  | 'vehicle_loading_scan'
  | 'branch_receiving_scan'
  | 'rider_pickup_scan'
  | 'doorstep_arrival_scan'
  | 'delivery_completion_scan';

export type TransitionRule = {
  entityType: 'shipment' | 'delivery' | 'manifest';
  fromStatus: string;
  toStatus: string;
  requiredCheckpoint?: CheckpointCode;
  requiredEvidence?: Array<'otp' | 'signature_or_photo' | 'geo'>;
};

export const transitionRules: TransitionRule[] = [
  { entityType: 'shipment', fromStatus: 'picked', toStatus: 'warehouse_received', requiredCheckpoint: 'warehouse_receiving_scan' },
  { entityType: 'shipment', fromStatus: 'warehouse_received', toStatus: 'staged', requiredCheckpoint: 'staging_scan' },
  { entityType: 'shipment', fromStatus: 'staged', toStatus: 'sorted', requiredCheckpoint: 'sortation_scan' },
  { entityType: 'shipment', fromStatus: 'sorted', toStatus: 'loaded_for_dispatch', requiredCheckpoint: 'vehicle_loading_scan' },
  { entityType: 'shipment', fromStatus: 'loaded_for_dispatch', toStatus: 'branch_received', requiredCheckpoint: 'branch_receiving_scan' },
  { entityType: 'delivery', fromStatus: 'assigned', toStatus: 'picked_up', requiredCheckpoint: 'rider_pickup_scan' },
  { entityType: 'delivery', fromStatus: 'en_route', toStatus: 'delivered', requiredCheckpoint: 'delivery_completion_scan', requiredEvidence: ['otp', 'signature_or_photo', 'geo'] },
];

export function findTransitionRule(entityType: TransitionRule['entityType'], fromStatus: string, toStatus: string) {
  return transitionRules.find(
    (rule) => rule.entityType === entityType && rule.fromStatus === fromStatus && rule.toStatus === toStatus,
  );
}
