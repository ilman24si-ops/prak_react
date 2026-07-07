-- =============================================================
-- FIX: Infinite recursion di RLS policy tabel profiles
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

-- -------------------------------------------------------------
-- 1. Hapus semua policy lama yang menyebabkan rekursi
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"  ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can delete profiles"     ON public.profiles;

DROP POLICY IF EXISTS "Users can view own user data"   ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users"       ON public.users;
DROP POLICY IF EXISTS "Admin can update all users"     ON public.users;
DROP POLICY IF EXISTS "Admin can delete users"         ON public.users;


-- -------------------------------------------------------------
-- 2. Buat helper function SECURITY DEFINER
--    Fungsi ini bypass RLS saat dipanggil, sehingga tidak rekursi
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;


-- -------------------------------------------------------------
-- 3. Buat ulang RLS policy untuk public.profiles
--    Gunakan get_my_role() bukan subquery ke profiles
-- -------------------------------------------------------------

-- Semua user yang login bisa baca profil sendiri
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Semua user yang login bisa update profil sendiri
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin bisa baca semua profil (pakai fungsi, bukan subquery)
CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() = 'Admin');

-- Admin bisa update semua profil
CREATE POLICY "Admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'Admin');

-- Admin bisa hapus profil
CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'Admin');


-- -------------------------------------------------------------
-- 4. Buat ulang RLS policy untuk public.users (jika ada)
-- -------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN

    -- User bisa baca data sendiri
    EXECUTE 'CREATE POLICY "Users can view own user data"
      ON public.users FOR SELECT
      USING (auth.uid() = id)';

    -- User bisa update data sendiri
    EXECUTE 'CREATE POLICY "Users can update own user data"
      ON public.users FOR UPDATE
      USING (auth.uid() = id)';

    -- Admin bisa baca semua
    EXECUTE 'CREATE POLICY "Admin can view all users"
      ON public.users FOR SELECT
      USING (public.get_my_role() = ''Admin'')';

    -- Admin bisa update semua
    EXECUTE 'CREATE POLICY "Admin can update all users"
      ON public.users FOR UPDATE
      USING (public.get_my_role() = ''Admin'')';

    -- Admin bisa hapus
    EXECUTE 'CREATE POLICY "Admin can delete users"
      ON public.users FOR DELETE
      USING (public.get_my_role() = ''Admin'')';

  END IF;
END;
$$;


-- -------------------------------------------------------------
-- 5. Set ilman sebagai Admin
-- -------------------------------------------------------------
INSERT INTO public.profiles (id, full_name, role, points, tier)
SELECT
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'ilman'),
  'Admin',
  0,
  'Bronze'
FROM auth.users
WHERE email = 'ilman@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'Admin';


-- -------------------------------------------------------------
-- Verifikasi
-- -------------------------------------------------------------
SELECT au.email, p.role
FROM auth.users au
JOIN public.profiles p ON p.id = au.id
WHERE au.email = 'ilman@gmail.com';
