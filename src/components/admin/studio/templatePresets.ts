import type { CanvasElement } from './types';

export const getTemplateWaveElements = (businessName?: string | null): CanvasElement[] => [
  {
    id: 'bg_wave',
    type: 'template_bg',
    bgVariant: 'wave',
    label: 'Background Wave Biru-Ungu',
    x: 50,
    y: 50,
    width: 520,
    height: 520,
    visible: true,
    locked: false,
    primaryColor: '#3b82f6',
    secondaryColor: '#4f46e5'
  },
  {
    id: 'google_logo',
    type: 'logo_google',
    label: 'Badge Logo Google G',
    x: 50,
    y: 19,
    width: 72,
    height: 72,
    visible: true
  },
  {
    id: 'main_header',
    type: 'text',
    label: 'Judul Review',
    x: 50,
    y: 36,
    width: 440,
    height: 35,
    visible: true,
    content: 'LEAVE US YOUR REVIEW ON GOOGLE',
    fontSize: 16,
    textColor: '#0f172a'
  },
  {
    id: 'nfc_instruction',
    type: 'text',
    label: 'Instruksi Tap NFC',
    x: 29,
    y: 57,
    width: 180,
    height: 25,
    visible: true,
    content: 'Tap your phone here',
    fontSize: 12,
    textColor: '#0f172a'
  },
  {
    id: 'nfc',
    type: 'nfc_target',
    label: 'Touchpoint Chip NFC',
    x: 29,
    y: 72,
    width: 120,
    height: 85,
    visible: true
  },
  {
    id: 'qr_instruction',
    type: 'text',
    label: 'Instruksi QR Code',
    x: 71,
    y: 57,
    width: 180,
    height: 25,
    visible: true,
    content: 'Or scan QR Code',
    fontSize: 12,
    textColor: '#0f172a'
  },
  {
    id: 'qr',
    type: 'qrcode',
    label: 'QR Code Link Review',
    x: 71,
    y: 72,
    width: 105,
    height: 105,
    visible: true
  },
  {
    id: 'footer_powered',
    type: 'text',
    label: 'Footer / Brand Bisnis',
    x: 50,
    y: 93,
    width: 320,
    height: 22,
    visible: true,
    content: businessName ? `Powered by ${businessName}` : 'Powered by TAPiTAG',
    fontSize: 10,
    textColor: '#475569'
  }
];

export const getTemplateBlackCurveElements = (businessName?: string | null): CanvasElement[] => [
  {
    id: 'bg_black_curve',
    type: 'template_bg',
    bgVariant: 'black_curve',
    label: 'Background Lengkungan Hitam Elegan',
    x: 50,
    y: 50,
    width: 520,
    height: 520,
    visible: true,
    locked: false,
    primaryColor: '#0a0a0a',
    secondaryColor: '#ffffff'
  },
  {
    id: 'google_logo_circle',
    type: 'logo_google',
    label: 'Logo Google G Bulat',
    x: 23,
    y: 19,
    width: 66,
    height: 66,
    visible: true
  },
  {
    id: 'review_us_on',
    type: 'text',
    label: 'Teks Review Us On',
    x: 62,
    y: 14,
    width: 220,
    height: 20,
    visible: true,
    content: 'review us on',
    fontSize: 13,
    textColor: '#ffffff'
  },
  {
    id: 'google_brand_text',
    type: 'text',
    label: 'Teks Google Besar',
    x: 63,
    y: 22,
    width: 220,
    height: 32,
    visible: true,
    content: 'Google',
    fontSize: 26,
    textColor: '#ffffff'
  },
  {
    id: 'stars',
    type: 'stars_5',
    label: '5 Bintang Emas',
    x: 63,
    y: 31,
    width: 140,
    height: 24,
    visible: true
  },
  {
    id: 'nfc',
    type: 'nfc_target',
    label: 'Touchpoint Chip NFC (Kiri)',
    x: 28,
    y: 60,
    width: 110,
    height: 85,
    visible: true
  },
  {
    id: 'tap_phone_label',
    type: 'text',
    label: 'Label Tap Phone',
    x: 28,
    y: 76,
    width: 150,
    height: 20,
    visible: true,
    content: 'tap your phone',
    fontSize: 12,
    textColor: '#0f172a'
  },
  {
    id: 'divider_or',
    type: 'text',
    label: 'Pemisah Atau (or)',
    x: 50,
    y: 65,
    width: 30,
    height: 24,
    visible: true,
    content: 'or',
    fontSize: 14,
    textColor: '#0f172a'
  },
  {
    id: 'qr',
    type: 'qrcode',
    label: 'QR Code Link Review (Kanan)',
    x: 72,
    y: 60,
    width: 105,
    height: 105,
    visible: true
  },
  {
    id: 'scan_qr_label',
    type: 'text',
    label: 'Label Scan QR',
    x: 72,
    y: 76,
    width: 150,
    height: 20,
    visible: true,
    content: 'scan QR code',
    fontSize: 12,
    textColor: '#0f172a'
  },
  {
    id: 'footer_powered',
    type: 'text',
    label: 'Footer Powered By',
    x: 50,
    y: 92,
    width: 340,
    height: 20,
    visible: true,
    content: businessName ? `powered by ${businessName}` : 'powered by reviews@card',
    fontSize: 10,
    textColor: '#0f172a'
  }
];

