-- =============================================================
-- SETUP TABEL CUSTOMERS + SEED DATA 1000 PELANGGAN
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- =============================================================

-- -------------------------------------------------------------
-- 1. BUAT TABEL CUSTOMERS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id            TEXT        PRIMARY KEY,          -- e.g. CUST1001
  name          TEXT        NOT NULL,
  email         TEXT,
  phone         TEXT,
  address       TEXT,
  no_ktp        TEXT,
  gender        TEXT,
  birth_date    DATE,
  member_status TEXT        DEFAULT 'Tidak Aktif',
  segment       TEXT        DEFAULT 'Inactive',
  total_trx     INTEGER     DEFAULT 0,
  total_amount  BIGINT      DEFAULT 0,
  avg_amount    BIGINT      DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.customers IS 'Data pelanggan Apotek Keluarga 25';

-- Auto update updated_at
DROP TRIGGER IF EXISTS customers_set_updated_at ON public.customers;
CREATE TRIGGER customers_set_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can view all customers"   ON public.customers;
DROP POLICY IF EXISTS "Admin can insert customers"     ON public.customers;
DROP POLICY IF EXISTS "Admin can update customers"     ON public.customers;
DROP POLICY IF EXISTS "Admin can delete customers"     ON public.customers;
DROP POLICY IF EXISTS "Member can view customers"      ON public.customers;

CREATE POLICY "Admin can view all customers"
  ON public.customers FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update customers"
  ON public.customers FOR UPDATE
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete customers"
  ON public.customers FOR DELETE
  USING (public.get_my_role() = 'Admin');

-- Member bisa lihat (untuk halaman Products/Browse)
CREATE POLICY "Member can view customers"
  ON public.customers FOR SELECT
  USING (public.get_my_role() IN ('Admin','Member'));

-- -------------------------------------------------------------
-- 2. HAPUS DATA LAMA (untuk re-seed bersih)
-- -------------------------------------------------------------
TRUNCATE TABLE public.customers RESTART IDENTITY CASCADE;

-- -------------------------------------------------------------
-- 3. SEED DATA 1000 PELANGGAN
-- -------------------------------------------------------------
INSERT INTO public.customers
  (id, name, email, phone, address, no_ktp, gender, birth_date, member_status, segment, total_trx, total_amount, avg_amount)
