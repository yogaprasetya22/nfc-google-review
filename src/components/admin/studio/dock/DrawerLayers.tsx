import React from 'react';
import type { CanvasElement } from '../types';
import {
  Eye,
  EyeOff,
  Radio,
  QrCode,
  Star,
  Type,
  Bookmark,
  Shapes,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Lock,
  Unlock,
  Layers as LayersIcon,
  Layout
} from 'lucide-react';

interface DrawerLayersProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onToggleElementVisible: (id: string) => void;
  onToggleElementLock?: (id: string) => void;
  onMoveLayer?: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  getElementWallDistances: (el: CanvasElement) => { leftEdge: number; rightEdge: number };
}

export function DrawerLayers({
  elements,
  selectedElementId,
  onSelectElement,
  onToggleElementVisible,
  onToggleElementLock,
  onMoveLayer,
  getElementWallDistances
}: DrawerLayersProps) {
  // Photoshop hierarchy: Top in UI = Top of stack (highest z-index / rendered last)
  // Our array renders index 0 first (bottom) and last index on top.
  // So reverse array for Photoshop-style display:
  const reversedElements = [...elements].map((el, originalIndex) => ({
    el,
    originalIndex
  })).reverse();

  const selectedItem = elements.find((el) => el.id === selectedElementId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <LayersIcon className="w-3.5 h-3.5 text-slate-700" />
            Susunan Lapisan ({elements.length})
          </h3>
          <p className="text-[10px] text-slate-500">Urutan atas = Lapisan paling depan (Photoshop)</p>
        </div>
      </div>

      {/* Layer Hierarchy Action Bar for selected element */}
      {selectedItem && onMoveLayer && (
        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="truncate mr-2">
            <span className="text-[10px] font-bold text-slate-800 block truncate">
              {selectedItem.label}
            </span>
            <span className="text-[9px] text-slate-500 block">Atur Posisi Z-Index:</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onMoveLayer(selectedItem.id, 'front')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs"
              title="Bawa ke Paling Depan (Top Layer)"
            >
              <ChevronsUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMoveLayer(selectedItem.id, 'up')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs"
              title="Maju Satu Tingkat (Forward)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMoveLayer(selectedItem.id, 'down')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs"
              title="Mundur Satu Tingkat (Backward)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onMoveLayer(selectedItem.id, 'back')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs"
              title="Kirim ke Paling Belakang (Bottom Layer)"
            >
              <ChevronsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Layer List Stack */}
      <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
        {reversedElements.map(({ el, originalIndex }) => {
          const dist = getElementWallDistances(el);
          const isSelected = selectedElementId === el.id;
          const isTopMost = originalIndex === elements.length - 1;
          const isBottomMost = originalIndex === 0;

          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`group flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                isSelected
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-2">
                <span className={`text-[9px] font-mono w-4 text-center shrink-0 ${
                  isSelected ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  #{originalIndex + 1}
                </span>

                <div className="shrink-0">
                  {el.type === 'nfc_target' && (
                    <Radio className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  )}
                  {el.type === 'qrcode' && (
                    <QrCode className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  )}
                  {el.type === 'stars_5' && (
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  )}
                  {el.type === 'logo_google' && (
                    <div className="h-3.5 w-3.5 rounded-full bg-blue-500" />
                  )}
                  {el.type === 'text' && (
                    <Type className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  )}
                  {el.type === 'google_badge_pill' && (
                    <Bookmark className="h-3.5 w-3.5 text-blue-400" />
                  )}
                  {el.type === 'shape' && (
                    <Shapes className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  )}
                  {el.type === 'image' && (
                    <ImageIcon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  )}
                  {el.type === 'template_bg' && (
                    <Layout className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                  )}
                </div>

                <div className="truncate min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold block truncate leading-tight">{el.label}</span>
                    {isTopMost && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>
                        Depan
                      </span>
                    )}
                    {isBottomMost && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Dasar
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    L: {dist.leftEdge}px | R: {dist.rightEdge}px
                  </span>
                </div>
              </div>

              {/* Action buttons (Lock, Reorder & Visibility) */}
              <div className="flex items-center gap-0.5 shrink-0">
                {onMoveLayer && (
                  <div className="flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={isTopMost}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(el.id, 'up');
                      }}
                      className={`p-1 rounded transition disabled:opacity-20 ${
                        isSelected ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-500'
                      }`}
                      title="Naikkan lapisan (Maju)"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={isBottomMost}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(el.id, 'down');
                      }}
                      className={`p-1 rounded transition disabled:opacity-20 ${
                        isSelected ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-500'
                      }`}
                      title="Turunkan lapisan (Mundur)"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {onToggleElementLock && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleElementLock(el.id);
                    }}
                    className={`p-1 rounded transition ${
                      el.locked
                        ? 'text-amber-400 hover:text-amber-300'
                        : isSelected
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={el.locked ? 'Buka Kunci' : 'Kunci Lapisan'}
                  >
                    {el.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleElementVisible(el.id);
                  }}
                  className={`p-1 rounded transition ${
                    isSelected ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title={el.visible ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {el.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
