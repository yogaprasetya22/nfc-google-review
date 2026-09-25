import { z } from 'zod';

export const CanvasElementSchema = z.object({
  id: z.string(),
  type: z.enum([
    'qrcode',
    'nfc_target',
    'text',
    'logo_google',
    'stars_5',
    'google_badge_pill',
    'shape',
    'image',
    'template_bg',
    'icon_badge'
  ]),
  label: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().positive(),
  height: z.number().positive(),
  visible: z.boolean().optional().default(true),
  locked: z.boolean().optional().default(false),
  opacity: z.number().min(0).max(100).optional().default(100),
  rotation: z.number().optional().default(0),

  // Icon Badge Properties
  iconName: z.string().optional(),
  badgeBgColor: z.string().optional(),
  iconColor: z.string().optional(),
  badgeShape: z.enum(['circle', 'rounded', 'square', 'none']).optional(),

  // Template Background Properties
  bgVariant: z.enum([
    'wave',
    'black_curve',
    'frame_quad',
    'badge_circle',
    'qr_focus',
    'multicolor_pop',
    'corner_curves'
  ]).optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),

  // Text Properties
  content: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  textColor: z.string().optional(),
  fontWeight: z.enum(['normal', 'bold', 'black']).optional(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  textDecoration: z.enum(['none', 'underline']).optional(),

  // Shape & Border Properties
  shapeType: z.enum([
    // Basic Shapes
    'rect',
    'rounded_rect',
    'circle',
    'triangle',
    'diamond',
    'trapezoid',
    'parallelogram',
    'capsule',
    'shield',
    'heart',

    // Polygons
    'pentagon',
    'hexagon',
    'heptagon',
    'octagon',

    // Stars & Bursts
    'star',
    'star_4',
    'star_6',
    'star_8',
    'star_burst',

    // Lines & Connectors
    'line',
    'line_dashed',
    'line_arrow_right',
    'line_arrow_double',

    // Arrows
    'arrow',
    'arrow_left',
    'arrow_up',
    'arrow_down',
    'arrow_double_horizontal',

    // Flowchart / Diagram Alir
    'flow_cylinder',
    'flow_document',
    'flow_data',
    'flow_decision',
    'flow_display',
    'bookmark_banner',

    // Callouts & Clouds
    'chat_bubble',
    'chat_square',
    'cloud',

    // Desain Geometris Tambahan (Layouting & Background Elements)
    'corner_arc',
    'blob_organic',
    'wave_ribbon',
    'badge_ribbon',

    // Special
    'google_ring'
  ]).optional(),
  fillColor: z.string().optional(),
  strokeColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderRadius: z.number().optional(),
  svgContent: z.string().optional(), // Exact SVG string from icon or shape

  // Image/Upload Properties
  imageUrl: z.string().optional()
});

export type CanvasElement = z.input<typeof CanvasElementSchema>;

export type CanvaDockTab = 'templates' | 'elements' | 'text' | 'uploads' | 'layers';

export type TemplateType =
  | 'google_modern_wave'
  | 'google_black_curve'
  | 'google_stars_vertical'
  | 'google_frame_quad'
  | 'google_badge_circle'
  | 'google_back_qr_focus'
  | 'google_multicolor_pop'
  | 'google_clean_cards'
  | 'minimalist'
  | (string & {});

export type CardSide = 'front' | 'back';

export type CardPreset = 'square' | 'card_v' | 'card_h';

export interface DimensionInfo {
  width: number;
  height: number;
  name: string;
}

export const DIMENSIONS_MAP: Record<CardPreset, DimensionInfo> = {
  square: { width: 520, height: 520, name: 'Stiker Kotak / Standee Meja (1:1)' },
  card_v: { width: 420, height: 650, name: 'Kartu Vertikal (Badge Akrilik)' },
  card_h: { width: 680, height: 428, name: 'Kartu Horizontal (NFC Card 85x54mm)' }
};

export interface CustomTemplate {
  id: string;
  title: string;
  preset: CardPreset;
  elements: CanvasElement[];
  thumbnail_url?: string | null;
  description?: string;
  category?: 'official' | 'custom';
  is_starter?: boolean;
  created_at?: string;
}
