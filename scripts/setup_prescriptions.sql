-- =============================================================
-- SETUP TABEL: prescriptions (resep dokter)
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

CREATE TABLE IF NOT EXISTS public.prescriptions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_name TEXT,
  notes       TEXT,
  image_url   TEXT,
  status      TEXT        NOT NULL DEFAULT 'Pending'
                          CHECK (status IN ('Pending', 'Processing', 'Completed', 'Rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.prescriptions IS 'Resep dokter yang diupload oleh member';

-- Auto update updated_at
DROP TRIGGER IF EXISTS prescriptions_set_updated_at ON public.prescriptions;
CREATE TRIGGER prescriptions_set_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id   ON public.prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status    ON public.prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created   ON public.prescriptions(created_at DESC);

-- RLS
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Member can view own prescriptions"   ON public.prescriptions;
DROP POLICY IF EXISTS "Member can insert prescriptions"     ON public.prescriptions;
DROP POLICY IF EXISTS "Admin can view all prescriptions"    ON public.prescriptions;
DROP POLICY IF EXISTS "Admin can update prescription status" ON public.prescriptions;

-- Member: hanya bisa lihat dan upload resep milik sendiri
CREATE POLICY "Member can view own prescriptions"
  ON public.prescriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Member can insert prescriptions"
  ON public.prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.get_my_role() IN ('Admin', 'Member'));

-- Admin: bisa lihat dan update semua resep
CREATE POLICY "Admin can view all prescriptions"
  ON public.prescriptions FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update prescription status"
  ON public.prescriptions FOR UPDATE
  USING (public.get_my_role() = 'Admin');

-- Verifikasi
SELECT 'prescriptions created' AS status;
