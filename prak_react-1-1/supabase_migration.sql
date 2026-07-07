-- ============================================================
-- JALANKAN SQL INI DI SUPABASE SQL EDITOR
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ── Tabel dokters ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.dokters (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama        text NOT NULL,
  spesialis   text NOT NULL,
  no_hp       text NOT NULL,
  alamat      text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dokters ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can do all operations
CREATE POLICY "Authenticated users full access on dokters"
  ON public.dokters
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── Tabel suppliers ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.suppliers (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama        text NOT NULL,
  kontak      text NOT NULL,
  email       text NOT NULL,
  alamat      text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users full access on suppliers"
  ON public.suppliers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── Tabel pembelian_stok ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pembelian_stok (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_obat     text NOT NULL,
  jumlah        integer NOT NULL CHECK (jumlah > 0),
  harga_satuan  numeric(15, 2) NOT NULL CHECK (harga_satuan >= 0),
  total_harga   numeric(15, 2) GENERATED ALWAYS AS (jumlah * harga_satuan) STORED,
  supplier_id   uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  tanggal_beli  date NOT NULL DEFAULT CURRENT_DATE,
  catatan       text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.pembelian_stok ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users full access on pembelian_stok"
  ON public.pembelian_stok
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── (Opsional) Contoh data awal ───────────────────────────
INSERT INTO public.dokters (nama, spesialis, no_hp, alamat) VALUES
  ('dr. Andi Wijaya', 'Umum', '081234567890', 'Jl. Melati No. 1, Jakarta'),
  ('dr. Sari Dewi', 'Gigi', '082345678901', 'Jl. Anggrek No. 5, Bandung'),
  ('dr. Budi Santoso', 'Penyakit Dalam', '083456789012', 'Jl. Mawar No. 10, Surabaya')
ON CONFLICT DO NOTHING;

INSERT INTO public.suppliers (nama, kontak, email, alamat) VALUES
  ('PT. Kimia Farma', '021-5555001', 'kimiafarma@example.com', 'Jl. Industri No. 1, Jakarta'),
  ('PT. Kalbe Farma', '021-5555002', 'kalbe@example.com', 'Jl. Let. Jend. Suprapto, Jakarta')
ON CONFLICT DO NOTHING;
