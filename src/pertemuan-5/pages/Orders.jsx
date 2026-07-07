import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateOrderStatus } from '@/lib/apiOrders';
import { supabase } from '@/lib/supabaseClient';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';

const STATUSES = ['Pending', 'Processing', 'Completed', 'Cancelled'];

const statusColors = {
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled:  'bg-rose-50 text-rose-600 border-rose-200',
};

/** Ambil semua orders beserta items dan nama user — tanpa FK PostgREST */
async function fetchAllOrders() {
  // 1. Fetch orders
  const { data: orders, error: ordErr } = await supabase
    .from('orders')
    .select('id, created_at, status, total_amount, points_earned, user_id')
    .order('created_at', { ascending: false });

  if (ordErr) throw ordErr;
  if (!orders || orders.length === 0) return [];

  // 2. Fetch order_items
  const orderIds = orders.map((o) => o.id);
  const { data: allItems, error: itemErr } = await supabase
    .from('order_items')
    .select('order_id, product_id, quantity, unit_price, subtotal')
    .in('order_id', orderIds);

  if (itemErr) throw itemErr;

  // 3. Fetch product names
  const productIds = [...new Set((allItems ?? []).map((i) => i.product_id))];
  let productMap = {};
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products').select('id, name').in('id', productIds);
    if (products) productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  }

  // 4. Fetch user names from profiles
  const userIds = [...new Set(orders.map((o) => o.user_id))];
  let profileMap = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles').select('id, full_name').in('id', userIds);
    if (profiles) profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]));
  }

  // 5. Merge
  const itemsByOrder = {};
  for (const item of (allItems ?? [])) {
    if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
    itemsByOrder[item.order_id].push({ ...item, products: productMap[item.product_id] ?? null });
  }

  return orders.map((o) => ({
    ...o,
    profiles:    profileMap[o.user_id] ?? null,
    order_items: itemsByOrder[o.id] ?? [],
  }));
}

export default function Orders() {
  const { isAdmin, refreshProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const refresh = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setOrders(await fetchAllOrders());
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  async function handleStatusChange(orderId, status) {
    setErrorMsg('');
    try {
      await updateOrderStatus(orderId, status);
      if (status === 'Completed') await refreshProfile();
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  if (!isAdmin) {
    return <div className="p-6 text-center text-slate-500">Halaman ini hanya untuk Admin.</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-blue-600" />
          Pesanan
        </h2>
        <p className="text-sm text-slate-500">
          Kelola status pesanan member. Poin otomatis dihitung saat status Completed.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-700">Daftar Pesanan</div>
          <div className="text-xs text-slate-500">
            {loading ? 'Loading...' : `${orders.length} pesanan`}
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b border-slate-100">
                <th className="py-2 pr-4 pb-3">No. Invoice</th>
                <th className="py-2 pr-4 pb-3">Tanggal</th>
                <th className="py-2 pr-4 pb-3">Member</th>
                <th className="py-2 pr-4 pb-3">Item</th>
                <th className="py-2 pr-4 pb-3 text-right">Total</th>
                <th className="py-2 pr-4 pb-3 text-center">Poin</th>
                <th className="py-2 pr-4 pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50/40">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">
                    INV-{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    {order.profiles?.full_name ?? '-'}
                  </td>
                  <td className="py-3 pr-4 text-slate-500 max-w-[200px] truncate">
                    {order.order_items.length > 0
                      ? order.order_items.map((i) => `${i.products?.name ?? '?'} x${i.quantity}`).join(', ')
                      : '-'}
                  </td>
                  <td className="py-3 pr-4 font-bold text-right whitespace-nowrap">
                    Rp {Number(order.total_amount).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 pr-4 text-center text-emerald-600 font-bold">
                    +{order.points_earned ?? 0}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`border rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none ${statusColors[order.status] ?? ''}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Belum ada pesanan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
