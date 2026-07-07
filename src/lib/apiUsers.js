import { supabase } from './supabaseClient';

export const ROLES = ['Admin', 'Member', 'Guest'];
export const TIERS = ['Bronze', 'Silver', 'Gold'];

/**
 * Ambil semua user beserta data profil (role, poin, tier).
 * Manual join: public.users + public.profiles (keduanya share UUID yang sama).
 */
export async function listUsers() {
  // Fetch users dan profiles secara paralel
  const [usersRes, profilesRes] = await Promise.all([
    supabase
      .from('users')
      .select('id, email, full_name, phone, is_active, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('id, full_name, role, points, tier, updated_at'),
  ]);

  if (usersRes.error) throw usersRes.error;
  if (profilesRes.error) throw profilesRes.error;

  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.id, p])
  );

  return (usersRes.data ?? []).map((u) => {
    const prof = profileMap[u.id];
    return {
      id:         u.id,
      email:      u.email,
      full_name:  u.full_name ?? prof?.full_name ?? '',
      phone:      u.phone,
      is_active:  u.is_active,
      created_at: u.created_at,
      role:       prof?.role       ?? 'Guest',
      points:     prof?.points     ?? 0,
      tier:       prof?.tier       ?? 'Bronze',
      updated_at: prof?.updated_at ?? null,
    };
  });
}

/**
 * Ambil semua profil.
 */
export async function listProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, points, tier, updated_at')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Update profil user (role, poin, tier, nama).
 */
export async function updateProfile(id, patch) {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', id)
    .select('id, full_name, role, points, tier, updated_at')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update data dasar user (nama, phone).
 */
export async function updateUser(id, patch) {
  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select('id, email, full_name, phone, is_active, updated_at')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hapus user dari public.users (akan cascade ke profiles).
 */
export async function deleteProfile(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
}
