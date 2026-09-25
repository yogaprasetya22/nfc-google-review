import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Magnet, Radio, QrCode, Star, Layers, RotateCcw, Lock, Unlock, Trash2, Edit3, Keyboard, X, Copy, MoreHorizontal, Upload } from 'lucide-react';
import type { CanvasElement, TemplateType, DimensionInfo, CardSide } from './types';
import { CanvasElementRenderer } from './elements/CanvasElementRenderer';

interface StudioArtboardProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentDimensions: DimensionInfo;
  zoomScale: number;
  setZoomScale: React.Dispatch<React.SetStateAction<number>>;
  snapEnabled: boolean;
  setSnapEnabled: (val: boolean) => void;
  showGuides: boolean;
  setShowGuides: (val: boolean) => void;
  canvasBgColor: string;
  activeTemplate: TemplateType;
  bgImage: string | null;
  bgScaleMode: 'cover' | 'contain' | 'stretch';
  activeGuides: {
    vCenter?: boolean;
    hCenter?: boolean;
    alignWithOtherX?: number;
    alignWithOtherY?: number;
    snapWallLeft?: boolean;
    snapWallRight?: boolean;
    symmetricSnapPx?: number;
  };
  selectedElement: CanvasElement | undefined;
  selectedDistances: { leftEdge: number; rightEdge: number; topEdge: number; bottomEdge: number } | null;
  elements: CanvasElement[];
  selectedElementId: string | null;
  qrDataUrl: string;
  onPointerDown: (e: React.PointerEvent, elemId: string) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onResizeStart?: (
    e: React.PointerEvent,
    elemId: string,
    handle: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r'
  ) => void;
  onRotateStart?: (e: React.PointerEvent, elemId: string) => void;
  onToggleLock?: (elemId: string) => void;
  onDeleteElement?: (elemId: string) => void;
  onDuplicateElement?: (elemId: string) => void;
  onUpdateElementContent?: (elemId: string, content: string) => void;
  getElementWallDistances: (el: CanvasElement) => { leftEdge: number; rightEdge: number; topEdge: number; bottomEdge: number };
  onDeselect: () => void;
  activeSide?: CardSide;
  onDropImageOnCanvas?: (file: File, isBgMode: boolean, clientX: number, clientY: number) => void;
}

