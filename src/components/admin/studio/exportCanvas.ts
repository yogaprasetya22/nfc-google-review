import type { CanvasElement, TemplateType, DimensionInfo } from './types';

export function renderSideToCanvas(
  dimensions: DimensionInfo,
  targetElements: CanvasElement[],
  template: TemplateType,
  bg: string | null,
  qrDataUrl: string
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const scale = 2; // 2x print resolution
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');

    ctx.scale(scale, scale);
    const W = dimensions.width;
    const H = dimensions.height;

    // Draw Backgrounds
    if (template === 'google_modern_wave') {
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
    } else if (template === 'google_black_curve') {
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
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, H * 0.54);
      ctx.lineTo(W / 2, H * 0.62);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(W / 2, H * 0.74);
      ctx.lineTo(W / 2, H * 0.82);
      ctx.stroke();
    } else if (template === 'google_frame_quad') {
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
    } else if (template === 'google_badge_circle') {
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
    } else if (template === 'google_back_qr_focus') {
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
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
    }

    const drawElements = () => {
      targetElements.forEach((el) => {
        if (!el.visible) return;

        const posX = (el.x / 100) * W;
        const posY = (el.y / 100) * H;
        const left = -el.width / 2;
        const top = -el.height / 2;

        ctx.save();
        ctx.translate(posX, posY);
        if (el.rotation) {
          ctx.rotate(((el.rotation % 360) * Math.PI) / 180);
        }

        if (el.type === 'template_bg') {
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

            ctx.fillStyle = sCol || '#ffffff';
            ctx.beginPath();
            ctx.moveTo(left, top + el.height * 0.38);
            ctx.bezierCurveTo(
              left + el.width * 0.28,
              top + el.height * 0.46,
              left + el.width * 0.72,
              top + el.height * 0.46,
              left + el.width,
              top + el.height * 0.38
            );
            ctx.lineTo(left + el.width, top + el.height);
            ctx.lineTo(left, top + el.height);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, top + el.height * 0.54);
            ctx.lineTo(0, top + el.height * 0.62);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, top + el.height * 0.74);
            ctx.lineTo(0, top + el.height * 0.82);
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
          }
        } else if (el.type === 'qrcode' && qrDataUrl) {
          const img = new Image();
          img.src = qrDataUrl;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(left - 4, top - 4, el.width + 8, el.height + 8, 8);
          ctx.fill();
          ctx.drawImage(img, left, top, el.width, el.height);
        } else if (el.type === 'nfc_target') {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0,0,0,0.06)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(left, top, el.width, el.height, 12);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('NFC TAP', 0, 0);
        } else if (el.type === 'logo_google') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, el.width / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#4285F4';
          ctx.font = `bold ${Math.round(el.width * 0.55)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('G', 0, 0);
        } else if (el.type === 'google_badge_pill') {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(left, top, el.width, el.height, el.height / 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(el.content || 'Review us on Google', 0, 0);
        } else if (el.type === 'stars_5') {
          ctx.fillStyle = '#eab308';
          ctx.font = '20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★★★★★', 0, 0);
        } else if (el.type === 'text') {
          ctx.fillStyle = el.textColor || '#0f172a';
          const weight = el.fontWeight === 'black' ? '900' : el.fontWeight === 'normal' ? 'normal' : 'bold';
          const style = el.fontStyle === 'italic' ? 'italic ' : '';
          const family = el.fontFamily ? `"${el.fontFamily}", sans-serif` : 'sans-serif';
          ctx.font = `${style}${weight} ${el.fontSize || 14}px ${family}`;
          ctx.textAlign = (el.textAlign || 'center') as CanvasTextAlign;
          ctx.textBaseline = 'middle';
          const textX = el.textAlign === 'left' ? left : el.textAlign === 'right' ? left + el.width : 0;
          ctx.fillText(el.content || '', textX, 0);
        } else if (el.type === 'shape') {
          if (el.shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, el.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'rounded_rect') {
            ctx.beginPath();
            ctx.roundRect(left, top, el.width, el.height, el.borderRadius || 16);
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'rect') {
            ctx.beginPath();
            ctx.rect(left, top, el.width, el.height);
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'line') {
            ctx.fillStyle = el.fillColor || '#cbd5e1';
            const lineH = Math.max(2, el.borderWidth || 2);
            ctx.beginPath();
            ctx.roundRect(left, -lineH / 2, el.width, lineH, lineH / 2);
            ctx.fill();
          } else if (el.shapeType === 'line_dashed') {
            ctx.strokeStyle = el.fillColor || '#0f172a';
            ctx.lineWidth = Math.max(2, el.borderWidth || 2);
            ctx.setLineDash([8, 6]);
            ctx.beginPath();
            ctx.moveTo(left, 0);
            ctx.lineTo(left + el.width, 0);
            ctx.stroke();
            ctx.setLineDash([]);
          } else if (el.shapeType === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, top);
            ctx.lineTo(left + el.width, top + el.height);
            ctx.lineTo(left, top + el.height);
            ctx.closePath();
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, top);
            ctx.lineTo(left + el.width, 0);
            ctx.lineTo(0, top + el.height);
            ctx.lineTo(left, 0);
            ctx.closePath();
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'capsule') {
            ctx.beginPath();
            ctx.roundRect(left, top, el.width, el.height, el.height / 2);
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'hexagon') {
            const w = el.width;
            const h = el.height;
            ctx.beginPath();
            ctx.moveTo(0, top);
            ctx.lineTo(left + w * 0.95, top + h * 0.25);
            ctx.lineTo(left + w * 0.95, top + h * 0.75);
            ctx.lineTo(0, top + h);
            ctx.lineTo(left + w * 0.05, top + h * 0.75);
            ctx.lineTo(left + w * 0.05, top + h * 0.25);
            ctx.closePath();
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
            if (el.borderWidth && el.borderWidth > 0) {
              ctx.lineWidth = el.borderWidth;
              ctx.strokeStyle = el.strokeColor || '#000000';
              ctx.stroke();
            }
          } else if (el.shapeType === 'star') {
            const rot = (Math.PI / 2) * 3;
            let cx = 0;
            let cy = 0;
            let outerRadius = Math.min(el.width, el.height) / 2;
            let innerRadius = outerRadius * 0.45;
            let step = Math.PI / 5;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < 5; i++) {
              let x = cx + Math.cos(rot + i * step * 2) * outerRadius;
              let y = cy + Math.sin(rot + i * step * 2) * outerRadius;
              ctx.lineTo(x, y);
              x = cx + Math.cos(rot + i * step * 2 + step) * innerRadius;
              y = cy + Math.sin(rot + i * step * 2 + step) * innerRadius;
              ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = el.fillColor || '#f59e0b';
            ctx.fill();
          } else if (el.shapeType === 'arrow') {
            const w = el.width;
            const h = el.height;
            ctx.beginPath();
            ctx.moveTo(left, top + h * 0.33);
            ctx.lineTo(left + w * 0.6, top + h * 0.33);
            ctx.lineTo(left + w * 0.6, top);
            ctx.lineTo(left + w, 0);
            ctx.lineTo(left + w * 0.6, top + h);
            ctx.lineTo(left + w * 0.6, top + h * 0.67);
            ctx.lineTo(left, top + h * 0.67);
            ctx.closePath();
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
          } else if (el.shapeType === 'google_ring') {
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
            // Default generic fallback for polygon/shapes
            ctx.beginPath();
            ctx.rect(left, top, el.width, el.height);
            ctx.fillStyle = el.fillColor || '#0f172a';
            ctx.fill();
          }
        }
        ctx.restore();
      });

      resolve(canvas.toDataURL('image/png'));
    };

    if (bg) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, W, H);
        drawElements();
      };
      bgImg.src = bg;
    } else {
      drawElements();
    }
  });
}
