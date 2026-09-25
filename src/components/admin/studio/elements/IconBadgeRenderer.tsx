import React from 'react';
import {
  Wifi,
  Smartphone,
  Radio,
  MapPin,
  Heart,
  ThumbsUp,
  Share2,
  PhoneCall,
  Mail,
  Globe,
  Sparkles,
  Award,
  CheckCircle2,
  Camera,
  QrCode,
  Star,
  ExternalLink,
  MessageCircle,
  Coffee,
  ShoppingBag
} from 'lucide-react';
import type { CanvasElement } from '../types';

export const ICON_STICKER_LIST: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'smartphone', label: 'Ponsel NFC', icon: Smartphone },
  { id: 'radio', label: 'Sinyal NFC', icon: Radio },
  { id: 'wifi', label: 'Wi-Fi Hotspot', icon: Wifi },
  { id: 'mappin', label: 'Google Maps Pin', icon: MapPin },
  { id: 'thumbsup', label: 'Jempol Like', icon: ThumbsUp },
  { id: 'heart', label: 'Love / Favorit', icon: Heart },
  { id: 'share', label: 'Bagikan / Share', icon: Share2 },
  { id: 'camera', label: 'Kamera Scan', icon: Camera },
  { id: 'qrcode', label: 'Barcode QR', icon: QrCode },
  { id: 'star', label: 'Bintang Tunggal', icon: Star },
  { id: 'award', label: 'Sertifikat / Badge', icon: Award },
  { id: 'check', label: 'Verified Centang', icon: CheckCircle2 },
  { id: 'globe', label: 'Situs Website', icon: Globe },
  { id: 'phone', label: 'Telepon Kontak', icon: PhoneCall },
  { id: 'mail', label: 'Email Kantor', icon: Mail },
  { id: 'chat', label: 'Chat WhatsApp', icon: MessageCircle },
  { id: 'sparkles', label: 'Rating Istimewa', icon: Sparkles },
  { id: 'coffee', label: 'Kafe / Minuman', icon: Coffee },
  { id: 'shopping', label: 'Toko / Merchant', icon: ShoppingBag }
];

export function getIconStickerComponent(name: string) {
  const found = ICON_STICKER_LIST.find((i) => i.id === name);
  return found ? found.icon : Smartphone;
}

export function IconBadgeRenderer({ element: el }: { element: CanvasElement }) {
  const IconComp = getIconStickerComponent(el.iconName || 'smartphone');
  const iconColor = el.iconColor || '#4285F4';
  const badgeBg = el.badgeBgColor || '#f8fafc';
  const badgeShape = el.badgeShape || 'circle';

  const shapeClass =
    badgeShape === 'circle'
      ? 'rounded-full'
      : badgeShape === 'rounded'
      ? 'rounded-2xl'
      : badgeShape === 'square'
      ? 'rounded-md'
      : 'rounded-none bg-transparent';

  return (
    <div
      style={{
        backgroundColor: badgeShape !== 'none' ? badgeBg : 'transparent'
      }}
      className={`w-full h-full flex items-center justify-center p-2.5 shadow-2xs pointer-events-none select-none ${shapeClass}`}
    >
      <div style={{ color: iconColor }} className="w-full h-full flex items-center justify-center">
        <IconComp className="w-full h-full" />
      </div>
    </div>
  );
}
