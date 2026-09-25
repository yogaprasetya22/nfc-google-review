import React, { useState } from 'react';
import type { CanvasElement } from '../types';
import {
  Star,
  Bookmark,
  Database,
  Building2,
  Sparkles,
  Wifi,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  Shield,
  Heart,
  MessageSquare,
  MessageCircle,
  Cloud,
  Cylinder,
  FileText,
  Boxes,
  Diamond,
  Search
} from 'lucide-react';
import { getIconStickerComponent } from '../elements/IconBadgeRenderer';
import type { NfcTagEntity } from '@/types/nfc';

interface DrawerElementsProps {
  onAddNewElement: (
    type: CanvasElement['type'],
    label: string,
    customContent?: string,
    options?: Partial<CanvasElement>
  ) => void;
  tag?: NfcTagEntity;
}

export function DrawerElements({ onAddNewElement, tag }: DrawerElementsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const shapeCategories = [
    {
      category: 'Garis & Penghubung',
      items: [
        {
          id: 'line',
          label: 'Garis Lurus',
          shapeType: 'line' as const,
          width: 220,
          height: 4,
          icon: <Minus className="w-5 h-5 text-slate-700" />,
          fillColor: '#0f172a'
        },
        {
          id: 'line_dashed',
          label: 'Garis Putus',
          shapeType: 'line_dashed' as const,
          width: 220,
          height: 10,
          icon: (
            <div className="w-6 h-0.5 border-t-2 border-dashed border-slate-700" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'line_arrow_right',
          label: 'Panah Garis',
          shapeType: 'line_arrow_right' as const,
          width: 200,
          height: 18,
          icon: <ArrowRight className="w-5 h-5 text-slate-700" />,
          fillColor: '#0f172a'
        },
        {
          id: 'line_arrow_double',
          label: 'Dua Arah',
          shapeType: 'line_arrow_double' as const,
          width: 200,
          height: 18,
          icon: <ArrowLeftRight className="w-5 h-5 text-slate-700" />,
          fillColor: '#0f172a'
        }
      ]
    },
    {
      category: 'Bentuk Dasar',
      items: [
        {
          id: 'rect',
          label: 'Kotak',
          shapeType: 'rect' as const,
          width: 90,
          height: 90,
          icon: <Square className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'rounded_rect',
          label: 'Lengkung',
          shapeType: 'rounded_rect' as const,
          width: 110,
          height: 75,
          icon: <div className="w-5 h-4 rounded-md bg-slate-800" />,
          fillColor: '#0f172a',
          borderRadius: 14
        },
        {
          id: 'circle',
          label: 'Lingkaran',
          shapeType: 'circle' as const,
          width: 90,
          height: 90,
          icon: <Circle className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'triangle',
          label: 'Segitiga',
          shapeType: 'triangle' as const,
          width: 90,
          height: 90,
          icon: <Triangle className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'diamond',
          label: 'Belah Ketupat',
          shapeType: 'diamond' as const,
          width: 90,
          height: 90,
          icon: <Diamond className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'trapezoid',
          label: 'Trapesium',
          shapeType: 'trapezoid' as const,
          width: 100,
          height: 80,
          icon: (
            <div className="w-5 h-4 bg-slate-800 [clip-path:polygon(20%_0%,80%_0%,100%_100%,0%_100%)]" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'parallelogram',
          label: 'Jajar Genjang',
          shapeType: 'parallelogram' as const,
          width: 110,
          height: 75,
          icon: (
            <div className="w-5 h-4 bg-slate-800 [clip-path:polygon(25%_0%,100%_0%,75%_100%,0%_100%)]" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'capsule',
          label: 'Kapsul / Pill',
          shapeType: 'capsule' as const,
          width: 120,
          height: 55,
          icon: <div className="w-6 h-3 rounded-full bg-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'shield',
          label: 'Perisai',
          shapeType: 'shield' as const,
          width: 85,
          height: 95,
          icon: <Shield className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'heart',
          label: 'Hati',
          shapeType: 'heart' as const,
          width: 90,
          height: 85,
          icon: <Heart className="w-5 h-5 fill-red-500 text-red-500" />,
          fillColor: '#ef4444'
        }
      ]
    },
    {
      category: 'Poligon',
      items: [
        {
          id: 'pentagon',
          label: 'Segilima',
          shapeType: 'pentagon' as const,
          width: 90,
          height: 90,
          icon: (
            <div className="w-5 h-5 bg-slate-800 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'hexagon',
          label: 'Segienam',
          shapeType: 'hexagon' as const,
          width: 90,
          height: 90,
          icon: <Hexagon className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'heptagon',
          label: 'Segitujuh',
          shapeType: 'heptagon' as const,
          width: 90,
          height: 90,
          icon: (
            <div className="w-5 h-5 bg-slate-800 [clip-path:polygon(50%_0%,90%_22%,100%_67%,72%_100%,28%_100%,0%_67%,10%_22%)]" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'octagon',
          label: 'Segidelapan',
          shapeType: 'octagon' as const,
          width: 90,
          height: 90,
          icon: (
            <div className="w-5 h-5 bg-slate-800 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]" />
          ),
          fillColor: '#0f172a'
        }
      ]
    },
    {
      category: 'Bintang & Badge',
      items: [
        {
          id: 'star',
          label: 'Bintang 5',
          shapeType: 'star' as const,
          width: 85,
          height: 85,
          icon: <Star className="w-5 h-5 fill-amber-500 text-amber-500" />,
          fillColor: '#f59e0b'
        },
        {
          id: 'star_4',
          label: 'Bintang 4',
          shapeType: 'star_4' as const,
          width: 85,
          height: 85,
          icon: (
            <svg viewBox="0 0 100 100" className="w-5 h-5" preserveAspectRatio="none">
              <polygon
                points="50,5 62,38 95,50 62,62 50,95 38,62 5,50 38,38"
                fill="#f59e0b"
              />
            </svg>
          ),
          fillColor: '#f59e0b'
        },
        {
          id: 'star_6',
          label: 'Bintang 6',
          shapeType: 'star_6' as const,
          width: 85,
          height: 85,
          icon: (
            <svg viewBox="0 0 100 100" className="w-5 h-5" preserveAspectRatio="none">
              <polygon
                points="50,5 62,28 88,20 75,45 95,65 68,68 50,95 32,68 5,65 25,45 12,20 38,28"
                fill="#f59e0b"
              />
            </svg>
          ),
          fillColor: '#f59e0b'
        },
        {
          id: 'star_8',
          label: 'Bintang 8',
          shapeType: 'star_8' as const,
          width: 85,
          height: 85,
          icon: (
            <svg viewBox="0 0 100 100" className="w-5 h-5" preserveAspectRatio="none">
              <polygon
                points="50,5 60,30 85,15 70,40 95,50 70,60 85,85 60,70 50,95 40,70 15,85 30,60 5,50 30,40 15,15 40,30"
                fill="#f59e0b"
              />
            </svg>
          ),
          fillColor: '#f59e0b'
        },
        {
          id: 'star_burst',
          label: 'Starburst',
          shapeType: 'star_burst' as const,
          width: 95,
          height: 95,
          icon: (
            <svg viewBox="0 0 100 100" className="w-5 h-5" preserveAspectRatio="none">
              <polygon
                points="50,2 57,20 72,9 73,28 90,23 83,40 99,44 87,57 99,69 83,72 89,90 71,83 69,99 54,87 46,99 41,83 23,90 29,72 13,69 25,57 13,44 29,40 22,23 39,28 40,9 55,20"
                fill="#f59e0b"
              />
            </svg>
          ),
          fillColor: '#f59e0b'
        }
      ]
    },
    {
      category: 'Tanda Panah (Arrows)',
      items: [
        {
          id: 'arrow',
          label: 'Panah Kanan',
          shapeType: 'arrow' as const,
          width: 100,
          height: 60,
          icon: <ArrowRight className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'arrow_left',
          label: 'Panah Kiri',
          shapeType: 'arrow_left' as const,
          width: 100,
          height: 60,
          icon: <ArrowLeft className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'arrow_up',
          label: 'Panah Atas',
          shapeType: 'arrow_up' as const,
          width: 60,
          height: 100,
          icon: <ArrowUp className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'arrow_down',
          label: 'Panah Bawah',
          shapeType: 'arrow_down' as const,
          width: 60,
          height: 100,
          icon: <ArrowDown className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'arrow_double_horizontal',
          label: 'Panah Bolak-balik',
          shapeType: 'arrow_double_horizontal' as const,
          width: 110,
          height: 60,
          icon: <ArrowLeftRight className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        }
      ]
    },
    {
      category: 'Bentuk — Diagram Alir & Awan',
      items: [
        {
          id: 'flow_cylinder',
          label: 'Database / Tabung',
          shapeType: 'flow_cylinder' as const,
          width: 90,
          height: 100,
          icon: <Cylinder className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'flow_document',
          label: 'Dokumen',
          shapeType: 'flow_document' as const,
          width: 90,
          height: 95,
          icon: <FileText className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'flow_data',
          label: 'Data Input/Output',
          shapeType: 'flow_data' as const,
          width: 100,
          height: 80,
          icon: <Boxes className="w-5 h-5 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'bookmark_banner',
          label: 'Banner / Bendera',
          shapeType: 'bookmark_banner' as const,
          width: 100,
          height: 80,
          icon: (
            <div className="w-5 h-5 bg-slate-800 [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_75%,0%_100%)]" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'flow_display',
          label: 'Tampilan (Display)',
          shapeType: 'flow_display' as const,
          width: 100,
          height: 80,
          icon: (
            <div className="w-5 h-5 bg-slate-800 [clip-path:polygon(20%_0%,75%_0%,100%_50%,75%_100%,20%_100%,0%_50%)]" />
          ),
          fillColor: '#0f172a'
        },
        {
          id: 'chat_bubble',
          label: 'Balon Bulat',
          shapeType: 'chat_bubble' as const,
          width: 110,
          height: 85,
          icon: <MessageCircle className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'chat_square',
          label: 'Balon Kotak',
          shapeType: 'chat_square' as const,
          width: 110,
          height: 85,
          icon: <MessageSquare className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        },
        {
          id: 'cloud',
          label: 'Awan',
          shapeType: 'cloud' as const,
          width: 110,
          height: 75,
          icon: <Cloud className="w-5 h-5 fill-slate-800 text-slate-800" />,
          fillColor: '#0f172a'
        }
      ]
    },
    {
      category: 'Geometri Kreatif & Dekorasi',
      items: [
        {
          id: 'corner_arc',
          label: 'Lengkungan Sudut',
          shapeType: 'corner_arc' as const,
          width: 150,
          height: 150,
          icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-800">
              <path d="M0,0 L24,0 C24,13.25 13.25,24 0,24 Z" />
            </svg>
          ),
          fillColor: '#3b82f6'
        },
        {
          id: 'blob_organic',
          label: 'Blob Organik',
          shapeType: 'blob_organic' as const,
          width: 140,
          height: 140,
          icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-800">
              <path d="M18.7,5.3 C22,8.6 22.5,14.8 19.6,18.7 C16.8,22.5 10.5,23.5 6.2,21.1 C1.9,18.7 -0.5,12.9 1.4,8.1 C3.3,3.3 10,-0.4 14.8,1.4 C16.7,2.4 17.7,3.8 18.7,5.3 Z" />
            </svg>
          ),
          fillColor: '#ec4899'
        },
        {
          id: 'wave_ribbon',
          label: 'Gelombang Desain',
          shapeType: 'wave_ribbon' as const,
          width: 240,
          height: 100,
          icon: (
            <svg viewBox="0 0 24 12" className="w-5 h-3 fill-slate-800">
              <path d="M0,3.6 C6,8.4 18,-1.2 24,3.6 L24,12 L0,12 Z" />
            </svg>
          ),
          fillColor: '#10b981'
        },
        {
          id: 'badge_ribbon',
          label: 'Pita Badge',
          shapeType: 'badge_ribbon' as const,
          width: 110,
          height: 130,
          icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-800">
              <path d="M3.6,2.4 L20.4,2.4 L20.4,20.4 L12,15.6 L3.6,20.4 Z" />
            </svg>
          ),
          fillColor: '#f59e0b'
        }
      ]
    }
  ];

  const filteredCategories = shapeCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.shapeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h3 className="text-xs font-bold text-slate-900">Bentuk & Objek Grafis</h3>
        <p className="text-[11px] text-slate-500">
          Koleksi lengkap bentuk Canva, garis, poligon, dan diagram alir
        </p>
      </div>

      {/* Search Bar Bentuk */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari bentuk (cth: panah, bintang, awan)..."
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition"
        />
      </div>

      {/* Ring 4 Warna Google Badge */}
      <button
        onClick={() =>
          onAddNewElement('shape', 'Ring 4 Warna Google', 'TAP', {
            shapeType: 'google_ring',
            width: 130,
            height: 130
          })
        }
        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-2.5 shadow-2xs hover:bg-slate-50 transition"
      >
        <div className="w-7 h-7 rounded-full border-2 border-blue-500 border-t-red-500 border-r-amber-400 border-b-emerald-500 shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900">Ring Google 4 Warna</span>
          <span className="text-[10px] text-slate-500 font-normal">Badge lingkaran warna Google</span>
        </div>
      </button>

      {/* Dynamic Shape Categories */}
      {filteredCategories.map((group) => (
        <div key={group.category} className="space-y-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            {group.category}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  onAddNewElement('shape', item.label, undefined, {
                    shapeType: item.shapeType,
                    width: item.width,
                    height: item.height,
                    fillColor: item.fillColor,
                    borderRadius: (item as any).borderRadius,
                    borderWidth: 0
                  })
                }
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-blue-300 border border-slate-200 text-center flex flex-col items-center justify-center gap-1.5 transition active:scale-95 group"
                title={item.label}
              >
                <div className="h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-semibold text-slate-700 truncate max-w-full">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Koleksi Stiker & Icon Vektor Populer */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Stiker & Icon Vektor
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'smartphone', label: 'Ponsel NFC', color: '#4285F4', bg: '#eff6ff' },
            { id: 'radio', label: 'Gelombang NFC', color: '#3b82f6', bg: '#eff6ff' },
            { id: 'wifi', label: 'Wi-Fi Hotspot', color: '#10b981', bg: '#ecfdf5' },
            { id: 'mappin', label: 'Lokasi Maps', color: '#ea4335', bg: '#fef2f2' },
            { id: 'heart', label: 'Love / Favorit', color: '#e11d48', bg: '#fff1f2' },
            { id: 'thumbsup', label: 'Jempol Like', color: '#3b82f6', bg: '#eff6ff' },
            { id: 'share', label: 'Bagikan', color: '#8b5cf6', bg: '#f5f3ff' },
            { id: 'camera', label: 'Scan Kamera', color: '#0f172a', bg: '#f1f5f9' },
            { id: 'chat', label: 'WhatsApp', color: '#22c55e', bg: '#f0fdf4' },
            { id: 'award', label: 'Badge Mutu', color: '#f59e0b', bg: '#fffbeb' },
            { id: 'check', label: 'Centang Verified', color: '#10b981', bg: '#ecfdf5' },
            { id: 'sparkles', label: 'Bintang Sparkle', color: '#f59e0b', bg: '#fffbeb' }
          ].map((item) => {
            const IconComp = getIconStickerComponent(item.id);
            return (
              <button
                key={item.id}
                onClick={() =>
                  onAddNewElement('icon_badge', item.label, '', {
                    width: 50,
                    height: 50,
                    iconName: item.id,
                    iconColor: item.color,
                    badgeBgColor: item.bg,
                    badgeShape: 'circle'
                  })
                }
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex flex-col items-center justify-center gap-1 shadow-2xs hover:bg-slate-50 transition group"
                title={`Tambah icon ${item.label}`}
              >
                <div
                  style={{ backgroundColor: item.bg, color: item.color }}
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform"
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-700 font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Komponen Brand Google & Review */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Komponen Google & Review
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onAddNewElement('nfc_target', 'Touchpoint Chip NFC')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
          >
            <span className="text-base">📡</span>
            Chip NFC Tap
          </button>
          <button
            onClick={() => onAddNewElement('qrcode', 'QR Code Link Review')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
          >
            <span className="text-base">🏁</span>
            QR Code
          </button>
          <button
            onClick={() => onAddNewElement('stars_5', '5 Bintang Emas')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
          >
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            5 Bintang Emas
          </button>
          <button
            onClick={() => onAddNewElement('logo_google', 'Logo Google 4-Warna')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition"
          >
            <span className="text-blue-600 font-bold text-xs">G</span>
            Logo Google Resmi
          </button>
          <button
            onClick={() => onAddNewElement('google_badge_pill', 'Tombol Pill "Review us on Google"')}
            className="col-span-2 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-left text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition"
          >
            <Bookmark className="h-3.5 w-3.5 text-blue-400" />
            Tombol Pill "Review us on Google"
          </button>
          <button
            onClick={() =>
              onAddNewElement('shape', 'Background Lengkungan Google', '', {
                shapeType: 'rounded_rect',
                width: 320,
                height: 100,
                fillColor: '#ffffff',
                borderRadius: 24,
                strokeColor: '#e2e8f0',
                borderWidth: 1
              })
            }
            className="col-span-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-slate-50 transition"
          >
            <span>Kotak Card Putih Review Us</span>
            <span className="text-[10px] text-blue-600 font-bold">+ Tambah</span>
          </button>
        </div>
      </div>

      {/* Data NFC Tag dari Database */}
      {tag && (
        <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-blue-600" /> Data NFC ({tag.id})
            </span>
            <span className="text-[9px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              DB
            </span>
          </div>

          <div className="space-y-1">
            {tag.business_name && (
              <button
                onClick={() =>
                  onAddNewElement('text', `Bisnis: ${tag.business_name}`, tag.business_name || '', {
                    fontWeight: 'bold',
                    fontSize: 16
                  })
                }
                className="w-full p-2 rounded-xl bg-white border border-blue-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-blue-50/30 transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{tag.business_name}</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold shrink-0">+ Masukkan</span>
              </button>
            )}

            {tag.hub_config?.tagline && (
              <button
                onClick={() =>
                  onAddNewElement('text', `Tagline: ${tag.hub_config?.tagline}`, tag.hub_config?.tagline || '', {
                    fontWeight: 'normal',
                    fontSize: 12
                  })
                }
                className="w-full p-2 rounded-xl bg-white border border-blue-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-blue-50/30 transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{tag.hub_config.tagline}</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold shrink-0">+ Masukkan</span>
              </button>
            )}

            {tag.hub_config?.wifi_ssid && (
              <button
                onClick={() =>
                  onAddNewElement(
                    'text',
                    `Wi-Fi: ${tag.hub_config?.wifi_ssid}`,
                    `Wi-Fi: ${tag.hub_config?.wifi_ssid}${tag.hub_config?.wifi_pass ? ` (Pass: ${tag.hub_config.wifi_pass})` : ''}`,
                    { fontSize: 11 }
                  )
                }
                className="w-full p-2 rounded-xl bg-white border border-blue-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center justify-between shadow-2xs hover:bg-blue-50/30 transition"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Wifi className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Wi-Fi: {tag.hub_config.wifi_ssid}</span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold shrink-0">+ Masukkan</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
