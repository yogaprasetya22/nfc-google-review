# 🧹 Roadmap & Checklist Pembersihan Kode (Refactoring Plan)
> **Tujuan**: Menghilangkan duplikasi kode (DRY), merampingkan komponen berukuran raksasa (*god components*), dan menyatukan logika pencarian lokasi Google Maps ke dalam satu Single Source of Truth tanpa merusak fungsi aplikasi yang sudah berjalan.

---

## 📋 Ringkasan Masalah Saat Ini

| Area | Masalah Utama | Lokasi Terkait | Tingkat Urgensi |
| :--- | :--- | :--- | :--- |
| **Duplikasi UI Search** | Blok UI dropdown panel biru (`Cari Lokasi Bisnis`) di-copy-paste mentah di 3 file | `LinkCardsEditor.tsx`, `TagActivationWizard.tsx`, `GoogleReviewUrlInput.tsx` | 🔴 **Tinggi** |
| **Duplikasi Fetch API** | Panggilan `Promise.allSettled(Photon + Nominatim + Places)` ditulis ulang 3x | `usePlaceAutocomplete.ts`, `LinkCardsEditor.tsx`, `PublicHandler.tsx` | 🔴 **Tinggi** |
| **God Component** | File terlalu panjang, mencampur banyak tanggung jawab (Auth, Upload, State, Reply) | `src/pages/ManageTag.tsx` (1.226 baris) | 🟡 **Sedang** |
| **Penyimpanan Sesi PIN** | State PIN terpecah antara `localStorage` dan form state | `ManageTag.tsx` | 🟢 **Selesai (Sudah di-patch)** |

---

## 🎯 Langkah Kerja Refactoring (Step-by-Step)

### Phase 1: Konsolidasi Komponen Input Google Review (Single Source of Truth)
- [ ] **Jadikan `GoogleReviewUrlInput.tsx` sebagai satu-satunya UI Input Maps**
  - Pastikan komponen menerima props yang fleksibel:
    ```tsx
    interface GoogleReviewUrlInputProps {
      value: string;
      onChange: (url: string, detectedName?: string) => void;
      label?: string;
      placeholder?: string;
      autoExtractBusinessName?: boolean;
      className?: string;
      showWriteReviewBadge?: boolean;
    }
    ```
- [ ] **Refactor `LinkCardsEditor.tsx`**:
  - Hapus state duplikat: `searchQuery`, `suggestions`, `isSearching`, `activeSearchIdx`.
  - Hapus blok JSX dropdown pencarian manual baris 515–605.
  - Ganti dengan pemanggilan:
    ```tsx
    <GoogleReviewUrlInput
      value={link.url}
      onChange={(newUrl) => onLinkChange(idx, 'url', newUrl)}
      label="Tautan Ulasan Google Maps:"
      placeholder="https://... atau paste link Google Maps"
    />
    ```
- [ ] **Refactor `TagActivationWizard.tsx`**:
  - Hapus blok manual panel pencarian baris 220–330.
  - Gunakan `GoogleReviewUrlInput` yang sama untuk mode `DIRECT_REVIEW`.

---

### Phase 2: Sentralisasi Logika Autocomplete ke Hook
- [ ] **Gunakan `usePlaceAutocomplete(query)` secara universal**
  - Hapus `useEffect` fetch Photon/Nominatim manual di:
    - `src/components/hub/LinkCardsEditor.tsx`
    - `src/pages/PublicHandler.tsx`
  - Seluruh pengambilan data saran wajib mengalir melalui hook tunggal `src/hooks/usePlaceAutocomplete.ts`.
- [ ] **Pembersihan Tipe Data**:
  - Ekspor `PlaceSuggestion` dari satu file tipe resmi (`src/types/nfc.ts` atau `src/types/wizard.ts`), jangan redeclare interface di tiap file komponen.

---

### Phase 3: Pemecahan `ManageTag.tsx` (Modularisasi God Component)
Saat ini `ManageTag.tsx` berukuran 1.226 baris. Pecah menjadi sub-komponen terisolasi di folder `src/components/manage/`:
- [ ] `TagPinLoginCard.tsx`: Form login verifikasi PIN awal (saat `!isAuthenticated`).
- [ ] `DirectReviewSettings.tsx`: Pengaturan nama bisnis & GoogleReviewUrlInput untuk mode `DIRECT_REVIEW`.
- [ ] `TableHubBrandSettings.tsx`: Input Avatar, Cover, Tagline, dan Bio toko.
- [ ] `TableHubSocialWifiSettings.tsx`: Input Wi-Fi SSID/Pass, Instagram, TikTok, WhatsApp, YouTube.
- [ ] `TableHubFeedbackManager.tsx`: Dialog dan list masukan pengunjung + form balas pesan admin.

---

### Phase 4: Audit & Sanity Testing
- [ ] Jalankan `npm run lint` (`oxlint`).
- [ ] Jalankan `npm run build` (`tsc -b && vite build`) untuk memastikan 0 error tipe TypeScript.
- [ ] Uji skenario fungsional:
  1. Paste link Google Maps panjang (Hex CID).
  2. Paste link Google Maps pendek (`maps.app.goo.gl`).
  3. Ketik nama toko di search bar (misal: "Rengginang Mpo Era", "Warbaca") → pilih opsi ulasan bintang 5.
  4. Simpan konfigurasi di CMS Meja.

---

## 💡 Estimasi Penghematan Kode
- Mengurangi **± 350 baris** kode duplikat.
- Mengurangi ukuran `ManageTag.tsx` dari **1.226 baris** menjadi **~350 baris**.
- Maintenance styling pencarian Maps di masa depan hanya perlu dilakukan di **1 file**.
