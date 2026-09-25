/**
 * Reset & Seed Script (Ponytail Mode)
 * Membersihkan database ke kondisi awal (fresh install)
 * dan memasukkan 3 template seed awal bersih tanpa storage lama.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mhdvguqxdfuberlpbxjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NGwWw2AiuGzp85l4Ui_dGQ_I24zjbte';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_SEEDS = [
  {
    id: 'TAG-DEMO1',
    type: 'TABLE_HUB',
    business_name: 'Kopi Kenangan - Sudirman Hub',
    google_place_id: 'ChIJz2xY73P1aS4R1sU529mD4o4',
    is_active: true,
    total_taps: 0,
    hub_config: {
      tagline: 'Nikmati Kopi Terbaik Hari Ini',
      bio: 'Scan untuk ulasan Google, daftar menu digital, dan akses WiFi instan.',
      avatar_url: '',
      cover_url: '',
      menu_url: '',
      wifi_ssid: 'KopiKenangan_Guest',
      wifi_pass: 'ngopidulu123',
      instagram: 'kopikenangan.id',
      whatsapp: '6281234567890',
      custom_links: [],
      feedbacks: []
    }
  },
  {
    id: 'TAG-DEMO2',
    type: 'DIRECT_REVIEW',
    business_name: 'Resto Padang Sederhana',
    google_place_id: '',
    is_active: true,
    total_taps: 0,
    hub_config: {
      tagline: 'Masakan Minang Asli & Higienis',
      bio: '',
      avatar_url: '',
      cover_url: '',
      custom_links: [],
      feedbacks: []
    }
  },
  {
    id: 'TAG-BLANK',
    type: 'TABLE_HUB',
    business_name: null,
    google_place_id: null,
    is_active: false,
    total_taps: 0,
    hub_config: {
      tagline: 'Smart NFC Standee',
      bio: '',
      avatar_url: '',
      cover_url: '',
      custom_links: [],
      feedbacks: []
    }
  }
];

async function seedFresh() {
  console.log('🔄 Memulai Reset & Seeder dari 0 (Clean Slate)...');

  // 1. Ambil semua tag yang ada saat ini
  const { data: existingTags, error: fetchErr } = await supabase
    .from('nfc_tags')
    .select('id');

  if (fetchErr) {
    console.error('❌ Gagal membaca tag:', fetchErr.message);
    process.exit(1);
  }

  // 2. Hapus data nfc_tags lama
  if (existingTags && existingTags.length > 0) {
    const ids = existingTags.map((t) => t.id);
    console.log(`🗑️ Menghapus ${ids.length} tag lama:`, ids.join(', '));
    const { error: delErr } = await supabase
      .from('nfc_tags')
      .delete()
      .in('id', ids);

    if (delErr) {
      console.error('❌ Gagal menghapus tag:', delErr.message);
      process.exit(1);
    }
  }

  // 3. Masukkan seed bersih
  console.log('🌱 Menanam data seed awal...');
  const { data: inserted, error: insertErr } = await supabase
    .from('nfc_tags')
    .insert(INITIAL_SEEDS)
    .select();

  if (insertErr) {
    console.error('❌ Gagal insert seed:', insertErr.message);
    process.exit(1);
  }

  console.log('✅ Seeder berhasil! Total tag aktif sekarang:', inserted.length);
  inserted.forEach((t) => console.log(`   - ${t.id} [${t.type}] : ${t.business_name || '(Belum Terisi)'}`));
}

seedFresh();
