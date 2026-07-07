import { supabase } from './supabaseClient';

export async function listMyPrescriptions(userId) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('id, created_at, doctor_name, notes, image_url, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function listAllPrescriptions() {
  // Query prescriptions tanpa join otomatis
  const { data: prescriptions, error } = await supabase
    .from('prescriptions')
    .select('id, created_at, doctor_name, notes, image_url, status, user_id')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!prescriptions || prescriptions.length === 0) return [];

  // Batch fetch profiles
  const userIds = [...new Set(prescriptions.map((p) => p.user_id).filter(Boolean))];
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

  return prescriptions.map((p) => ({
    ...p,
    profiles: profileMap[p.user_id] ?? null,
  }));
}

export async function uploadPrescription({ userId, doctorName, notes, imageUrl }) {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert({
      user_id:     userId,
      doctor_name: doctorName || null,
      notes:       notes || null,
      image_url:   imageUrl || null,
      status:      'Pending',
    })
    .select('id, created_at, doctor_name, notes, image_url, status')
    .single();

  if (error) throw error;
  return data;
}

export async function updatePrescriptionStatus(id, status) {
  const { data, error } = await supabase
    .from('prescriptions')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error) throw error;
  return data;
}
