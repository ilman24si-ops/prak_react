-- =================================================================
-- SETUP TABEL USERS + PROFILES + TRIGGER OTOMATIS
-- 
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
--
-- Arsitektur:
--   auth.users       → tabel internal Supabase (email, password hash)
--   public.users     → tabel publik berisi data registrasi user
--   public.profiles  → tabel profil tambahan (role, poin, tier)
--
-- Flow: Register → auth.users ← trigger → public.users + public.profiles
-- =================================================================


-- -----------------------------------------------------------------
-- BAGIAN 1: TABEL public.users
-- Menyimpan data dasar user yang bisa diakses dari aplikasi
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT        NOT NULL,
  full_name    TEXT        NOT NULL DEFAULT '',
  phone        TEXT,
  avatar_url   TEXT,
  is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Data registrasi user, sinkron otomatis dari auth.users';
COMMENT ON COLUMN public.users.id IS 'UUID sama dengan auth.users.id';
COMMENT ON COLUMN public.users.email IS 'Email login user';
COMMENT ON COLUMN public.users.full_name IS 'Nama lengkap dari form registrasi';
COMMENT ON COLUMN public.users.is_active IS 'False = akun dinonaktifkan oleh Admin';


-- -----------------------------------------------------------------
-- BAGIAN 2: TABEL public.profiles
-- Menyimpan data role, poin loyalitas, dan tier keanggotaan
-- -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL DEFAULT '',
  role        TEXT        NOT NULL DEFAULT 'Guest'
                          CHECK (role IN ('Admin', 'Member', 'Guest')),
  points      INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0),
  tier        TEXT        NOT NULL DEFAULT 'Bronze'
                          CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Role dan data loyalitas user';
COMMENT ON COLUMN public.profiles.role IS 'Admin | Member | Guest';
COMMENT ON COLUMN public.profiles.tier IS 'Bronze | Silver | Gold berdasarkan poin';


-- -----------------------------------------------------------------
-- BAGIAN 3: FUNGSI TRIGGER — auto insert saat user baru daftar
-- Dipanggil setelah INSERT ke auth.users (saat supabase.auth.signUp)
-- -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_email     TEXT;
BEGIN
  -- Ambil data dari metadata yang dikirim saat signUp
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_email     := COALESCE(NEW.email, '');

  -- 1. Insert ke public.users
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, v_email, v_full_name)
  ON CONFLICT (id) DO NOTHING;

  -- 2. Insert ke public.profiles (role default = 'Guest')
  INSERT INTO public.profiles (id, full_name, role, points, tier)
  VALUES (NEW.id, v_full_name, 'Guest', 0, 'Bronze')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;


-- -----------------------------------------------------------------
-- BAGIAN 4: PASANG TRIGGER ke auth.users
-- -----------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- -----------------------------------------------------------------
-- BAGIAN 5: FUNGSI TRIGGER — auto update kolom updated_at
-- -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Pasang ke public.users
DROP TRIGGER IF EXISTS users_set_updated_at ON public.users;
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Pasang ke public.profiles
DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- -----------------------------------------------------------------
-- BAGIAN 6: ROW LEVEL SECURITY (RLS) — public.users
-- -----------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own user data"    ON public.users;
DROP POLICY IF EXISTS "Users can update own user data"  ON public.users;
DROP POLICY IF EXISTS "Admin can view all users"        ON public.users;
DROP POLICY IF EXISTS "Admin can update all users"      ON public.users;
DROP POLICY IF EXISTS "Admin can delete users"          ON public.users;

-- User biasa: baca data sendiri
CREATE POLICY "Users can view own user data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- User biasa: update nama & phone sendiri
CREATE POLICY "Users can update own user data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admin: baca semua users
CREATE POLICY "Admin can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );

-- Admin: update semua users
CREATE POLICY "Admin can update all users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );

-- Admin: hapus users
CREATE POLICY "Admin can delete users"
  ON public.users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );


-- -----------------------------------------------------------------
-- BAGIAN 7: ROW LEVEL SECURITY (RLS) — public.profiles
-- -----------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"  ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can delete profiles"     ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );

CREATE POLICY "Admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );

CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'Admin'
    )
  );


-- -----------------------------------------------------------------
-- BAGIAN 8: SINKRONISASI USER LAMA
-- Jika sudah ada user di auth.users tapi belum masuk public.users
-- atau public.profiles, insert sekarang.
-- -----------------------------------------------------------------
-- Sync ke public.users
INSERT INTO public.users (id, email, full_name)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(u.raw_user_meta_data->>'full_name', '')
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = u.id
);

-- Sync ke public.profiles
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


-- -----------------------------------------------------------------
-- BAGIAN 9: SET ADMIN PERTAMA (ganti email sesuai akun Anda)
-- Uncomment dan jalankan SETELAH script utama berhasil
-- -----------------------------------------------------------------
UPDATE public.profiles
SET role = 'Admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'ilman@gmail.com' LIMIT 1
);


-- -----------------------------------------------------------------
-- CEK HASIL — jalankan query ini untuk verifikasi
-- -----------------------------------------------------------------
-- SELECT
--   u.id,
--   u.email,
--   u.full_name,
--   u.is_active,
--   u.created_at,
--   p.role,
--   p.points,
--   p.tier
-- FROM public.users u
-- JOIN public.profiles p ON p.id = u.id
-- ORDER BY u.created_at DESC;
