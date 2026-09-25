import React from 'react';
import type { TemplateType, CustomTemplate } from '../types';
import { QrCode, Radio, Sparkles, Trash2, Layout } from 'lucide-react';

interface DrawerTemplatesProps {
  activeTemplate: TemplateType;
  onApplyTemplate: (tmpl: TemplateType) => void;
  customTemplates?: CustomTemplate[];
  onApplyCustomTemplate?: (template: CustomTemplate) => void;
  onDeleteCustomTemplate?: (templateId: string) => void;
}

export function DrawerTemplates({
  activeTemplate,
  onApplyTemplate,
  customTemplates = [],
  onApplyCustomTemplate,
  onDeleteCustomTemplate
}: DrawerTemplatesProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900">Katalog Template Desain</h3>
        <p className="text-[11px] text-slate-500">Pilih tata letak kartu resmi atau template kustom</p>
      </div>

      {/* Bagian Template Kustom Hasil Publish User */}
      {customTemplates && customTemplates.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Template Publikasi Saya ({customTemplates.length})</span>
          </div>

          <div className="space-y-2">
            {customTemplates.map((item) => (
              <div
                key={item.id}
                onClick={() => onApplyCustomTemplate?.(item)}
                className="p-2.5 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition flex flex-col gap-1.5 shadow-2xs group relative"
              >
                <div className="h-14 rounded-xl bg-white border border-blue-200 flex items-center justify-center relative overflow-hidden">
                  <Layout className="w-6 h-6 text-blue-500" />
                  <span className="text-[10px] font-mono text-slate-500 ml-2">
                    {item.preset === 'card_v' ? 'Vertikal' : item.preset === 'card_h' ? 'Horizontal' : 'Square'} • {item.elements.length} Elemen
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate pr-2">{item.title}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                      Kustom
                    </span>
                    {onDeleteCustomTemplate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus template "${item.title}" dari katalog?`)) {
                            onDeleteCustomTemplate(item.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Hapus template dari katalog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[1px] bg-slate-200 my-2" />
        </div>
      )}

      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        Template Standar Resmi Google
      </div>

      <div className="space-y-2.5">
        {/* 1. Wave Biru-Ungu */}
        <div
          onClick={() => onApplyTemplate('google_modern_wave')}
          className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
            activeTemplate === 'google_modern_wave'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
          }`}
        >
          <div className="h-16 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-indigo-500 relative overflow-hidden flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center">
              <span className="font-bold text-xs text-blue-600">G</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-4 bg-white rounded-t-xl" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Wave Biru-Ungu (TAPiTAG)</span>
            <span className="text-[10px] font-mono text-slate-400">1:1 Square</span>
          </div>
        </div>

        {/* 2. Lengkungan Hitam Elegan */}
        <div
          onClick={() => onApplyTemplate('google_black_curve')}
          className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
            activeTemplate === 'google_black_curve'
              ? 'border-neutral-900 bg-slate-100 ring-2 ring-neutral-900 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
          }`}
        >
          <div className="h-16 rounded-xl bg-neutral-950 relative overflow-hidden flex items-center px-3 gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-black text-xs text-blue-600">G</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-300 font-medium leading-none">review us on</span>
              <span className="text-xs text-white font-black leading-tight tracking-tight">Google</span>
              <span className="text-[9px] text-amber-400">★★★★★</span>
            </div>
            <div className="absolute inset-x-0 -bottom-2 h-5 bg-white rounded-t-[100%]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Lengkungan Hitam Elegan</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600">Terfavorit 🔥</span>
          </div>
        </div>

        {/* 3. Vertikal Bintang Emas */}
        <div
          onClick={() => onApplyTemplate('google_stars_vertical')}
          className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
            activeTemplate === 'google_stars_vertical'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
          }`}
        >
          <div className="h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1">
            <div className="px-3 py-0.5 rounded-full bg-blue-600 text-[9px] text-white font-bold">
              Review us on Google
            </div>
            <div className="flex text-amber-400 text-xs">★★★★★</div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Vertikal Bintang Emas & CTA</span>
            <span className="text-[10px] font-mono text-slate-400">Badge Vertikal</span>
          </div>
        </div>

        {/* 4. Frame 4 Warna Google */}
        <div
          onClick={() => onApplyTemplate('google_frame_quad')}
          className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
            activeTemplate === 'google_frame_quad'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
          }`}
        >
          <div className="h-16 rounded-xl bg-white border-4 border-dashed border-blue-500 p-1 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-800">LOGO BRAND + QR</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Frame 4 Warna Google</span>
            <span className="text-[10px] font-mono text-slate-400">1:1 Standee</span>
          </div>
        </div>

        {/* 5. Lingkaran 4 Warna Google */}
        <div
          onClick={() => onApplyTemplate('google_badge_circle')}
          className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
            activeTemplate === 'google_badge_circle'
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
          }`}
        >
          <div className="h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-red-500 border-r-amber-400 border-b-emerald-500 flex items-center justify-center">
              <Radio className="h-4 w-4 text-slate-700" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Lingkaran 4 Warna Google</span>
            <span className="text-[10px] font-mono text-slate-400">Vertikal</span>
          </div>
        </div>

        {/* 6. Sisi Belakang QR Focus */}
        <div
          onClick={() => onApplyTemplate('google_back_qr_focus')}
          className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
            activeTemplate === 'google_back_qr_focus'
              ? 'border-neutral-900 bg-slate-100 ring-2 ring-neutral-900 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
          }`}
        >
          <div className="h-16 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1">
            <div className="w-8 h-8 rounded bg-white border border-slate-300 flex items-center justify-center shadow-2xs">
              <QrCode className="h-5 w-5 text-slate-800" />
            </div>
            <span className="text-[9px] font-bold text-slate-600">Scan QR Code Sisi Belakang</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900">Sisi Belakang (QR Fokus)</span>
            <span className="text-[10px] font-mono font-bold text-blue-600">Belakang 🔄</span>
          </div>
        </div>
      </div>
    </div>
  );
}
