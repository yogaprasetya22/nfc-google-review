import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ArrowDownCircle, RefreshCw, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { listGDriveFiles, deleteGDriveFile, type GDriveFile } from '@/lib/gdrive';

interface DrawerUploadsProps {
  onAddNewElement: (
    type: 'image',
    label: string,
    customContent?: string,
    options?: any
  ) => void;
  onUploadImageFile?: (file: File) => void;
  // Props kompatibilitas lama (opsional)
  bgImage?: string | null;
  onUploadBackground?: (e: React.ChangeEvent<HTMLInputElement> | File) => void;
  onRemoveBackground?: () => void;
}

export function DrawerUploads({
  onAddNewElement,
  onUploadImageFile
}: DrawerUploadsProps) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [gdriveFiles, setGdriveFiles] = useState<GDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGDriveFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    try {
      const files = await listGDriveFiles();
      setGdriveFiles(files);
    } catch (err: any) {
      console.warn('Gagal memuat file Google Drive:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    fetchGDriveFiles();
  }, [fetchGDriveFiles]);

  const handleImageFile = async (file: File) => {
    if (onUploadImageFile) {
      onUploadImageFile(file);
    } else {
      processImageFile(file);
    }
    // Refresh list setelah upload
    setTimeout(() => {
      fetchGDriveFiles();
    }, 2000);
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
    if (imgInputRef.current) imgInputRef.current.value = '';
  };

  // Tambah gambar dari galeri GDrive ke kanvas
  // Tambah gambar dari galeri GDrive ke kanvas
  const handleAddFromGallery = (file: GDriveFile) => {
    const imageUrl = file.directUrl || `/api/gdrive-image?id=${file.id}`;
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
      onAddNewElement('image', file.name.replace(/\.[^/.]+$/, '') || 'Gambar GDrive', undefined, {
        imageUrl: imageUrl,
        width: w,
        height: h
      });
      toast.success(`Gambar "${file.name}" ditambahkan ke kartu!`);
    };
    img.onerror = () => {
      // Fallback jika natural dimensions gagal terbaca
      onAddNewElement('image', file.name.replace(/\.[^/.]+$/, '') || 'Gambar GDrive', undefined, {
        imageUrl: imageUrl,
        width: 140,
        height: 140
      });
      toast.success(`Gambar "${file.name}" ditambahkan ke kartu!`);
    };
    img.src = imageUrl;
  };

  // Hapus gambar dari Google Drive
  const handleDeleteFromGDrive = async (e: React.MouseEvent, file: GDriveFile) => {
    e.stopPropagation();
    if (!confirm(`Hapus "${file.name}" secara permanen dari Google Drive?`)) return;

    setDeletingId(file.id);
    try {
      await deleteGDriveFile(file.id);
      setGdriveFiles((prev) => prev.filter((f) => f.id !== file.id));
      toast.success(`Gambar "${file.name}" berhasil dihapus dari Google Drive!`);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus gambar dari Google Drive.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-bold text-slate-900">Unggah Gambar & Logo</h3>
        <p className="text-[11px] text-slate-500">Tarik & lepas (drag and drop) atau klik untuk unggah ke Google Drive</p>
      </div>

      {/* Zona Upload Gambar */}
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
        onClick={() => imgInputRef.current?.click()}
        className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 cursor-pointer text-center flex flex-col items-center justify-center ${
          isDraggingLogo
            ? 'bg-emerald-50 border-dashed border-emerald-500 scale-[1.02] shadow-sm'
            : 'bg-emerald-50/40 border-dashed border-emerald-200/90 hover:border-emerald-400 hover:bg-emerald-50/70'
        }`}
      >
        <input
          type="file"
          ref={imgInputRef}
          onChange={handleCustomImageUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="p-2.5 bg-white text-emerald-600 rounded-xl shadow-xs border border-emerald-100">
          {isDraggingLogo ? (
            <ArrowDownCircle className="h-6 w-6 animate-bounce" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>

        <div>
          <span className="text-xs font-bold text-slate-800 block">
            {isDraggingLogo ? 'Lepaskan gambar di sini!' : 'Upload Gambar / Logo'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            PNG, JPG, SVG, WebP (Tersimpan di Google Drive)
          </span>
        </div>

        <Button
          type="button"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl shadow-xs font-semibold py-1.5 h-8"
          onClick={(e) => {
            e.stopPropagation();
            imgInputRef.current?.click();
          }}
        >
          <Upload className="h-3 w-3 mr-1.5" />
          Pilih File Gambar
        </Button>
      </div>

      {/* Galeri Google Drive */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-slate-600" />
            <h4 className="text-xs font-bold text-slate-800">Galeri Google Drive</h4>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full">
              {gdriveFiles.length}
            </span>
          </div>
          <button
            type="button"
            onClick={fetchGDriveFiles}
            disabled={isLoadingFiles}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            title="Muat ulang galeri"
          >
            <RefreshCw className={`h-3 w-3 ${isLoadingFiles ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoadingFiles && gdriveFiles.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            <span>Memuat gambar dari Google Drive...</span>
          </div>
        ) : gdriveFiles.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            Belum ada gambar di folder Google Drive.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {gdriveFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => handleAddFromGallery(file)}
                className="group relative aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden cursor-pointer hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col justify-end p-1.5"
              >
                <img
                  src={file.directUrl}
                  alt={file.name}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.dataset.triedFallback === 'true') {
                      target.style.opacity = '0.3';
                      return;
                    }
                    target.dataset.triedFallback = 'true';

                    if (target.src.includes('/api/gdrive-image')) {
                      target.src = `https://lh3.googleusercontent.com/d/${file.id}`;
                    } else if (!target.src.includes('drive.usercontent.google.com')) {
                      target.src = `/api/gdrive-image?id=${file.id}`;
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform"
                />
                
                {/* Overlay hover dengan nama file & tombol hapus */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={deletingId === file.id}
                      onClick={(e) => handleDeleteFromGDrive(e, file)}
                      className="p-1 rounded-md bg-red-600/90 text-white hover:bg-red-700 transition shadow-xs disabled:opacity-50"
                      title="Hapus dari Google Drive"
                    >
                      {deletingId === file.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-white font-medium truncate px-1 drop-shadow-xs">
                    {file.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
