import React, { useState } from 'react';
import type { CustomTemplate, CardPreset } from '../types';
import { Sparkles, Trash2, Layout, Smartphone, Square, CreditCard, Layers } from 'lucide-react';

interface DrawerTemplatesProps {
  activeTemplate: string;
  onApplyTemplate: (tmpl: any) => void;
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
  const [filterPreset, setFilterPreset] = useState<CardPreset | 'all'>('all');

  // Filter template berdasarkan orientasi kanvas
  const filteredTemplates = customTemplates.filter((t) =>
    filterPreset === 'all' ? true : t.preset === filterPreset
  );

  const officialTemplates = filteredTemplates.filter((t) => t.category === 'official' || t.is_starter);
  const userTemplates = filteredTemplates.filter((t) => t.category !== 'official' && !t.is_starter);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900">Katalog Desain Template (100% Dinamis)</h3>
        <p className="text-[11px] text-slate-500">
          Semua template murni berbasis data elemen kanvas tanpa ada layout yang di-hardcode di kode.
        </p>
      </div>

      {/* Filter Orientasi: Semua, Vertikal, 1:1 Kotak, Horizontal */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => setFilterPreset('all')}
          className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg transition ${
            filterPreset === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua
        </button>
        <button
          type="button"
          onClick={() => setFilterPreset('card_v')}
          className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            filterPreset === 'card_v' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Vertikal"
        >
          <Smartphone className="w-3 h-3" />
          <span>Vertikal</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterPreset('square')}
          className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            filterPreset === 'square' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="1:1 Kotak"
        >
          <Square className="w-3 h-3" />
          <span>1:1</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterPreset('card_h')}
          className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 ${
            filterPreset === 'card_h' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Horizontal"
        >
          <CreditCard className="w-3 h-3" />
          <span>Horiz</span>
        </button>
      </div>

      {/* Tombol Blank Canvas (Mulai Kanvas Kosong) */}
      <div
        onClick={() => {
          onApplyCustomTemplate?.({
            id: `blank_${Date.now()}`,
            title: 'Kanvas Kosong',
            preset: filterPreset === 'all' ? 'card_v' : filterPreset,
            elements: [
              {
                id: 'nfc',
                type: 'nfc_target',
                label: 'Touchpoint Chip NFC',
                x: 35,
                y: 50,
                width: 110,
                height: 90,
                visible: true
              },
              {
                id: 'qr',
                type: 'qrcode',
                label: 'QR Code Link Review',
                x: 65,
                y: 50,
                width: 120,
                height: 120,
                visible: true
              }
            ]
          });
        }}
        className="p-2.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition flex items-center gap-3 bg-white"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg">
          +
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs text-slate-900">Mulai Kanvas Kosong (Blank)</span>
          <span className="text-[10px] text-slate-500">Desain 100% murni dari kreativitas Anda</span>
        </div>
      </div>

      {/* 1. Bagian Kreasi Desain Pengguna (Tersimpan di DB) */}
      {userTemplates.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kreasi Saya ({userTemplates.length})</span>
          </div>

          <div className="space-y-2">
            {userTemplates.map((item) => (
              <div
                key={item.id}
                onClick={() => onApplyCustomTemplate?.(item)}
                className="p-2.5 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition flex flex-col gap-1.5 shadow-2xs group relative"
              >
                <div className="h-14 rounded-xl bg-white border border-blue-200 flex items-center justify-center relative overflow-hidden">
                  <Layout className="w-6 h-6 text-blue-500" />
                  <span className="text-[10px] font-mono text-slate-500 ml-2">
                    {item.preset === 'card_v' ? 'Vertikal' : item.preset === 'card_h' ? 'Horizontal' : '1:1 Kotak'} •{' '}
                    {item.elements.length} Elemen
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

      {/* 2. Bagian Template Katalog Dinamis */}
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
        <span>Template Katalog ({officialTemplates.length})</span>
        <span className="text-[9px] font-normal text-slate-400">Dinamis</span>
      </div>

      <div className="space-y-2.5">
        {officialTemplates.map((tmpl) => {
          const isSelected = activeTemplate === tmpl.id;
          const presetLabel =
            tmpl.preset === 'card_v'
              ? 'Vertikal'
              : tmpl.preset === 'card_h'
              ? 'Horizontal'
              : '1:1 Kotak';

          return (
            <div
              key={tmpl.id}
              onClick={() => onApplyCustomTemplate?.(tmpl)}
              className={`p-2.5 rounded-2xl border cursor-pointer transition flex flex-col gap-2 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
              }`}
            >
              {/* Visual Preview Box */}
              <div className="h-16 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden flex items-center justify-between px-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs text-blue-600 font-black text-sm">
                    {tmpl.id.includes('clean') ? '📱' : tmpl.id.includes('qr') ? 'QR' : 'G'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs text-slate-900 leading-tight">{tmpl.title}</span>
                    <span className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                      {tmpl.description || `${tmpl.elements.length} elemen kanvas`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer info: Preset badge & Element Count */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      tmpl.preset === 'card_v'
                        ? 'bg-purple-100 text-purple-700'
                        : tmpl.preset === 'card_h'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {presetLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5" />
                    {tmpl.elements.length} obj
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 hover:underline">Terapkan →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
