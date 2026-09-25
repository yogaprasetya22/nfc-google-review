import React, { useRef } from 'react';
import type { ProductType } from '@/types/nfc';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Star,
  Utensils,
  MapPin,
  Search,
  CheckCircle2,
  Building2,
  KeyRound,
  Store,
  Navigation,
  Heart,
  Wifi,
  BookOpen,
  Gift,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export interface PlaceSuggestion {
  place_id: string;
  name: string;
  address: string;
  category?: string;
  source: 'google' | 'osm' | 'url';
  direct_url?: string;
  image_url?: string;
  rating?: number;
}

interface TagActivationWizardProps {
  tagId: string;
  selectedType: ProductType;
  setSelectedType: (t: ProductType) => void;
  businessName: string;
  setBusinessName: (n: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  suggestions: PlaceSuggestion[];
  selectedPlace: PlaceSuggestion | null;
  isSearching: boolean;
  isInputFocused: boolean;
  setIsInputFocused: (f: boolean) => void;
  onSelectPlace: (p: PlaceSuggestion) => void;
  pin: string;
  setPin: (p: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function TagActivationWizard({
  tagId,
  selectedType,
  setSelectedType,
  businessName,
  setBusinessName,
  searchQuery,
  setSearchQuery,
  suggestions,
  selectedPlace,
  isSearching,
  isInputFocused,
  setIsInputFocused,
  onSelectPlace,
  pin,
  setPin,
  isSubmitting,
  onSubmit
}: TagActivationWizardProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-black selection:text-white">
      <Card className="relative w-full max-w-lg border border-slate-200 bg-white shadow-xl rounded-2xl overflow-visible">
        {/* Header Visual */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-black animate-pulse" />
              <span className="font-mono text-xs font-semibold text-slate-800">{tagId}</span>
            </div>
            <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-[11px] font-mono">
              UNCLAIMED
            </Badge>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900 mt-3">
            Aktivasi Smart Stand
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Kaitkan unit akrilik / kartu NFC ini dengan profil bisnis & meja Anda.
          </CardDescription>
        </div>

        <form onSubmit={onSubmit}>
          <CardContent className="p-6 space-y-5">
            {/* Tipe Perangkat Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-slate-500" /> Mode Operasional Unit
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedType('DIRECT_REVIEW')}
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedType === 'DIRECT_REVIEW'
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-black'
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      selectedType === 'DIRECT_REVIEW' ? 'fill-white text-white' : 'text-slate-500'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold">Direct Review</div>
                    <div className="text-[10px] opacity-80">Meja Kasir / Receptionist</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('TABLE_HUB')}
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedType === 'TABLE_HUB'
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 hover:text-black'
                  }`}
                >
                  <Utensils
                    className={`h-5 w-5 ${
                      selectedType === 'TABLE_HUB' ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold">Table Hub</div>
                    <div className="text-[10px] opacity-80">Meja Makan / Tamu</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Live Visual Preview saat memilih Table Hub */}
            {selectedType === 'TABLE_HUB' && (
              <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5" /> Preview Tampilan Meja Tamu
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    Live Preview
                  </span>
                </div>


                {/* Mini Mockup Meja */}
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {businessName ? businessName.substring(0, 2).toUpperCase() : 'TH'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {businessName || 'Nama Toko Anda'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Great choice, awkward chat
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black text-white text-[11px] font-semibold">
                      <span className="flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> Leave a Google Review
                      </span>
                      <span className="text-[10px] text-neutral-300">Bintang 5</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-slate-600" /> View Menu
                      </span>
                      <span className="text-[10px] text-slate-400">PDF / Web</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-medium">
                      <span className="flex items-center gap-2">
                        <Wifi className="h-3.5 w-3.5 text-emerald-600" /> Connect to Wi-Fi
                      </span>
                      <span className="text-[10px] text-slate-400">Salin Sandi</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nama Bisnis */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-500" /> Nama Bisnis / Toko
              </label>
              <Input
                required
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (!searchQuery) setSearchQuery(e.target.value);
                }}
                placeholder="Contoh: coffee shop bsd"
                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-black"
              />
            </div>

            {/* Input Lokasi / Dropdown Google Maps (Hanya untuk DIRECT_REVIEW) */}
            {selectedType === 'DIRECT_REVIEW' && (
              <div className="space-y-1.5" ref={dropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                    Tautan Ulasan Google Maps:
                  </label>
                  <div className="flex items-center gap-2">
                    {selectedPlace?.direct_url && selectedPlace.direct_url.includes('writereview') && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Write Review Aktif
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsInputFocused(!isInputFocused);
                        if (!isInputFocused) setSearchQuery('');
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
                    >
                      <Search className="w-3 h-3" />
                      {isInputFocused ? 'Tutup Pencarian' : 'Cari di Google Maps'}
                    </button>
                  </div>
                </div>

                {/* Panel Pencarian Biru jika dibuka */}
                {isInputFocused && (
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 mb-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" /> Cari Lokasi Bisnis
                      </span>
                      <span className="text-[9px] text-blue-600">Ketik nama toko atau paste link maps</span>
                    </div>
                    <div className="relative">
                      <Input
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ketik nama bisnis atau paste link Google Maps..."
                        className="h-8 pl-8 pr-8 text-xs bg-white rounded-lg border-blue-300 focus-visible:ring-blue-600"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-blue-500" />
                      {isSearching && (
                        <Loader2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 animate-spin text-blue-600" />
                      )}
                    </div>

                    {/* Dropdown Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="rounded-xl border border-blue-200 bg-white shadow-lg overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100">
                        {suggestions.map((item, sIdx) => (
                          item.source === 'google' ? (
                            /* Opsi Google Maps: buka di tab baru, lalu user paste link kembali */
                            <a
                              key={sIdx}
                              href={item.direct_url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full text-left p-2.5 bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-colors flex items-center gap-2.5 cursor-pointer"
                            >
                              <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                                <Search className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-blue-900">
                                  Cari "{item.name}" di Google Maps
                                </span>
                                <p className="text-[10px] text-blue-600 leading-snug">
                                  Buka Google Maps → Copy link bisnis → Paste di sini
                                </p>
                              </div>
                              <ExternalLink className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            </a>
                          ) : (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                onSelectPlace(item);
                                setIsInputFocused(false);
                              }}
                              className="w-full text-left p-2 hover:bg-blue-50/70 transition-colors flex items-start gap-2 cursor-pointer"
                            >
                              <div className="p-1 rounded-md bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                                {item.source === 'url' ? (
                                  <Navigation className="h-3.5 w-3.5" />
                                ) : (
                                  <MapPin className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {item.name}
                                  </span>
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                    {item.category || item.source}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate leading-snug">
                                  {item.address}
                                </p>
                              </div>
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 self-center" />
                            </button>
                          )
                        ))}
                      </div>
                    )}

                    {/* Petunjuk paste link */}
                    <div className="text-[9px] text-blue-700/70 text-center pt-1">
                      Tip: Buka Google Maps di browser, cari bisnis Anda, lalu copy & paste link-nya di kolom di atas
                    </div>
                  </div>
                )}

                {/* Input URL Field Utama */}
                <Input
                  value={selectedPlace?.direct_url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onSelectPlace({
                      place_id: val,
                      name: businessName || 'Google Maps',
                      address: 'Direct URL',
                      source: 'url',
                      direct_url: val
                    });
                  }}
                  placeholder="https://... atau paste link Google Maps"
                  className="h-8 text-xs bg-white rounded-lg border-slate-200 font-mono"
                />
              </div>
            )}

            {/* Notice / Pengaturan Tambahan Saat Memilih Mode Table Hub */}
            {selectedType === 'TABLE_HUB' && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Utensils className="h-4 w-4" />
                  <span>Fitur Table Hub (Portal Meja Tamu)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Setelah diaktivasi, tamu yang menyentuh NFC akan langsung melihat halaman <strong>Linktree Meja</strong> lengkap dengan tombol ulasan Google Maps, buku menu digital, Wi-Fi otomatis, reward, dan medsos. Anda dapat mengatur tautannya di CMS kapan saja!
                </p>
              </div>
            )}

            {/* PIN Keamanan */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-slate-500" /> Buat PIN Pengelola (4-6 Digit)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Untuk login CMS</span>
              </label>
              <Input
                type="password"
                required
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Contoh: 123456"
                className="h-11 font-mono tracking-widest text-center text-sm rounded-xl border-slate-200 bg-white text-slate-900 focus-visible:ring-black"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              {selectedType === 'TABLE_HUB' ? 'Aktivasi Table Hub & Buka Portal' : 'Aktivasi Direct Review Sekarang'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
