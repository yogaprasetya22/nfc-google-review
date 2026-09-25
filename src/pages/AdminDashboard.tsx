import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { NfcTagEntity } from '@/types/nfc';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Lock, LogOut, User, KeyRound, LayoutGrid, ListFilter, Palette, Sparkles, Smartphone, Square, CreditCard, Layout } from 'lucide-react';
import { toast } from 'sonner';

import { MetricCards } from '@/components/admin/MetricCards';
import { TagTable } from '@/components/admin/TagTable';
import { TagDesignStudio } from '@/components/admin/TagDesignStudio';
import { TagCardPreview } from '@/components/admin/TagCardPreview';
import { EditTagModal } from '@/components/admin/EditTagModal';
import type { ProductType } from '@/types/nfc';
import type { CustomTemplate } from '@/components/admin/studio/types';
import { loadExternalStarterTemplates, DEFAULT_BLANK_ELEMENTS } from '@/components/admin/studio/starterTemplates';

// Durasi sesi login admin: 30 hari (dalam milidetik)
const ADMIN_SESSION_KEY = 'admin_auth_session';
const ADMIN_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!stored) {
        // Cek apakah ada sesi lama di sessionStorage (akan dimigrasi via useEffect)
        if (sessionStorage.getItem('admin_logged_in') === 'true') {
          return true;
        }
        return false;
      }
      const parsed = JSON.parse(stored);
      if (parsed?.loggedIn && typeof parsed?.expiresAt === 'number') {
        if (Date.now() < parsed.expiresAt) {
          return true;
        } else {
          // Sesi sudah kadaluarsa — cleanup dilakukan via useEffect
          return false;
        }
      }
    } catch {
      // Cleanup dilakukan via useEffect
    }
    return false;
  });

  // Migrasi & cleanup localStorage — harus di useEffect, bukan di useState initializer
  // (React 19 melarang side-effects di dalam lazy useState initializer → Error #310)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!stored) {
        // Migrasi dari sessionStorage lama ke localStorage
        if (sessionStorage.getItem('admin_logged_in') === 'true') {
          const expiryTime = Date.now() + ADMIN_SESSION_DURATION_MS;
          localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ loggedIn: true, expiresAt: expiryTime }));
          sessionStorage.removeItem('admin_logged_in');
        }
      } else {
        const parsed = JSON.parse(stored);
        if (parsed?.loggedIn && typeof parsed?.expiresAt === 'number') {
          if (Date.now() >= parsed.expiresAt) {
            localStorage.removeItem(ADMIN_SESSION_KEY);
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [tags, setTags] = useState<NfcTagEntity[]>([]);
  const [totalTaps, setTotalTaps] = useState<number>(0);
  const [newTagId, setNewTagId] = useState('');
  const [loading, setLoading] = useState(false);
  const [designingTag, setDesigningTag] = useState<NfcTagEntity | null>(null);
  const [editingTag, setEditingTag] = useState<NfcTagEntity | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
    }
  }, [isAuthenticated]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim() === 'jagres' && password === 'Kontolodon123!') {
      setIsAuthenticated(true);
      const expiryTime = Date.now() + ADMIN_SESSION_DURATION_MS;
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        loggedIn: true,
        expiresAt: expiryTime,
        user: 'jagres',
        loginAt: new Date().toISOString()
      }));
      toast.success('Selamat datang, Admin Jagres! Sesi login aktif selama 1 bulan.');
    } else {
      toast.error('Username atau kata sandi admin salah.');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem('admin_logged_in');
    toast.info('Berhasil keluar dari dashboard.');
  }

  async function fetchMetrics() {
    setLoading(true);

    const { data: tagList, error } = await supabase
      .from('nfc_tags')
      .select('id, type, business_name, google_place_id, is_active, total_taps, hub_config, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil data: ' + error.message);
    }

    const list = (tagList as NfcTagEntity[]) || [];
    setTags(list);
    
    const aggregateTaps = list.reduce((sum, item) => sum + (Number(item.total_taps) || 0), 0);
    setTotalTaps(aggregateTaps);
    
    setLoading(false);
  }

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagId.trim()) return;

    const formattedId = newTagId.trim().toUpperCase();
    const { error } = await supabase
      .from('nfc_tags')
      .insert([{ id: formattedId, is_active: false }]);

    if (!error) {
      toast.success(`Tag ${formattedId} berhasil didaftarkan!`);
      setNewTagId('');
      fetchMetrics();
    } else {
      if (error.code === '23505') {
        toast.error(`Tag ID "${formattedId}" sudah pernah didaftarkan sebelumnya.`);
      } else {
        toast.error(`Error (${error.code || 'DB'}): ${error.message}`);
      }
    }
  }

  // Edit/Ganti ID Tag dari Admin
  async function handleUpdateTagId(oldId: string, newId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('nfc_tags')
        .update({ id: newId })
        .eq('id', oldId);

      if (error) {
        if (error.code === '23505') {
          toast.error(`ID "${newId}" sudah digunakan oleh tag lain.`);
        } else {
          toast.error(`Gagal mengubah ID: ${error.message}`);
        }
        return false;
      }

      toast.success(`ID Tag berhasil diubah dari ${oldId} menjadi ${newId}`);
      fetchMetrics();
      return true;
    } catch (err: any) {
      toast.error('Terjadi kesalahan saat mengubah ID.');
      return false;
    }
  }

  // Edit Detail Tag: ID, Business Name, PIN
  async function handleSaveTagDetails(payload: {
    oldId: string;
    newId: string;
    businessName: string;
    newPin?: string;
  }): Promise<boolean> {
    try {
      const { oldId, newId, businessName, newPin } = payload;

      // 1. Jika ada perubahan ID Tag, ubah ID terlebih dahulu
      let targetId = oldId;
      if (newId !== oldId) {
        const { error: renameError } = await supabase
          .from('nfc_tags')
          .update({ id: newId })
          .eq('id', oldId);

        if (renameError) {
          if (renameError.code === '23505') {
            toast.error(`ID "${newId}" sudah digunakan oleh tag lain.`);
          } else {
            toast.error(`Gagal mengganti ID: ${renameError.message}`);
          }
          return false;
        }
        targetId = newId;
      }

      // 2. Siapkan update payload untuk kolom nfc_tags
      const targetTag = tags.find((t) => t.id === oldId);
      const updateData: any = {
        business_name: businessName || null,
        updated_at: new Date().toISOString()
      };

      // Jika ada update PIN baru dari admin
      if (newPin) {
        if (!targetTag?.is_active) {
          // Jika belum aktif, aktifkan langsung dengan activate_nfc_tag
          await supabase.rpc('activate_nfc_tag', {
            p_tag_id: targetId,
            p_type: targetTag?.type || 'TABLE_HUB',
            p_business_name: businessName || 'Bisnis Baru',
            p_place_id: targetTag?.google_place_id || `NAME-${encodeURIComponent(businessName || targetId)}`,
            p_pin: newPin
          });
        } else {
          // Panggil rpc admin_set_tag_pin untuk hash PIN baru dengan bcrypt
          const { data: pinUpdated, error: pinError } = await supabase.rpc('admin_set_tag_pin', {
            p_tag_id: targetId,
            p_new_pin: newPin
          });
          if (pinError) {
            toast.error('Gagal mengubah PIN: ' + pinError.message);
            return false;
          }
          if (!pinUpdated) {
            toast.error('Tag ID tidak ditemukan saat mengubah PIN.');
            return false;
          }
        }
      }

      const { error: updateError } = await supabase
        .from('nfc_tags')
        .update(updateData)
        .eq('id', targetId);

      if (updateError) {
        toast.error(`Gagal menyimpan perubahan tag: ${updateError.message}`);
        return false;
      }

      toast.success(`Data Tag "${targetId}" berhasil diperbarui!`);
      await fetchMetrics();
      return true;
    } catch (err: any) {
      toast.error('Terjadi kesalahan saat menyimpan detail tag.');
      return false;
    }
  }

  // Hapus Tag dari Admin
  async function handleDeleteTag(tagId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('nfc_tags')
        .delete()
        .eq('id', tagId);

      if (error) {
        toast.error(`Gagal menghapus tag: ${error.message}`);
        return false;
      }

      toast.success(`Tag ${tagId} berhasil dihapus.`);
      fetchMetrics();
      return true;
    } catch {
      toast.error('Terjadi kesalahan saat menghapus tag.');
      return false;
    }
  }

  const activeUnits = tags.filter((t) => t.is_active).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-slate-200 bg-white shadow-xl rounded-3xl p-2 animate-in fade-in zoom-in-95 duration-200">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-md mb-3">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Admin Control Center</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Masukkan kredensial admin untuk memonitor fleet tag.</p>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Username
                </label>
                <Input
                  type="text"
                  placeholder="Username admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 text-xs rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Password
                </label>
                <Input
                  type="password"
                  placeholder="Kata sandi admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-xs rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Masuk ke Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State Batch Generate & Template Kreasi
  const [createMode, setCreateMode] = useState<'single' | 'batch'>('single');
  const [batchPrefix, setBatchPrefix] = useState('TAG-');
  const [batchStart, setBatchStart] = useState<number>(1);
  const [batchEnd, setBatchEnd] = useState<number>(10);
  const [batchPadding, setBatchPadding] = useState<number>(3);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<CustomTemplate[]>([]);
  const [activeTabSide, setActiveTabSide] = useState<'front' | 'back'>('front');
  const [selectedFrontTemplateId, setSelectedFrontTemplateId] = useState<string>('default_blank');
  const [selectedBackTemplateId, setSelectedBackTemplateId] = useState<string>('default_blank');
  const [templateFilterPreset, setTemplateFilterPreset] = useState<'all' | 'card_v' | 'square' | 'card_h'>('all');

  // Muat katalog template (Official starter + Kreasi Saya dari Supabase / LocalStorage)
  useEffect(() => {
    if (isAuthenticated) {
      loadKatalogTemplates();
    }
  }, [isAuthenticated]);

  async function loadKatalogTemplates() {
    try {
      const externalTemplates = await loadExternalStarterTemplates();
      let userTemplates: CustomTemplate[] = [];

      const { data, error } = await supabase
        .from('studio_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        userTemplates = data;
        localStorage.setItem('studio_custom_templates', JSON.stringify(data));
      } else {
        const local = localStorage.getItem('studio_custom_templates');
        if (local) {
          try {
            userTemplates = JSON.parse(local);
          } catch {
            // safe
          }
        }
      }

      // Gabungkan: Kreasi Pengguna di atas, diikuti starter templates
      const combined = [...userTemplates];
      for (const ext of externalTemplates) {
        if (!combined.some((t) => t.id === ext.id)) {
          combined.push(ext);
        }
      }

      setAvailableTemplates(combined);
    } catch (err) {
      console.warn('Gagal memuat katalog template untuk batch generate:', err);
    }
  }

  async function handleBatchGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (batchStart > batchEnd) {
      toast.error('Nomor awal tidak boleh lebih besar dari nomor akhir!');
      return;
    }
    const count = batchEnd - batchStart + 1;
    if (count > 200) {
      toast.error('Batas maksimal sekali generate adalah 200 tag.');
      return;
    }

    setIsBatchGenerating(true);

    // Ambil data template untuk Sisi Depan dan Sisi Belakang secara terpisah
    const frontTemplate = availableTemplates.find((t) => t.id === selectedFrontTemplateId);
    const backTemplate = availableTemplates.find((t) => t.id === selectedBackTemplateId);

    let initialCardDesign: any = null;

    if (frontTemplate || backTemplate) {
      const frontData = frontTemplate
        ? {
            template: frontTemplate.id,
            elements: frontTemplate.elements || DEFAULT_BLANK_ELEMENTS,
            bgImage: null
          }
        : {
            template: 'default_blank',
            elements: DEFAULT_BLANK_ELEMENTS,
            bgImage: null
          };

      const backData = backTemplate
        ? {
            template: backTemplate.id,
            elements: backTemplate.elements || DEFAULT_BLANK_ELEMENTS,
            bgImage: null
          }
        : {
            template: 'google_back_qr_focus',
            elements: DEFAULT_BLANK_ELEMENTS,
            bgImage: null
          };

      const determinedPreset = frontTemplate?.preset || backTemplate?.preset || 'card_v';

      initialCardDesign = {
        preset: determinedPreset,
        front: frontData,
        back: backData,
        updated_at: new Date().toISOString()
      };
    }

    const newTags: any[] = [];
    for (let i = batchStart; i <= batchEnd; i++) {
      const numStr = String(i).padStart(batchPadding, '0');
      const tagObj: any = {
        id: `${batchPrefix.trim().toUpperCase()}${numStr}`,
        is_active: false
      };

      if (initialCardDesign) {
        tagObj.hub_config = {
          tagline: 'Great choice, awkward chat',
          bio: '',
          avatar_url: '',
          cover_url: '',
          menu_url: '',
          wifi_ssid: '',
          wifi_pass: '',
          instagram: '',
          youtube: '',
          tiktok: '',
          whatsapp: '',
          custom_links: [],
          feedbacks: [],
          card_design: initialCardDesign
        };
      }

      newTags.push(tagObj);
    }

    try {
      const { data, error } = await supabase
        .from('nfc_tags')
        .insert(newTags)
        .select('id');

      if (error) {
        if (error.code === '23505') {
          toast.error('Beberapa ID tag sudah terdaftar di database. Silakan sesuaikan range atau prefix.');
        } else {
          toast.error(`Gagal membuat tag massal: ${error.message}`);
        }
      } else {
        const createdCount = data?.length || count;
        const frontTitle = frontTemplate ? frontTemplate.title : 'Polos';
        const backTitle = backTemplate ? backTemplate.title : 'Polos';
        const templateNote = (frontTemplate || backTemplate) ? ` (Depan: ${frontTitle}, Belakang: ${backTitle})` : '';
        toast.success(`Berhasil membuat ${createdCount} Tag ID baru secara massal${templateNote}!`);
        fetchMetrics();
      }
    } catch (err: any) {
      toast.error(`Terjadi kesalahan: ${err?.message || 'Gagal menyimpan'}`);
    } finally {
      setIsBatchGenerating(false);
    }
  }

  // Preview batch range text
  const previewBatchSample = `${batchPrefix.trim().toUpperCase()}${String(batchStart).padStart(batchPadding, '0')} s/d ${batchPrefix.trim().toUpperCase()}${String(batchEnd).padStart(batchPadding, '0')}`;
  const batchCount = Math.max(0, batchEnd - batchStart + 1);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">NFC Fleet Management</h1>
            <span className="text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full">
              Admin: jagres
            </span>
          </div>
          <p className="text-sm text-slate-500">Monitoring status aktivasi unit akrilik dan metrik interaksi tap.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={loading} className="rounded-xl">
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Perbarui
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-semibold"
            title="Keluar"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <MetricCards totalUnits={tags.length} activeUnits={activeUnits} totalTaps={totalTaps} />

      {/* Card Pre-Generate Tag ID: Mode Satu per Satu & Mode Massal */}
      <Card className="border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Pre-Generate Tag ID Fisik</span>
                <span className="text-[10px] font-normal text-slate-500">
                  {createMode === 'single' ? '(Input Satuan)' : `(Batch Otomatis: ${batchCount} Unit)`}
                </span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftarkan ID tag sebelum dicetak ke kartu fisik akrilik atau stiker NFC.
              </p>
            </div>

            {/* Tab Switcher Satu per Satu vs Massal */}
            <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setCreateMode('single')}
                className={`py-1 px-3 text-xs font-bold rounded-lg transition ${
                  createMode === 'single'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Satu per Satu
              </button>
              <button
                type="button"
                onClick={() => setCreateMode('batch')}
                className={`py-1 px-3 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                  createMode === 'batch'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ Generate Massal
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {createMode === 'single' ? (
            /* Mode 1: Satu per Satu */
            <form onSubmit={handleCreateTag} className="flex items-center gap-2.5">
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Contoh: TAG-A101"
                  value={newTagId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTagId(e.target.value)}
                  className="font-mono uppercase text-sm rounded-xl h-10 border-slate-200"
                  required
                />
              </div>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-4">
                <Plus className="h-4 w-4 mr-1.5" /> Daftarkan Tag
              </Button>
            </form>
          ) : (
            /* Mode 2: Generate Massal Otomatis */
            <form onSubmit={handleBatchGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Prefix ID
                  </label>
                  <Input
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value)}
                    placeholder="TAG-"
                    className="font-mono uppercase rounded-xl h-9 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nomor Mulai
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={batchStart}
                    onChange={(e) => setBatchStart(parseInt(e.target.value) || 1)}
                    className="font-mono rounded-xl h-9 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nomor Selesai
                  </label>
                  <Input
                    type="number"
                    min={batchStart}
                    value={batchEnd}
                    onChange={(e) => setBatchEnd(parseInt(e.target.value) || batchStart)}
                    className="font-mono rounded-xl h-9 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Digit Angka (Padding)
                  </label>
                  <select
                    value={batchPadding}
                    onChange={(e) => setBatchPadding(parseInt(e.target.value))}
                    className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono"
                  >
                    <option value={1}>1 digit (1, 2, 3...)</option>
                    <option value={2}>2 digit (01, 02, 03...)</option>
                    <option value={3}>3 digit (001, 002...)</option>
                    <option value={4}>4 digit (0001, 0002...)</option>
                  </select>
                </div>
              </div>

              {/* Template Kreasi / Desain Pilihan: Konfigurasi Terpisah Sisi Depan & Sisi Belakang */}
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                {/* Header Bagian Template */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-2xs">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Pilih Desain Layout Kartu Fisik (Depan & Belakang)</h4>
                      <p className="text-[10px] text-slate-500">Anda dapat menentukan desain yang berbeda secara independen untuk Sisi Depan dan Sisi Belakang</p>
                    </div>
                  </div>

                  {/* Ringkasan Template yang Terpilih */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <div className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400">Depan:</span>
                      <span className="font-semibold text-blue-700 truncate max-w-[130px]">
                        {selectedFrontTemplateId === 'default_blank'
                          ? 'Polos (Blank)'
                          : availableTemplates.find((t) => t.id === selectedFrontTemplateId)?.title || selectedFrontTemplateId}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400">Belakang:</span>
                      <span className="font-semibold text-purple-700 truncate max-w-[130px]">
                        {selectedBackTemplateId === 'default_blank'
                          ? 'Polos (Blank)'
                          : availableTemplates.find((t) => t.id === selectedBackTemplateId)?.title || selectedBackTemplateId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tab Navigasi Sisi: [ Sisi Depan ] | [ Sisi Belakang ] */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTabSide('front')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                        activeTabSide === 'front'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <span>☀️ Sisi Depan</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeTabSide === 'front' ? 'bg-blue-700 text-blue-100' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {selectedFrontTemplateId === 'default_blank' ? 'Polos' : 'Kustom'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabSide('back')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                        activeTabSide === 'back'
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <span>🌙 Sisi Belakang</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        activeTabSide === 'back' ? 'bg-purple-700 text-purple-100' : 'bg-slate-300 text-slate-600'
                      }`}>
                        {selectedBackTemplateId === 'default_blank' ? 'Polos' : 'Kustom'}
                      </span>
                    </button>
                  </div>

                  {/* Filter Orientasi Preset: Semua, Vertikal, 1:1 Kotak, Horizontal */}
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200/80 w-full sm:w-auto shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setTemplateFilterPreset('all')}
                      className={`py-1 px-2.5 text-[11px] font-bold rounded-lg transition ${
                        templateFilterPreset === 'all'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilterPreset('card_v')}
                      className={`py-1 px-2.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                        templateFilterPreset === 'card_v'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Vertikal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilterPreset('square')}
                      className={`py-1 px-2.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                        templateFilterPreset === 'square'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Square className="w-3 h-3" />
                      <span>1:1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemplateFilterPreset('card_h')}
                      className={`py-1 px-2.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1 ${
                        templateFilterPreset === 'card_h'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Horizontal</span>
                    </button>
                  </div>
                </div>

                {/* Sub-header Petunjuk Tab Aktif */}
                <div className={`px-3 py-2 rounded-xl border text-xs flex items-center justify-between ${
                  activeTabSide === 'front'
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-purple-50/70 border-purple-200 text-purple-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      activeTabSide === 'front' ? 'bg-blue-600' : 'bg-purple-600'
                    }`} />
                    <span>
                      Sedang memilih template untuk: <strong>{activeTabSide === 'front' ? '☀️ SISI DEPAN KARTU' : '🌙 SISI BELAKANG KARTU'}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Klik kartu di bawah untuk menetapkan ke sisi ini
                  </span>
                </div>

                {/* Grid Template Cards (Visual Card Picker untuk Tab Sisi Aktif) */}
                {(() => {
                  const currentSelectedId = activeTabSide === 'front' ? selectedFrontTemplateId : selectedBackTemplateId;
                  const setSelectedForActiveSide = (id: string) => {
                    if (activeTabSide === 'front') {
                      setSelectedFrontTemplateId(id);
                    } else {
                      setSelectedBackTemplateId(id);
                    }
                  };
                  const activeColorRing = activeTabSide === 'front' ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20' : 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20';
                  const activeBadgeBg = activeTabSide === 'front' ? 'bg-blue-600' : 'bg-purple-600';

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1 pb-1">
                      {/* Pilihan: Polos Standar (Blank) */}
                      <div
                        onClick={() => setSelectedForActiveSide('default_blank')}
                        className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between min-h-[110px] ${
                          currentSelectedId === 'default_blank'
                            ? activeColorRing
                            : 'border-dashed border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                            +
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate">Polos Standar (Blank)</h5>
                            <p className="text-[10px] text-slate-500 truncate">Hanya Touchpoint & QR</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-mono">Tanpa template</span>
                          {currentSelectedId === 'default_blank' && (
                            <span className={`text-white font-bold px-2 py-0.5 rounded-full text-[9px] ${activeBadgeBg}`}>
                              ✓ Terpilih ({activeTabSide === 'front' ? 'Depan' : 'Belakang'})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pilihan: Katalog & Kreasi Pengguna */}
                      {availableTemplates
                        .filter((t) => templateFilterPreset === 'all' || t.preset === templateFilterPreset)
                        .map((item) => {
                          const isSelected = currentSelectedId === item.id;
                          const isCustom = item.category !== 'official' && !item.is_starter;
                          const presetLabel =
                            item.preset === 'card_v'
                              ? 'Vertikal'
                              : item.preset === 'card_h'
                              ? 'Horizontal'
                              : '1:1 Kotak';

                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedForActiveSide(item.id)}
                              className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between min-h-[110px] group ${
                                isSelected
                                  ? activeColorRing
                                  : isCustom
                                  ? 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50/30'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="h-10 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/80 flex items-center px-2.5 justify-between overflow-hidden">
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Layout className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[10px] font-semibold text-slate-600">{presetLabel}</span>
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-400">
                                    {item.elements?.length || 0} elemen
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                  <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                                </div>
                              </div>

                              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    isCustom
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {isCustom ? '⭐ Kreasi Saya' : '🎨 Official'}
                                </span>
                                {isSelected && (
                                  <span className={`text-white font-bold px-2 py-0.5 rounded-full text-[9px] ${activeBadgeBg}`}>
                                    ✓ Terpilih ({activeTabSide === 'front' ? 'Depan' : 'Belakang'})
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })()}

                {/* Footer Ringkasan Lengkap Hasil Desain Depan & Belakang */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span className="text-slate-600">Sisi Depan:</span>
                      <strong className="text-slate-900">
                        {selectedFrontTemplateId === 'default_blank'
                          ? 'Polos Standar (Blank)'
                          : availableTemplates.find((t) => t.id === selectedFrontTemplateId)?.title || selectedFrontTemplateId}
                      </strong>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <span className="text-slate-600">Sisi Belakang:</span>
                      <strong className="text-slate-900">
                        {selectedBackTemplateId === 'default_blank'
                          ? 'Polos Standar (Blank)'
                          : availableTemplates.find((t) => t.id === selectedBackTemplateId)?.title || selectedBackTemplateId}
                      </strong>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 italic">
                    Kedua sisi akan langsung tertanam ke seluruh unit tag yang digenerate.
                  </span>
                </div>
              </div>

              {/* Preview Hasil & Tombol Eksekusi */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-blue-950 flex flex-col">
                  <span className="font-semibold">
                    Rentang yang akan dibuat: <span className="font-mono font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">{previewBatchSample}</span>
                  </span>
                  <span className="text-[11px] text-blue-600 mt-0.5">
                    Total: {batchCount} unit NFC tag baru siap diproduksi
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isBatchGenerating || batchCount <= 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-9 px-4 shadow-sm"
                >
                  {isBatchGenerating ? (
                    <>Memproses {batchCount} Tag...</>
                  ) : (
                    <>⚡ Buat {batchCount} Tag Massal Sekarang</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Section Header & Toggle View: Card vs Tabel */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Inventaris Unit NFC ({tags.length})
          </h2>
          <p className="text-xs text-slate-500">
            {viewMode === 'cards'
              ? 'Tampilan Visual Kartu Standee & Stiker Google Review'
              : 'Tampilan Detail Tabel Baris'}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Visual Kartu
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="h-3.5 w-3.5" />
            Tabel
          </button>
        </div>
      </div>

      {/* Konten Inventaris: Tampilan Visual Card atau Tabel */}
      {viewMode === 'cards' ? (
        tags.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-6">
            <p className="text-xs text-slate-400">Belum ada tag yang terdaftar. Buat tag ID baru di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tags.map((tagItem) => (
              <TagCardPreview
                key={tagItem.id}
                tag={tagItem}
                onDesignTag={(item) => setDesigningTag(item)}
                onEditTag={(item) => setEditingTag(item)}
                onDeleteTag={handleDeleteTag}
              />
            ))}
          </div>
        )
      ) : (
        <TagTable
          tags={tags}
          onUpdateTagId={handleUpdateTagId}
          onDeleteTag={handleDeleteTag}
          onDesignTag={(item) => setDesigningTag(item)}
          onEditTag={(item) => setEditingTag(item)}
        />
      )}

      {/* Edit Detail Tag Modal (ID, Tipe Produk, Nama Bisnis, PIN, Total Taps) */}
      {editingTag && (
        <EditTagModal
          tag={editingTag}
          isOpen={Boolean(editingTag)}
          onClose={() => setEditingTag(null)}
          onSave={handleSaveTagDetails}
        />
      )}

      {/* Canva-style Studio Designer Modal */}
      {/* Canva-style Studio Designer Modal */}
      {designingTag && (
        <TagDesignStudio
          tag={designingTag}
          onClose={() => setDesigningTag(null)}
          onTagUpdated={(updatedTag) => {
            setTags((prev) => prev.map((t) => (t.id === updatedTag.id ? updatedTag : t)));
            setDesigningTag(updatedTag);
          }}
        />
      )}
    </div>
  );
}
