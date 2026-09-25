-- ==============================================================================
-- DATABASE MIGRATION: CANVA STUDIO CARD DESIGNS (JSONB & DEDICATED SCHEMA)
-- Digunakan untuk menyimpan payload data Canva Studio (Sisi Depan & Belakang)
-- ==============================================================================

-- 1. Pastikan ekstensi pg_trgm dan btree_gin tersedia untuk optimasi JSONB
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- 2. Pastikan kolom hub_config pada tabel nfc_tags memiliki GIN Index
-- Ini membuat query pembacaan dan pemfilteran card_design secepat kilat (sub-millisecond)
CREATE INDEX IF NOT EXISTS idx_nfc_tags_hub_config_gin ON public.nfc_tags USING GIN (hub_config);

-- 3. (Opsional / Enterprise) Tabel Terdedikasi untuk Riwayat & Multi-Versi Desain Kartu
-- Tabel ini memungkinkan manajemen revisi desain (history log), rollback, atau draft desain
CREATE TABLE IF NOT EXISTS public.card_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id VARCHAR(32) NOT NULL REFERENCES public.nfc_tags(id) ON DELETE CASCADE,
    preset VARCHAR(32) NOT NULL DEFAULT 'square', -- 'square', 'card_v', 'card_h'
    front_design JSONB NOT NULL DEFAULT '{"template": "google_black_curve", "elements": [], "bgImage": null}'::jsonb,
    back_design JSONB NOT NULL DEFAULT '{"template": "google_back_qr_focus", "elements": [], "bgImage": null}'::jsonb,
    version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index Pencarian Cepat pada Tabel card_designs
CREATE INDEX IF NOT EXISTS idx_card_designs_tag_id ON public.card_designs(tag_id);
CREATE INDEX IF NOT EXISTS idx_card_designs_front_gin ON public.card_designs USING GIN (front_design);
CREATE INDEX IF NOT EXISTS idx_card_designs_back_gin ON public.card_designs USING GIN (back_design);

-- 4. Setup Row Level Security (RLS) pada card_designs
ALTER TABLE public.card_designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read card_designs" ON public.card_designs;
CREATE POLICY "Public read card_designs" ON public.card_designs
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public insert/update card_designs" ON public.card_designs;
CREATE POLICY "Public insert/update card_designs" ON public.card_designs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. Trigger updated_at otomatis
CREATE OR REPLACE FUNCTION update_card_designs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_card_designs_updated_at ON public.card_designs;
CREATE TRIGGER trg_card_designs_updated_at
    BEFORE UPDATE ON public.card_designs
    FOR EACH ROW
    EXECUTE FUNCTION update_card_designs_updated_at();

-- 6. Tabel Master Template Publikasi (studio_templates)
-- Digunakan untuk menyimpan template kustom tanpa batas yang dipublikasikan admin langsung dari Web Studio
CREATE TABLE IF NOT EXISTS public.studio_templates (
    id VARCHAR(64) PRIMARY KEY, -- ID template unik (tmpl_...)
    title VARCHAR(255) NOT NULL,
    preset VARCHAR(32) NOT NULL DEFAULT 'square', -- 'square', 'card_v', 'card_h'
    elements JSONB NOT NULL DEFAULT '[]'::jsonb,
    thumbnail_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_studio_templates_published ON public.studio_templates(is_published);
CREATE INDEX IF NOT EXISTS idx_studio_templates_elements_gin ON public.studio_templates USING GIN (elements);

-- RLS untuk studio_templates
ALTER TABLE public.studio_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read studio_templates" ON public.studio_templates;
CREATE POLICY "Public read studio_templates" ON public.studio_templates
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public insert/update/delete studio_templates" ON public.studio_templates;
CREATE POLICY "Public insert/update/delete studio_templates" ON public.studio_templates
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Dokumentasi Ekstra:
COMMENT ON TABLE public.card_designs IS 'Koleksi dokumen desain canvas Canva Studio NFC Smart Card';
COMMENT ON TABLE public.studio_templates IS 'Katalog template resmi & kustom yang dipublikasikan admin langsung dari Studio Canva';
COMMENT ON COLUMN public.nfc_tags.hub_config IS 'Menyimpan konfigurasi hub + card_design (JSON terstruktur Canva Studio)';
