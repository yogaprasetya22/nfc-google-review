import React from 'react';
import type { CanvasElement } from '../types';

interface TemplateBackgroundRendererProps {
  element: CanvasElement;
}

export function TemplateBackgroundRenderer({ element: el }: TemplateBackgroundRendererProps) {
  const variant = el.bgVariant || 'wave';
  const primaryColor = el.primaryColor || '#3b82f6';
  const secondaryColor = el.secondaryColor || '#4f46e5';

  switch (variant) {
    case 'wave':
      return (
        <div className="w-full h-full relative overflow-hidden pointer-events-none rounded-3xl select-none">
          {/* Top Gradient Layer */}
          <div
            className="absolute inset-x-0 top-0 h-[48%]"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
            }}
          />
          {/* Wave SVG transition */}
          <svg
            viewBox="0 0 520 120"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-[38%] w-full h-[22%] fill-white"
          >
            <path d="M0,45 C150,15 350,75 520,35 L520,120 L0,120 Z" />
          </svg>
          {/* Bottom Solid Layer */}
          <div className="absolute inset-x-0 bottom-0 top-[52%] bg-white" />
        </div>
      );

    case 'black_curve':
      return (
        <div className="w-full h-full relative overflow-hidden pointer-events-none rounded-3xl select-none">
          {/* Top Curve */}
          <div
            className="absolute inset-x-0 top-0 h-[44%]"
            style={{ backgroundColor: primaryColor || '#0a0a0a' }}
          />
          <svg
            viewBox="0 0 520 100"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-[35%] w-full h-[18%] fill-white"
          >
            <path d="M0,25 C140,75 380,75 520,25 L520,100 L0,100 Z" />
          </svg>
          {/* Bottom Layer */}
          <div className="absolute inset-x-0 bottom-0 top-[48%] bg-white" />
          {/* Separator lines between NFC and QR */}
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 h-8 w-[1.5px] bg-slate-300" />
          <div className="absolute left-1/2 top-[72%] -translate-x-1/2 h-8 w-[1.5px] bg-slate-300" />
        </div>
      );

    case 'frame_quad':
      return (
        <div className="w-full h-full relative p-4 pointer-events-none rounded-3xl select-none">
          <div className="w-full h-full rounded-2xl border-[6px] border-transparent relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-red-500" />
            <div className="absolute inset-y-0 right-0 w-1.5 bg-red-500" />
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-red-500" />
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 to-amber-400" />
          </div>
        </div>
      );

    case 'badge_circle':
      return (
        <div className="w-full h-full relative flex items-center justify-center pointer-events-none select-none">
          <div className="absolute top-[21%] w-56 h-56 rounded-full border-[8px] border-blue-500 border-t-red-500 border-r-amber-400 border-b-emerald-500 opacity-90" />
        </div>
      );

    case 'qr_focus':
      return (
        <div className="w-full h-full relative overflow-hidden pointer-events-none rounded-3xl select-none">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-red-500 to-amber-400" />
          <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />
        </div>
      );

    default:
      return null;
  }
}