export function StudioArtboard({
  containerRef,
  currentDimensions,
  zoomScale,
  setZoomScale,
  snapEnabled,
  setSnapEnabled,
  showGuides,
  setShowGuides,
  canvasBgColor,
  activeTemplate,
  bgImage,
  bgScaleMode,
  activeGuides,
  selectedElement,
  selectedDistances,
  elements,
  selectedElementId,
  qrDataUrl,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onResizeStart,
  onRotateStart,
  onToggleLock,
  onDeleteElement,
  onDuplicateElement,
  onUpdateElementContent,
  getElementWallDistances,
  onDeselect,
  activeSide = 'front',
  onDropImageOnCanvas
}: StudioArtboardProps) {
  const [editingElementId, setEditingElementId] = React.useState<string | null>(null);
  const [isCanvasDragOver, setIsCanvasDragOver] = useState(false);
  const [isBgDropMode, setIsBgDropMode] = useState(false);

  const handleContainerDeselect = (e: React.MouseEvent) => {
    // Only deselect if user clicked directly on the outer backdrop itself
    if (e.target === e.currentTarget) {
      setEditingElementId(null);
      onDeselect();
    }
  };

  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <main
      className="flex-1 bg-slate-100 flex flex-col items-center justify-center p-8 overflow-auto select-none relative"
      onClick={handleContainerDeselect}
    >
      {/* Zoom & Canvas Tool Float */}
      <div className="absolute top-4 left-6 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm backdrop-blur z-20">
        <button
          onClick={() => setZoomScale((z) => Math.max(0.5, z - 0.1))}
          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition"
          title="Perkecil Canvas"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-xs font-mono font-medium text-slate-700 w-12 text-center">
          {Math.round(zoomScale * 100)}%
        </span>
        <button
          onClick={() => setZoomScale((z) => Math.min(1.8, z + 0.1))}
          className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition"
          title="Perbesar Canvas"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        <button
          onClick={() => setSnapEnabled(!snapEnabled)}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
            snapEnabled ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Magnet Snapping Dinding & Center"
        >
          <Magnet className="h-3 w-3" />
          Snap Magnet
        </button>

        <button
          onClick={() => setShowGuides(!showGuides)}
          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
            showGuides ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Grid Bantu
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        <button
          onClick={() => setShowShortcuts(true)}
          className="text-xs px-2.5 py-1 rounded-lg font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition"
          title="Daftar Shortcut Keyboard (Canva Style)"
        >
          <Keyboard className="h-3.5 w-3.5 text-blue-600" />
          <span>Shortcut</span>
        </button>
      </div>

      {/* Modal Dialog Panduan Shortcut Keyboard */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Shortcut Keyboard Canva</h3>
                  <p className="text-[11px] text-slate-500">Akselerasi desain kartu NFC cepat & presisi</p>
                </div>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Geser Posisi Objek Presisi (1px)</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  ↑ ↓ ← →
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Geser Cepat (10px)</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Shift + Panah
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Resize Skala Seimbang (Proporsional)</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Tahan Shift + Tarik Sudut
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Duplikat Objek Terpilih</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Ctrl + D
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Kunci / Buka Posisi Objek</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Ctrl + L
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Naikkan / Turunkan Lapisan</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Ctrl + ] / Ctrl + [
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Hapus Objek Aktif</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Delete / Backspace
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Undo / Redo</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Ctrl+Z / Ctrl+Y
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Lepaskan Seleksi (Deselect)</span>
                <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                  Escape
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowShortcuts(false)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
          {currentDimensions.name} ({currentDimensions.width} x {currentDimensions.height} px)
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          activeSide === 'front'
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {activeSide === 'front' ? '• Sisi Depan' : '• Sisi Belakang'}
        </span>
      </div>

      {/* Interactive Canva-Style Artboard */}
      <div
        ref={containerRef}
        onClick={(e) => {
          // If clicked directly on the artboard card (empty area of card), deselect element
          if (e.target === e.currentTarget) {
            setEditingElementId(null);
            onDeselect();
          }
        }}
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
            setIsCanvasDragOver(true);
            setIsBgDropMode(e.shiftKey);
          }
        }}
        onDragLeave={(e) => {
          // Hanya matikan overlay jika keluar dari container artboard
          if (e.currentTarget === e.target) {
            setIsCanvasDragOver(false);
            setIsBgDropMode(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsCanvasDragOver(false);
          setIsBgDropMode(false);
          const file = e.dataTransfer.files?.[0];
          if (file) {
            onDropImageOnCanvas?.(file, e.shiftKey, e.clientX, e.clientY);
          }
        }}
        style={{
          width: `${currentDimensions.width}px`,
          height: `${currentDimensions.height}px`,
          transform: `scale(${zoomScale})`,
          transformOrigin: 'center center',
          backgroundColor: canvasBgColor
        }}
        className="relative rounded-3xl shadow-2xl overflow-visible border border-slate-300 bg-white"
      >
        {/* Visual Drag & Drop Overlay on Canvas */}
        {isCanvasDragOver && (
          <div className="absolute inset-0 z-50 bg-[#8b3dff]/15 backdrop-blur-2xs rounded-3xl border-4 border-dashed border-[#8b3dff] flex flex-col items-center justify-center p-6 text-center pointer-events-none animate-in fade-in duration-150">
            <div className="bg-white/95 px-6 py-4 rounded-2xl shadow-2xl border border-purple-200 flex flex-col items-center gap-2">
              <Upload className="w-9 h-9 text-[#8b3dff] animate-bounce" />
              <span className="text-sm font-bold text-slate-900">
                {isBgDropMode ? 'Lepas untuk Ganti Background Kartu' : 'Lepas untuk Tambah Gambar ke Kanvas'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                💡 Tahan <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-800 font-mono font-semibold">Shift</kbd> untuk jadikan background
              </span>
            </div>
          </div>
        )}
        {/* CLIPPED ARTBOARD CANVAS CONTENT (Objek terpotong rapi di tepi kartu) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-auto">
          {/* Custom Background Image if any */}
          {bgImage && (
            <img
              src={bgImage}
              alt="Background Template"
              className={`absolute inset-0 w-full h-full pointer-events-none rounded-3xl ${
                bgScaleMode === 'cover'
                  ? 'object-cover'
                  : bgScaleMode === 'contain'
                  ? 'object-contain'
                  : 'object-fill'
              }`}
            />
          )}

          {/* Grid overlay */}
          {showGuides && (
            <div
              className="absolute inset-0 pointer-events-none opacity-15 rounded-3xl overflow-hidden"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* Smart Canva Guide Lines */}
          {activeGuides.vCenter && (
            <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-pink-500 z-30 pointer-events-none shadow-xs" />
          )}
          {activeGuides.hCenter && (
            <div className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-pink-500 z-30 pointer-events-none shadow-xs" />
          )}
          {activeGuides.alignWithOtherY !== undefined && (
            <div
              style={{ top: `${activeGuides.alignWithOtherY}px` }}
              className="absolute left-0 right-0 h-[1.5px] border-t border-dashed border-blue-500 z-30 pointer-events-none"
            />
          )}

          {/* Dynamic Symmetrical Match Guide Banner */}
          {activeGuides.symmetricSnapPx !== undefined && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-30 pointer-events-none flex items-center gap-1.5 animate-pulse">
              <span>🎯 Simetris Sempurna:</span>
              <span>Kiri {activeGuides.symmetricSnapPx}px = Kanan {activeGuides.symmetricSnapPx}px</span>
            </div>
          )}

          {/* Visual Margin Guides from Wall */}
          {selectedElement && (
            <>
              <div
                style={{
                  left: 0,
                  width: `${Math.max(0, (selectedElement.x / 100) * currentDimensions.width - selectedElement.width / 2)}px`,
                  top: `${(selectedElement.y / 100) * currentDimensions.height}px`
                }}
                className="absolute h-[1px] border-t border-dashed border-pink-500 z-30 pointer-events-none flex items-center justify-center"
              >
                <span className="bg-pink-600 text-white font-mono text-[9px] font-bold px-1 py-0.2 rounded absolute -top-3 shadow-2xs">
                  {selectedDistances?.leftEdge}px
                </span>
              </div>

              <div
                style={{
                  left: `${(selectedElement.x / 100) * currentDimensions.width + selectedElement.width / 2}px`,
                  right: 0,
                  top: `${(selectedElement.y / 100) * currentDimensions.height}px`
                }}
                className="absolute h-[1px] border-t border-dashed border-pink-500 z-30 pointer-events-none flex items-center justify-center"
              >
                <span className="bg-pink-600 text-white font-mono text-[9px] font-bold px-1 py-0.2 rounded absolute -top-3 shadow-2xs">
                  {selectedDistances?.rightEdge}px
                </span>
              </div>
            </>
          )}

          {/* Canvas Draggable Elements (Isi Visual Terpotong di Kanvas) */}
          {elements.map((el, idx) => {
            if (!el.visible) return null;

            const isSelected = selectedElementId === el.id;
            const posX = (el.x / 100) * currentDimensions.width;
            const posY = (el.y / 100) * currentDimensions.height;
            const rotationAngle = el.rotation || 0;
            const isEditing = editingElementId === el.id;

            return (
              <div
                key={el.id}
                onPointerDown={(e) => {
                  if (!isEditing) {
                    onPointerDown(e, el.id);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (el.type === 'text' && !el.locked) {
                    setEditingElementId(el.id);
                  }
                }}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: `translate(${posX - el.width / 2}px, ${posY - el.height / 2}px) rotate(${rotationAngle}deg)`,
                  touchAction: isEditing ? 'auto' : 'none',
                  zIndex: idx + 1
                }}
                className={`absolute flex items-center justify-center select-none group will-change-transform ${
                  el.locked ? 'cursor-default' : isEditing ? 'cursor-text' : 'cursor-move'
                } ${!isSelected ? 'hover:ring-1 hover:ring-purple-300' : ''}`}
              >
                <CanvasElementRenderer
                  element={el}
                  qrDataUrl={qrDataUrl}
                  isEditing={isEditing}
                  onUpdateContent={(val) => onUpdateElementContent?.(el.id, val)}
                  onFinishEditing={() => setEditingElementId(null)}
                />
              </div>
            );
          })}
        </div>

        {/* UNCLIPPED SELECTION OUTLINE, 8 HANDLES, ROTATION & ACTION PILL (Tetap terlihat di luar canvas) */}
        {selectedElement && selectedElement.visible && (() => {
          const selPosX = (selectedElement.x / 100) * currentDimensions.width;
          const selPosY = (selectedElement.y / 100) * currentDimensions.height;
          const selRotation = selectedElement.rotation || 0;
          const selectedIndex = elements.findIndex((el) => el.id === selectedElement.id);
          const selZIndex = selectedIndex >= 0 ? selectedIndex + 1 : 10;

          return (
            <div
              onPointerDown={(e) => {
                if (!selectedElement.locked) {
                  onPointerDown(e, selectedElement.id);
                }
              }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                width: `${selectedElement.width}px`,
                height: `${selectedElement.height}px`,
                transform: `translate(${selPosX - selectedElement.width / 2}px, ${selPosY - selectedElement.height / 2}px) rotate(${selRotation}deg)`,
                touchAction: 'none',
                zIndex: selZIndex
              }}
              className={`absolute flex items-center justify-center select-none will-change-transform ${
                selectedElement.locked
                  ? 'cursor-default ring-2 ring-amber-500 shadow-md'
                  : 'cursor-move ring-[1.5px] ring-[#8b3dff]'
              }`}
            >
              {/* Canva Action Pill directly above Canvas Element (Canva-style) */}
              <div className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-lg border border-slate-200/90 z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onToggleLock?.(selectedElement.id);
                  }}
                  className={`p-1 rounded-md transition flex items-center gap-1 text-[11px] font-medium px-1.5 ${
                    selectedElement.locked
                      ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={selectedElement.locked ? 'Buka Kunci Objek (Unlock)' : 'Kunci Objek (Lock)'}
                >
                  {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                {selectedElement.id !== 'qr' && selectedElement.id !== 'nfc' && !selectedElement.locked && (
                  <>
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        onDuplicateElement?.(selectedElement.id);
                      }}
                      className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                      title="Duplikat (Ctrl+D)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        onDeleteElement?.(selectedElement.id);
                      }}
                      className="p-1 rounded-md text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Hapus (Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {selectedElement.type === 'text' && (
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          setEditingElementId(selectedElement.id);
                        }}
                        className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition flex items-center gap-1 text-[10px] font-semibold px-1"
                        title="Tulis teks"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* 8 Handles (4 Corners + 4 Side Edge Pills) Canva Identical */}
              {!selectedElement.locked && (
                <>
                  {/* Top-Left Corner Circle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'tl');
                    }}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-nwse-resize hover:scale-125 transition-transform z-30 pointer-events-auto"
                    title="Ubah ukuran sudut"
                  />

                  {/* Top-Right Corner Circle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'tr');
                    }}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-nesw-resize hover:scale-125 transition-transform z-30 pointer-events-auto"
                    title="Ubah ukuran sudut"
                  />

                  {/* Bottom-Left Corner Circle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'bl');
                    }}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-nesw-resize hover:scale-125 transition-transform z-30 pointer-events-auto"
                    title="Ubah ukuran sudut"
                  />

                  {/* Bottom-Right Corner Circle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'br');
                    }}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-nwse-resize hover:scale-125 transition-transform z-30 pointer-events-auto"
                    title="Ubah ukuran sudut"
                  />

                  {/* Top Middle Edge Pill Handle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 't');
                    }}
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-ns-resize hover:scale-115 transition-transform z-30 pointer-events-auto"
                    title="Tarik atas"
                  />

                  {/* Bottom Middle Edge Pill Handle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'b');
                    }}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2.5 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-ns-resize hover:scale-115 transition-transform z-30 pointer-events-auto"
                    title="Tarik bawah"
                  />

                  {/* Left Middle Edge Pill Handle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'l');
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-2.5 h-4 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-ew-resize hover:scale-115 transition-transform z-30 pointer-events-auto"
                    title="Tarik kiri"
                  />

                  {/* Right Middle Edge Pill Handle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onResizeStart?.(e, selectedElement.id, 'r');
                    }}
                    className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-2.5 h-4 bg-white border-2 border-[#8b3dff] rounded-full shadow-xs cursor-ew-resize hover:scale-115 transition-transform z-30 pointer-events-auto"
                    title="Tarik kanan"
                  />

                  {/* Canva Interactive Rotation Handle with Stem */}
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 pointer-events-auto">
                    <div className="w-[1.5px] h-2.5 bg-[#8b3dff]" />
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        onRotateStart?.(e, selectedElement.id);
                      }}
                      className="w-5 h-5 bg-white border-[1.5px] border-slate-300 hover:border-[#8b3dff] rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 text-slate-700 hover:text-[#8b3dff] transition-all"
                      title="Putar objek"
                    >
                      <RotateCcw className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>
                  </div>
                </>
              )}

              {/* Canva Live Dimension Tooltip (w x h) */}
              <div className="absolute -bottom-6 right-0 translate-y-full bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-30">
                {selectedElement.locked ? (
                  <span className="text-amber-300 flex items-center gap-1 font-sans">
                    <Lock className="w-2.5 h-2.5" /> Terkunci
                  </span>
                ) : (
                  <span>
                    l: {Math.round(selectedElement.width / 10)} t: {Math.round(selectedElement.height / 10)}
                    {selRotation !== 0 && ` • ${selRotation}°`}
                  </span>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </main>
  );
}
