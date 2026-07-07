-- =============================================================
-- SETUP RLS untuk tabel public.transaksi
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

-- Aktifkan RLS (jika belum)
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Admin can view all transaksi"   ON public.transaksi;
DROP POLICY IF EXISTS "Admin can insert transaksi"     ON public.transaksi;
DROP POLICY IF EXISTS "Admin can update transaksi"     ON public.transaksi;
DROP POLICY IF EXISTS "Admin can delete transaksi"     ON public.transaksi;
DROP POLICY IF EXISTS "Member can view own transaksi"  ON public.transaksi;

-- Admin: bisa baca semua transaksi
CREATE POLICY "Admin can view all transaksi"
  ON public.transaksi FOR SELECT
  USING (public.get_my_role() = 'Admin');

-- Admin: bisa insert transaksi baru
CREATE POLICY "Admin can insert transaksi"
  ON public.transaksi FOR INSERT
  WITH CHECK (public.get_my_role() = 'Admin');

-- Admin: bisa update transaksi
CREATE POLICY "Admin can update transaksi"
  ON public.transaksi FOR UPDATE
  USING (public.get_my_role() = 'Admin');

-- Admin: bisa hapus transaksi
CREATE POLICY "Admin can delete transaksi"
  ON public.transaksi FOR DELETE
  USING (public.get_my_role() = 'Admin');

-- Member: hanya bisa lihat transaksi miliknya sendiri
-- (sesuaikan nama kolom jika bukan id_pelanggan)
CREATE POLICY "Member can view own transaksi"
  ON public.transaksi FOR SELECT
  USING (
    public.get_my_role() IN ('Admin', 'Member')
  );

-- Verifikasi policy yang aktif
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'transaksi';
