import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { NfcTagEntity, ProductType, CustomLink } from '@/types/nfc';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  ArrowLeft,
  Save,
  ExternalLink,
  Wifi,
  Utensils,
  Store,
  Star,
  Quote,
  Smartphone,
  Eye,
  Edit3,
  MessageSquare,
  Trash2,
  Clock,
  Upload,
  Image as ImageIcon,
  Check,
  CornerDownRight,
  Send,
  ShieldCheck,
  User
} from 'lucide-react';
import { toast } from 'sonner';

import { LinkCardsEditor } from '@/components/hub/LinkCardsEditor';
import { MobilePreview } from '@/components/hub/MobilePreview';
import type { FeedbackItem } from '@/types/nfc';
import { compressImageToKB } from '@/lib/imageCompressor';

export default function ManageTag() {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Balas masukan tamu oleh Admin di CMS
  const [activeReplyFbId, setActiveReplyFbId] = useState<string | null>(null);
  const [replyAdminText, setReplyAdminText] = useState('');
  const [adminName, setAdminName] = useState('Admin Resto');

  // Uploading states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form Fields
  const [productType, setProductType] = useState<ProductType>('TABLE_HUB');
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');

  const [tiktok, setTiktok] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);



  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { data: isValid, error: rpcError } = await supabase.rpc('verify_tag_pin', {
      p_tag_id: tagId,
      p_pin: pin
    });

    if (rpcError || !isValid) {
      setSubmitting(false);
      toast.error(rpcError ? `Error: ${rpcError.message}` : 'PIN salah. Silakan coba lagi.');
      return;
    }

    const { data, error } = await supabase
      .from('nfc_tags')
      .select('id, type, business_name, google_place_id, is_active, total_taps, hub_config, created_at, updated_at')
      .eq('id', tagId)
      .single();

    setSubmitting(false);

    if (error || !data) {
      toast.error('Gagal mengambil data tag: ' + (error?.message || 'Data kosong'));
      return;
    }

    const current = data as NfcTagEntity;
    setProductType(current.type || 'TABLE_HUB');
    setBusinessName(current.business_name || '');
    
    const cfg = current.hub_config || {};
    setTagline(cfg.tagline || 'Great choice, awkward chat');
    setBio(cfg.bio || '');
    setAvatarUrl(cfg.avatar_url || '');
    setCoverUrl(cfg.cover_url || '');
    setWifiSsid(cfg.wifi_ssid || '');
    setWifiPass(cfg.wifi_pass || '');
    setInstagram(cfg.instagram || '');
    setYoutube(cfg.youtube || '');
    setTiktok(cfg.tiktok || '');
    setWhatsapp(cfg.whatsapp || '');
    setFeedbacks(cfg.feedbacks || []);

    if (cfg.custom_links && cfg.custom_links.length > 0) {
      setCustomLinks(cfg.custom_links);
    } else {
      const reviewUrl = current.google_place_id 
        ? (current.google_place_id.startsWith('URL:') ? current.google_place_id.replace('URL:', '') : `https://search.google.com/local/writereview?placeid=${current.google_place_id}`)
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.business_name || '')}`;

      setCustomLinks([
        { id: '1', title: 'Leave a Google Review', url: reviewUrl, icon: 'google', highlight: true },
        { id: '2', title: 'View Menu', url: cfg.menu_url || 'https://menu.online', icon: 'menu', highlight: false },
        { id: '3', title: 'Connect to Wi-Fi', url: '#wifi', icon: 'wifi', highlight: false },
        { id: '4', title: 'Leave Anonymous Feedback', url: '#feedback', icon: 'feedback', highlight: false },
        { id: '5', title: 'Play Sudoku', url: 'https://sudoku.com', icon: 'game', highlight: false }
      ]);

    }

    setIsAuthenticated(true);
    toast.success('Login CMS berhasil!');

  }


  function handleAddLink(preset?: Partial<CustomLink>) {
    const newLink: CustomLink = {
      id: `link-${Date.now()}`,
      title: preset?.title || 'Tautan Baru',
      url: preset?.url || 'https://',
      icon: preset?.icon || 'link',
      subtitle: preset?.subtitle || '',
      highlight: preset?.highlight ?? false
    };

    setCustomLinks([...customLinks, newLink]);
    toast.success('Tombol tautan ditambahkan!');
  }

  function handleRemoveLink(id: string) {
    setCustomLinks(customLinks.filter((l) => l.id !== id));
  }

  function handleDeleteFeedback(id: string) {
    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    toast.success('Masukan berhasil dihapus dari daftar.');
  }

  function handleAdminReply(feedbackId: string) {
    if (!replyAdminText.trim()) {
      toast.error('Tuliskan balasan admin terlebih dahulu.');
      return;
    }

    const updated = feedbacks.map((fb) => {
      if (fb.id === feedbackId) {
        const currentReplies = fb.replies || [];
        return {
          ...fb,
          replies: [
            ...currentReplies,
            {
              id: `rep-${Date.now()}`,
              sender: 'admin' as const,
              sender_name: adminName.trim() || 'Admin Resto',
              message: replyAdminText.trim(),
              created_at: new Date().toISOString()
            }
          ]
        };
      }
      return fb;
    });

    setFeedbacks(updated);
    setReplyAdminText('');
    setActiveReplyFbId(null);
    toast.success('Balasan admin berhasil ditambahkan! Jangan lupa klik "Simpan Perubahan".');
  }

  function handleDeleteReply(feedbackId: string, replyId: string) {
    const updated = feedbacks.map((fb) => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          replies: (fb.replies || []).filter((r) => r.id !== replyId)
        };
      }
      return fb;
    });
    setFeedbacks(updated);
    toast.success('Balasan berhasil dihapus.');
  }

  function handleLinkChange(index: number, field: keyof CustomLink, value: any) {
    const updated = [...customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCustomLinks(updated);
  }

  // Upload gambar dengan kompresi otomatis ke puluhan KB
  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: 'avatar' | 'cover'
  ) {
    const file = e.target.files?.[0];
    if (!file || !tagId) return;

    if (targetType === 'avatar') setUploadingAvatar(true);
    else setUploadingCover(true);

    try {
      // 1. Kompres gambar di browser (Maksimal 800px untuk avatar / 1200px untuk cover)
      const maxDim = targetType === 'avatar' ? 600 : 1200;
      const { blob, fileName, sizeKB } = await compressImageToKB(file, maxDim, maxDim, 0.82);

      // 2. Upload ke Supabase Storage bucket 'nfc'
      const filePath = `${tagId}/${targetType}-${Date.now()}.webp`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('nfc')
        .upload(filePath, blob, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // 3. Dapatkan Public URL
      const { data: publicData } = supabase.storage.from('nfc').getPublicUrl(filePath);
      const publicUrl = publicData?.publicUrl || '';

      if (targetType === 'avatar') {
        setAvatarUrl(publicUrl);
        toast.success(`Foto profil berhasil diunggah (${sizeKB} KB)!`);
      } else {
        setCoverUrl(publicUrl);
        toast.success(`Banner berhasil diunggah (${sizeKB} KB)!`);
      }
    } catch (err: any) {
      toast.error(`Gagal mengunggah gambar: ${err.message || 'Cek koneksi internet'}`);
    } finally {
      if (targetType === 'avatar') setUploadingAvatar(false);
      else setUploadingCover(false);
      // Reset input value agar file yang sama bisa dipilih ulang jika perlu
      e.target.value = '';
    }
  }


  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!tagId) return;

    setSubmitting(true);
    const { data: success, error } = await supabase.rpc('update_tag_config', {
      p_tag_id: tagId,
      p_pin: pin,
      p_type: productType,
      p_hub_config: {
        tagline,
        bio,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        wifi_ssid: wifiSsid,
        wifi_pass: wifiPass,
        instagram,
        youtube,
        tiktok,
        whatsapp,
        custom_links: customLinks,
        feedbacks
      }
    });

    setSubmitting(false);

    if (!error && success) {
      // Simpan Wi-Fi ke memori lokal browser untuk autocomplete tag berikutnya
      if (wifiSsid.trim()) {
        try {
          const currentSaved = JSON.parse(localStorage.getItem('nfc_saved_wifis') || '[]');
          const filtered = currentSaved.filter((i: any) => i.ssid.toLowerCase() !== wifiSsid.trim().toLowerCase());
          filtered.unshift({
            ssid: wifiSsid.trim(),
            pass: wifiPass.trim()
          });
          localStorage.setItem('nfc_saved_wifis', JSON.stringify(filtered.slice(0, 10)));
        } catch {}
      }

      toast.success('Halaman Table Hub berhasil diperbarui!');
    } else {


      toast.error(error ? `Gagal menyimpan: ${error.message}` : 'Gagal menyimpan pembaruan.');
    }
  }

  // Halaman Login PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-sm w-full border-slate-200 bg-white shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white mb-2">
              <Store className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">CMS Table Hub</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Masukkan PIN untuk mengelola menu, Wi-Fi & tautan ({tagId})
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4 pt-2">
              <Input
                type="password"
                required
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN 4-6 Digit"
                className="h-12 font-mono text-center tracking-widest text-lg rounded-xl border-slate-200 focus-visible:ring-black"
              />
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => navigate(`/t/${tagId}`)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="bg-black hover:bg-neutral-800 text-white">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buka CMS'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Dashboard CMS Table Hub
  return (
    <div className="min-h-screen bg-slate-100/70 p-3 md:p-8 flex justify-center selection:bg-black selection:text-white">
      <div className="w-full max-w-7xl space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white font-black text-lg shadow-sm">
              {businessName.substring(0, 2).toUpperCase() || 'TH'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                  {tagId}
                </span>
                <h1 className="text-lg font-bold text-slate-900">{businessName || 'Table Hub'}</h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Editor Bio Link & Tautan Interaktif Meja Tamu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/t/${tagId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all"
            >
              Buka Bio Link <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              onClick={handleUpdate}
              disabled={submitting}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-5 h-9 rounded-xl shadow-xs"
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
              Simpan Perubahan
            </Button>
          </div>
        </div>

        {/* Mobile Tab Switcher (Hanya tampil di layar HP < lg) */}
        <div className="flex lg:hidden bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'editor'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>Form Editor CMS</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'preview'
                ? 'bg-black text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Live Preview HP</span>
          </button>
        </div>

        {/* 2-Column Layout (Desktop) / Tab Switchable (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Left Column: Form Editor */}
          <div className={`lg:col-span-7 space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {/* Mode Operasional */}
            <Card className="border-slate-200/80 bg-white shadow-xs rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Mode Operasional Unit</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tentukan bagaimana unit NFC merespons saat disentuh oleh smartphone pengunjung.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProductType('DIRECT_REVIEW')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      productType === 'DIRECT_REVIEW'
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Direct Review</div>
                      <div className="text-[10px] opacity-80">Lompat instan ke Google Maps</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProductType('TABLE_HUB')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      productType === 'TABLE_HUB'
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Utensils className="h-5 w-5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Table Hub (Linktree)</div>
                      <div className="text-[10px] opacity-80">Menu, Ulasan, Wi-Fi & Hadiah</div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Profil Brand */}
            <Card className="border-slate-200/80 bg-white shadow-xs rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Profil Bisnis & Tampilan Atas</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Logo toko, foto banner/meja, dan kalimat slogan penyambut.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Foto Profil / Logo Toko */}
                  <div className="space-y-2 p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">Foto Profil / Logo Toko</label>
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black hover:bg-neutral-800 text-white text-[11px] font-bold cursor-pointer transition-all shadow-xs">
                        {uploadingAvatar ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Kompres &amp; Upload...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3" />
                            <span>Upload &amp; Kompres</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingAvatar}
                          onChange={(e) => handleImageUpload(e, 'avatar')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar preview"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <Input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://... atau klik Upload"
                        className="h-9 text-xs rounded-xl border-slate-200 bg-white"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      *Otomatis dikompres ke format WebP ringan (KB)
                    </span>
                  </div>

                  {/* Foto Background Banner Meja */}
                  <div className="space-y-2 p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">Background Banner Meja</label>
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black hover:bg-neutral-800 text-white text-[11px] font-bold cursor-pointer transition-all shadow-xs">
                        {uploadingCover ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Kompres &amp; Upload...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3" />
                            <span>Upload &amp; Kompres</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingCover}
                          onChange={(e) => handleImageUpload(e, 'cover')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt="Cover preview"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <Input
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        placeholder="https://... atau klik Upload"
                        className="h-9 text-xs rounded-xl border-slate-200 bg-white"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      *Banner otomatis diskalakan &amp; dikompres ke ukuran KB
                    </span>
                  </div>
                </div>


                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Quote className="h-3.5 w-3.5 text-slate-500" /> Slogan / Tagline Singkat
                  </label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Contoh: Great choice, awkward chat"
                    className="h-10 text-xs rounded-xl border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Keterangan / Bio Tambahan (Opsional)</label>
                  <Input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Deskripsi singkat seputar tempat atau layanan"
                    className="h-10 text-xs rounded-xl border-slate-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Link Cards Dynamic Editor Component */}
            <LinkCardsEditor
              tagId={tagId}
              customLinks={customLinks}
              onAddLink={handleAddLink}
              onRemoveLink={handleRemoveLink}
              onLinkChange={handleLinkChange}
            />

            {/* Fasilitas Meja */}
            <Card className="border-slate-200/80 bg-white shadow-xs rounded-3xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Kredensial Wi-Fi &amp; Ikon Sosial</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Data otomatis yang disalin ketika pengunjung menekan tombol Wi-Fi dan ikon sosial di footer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Wifi className="h-3.5 w-3.5 text-slate-500" /> SSID Wi-Fi
                    </label>
                    <Input
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="Nama Wi-Fi toko (contoh: KopiKenangan_Guest)"
                      className="h-10 text-xs rounded-xl border-slate-200 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Password Wi-Fi</label>
                    <Input
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="Password Wi-Fi toko (Opsional)"
                      className="h-10 text-xs rounded-xl border-slate-200 bg-white"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Instagram (Username)</label>
                    <Input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="contoh: barlowandfields"
                      className="h-10 text-xs rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">YouTube (Channel / Link)</label>
                    <Input
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="contoh: @barlowandfields"
                      className="h-10 text-xs rounded-xl border-slate-200"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kotak Masuk Kritik & Saran Anonim Meja Ini */}
            <Card className="border-slate-200/80 bg-white shadow-xs rounded-3xl">
              <CardHeader className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-sky-600" />
                    Kritik &amp; Saran Masuk dari Meja {tagId}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Komentar anonim yang dikirimkan tamu saat mengunjungi portal bio link tag ini.
                  </CardDescription>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {feedbacks.length} Masukan
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {feedbacks.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                    <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600">Belum ada kritik atau saran untuk meja ini</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Komentar pengunjung yang dikirim lewat tombol "Leave Anonymous Feedback" akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col gap-2 transition-all hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {fb.sender_name || 'Tamu Meja'}
                          </span>
                          {fb.rating && (
                            <div className="flex items-center text-amber-400 text-xs">
                              {Array.from({ length: fb.rating }).map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                              ))}
                            </div>
                          )}
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-1">
                            <Clock className="h-3 w-3" />
                            {new Date(fb.created_at).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFeedback(fb.id)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                          title="Hapus komentar ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-normal bg-white p-2.5 rounded-xl border border-slate-100">
                        "{fb.comment}"
                      </p>

                      {/* Thread Balasan di CMS */}
                      {fb.replies && fb.replies.length > 0 && (
                        <div className="pl-3 space-y-1.5 border-l-2 border-slate-200 mt-1">
                          {fb.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className={`p-2 rounded-xl text-left text-xs flex items-start justify-between gap-2 ${
                                rep.sender === 'admin'
                                  ? 'bg-amber-50/80 border border-amber-200/90 text-amber-950'
                                  : 'bg-white border border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="font-bold text-[11px] flex items-center gap-1">
                                    {rep.sender === 'admin' ? (
                                      <>
                                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                        <span>{rep.sender_name || 'Admin Resto'}</span>
                                      </>
                                    ) : (
                                      <>
                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                        <span>{rep.sender_name || 'Tamu'}</span>
                                      </>
                                    )}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    {new Date(rep.created_at).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs leading-snug">{rep.message}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteReply(fb.id, rep.id)}
                                className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                                title="Hapus balasan"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tombol Buka Input Balas dari Admin */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {fb.replies?.length ? `${fb.replies.length} balasan` : 'Belum dibalas'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeReplyFbId === fb.id) {
                              setActiveReplyFbId(null);
                            } else {
                              setActiveReplyFbId(fb.id);
                              setReplyAdminText('');
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>{activeReplyFbId === fb.id ? 'Batal Balas' : 'Balas sebagai Admin'}</span>
                        </button>
                      </div>

                      {/* Input Balasan Admin */}
                      {activeReplyFbId === fb.id && (
                        <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2 animate-in fade-in duration-150">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-amber-900">Nama Pengirim:</span>
                            <input
                              type="text"
                              value={adminName}
                              onChange={(e) => setAdminName(e.target.value)}
                              placeholder="Nama Admin / Resto"
                              className="text-xs px-2.5 py-1 rounded-lg border border-amber-200 bg-white"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyAdminText}
                              onChange={(e) => setReplyAdminText(e.target.value)}
                              placeholder="Tulis balasan resmi resto..."
                              className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAdminReply(fb.id);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAdminReply(fb.id)}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg h-8 px-3"
                            >
                              <Send className="w-3.5 h-3.5 mr-1" /> Balas
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>


            {/* Bottom Save Bar */}
            <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Semua perubahan langsung tersinkron ke NFC</span>
              <Button
                onClick={handleUpdate}
                disabled={submitting}
                className="bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl px-6"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
                Simpan Konfigurasi
              </Button>
            </div>
          </div>

          {/* Right Column: Live Smartphone Preview Component */}
          <div className={`lg:col-span-5 sticky top-6 flex flex-col items-center gap-3 ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center justify-between w-full max-w-[340px] px-2 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-black" />
                <span>Live Mobile Preview</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                Meja Tamu
              </span>
            </div>

            <MobilePreview
              businessName={businessName}
              tagline={tagline}
              avatarUrl={avatarUrl}
              coverUrl={coverUrl}
              customLinks={customLinks}
              instagram={instagram}
              youtube={youtube}
              tiktok={tiktok}
            />

          </div>
        </div>

        {/* Floating Quick Toggle on Mobile (< lg) */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex lg:hidden bg-neutral-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl border border-neutral-700 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileTab(mobileTab === 'editor' ? 'preview' : 'editor')}
            className="flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            {mobileTab === 'editor' ? (
              <>
                <Eye className="h-3.5 w-3.5 text-emerald-400" />
                <span>Lihat Tampilan HP</span>
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                <span>Kembali ke Editor</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
