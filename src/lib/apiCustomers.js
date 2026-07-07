import { supabase } from './supabaseClient';

// Tabel: public.pelanggan
// Kolom utama: id_pelanggan, nama_lengkap, nomor_hp, email, alamat,
//              jenis_kelamin, tanggal_lahir, status_member, segmen_pelanggan,
//              total_transaksi, total_nominal, rata_rata_nominal

export async function listCustomers() {
  const { data, error } = await supabase
    .from('pelanggan')
    .select(
      'id_pelanggan, nama_lengkap, nomor_hp, email, alamat, jenis_kelamin, tanggal_lahir, status_member, segmen_pelanggan, total_transaksi, total_nominal, rata_rata_nominal'
    )
    .order('id_pelanggan', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createCustomer(payload) {
  // payload expects: { nama_lengkap, email, nomor_hp, alamat }
  const { data, error } = await supabase
    .from('pelanggan')
    .insert(payload)
    .select('id_pelanggan, nama_lengkap, nomor_hp, email, alamat')
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(id, patch) {
  const { data, error } = await supabase
    .from('pelanggan')
    .update(patch)
    .eq('id_pelanggan', id)
    .select('id_pelanggan, nama_lengkap, nomor_hp, email, alamat')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCustomer(id) {
  const { error } = await supabase
    .from('pelanggan')
    .delete()
    .eq('id_pelanggan', id);

  if (error) throw error;
}