VALUES
('CUST1001','Hendra Gunarso','hendra282@yahoo.com','08958196001','Jl. Durian No.36','1472081710619196','Laki-laki','1959-03-13','Tidak Aktif','Inactive',0,0,0),
('CUST1002','Satria Latif','satria226@outlook.com','08972654235','Jl. Gatot Subroto No.72','1471031302825636','Laki-laki','1950-08-01','Tidak Aktif','Inactive',0,0,0),
('CUST1003','Ani Fadillah','ani471@gmail.com','08229593103','Jl. Delima No.21','1473032804666228','Perempuan','1999-07-12','Tidak Aktif','Inactive',0,0,0),
('CUST1004','Fira Zainuddin','fira855@hotmail.com','08214192832','Jl. Nangka No.95','1474130911953599','Perempuan','1981-11-15','Tidak Aktif','Inactive',0,0,0),
('CUST1005','Citra Nugroho','citra842@gmail.com','08123953767','Jl. Melati No.103','1472090504958831','Perempuan','1974-01-08','Tidak Aktif','Inactive',0,0,0),
('CUST1006','Bunga Wahyudi','bunga409@hotmail.com','08521012269','Jl. Durian No.36','1471131310898670','Perempuan','1995-09-18','Tidak Aktif','Inactive',0,0,0),
('CUST1007','Dewi Cahyono','dewi739@gmail.com','08975146270','Jl. Pattimura No.138','1473172503921744','Perempuan','1973-12-09','Tidak Aktif','Inactive',0,0,0),
('CUST1008','Lestari Xander','lestari204@yahoo.com','08538095701','Jl. Anggrek No.196','1473292705750950','Perempuan','1964-06-29','Tidak Aktif','Inactive',0,0,0),
('CUST1009','Hadi Setiawan','hadi750@outlook.com','08972278248','Jl. HR. Soebrantas No.195','1474071812725108','Laki-laki','1997-10-16','Tidak Aktif','Inactive',0,0,0),
('CUST1010','Tanti Nurdiana','tanti922@outlook.com','08125098393','Jl. Imam Bonjol No.64','1471032311633751','Perempuan','1970-02-27','Tidak Aktif','Inactive',0,0,0),
('CUST1011','Dedi Ginanjar','dedi73@yahoo.com','08218299737','Jl. Merpati No.172','1474070402875805','Laki-laki','1993-07-20','Tidak Aktif','Inactive',0,0,0),
('CUST1012','Zara Oktavian','zara885@gmail.com','08116513338','Jl. Pattimura No.168','1474051403777580','Perempuan','1958-10-30','Tidak Aktif','Inactive',0,0,0),
('CUST1013','Gunawan Nurdiana','gunawan828@gmail.com','08980132677','Jl. Tuanku Tambusai No.167','1472281301706210','Laki-laki','1998-07-01','Tidak Aktif','Inactive',0,0,0),
('CUST1014','Wawan Suryadi','wawan949@outlook.com','08957234309','Jl. Garuda No.109','1471241101639572','Laki-laki','1999-11-11','Tidak Aktif','Inactive',0,0,0),
('CUST1015','Lestari Supriyadi','lestari162@gmail.com','08129136193','Jl. Setia Budi No.21','1471200307979261','Perempuan','1966-09-03','Tidak Aktif','Inactive',0,0,0),
('CUST1016','Elin Kurniawan','elin686@hotmail.com','08134751079','Jl. Durian No.68','1471031804924346','Perempuan','1985-07-05','Tidak Aktif','Inactive',0,0,0),
('CUST1017','Rizki Pratama','rizki901@yahoo.com','08528498084','Jl. Anggrek No.73','1471290505671754','Laki-laki','1964-02-26','Tidak Aktif','Inactive',0,0,0),
('CUST1018','Haris Basuki','haris620@yahoo.com','08954874016','Jl. Teuku Umar No.88','1473020106684292','Laki-laki','1968-04-07','Tidak Aktif','Inactive',0,0,0),
('CUST1019','Erwin Utama','erwin723@outlook.com','08122805982','Jl. Diponegoro No.3','1474050205830654','Laki-laki','1960-01-14','Tidak Aktif','Inactive',0,0,0),
('CUST1020','Wati Cahyono','wati256@gmail.com','08996923226','Jl. Anggrek No.200','1471062406864066','Perempuan','2000-03-25','Tidak Aktif','Inactive',0,0,0),
('CUST1021','Putri Damayanti','putri111@outlook.com','08217543303','Jl. Tuanku Tambusai No.121','1474110902775754','Perempuan','1969-12-15','Tidak Aktif','Inactive',0,0,0),
('CUST1022','Prita Ginanjar','prita962@gmail.com','08584019655','Jl. Imam Bonjol No.67','1474201702849447','Perempuan','1966-01-08','Tidak Aktif','Inactive',0,0,0),
('CUST1023','Fauzi Kusuma','fauzi726@outlook.com','08953561595','Jl. Sudirman No.134','1471241009796692','Laki-laki','1998-04-22','Tidak Aktif','Inactive',0,0,0),
('CUST1024','Yuli Damayanti','yuli303@yahoo.com','08952994680','Jl. Riau No.108','1473100707979940','Perempuan','1984-01-06','Tidak Aktif','Inactive',0,0,0),
('CUST1025','Gina Nurdiana','gina453@yahoo.com','08951489513','Jl. Setia Budi No.122','1473082604690401','Perempuan','1965-03-23','Tidak Aktif','Inactive',0,0,0),
('CUST1026','Endra Purwanto','endra626@gmail.com','08216763201','Jl. Mawar No.107','1474080612937612','Laki-laki','2001-08-24','Tidak Aktif','Inactive',0,0,0),
('CUST1027','Endra Permata','endra468@yahoo.com','08539579868','Jl. Mawar No.171','1474290612907374','Laki-laki','1997-08-26','Tidak Aktif','Inactive',0,0,0),
('CUST1028','Clara Zainuddin','clara284@outlook.com','08521434558','Jl. Cut Nyak Dien No.62','1471050504842504','Perempuan','1974-08-21','Tidak Aktif','Inactive',0,0,0),
('CUST1029','Fajar Latif','fajar418@hotmail.com','08113669096','Jl. Diponegoro No.120','1474011205846866','Laki-laki','1987-04-21','Tidak Aktif','Inactive',0,0,0),
('CUST1030','Khairul Nugroho','khairul280@outlook.com','08236272980','Jl. Flamboyan No.8','1474191911611376','Laki-laki','1984-11-20','Tidak Aktif','Inactive',0,0,0),
('CUST1031','Maya Oktavian','maya187@gmail.com','08217556464','Jl. Merpati No.98','1471160112940854','Perempuan','1979-05-15','Tidak Aktif','Inactive',0,0,0),
('CUST1032','Zahra Adiputra','zahra71@gmail.com','08980923271','Jl. Sudirman No.64','1472152305832750','Perempuan','1967-11-20','Tidak Aktif','Inactive',0,0,0),
('CUST1033','Surya Effendi','surya111@gmail.com','08513193149','Jl. Garuda No.148','1471261901828729','Laki-laki','1983-09-03','Tidak Aktif','Inactive',0,0,0),
('CUST1034','Tanti Pratama','tanti519@hotmail.com','08126572628','Jl. Sudirman No.108','1473202609907617','Perempuan','1993-12-23','Tidak Aktif','Inactive',0,0,0),
('CUST1035','Fani Firmansyah','fani873@yahoo.com','08217996507','Jl. HR. Soebrantas No.72','1473061604824233','Perempuan','1990-06-11','Tidak Aktif','Inactive',0,0,0),
('CUST1036','Grace Xander','grace719@hotmail.com','08211367837','Jl. Diponegoro No.3','1474152601654821','Perempuan','1996-05-07','Tidak Aktif','Inactive',0,0,0),
('CUST1037','Zainal Damayanti','zainal250@hotmail.com','08528856855','Jl. Pattimura No.149','1474091005741977','Laki-laki','1983-02-09','Tidak Aktif','Inactive',0,0,0),
('CUST1038','Nugroho Permata','nugroho761@yahoo.com','08229894134','Jl. Riau No.56','1472120605608752','Laki-laki','1993-06-10','Tidak Aktif','Inactive',0,0,0),
('CUST1039','Imam Kusuma','imam998@gmail.com','08957109477','Jl. Diponegoro No.75','1474110601767828','Laki-laki','1961-04-30','Tidak Aktif','Inactive',0,0,0),
('CUST1040','Fajar Kartono','fajar504@gmail.com','08132941318','Jl. Gatot Subroto No.162','1474202010748562','Laki-laki','1954-10-23','Tidak Aktif','Inactive',0,0,0),
('CUST1041','Erika Nurdiana','erika305@outlook.com','08119133412','Jl. Garuda No.146','1472061802700044','Perempuan','2005-09-18','Tidak Aktif','Inactive',0,0,0),
('CUST1042','Erika Damayanti','erika609@outlook.com','08224713493','Jl. Garuda No.9','1474041804694353','Perempuan','1970-10-08','Tidak Aktif','Inactive',0,0,0),
('CUST1043','Gunawan Hidayat','gunawan170@hotmail.com','08994717464','Jl. A. Yani No.192','1474150310627079','Laki-laki','2001-01-24','Tidak Aktif','Inactive',0,0,0),
('CUST1044','Diana Wijaya','diana94@yahoo.com','08114902787','Jl. Pattimura No.148','1473061907911495','Perempuan','2002-09-03','Tidak Aktif','Inactive',0,0,0),
('CUST1045','Pipit Latif','pipit342@hotmail.com','08236746807','Jl. Pattimura No.27','1471110906676623','Perempuan','1964-06-05','Tidak Aktif','Inactive',0,0,0),
('CUST1046','Satria Oktavian','satria424@gmail.com','08587703482','Jl. Riau No.133','1473152308670473','Laki-laki','1982-06-16','Tidak Aktif','Inactive',0,0,0),
('CUST1047','Surya Effendi 2','surya565@gmail.com','08211712748','Jl. Diponegoro No.105','1473142708903994','Laki-laki','1958-05-13','Tidak Aktif','Inactive',0,0,0),
('CUST1048','Nina Junaedi','nina196@yahoo.com','08238404499','Jl. HR. Soebrantas No.71','1474280508947936','Perempuan','1987-03-24','Tidak Aktif','Inactive',0,0,0),
('CUST1049','Nadia Utama','nadia782@outlook.com','08963963605','Jl. Mawar No.83','1474232607842493','Perempuan','1966-12-04','Tidak Aktif','Inactive',0,0,0),
('CUST1050','Fitri Wibowo','fitri515@hotmail.com','08537026217','Jl. Imam Bonjol No.113','1473112012851316','Perempuan','1958-12-12','Tidak Aktif','Inactive',0,0,0),
