import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import type { CardPreset } from './types';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tagId: string;
  cardPreset: CardPreset;
  frontImgUrl: string;
  backImgUrl?: string;
  activeSide: 'front' | 'back';
  dimensions: { width: number; height: number; name: string };
  onConfirmDownload: (side?: 'front' | 'back' | 'both') => void;
}

export function ExportPreviewModal({
  isOpen,
  onClose,
  tagId,
  cardPreset,
  frontImgUrl,
  backImgUrl,
  activeSide,
  dimensions,
  onConfirmDownload
}: ExportPreviewModalProps) {
  const [selectedSide, setSelectedSide] = React.useState<'front' | 'back'>(activeSide);

  React.useEffect(() => {
    setSelectedSide(activeSide);
  }, [activeSide, isOpen]);

  if (!isOpen) return null;

  const currentImg = selectedSide === 'front' ? frontImgUrl : backImgUrl || frontImgUrl;

  const handleDownloadSide = (side: 'front' | 'back') => {
    onConfirmDownload(side);
  };

  const handleDownloadBoth = () => {
    onConfirmDownload('both');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Right Slide Drawer Container (max-w-4xl) */}
      <div
        className="bg-white w-full max-w-4xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 text-white rounded-2xl shadow-xs">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Preview &amp; Siap Cetak (4K UHD)</h2>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-200/80 text-slate-800">
                  {tagId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {dimensions.name} • {dimensions.width}x{dimensions.height} px • Resolusi Ultra HD Siap Cetak Fisik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/70 transition"
            title="Tutup Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Subheader: Sisi Depan / Belakang Switcher */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedSide('front')}
              className={`px-5 py-1.5 rounded-lg transition-all ${
                selectedSide === 'front'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              • Sisi Depan
            </button>
            <button
              onClick={() => setSelectedSide('back')}
              className={`px-5 py-1.5 rounded-lg transition-all ${
                selectedSide === 'back'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              • Sisi Belakang
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Format PNG Transparan / High-DPI</span>
          </div>
        </div>

        {/* Drawer Body: Stage Canvas Preview Gambar */}
        <div className="flex-1 overflow-auto p-6 md:p-8 flex flex-col items-center justify-center bg-slate-100/70 select-none">
          {currentImg ? (
            <div
              style={{
                aspectRatio: `${dimensions.width} / ${dimensions.height}`,
                maxHeight: '480px',
                width: dimensions.width >= dimensions.height ? '100%' : 'auto',
                maxWidth: dimensions.width >= dimensions.height ? '480px' : '360px'
              }}
              className="rounded-3xl overflow-hidden shadow-2xl border border-slate-300/80 bg-white relative flex items-center justify-center transition-all"
            >
              <img
                src={currentImg}
                alt={`Preview Hasil Cetak ${selectedSide}`}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Sedang merender gambar hasil cetak...
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs font-semibold h-10 px-5 text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            Lanjut Edit Kanvas
          </Button>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              onClick={() => handleDownloadSide(selectedSide)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold h-10 px-5 shadow-xs"
            >
              <Download className="w-4 h-4 mr-2 text-amber-400" />
              Download {selectedSide === 'front' ? 'Sisi Depan' : 'Sisi Belakang'} (PNG)
            </Button>

            <Button
              size="sm"
              onClick={handleDownloadBoth}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold h-10 px-5 shadow-xs"
            >
              <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
              Download Kedua Sisi (4K)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
