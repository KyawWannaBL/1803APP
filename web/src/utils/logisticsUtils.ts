export function analyzePhotoQuality(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { tooDark: false, tooBright: false };
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
  let brightness = 0;
  for (let i = 0; i < pixels.length; i += 4) { brightness += pixels[i]; }
  brightness /= (pixels.length / 4);
  return { tooDark: brightness < 40, tooBright: brightness > 200 };
}

export function generateWayID(origin: string, dest: string): string {
  const prefix = "BRX";
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${origin.substring(0, 3)}-${dest.substring(0, 3)}-${dateStr}-${random}`.toUpperCase();
}
