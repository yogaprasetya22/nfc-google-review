import React, { useEffect, useState, useRef } from 'react';
import type { NfcTagEntity } from '@/types/nfc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, Trash2, Edit } from 'lucide-react';
import QRCode from 'qrcode';
import { renderSideToCanvas } from './studio/exportCanvas';
import { DEFAULT_BLANK_ELEMENTS, loadExternalStarterTemplates } from './studio/starterTemplates';
import { DIMENSIONS_MAP, type CardPreset, type DimensionInfo, type CustomTemplate } from './studio/types';

interface TagCardPreviewProps {
  tag: NfcTagEntity;
  onDesignTag: (tag: NfcTagEntity) => void;
  onDeleteTag: (tagId: string) => Promise<boolean>;
  onEditTag?: (tag: NfcTagEntity) => void;
}

export function TagCardPreview({ tag, onDesignTag, onDeleteTag, onEditTag }: TagCardPreviewProps) {
  const tagLink = `${window.location.origin}/t/${tag.id}`;
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [imgUrl, setImgUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Resolusi dimensi yang sama persis dengan useCardStudioStore
  const cardDesign = tag.hub_config?.card_design;
  const preset: CardPreset = ((cardDesign as any)?.preset as CardPreset) || 'card_v';
  const dimensions: DimensionInfo = (cardDesign as any)?.dimensions || DIMENSIONS_MAP[preset] || DIMENSIONS_MAP.card_v;

  // Ref agar tidak render dua kali jika effect dipanggil ulang
  const renderIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const rid = ++renderIdRef.current;
    setLoading(true);
    setImgUrl('');

    async function generate() {
      const sideData = previewSide === 'front' ? cardDesign?.front : cardDesign?.back;
      let elements = sideData?.elements;
      const defaultTemplate =
        previewSide === 'front'
          ? preset === 'square'
            ? 'google_black_curve'
            : 'google_multicolor_pop_v'
          : 'google_back_qr_focus';

      const template = sideData?.template || defaultTemplate;
      const bgImage = sideData?.bgImage || null;

      // Jika belum ada elemen custom tersimpan di tag, coba cek localStorage lokal
      if (!elements || !Array.isArray(elements) || elements.length === 0) {
        try {
          const localKey = `studio_elements_${previewSide}_${tag?.id}`;
          const local = localStorage.getItem(localKey);
          if (local) elements = JSON.parse(local);
        } catch {
          // safe
        }
      }

      // Jika masih kosong, ambil template resmi starter sesuai template / preset yang aktif
      if (!elements || !Array.isArray(elements) || elements.length === 0) {
        try {
          const starters: CustomTemplate[] = await loadExternalStarterTemplates();
          const found = starters.find(
            (t: CustomTemplate) =>
              t.id === template ||
              (preset === 'square' && t.id === 'google_black_curve') ||
              (preset === 'card_v' && t.id === 'google_multicolor_pop_v')
          );
          if (found && found.elements?.length) {
            elements = found.elements;
          }
        } catch {
          // fallback
        }
      }
      if (!elements || elements.length === 0) {
        elements = DEFAULT_BLANK_ELEMENTS;
      }

      // QR Code hanya dibutuhkan jika ada elemen qrcode
      let qrDataUrl = '';
      if (elements.some((el: any) => el.type === 'qrcode')) {
        try {
          qrDataUrl = await QRCode.toDataURL(tagLink, { width: 400, margin: 1 });
        } catch { /* ignore */ }
      }

      try {
        const dataUrl = await renderSideToCanvas(dimensions, elements, template, bgImage, qrDataUrl);
        if (!cancelled && rid === renderIdRef.current) {
          setImgUrl(dataUrl);
        }
      } catch (err) {
        console.error('TagCardPreview render error:', err);
      } finally {
        if (!cancelled && rid === renderIdRef.current) {
          setLoading(false);
        }
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [cardDesign, previewSide, tagLink, preset, dimensions.width, dimensions.height]);

  return (
    <Card className="overflow-hidden border border-slate-200/80 rounded-3xl bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* 1. Header Info Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-200 shadow-2xs">
            {tag.id}
          </span>
          <Badge
            variant={tag.type === 'DIRECT_REVIEW' ? 'default' : 'secondary'}
            className="text-[9px] py-0 px-1.5 font-bold"
          >
            {tag.type}
          </Badge>
        </div>

        {/* Depan / Belakang Toggle */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-200 text-[10px]">
          {(['front', 'back'] as const).map((side) => (
            <button
              key={side}
              onClick={() => setPreviewSide(side)}
              className={`px-2 py-0.5 rounded-md font-bold transition ${
                previewSide === side
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {side === 'front' ? 'Depan' : 'Belakang'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Kartu — Image dari Canvas (Aspek Rasio Dinamis sesuai Dimensi Kartu Asli) */}
      <div className="p-4 flex items-center justify-center bg-slate-100/60 min-h-[300px]">
        <div
          style={{
            aspectRatio: `${dimensions.width} / ${dimensions.height}`,
            width: dimensions.width >= dimensions.height ? '100%' : 'auto',
            height: dimensions.height > dimensions.width ? '270px' : 'auto',
            maxWidth: dimensions.width >= dimensions.height ? '260px' : '180px'
          }}
          className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white relative flex items-center justify-center"
        >
          {loading ? (
            // Skeleton shimmer saat generate
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 animate-pulse rounded-2xl" />
          ) : imgUrl ? (
            <img
              src={imgUrl}
              alt={`Preview kartu ${tag.id} - ${previewSide}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            // Fallback jika render gagal
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
              Gagal memuat preview
            </div>
          )}
        </div>
      </div>

      {/* 3. Card Footer Actions */}
      <div className="p-3 bg-white mt-auto flex items-center justify-between border-t border-slate-100 gap-1.5">
        <Button
          size="sm"
          onClick={() => onDesignTag(tag)}
          className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold h-8 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
          Edit Desain &amp; Cetak
        </Button>

        {onEditTag && (
          <button
            onClick={() => onEditTag(tag)}
            className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition"
            title="Edit Detail Tag (ID, Tipe, Bisnis, PIN, Tap)"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
        )}

        <a
          href={`/t/${tag.id}`}
          target="_blank"
          rel="noreferrer"
          className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
          title="Buka Link Tag di Tab Baru"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <button
          onClick={() => onDeleteTag(tag.id)}
          className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition"
          title="Hapus Tag"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
