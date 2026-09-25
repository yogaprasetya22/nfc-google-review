import React from 'react';
import type { CanvasElement } from '../types';
import { QrCode, Star, Radio, Bookmark } from 'lucide-react';
import { ShapeRenderer } from './ShapeRenderer';
import { TextRenderer } from './TextRenderer';
import { TemplateBackgroundRenderer } from './TemplateBackgroundRenderer';
import { IconBadgeRenderer } from './IconBadgeRenderer';

interface CanvasElementRendererProps {
  element: CanvasElement;
  qrDataUrl: string;
  isEditing?: boolean;
  onUpdateContent?: (content: string) => void;
  onFinishEditing?: () => void;
}

function CanvasElementRendererComponent({
  element: el,
  qrDataUrl,
  isEditing,
  onUpdateContent,
  onFinishEditing
}: CanvasElementRendererProps) {
  switch (el.type) {
    case 'template_bg':
      return <TemplateBackgroundRenderer element={el} />;

    case 'icon_badge':
      return <IconBadgeRenderer element={el} />;

    case 'text':
      return (
        <TextRenderer
          element={el}
          isEditing={isEditing}
          onUpdateContent={onUpdateContent}
          onFinishEditing={onFinishEditing}
        />
      );

    case 'shape':
      return <ShapeRenderer element={el} />;

    case 'qrcode':
      return (
        <div className="w-full h-full bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center pointer-events-none">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code Link"
              className="w-full h-full object-contain pointer-events-none"
            />
          ) : (
            <QrCode className="h-8 w-8 text-slate-400" />
          )}
        </div>
      );

    case 'stars_5':
      return (
        <div className="flex items-center justify-center gap-1.5 w-full h-full pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-full w-auto text-amber-400 fill-amber-400 drop-shadow-xs"
            />
          ))}
        </div>
      );

    case 'logo_google':
      return (
        <div className="w-full h-full rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100 p-2.5 pointer-events-none">
          <svg viewBox="0 0 48 48" className="w-full h-full select-none pointer-events-none">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        </div>
      );

    case 'google_badge_pill':
      return (
        <div className="w-full h-full rounded-full bg-slate-900 text-white shadow-md flex items-center justify-center px-4 gap-2 font-bold text-sm tracking-tight border border-slate-800 pointer-events-none">
          <Bookmark className="h-4 w-4 text-blue-400 fill-blue-400" />
          <span>{el.content || 'Review us on Google'}</span>
        </div>
      );

    case 'nfc_target':
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none relative">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-12 rounded-full border-2 border-slate-900 bg-white shadow-md flex items-center justify-center pr-3">
              <span className="font-bold text-xs text-slate-900">)))</span>
            </div>
            <div className="absolute -right-5 w-8 h-14 bg-white border-2 border-slate-900 rounded-lg shadow-md flex flex-col items-center justify-between py-1">
              <div className="w-3 h-0.5 bg-slate-900 rounded-full" />
              <div className="w-2 h-2 rounded-full border border-slate-900" />
            </div>
          </div>
        </div>
      );

    case 'image':
      return (
        <div
          style={{
            opacity: el.opacity !== undefined ? el.opacity / 100 : 1,
            borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
            overflow: el.borderRadius ? 'hidden' : undefined
          }}
          className="w-full h-full pointer-events-none flex items-center justify-center"
        >
          {el.imageUrl ? (
            <img
              src={el.imageUrl}
              alt={el.label}
              style={{
                borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined
              }}
              onError={(e) => {
                const target = e.currentTarget;
                // Cegah loop tak berujung jika file memang sudah terhapus di Google Drive
                if (target.dataset.triedFallback === 'true') {
                  target.style.display = 'none';
                  return;
                }
                target.dataset.triedFallback = 'true';

                const src = target.src;
                if (src.includes('lh3.googleusercontent.com/d/')) {
                  const match = src.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
                  if (match) target.src = `/api/gdrive-image?id=${match[1]}`;
                } else if (src.includes('/api/gdrive-image')) {
                  const match = src.match(/id=([a-zA-Z0-9_-]+)/);
                  if (match) target.src = `https://lh3.googleusercontent.com/d/${match[1]}`;
                }
              }}
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
              Gambar
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export const CanvasElementRenderer = React.memo(CanvasElementRendererComponent);
