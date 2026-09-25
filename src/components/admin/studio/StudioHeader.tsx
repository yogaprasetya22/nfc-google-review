import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, Download, X, Undo2, Redo2, ChevronDown, Layers, Save, Loader2, BookmarkPlus } from 'lucide-react';
import type { CardPreset, CardSide } from './types';
import type { NfcTagEntity } from '@/types/nfc';

interface StudioHeaderProps {
  tag: NfcTagEntity;
  cardPreset: CardPreset;
  setCardPreset: (preset: CardPreset) => void;
  wallMarginPx: number;
  onApplyPreciseWallMargins: (px: number) => void;
  onResetLayout: () => void;
  onExportPNG: (side?: CardSide) => void;
  onExportBothSides: () => void;
  onClose: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  activeSide: CardSide;
  setActiveSide: (side: CardSide) => void;
  onSaveToDatabase?: () => void;
  isSaving?: boolean;
  onPublishAsTemplate?: (title: string) => Promise<boolean>;
}

function StudioHeaderComponent({
  tag,
  cardPreset,
  setCardPreset,
  wallMarginPx,
  onApplyPreciseWallMargins,
  onResetLayout,
  onExportPNG,
  onExportBothSides,
  onClose,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  activeSide,
  setActiveSide,
  onSaveToDatabase,
  isSaving = false,
  onPublishAsTemplate
}: StudioHeaderProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateTitle.trim() || !onPublishAsTemplate) return;
    setIsPublishing(true);
    try {
      const ok = await onPublishAsTemplate(templateTitle);
      if (ok) {
        setShowPublishModal(false);
        setTemplateTitle('');
      }
    } finally {
      setIsPublishing(false);
    }
  };
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-neutral-900 text-white shadow-xs">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {/* <h2 className="text-sm font-bold text-slate-900 tracking-tight">Studio Desain & Cetak NFC</h2> */}
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
              {tag.id}
            </span>
          </div>
        </div>
      </div>

      {/* Switcher Sisi Kartu & Preset Dimension */}
      <div className="flex items-center gap-3">
        {/* Sisi Depan / Belakang Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSide('front')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Sisi Depan
          </button>
          <button
            onClick={() => setActiveSide('back')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSide === 'back'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Sisi Belakang
          </button>
        </div>

        {/* Preset Dimension Selection */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['square', 'card_v', 'card_h'] as const).map((presetKey) => (
            <button
              key={presetKey}
              onClick={() => setCardPreset(presetKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cardPreset === presetKey
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {presetKey === 'square' && 'Stiker Kotak (1:1)'}
              {presetKey === 'card_v' && 'Kartu Vertikal'}
              {presetKey === 'card_h' && 'Kartu Horizontal'}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls: Undo/Redo + Margin + Reset + Download Dropdown */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo Buttons */}
        <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition flex items-center justify-center ${
              canUndo
                ? 'text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-2xs cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded-lg transition flex items-center justify-center ${
              canRedo
                ? 'text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-2xs cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
          <span className="text-[11px] font-semibold text-slate-600">Jarak Dinding:</span>
          {[25, 45, 60].map((pxVal) => (
            <button
              key={pxVal}
              onClick={() => onApplyPreciseWallMargins(pxVal)}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition ${
                wallMarginPx === pxVal
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
              title={`Kunci jarak objek tepat ${pxVal}px dari dinding kiri & kanan`}
            >
              {pxVal}px
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onResetLayout}
          className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs h-9 rounded-xl"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1 text-slate-500" /> Reset
        </Button>

        {/* Simpan Desain ke Database */}
        {onSaveToDatabase && (
          <Button
            size="sm"
            onClick={onSaveToDatabase}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-3.5 rounded-xl shadow-xs transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Simpan Desain
              </>
            )}
          </Button>
        )}

        {/* Publish sebagai Template Baru ke Katalog */}
        {onPublishAsTemplate && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPublishModal(true)}
            className="border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/70 text-xs font-semibold h-9 px-3 rounded-xl shadow-2xs transition flex items-center gap-1.5"
            title="Publikasikan desain saat ini menjadi template resmi di katalog"
          >
            <BookmarkPlus className="h-3.5 w-3.5 text-blue-600" />
            <span>Publish Template</span>
          </Button>
        )}

        {/* Download PNG Dropdown */}
        <div className="relative">
          <div className="flex items-center">
            <Button
              size="sm"
              onClick={() => onExportPNG(activeSide)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold h-9 px-3 rounded-l-xl rounded-r-none shadow-xs border-r border-neutral-700"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download {activeSide === 'front' ? 'Sisi Depan' : 'Sisi Belakang'}
            </Button>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white h-9 px-2 rounded-r-xl shadow-xs transition"
              title="Pilihan Download"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs font-semibold animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onExportPNG('front');
                  setShowExportMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Download Sisi Depan (PNG)</span>
                <span className="text-[10px] text-slate-400 font-mono">2x Hi-Res</span>
              </button>
              <button
                onClick={() => {
                  onExportPNG('back');
                  setShowExportMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Download Sisi Belakang (PNG)</span>
                <span className="text-[10px] text-slate-400 font-mono">2x Hi-Res</span>
              </button>
              <div className="h-[1px] bg-slate-100 my-1" />
              <button
                onClick={() => {
                  onExportBothSides();
                  setShowExportMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-blue-600 hover:bg-blue-50 font-bold flex items-center justify-between"
              >
                <span>Download Keduanya (2 File PNG)</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Zip/Multi</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          title="Tutup Studio"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Modal Dialog: Publish As Template */}
      {showPublishModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setShowPublishModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <BookmarkPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Publikasikan Sebagai Template</h3>
                  <p className="text-[11px] text-slate-500">Desain saat ini akan muncul di katalog template</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="pt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama / Judul Template
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modern Cafe Minimalist Standee"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Preset: {cardPreset === 'card_v' ? 'Kartu Vertikal' : cardPreset === 'card_h' ? 'Kartu Horizontal' : 'Stiker Kotak (1:1)'} • Sisi {activeSide === 'front' ? 'Depan' : 'Belakang'}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPublishModal(false)}
                  className="text-xs h-9 rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPublishing || !templateTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-xl shadow-xs transition"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Memublikasikan...
                    </>
                  ) : (
                    'Publikasikan Template'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export const StudioHeader = React.memo(StudioHeaderComponent);
