import { supabase } from './supabaseClient';

export async function listTestimonials({ approvedOnly = false } = {}) {
  // Query testimonials tanpa join otomatis
  let query = supabase
    .from('testimonials')
    .select('id, created_at, content, rating, is_approved, user_id')
    .order('created_at', { ascending: false });

  if (approvedOnly) {
    query = query.eq('is_approved', true);
  }

  const { data: testimonials, error } = await query;
  if (error) throw error;
  if (!testimonials || testimonials.length === 0) return [];

  // Batch fetch profiles
  const userIds = [...new Set(testimonials.map((t) => t.user_id).filter(Boolean))];
  let profileMap = {};

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    if (profiles) {
      profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
    }
  }

  return testimonials.map((t) => ({
    ...t,
    profiles: profileMap[t.user_id] ?? null,
  }));
}

export async function createTestimonial({ userId, content, rating }) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert({ user_id: userId, content, rating })
    .select('id, content, rating, is_approved')
    .single();

  if (error) throw error;
  return data;
}

export async function approveTestimonial(id, isApproved) {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ is_approved: isApproved })
    .eq('id', id)
    .select('id, is_approved')
    .single();

  if (error) throw error;
  return data;
}
