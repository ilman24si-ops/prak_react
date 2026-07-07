-- =============================================================
-- SETUP TABEL: articles + SEED 10 ARTIKEL KESEHATAN
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query → Run
-- Prasyarat: setup_users_and_profiles.sql sudah dijalankan
-- =============================================================


-- -------------------------------------------------------------
-- BAGIAN 1: BUAT TABEL articles
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  author       TEXT        NOT NULL DEFAULT 'Apotek Keluarga 25',
  image_url    TEXT,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.articles IS 'Artikel kesehatan yang dikelola Admin dan dibaca Member/Guest';

-- Auto update updated_at
DROP TRIGGER IF EXISTS articles_set_updated_at ON public.articles;
CREATE TRIGGER articles_set_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON public.articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at   ON public.articles(created_at DESC);

-- RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can view all articles"        ON public.articles;
DROP POLICY IF EXISTS "Admin can insert articles"          ON public.articles;
DROP POLICY IF EXISTS "Admin can update articles"          ON public.articles;
DROP POLICY IF EXISTS "Admin can delete articles"          ON public.articles;

-- Semua orang (termasuk tidak login) bisa baca artikel yang sudah dipublikasikan
CREATE POLICY "Anyone can view published articles"
  ON public.articles FOR SELECT
  USING (is_published = TRUE);

