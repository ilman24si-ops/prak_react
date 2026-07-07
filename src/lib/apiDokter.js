import { supabase } from './supabaseClient';

export async function listDokters() {
  const { data, error } = await supabase
    .from('dokters')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createDokter({ nama, spesialis, no_hp, alamat }) {
  const { data, error } = await supabase
    .from('dokters')
    .insert({ nama, spesialis, no_hp, alamat })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDokter(id, { nama, spesialis, no_hp, alamat }) {
  const { data, error } = await supabase
    .from('dokters')
    .update({ nama, spesialis, no_hp, alamat })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDokter(id) {
  const { error } = await supabase.from('dokters').delete().eq('id', id);
  if (error) throw error;
}
