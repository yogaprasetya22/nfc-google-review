import React, { useState } from 'react';
import type { NfcTagEntity } from '@/types/nfc';
import {
  X,
  Save,
  Loader2,
  Tag,
  Building2,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EditTagModalProps {
  tag: NfcTagEntity;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: {
    oldId: string;
    newId: string;
    businessName: string;
    newPin?: string;
  }) => Promise<boolean>;
}

export function EditTagModal({ tag, isOpen, onClose, onSave }: EditTagModalProps) {
  const [tagId, setTagId] = useState(tag.id);
  const [businessName, setBusinessName] = useState(tag.business_name || '');
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formattedId = tagId.trim().toUpperCase();
    if (!formattedId) {
      toast.error('ID Tag tidak boleh kosong');
      return;
    }

    if (pin.trim() && pin.trim().length < 4) {
      toast.error('PIN baru minimal 4 digit numerik');
      return;
    }

    setSaving(true);
    const success = await onSave({
      oldId: tag.id,
      newId: formattedId,
      businessName: businessName.trim(),
      newPin: pin.trim() ? pin.trim() : undefined
    });
    setSaving(false);

    if (success) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Edit Detail Tag NFC</h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID Sekarang: {tag.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. ID Tag */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> ID Tag Fisik
            </label>
            <Input
              type="text"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              placeholder="Contoh: TAG-001"
              className="font-mono uppercase font-bold text-sm h-10 rounded-xl"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Mengubah ID Tag fisik juga akan memperbarui link QR dan NFC URL (<span className="font-mono text-slate-600">/t/{tagId.trim().toUpperCase() || '...'}</span>).
            </p>
          </div>

          {/* 2. Nama Bisnis */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Nama Bisnis / Merchant
            </label>
            <Input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Contoh: Kopi Kenangan - Sudirman Hub"
              className="text-xs h-10 rounded-xl"
            />
          </div>

          {/* 3. PIN Baru (Opsional Reset) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" /> PIN Akses CMS Meja
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Kosongkan jika tidak ingin mengubah</span>
            </div>
            <Input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Masukkan 4-6 Digit Baru (Opsional)"
              className="font-mono text-xs h-10 rounded-xl tracking-widest"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 rounded-xl border-slate-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-neutral-900 hover:bg-black text-white text-xs font-bold h-9 px-4 rounded-xl shadow-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
