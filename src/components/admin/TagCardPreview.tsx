import React, { useEffect, useState } from 'react';
import type { NfcTagEntity } from '@/types/nfc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, QrCode, Radio, Star, Trash2 } from 'lucide-react';
import QRCode from 'qrcode';
import {
  getTemplateBlackCurveElements,
  getTemplateBackSideElements
} from './studio/templatePresets';

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
    : previewSide === 'front'
    ? getTemplateBlackCurveElements(tag.business_name)
    : getTemplateBackSideElements(tag.business_name);
  const activeTemplate = currentSideData?.template || (previewSide === 'front' ? 'google_black_curve' : 'google_back_qr_focus');
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
          {/* Background Layer: Custom Image or Template Backdrop */}
          {bgImage ? (
            <img
              src={bgImage}
              alt="Card Background"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <>
              {activeTemplate === 'google_black_curve' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[44%] bg-neutral-950" />
                  <svg
                    viewBox="0 0 270 40"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 top-[35%] w-full h-[18%] fill-white"
                  >
                    <path d="M0,8 C70,30 200,30 270,8 L270,40 L0,40 Z" />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 top-[48%] bg-white" />
                  <div className="absolute left-1/2 top-[54%] -translate-x-1/2 h-5 w-[1px] bg-slate-300" />
                  <div className="absolute left-1/2 top-[74%] -translate-x-1/2 h-5 w-[1px] bg-slate-300" />
                </div>
              )}

              {activeTemplate === 'google_modern_wave' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[48%] bg-gradient-to-r from-blue-500 via-indigo-600 to-indigo-500" />
                  <svg
                    viewBox="0 0 270 40"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 top-[38%] w-full h-[22%] fill-white"
                  >
                    <path d="M0,15 C80,5 180,25 270,12 L270,40 L0,40 Z" />
                  </svg>
                  <div className="absolute inset-x-0 bottom-0 top-[52%] bg-white" />
                </div>
              )}

              {activeTemplate === 'google_back_qr_focus' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-red-500 to-amber-400" />
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />
                </div>
              )}
            </>
          )}

          {/* Dynamic Elements Layer */}
          <div className="relative w-full h-full overflow-hidden">
            {elementsToRender.map((el: any) => {
              if (!el.visible) return null;
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
