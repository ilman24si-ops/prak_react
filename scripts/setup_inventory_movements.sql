-- =============================================================
-- SETUP TABEL: products + inventory_movements
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- URUTAN: script ini harus dijalankan SETELAH setup_users_and_profiles.sql
-- =============================================================


-- -------------------------------------------------------------
-- BAGIAN 1: TABEL products
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  price       BIGINT      NOT NULL DEFAULT 0 CHECK (price >= 0),
  stock       INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category    TEXT,
  image_url   TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Daftar produk/obat Apotek Keluarga 25';

-- Auto update updated_at
DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_products_name      ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products"   ON public.products;
DROP POLICY IF EXISTS "Admin can insert products"  ON public.products;
DROP POLICY IF EXISTS "Admin can update products"  ON public.products;
DROP POLICY IF EXISTS "Admin can delete products"  ON public.products;

-- Semua user (termasuk tidak login) bisa lihat produk
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  USING (public.get_my_role() = 'Admin');


-- -------------------------------------------------------------
-- BAGIAN 2: TABEL inventory_movements
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_by    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  movement_type TEXT        NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'pos_sale')),
  quantity      INTEGER     NOT NULL CHECK (quantity > 0),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.inventory_movements IS 'Riwayat pergerakan stok produk (masuk/keluar/penyesuaian)';
COMMENT ON COLUMN public.inventory_movements.movement_type IS 'in=stok masuk, out=stok keluar, adjustment=penyesuaian, pos_sale=terjual via POS';

-- Index
CREATE INDEX IF NOT EXISTS idx_inv_movements_product    ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_created    ON public.inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inv_movements_created_by ON public.inventory_movements(created_by);

-- RLS
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can view inventory_movements"   ON public.inventory_movements;
DROP POLICY IF EXISTS "Admin can insert inventory_movements" ON public.inventory_movements;
DROP POLICY IF EXISTS "Admin can delete inventory_movements" ON public.inventory_movements;

CREATE POLICY "Admin can view inventory_movements"
  ON public.inventory_movements FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can insert inventory_movements"
  ON public.inventory_movements FOR INSERT
  WITH CHECK (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete inventory_movements"
  ON public.inventory_movements FOR DELETE
  USING (public.get_my_role() = 'Admin');


-- -------------------------------------------------------------
-- Verifikasi
-- -------------------------------------------------------------
SELECT
  table_name,
  'OK' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('products', 'inventory_movements')
ORDER BY table_name;
