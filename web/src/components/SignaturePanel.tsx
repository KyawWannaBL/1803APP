import { useRef, useState } from 'react';

export function SignaturePanel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [message, setMessage] = useState('Draw a signature, then save it.');
  const [drawing, setDrawing] = useState(false);

  function point(event: React.MouseEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function begin(event: React.MouseEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineWidth = 2;
    setDrawing(true);
  }

  function move(event: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const p = point(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function end() {
    setDrawing(false);
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setMessage('Signature cleared.');
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setMessage(`Signature captured (${canvas.toDataURL().length} bytes).`);
  }

  return (
    <div className="page-main-stack">
      <div className="widget-card__title">Signature Capture</div>
      <canvas
        ref={canvasRef}
        width={360}
        height={160}
        className="signature-canvas"
        onMouseDown={begin}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
      />
      <div className="toolbar">
        <button type="button" className="toolbar-button" onClick={clear}>Clear</button>
        <button type="button" className="toolbar-button toolbar-button--primary" onClick={save}>Save Signature</button>
      </div>
      <div className="callout">{message}</div>
    </div>
  );
}