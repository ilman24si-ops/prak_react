import { supabase } from './supabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// TABEL ADMIN: public.transaksi (data historis seed)
// Kolom: id_transaksi, id_pelanggan, tanggal_transaksi, nominal_transaksi,
//        kategori_produk, metode_pembayaran
// ─────────────────────────────────────────────────────────────────────────────

/** Dipakai oleh halaman admin Orders — tampilkan data transaksi historis */
export async function listOrders() {
  const { data: transaksiData, error: transaksiError } = await supabase
    .from('transaksi')
    .select('id_transaksi, id_pelanggan, tanggal_transaksi, nominal_transaksi, kategori_produk, metode_pembayaran')
    .order('tanggal_transaksi', { ascending: false });

  if (transaksiError) throw transaksiError;
  if (!transaksiData || transaksiData.length === 0) return [];

  // Batch fetch pelanggan (manual join)
  const idList = [...new Set(transaksiData.map((t) => t.id_pelanggan).filter(Boolean))];
  let pelangganMap = {};

  if (idList.length > 0) {
    const { data: pelangganData } = await supabase
      .from('pelanggan')
      .select('id_pelanggan, nama_lengkap')
      .in('id_pelanggan', idList);

    if (pelangganData) {
      pelangganMap = Object.fromEntries(pelangganData.map((p) => [p.id_pelanggan, p]));
    }
  }

  return transaksiData.map((t) => ({
    ...t,
    pelanggan: pelangganMap[t.id_pelanggan] ?? null,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// TABEL MEMBER: public.orders + public.order_items (transaksi dari app)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Buat pesanan baru dari KeranjangObat / MyOrders.
 * @param {{ userId: string, items: Array<{productId, quantity, price}> }} param
 */
export async function createOrder({ userId, items }) {
  if (!userId) throw new Error('User belum login.');
  if (!items || items.length === 0) throw new Error('Keranjang kosong.');

  const totalAmount = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  // 1. Insert order header
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: userId, total_amount: totalAmount, status: 'Pending' })
    .select('id, created_at, total_amount, status, points_earned')
    .single();

  if (orderError) throw orderError;

  // 2. Insert order items
  const itemRows = items.map((i) => ({
    order_id:   order.id,
    product_id: i.productId,
    quantity:   i.quantity,
    unit_price: Number(i.price),
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemRows);
  if (itemsError) throw itemsError;

  return order;
}

/**
 * Ambil semua pesanan milik member beserta item-itemnya.
 * @param {string} userId
 */
export async function listMyOrders(userId) {
  // Fetch orders milik user
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, created_at, status, total_amount, points_earned, notes')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ordersError) throw ordersError;
  if (!orders || orders.length === 0) return [];

  // Fetch order_items untuk semua order sekaligus
  const orderIds = orders.map((o) => o.id);
  const { data: allItems, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, product_id, quantity, unit_price, subtotal')
    .in('order_id', orderIds);

  if (itemsError) throw itemsError;

  // Fetch product names untuk items
  const productIds = [...new Set((allItems ?? []).map((i) => i.product_id))];
  let productMap = {};

  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds);

    if (products) {
      productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    }
  }

  // Merge items dengan product name
  const itemsByOrder = {};
  for (const item of (allItems ?? [])) {
    if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
    itemsByOrder[item.order_id].push({
      ...item,
      products: productMap[item.product_id] ?? null,
    });
  }

  // Gabungkan ke order
  return orders.map((o) => ({
    ...o,
    order_items: itemsByOrder[o.id] ?? [],
  }));
}

/**
 * Update status pesanan (Admin only).
 */
export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select('id, status, total_amount, points_earned')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hapus pesanan (Admin only).
 */
export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}
