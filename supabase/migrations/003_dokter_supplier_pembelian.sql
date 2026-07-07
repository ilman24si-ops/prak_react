-- Migration 003: Kelola Dokter, Supplier, Pembelian Stok
-- Jalankan di Supabase SQL Editor

-- ─────────────────────────────────────────────────────────────────────────────
-- Tabel: dokters
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.dokters (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nama text not null,
  spesialis text not null,
  no_hp text not null,
  alamat text not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Tabel: suppliers
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.suppliers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nama text not null,
  kontak text not null,
  email text not null,
  alamat text not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Tabel: pembelian_stok
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.pembelian_stok (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nama_obat text not null,
  jumlah integer not null check (jumlah > 0),
  harga_satuan numeric not null check (harga_satuan >= 0),
  total_harga numeric generated always as (jumlah * harga_satuan) stored,
  supplier_id uuid references public.suppliers(id) on delete set null,
  tanggal_beli date not null default current_date,
  catatan text
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.dokters enable row level security;
alter table public.suppliers enable row level security;
alter table public.pembelian_stok enable row level security;

-- dokters: admin full access, semua user bisa baca
drop policy if exists "dokters_select" on public.dokters;
create policy "dokters_select" on public.dokters
  for select using (true);

drop policy if exists "dokters_admin_all" on public.dokters;
create policy "dokters_admin_all" on public.dokters
  for all using (public.get_auth_role() = 'Admin');

-- suppliers: admin full access, semua user bisa baca
drop policy if exists "suppliers_select" on public.suppliers;
create policy "suppliers_select" on public.suppliers
  for select using (true);

drop policy if exists "suppliers_admin_all" on public.suppliers;
create policy "suppliers_admin_all" on public.suppliers
  for all using (public.get_auth_role() = 'Admin');

-- pembelian_stok: admin only
drop policy if exists "pembelian_stok_admin_all" on public.pembelian_stok;
create policy "pembelian_stok_admin_all" on public.pembelian_stok
  for all using (public.get_auth_role() = 'Admin');
