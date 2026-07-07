import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createOrder, listMyOrders } from '@/lib/apiOrders';
import { listProducts } from '@/lib/apiProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ShoppingBag, History, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusConfigs = {
  Pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', dot: 'bg-amber-500 animate-pulse' },
  Processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200/60', dot: 'bg-blue-500 animate-pulse' },
  Completed: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', dot: 'bg-emerald-500' },
  Cancelled: { bg: 'bg-rose-50 text-rose-600 border-rose-200/60', dot: 'bg-rose-500' },
};

export default function MyOrders({ onNavigate }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const refreshOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      setOrders(await listMyOrders(userId));
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setProducts(await listProducts());
      } catch (e) {
        setErrorMsg(e.message);
      }
    })();
    refreshOrders();
  }, [userId]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => {
          const product = products.find((p) => p.id === productId);
          return product
            ? { productId, quantity, price: product.price, name: product.name }
            : null;
        })
        .filter(Boolean),
    [cart, products]
  );

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  async function handleCreateOrder(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (cartItems.length === 0) {
      setErrorMsg('Pilih minimal satu produk dengan kuantitas lebih dari 0.');
      return;
    }

    setSubmitLoading(true);
    try {
      await createOrder({ userId, items: cartItems });
      setCart({});
      setSuccessMsg('Pesanan berhasil dibuat! Status transaksi Anda saat ini: Pending.');
      await refreshOrders();
      setTimeout(() => {
        onNavigate?.('Member Dashboard');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitLoading(false);
    }
  }

  const updateCartQty = (productId, val, maxStock) => {
    const qty = Math.max(0, Math.min(maxStock, Number(val)));
    setCart((c) => ({ ...c, [productId]: qty }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm p-6">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.12),transparent)] opacity-60" />
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat & Buat Pesanan</h2>
            <p className="text-slate-500 text-sm">Pesan kebutuhan obat Anda dan pantau status pengiriman transaksi Anda secara berkala.</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-start gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              Buat Pesanan Baru
            </CardTitle>
            <CardDescription>Pilih produk obat dan masukkan kuantitas yang dibutuhkan</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari obat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleCreateOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between border rounded-2xl p-4 transition-all duration-200 bg-white ${
                      cart[p.id] > 0
                        ? 'border-blue-500 bg-blue-50/10 shadow-sm'
                        : 'border-slate-200/60 hover:border-slate-300 hover:shadow-sm'
                    } ${isOutOfStock ? 'opacity-60 bg-slate-50/60' : ''}`}
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.description || 'Tidak ada deskripsi.'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-black text-blue-600">
                          Rp {Number(p.price).toLocaleString('id-ID')}
                        </span>
                        <span className="text-slate-300 text-xs">|</span>
                        <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-500' : 'text-slate-500'}`}>
                          Stok: {p.stock}
                        </span>
                      </div>
                    </div>
                    <div>
                      {isOutOfStock ? (
                        <Badge className="bg-rose-50 border-rose-200 text-rose-600 border font-bold text-[10px] rounded-lg">
                          Habis
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartQty(p.id, (cart[p.id] || 0) - 1, p.stock)}
                            className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={p.stock}
                            value={cart[p.id] ?? 0}
                            onChange={(e) => updateCartQty(p.id, e.target.value, p.stock)}
                            className="w-12 py-1 border border-slate-200 rounded-xl text-center font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => updateCartQty(p.id, (cart[p.id] || 0) + 1, p.stock)}
                            className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 py-10 text-center text-slate-400 font-semibold text-sm">
                  Tidak ada obat ditemukan untuk "{searchQuery}".
                </div>
              )}
            </div>

            <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pembayaran</span>
                <span className="text-2xl font-black text-slate-800">
                  Rp {cartTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart({})}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Reset Pilihan
                  </button>
                )}
                <Button 
                  disabled={submitLoading || cartItems.length === 0} 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white shadow-sm flex items-center gap-2 transition"
                >
                  {submitLoading ? 'Memroses...' : 'Konfirmasi & Buat Pesanan'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Riwayat Pesanan
              </CardTitle>
              <CardDescription>Daftar riwayat transaksi belanja Anda</CardDescription>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase bg-white border px-3 py-1 rounded-xl shadow-inner">
              {loading ? 'Memuat...' : `${orders.length} Transaksi`}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                  <th className="py-3 px-6">Tanggal</th>
                  <th className="py-3 px-6">No. Invoice</th>
                  <th className="py-3 px-6">Item Pesanan</th>
                  <th className="py-3 px-6 text-right">Total Transaksi</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Poin Didapat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const statusConf = statusConfigs[order.status] ?? statusConfigs.Pending;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-slate-600 whitespace-nowrap font-bold">
                        INV-{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div className="max-w-xs md:max-w-md truncate font-medium">
                          {(order.order_items ?? [])
                            .map((item) => `${item.products?.name ?? 'Produk'} (x${item.quantity})`)
                            .join(', ') || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-800 whitespace-nowrap">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <Badge className={`text-xs px-2.5 py-0.5 border font-semibold inline-flex items-center gap-1.5 rounded-lg ${statusConf.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-emerald-600 whitespace-nowrap">
                        +{order.points_earned ?? 0} Poin
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                      Belum ada riwayat pesanan. Silakan buat pesanan baru di atas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
