import { supabase } from './supabaseClient';

export async function listPromos() {
  const { data, error } = await supabase
    .from('promos')
    .select('id, created_at, title, content, discount_percent, is_active, valid_until')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function listActivePromos() {
  const { data, error } = await supabase
    .from('promos')
    .select('id, created_at, title, content, discount_percent, valid_until')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPromo(payload) {
  const { data, error } = await supabase
    .from('promos')
    .insert(payload)
    .select('id, title, content, discount_percent, is_active, valid_until')
    .single();

  if (error) throw error;
  return data;
}

export async function updatePromo(id, patch) {
  const { data, error } = await supabase
    .from('promos')
    .update(patch)
    .eq('id', id)
    .select('id, title, is_active')
    .single();

  if (error) throw error;
  return data;
}

export async function deletePromo(id) {
  const { error } = await supabase.from('promos').delete().eq('id', id);
  if (error) throw error;
}
