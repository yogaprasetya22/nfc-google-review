import type { RenderContext } from '../types';

// Render Text dengan font family, ukuran, bobot, align & underline
export function renderText(rc: RenderContext) {
  const { ctx, element: el, left } = rc;
  ctx.fillStyle = el.textColor || '#0f172a';
  const weight = el.fontWeight === 'black' ? '900' : el.fontWeight === 'normal' ? 'normal' : 'bold';
  const style = el.fontStyle === 'italic' ? 'italic ' : '';
  const family = el.fontFamily ? `"${el.fontFamily}", sans-serif` : 'sans-serif';
  ctx.font = `${style}${weight} ${el.fontSize || 14}px ${family}`;
  ctx.textAlign = (el.textAlign || 'center') as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  const textX = el.textAlign === 'left' ? left : el.textAlign === 'right' ? left + el.width : 0;
  ctx.fillText(el.content || '', textX, 0);

  if (el.textDecoration === 'underline') {
    const metrics = ctx.measureText(el.content || '');
    const lineY = (el.fontSize || 14) * 0.45;
    ctx.beginPath();
    ctx.lineWidth = Math.max(1, (el.fontSize || 14) / 12);
    ctx.strokeStyle = el.textColor || '#0f172a';
    if (el.textAlign === 'left') {
      ctx.moveTo(left, lineY);
      ctx.lineTo(left + metrics.width, lineY);
    } else if (el.textAlign === 'right') {
      ctx.moveTo(left + el.width - metrics.width, lineY);
      ctx.lineTo(left + el.width, lineY);
    } else {
      ctx.moveTo(-metrics.width / 2, lineY);
      ctx.lineTo(metrics.width / 2, lineY);
    }
    ctx.stroke();
  }
}

// Render QR Code dengan White Box Card identik canvas
export function renderQrCode(rc: RenderContext) {
  const { ctx, element: el, left, top, imageMap } = rc;
  const img = imageMap['__qr_code__'];
  const pad = 8;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(left, top, el.width, el.height, 12);
  ctx.fill();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (img) {
    ctx.drawImage(img, left + pad, top + pad, el.width - pad * 2, el.height - pad * 2);
  }
}

// Render NFC Target (Ponsel + Gelombang NFC) 100% identik canvas
export function renderNfcTarget(rc: RenderContext) {
  const { ctx } = rc;
  const waveBoxW = 64;
  const waveBoxH = 48;
  const waveBoxX = -waveBoxW / 2 - 10;
  const waveBoxY = -waveBoxH / 2;

  // 1. Oval Gelombang NFC
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(waveBoxX, waveBoxY, waveBoxW, waveBoxH, waveBoxH / 2);
  ctx.fill();

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(')))', waveBoxX + waveBoxW / 2 - 6, 0);

  // 2. Handphone
  const phoneW = 32;
  const phoneH = 56;
  const phoneX = waveBoxX + waveBoxW - 20;
  const phoneY = -phoneH / 2;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 8);
  ctx.fill();

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(phoneX + phoneW / 2 - 6, phoneY + 6, 12, 2.5, 1.25);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(phoneX + phoneW / 2, phoneY + phoneH - 8, 4, 0, Math.PI * 2);
  ctx.stroke();
}

// Render Logo Resmi Google 4-Color
export function renderLogoGoogle(rc: RenderContext) {
  const { ctx, element: el, left, top, imageMap } = rc;
  const radius = el.width / 2;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  ctx.stroke();

  const img = imageMap['__google_logo__'];
  if (img) {
    const iconPad = el.width * 0.18;
    ctx.drawImage(img, left + iconPad, top + iconPad, el.width - iconPad * 2, el.height - iconPad * 2);
  }
}

// Render 5 Bintang Emas
export function renderStars5(rc: RenderContext) {
  const { ctx } = rc;
  ctx.fillStyle = '#eab308';
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★★★★★', 0, 0);
}

// Render Tombol Pill "Review us on Google"
export function renderGoogleBadgePill(rc: RenderContext) {
  const { ctx, element: el, left, top } = rc;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(left, top, el.width, el.height, el.height / 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(el.content || 'Review us on Google', 0, 0);
}

// Render Image Upload / Foto
export function renderImage(rc: RenderContext) {
  const { ctx, element: el, left, top, imageMap } = rc;
  const img = imageMap[el.id];
  if (img) {
    if (el.borderRadius && el.borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(left, top, el.width, el.height, el.borderRadius);
      ctx.clip();
    }
    ctx.drawImage(img, left, top, el.width, el.height);
  }
}

// Render Icon Badge / Stiker Icon
export function renderIconBadge(rc: RenderContext) {
  const { ctx, element: el, left, top, imageMap } = rc;
  const badgeShape = el.badgeShape || 'circle';
  const badgeBg = el.badgeBgColor || '#f8fafc';
  const iconColor = el.iconColor || '#4285F4';

  ctx.save();

  // 1. Gambar Container Badge Background
  if (badgeShape !== 'none') {
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    if (badgeShape === 'circle') {
      ctx.arc(0, 0, el.width / 2, 0, Math.PI * 2);
    } else if (badgeShape === 'rounded') {
      ctx.roundRect(left, top, el.width, el.height, 16);
    } else {
      ctx.rect(left, top, el.width, el.height);
    }
    ctx.fill();
  }

  // 2. Gambar Icon SVG jika sudah di-preload
  const iconKey = `__icon_${el.iconName || 'smartphone'}_${iconColor}__`;
  const img = imageMap[iconKey] || imageMap[el.id];
  if (img) {
    const pad = el.width * 0.2;
    ctx.drawImage(img, left + pad, top + pad, el.width - pad * 2, el.height - pad * 2);
  }

  ctx.restore();
}
