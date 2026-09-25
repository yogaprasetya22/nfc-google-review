import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Trash2, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DrawerUploadsProps {
  bgImage: string | null;
  onUploadBackground: (e: React.ChangeEvent<HTMLInputElement> | File) => void;
  onRemoveBackground: () => void;
  onAddNewElement: (
    type: 'image',
    label: string,
    customContent?: string,
    options?: any
  ) => void;
  onUploadImageFile?: (file: File) => void;
}

export function DrawerUploads({
  bgImage,
  onUploadBackground,
  onRemoveBackground,
  onAddNewElement,
  onUploadImageFile
}: DrawerUploadsProps) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);

  const handleImageFile = (file: File) => {
    if (onUploadImageFile) {
      onUploadImageFile(file);
    } else {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa format gambar (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const natW = img.naturalWidth || 140;
          const natH = img.naturalHeight || 140;
          const maxInitial = 220;
          let w = natW;
          let h = natH;
          if (w > maxInitial || h > maxInitial) {
            if (w >= h) {
              h = Math.round((h / w) * maxInitial);
              w = maxInitial;
            } else {
              w = Math.round((w / h) * maxInitial);
              h = maxInitial;
            }
          }
          onAddNewElement('image', file.name.replace(/\.[^/.]+$/, '') || 'Gambar Unggahan', undefined, {
            imageUrl: reader.result,
            width: w,
            height: h
          });
          toast.success(`Gambar "${file.name}" berhasil ditambahkan!`);
        };
        img.src = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageFile(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900">Unggah Gambar & Logo</h3>
        <p className="text-[11px] text-slate-500">Tarik & lepas (drag and drop) atau klik untuk unggah</p>
      </div>

      {/* 1. Tambah Gambar Logo ke Kanvas (Drag & Drop Zone) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingLogo(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingLogo(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingLogo(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleImageFile(file);
        }}
        className={`p-3 rounded-2xl border transition-all space-y-2 cursor-pointer ${
          isDraggingLogo
            ? 'bg-blue-50 border-2 border-dashed border-blue-500 scale-[1.02] shadow-sm'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Logo / Gambar Baru
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Drag & Drop</span>
        </div>

        <input
          type="file"
          ref={imgInputRef}
          onChange={handleCustomImageUpload}
          accept="image/*"
          className="hidden"
        />

        {isDraggingLogo ? (
          <div className="py-3 flex flex-col items-center justify-center text-blue-600 gap-1 animate-pulse">
            <ArrowDownCircle className="h-6 w-6 stroke-[2]" />
            <span className="text-xs font-semibold">Lepaskan file gambar di sini!</span>
          </div>
        ) : (
          <Button
            onClick={() => imgInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl shadow-xs"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Unggah File Logo / Gambar
          </Button>
        )}
      </div>

      {/* 2. Latar Belakang Kartu (Drag & Drop Zone) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingBg(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingBg(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDraggingBg(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onUploadBackground(file);
        }}
        className={`p-3 rounded-2xl border transition-all space-y-2 cursor-pointer ${
          isDraggingBg
            ? 'bg-purple-50 border-2 border-dashed border-[#8b3dff] scale-[1.02] shadow-sm'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Latar Belakang Kartu (Background)
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Drag & Drop</span>
        </div>

        <input
          type="file"
          ref={bgInputRef}
          onChange={onUploadBackground}
          accept="image/*"
          className="hidden"
        />

        {isDraggingBg ? (
          <div className="py-3 flex flex-col items-center justify-center text-[#8b3dff] gap-1 animate-pulse">
            <ArrowDownCircle className="h-6 w-6 stroke-[2]" />
            <span className="text-xs font-semibold">Lepaskan untuk pasang background!</span>
          </div>
        ) : (
          <Button
            onClick={() => bgInputRef.current?.click()}
            variant="outline"
            className="w-full text-xs rounded-xl border-dashed border-slate-300 bg-white hover:bg-slate-100"
          >
            <ImageIcon className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
            {bgImage ? 'Ganti Background' : 'Upload Latar Belakang'}
          </Button>
        )}

        {bgImage && !isDraggingBg && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              ✓ Background aktif
            </span>
            <button
              onClick={onRemoveBackground}
              className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
