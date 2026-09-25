# Actionable Implementation Todo List
## Canva-Style Studio Refactor & Optimization

- [x] **Phase 1: Types & Zod Contract**
  - [x] Implement `src/components/admin/studio/types.ts` with `CanvasElementSchema` (Zod) and `CanvaDockTab`.
  - [x] Support shape types (`arrow`, `star`, `hexagon`, `chat_bubble`, etc.) and `image`.

- [x] **Phase 2: Zustand Store Architecture**
  - [x] Create `src/components/admin/studio/useCardStudioStore.ts`.
  - [x] Implement dual-side state (`front` & `back`) with undo/redo stack.
  - [x] Implement element CRUD actions (`addElement`, `updateElement`, `deleteElement`).
  - [x] Implement Supabase persistence action (`saveToDatabase`).

- [x] **Phase 3: Component Decomposition (Ponytail Clean Modularization)**
  - [x] Build 2-Tier Canva Dock Navigation:
    - [x] `src/components/admin/studio/dock/CanvaDock.tsx` (72px vertical bar with icons).
    - [x] `src/components/admin/studio/dock/DrawerTemplates.tsx`.
    - [x] `src/components/admin/studio/dock/DrawerElements.tsx` (Shapes & Brand badges).
    - [x] `src/components/admin/studio/dock/DrawerText.tsx` (H1, H2, Body presets).
    - [x] `src/components/admin/studio/dock/DrawerUploads.tsx` (Custom merchant images).
    - [x] `src/components/admin/studio/dock/DrawerLayers.tsx` (Layer visibility).
  - [x] Build Modular Renderers:
    - [x] `src/components/admin/studio/elements/ShapeRenderer.tsx`.
    - [x] `src/components/admin/studio/elements/TextRenderer.tsx`.
    - [x] `src/components/admin/studio/elements/CanvasElementRenderer.tsx`.
  - [x] Extract Canvas Export:
    - [x] `src/components/admin/studio/exportCanvas.ts`.

- [x] **Phase 4: Shell Refactor & Integration**
  - [x] Refactor `TagDesignStudio.tsx` from 1,155 lines down to a clean, declarative coordinator.
  - [x] Verify HTML5 canvas high-resolution print export (both sides).
  - [x] Verify instant sync with `TagCardPreview.tsx` on Dashboard.

- [x] **Phase 5: Verification & Build Check**
  - [x] Run `bun run build` — exit code 0, 0 TypeScript errors.
  - [x] Tested and verified running seamlessly on `http://localhost:5173/dashboard`.

- [x] **Phase 6: Direct Canvas Interactions (Canva-Style Handles & Inspector)**
  - [x] Click element on canvas activates right inspector immediately.
  - [x] Interactive corner handles (TL, TR, BL, BR) with smooth pointer resize.
  - [x] Interactive top rotation handle with stem & degree snapping (0°, 45°, 90°, 180°).
  - [x] Inspector color swatches & degree slider synchronized live.
  - [x] High-res export and miniature previews reflect exact rotation and scaling.

- [x] **Phase 7: Canva-Style Floating Action Pill & Lock/Unlock Mechanism**
  - [x] Floating action pill directly above active element on canvas with Lock/Unlock button.
  - [x] When locked: element selection turns amber, drag/resize/rotate handles are disabled to protect precision placement.
  - [x] Quick unlock button right on the canvas floating pill or in the right inspector header.
  - [x] Trash shortcut integrated in the floating pill for fast deletion.

- [x] **Phase 8: Direct In-Canvas Text Editing (Inline Typewriter ala Canva)**
  - [x] Double-click text element directly on canvas to enter inline edit mode with auto-focus & select.
  - [x] Quick "Tulis" action button in the floating pill for fast one-tap editing.
  - [x] Real-time live update while typing with auto-blur and `Esc` shortcut to save changes.

- [x] **Phase 9: Photoshop-Style Layer Hierarchy & Z-Index Control**
  - [x] Natural Photoshop hierarchy: Item teratas di panel lapisan = Lapisan paling depan di kanvas.
  - [x] Badges status "Depan" (Topmost) & "Dasar" (Bottommost) dengan nomor urut lapisan (#1, #2, dst).
  - [x] Quick action reorder buttons: Bawa ke Paling Depan, Maju 1 Tingkat, Mundur 1 Tingkat, Kirim ke Paling Belakang.
  - [x] Kontrol Z-Index tersedia ganda di drawer **Susunan Lapisan** (Dock Kiri) dan di inspector **StudioSidebarRight**.

- [x] **Phase 10: Font Style & Google Font Picker Integration (`react-fontpicker-ts`)**
  - [x] Terpasang `react-fontpicker-ts` via bun.
  - [x] Google Font Picker interaktif di panel teks (mendukung kategori sans-serif, serif, display, handwriting, monospace).
  - [x] Tombol pintas gaya teks Miring (*Italic*), ketebalan font (*weight*), dan perataan (*alignment*).
  - [x] Font diterapkan secara realtime di Kanvas Studio, Dashboard Card Preview, dan ekspor cetak PNG.
