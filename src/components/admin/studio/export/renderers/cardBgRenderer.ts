import type { BackgroundRenderer } from '../types';

export const backgroundRendererRegistry: Record<string, BackgroundRenderer> = {
  custom_image: (ctx, W, H, bgImg) => {
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
    }
  },

  google_modern_wave: (ctx, W, H) => {
    const grad = ctx.createLinearGradient(0, 0, W, H * 0.5);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(0.5, '#4f46e5');
    grad.addColorStop(1, '#6366f1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.44);
    ctx.bezierCurveTo(W * 0.3, H * 0.41, W * 0.65, H * 0.52, W, H * 0.47);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  },

  google_black_curve: (ctx, W, H) => {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H * 0.44);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, H * 0.38);
    ctx.bezierCurveTo(W * 0.28, H * 0.46, W * 0.72, H * 0.46, W, H * 0.38);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.54);
    ctx.lineTo(W / 2, H * 0.62);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W / 2, H * 0.74);
    ctx.lineTo(W / 2, H * 0.82);
    ctx.stroke();
  },

  google_frame_quad: (ctx, W, H) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const framePadding = 24;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.moveTo(framePadding + 40, framePadding);
    ctx.lineTo(W / 2, framePadding);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.moveTo(W / 2, framePadding);
    ctx.lineTo(W - framePadding - 40, framePadding);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.moveTo(framePadding, framePadding + 40);
    ctx.lineTo(framePadding, H - framePadding - 40);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC05';
    ctx.beginPath();
    ctx.moveTo(W - framePadding, framePadding + 40);
    ctx.lineTo(W - framePadding, H - framePadding - 40);
    ctx.stroke();

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.moveTo(framePadding + 40, H - framePadding);
    ctx.lineTo(W / 2, H - framePadding);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.moveTo(W / 2, H - framePadding);
    ctx.lineTo(W - framePadding - 40, H - framePadding);
    ctx.stroke();
  },

  google_badge_circle: (ctx, W, H) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const cX = W / 2;
    const cY = H * 0.38;
    const r = 110;
    ctx.lineWidth = 10;

    ctx.strokeStyle = '#4285F4';
    ctx.beginPath();
    ctx.arc(cX, cY, r, -Math.PI / 2, 0);
    ctx.stroke();

    ctx.strokeStyle = '#EA4335';
    ctx.beginPath();
    ctx.arc(cX, cY, r, 0, Math.PI / 2);
    ctx.stroke();

    ctx.strokeStyle = '#FBBC05';
    ctx.beginPath();
    ctx.arc(cX, cY, r, Math.PI / 2, Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#34A853';
    ctx.beginPath();
    ctx.arc(cX, cY, r, Math.PI, (3 * Math.PI) / 2);
    ctx.stroke();
  },

  google_back_qr_focus: (ctx, W, H) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const topGrad = ctx.createLinearGradient(0, 0, W, 0);
    topGrad.addColorStop(0, '#4285F4');
    topGrad.addColorStop(0.5, '#EA4335');
    topGrad.addColorStop(1, '#FBBC05');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, 8);

    const btmGrad = ctx.createLinearGradient(0, 0, W, 0);
    btmGrad.addColorStop(0, '#34A853');
    btmGrad.addColorStop(0.5, '#4285F4');
    btmGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = btmGrad;
    ctx.fillRect(0, H - 8, W, 8);
  },

  default: (ctx, W, H) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
  }
};
