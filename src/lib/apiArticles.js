import { supabase } from './supabaseClient';

export async function listArticles({ publishedOnly = false } = {}) {
  let query = supabase
    .from('articles')
    .select('id, created_at, title, content, author, image_url, is_published')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createArticle(payload) {
  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select('id, title, content, author, image_url, is_published')
    .single();

  if (error) throw error;
  return data;
}

export async function updateArticle(id, patch) {
  const { data, error } = await supabase
    .from('articles')
    .update(patch)
    .eq('id', id)
    .select('id, title, is_published')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}
