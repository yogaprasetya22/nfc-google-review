import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { NfcTagEntity, FeedbackItem } from '@/types/nfc';
import { LinkIconBadge } from './LinkIconBadge';
import { ExternalLink, Camera, Settings2, Gift, Play, Music, Sparkles, Wifi as WifiIcon, Copy, X, Check, QrCode, MessageSquare, Send, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface TableHubPortalProps {
  tag: NfcTagEntity;
  reviewUrl: string;
}

export function TableHubPortal({ tag, reviewUrl }: TableHubPortalProps) {
  const cfg = tag.hub_config || {};
  const tagline = cfg.tagline || 'Great choice, awkward chat';
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // State untuk Anonymous Feedback Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbacksList, setFeedbacksList] = useState<FeedbackItem[]>(cfg.feedbacks || []);

  const linksToRender = (cfg.custom_links && cfg.custom_links.length > 0
    ? cfg.custom_links
    : [
        { id: '1', title: 'Start earning rewards', url: '#rewards', icon: 'rewards' as const },
        { id: '2', title: 'Leave a Google Review', url: reviewUrl, icon: 'google' as const, highlight: true },
        { id: '3', title: 'View Menu', url: cfg.menu_url || '#menu', icon: 'menu' as const },
        { id: '4', title: 'Connect to Wi-Fi', url: '#wifi', icon: 'wifi' as const },
        { id: '5', title: 'Leave Anonymous Feedback', url: '#feedback', icon: 'feedback' as const },
        { id: '6', title: 'Play Sudoku', url: 'https://sudoku.com', icon: 'game' as const }
      ]).filter((link) => link.enabled !== false);


  const handleLinkClick = (link: typeof linksToRender[0], e: React.MouseEvent) => {
    if (link.url === '#wifi' || link.icon === 'wifi') {
      e.preventDefault();
      if (cfg.wifi_pass) {
        navigator.clipboard?.writeText(cfg.wifi_pass);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        toast.success(`Password Wi-Fi disalin otomatis!`, {
          description: `SSID: ${cfg.wifi_ssid || 'Toko'}`
        });
      }
      setWifiModalOpen(true);
      return;
    }

    if (link.url === '#feedback' || link.icon === 'feedback' || link.title.toLowerCase().includes('feedback')) {
      e.preventDefault();
      setFeedbackModalOpen(true);
      return;
    }
  };

  const copyWifiPassword = () => {
    if (cfg.wifi_pass) {
      navigator.clipboard?.writeText(cfg.wifi_pass);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast.success(`Password disalin: ${cfg.wifi_pass}`);
    } else {
      toast.info('Jaringan ini tidak memerlukan sandi.');
    }
  };

  // Kirim feedback anonim ke Supabase khusus tag ini
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Tuliskan komentar atau masukan Anda terlebih dahulu.');
      return;
    }

    setSubmittingFeedback(true);
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      comment: commentText.trim(),
      rating,
      created_at: new Date().toISOString()
    };

    const updatedFeedbacks = [newFeedback, ...feedbacksList];

    try {
      // Ambil config terbaru agar atomic
      const { data: currentData } = await supabase
        .from('nfc_tags')
        .select('hub_config')
        .eq('id', tag.id)
        .single();

      const latestCfg = currentData?.hub_config || cfg;
      const mergedConfig = {
        ...latestCfg,
        feedbacks: updatedFeedbacks
      };

      const { error } = await supabase
        .from('nfc_tags')
        .update({ hub_config: mergedConfig, updated_at: new Date().toISOString() })
        .eq('id', tag.id);

      if (!error) {
        setFeedbacksList(updatedFeedbacks);
        setCommentText('');
        toast.success('Terima kasih! Masukan Anda telah terkirim secara anonim.');
        setFeedbackModalOpen(false);
      } else {
        toast.error(`Gagal mengirim masukan: ${error.message}`);
      }
    } catch (err: any) {
      toast.error('Terjadi kesalahan saat mengirim.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Format QR Code Wi-Fi standar (WIFI:S:ssid;T:WPA;P:password;;)
  const wifiQrData = encodeURIComponent(
    `WIFI:S:${cfg.wifi_ssid || ''};T:WPA;P:${cfg.wifi_pass || ''};;`
  );
  const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${wifiQrData}&margin=10`;



  return (
    <div className="bg-[#F0F2F5] text-slate-800 font-sans min-h-screen antialiased flex flex-col justify-between selection:bg-rose-100 selection:text-rose-900">
      <main className="w-full max-w-6xl mx-auto px-4 py-6 md:py-12 flex-1 flex flex-col items-center justify-center">
        {/* Desktop Split / Mobile Centered Container */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center max-w-5xl">
          
          {/* Venue Info Sidebar (Visible on LG screens, matches Stitch layout) */}
          <aside className="lg:col-span-5 hidden lg:flex flex-col gap-5 lg:sticky lg:top-8 order-2 lg:order-1">
            {/* Cafe Brand Identity Card */}
            <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {cfg.avatar_url ? (
                  <img
                    src={cfg.avatar_url}
                    alt={tag.business_name || ''}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex flex-col items-center justify-center text-center p-1 text-white shadow-md select-none shrink-0">
                    <span className="text-[11px] font-extrabold tracking-wider leading-none uppercase text-amber-300">
                      {tag.business_name ? tag.business_name.split(' ')[0] : 'ADALAHH'}
                    </span>
                    <span className="text-[8px] font-semibold tracking-widest text-slate-300 mt-0.5">
                      & FIELDS
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                      {tag.business_name || 'adalahh'}
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                      Open
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium italic mt-0.5">“{tagline}”</p>
                </div>
              </div>

              {/* Table Identifier Chip */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-xs font-mono">
                    #{tag.id.replace('TAG', '') || '01'}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                      Tag {tag.id} • Table Service
                    </p>
                    <p className="text-[11px] text-slate-500">Service: Direct Table Hub Active</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Verified Tag</span>
              </div>

              {cfg.bio && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cfg.bio}
                </p>
              )}
            </section>

            {/* Quick Wi-Fi Card on Desktop */}
            {cfg.wifi_ssid && (
              <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <WifiIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Wi-Fi Cepat Tamu</p>
                      <p className="text-xs text-slate-500 font-mono">SSID: {cfg.wifi_ssid}</p>
                    </div>
                  </div>
                  <button
                    onClick={copyWifiPassword}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    title="Salin Sandi"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Salin Sandi
                  </button>
                </div>
              </section>
            )}
          </aside>

          {/* Interactive Mobile Portal / Right Column */}
          <section className="lg:col-span-7 w-full max-w-md mx-auto order-1 lg:order-2">
            <div className="bg-white/20 backdrop-blur-5xl rounded-[32px] p-5 sm:p-6 border border-white/80 transition-all duration-300 relative overflow-hidden">
              
              {/* Optional Cover Banner */}
              {cfg.cover_url && (
                <div className="-mx-6 -mt-6 mb-4 h-32 w-[calc(100%+3rem)] relative overflow-hidden">
                  <img
                    src={cfg.cover_url}
                    alt="Venue Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                </div>
              )}

              {/* Mobile Only Venue Avatar and Subtitle */}
              <div className="flex items-center gap-3.5 mb-6 px-1 relative z-10">
                {cfg.avatar_url ? (
                  <img
                    src={cfg.avatar_url}
                    alt={tag.business_name || ''}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex flex-col items-center justify-center text-center p-1 text-white shadow-sm shrink-0">

                    <span className="text-[10px] font-extrabold tracking-wider leading-none uppercase text-amber-300">
                      {tag.business_name ? tag.business_name.split(' ')[0] : 'ADALAHH'}
                    </span>
                    <span className="text-[7px] font-semibold tracking-widest text-slate-400 mt-0.5">
                      & FIELDS
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {tag.business_name || 'adalahh'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{tagline}</p>
                </div>
              </div>

              {/* Action Link Tiles List */}
              <nav aria-label="Guest Actions" className="flex flex-col gap-3">
                {linksToRender.map((link, idx) => (
                  <a
                    key={link.id || idx}
                    href={link.url === '#wifi' ? undefined : (link.icon === 'google' && !link.url ? reviewUrl : link.url)}
                    target={link.url === '#wifi' ? undefined : '_blank'}
                    rel="noreferrer"
                    onClick={(e) => handleLinkClick(link, e)}
                    className={`group block relative rounded-2xl p-4 transition-all duration-200 active:scale-[0.99] cursor-pointer ${
                      link.highlight
                        ? 'bg-neutral-900 hover:bg-black text-white border border-slate-800 shadow-md'
                        : 'bg-white hover:bg-slate-50/80 border border-slate-200/90 text-slate-800 shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <LinkIconBadge icon={link.icon} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold truncate ${link.highlight ? 'text-white' : 'text-slate-900'}`}>
                              {link.title}
                            </span>
                            {link.icon === 'rewards' && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full uppercase">
                                Perk
                              </span>
                            )}
                            {link.icon === 'google' && (
                              <span className="text-amber-400 text-xs font-bold">★★★★★</span>
                            )}
                          </div>
                          {link.icon === 'rewards' && (
                            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
                              Kumpulkan poin untuk reward menu
                            </p>
                          )}
                          {link.icon === 'google' && (
                            <p className="text-xs text-slate-300 mt-0.5 font-normal truncate">
                              Bantu dengan ulasan & foto momen Anda
                            </p>
                          )}
                          {link.icon === 'wifi' && (
                            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
                              {cfg.wifi_ssid ? `${cfg.wifi_ssid} • Tap untuk salin` : 'Tap untuk salin password'}
                            </p>
                          )}
                          {link.icon === 'menu' && (
                            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
                              {link.url && link.url.includes('.pdf') ? 'Dokumen PDF • Buka Buku Menu' : 'Daftar menu & harga'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`transition-colors shrink-0 ${link.highlight ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-700'}`}>
                        <ExternalLink className="w-5 h-5" />
                      </div>
                    </div>
                  </a>
                ))}
              </nav>

              {/* Social Icons Row if available */}
              {(cfg.instagram || cfg.youtube || cfg.tiktok) && (
                <div className="mt-6 pt-4 flex items-center justify-center gap-3 border-t border-slate-100">
                  {cfg.instagram && (
                    <a
                      href={`https://instagram.com/${cfg.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs transition-transform hover:scale-105"
                      title="Instagram"
                    >
                      <Camera className="h-4 w-4" />
                    </a>
                  )}
                  {cfg.youtube && (
                    <a
                      href={cfg.youtube.startsWith('http') ? cfg.youtube : `https://youtube.com/${cfg.youtube}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs transition-transform hover:scale-105"
                      title="YouTube"
                    >
                      <Play className="h-4 w-4 fill-white" />
                    </a>
                  )}
                  {cfg.tiktok && (
                    <a
                      href={`https://tiktok.com/@${cfg.tiktok.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-xs transition-transform hover:scale-105"
                      title="TikTok"
                    >
                      <Music className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Bottom Owner Config and Info */}
              <footer className="mt-8 pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="text-slate-800 font-semibold">ID</span>
                  <span>•</span>
                  <span>{tag.id}</span>
                </div>
              </footer>
            </div>
          </section>
        </div>
      </main>

      {/* Subdued Bottom Branding */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} {tag.business_name || 'Table Hub'}. Powered by <span className="font-semibold text-slate-600">Smart Stand</span> OS.</p>
      </footer>


      {/* Wi-Fi Connection Modal Popup */}
      {wifiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setWifiModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon Header */}
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner mb-3">
              <WifiIcon className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Sambungkan ke Wi-Fi Tamu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sandi otomatis disalin ke papan klip Anda.
            </p>

            {/* Wi-Fi Credentials Box */}
            <div className="w-full mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nama Wi-Fi (SSID)
                </span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {cfg.wifi_ssid || 'Wi-Fi Tamu'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Kata Sandi
                  </span>
                  <span className="text-sm font-bold text-teal-600 font-mono tracking-wide">
                    {cfg.wifi_pass || '(Tanpa Sandi)'}
                  </span>
                </div>
                {cfg.wifi_pass && (
                  <button
                    type="button"
                    onClick={copyWifiPassword}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-teal-600">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* QR Code Quick Join Option */}
            {cfg.wifi_ssid && (
              <div className="w-full mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <QrCode className="w-3 h-3" /> Pindai untuk Gabung Otomatis
                </span>
                <img
                  src={wifiQrUrl}
                  alt="Wi-Fi QR Code"
                  className="w-36 h-36 rounded-xl border border-white shadow-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1.5 text-center">
                  Arahkan kamera HP ke QR ini untuk langsung tersambung
                </span>
              </div>
            )}

            {/* Done Action Button */}
            <button
              type="button"
              onClick={() => setWifiModalOpen(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Tutup &amp; Buka Pengaturan Wi-Fi
            </button>
          </div>
        </div>
      )}

      {/* Anonymous Feedback Modal Popup */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-inner shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Kritik &amp; Saran Anonim
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tersimpan khusus untuk meja / tag ini ({tag.id})
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3.5 mt-2">
              {/* Rating Bintang */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-600">Kepuasan Layanan:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Komentar */}
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-700">
                  Pesan / Masukan Anda:
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tuliskan masukan Anda tentang rasa makanan, pelayanan, atau kenyamanan meja secara anonim..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black bg-slate-50/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 italic">
                <span>*Identitas Anda 100% terjaga rahasia</span>
                <span>{tag.id}</span>
              </div>

              {/* Tombol Kirim */}
              <button
                type="submit"
                disabled={submittingFeedback}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submittingFeedback ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Masukan Anonim</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



