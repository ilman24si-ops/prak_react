import { supabase } from './supabaseClient';

export async function listSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSupplier({ nama, kontak, email, alamat }) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert({ nama, kontak, email, alamat })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSupplier(id, { nama, kontak, email, alamat }) {
  const { data, error } = await supabase
    .from('suppliers')
    .update({ nama, kontak, email, alamat })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSupplier(id) {
  const { error } = await supabase.from('suppliers').delete().eq('id', id);
  if (error) throw error;
}