-- Admin bisa baca semua (termasuk draft)
CREATE POLICY "Admin can view all articles"
  ON public.articles FOR SELECT
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can insert articles"
  ON public.articles FOR INSERT
  WITH CHECK (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can update articles"
  ON public.articles FOR UPDATE
  USING (public.get_my_role() = 'Admin');

CREATE POLICY "Admin can delete articles"
  ON public.articles FOR DELETE
  USING (public.get_my_role() = 'Admin');


-- -------------------------------------------------------------
-- BAGIAN 2: SEED 10 ARTIKEL KESEHATAN
-- -------------------------------------------------------------
INSERT INTO public.articles (title, content, author, is_published, created_at) VALUES

(
  'Cara Minum Obat yang Benar Agar Lebih Efektif',
  'Minum obat dengan cara yang benar sangat penting agar obat bekerja secara optimal. Berikut panduan yang perlu diperhatikan:

1. Baca label dan anjuran dosis
Selalu baca petunjuk yang tertera pada kemasan atau resep dokter. Jangan menambah atau mengurangi dosis tanpa sepengetahuan apoteker atau dokter.

2. Perhatikan waktu minum obat
Beberapa obat harus diminum sebelum makan karena lebih cepat diserap lambung kosong, sementara obat lain harus diminum sesudah makan untuk menghindari iritasi lambung. Ikuti anjuran dengan teliti.

3. Gunakan air putih
Minumlah obat dengan segelas penuh air putih (±200 ml). Hindari minum obat dengan susu, jus jeruk, atau minuman berkafein karena dapat mengganggu penyerapan.

4. Jangan menghancurkan atau membelah tablet kecuali diizinkan
Beberapa tablet memiliki lapisan khusus yang melindungi lambung atau mengatur pelepasan zat aktif. Menghancurkannya bisa merusak fungsi tersebut.

5. Habiskan antibiotik sesuai resep
Antibiotik harus diminum sampai habis meski gejala sudah membaik. Berhenti di tengah jalan bisa menyebabkan bakteri jadi resisten.

Konsultasikan ke apoteker kami jika ada pertanyaan mengenai obat Anda.',
  'Tim Apoteker Keluarga 25',
  TRUE,
  NOW() - INTERVAL '10 days'
),

(
  'Mengenal Obat Generik vs Obat Bermerek: Mana yang Lebih Baik?',
  'Banyak pasien bertanya-tanya tentang perbedaan obat generik dan obat bermerek. Inilah penjelasannya:

Apa itu obat generik?
Obat generik adalah obat yang mengandung zat aktif sama dengan obat bermerek, namun dijual tanpa nama dagang. Obat generik diproduksi setelah hak paten obat bermerek habis.

Apakah kualitasnya sama?
Ya. Secara hukum, obat generik harus memenuhi standar bioekivalensi yang sama dengan obat bermerek, artinya efek terapeutiknya setara. BPOM Indonesia mengawasi ketat proses produksinya.

Mengapa harganya lebih murah?
Produsen obat generik tidak mengeluarkan biaya riset dan pengembangan seperti produsen obat bermerek, sehingga harga jualnya jauh lebih terjangkau.

Kapan sebaiknya memilih obat bermerek?
Untuk beberapa kondisi tertentu, seperti epilepsi atau transplantasi organ, dokter mungkin meresepkan obat bermerek spesifik karena pertimbangan stabilitas kadar obat dalam darah. Selalu konsultasikan ke dokter.

Kesimpulan: Untuk sebagian besar kondisi, obat generik adalah pilihan cerdas yang aman, efektif, dan hemat biaya.',
  'dr. Farhan, Konsultan Apotek Keluarga 25',
  TRUE,
  NOW() - INTERVAL '9 days'
),

(
  'Tips Menjaga Daya Tahan Tubuh di Musim Hujan',
  'Musim hujan membawa kelembapan tinggi yang menjadi tempat berkembang biak virus dan bakteri. Berikut cara menjaga imunitas tubuh:

1. Konsumsi vitamin C dan zinc
Vitamin C (50–1000 mg/hari) dan zinc membantu memperkuat sistem imun. Bisa didapat dari buah jeruk, kiwi, paprika, atau suplemen.

2. Tidur cukup 7–9 jam
Saat tidur, tubuh memproduksi sitokin — protein yang melawan infeksi dan peradangan. Kurang tidur secara signifikan melemahkan imun.

3. Perbanyak konsumsi air putih
Dehidrasi ringan sekalipun bisa melemahkan pertahanan tubuh. Target minimal 8 gelas per hari.

4. Olahraga ringan rutin
Olahraga 30 menit sehari seperti jalan kaki atau senam ringan terbukti meningkatkan sirkulasi sel imun.

5. Jaga kebersihan tangan
Cuci tangan dengan sabun minimal 20 detik, terutama sebelum makan dan setelah dari luar ruangan.

6. Konsumsi probiotik
Yogurt, tempe, dan kimchi mengandung probiotik yang menjaga kesehatan flora usus — 70% imunitas berasal dari usus.

7. Kelola stres
Stres kronis meningkatkan hormon kortisol yang menekan sistem imun. Meditasi singkat 10 menit per hari sudah terbukti membantu.',
  'Tim Kesehatan Apotek Keluarga 25',
  TRUE,
  NOW() - INTERVAL '8 days'
),

(
  'Bahaya Menyimpan Obat Sembarangan di Rumah',
  'Penyimpanan obat yang salah dapat menurunkan efektivitas bahkan mengubah obat menjadi berbahaya. Berikut panduan penyimpanan yang benar:

Jauhkan dari paparan sinar matahari langsung
Sinar UV dapat merusak struktur kimia obat. Simpan di tempat teduh atau dalam lemari tertutup.

Hindari tempat lembap seperti kamar mandi
Kelembapan tinggi dapat memecah zat aktif lebih cepat. Banyak orang menyimpan obat di kamar mandi — ini kebiasaan yang harus dihindari.

Simpan di suhu ruangan yang stabil (15–25°C)
Fluktuasi suhu ekstrem merusak obat. Beberapa obat seperti insulin dan suppositoria memerlukan lemari pendingin, tapi bukan freezer.

Obat tidak boleh disimpan di dasbor mobil
Suhu di dalam mobil yang terparkir bisa mencapai 60–70°C, cukup untuk merusak hampir semua jenis obat.

Gunakan wadah aslinya
Kemasan asli dirancang untuk melindungi obat. Jangan pindahkan ke wadah lain kecuali diperlukan dan beri label jelas.

Cek tanggal kedaluwarsa secara rutin
Bersihkan kotak obat keluarga setiap 3 bulan. Obat yang sudah kedaluwarsa jangan dibuang ke wastafel atau toilet — serahkan ke apotek untuk dimusnahkan dengan benar.',
  'Apt. Sari Dewi, S.Farm.',
  TRUE,
  NOW() - INTERVAL '7 days'
),

(
  'Mengenal Hipertensi: Si Pembunuh Diam-Diam',
  'Hipertensi atau tekanan darah tinggi sering disebut "silent killer" karena seringkali tidak menimbulkan gejala yang jelas sampai terjadi komplikasi serius.

Apa itu hipertensi?
Tekanan darah normal adalah di bawah 120/80 mmHg. Hipertensi didiagnosis ketika tekanan darah secara konsisten ≥130/80 mmHg atau lebih.

Faktor risiko:
- Usia di atas 45 tahun
- Riwayat keluarga dengan hipertensi
- Kelebihan berat badan
- Konsumsi garam berlebihan
- Kurang aktivitas fisik
- Merokok dan konsumsi alkohol
- Stres kronis

Gejala yang perlu diwaspadai:
Meski sering tanpa gejala, beberapa orang mengalami sakit kepala di bagian belakang, penglihatan kabur, mimisan, atau detak jantung tidak teratur.

Komplikasi jika tidak ditangani:
Stroke, serangan jantung, gagal ginjal, dan kebutaan adalah komplikasi utama hipertensi yang tidak terkontrol.

Penanganan:
- Modifikasi gaya hidup: diet rendah garam (DASH diet), olahraga rutin, berhenti merokok
- Obat antihipertensi sesuai resep dokter (harus diminum rutin, tidak boleh dihentikan tiba-tiba)
- Monitor tekanan darah secara rutin

Cek tekanan darah Anda gratis di Apotek Keluarga 25 setiap hari kerja.',
  'dr. Rini Kusuma, Sp.PD.',
  TRUE,
  NOW() - INTERVAL '6 days'
),

(
  'Panduan Lengkap Pertolongan Pertama untuk Demam di Rumah',
  'Demam adalah respons alami tubuh melawan infeksi. Tapi kapan harus khawatir dan apa yang bisa dilakukan di rumah?

Definisi demam:
Suhu tubuh ≥38°C (diukur di ketiak). Suhu 37.5°C dianggap demam rendah.

Langkah pertolongan pertama:

1. Kompres hangat (bukan dingin)
Kompres hangat di dahi, leher, dan ketiak membantu penguapan panas dari tubuh. Kompres dingin justru bisa memicu menggigil yang memperparah demam.

2. Beri antipiretik sesuai dosis
Paracetamol: 500–1000 mg untuk dewasa, setiap 4–6 jam. Untuk anak-anak, dosis berdasarkan berat badan (10–15 mg/kg BB). Ibuprofen juga efektif untuk demam disertai nyeri.

3. Perbanyak minum cairan
Demam meningkatkan penguapan cairan tubuh. Pastikan minum air putih, oralit, atau sup hangat lebih banyak dari biasanya.

4. Istirahat total
Biarkan tubuh fokus melawan infeksi. Hindari aktivitas berat.

5. Kenakan pakaian tipis
Jangan selimuti tubuh berlebihan — ini malah menjebak panas.

Kapan harus ke dokter?
- Suhu >39.5°C yang tidak turun setelah 2 jam pemberian antipiretik
- Demam pada bayi di bawah 3 bulan
- Demam disertai ruam, kejang, leher kaku, atau penurunan kesadaran
- Demam lebih dari 3 hari tanpa penyebab yang jelas',
  'Tim Apoteker Keluarga 25',
  TRUE,
  NOW() - INTERVAL '5 days'
),

(
  'Diabetes Tipe 2: Kenali Gejala Awal dan Cara Mencegahnya',
  'Diabetes tipe 2 adalah kondisi di mana tubuh tidak dapat menggunakan insulin secara efektif. Kondisi ini bisa dicegah dan dikelola dengan perubahan gaya hidup.

Gejala awal yang sering diabaikan:
- Sering buang air kecil, terutama malam hari
- Rasa haus berlebihan yang tidak hilang meski sudah minum
- Kelelahan terus-menerus tanpa sebab jelas
- Penglihatan kabur yang datang dan pergi
- Luka yang lama sembuh
- Kesemutan atau mati rasa di tangan dan kaki
- Sering lapar meski baru selesai makan

Faktor risiko:
- Indeks massa tubuh (IMT) ≥25
- Riwayat diabetes dalam keluarga
- Usia di atas 45 tahun
- Kurang aktivitas fisik
- Riwayat diabetes gestasional

Cara mencegah:
1. Turunkan berat badan 5–10% jika kelebihan berat badan
2. Olahraga aerobik minimal 150 menit per minggu
3. Batasi makanan tinggi gula dan karbohidrat sederhana
4. Perbanyak serat dari sayuran dan biji-bijian utuh
5. Berhenti merokok
6. Cek gula darah secara rutin

Tersedia layanan cek gula darah cepat di Apotek Keluarga 25. Hasilnya langsung tersedia dalam 5 menit.',
  'dr. Budi Santoso, Sp.PD.',
  TRUE,
  NOW() - INTERVAL '4 days'
),

(
  'Mengenal Jenis-Jenis Vitamin dan Fungsinya untuk Tubuh',
  'Vitamin adalah zat gizi mikro yang esensial bagi ratusan proses biokimia dalam tubuh. Berikut panduan lengkapnya:

VITAMIN LARUT LEMAK (disimpan di jaringan lemak):

Vitamin A
Fungsi: kesehatan mata, imunitas, pertumbuhan sel. Sumber: hati, wortel, ubi jingga, bayam.

Vitamin D
Fungsi: penyerapan kalsium untuk tulang dan gigi, regulasi imun. Sumber utama: paparan sinar matahari 15–20 menit/hari, ikan salmon, telur. Defisiensi sangat umum pada orang yang jarang keluar ruangan.

Vitamin E
Fungsi: antioksidan kuat, melindungi sel dari kerusakan. Sumber: kacang almond, biji bunga matahari, minyak zaitun.

Vitamin K
Fungsi: pembekuan darah, kesehatan tulang. Sumber: bayam, brokoli, kale.

VITAMIN LARUT AIR (tidak disimpan, harus rutin dikonsumsi):

Vitamin C
Fungsi: imunitas, produksi kolagen, antioksidan. Sumber: jeruk, kiwi, paprika merah, stroberi.

Vitamin B Kompleks (B1, B2, B3, B5, B6, B7, B9, B12)
Fungsi utama: metabolisme energi, fungsi saraf, produksi sel darah merah. Defisiensi B12 umum pada vegetarian/vegan.

Penting: Vitamin larut lemak (A, D, E, K) bisa menumpuk di tubuh jika dikonsumsi berlebihan dan menyebabkan toksisitas. Konsultasikan ke apoteker sebelum mengonsumsi suplemen dosis tinggi.',
  'Apt. Maya Lestari, S.Farm., Apt.',
  TRUE,
  NOW() - INTERVAL '3 days'
),

(
  'Waspadai Interaksi Obat yang Berbahaya',
  'Mengonsumsi lebih dari satu obat sekaligus bisa menyebabkan interaksi yang berbahaya. Inilah yang perlu Anda tahu:

Apa itu interaksi obat?
Interaksi obat terjadi ketika satu obat mempengaruhi cara kerja obat lain — bisa memperlemah, memperkuat, atau menimbulkan efek baru yang tidak diinginkan.

Contoh interaksi penting:

1. Aspirin + Ibuprofen
Keduanya adalah NSAID. Dikonsumsi bersamaan meningkatkan risiko perdarahan lambung signifikan.

2. Antibiotik + Pil KB
Beberapa antibiotik (seperti rifampisin) dapat menurunkan efektivitas kontrasepsi hormonal.

3. Warfarin + Vitamin K / Suplemen herbal
Warfarin (pengencer darah) sangat sensitif terhadap makanan tinggi vitamin K dan banyak suplemen herbal.

4. Antidepresan + Tramadol
Kombinasi ini bisa menyebabkan sindrom serotonin yang mengancam jiwa.

5. Obat hipertensi + Obat flu yang mengandung pseudoefedrin
Pseudoefedrin dapat meningkatkan tekanan darah dan melawan efek obat antihipertensi.

6. Obat tidur / penenang + Alkohol
Kombinasi ini memperkuat efek sedasi dan bisa menyebabkan pernapasan melambat hingga berhenti.

Tips aman:
- Selalu beritahu dokter dan apoteker SEMUA obat yang sedang dikonsumsi, termasuk suplemen dan herbal
- Gunakan satu apotek untuk semua resep agar riwayat obat terpantau
- Konsultasikan ke apoteker Keluarga 25 sebelum menambah obat baru',
  'Apt. Dian Pratiwi, S.Farm., Apt.',
  TRUE,
  NOW() - INTERVAL '2 days'
),

(
  'Tips Kesehatan Mata di Era Digital: Sindrom Mata Komputer',
  'Penggunaan layar digital yang berlebihan menyebabkan Computer Vision Syndrome (CVS) atau sindrom mata komputer. Ini cara mengatasinya:

Gejala CVS:
- Mata lelah, perih, atau terasa berpasir
- Penglihatan kabur sementara setelah menatap layar lama
- Sakit kepala di dahi atau pelipis
- Mata kering atau justru berair
- Nyeri leher dan bahu

Penyebab:
- Mata berkedip 66% lebih jarang saat menatap layar (normal 15–20x/menit, saat menatap layar bisa turun ke 5–7x/menit)
- Kontras layar yang terlalu terang atau terlalu gelap
- Postur yang salah saat bekerja

Solusi 20-20-20:
Setiap 20 menit, alihkan pandangan ke objek yang berjarak 20 kaki (±6 meter) selama 20 detik. Ini memberi waktu otot mata untuk rileks.

Tips tambahan:
1. Atur kecerahan layar setara dengan cahaya sekitar
2. Gunakan mode night light/blue light filter setelah pukul 18.00
3. Posisikan layar 50–70 cm dari mata, sedikit di bawah garis pandang
4. Gunakan tetes mata artificial tears jika mata terasa kering
5. Kacamata anti radiasi blue light bisa membantu mengurangi kelelahan

Tersedia berbagai produk tetes mata dan suplemen kesehatan mata di Apotek Keluarga 25.',
  'Tim Kesehatan Apotek Keluarga 25',
  TRUE,
  NOW() - INTERVAL '1 day'
);


-- -------------------------------------------------------------
-- Verifikasi
-- -------------------------------------------------------------
SELECT id, title, author, is_published, created_at
FROM public.articles
ORDER BY created_at DESC;
