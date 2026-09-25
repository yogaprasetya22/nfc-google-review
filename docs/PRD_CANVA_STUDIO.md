# Product Requirements Document (PRD)
## Canva-Style NFC Review Studio v2.0

### 1. User Journey & Feature Specifications

#### 1.1 Canva-Style Left Dock & Flyout Drawers
- **Left Dock (68px width)**:
  - Tombol vertikal: `Template`, `Elemen`, `Teks`, `Unggahan`, `Lapisan`.
  - Dilengkapi indikator aktif dengan aksen biru/putih dan efek hover halus.
- **Drawer Panels (280px - 320px width)**:
  - **Template Drawer**: Katalog kartu (Lengkungan Hitam Elegan, Modern Wave, Bintang Emas Vertikal, Frame 4 Warna Google, Circle Ring Google, dan Backside QR Focus).
  - **Elements Drawer**:
    - *Bentuk Dasar*: Kotak, Kotak Lengkung, Lingkaran, Segitiga, Segi-enam (Hexagon), Bintang, Panah, Chat Bubble, Garis Pembatas.
    - *Elemen Brand*: Ring Google 4 Warna, 5 Bintang Emas, Logo G Google, Tombol Pill CTA.
    - *Data NFC Tag*: Tombol instan memasukkan nama bisnis, tagline, wifi credentials, tag ID.
  - **Text Drawer**:
    - *Tambahkan judul* (H1 / 22px / font-black).
    - *Tambahkan subjudul* (H2 / 16px / font-bold).
    - *Tambahkan sedikit teks isi* (Body / 12px / text-slate-500).
    - Kombinasi font preset modern.
  - **Uploads Drawer**: Unggah gambar logo merchant, foto produk, atau latar belakang khusus.
  - **Layers Drawer**: Manajemen tumpukan z-index lapisan visual kartu, toggle hide/show, dan tombol hapus.

#### 1.2 Interactive Canvas Artboard
- **Drag & Drop Freeform**: Pergerakan objek mulus via Pointer Events.
- **Magnetic Snap Alignment**:
  - Center Y & Center X (Pink guide lines).
  - Symmetrical wall margin pill indicator (e.g. L: 45px | R: 45px).
  - Alignment sesama elemen horizontal & vertikal.
- **Object Controls**: Bounding box seleksi dengan 4 anchor corners dan badge posisi real-time.

#### 1.3 Contextual Top Floating Bar / Right Inspector
- **Text Controls**: Font size input, color picker, bold/italic, alignment (left/center/right).
- **Shape Controls**: Fill color, stroke border color, border width slider, corner radius slider.
- **Transform**: Tombol hapus objek, kunci posisi (lock), dan atur transparansi/opacity.

#### 1.4 Dual-Side Card Switching & Database Persistence
- Tombol toggle `Sisi Depan` dan `Sisi Belakang` di header.
- Undo (Ctrl+Z) dan Redo (Ctrl+Y) independen untuk tiap sisi kartu.
- Tombol **"Simpan Desain"**: Menyimpan JSON terstruktur ke `nfc_tags.hub_config.card_design` via Supabase.
- Tombol **"Download PNG"**: Dropdown download Sisi Depan, Sisi Belakang, atau Keduanya sekaligus dalam resolusi cetak 2x.
