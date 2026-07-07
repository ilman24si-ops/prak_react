import { supabase } from './supabaseClient';

/** Query satu tabel dengan fallback [] jika error (tabel belum dibuat dll.) */
async function safeQuery(queryFn) {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.warn('[apiLaporan] Query error (ignored):', error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn('[apiLaporan] Unexpected error (ignored):', err.message);
    return [];
  }
}

/** Statistik ringkasan untuk halaman Laporan Admin */
export async function getLaporanSummary() {
  const [products, pembelian, suppliers, dokters, orders] = await Promise.all([
    safeQuery(() =>
      supabase
        .from('products')
        .select('id, name, stock, price')
        .order('name', { ascending: true })
    ),
    safeQuery(() =>
      supabase
        .from('pembelian_stok')
        .select('id, nama_obat, jumlah, harga_satuan, tanggal_beli, total_harga, supplier:suppliers(nama)')
        .order('tanggal_beli', { ascending: false })
    ),
    safeQuery(() =>
      supabase
        .from('suppliers')
        .select('id, nama')
        .order('created_at', { ascending: false })
    ),
    safeQuery(() =>
      supabase
        .from('dokters')
        .select('id, nama, spesialis')
        .order('created_at', { ascending: false })
    ),
    safeQuery(() =>
      supabase
        .from('orders')
        .select('id, created_at, total_amount, status')
        .order('created_at', { ascending: false })
    ),
  ]);

  return { products, pembelian, suppliers, dokters, orders };
}
