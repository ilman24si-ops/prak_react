-- =============================================================
-- SETUP TABEL: testimonials
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  rating      INTEGER     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_approved BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.testimonials IS 'Testimoni pelanggan — Admin approve sebelum tampil di publik';

-- Auto update updated_at
DROP TRIGGER IF EXISTS testimonials_set_updated_at ON public.testimonials;
CREATE TRIGGER testimonials_set_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id    ON public.testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved   ON public.testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created    ON public.testimonials(created_at DESC);

-- RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved testimonials"  ON public.testimonials;
DROP POLICY IF EXISTS "Member can insert testimonial"          ON public.testimonials;
DROP POLICY IF EXISTS "Member can view own testimonial"        ON public.testimonials;
DROP POLICY IF EXISTS "Admin can view all testimonials"        ON public.testimonials;
DROP POLICY IF EXISTS "Admin can update testimonials"          ON public.testimonials;
DROP POLICY IF EXISTS "Admin can delete testimonials"          ON public.testimonials;

-- Publik (tidak login): hanya tampil yang sudah diapprove
CREATE POLICY "Anyone can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (is_approved = TRUE);

-- Member: bisa lihat testimonial sendiri (termasuk yang belum approve)
CREATE POLICY "Member can view own testimonial"
  ON public.testimonials FOR SELECT
  USING (auth.uid() = user_id);

-- Member: bisa submit testimoni
CREATE POLICY "Member can insert testimonial"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.get_my_role() IN ('Admin', 'Member'));

-- Admin: full akses
CREATE POLICY "Admin can view all testimonials"
  ON public.testimonials FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update testimonials"
  ON public.testimonials FOR UPDATE
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete testimonials"
  ON public.testimonials FOR DELETE
  USING (public.get_my_role() = 'Admin');

-- Verifikasi
SELECT 'testimonials created' AS status;