export const getTemplateStarsVerticalElements = (businessName?: string | null): CanvasElement[] => [
  {
    id: 'sub_header',
    type: 'text',
    label: 'Teks Pembuka',
    x: 50,
    y: 9,
    width: 300,
    height: 24,
    visible: true,
    content: businessName ? `Thanks for visiting ${businessName}` : 'Thanks for visiting',
    fontSize: 14,
    textColor: '#0f172a'
  },
  {
    id: 'cta_button',
    type: 'google_badge_pill',
    label: 'Pill Tombol Review Us',
    x: 50,
    y: 16,
    width: 250,
    height: 38,
    visible: true,
    content: 'Review us on',
    fontSize: 14,
    textColor: '#ffffff'
  },
  {
    id: 'google_logo_big',
    type: 'logo_google',
    label: 'Logo Google G',
    x: 50,
    y: 30,
    width: 76,
    height: 76,
    visible: true
  },
  {
    id: 'stars',
    type: 'stars_5',
    label: '5 Bintang Emas (Review)',
    x: 50,
    y: 42,
    width: 170,
    height: 30,
    visible: true
  },
  {
    id: 'nfc',
    type: 'nfc_target',
    label: 'Touchpoint Chip NFC',
    x: 28,
    y: 62,
    width: 95,
    height: 75,
    visible: true
  },
  {
    id: 'qr',
    type: 'qrcode',
    label: 'QR Code Link Review',
    x: 72,
    y: 62,
    width: 120,
    height: 120,
    visible: true
  },
  {
    id: 'bottom_pill',
    type: 'google_badge_pill',
    label: 'Pill Bawah Tap or Scan',
    x: 50,
    y: 84,
    width: 220,
    height: 36,
    visible: true,
    content: 'Tap or Scan',
    fontSize: 14,
    textColor: '#ffffff'
  }
];

export const getTemplateFrameQuadElements = (businessName?: string | null): CanvasElement[] => [
  {
    id: 'bg_frame_quad',
    type: 'template_bg',
    bgVariant: 'frame_quad',
    label: 'Background Frame 4 Warna Google',
    x: 50,
    y: 50,
    width: 520,
    height: 520,
    visible: true,
    locked: false
  },
  {
    id: 'brand_title',
    type: 'text',
    label: 'Nama Brand / Bisnis',
    x: 50,
    y: 20,
    width: 360,
    height: 32,
    visible: true,
    content: businessName || 'YOUR BUSINESS LOGO',
    fontSize: 18,
    textColor: '#0f172a'
  },
  {
    id: 'sub_instruction',
    type: 'text',
    label: 'Sub Judul',
    x: 50,
    y: 32,
    width: 380,
    height: 25,
    visible: true,
    content: 'PLEASE LEAVE US A REVIEW',
    fontSize: 13,
    textColor: '#334155'
  },
  {
    id: 'nfc',
    type: 'nfc_target',
    label: 'Touchpoint Chip NFC',
    x: 30,
    y: 56,
    width: 120,
    height: 85,
    visible: true
  },
  {
    id: 'qr',
    type: 'qrcode',
    label: 'QR Code Link Review',
    x: 70,
    y: 56,
    width: 120,
    height: 120,
    visible: true
  },
  {
    id: 'stars',
    type: 'stars_5',
    label: '5 Bintang Emas',
    x: 34,
    y: 84,
    width: 130,
    height: 25,
    visible: true
  },
  {
    id: 'google_text',
    type: 'text',
    label: 'Teks Review on Google',
    x: 68,
    y: 84,
    width: 160,
    height: 25,
    visible: true,
    content: 'Review us on Google',
    fontSize: 11,
    textColor: '#475569'
  }
];

