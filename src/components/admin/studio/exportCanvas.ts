import type { CanvasElement, TemplateType, DimensionInfo } from './types';
import { preloadImage, svgToImage } from './export/assetLoader';
import { elementRendererRegistry } from './export/rendererRegistry';
import { backgroundRendererRegistry } from './export/renderers/cardBgRenderer';

const GOOGLE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`;

export async function renderSideToCanvas(
  dimensions: DimensionInfo,
  targetElements: CanvasElement[],
  template: TemplateType,
  bg: string | null,
  qrDataUrl: string
): Promise<string> {
  const canvas = document.createElement('canvas');

  // Skala Otomatis 4K Ultra HD murni (~3840px pada sisi terpanjang)
  const maxDim = Math.max(dimensions.width, dimensions.height);
  const target4KSize = 3840;
  const scale = Math.max(2, Math.round(target4KSize / maxDim));

  canvas.width = Math.round(dimensions.width * scale);
  canvas.height = Math.round(dimensions.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.scale(scale, scale);

  const W = dimensions.width;
  const H = dimensions.height;

  // 1. Preload semua aset gambar & logo SVG secara paralel
  const imageMap: Record<string, HTMLImageElement> = {};
  const preloadTasks: Promise<any>[] = [];

  // Background Image
  let bgImg: HTMLImageElement | null = null;
  if (bg) {
    preloadTasks.push(preloadImage(bg).then((img) => (bgImg = img)));
  }

  // QR Code
  if (qrDataUrl) {
    preloadTasks.push(
      preloadImage(qrDataUrl).then((img) => {
        if (img) imageMap['__qr_code__'] = img;
      })
    );
  }

  // Google Logo Resmi 4-Warna
  preloadTasks.push(
    svgToImage(GOOGLE_LOGO_SVG, 256, 256).then((img) => {
      if (img) imageMap['__google_logo__'] = img;
    })
  );

  // User Uploaded Images
  for (const el of targetElements) {
    if (el.visible && el.type === 'image' && el.imageUrl) {
      preloadTasks.push(
        preloadImage(el.imageUrl).then((img) => {
          if (img) imageMap[el.id] = img;
        })
      );
    }
  }

  await Promise.all(preloadTasks);

  // 2. Gambar Background Kartu Dasar via Background Registry
  if (bg) {
    backgroundRendererRegistry.custom_image(ctx, W, H, bgImg);
  } else {
    const bgRenderer = backgroundRendererRegistry[template] || backgroundRendererRegistry.default;
    bgRenderer(ctx, W, H);
  }

  // 3. Gambar Setiap Elemen Menggunakan Strategy Registry
  for (const el of targetElements) {
    if (!el.visible) continue;

    const posX = (el.x / 100) * W;
    const posY = (el.y / 100) * H;
    const left = -el.width / 2;
    const top = -el.height / 2;

    ctx.save();
    ctx.translate(posX, posY);
    if (el.rotation) {
      ctx.rotate(((el.rotation % 360) * Math.PI) / 180);
    }
    if (el.opacity !== undefined && el.opacity < 100) {
      ctx.globalAlpha = el.opacity / 100;
    }

    const renderer = elementRendererRegistry[el.type];
    if (renderer) {
      renderer({
        ctx,
        element: el,
        left,
        top,
        W,
        H,
        imageMap
      });
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}
