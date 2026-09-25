# Technical Specifications Document (TSD)
## Modular Architecture & State Refactoring

### 1. Data Contract (Zod Validation)
Data canvas divalidasi ketat menggunakan pustaka `zod`:
```ts
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
    'image'
  ]),
  label: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().positive(),
  height: z.number().positive(),
  visible: z.boolean().default(true),
  locked: z.boolean().optional().default(false),
  opacity: z.number().min(0).max(100).optional().default(100),
  
  // Text
  content: z.string().optional(),
  fontSize: z.number().optional(),
  textColor: z.string().optional(),
  fontWeight: z.enum(['normal', 'bold', 'black']).optional(),
  fontStyle: z.enum(['normal', 'italic']).optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  
  // Shape
  shapeType: z.enum([
    'circle',
    'rect',
    'rounded_rect',
    'line',
    'arrow',
    'star',
    'hexagon',
    'chat_bubble',
    'google_ring'
  ]).optional(),
  fillColor: z.string().optional(),
  strokeColor: z.string().optional(),
  borderWidth: z.number().optional(),
  borderRadius: z.number().optional(),

  // Image/Upload
  imageUrl: z.string().optional()
});

export type CanvasElement = z.infer<typeof CanvasElementSchema>;
```

---

### 2. State Management (Zustand Store)
Untuk menghilangkan file monolitik 1,155 baris, state dipindahkan ke `useCardStudioStore`:
- **State Slice**:
  - `activeSide: 'front' | 'back'`
  - `cardPreset: 'square' | 'card_v' | 'card_h'`
  - `selectedElementId: string | null`
  - `activeTab: CanvaDockTab`
  - `frontElements: CanvasElement[]` & history stack undo/redo
  - `backElements: CanvasElement[]` & history stack undo/redo
  - `zoomScale`, `snapEnabled`, `showGuides`, `activeGuides`
  - `isSaving: boolean`
- **Actions Slice**:
  - `setSide(side: CardSide)`
  - `setActiveTab(tab: CanvaDockTab)`
  - `addElement(type, label, customContent?, options?)`
  - `updateElement(id, partialProps)`
  - `deleteElement(id)`
  - `reorderElements(fromIndex, toIndex)`
  - `applyTemplate(templateId)`
  - `undo()`, `redo()`
  - `saveToDatabase(tagId)`

---

### 3. Component Decomposition Hierarchy (< 150 Lines per File)
```
src/components/admin/studio/
├── types.ts                      # Zod schema + TypeScript types
├── useCardStudioStore.ts         # Zustand store + history undo/redo
├── TagDesignStudio.tsx           # Shell wrapper (< 90 lines)
├── StudioHeader.tsx              # Top app bar (preset, sides, undo/redo, save, export)
├── StudioArtboard.tsx            # Artboard canvas container + snap guidelines
├── elements/
│   ├── CanvasElementRenderer.tsx # Switch renderer per element type
│   ├── ShapeRenderer.tsx         # SVG & CSS shapes (Circle, Hexagon, Star, Arrow, Ring)
│   └── TextRenderer.tsx          # Dynamic responsive text with line-height & weight
├── dock/
│   ├── CanvaDock.tsx             # 68px vertical icon sidebar
│   ├── DrawerTemplates.tsx       # Template selector list
│   ├── DrawerElements.tsx        # Shapes & NFC data widgets
│   ├── DrawerText.tsx            # Typography presets (H1, H2, Body)
│   ├── DrawerUploads.tsx         # File upload manager
│   └── DrawerLayers.tsx          # Reorderable z-index layer stack
└── inspector/
    ├── StudioInspector.tsx       # Right side properties inspector
    ├── TextInspector.tsx         # Font styling controls
    └── ShapeInspector.tsx        # Fill, stroke, and radius controls
```

---

### 4. Database Schema Compatibility
Menyimpan langsung ke kolom JSONB `nfc_tags.hub_config`:
```json
{
  "card_design": {
    "preset": "square",
    "front": {
      "template": "google_black_curve",
      "elements": [...],
      "bgImage": null
    },
    "back": {
      "template": "google_back_qr_focus",
      "elements": [...],
      "bgImage": null
    },
    "updated_at": "2026-09-25T11:00:00Z"
  }
}
```
Tidak membutuhkan migrasi skema SQL karena kompatibel 100% dengan `hub_config` yang sudah ada.
