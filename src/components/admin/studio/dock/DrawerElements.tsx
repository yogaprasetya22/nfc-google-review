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

      {/* Komponen Brand Google Review */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
          Komponen Google
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onAddNewElement('stars_5', '5 Bintang Emas')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            5 Bintang
          </button>
          <button
            onClick={() => onAddNewElement('logo_google', 'Badge Logo Google')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <span className="text-blue-600 font-bold text-xs">G</span>
            Logo Google
          </button>
          <button
            onClick={() => onAddNewElement('google_badge_pill', 'Tombol CTA Review')}
            className="col-span-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-left text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Bookmark className="h-3.5 w-3.5 text-blue-600" />
            Tombol Pill "Review us on Google"
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
