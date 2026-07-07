-- =============================================================
-- SETUP: Foreign Key transaksi → pelanggan
-- Tujuan: Agar Supabase PostgREST bisa melakukan join otomatis
--         antara tabel transaksi dan pelanggan
--
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================


-- -------------------------------------------------------------
-- LANGKAH 1: Pastikan tabel pelanggan ada dan memiliki PK
-- Jalankan ini untuk melihat struktur tabel pelanggan:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'pelanggan';
-- -------------------------------------------------------------


-- -------------------------------------------------------------
-- LANGKAH 2: Tambahkan Foreign Key dari transaksi ke pelanggan
--
-- PENTING: Sesuaikan nama kolom jika berbeda di database Anda!
--   - transaksi.id_pelanggan  → kolom di tabel transaksi
--   - pelanggan.id_pelanggan  → kolom PK di tabel pelanggan
-- -------------------------------------------------------------

-- Hapus constraint lama jika ada (aman dijalankan ulang)
ALTER TABLE public.transaksi
  DROP CONSTRAINT IF EXISTS fk_transaksi_pelanggan;

-- Tambahkan FK constraint
ALTER TABLE public.transaksi
  ADD CONSTRAINT fk_transaksi_pelanggan
  FOREIGN KEY (id_pelanggan)
  REFERENCES public.pelanggan (id_pelanggan)
  ON DELETE SET NULL
  ON UPDATE CASCADE;


-- -------------------------------------------------------------
-- LANGKAH 3: Pastikan RLS pelanggan mengizinkan akses
-- (skip jika sudah ada policy yang sesuai)
-- -------------------------------------------------------------

-- Aktifkan RLS jika belum
ALTER TABLE public.pelanggan ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Admin can view all pelanggan"  ON public.pelanggan;
DROP POLICY IF EXISTS "Member can view pelanggan"     ON public.pelanggan;
DROP POLICY IF EXISTS "Admin can insert pelanggan"    ON public.pelanggan;
DROP POLICY IF EXISTS "Admin can update pelanggan"    ON public.pelanggan;
DROP POLICY IF EXISTS "Admin can delete pelanggan"    ON public.pelanggan;

-- Admin: full akses
CREATE POLICY "Admin can view all pelanggan"
  ON public.pelanggan FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can insert pelanggan"
  ON public.pelanggan FOR INSERT
  WITH CHECK (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update pelanggan"
  ON public.pelanggan FOR UPDATE
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete pelanggan"
  ON public.pelanggan FOR DELETE
  USING (public.get_my_role() = 'Admin');

-- Member: hanya bisa baca
CREATE POLICY "Member can view pelanggan"
  ON public.pelanggan FOR SELECT
  USING (public.get_my_role() IN ('Admin', 'Member'));


-- -------------------------------------------------------------
-- LANGKAH 4: Verifikasi FK berhasil dibuat
-- -------------------------------------------------------------
SELECT
  tc.constraint_name,
  tc.table_name         AS from_table,
  kcu.column_name       AS from_column,
  ccu.table_name        AS to_table,
  ccu.column_name       AS to_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = 'transaksi';
