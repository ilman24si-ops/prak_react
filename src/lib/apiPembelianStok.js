import { supabase } from './supabaseClient';

export async function listPembelianStok() {
  const { data, error } = await supabase
    .from('pembelian_stok')
    .select('*, supplier:suppliers(id, nama)')
    .order('tanggal_beli', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPembelianStok({ nama_obat, jumlah, harga_satuan, supplier_id, tanggal_beli, catatan }) {
  const { data, error } = await supabase
    .from('pembelian_stok')
    .insert({ nama_obat, jumlah, harga_satuan, supplier_id, tanggal_beli, catatan })
    .select('*, supplier:suppliers(id, nama)')
    .single();
  if (error) throw error;
  return data;
}

export async function updatePembelianStok(id, { nama_obat, jumlah, harga_satuan, supplier_id, tanggal_beli, catatan }) {
  const { data, error } = await supabase
    .from('pembelian_stok')
    .update({ nama_obat, jumlah, harga_satuan, supplier_id, tanggal_beli, catatan })
    .eq('id', id)
    .select('*, supplier:suppliers(id, nama)')
    .single();
  if (error) throw error;
  return data;
}

export async function deletePembelianStok(id) {
  const { error } = await supabase.from('pembelian_stok').delete().eq('id', id);
  if (error) throw error;
}
