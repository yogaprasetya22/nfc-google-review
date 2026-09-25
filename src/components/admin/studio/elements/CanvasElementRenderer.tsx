import React from 'react';
import type { CanvasElement } from '../types';
import { QrCode, Star, Radio, Bookmark } from 'lucide-react';
import { ShapeRenderer } from './ShapeRenderer';
import { TextRenderer } from './TextRenderer';
import { TemplateBackgroundRenderer } from './TemplateBackgroundRenderer';

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
        <div className="w-full h-full rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100 pointer-events-none">
          <span className="font-black text-blue-600 text-3xl select-none">G</span>
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
              className="w-full h-full object-cover pointer-events-none select-none"
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
