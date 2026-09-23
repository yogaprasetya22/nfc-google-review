import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ekstrak nama dan alamat dari URL Google Maps
export function parseMapsUrl(input: string): { name: string; address: string; rawUrl: string } | null {
  const trimmed = input.trim();
  const isMapsUrl = 
    trimmed.includes('google.com/maps') || 
    trimmed.includes('maps.app.goo.gl') || 
    trimmed.includes('goo.gl/maps') ||
    trimmed.includes('maps.google.');

  if (!isMapsUrl) {
    return null;
  }

  // Bersihkan karakter aneh di ujung (misal tanda titik ".")
  const cleanUrl = trimmed.replace(/[.,;!?]+$/, '');

  let address = '';
  let name = '';

  try {
    const url = new URL(cleanUrl);

    const daddr = url.searchParams.get('daddr');
    if (daddr) {
      const decoded = decodeURIComponent(daddr).replace(/\+/g, ' ');
      address = decoded;
      name = decoded.split(',')[0].trim();
    }

    const q = url.searchParams.get('q') || url.searchParams.get('query');
    if (q && !name) {
      const decoded = decodeURIComponent(q).replace(/\+/g, ' ');
      address = decoded;
      name = decoded.split(',')[0].trim();
    }

    const pathParts = url.pathname.split('/');
    const placeIdx = pathParts.indexOf('place');
    if (placeIdx !== -1 && pathParts[placeIdx + 1] && !name) {
      const decoded = decodeURIComponent(pathParts[placeIdx + 1]).replace(/\+/g, ' ');
      name = decoded.split(',')[0].trim();
      address = decoded;
    }
  } catch {
    const daddrMatch = input.match(/[?&]daddr=([^&]+)/);
    if (daddrMatch && daddrMatch[1]) {
      const decoded = decodeURIComponent(daddrMatch[1]).replace(/\+/g, ' ');
      address = decoded;
      name = decoded.split(',')[0].trim();
    }
  }

  return {
    name: name || 'Profil Google Bisnis',
    address: address || 'Lokasi terverifikasi via Google Maps',
    rawUrl: cleanUrl
  };
}

