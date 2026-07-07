import { supabase } from './supabaseClient';

export async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, stock, image_url, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProduct(payload) {
  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select('id, name, description, price, stock, image_url, created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id, patch) {
  const { data, error } = await supabase
    .from('products')
    .update(patch)
    .eq('id', id)
    .select('id, name, description, price, stock, image_url, created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
