import React from 'react';
import type { CanvasElement } from '../types';
import { Type, Sparkles } from 'lucide-react';

interface DrawerTextProps {
  onAddNewElement: (
    type: CanvasElement['type'],
    label: string,
    customContent?: string,
    options?: Partial<CanvasElement>
  ) => void;
}

export function DrawerText({ onAddNewElement }: DrawerTextProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-900">Tambahkan Teks</h3>
        <p className="text-[11px] text-slate-500">Klik teks untuk menambahkan ke kanvas</p>
      </div>

      {/* Tombol Utama Tambah Kotak Teks */}
      <button
        onClick={() =>
          onAddNewElement('text', 'Kotak Teks', 'Ketik teks Anda di sini', {
            fontSize: 16,
            fontWeight: 'bold',
            width: 250,
            height: 32
          })
        }
        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
      >
        <Type className="h-4 w-4" />
        Tambahkan kotak teks
      </button>

      {/* Hierarki Teks Standar Canva */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Gaya Teks Default
        </span>

        {/* 1. Tambahkan Judul */}
        <button
          onClick={() =>
            onAddNewElement('text', 'Judul Utama', 'Tambahkan judul', {
              fontSize: 24,
              fontWeight: 'black',
              textColor: '#0f172a',
              width: 320,
              height: 40
            })
          }
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 text-left flex items-center justify-between shadow-2xs hover:bg-slate-50 transition group"
        >
          <span className="text-base font-black text-slate-900 group-hover:text-blue-600 leading-tight">
            Tambahkan judul
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            H1
          </span>
        </button>

        {/* 2. Tambahkan Subjudul */}
        <button
          onClick={() =>
            onAddNewElement('text', 'Subjudul', 'Tambahkan subjudul', {
              fontSize: 16,
              fontWeight: 'bold',
              textColor: '#1e293b',
              width: 260,
              height: 32
            })
          }
          className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 text-left flex items-center justify-between shadow-2xs hover:bg-slate-50 transition group"
        >
          <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 leading-tight">
            Tambahkan subjudul
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            H2
          </span>
        </button>

        {/* 3. Tambahkan Teks Isi */}
        <button
          onClick={() =>
            onAddNewElement('text', 'Teks Isi', 'Tambahkan sedikit teks isi', {
              fontSize: 12,
              fontWeight: 'normal',
              textColor: '#64748b',
              width: 280,
              height: 24
            })
          }
          className="w-full p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 text-left flex items-center justify-between shadow-2xs hover:bg-slate-50 transition group"
        >
          <span className="text-xs text-slate-600 group-hover:text-blue-600 leading-tight">
            Tambahkan sedikit teks isi
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            Body
          </span>
        </button>
      </div>

      {/* Preset Typography Kreatif */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Kombinasi Teks Rekomendasi
        </span>

        <button
          onClick={() =>
            onAddNewElement('text', 'Teks Review Us', 'REVIEW US ON GOOGLE', {
              fontSize: 15,
              fontWeight: 'black',
              textColor: '#1e3a8a',
              width: 280,
              height: 28
            })
          }
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-400 text-left shadow-2xs transition"
        >
          <span className="font-black text-xs text-blue-900 tracking-wider">REVIEW US ON GOOGLE</span>
        </button>

        <button
          onClick={() =>
            onAddNewElement('text', 'Teks Terima Kasih', 'Terima Kasih Atas Kunjungan Anda!', {
              fontSize: 13,
              fontWeight: 'bold',
              textColor: '#0f172a',
              fontStyle: 'italic',
              width: 300,
              height: 26
            })
          }
          className="w-full p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 text-left shadow-2xs transition"
        >
          <span className="font-bold italic text-xs text-amber-950">"Terima Kasih Atas Kunjungan Anda!"</span>
        </button>
      </div>
    </div>
  );
}
