import React, { useEffect, useState } from 'react';
import type { NfcTagEntity } from '@/types/nfc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, QrCode, Radio, Star, Trash2 } from 'lucide-react';
import QRCode from 'qrcode';
import { DEFAULT_BLANK_ELEMENTS } from './studio/starterTemplates';
import { TemplateBackgroundRenderer } from './studio/elements/TemplateBackgroundRenderer';

interface TagCardPreviewProps {
  tag: NfcTagEntity;
  onDesignTag: (tag: NfcTagEntity) => void;
  onDeleteTag: (tagId: string) => Promise<boolean>;
}

export function TagCardPreview({ tag, onDesignTag, onDeleteTag }: TagCardPreviewProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const tagLink = `${window.location.origin}/t/${tag.id}`;

  useEffect(() => {
    QRCode.toDataURL(tagLink, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [tagLink]);

  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  const cardDesign = tag.hub_config?.card_design;
  const currentSideData = previewSide === 'front' ? cardDesign?.front : cardDesign?.back;
  const hasCustomElements = Boolean(currentSideData?.elements && currentSideData.elements.length > 0);
  const elementsToRender = hasCustomElements
    ? currentSideData!.elements
    : DEFAULT_BLANK_ELEMENTS;
  const activeTemplate = currentSideData?.template || 'custom';
  const bgImage = currentSideData?.bgImage || null;

  return (
    <Card className="overflow-hidden border border-slate-200/80 rounded-3xl bg-white shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* 1. Header Info Bar: ID Tag, Status, & Side Switcher */}
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

        {/* Depan / Belakang Toggle Switcher */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-200 text-[10px]">
          <button
            onClick={() => setPreviewSide('front')}
            className={`px-2 py-0.5 rounded-md font-bold transition ${
              previewSide === 'front'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Depan
          </button>
          <button
            onClick={() => setPreviewSide('back')}
            className={`px-2 py-0.5 rounded-md font-bold transition ${
              previewSide === 'back'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belakang
          </button>
        </div>
      </div>

      {/* 2. Visual Representation of NFC Card (Real-time Template + Elements) */}
      <div className="p-4 flex flex-col items-center justify-center bg-slate-100/60">
        <div className="w-full max-w-[270px] aspect-square rounded-2xl bg-white border border-slate-200/90 shadow-md relative overflow-hidden flex flex-col select-none">
          {/* Background Layer: Custom Image or Dynamic Template Background */}
          {bgImage ? (
            <img
              src={bgImage}
              alt="Card Background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            (() => {
              // Cek apakah ada elemen template_bg di dalam elements
              const bgElem = elementsToRender.find((el: any) => el.type === 'template_bg');
              if (bgElem) {
                return (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <TemplateBackgroundRenderer element={bgElem} />
                  </div>
                );
              }

              // Fallback jika tidak ada template_bg element
              if (activeTemplate === 'google_modern_wave') {
                return (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <TemplateBackgroundRenderer
                      element={{
                        id: 'bg',
                        type: 'template_bg',
                        label: 'Wave',
                        x: 50,
                        y: 50,
                        width: 520,
                        height: 520,
                        visible: true,
                        bgVariant: 'wave',
                        primaryColor: '#3b82f6',
                        secondaryColor: '#4f46e5'
                      }}
                    />
                  </div>
                );
              }

              if (activeTemplate === 'google_back_qr_focus') {
                return (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <TemplateBackgroundRenderer
                      element={{
                        id: 'bg',
                        type: 'template_bg',
                        label: 'QR Focus',
                        x: 50,
                        y: 50,
                        width: 520,
                        height: 520,
                        visible: true,
                        bgVariant: 'qr_focus'
                      }}
                    />
                  </div>
                );
              }

              return (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <TemplateBackgroundRenderer
                    element={{
                      id: 'bg',
                      type: 'template_bg',
                      label: 'Black Curve',
                      x: 50,
                      y: 50,
                      width: 520,
                      height: 520,
                      visible: true,
                      bgVariant: 'black_curve',
                      primaryColor: '#0a0a0a'
                    }}
                  />
                </div>
              );
            })()
          )}

          {/* Dynamic Elements Layer */}
          <div className="relative w-full h-full overflow-hidden">
            {elementsToRender.map((el: any) => {
              if (!el.visible || el.type === 'template_bg') return null;
              const posX = el.x;
              const posY = el.y;

              return (
                <div
                  key={el.id}
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                    width: `${(el.width / 520) * 100}%`,
                    height: `${(el.height / 520) * 100}%`
                  }}
                  className="absolute flex items-center justify-center pointer-events-none"
                >
                  {el.type === 'stars_5' && (
                    <span className="text-amber-400 text-[10px] tracking-widest leading-none">★★★★★</span>
                  )}

                  {el.type === 'logo_google' && (
                    <div className="w-full h-full rounded-full bg-white border border-slate-100 shadow-2xs flex items-center justify-center">
                      <span className="font-black text-blue-600 text-[10px]">G</span>
                    </div>
                  )}

                  {el.type === 'qrcode' && (
                    <div className="w-full h-full bg-white p-0.5 rounded-lg border border-slate-200 flex items-center justify-center shadow-2xs">
                      {qrUrl ? (
                        <img src={qrUrl} alt="QR" className="w-full h-full object-contain" />
                      ) : (
                        <QrCode className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  )}

                  {el.type === 'nfc_target' && (
                    <div className="w-full h-full rounded-lg bg-white border border-slate-900/60 shadow-2xs flex flex-col items-center justify-center p-0.5">
                      <div className="relative flex items-center justify-center mb-0.5">
                        <div className="w-6 h-5 rounded-full border border-slate-900 bg-white flex items-center justify-center pr-1 shadow-2xs">
                          <span className="font-bold text-[6px] text-slate-900">)))</span>
                        </div>
                        <div className="absolute -right-1 w-2.5 h-4.5 bg-white border border-slate-900 rounded-xs shadow-2xs flex flex-col items-center justify-between py-0.5">
                          <div className="w-1 h-0.5 bg-slate-900 rounded-full" />
                          <div className="w-0.5 h-0.5 rounded-full border border-slate-900" />
                        </div>
                      </div>
                      <span className="text-[5.5px] font-bold text-slate-800">TAP PHONE</span>
                    </div>
                  )}

                  {el.type === 'google_badge_pill' && (
                    <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center px-1 text-[7px] font-bold truncate">
                      {el.content || 'Review us on Google'}
                    </div>
                  )}

                  {el.type === 'text' && (
                    <div
                      style={{
                        fontFamily: el.fontFamily ? `"${el.fontFamily}", sans-serif` : undefined,
                        fontSize: `${Math.max(6.5, Math.round((el.fontSize || 14) * 0.52))}px`,
                        color: el.textColor || '#0f172a',
                        fontWeight: el.fontWeight === 'black' ? 900 : el.fontWeight === 'normal' ? 400 : 700,
                        fontStyle: el.fontStyle || 'normal',
                        textAlign: el.textAlign || 'center'
                      }}
                      className="truncate w-full leading-tight px-0.5"
                    >
                      {el.content}
                    </div>
                  )}

                  {el.type === 'shape' && (
                    <div className="w-full h-full flex items-center justify-center">
                      {el.shapeType === 'circle' && (
                        <div
                          style={{
                            backgroundColor: el.fillColor || '#0f172a',
                            borderColor: el.strokeColor || 'transparent',
                            borderWidth: `${Math.max(0, (el.borderWidth || 0) * 0.5)}px`
                          }}
                          className="w-full h-full rounded-full"
                        />
                      )}
                      {el.shapeType === 'rect' && (
                        <div
                          style={{
                            backgroundColor: el.fillColor || '#0f172a',
                            borderColor: el.strokeColor || 'transparent',
                            borderWidth: `${Math.max(0, (el.borderWidth || 0) * 0.5)}px`
                          }}
                          className="w-full h-full"
                        />
                      )}
                      {el.shapeType === 'rounded_rect' && (
                        <div
                          style={{
                            backgroundColor: el.fillColor || '#0f172a',
                            borderColor: el.strokeColor || 'transparent',
                            borderWidth: `${Math.max(0, (el.borderWidth || 0) * 0.5)}px`,
                            borderRadius: `${Math.max(2, (el.borderRadius || 16) * 0.5)}px`
                          }}
                          className="w-full h-full"
                        />
                      )}
                      {el.shapeType === 'line' && (
                        <div
                          style={{
                            backgroundColor: el.fillColor || '#cbd5e1',
                            height: '1.5px'
                          }}
                          className="w-full rounded-full"
                        />
                      )}
                      {el.shapeType === 'google_ring' && (
                        <div className="w-full h-full rounded-full border-2 border-blue-500 border-t-red-500 border-r-amber-400 border-b-emerald-500 flex items-center justify-center">
                          {el.content && (
                            <span className="text-[6px] font-bold text-slate-800">{el.content}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {el.type === 'image' && (
                    <div
                      style={{
                        opacity: el.opacity !== undefined ? el.opacity / 100 : 1,
                        borderRadius: el.borderRadius ? `${el.borderRadius * 0.5}px` : undefined,
                        overflow: el.borderRadius ? 'hidden' : undefined
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {el.imageUrl ? (
                        <img
                          src={el.imageUrl}
                          alt={el.label}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Card Footer Actions: Design in Studio & Manage */}
      <div className="p-3 bg-white mt-auto flex items-center justify-between border-t border-slate-100 gap-2">
        <Button
          size="sm"
          onClick={() => onDesignTag(tag)}
          className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold h-8 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
          Edit Desain & Cetak
        </Button>

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
