export type PodCaptureInput = {
  shipmentId: string;
  taskId?: string;
  recipientName?: string;
  otpVerified: boolean;
  signatureFileUrl?: string;
  photoFileUrl?: string;
  remarks?: string;
  latitude?: number;
  longitude?: number;
};

export function validatePodCapture(input: PodCaptureInput) {
  if (!input.otpVerified) {
    return { ok: false, message: 'OTP verification is required before marking delivery complete.' };
  }
  if (!input.signatureFileUrl && !input.photoFileUrl) {
    return { ok: false, message: 'Signature or photo proof is required.' };
  }
  if (!input.latitude || !input.longitude) {
    return { ok: false, message: 'Delivery geolocation is required.' };
  }
  return { ok: true, message: 'POD evidence is valid.' };
}
