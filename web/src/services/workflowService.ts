import workflowMatrix from '@/data/workflowMatrix.json';
import { supabase } from '@/lib/supabase';
import { env } from '@/lib/env';
import {
  advanceManifest,
  updateDeliveryTaskStatus,
  updateOrderStatus,
} from '@/services/repositories';

export type WorkflowEntityType =
  | 'order'
  | 'delivery_task'
  | 'inbound_manifest'
  | 'outbound_manifest';

export type WorkflowRequirementResult = {
  key: string;
  passed: boolean;
  reason_en: string;
  reason_mm: string;
};

export type WorkflowTransition = {
  from: string;
  to: string;
  action: string;
  requirements: string[];
};

const localTransitions: Record<WorkflowEntityType, WorkflowTransition[]> = {
  order: [
    { from: 'created', to: 'validated', action: 'validate_order', requirements: ['required_fields_complete', 'pricing_validated', 'address_validated'] },
    { from: 'validated', to: 'assigned', action: 'assign_order', requirements: ['assignment_scope_valid'] },
    { from: 'assigned', to: 'picked_up', action: 'pickup_order', requirements: ['rider_acceptance_recorded', 'pickup_scan_completed'] },
    { from: 'picked_up', to: 'in_transit', action: 'start_transit', requirements: ['departure_confirmed'] },
    { from: 'in_transit', to: 'delivered', action: 'complete_delivery', requirements: ['pod_record_created', 'otp_or_signature_complete'] },
    { from: 'in_transit', to: 'failed', action: 'mark_failed', requirements: ['failure_reason_recorded'] },
  ],
  delivery_task: [
    { from: 'assigned', to: 'accepted', action: 'accept_task', requirements: [] },
    { from: 'accepted', to: 'picked_up', action: 'confirm_pickup', requirements: ['pickup_scan_completed'] },
    { from: 'picked_up', to: 'in_transit', action: 'start_transit', requirements: ['departure_confirmed'] },
    { from: 'in_transit', to: 'delivered', action: 'complete_delivery', requirements: ['pod_record_created', 'otp_or_signature_complete'] },
    { from: 'in_transit', to: 'failed', action: 'mark_failed', requirements: ['failure_reason_recorded'] },
  ],
  inbound_manifest: [
    { from: 'draft', to: 'receiving', action: 'start_receiving', requirements: ['bay_assigned', 'vehicle_arrival_confirmed'] },
    { from: 'receiving', to: 'staged', action: 'complete_receiving', requirements: ['receiving_scans_complete', 'exceptions_resolved_or_logged', 'staging_lane_assigned'] },
    { from: 'staged', to: 'reconciled', action: 'reconcile_inbound', requirements: ['misroute_check_complete', 'inbound_manifest_reconciled'] },
  ],
  outbound_manifest: [
    { from: 'draft', to: 'loading', action: 'start_loading', requirements: ['manifest_items_selected', 'vehicle_and_driver_assigned'] },
    { from: 'loading', to: 'loaded', action: 'complete_loading', requirements: ['load_scans_complete'] },
    { from: 'loaded', to: 'closed', action: 'handover_manifest', requirements: ['handover_signature_captured', 'seal_check_completed'] },
  ],
};

export function getTransitions(entityType: WorkflowEntityType, currentState: string) {
  const definition = (workflowMatrix as Record<string, { transitions: WorkflowTransition[] }>)[entityType];
  const transitions = definition?.transitions?.length ? definition.transitions : localTransitions[entityType] ?? [];
  return transitions.filter((transition) => transition.from === currentState);
}

function isBlank(value: unknown) {
  return value === null || value === undefined || value === '';
}

