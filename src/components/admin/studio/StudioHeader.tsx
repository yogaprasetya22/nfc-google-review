import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  RotateCcw,
  Download,
  X,
  Undo2,
  Redo2,
  ChevronDown,
  Layers,
  Save,
  Loader2,
  BookmarkPlus,
  SlidersHorizontal,
  Square,
  Smartphone,
  CreditCard,
  MoreVertical,
  Eye
} from 'lucide-react';
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
  onOpenExportPreview?: () => void;
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

const PRESET_OPTIONS: { id: CardPreset; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'square', label: 'Stiker Kotak (1:1)', icon: Square },
  { id: 'card_v', label: 'Kartu Vertikal', icon: Smartphone },
  { id: 'card_h', label: 'Kartu Horizontal', icon: CreditCard }
];

function StudioHeaderComponent({
  tag,
  cardPreset,
  setCardPreset,
  wallMarginPx,
  onApplyPreciseWallMargins,
  onResetLayout,
  onExportPNG,
  onExportBothSides,
  onOpenExportPreview,
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const presetMenuRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
      if (presetMenuRef.current && !presetMenuRef.current.contains(event.target as Node)) {
        setShowPresetMenu(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const currentPresetObj = PRESET_OPTIONS.find((p) => p.id === cardPreset) || PRESET_OPTIONS[0];
  const PresetIcon = currentPresetObj.icon;

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 flex items-center justify-between px-3 md:px-5 shrink-0 shadow-xs z-30 select-none">
      {/* 1. SISI KIRI: Branding, ID Tag & Undo/Redo */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-neutral-900 text-white shadow-xs shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
            {tag.id}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />

        {/* Undo / Redo Compact Group */}
        <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/80">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md transition flex items-center justify-center ${
              canUndo
                ? 'text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-2xs cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md transition flex items-center justify-center ${
              canRedo
                ? 'text-slate-700 hover:text-slate-900 hover:bg-white hover:shadow-2xs cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. SISI TENGAH: Side Switcher (Front/Back) & Preset Selector Dropdown */}
      <div className="flex items-center gap-2">
        {/* Switcher Sisi Kartu */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90">
          <button
            onClick={() => setActiveSide('front')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSide === 'front'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sisi Depan</span>
            <span className="sm:hidden">Depan</span>
          </button>
          <button
            onClick={() => setActiveSide('back')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSide === 'back'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sisi Belakang</span>
            <span className="sm:hidden">Belakang</span>
          </button>
        </div>

        {/* Dropdown Preset Kartu Canva-Style */}
        <div className="relative" ref={presetMenuRef}>
          <button
            type="button"
            onClick={() => setShowPresetMenu(!showPresetMenu)}
            className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/80 px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 transition"
            title="Ubah Ukuran / Preset Kartu"
          >
            <PresetIcon className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden md:inline">{currentPresetObj.label}</span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>

          {showPresetMenu && (
            <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ukuran Kartu
              </div>
              {PRESET_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = cardPreset === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setCardPreset(opt.id);
                      setShowPresetMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-slate-100 font-bold text-slate-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-slate-500" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. SISI KANAN: Tools Menu Popover, Save, Export Dropdown, Close */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Menu Popover untuk Pengaturan Tambahan (Jarak Dinding, Reset, Publish) */}
        <div className="relative" ref={moreMenuRef}>
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center gap-1 p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition"
            title="Pengaturan Jarak & Opsi Lainnya"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden xl:inline text-[11px] font-semibold">Margin ({wallMarginPx}px)</span>
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95">
              {/* Pengaturan Jarak Dinding */}
              <div>
                <span className="text-[11px] font-bold text-slate-800 block mb-1.5">
                  Jarak Margin Dinding:
                </span>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                  {[25, 45, 60].map((pxVal) => (
                    <button
                      key={pxVal}
                      onClick={() => onApplyPreciseWallMargins(pxVal)}
                      className={`py-1 rounded-md text-[11px] font-mono font-bold transition text-center ${
                        wallMarginPx === pxVal
                          ? 'bg-neutral-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pxVal}px
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              {/* Opsi Tambahan: Reset & Publish Template */}
              <div className="space-y-1">
                {onPublishAsTemplate && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowPublishModal(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium transition"
                  >
                    <BookmarkPlus className="h-3.5 w-3.5 text-blue-600" />
                    <span>Jadikan Template Kustom</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onResetLayout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 font-medium transition"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Reset Tata Letak Kartu</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Simpan Desain ke Database */}
        {onSaveToDatabase && (
          <Button
            size="sm"
            onClick={onSaveToDatabase}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8 px-3 rounded-lg shadow-xs transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                <span className="hidden sm:inline">Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
                <span className="hidden sm:inline">Simpan Desain</span>
                <span className="sm:hidden">Simpan</span>
              </>
            )}
          </Button>
        )}

        {/* Download PNG Dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <div className="flex items-center">
            <Button
              size="sm"
              onClick={() => {
                if (onOpenExportPreview) {
                  onOpenExportPreview();
                } else {
                  onExportPNG(activeSide);
                }
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold h-8 px-2.5 sm:px-3 rounded-l-lg rounded-r-none shadow-xs border-r border-neutral-700"
            >
              <Download className="h-3.5 w-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden md:inline">Download {activeSide === 'front' ? 'Sisi Depan' : 'Sisi Belakang'}</span>
              <span className="md:hidden">Export</span>
            </Button>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white h-8 px-1.5 sm:px-2 rounded-r-lg shadow-xs transition"
              title="Pilihan Download"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {showExportMenu && (
            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs font-semibold animate-in fade-in zoom-in-95">
              {onOpenExportPreview && (
                <>
                  <button
                    onClick={() => {
                      onOpenExportPreview();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-blue-600 hover:bg-blue-50/80 flex items-center justify-between font-bold border-b border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span>Preview Hasil Cetak</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      Gambar
                    </span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  onExportPNG('front');
                  setShowExportMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Download Sisi Depan</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">4K UHD</span>
              </button>
              <button
                onClick={() => {
                  onExportPNG('back');
                  setShowExportMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Download Sisi Belakang</span>
                <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded">4K UHD</span>
              </button>
              <div className="h-[1px] bg-slate-100 my-1" />
              <button
                onClick={() => {
                  onExportBothSides();
                  setShowExportMenu(false);
                }}
                className="w-full px-3.5 py-2 text-left text-blue-600 hover:bg-blue-50 font-bold flex items-center justify-between"
              >
                <span>Download Kedua Sisi (Zip/Multi)</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">4K UHD</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Tombol Tutup Studio */}
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
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
                  className="text-xs h-8 rounded-lg"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPublishing || !templateTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8 px-4 rounded-lg shadow-xs transition"
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
