import { findTransitionRule, type CheckpointCode } from './scanWorkflow';

export type ScanEvidence = {
  otpVerified?: boolean;
  hasSignature?: boolean;
  hasPhoto?: boolean;
  latitude?: number | null;
  longitude?: number | null;
};

export function validateTransitionWithScan(params: {
  entityType: 'shipment' | 'delivery' | 'manifest';
  fromStatus: string;
  toStatus: string;
  actualCheckpoint?: CheckpointCode;
  evidence?: ScanEvidence;
}) {
  const rule = findTransitionRule(params.entityType, params.fromStatus, params.toStatus);
  if (!rule) {
    return { ok: true, message: 'No blocking scan rule configured.' };
  }

  if (rule.requiredCheckpoint && params.actualCheckpoint !== rule.requiredCheckpoint) {
    return { ok: false, message: `Required checkpoint ${rule.requiredCheckpoint} is missing.` };
  }

  const evidence = params.evidence ?? {};
  if (rule.requiredEvidence?.includes('otp') && !evidence.otpVerified) {
    return { ok: false, message: 'OTP verification is required.' };
  }
  if (rule.requiredEvidence?.includes('signature_or_photo') && !evidence.hasSignature && !evidence.hasPhoto) {
    return { ok: false, message: 'Signature or photo proof is required.' };
  }
  if (rule.requiredEvidence?.includes('geo') && (!evidence.latitude || !evidence.longitude)) {
    return { ok: false, message: 'Location evidence is required.' };
  }

  return { ok: true, message: 'Transition is valid.' };
}