export const getTemplateBadgeCircleElements = (businessName?: string | null): CanvasElement[] => [
  {
    id: 'bg_badge_circle',
    type: 'template_bg',
    bgVariant: 'badge_circle',
    label: 'Background Lingkaran Google',
    x: 50,
    y: 50,
    width: 420,
    height: 650,
    visible: true,
    locked: false
  },
  {
    id: 'header_review',
    type: 'text',
    label: 'Judul Atas',
    x: 50,
    y: 12,
    width: 340,
    height: 30,
    visible: true,
    content: 'Review Us On',
    fontSize: 22,
    textColor: '#0f172a'
  },
  {
    id: 'nfc',
    type: 'nfc_target',
    label: 'Touchpoint Chip NFC (Tengah)',
    x: 50,
    y: 35,
    width: 110,
    height: 80,
    visible: true
  },
  {
    id: 'sub_tap_here',
    type: 'text',
    label: 'Teks Tap Here Google',
    x: 50,
    y: 49,
    width: 300,
    height: 25,
    visible: true,
    content: 'TAP HERE TO GOOGLE',
    fontSize: 14,
    textColor: '#0f172a'
  },
  {
    id: 'qr',
    type: 'qrcode',
    label: 'QR Code Link Review',
    x: 50,
    y: 69,
    width: 105,
    height: 105,
    visible: true
  },
  {
    id: 'stars',
    type: 'stars_5',
    label: '5 Bintang Emas',
    x: 50,
    y: 84,
    width: 170,
    height: 30,
    visible: true
  },
  {
    id: 'footer_powered',
    type: 'text',
    label: 'Footer Bisnis',
    x: 50,
    y: 93,
    width: 320,
    height: 20,
    visible: true,
    content: businessName ? `Powered by ${businessName}` : 'Powered by Jagres NFC',
    fontSize: 10,
    textColor: '#64748b'
  }
];

// Template Sisi Belakang (Clean Backside dengan QR Code Besar Fokus)
export const getTemplateBackSideElements = (businessName?: string | null): CanvasElement[] => [
  {
    id: 'bg_back_qr_focus',
    type: 'template_bg',
    bgVariant: 'qr_focus',
    label: 'Background Aksen Garis QR',
    x: 50,
    y: 50,
    width: 520,
    height: 520,
    visible: true,
    locked: false
  },
  {
    id: 'back_google_logo',
    type: 'logo_google',
    label: 'Logo Google G Sisi Belakang',
    x: 50,
    y: 14,
    width: 60,
    height: 60,
    visible: true
  },
  {
    id: 'back_header',
    type: 'text',
    label: 'Judul Sisi Belakang',
    x: 50,
    y: 24,
    width: 380,
    height: 28,
    visible: true,
    content: businessName ? `Review ${businessName} di Google` : 'Scan QR Code untuk Review Kami',
    fontSize: 15,
    textColor: '#0f172a'
  },
  {
    id: 'back_stars',
    type: 'stars_5',
    label: '5 Bintang Emas Review',
    x: 50,
    y: 32,
    width: 150,
    height: 24,
    visible: true
  },
  {
    id: 'qr',
    type: 'qrcode',
    label: 'QR Code Besar Fokus',
    x: 50,
    y: 54,
    width: 180,
    height: 180,
    visible: true
  },
  {
    id: 'back_instruction',
    type: 'text',
    label: 'Instruksi Buka Kamera',
    x: 50,
    y: 77,
    width: 320,
    height: 22,
    visible: true,
    content: 'Buka Kamera Ponsel & Arahkan ke QR Code',
    fontSize: 12,
    textColor: '#334155'
  },
  {
    id: 'nfc',
    type: 'nfc_target',
    label: 'Chip NFC Cadangan Belakang',
    x: 50,
    y: 87,
    width: 90,
    height: 48,
    visible: false
  },
  {
    id: 'back_footer',
    type: 'text',
    label: 'Footer Sisi Belakang',
    x: 50,
    y: 93,
    width: 340,
    height: 20,
    visible: true,
    content: businessName ? `Terima Kasih Atas Kunjungan Anda • ${businessName}` : 'Terima Kasih Atas Ulasan & Bintang Anda',
    fontSize: 10,
    textColor: '#64748b'
  }
];
