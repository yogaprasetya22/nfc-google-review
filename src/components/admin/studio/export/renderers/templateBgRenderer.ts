import type { RenderContext } from '../types';

export function renderTemplateBackground(rc: RenderContext) {
  const { ctx, element: el, left, top } = rc;
  const variant = el.bgVariant || 'wave';
  const pCol = el.primaryColor || '#3b82f6';
  const sCol = el.secondaryColor || '#4f46e5';

  if (variant === 'wave') {
    const grad = ctx.createLinearGradient(left, top, left + el.width, top + el.height * 0.5);
    grad.addColorStop(0, pCol);
    grad.addColorStop(1, sCol);
    ctx.fillStyle = grad;
    ctx.fillRect(left, top, el.width, el.height);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(left, top + el.height * 0.44);
    ctx.bezierCurveTo(
      left + el.width * 0.3,
      top + el.height * 0.41,
      left + el.width * 0.65,
      top + el.height * 0.52,
      left + el.width,
      top + el.height * 0.47
    );
    ctx.lineTo(left + el.width, top + el.height);
    ctx.lineTo(left, top + el.height);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'black_curve') {
    ctx.fillStyle = pCol || '#0a0a0a';
    ctx.fillRect(left, top, el.width, el.height * 0.44);

    const curveTop = top + el.height * 0.35;
    const curveH = el.height * 0.18;

    ctx.fillStyle = sCol || '#ffffff';
    ctx.beginPath();
    ctx.moveTo(left, curveTop + curveH * 0.25);
    ctx.bezierCurveTo(
      left + el.width * (140 / 520),
      curveTop + curveH * 0.75,
      left + el.width * (380 / 520),
      curveTop + curveH * 0.75,
      left + el.width,
      curveTop + curveH * 0.25
    );
    ctx.lineTo(left + el.width, top + el.height);
    ctx.lineTo(left, top + el.height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, top + el.height * 0.52);
    ctx.lineTo(0, top + el.height * 0.52 + 32);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, top + el.height * 0.72);
    ctx.lineTo(0, top + el.height * 0.72 + 32);
    ctx.stroke();
  } else if (variant === 'frame_quad') {
    const framePadding = 16;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.moveTo(left + framePadding + 40, top + framePadding);
    ctx.lineTo(0, top + framePadding);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.moveTo(0, top + framePadding);
    ctx.lineTo(left + el.width - framePadding - 40, top + framePadding);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.moveTo(left + framePadding, top + framePadding + 40);
    ctx.lineTo(left + framePadding, top + el.height - framePadding - 40);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC05';
    ctx.beginPath();
    ctx.moveTo(left + el.width - framePadding, top + framePadding + 40);
    ctx.lineTo(left + el.width - framePadding, top + el.height - framePadding - 40);
    ctx.stroke();

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.moveTo(left + framePadding + 40, top + el.height - framePadding);
    ctx.lineTo(0, top + el.height - framePadding);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.moveTo(0, top + el.height - framePadding);
    ctx.lineTo(left + el.width - framePadding - 40, top + el.height - framePadding);
    ctx.stroke();
  } else if (variant === 'badge_circle') {
    const r = 110;
    ctx.lineWidth = 10;

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.arc(0, top + el.height * 0.38, r, -Math.PI / 2, 0);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.arc(0, top + el.height * 0.38, r, 0, Math.PI / 2);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC05';
    ctx.beginPath();
    ctx.arc(0, top + el.height * 0.38, r, Math.PI / 2, Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.arc(0, top + el.height * 0.38, r, Math.PI, (3 * Math.PI) / 2);
    ctx.stroke();
  } else if (variant === 'qr_focus') {
    const topGrad = ctx.createLinearGradient(left, 0, left + el.width, 0);
    topGrad.addColorStop(0, '#4285F4');
    topGrad.addColorStop(0.5, '#EA4335');
    topGrad.addColorStop(1, '#FBBC05');
    ctx.fillStyle = topGrad;
    ctx.fillRect(left, top, el.width, 8);

    const btmGrad = ctx.createLinearGradient(left, 0, left + el.width, 0);
    btmGrad.addColorStop(0, '#34A853');
    btmGrad.addColorStop(0.5, '#4285F4');
    btmGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = btmGrad;
    ctx.fillRect(left, top + el.height - 8, el.width, 8);
  } else if (variant === 'multicolor_pop') {
    // 1. Base White
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(left, top, el.width, el.height);

    // 2. Top-Right Yellow & Blue
    ctx.fillStyle = '#FBBC05';
    ctx.fillRect(left + el.width * 0.6, top, el.width * 0.4, el.height * 0.4);
    ctx.fillStyle = '#4285F4';
    ctx.fillRect(left + el.width * 0.75, top, el.width * 0.25, el.height * 0.25);

    // 3. Right Red Sector
    ctx.fillStyle = '#EA4335';
    ctx.beginPath();
    ctx.moveTo(left + el.width, top + el.height * 0.2);
    ctx.lineTo(left + el.width, top + el.height);
    ctx.lineTo(left + el.width * 0.55, top + el.height);
    ctx.arcTo(left + el.width * 0.55, top + el.height * 0.2, left + el.width, top + el.height * 0.2, 100);
    ctx.closePath();
    ctx.fill();

    // 4. Bottom Green Flow
    ctx.fillStyle = '#34A853';
    ctx.beginPath();
    ctx.moveTo(left, top + el.height * 0.4);
    ctx.quadraticCurveTo(left + el.width * 0.4, top + el.height * 0.35, left + el.width * 0.8, top + el.height);
    ctx.lineTo(left, top + el.height);
    ctx.closePath();
    ctx.fill();

    // 5. Top-Left Off-white accent
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + el.width * 0.6, top);
    ctx.quadraticCurveTo(left + el.width * 0.3, top + el.height * 0.3, left, top + el.height * 0.4);
    ctx.closePath();
    ctx.fill();
  } else if (variant === 'corner_curves') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(left, top, el.width, el.height);

    // Top Right Blue Corner
    ctx.fillStyle = '#4285F4';
    ctx.beginPath();
    ctx.arc(left + el.width, top, 140, Math.PI / 2, Math.PI);
    ctx.lineTo(left + el.width, top);
    ctx.closePath();
    ctx.fill();

    // Bottom Left Multi-Color Concentric Arcs
    const btmX = left;
    const btmY = top + el.height;
    const arcR = 120;
    const arcW = 20;

    ctx.lineWidth = arcW;
    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.arc(btmX, btmY, arcR, -Math.PI / 2, -Math.PI / 4);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC05';
    ctx.beginPath();
    ctx.arc(btmX, btmY, arcR, -Math.PI / 4, 0);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.arc(btmX, btmY, arcR - arcW, -Math.PI / 2, -Math.PI / 4);
    ctx.stroke();

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.arc(btmX, btmY, arcR - arcW, -Math.PI / 4, 0);
    ctx.stroke();
  }
}
