import type { CustomTemplate } from './types';

/**
 * STARTER_TEMPLATES:
 * Template sekarang dimuat secara dinamis dari file JSON eksternal (public/templates/starter-templates.json)
 * atau dari Supabase `studio_templates`. Tidak ada lagi ribuan baris objek template yang di-hardcode di kode TypeScript.
 */

// Placeholder minimal default jika offline / sebelum file JSON dimuat
export const DEFAULT_BLANK_ELEMENTS = [
  {
    id: 'nfc_target',
    type: 'nfc_target' as const,
    label: 'Touchpoint Chip NFC',
    x: 35,
    y: 50,
    width: 110,
    height: 90,
    visible: true
  },
  {
    id: 'qrcode',
    type: 'qrcode' as const,
    label: 'QR Code Review Link',
    x: 65,
    y: 50,
    width: 120,
    height: 120,
    visible: true
  }
];

export const STARTER_TEMPLATES: CustomTemplate[] = [];

// Fungsi loader asinkron untuk mengambil template dari file JSON eksternal
export async function loadExternalStarterTemplates(): Promise<CustomTemplate[]> {
  try {
    const res = await fetch('/templates/starter-templates.json');
    if (!res.ok) {
      console.warn('Gagal memuat template dari /templates/starter-templates.json:', res.statusText);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('Terjadi kesalahan memuat starter-templates.json:', err);
    return [];
  }
}
