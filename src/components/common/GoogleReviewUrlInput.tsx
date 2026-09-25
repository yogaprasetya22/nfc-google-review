import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2, CheckCircle2, Navigation, ExternalLink } from 'lucide-react';
import { parseMapsUrl, resolveMapsUrlAsync, fetchPlaceIdByQuery } from '@/lib/utils';
import { usePlaceAutocomplete, PlaceSuggestion } from '@/hooks/usePlaceAutocomplete';
import type { GoogleReviewUrlInputProps } from '@/types/wizard';
import { toast } from 'sonner';

/**
 * Komponen Input Lokasi & URL Google Maps
 * Tampilan & interaksi identik persis dengan LinkCardsEditor (Leave a Google Review)
 */
export function GoogleReviewUrlInput({
  value,
  onChange,
  label = 'Tautan Ulasan Google Maps:',
  placeholder = 'https://... atau paste link Google Maps',
  autoExtractBusinessName = true,
  className = ''
}: GoogleReviewUrlInputProps) {
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Hook Autocomplete Pencarian Tempat
  const { suggestions, isSearching } = usePlaceAutocomplete(searchQuery);
  const isWriteReview = Boolean(value && value.includes('writereview'));

  // Menutup dropdown saat klik di luar area komponen
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        // Biarkan tetap terbuka jika pengguna sedang mengetik
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler saat item tempat dari dropdown dipilih
  const handleSelectSuggestion = (place: PlaceSuggestion) => {
    const safeName =
      autoExtractBusinessName &&
      place.name &&
      place.name.toLowerCase().trim() !== 'google maps'
        ? place.name
        : undefined;

    // A. Jika opsi yang dipilih sudah berupa URL ulasan langsung
    if (place.direct_url && place.direct_url.includes('writereview')) {
      onChange(place.direct_url, safeName);
      setIsOpenSearch(false);
      setSearchQuery('');
      toast.success(`Lokasi "${place.name}" berhasil dihubungkan ke form Write Review!`);
      return;
    }

    // B. Coba konversi via query resolver ke Write Review URL resmi
    fetchPlaceIdByQuery(place.name)
      .then((resolved) => {
        if (resolved?.placeId) {
          const directReviewUrl = `https://search.google.com/local/writereview?placeid=${resolved.placeId}`;
          onChange(directReviewUrl, safeName || resolved.name);
          toast.success(`Lokasi "${place.name}" berhasil dihubungkan ke form Write Review!`);
        } else {
          const fallbackUrl = place.direct_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
          onChange(fallbackUrl, safeName);
          toast.success(`Lokasi "${place.name}" terhubung!`);
        }
      })
      .catch(() => {
        const fallbackUrl = place.direct_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
        onChange(fallbackUrl, safeName);
      });

    setIsOpenSearch(false);
    setSearchQuery('');
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Header Label + Status + Toggle Search */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {isWriteReview && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Write Review Aktif
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpenSearch(!isOpenSearch);
              if (!isOpenSearch) setSearchQuery('');
            }}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200"
          >
            <Search className="w-3 h-3" />
            {isOpenSearch ? 'Tutup Pencarian' : 'Cari di Google Maps'}
          </button>
        </div>
      </div>

      {/* Pencarian Lokasi Google Maps jika dibuka */}
      {isOpenSearch && (
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 mb-2 relative" ref={searchDropdownRef}>
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
                    onClick={() => handleSelectSuggestion(item)}
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
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          const parsed = parseMapsUrl(val);
          if (parsed?.rawUrl && parsed.rawUrl.includes('writereview')) {
            onChange(parsed.rawUrl, autoExtractBusinessName && parsed.name ? parsed.name : undefined);
            toast.success('Otomatis diubah menjadi link langsung ke form ulasan bintang!');
          } else {
            onChange(val);
          }
        }}
        placeholder={placeholder}
        className="h-8 text-xs bg-white rounded-lg border-slate-200 font-mono"
      />
    </div>
  );
}