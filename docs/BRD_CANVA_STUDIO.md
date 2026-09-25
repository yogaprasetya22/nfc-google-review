# Business Requirements Document (BRD)
## NFC Google Review Card Design Studio (Canva-Grade Refactor)

### 1. Executive Summary & Business Objective
Produk NFC Google Review Card dan Table Hub membutuhkan media pencetakan fisik presisi tinggi dan fleksibel untuk para pemilik bisnis UMKM, kafe, restoran, dan hotel. Saat ini, Tag Design Studio masih berbentuk monolitik satu file (`TagDesignStudio.tsx` > 1,100 baris) dengan panel elemen dasar.
**Tujuan Bisnis**:
- Menghadirkan pengalaman mendesain kartu standee dan stiker NFC kelas profesional (*Canva-grade experience*) langsung di peramban web tanpa memerlukan software pihak ketiga seperti Adobe Illustrator atau Canva eksternal.
- Mengurangi biaya & waktu pembuatan desain fisik tag NFC bagi admin dan merchant.
- Menjamin konsistensi merek Google Review dan QR Code akurat yang terintegrasi langsung dengan database Supabase.

---

### 2. Stakeholders & Target Audience
1. **Admin / Operasional Jagres NFC**: Mencetak batch kartu standee meja, stiker akrilik, dan kartu dua sisi untuk klien merchant.
2. **Merchant / Pemilik Bisnis**: Mengkustomisasi nama usaha, logo Google, font headline, bintang ulasan, bentuk hiasan, dan tata letak depan-belakang kartu secara mandiri.
3. **End-User (Pengunjung Kafe/Restoran)**: Memperoleh kejelasan interaksi visual tap NFC / scan QR code yang estetis dan informatif.

---

### 3. Business Scope & Core Value Propositions
- **Canva Two-Tier Navigation Dock**:
  - Kolom navigasi vertikal ramping (Dock) dengan tab: *Template*, *Elemen*, *Teks*, *Unggahan (Uploads)*, dan *Lapisan (Layers)*.
  - Flyout panel drawer kontekstual dengan pencarian, preset typography (H1, H2, Body), dan aneka ragam bentuk vektor/shape.
- **Two-Sided Precision Workflow**:
  - Manajemen independen untuk Sisi Depan (*Front*) dan Sisi Belakang (*Back*).
  - Export satu klik 2-file PNG Resolusi Tinggi (300 DPI / 2x scale) siap cetak mesin UV flatbed / thermal printer.
- **Database-First Continuity**:
  - Semua konfigurasi desain disimpan secara aman di PostgreSQL Supabase (`nfc_tags.hub_config.card_design`).
  - Sinkronisasi real-time instan ke dashboard utama tanpa reload halaman.

---

### 4. Key Performance Indicators (KPIs)
- **Time-to-Design**: Mengurangi waktu pembuatan desain kartu dari 15 menit ke bawah 2 menit.
- **Zero Print Error**: QR Code dan target NFC selalu berada pada jarak dinding simetris presisi dengan panduan garis magnetis (*magnetic smart snap*).
- **Code Maintainability**: Mengurangi kompleksitas file monolitik dari 1,155 baris menjadi komponen modular terpisah di bawah 150 baris per file dengan Zustand store dan Zod schema validation.
