import React from 'react';
import FontPicker from 'react-fontpicker-ts';
import 'react-fontpicker-ts/dist/index.css';
import {
  Sliders,
  Trash2,
  Maximize2,
  RotateCw,
  Palette,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Layers as LayersIcon,
  Italic,
  Type
} from 'lucide-react';
import type { CanvasElement, DimensionInfo } from './types';

interface StudioSidebarRightProps {
  selectedElement: CanvasElement | undefined;
  selectedDistances: { leftEdge: number; rightEdge: number; topEdge: number; bottomEdge: number } | null;
  currentDimensions: DimensionInfo;
  onUpdateSelectedElement: (updates: Partial<CanvasElement>) => void;
  onDeleteSelectedElement: () => void;
  onMoveLayer?: (elemId: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  calcLeftCenterPct: (elemWidth: number, marginPx: number, canvasWidth: number) => number;
  calcRightCenterPct: (elemWidth: number, marginPx: number, canvasWidth: number) => number;
  isInteracting?: boolean;
}

function StudioSidebarRightComponent({
  selectedElement,
  selectedDistances,
  currentDimensions,
  onUpdateSelectedElement,
  onDeleteSelectedElement,
  onMoveLayer,
  calcLeftCenterPct,
  calcRightCenterPct,
  isInteracting
}: StudioSidebarRightProps) {
  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-4 overflow-y-auto shadow-2xs shrink-0">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="h-4 w-4 text-slate-700" /> Pengaturan Objek
        </h3>
        {selectedElement && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateSelectedElement({ locked: !selectedElement.locked })}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                selectedElement.locked
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={selectedElement.locked ? 'Buka Kunci Objek' : 'Kunci Posisi Objek'}
            >
              {selectedElement.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              <span className="text-[10px]">{selectedElement.locked ? 'Terkunci' : 'Kunci'}</span>
            </button>

            {selectedElement.id !== 'qr' && selectedElement.id !== 'nfc' && (
              <button
                onClick={onDeleteSelectedElement}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                title="Hapus Elemen Terpilih"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {selectedElement ? (
        <div className="space-y-4 pt-4">
          <div>
            <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">
              {selectedElement.label}
            </span>
            <p className="text-xs text-slate-500">Sesuaikan tulisan, ukuran, atau jarak dinding</p>
          </div>

          {/* Text specific adjustments */}
          {(selectedElement.type === 'text' || selectedElement.type === 'google_badge_pill') && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-neutral-900/10 shadow-xs">
              <span className="text-[11px] font-bold text-slate-900 block">Edit Tulisan Teks</span>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Isi Tulisan</label>
                <input
                  type="text"
                  value={selectedElement.content || ''}
                  onChange={(e) => onUpdateSelectedElement({ content: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-400 font-semibold"
                />
              </div>

              {/* Font Family Selector (react-fontpicker-ts) */}
              {selectedElement.type === 'text' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <Type className="h-3 w-3 text-slate-600" /> Jenis Huruf (Font Family)
                    </label>
                    {selectedElement.fontFamily && (
                      <span className="text-[9px] font-mono text-blue-600 font-bold">
                        {selectedElement.fontFamily}
                      </span>
                    )}
                  </div>
                  <div className="font-picker-wrapper bg-white rounded-xl border border-slate-200 p-1 text-xs">
                    <FontPicker
                      defaultValue={selectedElement.fontFamily || 'Inter'}
                      value={(fontName: string) => {
                        onUpdateSelectedElement({ fontFamily: fontName });
                      }}
                      autoLoad
                      loadAllVariants
                      fontCategories={['sans-serif', 'serif', 'display', 'handwriting', 'monospace']}
                    />
                  </div>
                </div>
              )}

              {/* Ketebalan, Gaya Miring & Perataan (Canva Style) */}
              {selectedElement.type === 'text' && (
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Ketebalan</label>
                    <select
                      value={selectedElement.fontWeight || 'bold'}
                      onChange={(e) => onUpdateSelectedElement({ fontWeight: e.target.value as any })}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Tebal</option>
                      <option value="black">Ekstra</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Gaya (Style)</label>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSelectedElement({
                          fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic'
                        })
                      }
                      className={`w-full py-1.5 px-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1 ${
                        selectedElement.fontStyle === 'italic'
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Gaya Huruf Miring (Italic)"
                    >
                      <Italic className="h-3.5 w-3.5" />
                      <span>Miring</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Perataan</label>
                    <div className="flex bg-white rounded-xl border border-slate-200 p-0.5">
                      {(['left', 'center', 'right'] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => onUpdateSelectedElement({ textAlign: align })}
                          className={`flex-1 py-1 text-[10px] font-bold capitalize rounded-lg transition ${
                            (selectedElement.textAlign || 'center') === align
                              ? 'bg-neutral-900 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {align[0].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Ukuran Font</label>
                  <input
                    type="number"
                    min="8"
                    max="60"
                    value={selectedElement.fontSize || 14}
                    onChange={(e) => onUpdateSelectedElement({ fontSize: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Warna Tulisan</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.textColor || '#0f172a'}
                      onChange={(e) => onUpdateSelectedElement({ textColor: e.target.value })}
                      className="w-9 h-8 bg-transparent cursor-pointer rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {['#0f172a', '#ffffff', '#4285F4', '#EA4335', '#FBBC05', '#34A853'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSelectedElement({ textColor: c })}
                          style={{ backgroundColor: c }}
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-transform"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Template Background specific adjustments */}
          {selectedElement.type === 'template_bg' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-neutral-900/10 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 block">Edit Warna Desain Template</span>
                <span className="text-[10px] font-mono text-blue-600 uppercase font-semibold">
                  {selectedElement.bgVariant || 'wave'}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Warna Utama (Primary / Gradien Kiri)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.primaryColor || '#3b82f6'}
                      onChange={(e) => onUpdateSelectedElement({ primaryColor: e.target.value })}
                      className="w-9 h-8 bg-transparent cursor-pointer rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {['#3b82f6', '#0a0a0a', '#059669', '#dc2626', '#d97706', '#7c3aed'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSelectedElement({ primaryColor: c })}
                          style={{ backgroundColor: c }}
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-transform"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Warna Sekunder (Secondary / Gradien Kanan)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.secondaryColor || '#4f46e5'}
                      onChange={(e) => onUpdateSelectedElement({ secondaryColor: e.target.value })}
                      className="w-9 h-8 bg-transparent cursor-pointer rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {['#4f46e5', '#ffffff', '#10b981', '#f59e0b', '#ec4899', '#6366f1'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSelectedElement({ secondaryColor: c })}
                          style={{ backgroundColor: c }}
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-transform"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shape specific adjustments (Canva Shape Inspector) */}
          {selectedElement.type === 'shape' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-neutral-900/10 shadow-xs">
              <span className="text-[11px] font-bold text-slate-900 block">Edit Bentuk & Warna Shape</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Warna Isi (Fill)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedElement.fillColor || '#0f172a'}
                      onChange={(e) => onUpdateSelectedElement({ fillColor: e.target.value })}
                      className="w-8 h-8 bg-transparent cursor-pointer rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {['#0f172a', '#ffffff', '#3b82f6', '#ef4444', '#10b981'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSelectedElement({ fillColor: c })}
                          style={{ backgroundColor: c }}
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-transform"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Warna Garis (Stroke)</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedElement.strokeColor || '#3b82f6'}
                      onChange={(e) => onUpdateSelectedElement({ strokeColor: e.target.value })}
                      className="w-8 h-8 bg-transparent cursor-pointer rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {['#000000', '#3b82f6', '#e2e8f0', '#ef4444', '#10b981'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => onUpdateSelectedElement({ strokeColor: c })}
                          style={{ backgroundColor: c }}
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-transform"
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Tebal Garis Border</span>
                  <span className="font-mono">{selectedElement.borderWidth || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={selectedElement.borderWidth || 0}
                  onChange={(e) => onUpdateSelectedElement({ borderWidth: Number(e.target.value) })}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>

              {selectedElement.shapeType === 'rounded_rect' && (
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Sudut Lengkung (Radius)</span>
                    <span className="font-mono">{selectedElement.borderRadius || 16}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={selectedElement.borderRadius || 16}
                    onChange={(e) => onUpdateSelectedElement({ borderRadius: Number(e.target.value) })}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Image Object Inspector */}
          {selectedElement.type === 'image' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-neutral-900/10 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 block">Pengaturan Gambar Objek</span>
                <span className="text-[10px] font-mono text-purple-600 uppercase font-semibold">Image</span>
              </div>

              {selectedElement.imageUrl && (
                <div className="w-full h-24 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-1 shadow-2xs">
                  <img
                    src={selectedElement.imageUrl}
                    alt={selectedElement.label}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Transparansi (Opacity)</span>
                  <span className="font-mono">{selectedElement.opacity ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={selectedElement.opacity ?? 100}
                  onChange={(e) => onUpdateSelectedElement({ opacity: Number(e.target.value) })}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Sudut Melengkung (Radius)</span>
                  <span className="font-mono">{selectedElement.borderRadius || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedElement.borderRadius || 0}
                  onChange={(e) => onUpdateSelectedElement({ borderRadius: Number(e.target.value) })}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
              </div>

              <div className="pt-1 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSelectedElement({
                      x: 50,
                      y: 50,
                      width: currentDimensions.width,
                      height: currentDimensions.height
                    })
                  }
                  className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition text-center shadow-2xs"
                >
                  📐 Pasang Ukuran Penuh (Background)
                </button>

                {onMoveLayer && (
                  <button
                    type="button"
                    onClick={() => onMoveLayer(selectedElement.id, 'back')}
                    className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition text-center shadow-2xs"
                  >
                    ⬇️ Kirim ke Lapisan Paling Dasar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Live Distance Meter (Canva-style Inspector) */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="h-3.5 w-3.5 text-neutral-900" />
                Jarak Dinding Objek Ini
              </span>
              <span className="text-[10px] bg-neutral-900 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                Aktif
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-0.5">Dinding Kiri</span>
                <span className="text-base font-mono font-bold text-slate-900">{selectedDistances?.leftEdge} px</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-0.5">Dinding Kanan</span>
                <span className="text-base font-mono font-bold text-slate-900">{selectedDistances?.rightEdge} px</span>
              </div>
            </div>

            {/* Quick set for selected object */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <span className="text-[10px] font-semibold text-slate-600 block">
                Kunci Jarak Objek Ini ke Dinding Terdekat:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[20, 35, 45, 60].map((px) => (
                  <button
                    key={px}
                    type="button"
                    onClick={() => {
                      const isCloserToLeft = (selectedDistances?.leftEdge || 0) <= (selectedDistances?.rightEdge || 0);
                      const targetPct = isCloserToLeft
                        ? calcLeftCenterPct(selectedElement.width, px, currentDimensions.width)
                        : calcRightCenterPct(selectedElement.width, px, currentDimensions.width);
                      onUpdateSelectedElement({ x: Math.round(targetPct * 100) / 100 });
                    }}
                    className="py-1 px-2 text-xs font-mono font-bold bg-white border border-slate-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white rounded-lg transition"
                  >
                    {px}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rotasi Objek (Angle 0-360 deg) */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5 text-neutral-900" /> Rotasi Objek
              </span>
              <span className="text-[10px] font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                {selectedElement.rotation || 0}°
              </span>
            </div>

            <div>
              <input
                type="range"
                min="0"
                max="360"
                value={selectedElement.rotation || 0}
                onChange={(e) => onUpdateSelectedElement({ rotation: Number(e.target.value) })}
                className="w-full accent-neutral-900 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[0, 45, 90, 180].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => onUpdateSelectedElement({ rotation: deg })}
                  className={`py-1 text-xs font-mono font-bold rounded-lg border transition ${
                    (selectedElement.rotation || 0) === deg
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Inputs */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-800 block">Ukuran Dimensi</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Lebar (Width)</label>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 focus-within:border-neutral-900">
                  <input
                    type="number"
                    min="5"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => {
                      const val = Math.max(5, Number(e.target.value) || 5);
                      onUpdateSelectedElement({ width: val });
                    }}
                    className="w-full text-xs font-mono font-medium text-slate-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">px</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Tinggi (Height)</label>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 focus-within:border-neutral-900">
                  <input
                    type="number"
                    min="5"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => {
                      const val = Math.max(5, Number(e.target.value) || 5);
                      onUpdateSelectedElement({ height: val });
                    }}
                    className="w-full text-xs font-mono font-medium text-slate-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posisi Lapisan (Z-Index Hierarchy ala Photoshop) */}
          {onMoveLayer && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <LayersIcon className="h-3.5 w-3.5 text-neutral-900" /> Posisi Lapisan (Layer)
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Depan / Belakang</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onMoveLayer(selectedElement.id, 'front')}
                  className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Paling Depan (Top)"
                >
                  <ChevronsUp className="h-3.5 w-3.5" />
                  <span>Paling Depan</span>
                </button>
                <button
                  type="button"
                  onClick={() => onMoveLayer(selectedElement.id, 'up')}
                  className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Maju 1 Tingkat"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Maju 1 Tingkat</span>
                </button>
                <button
                  type="button"
                  onClick={() => onMoveLayer(selectedElement.id, 'down')}
                  className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Mundur 1 Tingkat"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  <span>Mundur 1 Tingkat</span>
                </button>
                <button
                  type="button"
                  onClick={() => onMoveLayer(selectedElement.id, 'back')}
                  className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white rounded-xl font-medium transition flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Paling Belakang (Bottom)"
                >
                  <ChevronsDown className="h-3.5 w-3.5" />
                  <span>Paling Belakang</span>
                </button>
              </div>
            </div>
          )}

          {/* Alignment shortcuts */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdateSelectedElement({ x: 50 })}
                className="flex-1 py-1.5 px-3 text-xs border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
              >
                Tengah Horizontal
              </button>
              <button
                type="button"
                onClick={() => onUpdateSelectedElement({ y: 50 })}
                className="flex-1 py-1.5 px-3 text-xs border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-medium"
              >
                Tengah Vertikal
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center">
          <Sliders className="h-8 w-8 mb-2 opacity-30 text-slate-500" />
          <span>Klik komponen di canvas untuk mengubah teks, posisi, atau ukuran</span>
        </div>
      )}
    </aside>
  );
}

export const StudioSidebarRight = React.memo(StudioSidebarRightComponent, (prev, next) => {
  // Lewati render sidebar kanan saat pointer sedang aktif drag/resize/rotate di canvas
  if (next.isInteracting) return true;
  // Saat pointer dilepas, izinkan render untuk sinkronisasi nilai akhir
  if (prev.isInteracting && !next.isInteracting) return false;
  // Jika elemen yang dipilih berubah, wajib render
  if (prev.selectedElement?.id !== next.selectedElement?.id) return false;
  if (prev.currentDimensions !== next.currentDimensions) return false;
  return prev.selectedElement === next.selectedElement && prev.selectedDistances === next.selectedDistances;
});
