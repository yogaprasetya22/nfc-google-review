import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Crop, Check, X, RotateCcw } from 'lucide-react';

interface ImageCropModalProps {
  imageUrl: string;
  imageLabel: string;
  onConfirmCrop: (croppedBlob: Blob) => void;
  onClose: () => void;
}

export function ImageCropModal({
  imageUrl,
  imageLabel,
  onConfirmCrop,
  onClose
}: ImageCropModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Crop box in percentage [0..100]
  const [cropBox, setCropBox] = useState({
    x: 10,
    y: 10,
    w: 80,
    h: 80
  });

  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; startCrop: typeof cropBox }>({
    startX: 0,
    startY: 0,
    startCrop: { ...cropBox }
  });

  const handlePointerDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDrag(handle);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...cropBox }
    };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // safe
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDrag || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaXPct = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
    const deltaYPct = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;
    const { startCrop } = dragStartRef.current;

    let newX = startCrop.x;
    let newY = startCrop.y;
    let newW = startCrop.w;
    let newH = startCrop.h;

    const minSize = 10; // minimal 10%

    if (activeDrag === 'move') {
      newX = Math.max(0, Math.min(100 - startCrop.w, startCrop.x + deltaXPct));
      newY = Math.max(0, Math.min(100 - startCrop.h, startCrop.y + deltaYPct));
    } else if (activeDrag === 'tl') {
      const maxX = startCrop.x + startCrop.w - minSize;
      const maxY = startCrop.y + startCrop.h - minSize;
      newX = Math.min(maxX, Math.max(0, startCrop.x + deltaXPct));
      newY = Math.min(maxY, Math.max(0, startCrop.y + deltaYPct));
      newW = startCrop.x + startCrop.w - newX;
      newH = startCrop.y + startCrop.h - newY;
    } else if (activeDrag === 'tr') {
      const maxY = startCrop.y + startCrop.h - minSize;
      newY = Math.min(maxY, Math.max(0, startCrop.y + deltaYPct));
      newW = Math.max(minSize, Math.min(100 - startCrop.x, startCrop.w + deltaXPct));
      newH = startCrop.y + startCrop.h - newY;
    } else if (activeDrag === 'bl') {
      const maxX = startCrop.x + startCrop.w - minSize;
      newX = Math.min(maxX, Math.max(0, startCrop.x + deltaXPct));
      newW = startCrop.x + startCrop.w - newX;
      newH = Math.max(minSize, Math.min(100 - startCrop.y, startCrop.h + deltaYPct));
    } else if (activeDrag === 'br') {
      newW = Math.max(minSize, Math.min(100 - startCrop.x, startCrop.w + deltaXPct));
      newH = Math.max(minSize, Math.min(100 - startCrop.y, startCrop.h + deltaYPct));
    }

    setCropBox({
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
      w: Math.round(newW * 10) / 10,
      h: Math.round(newH * 10) / 10
    });
  };

  const handlePointerUp = () => {
    setActiveDrag(null);
  };

  const handleExecuteCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;

    const sourceX = (cropBox.x / 100) * naturalW;
    const sourceY = (cropBox.y / 100) * naturalH;
    const sourceW = (cropBox.w / 100) * naturalW;
    const sourceH = (cropBox.h / 100) * naturalH;

    canvas.width = Math.max(1, Math.round(sourceW));
    canvas.height = Math.max(1, Math.round(sourceH));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onConfirmCrop(blob);
        onClose();
      }
    }, 'image/png');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-5 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Potong / Crop Gambar</h3>
              <p className="text-[11px] text-slate-500">Tarik sudut atau kotak pemotong untuk memilih area yang diinginkan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="flex-1 overflow-hidden py-4 flex items-center justify-center bg-slate-900/90 rounded-xl relative select-none my-3">
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative inline-block max-w-full max-h-[50vh] overflow-hidden"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt={imageLabel}
              crossOrigin="anonymous"
              className="max-w-full max-h-[50vh] object-contain pointer-events-none block"
            />

            {/* Dark Mask Around Crop Box */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(transparent, transparent)`
              }}
            >
              {/* Top mask */}
              <div
                className="absolute left-0 right-0 top-0 bg-black/60"
                style={{ height: `${cropBox.y}%` }}
              />
              {/* Bottom mask */}
              <div
                className="absolute left-0 right-0 bottom-0 bg-black/60"
                style={{ height: `${100 - (cropBox.y + cropBox.h)}%` }}
              />
              {/* Left mask */}
              <div
                className="absolute left-0 bg-black/60"
                style={{
                  top: `${cropBox.y}%`,
                  height: `${cropBox.h}%`,
                  width: `${cropBox.x}%`
                }}
              />
              {/* Right mask */}
              <div
                className="absolute right-0 bg-black/60"
                style={{
                  top: `${cropBox.y}%`,
                  height: `${cropBox.h}%`,
                  width: `${100 - (cropBox.x + cropBox.w)}%`
                }}
              />
            </div>

            {/* Interactive Crop Box */}
            <div
              onPointerDown={(e) => handlePointerDown(e, 'move')}
              style={{
                left: `${cropBox.x}%`,
                top: `${cropBox.y}%`,
                width: `${cropBox.w}%`,
                height: `${cropBox.h}%`
              }}
              className="absolute border-2 border-white shadow-2xl cursor-move touch-none z-30"
            >
              {/* Rule of thirds grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-r border-b border-white/30" />
                <div className="border-b border-white/30" />
                <div className="border-r border-white/30" />
                <div className="border-r border-white/30" />
                <div />
              </div>

              {/* 4 Corner Resize Handles */}
              <div
                onPointerDown={(e) => handlePointerDown(e, 'tl')}
                className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full cursor-nwse-resize shadow-md"
              />
              <div
                onPointerDown={(e) => handlePointerDown(e, 'tr')}
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full cursor-nesw-resize shadow-md"
              />
              <div
                onPointerDown={(e) => handlePointerDown(e, 'bl')}
                className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full cursor-nesw-resize shadow-md"
              />
              <div
                onPointerDown={(e) => handlePointerDown(e, 'br')}
                className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#8b3dff] rounded-full cursor-nwse-resize shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCropBox({ x: 0, y: 0, w: 100, h: 100 })}
            className="text-xs h-8 rounded-lg text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Crop
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-8 rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleExecuteCrop}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold h-8 px-4 rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Terapkan Potongan (Crop)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
