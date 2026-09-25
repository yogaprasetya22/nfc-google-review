import { useState, useEffect } from 'react';
import { parseMapsUrl, resolveMapsUrlAsync, fetchPlaceIdByQuery } from '@/lib/utils';

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

/**
 * Hook untuk pencarian tempat & pengenalan URL Google Maps secara otomatis.
 * Menggunakan Photon (Komoot) + Nominatim + fallback pencarian Google Maps.
 */
export function usePlaceAutocomplete(query: string, userBusinessName?: string) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const raw = query.trim();
    if (!raw) {
      setSuggestions([]);
      return;
    }

    // 1. Jika pengguna mem-paste URL Google Maps
    const parsedUrl = parseMapsUrl(raw);
    if (parsedUrl) {
      setSuggestions([
        {
          place_id: `URL:${parsedUrl.rawUrl}`,
          name: userBusinessName || parsedUrl.name,
          address: parsedUrl.address,
          category: 'Google Maps Link',
          source: 'url',
          direct_url: parsedUrl.rawUrl
        }
      ]);

      // Jika URL pendek, lakukan resolve asinkron
      if ((raw.includes('maps.app.goo.gl') || raw.includes('goo.gl/maps')) && !parsedUrl.rawUrl.includes('writereview')) {
        void resolveMapsUrlAsync(raw).then((resolved) => {
          if (resolved?.rawUrl && resolved.rawUrl.includes('writereview')) {
            setSuggestions([
              {
                place_id: `URL:${resolved.rawUrl}`,
                name: userBusinessName || resolved.name || parsedUrl.name,
                address: 'Form ulasan bintang 5 langsung (Write Review)',
                category: 'Google Review Bintang 5',
                source: 'url',
                direct_url: resolved.rawUrl
              }
            ]);
          }
        });
      }
      return;
    }

    // 2. Opsi pencarian langsung di Google Maps
    const directGoogleOption: PlaceSuggestion = {
      place_id: `NAME-${encodeURIComponent(raw)}`,
      name: raw,
      address: `Cari langsung di Google Maps: "${raw}"`,
      category: 'Google Maps',
      source: 'google',
      direct_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`
    };

    setSuggestions([directGoogleOption]);

    // 3. Cari saran nama bisnis via Photon + Nominatim
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [placeIdRes, photonRes, nominatimRes] = await Promise.allSettled([
          fetchPlaceIdByQuery(raw),
          fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(raw)}&limit=8&lat=-6.2&lon=106.8`),
          fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw)}&addressdetails=1&limit=3&countrycodes=id`,
            {
              headers: { 'Accept-Language': 'id', 'User-Agent': 'NFC-Review-SmartStand/1.0' }
            }
          )
        ]);

        const results: PlaceSuggestion[] = [];
        const seenNames = new Set<string>();

        // Dynamic Google Place ID resolution
        if (placeIdRes.status === 'fulfilled' && placeIdRes.value) {
          const gPlace = placeIdRes.value;
          results.push({
            place_id: gPlace.placeId,
            name: userBusinessName || gPlace.name,
            address: gPlace.address || `Form Ulasan Bintang 5 Langsung (${gPlace.placeId})`,
            category: 'Google Review Bintang 5',
            source: 'url',
            direct_url: `https://search.google.com/local/writereview?placeid=${gPlace.placeId}`
          });
          seenNames.add(gPlace.name.toLowerCase());
        }

        if (photonRes.status === 'fulfilled') {
          const photonData = await photonRes.value.json();
          for (const f of photonData.features || []) {
            const props = f.properties || {};
            if (props.countrycode && props.countrycode !== 'ID') continue;
            const name = props.name || '';
            const city = props.city || props.county || '';
            const street = props.street || '';
            const state = props.state || '';
            const district = props.district || '';
            const address = [street, district, city, state].filter(Boolean).join(', ') || props.country || '';
            const key = `${name}-${city}`.toLowerCase();

            if (name && !seenNames.has(key)) {
              seenNames.add(key);
              results.push({
                place_id: `PHOTON-${props.osm_id || results.length}`,
                name,
                address: address || 'Indonesia',
                category: (props.osm_value || props.type || '').replace(/_/g, ' ') || 'Lokasi',
                source: 'osm',
                direct_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`
              });
            }
          }
        }

        if (nominatimRes.status === 'fulfilled') {
          const nomData = await nominatimRes.value.json();
          for (const item of nomData) {
            const name = item.name || item.display_name.split(',')[0];
            const key = `${name}-${item.address?.city || ''}`.toLowerCase();
            if (!seenNames.has(key)) {
              seenNames.add(key);
              results.push({
                place_id: `OSM-${item.place_id}`,
                name,
                address: item.display_name,
                category: item.type ? item.type.replace(/_/g, ' ') : 'Lokasi',
                source: 'osm',
                direct_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
              });
            }
          }
        }

        setSuggestions(results.length > 0 && results[0].source === 'url' ? [...results, directGoogleOption] : [directGoogleOption, ...results]);
      } catch {
        // Fallback ke directGoogleOption
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, userBusinessName]);

  return { suggestions, isSearching };
}
