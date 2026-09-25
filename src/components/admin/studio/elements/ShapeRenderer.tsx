import React from 'react';
import type { CanvasElement } from '../types';

interface ShapeRendererProps {
  element: CanvasElement;
}

export function ShapeRenderer({ element: el }: ShapeRendererProps) {
  const fill = el.fillColor || '#0f172a';
  const stroke = el.strokeColor || 'transparent';
  const strokeW = el.borderWidth || 0;

  switch (el.shapeType) {
    // ----------------------------------------------------
    // BENTUK DASAR (Basic Shapes)
    // ----------------------------------------------------
    case 'rect':
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

    case 'rounded_rect':
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

    case 'circle':
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

    case 'triangle':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 95,95 5,95"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'diamond':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'trapezoid':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="20,10 80,10 95,90 5,90"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'parallelogram':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="25,10 95,10 75,90 5,90"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'capsule':
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

    case 'shield':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M50,5 L90,20 C90,65 50,95 50,95 C50,95 10,65 10,20 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'heart':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M50,88 C50,88 10,60 10,32 C10,18 22,8 35,8 C43,8 47,13 50,18 C53,13 57,8 65,8 C78,8 90,18 90,32 C90,60 50,88 50,88 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // POLIGON (Polygons)
    // ----------------------------------------------------
    case 'pentagon':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 97,39 79,95 21,95 3,39"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'hexagon':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,3 95,25 95,75 50,97 5,75 5,25"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'heptagon':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,4 89,23 99,66 72,97 28,97 1,66 11,23"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'octagon':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // BINTANG & BURST (Stars & Bursts)
    // ----------------------------------------------------
    case 'star':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'star_4':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'star_6':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 62,28 88,20 75,45 95,65 68,68 50,95 32,68 5,65 25,45 12,20 38,28"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'star_8':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 60,30 85,15 70,40 95,50 70,60 85,85 60,70 50,95 40,70 15,85 30,60 5,50 30,40 15,15 40,30"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'star_burst':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,2 57,20 72,9 73,28 90,23 83,40 99,44 87,57 99,69 83,72 89,90 71,83 69,99 54,87 46,99 41,83 23,90 29,72 13,69 25,57 13,44 29,40 22,23 39,28 40,9 55,20"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // GARIS & CONNECTORS (Lines)
    // ----------------------------------------------------
    case 'line':
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

    case 'line_dashed':
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

    case 'line_arrow_right':
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

    case 'line_arrow_double':
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

    // ----------------------------------------------------
    // PANAH (Arrows)
    // ----------------------------------------------------
    case 'arrow': // Right Arrow Block
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M0,20 L60,20 L60,0 L100,30 L60,60 L60,40 L0,40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'arrow_left':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M100,20 L40,20 L40,0 L0,30 L40,60 L40,40 L100,40 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'arrow_up':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 60 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M20,100 L20,40 L0,40 L30,0 L60,40 L40,40 L40,100 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'arrow_down':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 60 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M20,0 L20,60 L0,60 L30,100 L60,60 L40,60 L40,0 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'arrow_double_horizontal':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M30,0 L0,30 L30,60 L30,40 L70,40 L70,60 L100,30 L70,0 L70,20 L30,20 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // DIAGRAM ALIR / FLOWCHART (Flowchart Shapes)
    // ----------------------------------------------------
    case 'flow_cylinder':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M10,25 C10,12 30,5 50,5 C70,5 90,12 90,25 L90,75 C90,88 70,95 50,95 C30,95 10,88 10,75 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
            />
            <ellipse
              cx="50"
              cy="25"
              rx="40"
              ry="15"
              fill="rgba(255,255,255,0.15)"
              stroke={stroke || fill}
              strokeWidth={Math.max(1, strokeW)}
            />
          </svg>
        </div>
      );

    case 'flow_document':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M10,10 L90,10 L90,75 C70,65 50,95 10,80 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'flow_data':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="20,15 95,15 80,85 5,85"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'flow_decision':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'bookmark_banner':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polygon
              points="0,0 100,0 100,100 50,80 0,100"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'flow_display':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M25,5 L80,5 C95,5 100,25 100,50 C100,75 95,95 80,95 L25,95 L0,50 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // BALON PERCAKAPAN & AWAN (Callouts & Clouds)
    // ----------------------------------------------------
    case 'chat_bubble':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M10,10 Q10,0 20,0 L80,0 Q90,0 90,10 L90,50 Q90,60 80,60 L35,60 L15,78 L18,60 L10,60 Q0,60 0,50 L0,10 Q0,0 10,0 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
            />
          </svg>
        </div>
      );

    case 'chat_square':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M5,5 L95,5 L95,55 L40,55 L20,75 L22,55 L5,55 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'cloud':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 70" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M25,60 L78,60 C88,60 95,52 95,43 C95,34 89,28 80,27 C78,16 68,8 55,8 C44,8 35,14 31,23 C28,21 24,20 20,20 C10,20 2,28 2,38 C2,49 11,58 23,60 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ----------------------------------------------------
    // SPECIAL GOOGLE BADGE
    // ----------------------------------------------------
    case 'google_ring':
    default:
      return (
        <div className="w-full h-full rounded-full border-[6px] border-blue-500 border-t-red-500 border-r-amber-400 border-b-emerald-500 flex items-center justify-center shadow-xs">
          {el.content && (
            <span className="text-[10px] font-bold text-slate-800">{el.content}</span>
          )}
        </div>
      );
  }
}
