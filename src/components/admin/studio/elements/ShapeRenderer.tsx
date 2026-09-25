import React from 'react';
import type { CanvasElement } from '../types';
import { SHAPE_DEFINITIONS } from './shapeDefinitions';

interface ShapeRendererProps {
  element: CanvasElement;
}

export function ShapeRenderer({ element: el }: ShapeRendererProps) {
  const fill = el.fillColor || '#0f172a';
  const stroke = el.strokeColor || 'transparent';
  const strokeW = el.borderWidth || 0;
  const shapeType = el.shapeType || 'circle';

  // 1. Primitive Shapes (CSS-based for optimal layout & crisp borders)
  if (shapeType === 'rect') {
    return (
      <div
        style={{
          backgroundColor: fill,
          borderColor: stroke,
          borderWidth: `${strokeW}px`
        }}
        className="w-full h-full shadow-2xs"
      />
    );
  }

  if (shapeType === 'rounded_rect') {
    return (
      <div
        style={{
          backgroundColor: fill,
          borderColor: stroke,
          borderWidth: `${strokeW}px`,
          borderRadius: `${el.borderRadius || 16}px`
        }}
        className="w-full h-full shadow-2xs"
      />
    );
  }

  if (shapeType === 'circle') {
    return (
      <div
        style={{
          backgroundColor: fill,
          borderColor: stroke,
          borderWidth: `${strokeW}px`
        }}
        className="w-full h-full rounded-full shadow-2xs"
      />
    );
  }

  if (shapeType === 'capsule') {
    return (
      <div
        style={{
          backgroundColor: fill,
          borderColor: stroke,
          borderWidth: `${strokeW}px`,
          borderRadius: '9999px'
        }}
        className="w-full h-full shadow-2xs"
      />
    );
  }

  if (shapeType === 'line') {
    return (
      <div className="w-full h-full flex items-center">
        <div
          style={{
            backgroundColor: fill,
            height: `${Math.max(2, strokeW || 3)}px`
          }}
          className="w-full rounded-full"
        />
      </div>
    );
  }

  if (shapeType === 'line_dashed') {
    return (
      <div className="w-full h-full flex items-center">
        <svg viewBox="0 0 100 10" className="w-full h-4" preserveAspectRatio="none">
          <line
            x1="0"
            y1="5"
            x2="100"
            y2="5"
            stroke={fill}
            strokeWidth={Math.max(2, strokeW || 3)}
            strokeDasharray="6,4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (shapeType === 'line_arrow_right') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <line
            x1="0"
            y1="10"
            x2="85"
            y2="10"
            stroke={fill}
            strokeWidth={Math.max(2, strokeW || 3)}
            strokeLinecap="round"
          />
          <polygon points="82,2 100,10 82,18" fill={fill} />
        </svg>
      </div>
    );
  }

  if (shapeType === 'line_arrow_double') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <polygon points="18,2 0,10 18,18" fill={fill} />
          <line
            x1="15"
            y1="10"
            x2="85"
            y2="10"
            stroke={fill}
            strokeWidth={Math.max(2, strokeW || 3)}
            strokeLinecap="round"
          />
          <polygon points="82,2 100,10 82,18" fill={fill} />
        </svg>
      </div>
    );
  }

  if (shapeType === 'google_ring') {
    return (
      <div className="w-full h-full rounded-full border-[6px] border-blue-500 border-t-red-500 border-r-amber-400 border-b-emerald-500 flex items-center justify-center shadow-xs">
        {el.content && <span className="text-[10px] font-bold text-slate-800">{el.content}</span>}
      </div>
    );
  }

  // 2. Data-Driven Vector SVG Shapes (Tunggal & Otomatis)
  const def = SHAPE_DEFINITIONS[shapeType];
  if (def) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox={def.viewBox} className="w-full h-full" preserveAspectRatio="none">
          {def.type === 'polygon' && def.points && (
            <polygon
              points={def.points}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          )}
          {def.type === 'path' && def.d && (
            <path
              d={def.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    );
  }

  // Fallback default
  return (
    <div
      style={{
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: `${strokeW}px`
      }}
      className="w-full h-full shadow-2xs"
    />
  );
}