export function evaluateTransitionRequirements(
  record: Record<string, any>,
  requirements: string[],
): WorkflowRequirementResult[] {
  const rows: WorkflowRequirementResult[] = [];
  for (const requirement of requirements) {
    let passed = false;
    switch (requirement) {
      case 'required_fields_complete':
        passed = !['sender_name', 'sender_address', 'receiver_name', 'receiver_address'].some((key) => isBlank(record[key]));
        break;
      case 'pricing_validated':
        passed = Number(record.total_charge_mm_k ?? 0) >= 0;
        break;
      case 'address_validated':
        passed = Boolean(record.receiver_address);
        break;
      case 'assignment_scope_valid':
        passed = Boolean(record.assigned_rider_id || record.rider_id || record.branch_id);
        break;
      case 'route_or_rider_selected':
        passed = Boolean(record.route_plan_id || record.assigned_rider_id || record.vehicle_id);
        break;
      case 'rider_acceptance_recorded':
        passed = Boolean(record.accepted_at || record.accepted_by || record.rider_acceptance);
        break;
      case 'pickup_scan_completed':
        passed = Boolean(record.pickup_scan_completed || record.pickup_scan_at || record.scan_event_id);
        break;
      case 'departure_confirmed':
        passed = Boolean(record.departure_confirmed || record.departed_at);
        break;
      case 'pod_record_created':
        passed = Boolean(record.proof_of_delivery_id || record.pod_record_created || record.pod_completed);
        break;
      case 'otp_or_signature_complete':
        passed = Boolean(record.otp_verified_at || record.signature_file_id || record.signature_captured);
        break;
      case 'failure_reason_recorded':
        passed = Boolean(record.failure_reason || record.failure_reason_code);
        break;
      case 'manifest_items_loaded':
      case 'manifest_items_selected':
        passed = Number(record.item_count ?? record.parcel_count ?? 0) > 0;
        break;
      case 'bay_assigned':
        passed = Boolean(record.receiving_bay_id || record.bay_code);
        break;
      case 'vehicle_arrival_confirmed':
        passed = Boolean(record.vehicle_arrived_at || record.arrival_confirmed);
        break;
      case 'seal_check_completed':
        passed = Boolean(record.seal_checked_at || record.seal_ok);
        break;
      case 'receiving_scans_complete':
        passed = Boolean(record.receiving_completed_at || (record.received_count ?? 0) >= (record.expected_count ?? 0));
        break;
      case 'exceptions_resolved_or_logged':
        passed = Boolean(record.exception_status || record.exception_count === 0 || record.exception_count === undefined);
        break;
      case 'staging_lane_assigned':
        passed = Boolean(record.staging_lane_id || record.staging_lane_code);
        break;
      case 'misroute_check_complete':
        passed = Boolean(record.misroute_checked_at || record.misroute_check_complete);
        break;
      case 'inbound_manifest_reconciled':
        passed = Boolean(record.reconciled_at || record.reconciled_by);
        break;
      case 'no_open_pick_conflicts':
        passed = !record.open_pick_conflicts;
        break;
      case 'vehicle_and_driver_assigned':
        passed = Boolean(record.vehicle_id || record.vehicle_no) && Boolean(record.driver_name || record.rider_id);
        break;
      case 'load_scans_complete':
        passed = Boolean(record.load_completed_at || (record.loaded_count ?? 0) >= (record.expected_count ?? 0));
        break;
      case 'handover_signature_captured':
        passed = Boolean(record.handover_signature_id || record.handover_signed_at);
        break;
      default:
        passed = Boolean(record[requirement]);
    }

    rows.push({
      key: requirement,
      passed,
      reason_en: passed ? 'Requirement satisfied' : 'Complete the required evidence before continuing.',
      reason_mm: passed ? 'လိုအပ်ချက် ပြည့်စုံပြီး' : 'ရှေ့တိုးရန် လိုအပ်ချက်ကို အရင်ပြီးစီးစေရန် လိုပါသည်။',
    });
  }
  return rows;
}

async function fallbackTransition(
  entityType: WorkflowEntityType,
  entityId: string,
  payload: Record<string, any>,
) {
  if (entityType === 'order') {
    return updateOrderStatus(entityId, payload.to, payload.context ?? {});
  }

  if (entityType === 'delivery_task') {
    return updateDeliveryTaskStatus(entityId, payload.to, payload.context ?? {});
  }

  if (entityType === 'inbound_manifest') {
    return advanceManifest('inbound_manifests', entityId, payload.to, payload.context ?? {});
  }

  return advanceManifest('outbound_manifests', entityId, payload.to, payload.context ?? {});
}

export async function transitionEntity(
  entityType: WorkflowEntityType,
  entityId: string,
  action: string,
  payload: Record<string, any>,
) {
  if (!supabase || env.enableDemoFallback) {
    return fallbackTransition(entityType, entityId, payload);
  }

  try {
    if (entityType === 'order') {
      const { data, error } = await supabase.functions.invoke('transition-order', {
        body: {
          order_id: entityId,
          action_code: action,
          to_state: payload.to,
          context: payload.context ?? payload,
        },
      });

      if (!error) return { data, error };
    } else if (entityType === 'inbound_manifest' || entityType === 'outbound_manifest') {
      const { data, error } = await supabase.functions.invoke('transition-manifest', {
        body: {
          entity_type: entityType,
          manifest_id: entityId,
          action_code: action,
          to_state: payload.to,
          context: payload.context ?? payload,
        },
      });

      if (!error) return { data, error };
    }
  } catch (error) {
    console.warn('Edge function transition failed, using fallback:', error);
  }

  return fallbackTransition(entityType, entityId, payload);
}
