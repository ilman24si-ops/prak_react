-- =============================================================
-- SETUP TABEL PROFILES + AUTO-SYNC DARI AUTH.USERS
-- Jalankan seluruh script ini di:
--   Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================


-- -------------------------------------------------------------
-- 1. BUAT TABEL PROFILES
--    Kolom id di-link ke auth.users (UUID) agar sinkron otomatis
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL DEFAULT '',
  role        TEXT        NOT NULL DEFAULT 'Guest'
                          CHECK (role IN ('Admin', 'Member', 'Guest')),
  points      INTEGER     NOT NULL DEFAULT 0,
  tier        TEXT        NOT NULL DEFAULT 'Bronze'
                          CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- -------------------------------------------------------------
-- 2. TRIGGER FUNCTION: insert ke profiles saat user baru daftar
--    - Mengambil full_name dari raw_user_meta_data (dikirim saat signUp)
--    - Role default = 'Guest' (Admin bisa upgrade lewat User Management)
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, points, tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'Guest',   -- default role; Admin bisa ubah ke Member/Admin
    0,
    'Bronze'
  )
  ON CONFLICT (id) DO NOTHING; -- aman jika dipanggil lebih dari sekali
  RETURN NEW;
END;
$$;


-- -------------------------------------------------------------
-- 3. PASANG TRIGGER ke tabel auth.users
--    Trigger ini terpanggil SETIAP KALI user baru dibuat
-- -------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- -------------------------------------------------------------
-- 4. TRIGGER FUNCTION: update kolom updated_at otomatis
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- -------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS)
--    - Setiap user hanya bisa baca/edit profilnya sendiri
--    - Admin bisa membaca & mengupdate SEMUA profil
-- -------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Users can view own profile"     ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles"  ON public.profiles;
DROP POLICY IF EXISTS "Admin can delete profiles"      ON public.profiles;

-- User biasa: baca profil sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- User biasa: update profil sendiri (nama, dll)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Admin: baca semua profil (untuk halaman User Management)
CREATE POLICY "Admin can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );

-- Admin: update semua profil (ganti role, poin, tier)
CREATE POLICY "Admin can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );

-- Admin: hapus profil user lain
CREATE POLICY "Admin can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );


-- -------------------------------------------------------------
-- 6. SINKRONISASI USER LAMA
--    Jika sudah ada user di auth.users tapi belum ada di profiles,
--    insert mereka sekarang dengan role 'Guest'
-- -------------------------------------------------------------
INSERT INTO public.profiles (id, full_name, role, points, tier)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  'Guest',
  0,
  'Bronze'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);


-- -------------------------------------------------------------
-- 7. JADIKAN AKUN PERTAMA SEBAGAI ADMIN (OPSIONAL)
--    Uncomment baris di bawah dan ganti email sesuai akun admin Anda
-- -------------------------------------------------------------
-- UPDATE public.profiles
-- SET role = 'Admin'
-- WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'admin@email.com' LIMIT 1
-- );


-- -------------------------------------------------------------
-- SELESAI — Cek hasilnya:
-- SELECT * FROM public.profiles;
-- -------------------------------------------------------------
