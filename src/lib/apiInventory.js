import { supabase } from './supabaseClient';

export async function listInventoryMovements() {
  // Query inventory_movements tanpa join otomatis
  const { data: movements, error } = await supabase
    .from('inventory_movements')
    .select('id, created_at, movement_type, quantity, notes, product_id, created_by')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  if (!movements || movements.length === 0) return [];

  // Kumpulkan unique IDs untuk batch fetch
  const productIds = [...new Set(movements.map((m) => m.product_id).filter(Boolean))];
  const userIds    = [...new Set(movements.map((m) => m.created_by).filter(Boolean))];

  // Fetch products dan profiles secara paralel
  const [productsRes, profilesRes] = await Promise.all([
    productIds.length > 0
      ? supabase.from('products').select('id, name').in('id', productIds)
      : { data: [] },
    userIds.length > 0
      ? supabase.from('profiles').select('id, full_name').in('id', userIds)
      : { data: [] },
  ]);

  const productMap = Object.fromEntries((productsRes.data ?? []).map((p) => [p.id, p]));
  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.id, p]));

  return movements.map((m) => ({
    ...m,
    products: productMap[m.product_id] ?? null,
    profiles: profileMap[m.created_by] ?? null,
  }));
}

export async function addInventoryMovement({ productId, movementType, quantity, notes, createdBy }) {
  const { data, error } = await supabase
    .from('inventory_movements')
    .insert({
      product_id:    productId,
      movement_type: movementType,
      quantity,
      notes,
      created_by:    createdBy,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}
