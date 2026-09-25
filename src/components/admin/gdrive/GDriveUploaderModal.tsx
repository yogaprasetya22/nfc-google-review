import { useState, useRef } from 'react';
import { CloudUpload, ExternalLink, Check, Copy, AlertCircle, Loader2, HardDrive, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface GDriveUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (result: { fileId: string; fileName: string; link: string }) => void;
}

export function GDriveUploaderModal({
  isOpen,
  onClose,
  onUploadSuccess
}: GDriveUploaderModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    fileId: string;
    fileName: string;
    link: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Silakan pilih file terlebih dahulu.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setUploadResult(null);

    const toastId = toast.loading(`Mengunggah "${selectedFile.name}" ke Google Drive...`);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadResult({
          fileId: data.fileId,
          fileName: data.fileName || selectedFile.name,
          link: data.link
        });
        toast.success('Berhasil diunggah ke Google Drive!', { id: toastId });
        onUploadSuccess?.({
          fileId: data.fileId,
          fileName: data.fileName || selectedFile.name,
          link: data.link
        });
      } else {
        toast.error(`Gagal mengunggah: ${data.error || 'Terjadi kesalahan'}`, { id: toastId });
      }
    } catch (err: any) {
      console.error('GDrive Upload error:', err);
      toast.error(`Terjadi kesalahan jaringan atau server (${err.message}).`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (!uploadResult?.link) return;
    navigator.clipboard.writeText(uploadResult.link);
    setIsCopied(true);
    toast.success('Tautan Google Drive berhasil disalin!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Auto Upload ke Google Drive</h3>
              <p className="text-[11px] text-slate-500">Folder Bersama NFC Cloud Repository</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                : selectedFile
                ? 'border-blue-400 bg-blue-50/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl mb-3 text-slate-600">
              {selectedFile ? (
                <FileText className="w-8 h-8 text-blue-600 animate-in zoom-in-75" />
              ) : (
                <CloudUpload className="w-8 h-8 text-emerald-600" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Klik atau tarik file lain untuk mengganti
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">Tarik & lepas file ke sini, atau klik untuk memilih</p>
                <p className="text-[11px] text-slate-400">Mendukung gambar, dokumen, PDF hingga 25 MB</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4" />
                  <span>Upload ke Google Drive</span>
                </>
              )}
            </button>
          </div>

          {/* Success Result Link */}
          {uploadResult && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>File Berhasil Diunggah ke Google Drive!</span>
              </div>

              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-emerald-100">
                <input
                  type="text"
                  readOnly
                  value={uploadResult.link}
                  className="text-xs font-mono text-slate-600 flex-1 bg-transparent outline-none truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md transition flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <a
                  href={uploadResult.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition"
                  title="Buka di Google Drive"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span>
              File akan langsung tersimpan di folder Google Drive bersama tanpa perlu login Google manual.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
