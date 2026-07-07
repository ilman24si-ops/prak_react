import { supabase } from './supabaseClient';

export async function listChatMessages() {
  // Query chat_messages tanpa join otomatis
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('id, created_at, message, is_read, sender_id')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!messages || messages.length === 0) return [];

  // Batch fetch profiles
  const senderIds = [...new Set(messages.map((m) => m.sender_id).filter(Boolean))];
  let profileMap = {};

  if (senderIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .in('id', senderIds);

    if (profiles) {
      profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
    }
  }

  return messages.map((m) => ({
    ...m,
    profiles: profileMap[m.sender_id] ?? null,
  }));
}

export async function sendChatMessage({ senderId, message }) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ sender_id: senderId, message })
    .select('id, created_at, message')
    .single();

  if (error) throw error;
  return data;
}

export async function markMessagesRead(beforeId) {
  const { error } = await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .lte('id', beforeId);

  if (error) throw error;
}
