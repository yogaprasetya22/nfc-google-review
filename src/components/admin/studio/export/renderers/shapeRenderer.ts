import type { RenderContext } from '../types';
import { SHAPE_DEFINITIONS } from '../../elements/shapeDefinitions';

export function renderShape(rc: RenderContext) {
  const { ctx, element: el, left, top } = rc;
  const fill = el.fillColor || '#0f172a';
  const stroke = el.strokeColor || '#000000';
  const strokeW = el.borderWidth || 0;
  const shapeType = el.shapeType || 'circle';

  ctx.save();

  // 1. Primitive Shapes
  if (shapeType === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, el.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (strokeW > 0) {
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  } else if (shapeType === 'rounded_rect') {
    ctx.beginPath();
    ctx.roundRect(left, top, el.width, el.height, el.borderRadius || 16);
    ctx.fillStyle = fill;
    ctx.fill();
    if (strokeW > 0) {
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  } else if (shapeType === 'rect') {
    ctx.beginPath();
    ctx.rect(left, top, el.width, el.height);
    ctx.fillStyle = fill;
    ctx.fill();
    if (strokeW > 0) {
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  } else if (shapeType === 'capsule') {
    ctx.beginPath();
    ctx.roundRect(left, top, el.width, el.height, el.height / 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (strokeW > 0) {
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  } else if (shapeType === 'line') {
    ctx.fillStyle = fill;
    const lineH = Math.max(2, strokeW || 2);
    ctx.beginPath();
    ctx.roundRect(left, -lineH / 2, el.width, lineH, lineH / 2);
    ctx.fill();
  } else if (shapeType === 'line_dashed') {
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(2, strokeW || 2);
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(left, 0);
    ctx.lineTo(left + el.width, 0);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (shapeType === 'line_arrow_right') {
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(2, strokeW || 2);
    ctx.beginPath();
    ctx.moveTo(left, 0);
    ctx.lineTo(left + el.width * 0.85, 0);
    ctx.stroke();

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(left + el.width * 0.82, -el.height * 0.4);
    ctx.lineTo(left + el.width, 0);
    ctx.lineTo(left + el.width * 0.82, el.height * 0.4);
    ctx.closePath();
    ctx.fill();
  } else if (shapeType === 'line_arrow_double') {
    ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(2, strokeW || 2);
    ctx.beginPath();
    ctx.moveTo(left + el.width * 0.15, 0);
    ctx.lineTo(left + el.width * 0.85, 0);
    ctx.stroke();

    ctx.fillStyle = fill;
    // Left arrow head
    ctx.beginPath();
    ctx.moveTo(left + el.width * 0.18, -el.height * 0.4);
    ctx.lineTo(left, 0);
    ctx.lineTo(left + el.width * 0.18, el.height * 0.4);
    ctx.closePath();
    ctx.fill();

    // Right arrow head
    ctx.beginPath();
    ctx.moveTo(left + el.width * 0.82, -el.height * 0.4);
    ctx.lineTo(left + el.width, 0);
    ctx.lineTo(left + el.width * 0.82, el.height * 0.4);
    ctx.closePath();
    ctx.fill();
  } else if (shapeType === 'google_ring') {
    const r = el.width / 2;
    const lw = 8;
    ctx.lineWidth = lw;

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, -Math.PI / 2, 0);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, 0, Math.PI / 2);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC05';
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, Math.PI / 2, Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.arc(0, 0, r - lw / 2, Math.PI, (3 * Math.PI) / 2);
    ctx.stroke();

    if (el.content) {
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.content, 0, 0);
    }
  } else {
    // 2. Data-Driven Vector SVG Shapes via Path2D / polygon points
    const def = SHAPE_DEFINITIONS[shapeType];
    if (def) {
      const parts = def.viewBox.split(' ').map(Number);
      const vbW = parts[2] || 100;
      const vbH = parts[3] || 100;

      // Scale to fit target width & height
      ctx.translate(left, top);
      ctx.scale(el.width / vbW, el.height / vbH);

      if (def.type === 'polygon' && def.points) {
        const coords = def.points.split(' ').map((p) => p.split(',').map(Number));
        ctx.beginPath();
        coords.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (strokeW > 0) {
          ctx.lineWidth = strokeW * (vbW / el.width);
          ctx.strokeStyle = stroke;
          ctx.stroke();
        }
      } else if (def.type === 'path' && def.d && typeof Path2D !== 'undefined') {
        const path = new Path2D(def.d);
        ctx.fillStyle = fill;
        ctx.fill(path);
        if (strokeW > 0) {
          ctx.lineWidth = strokeW * (vbW / el.width);
          ctx.strokeStyle = stroke;
          ctx.stroke(path);
        }
      }
    } else {
      // Default fallback
      ctx.beginPath();
      ctx.rect(left, top, el.width, el.height);
      ctx.fillStyle = fill;
      ctx.fill();
      if (strokeW > 0) {
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = stroke;
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}
