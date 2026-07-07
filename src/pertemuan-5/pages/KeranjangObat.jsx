import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listProducts } from '@/lib/apiProducts';
import { createOrder } from '@/lib/apiOrders';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Search, Trash2 } from 'lucide-react';

const CART_KEY = 'pharma_cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '{}'); } catch { return {}; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function KeranjangObat({ onNavigate }) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(loadCart);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    listProducts().then(setProducts).catch((e) => setErrorMsg(e.message));
  }, []);

  useEffect(() => { saveCart(cart); }, [cart]);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [products, searchQuery]
  );

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => {
          const product = products.find((p) => p.id === productId);
          return product ? { productId, quantity, price: product.price, name: product.name, stock: product.stock } : null;
        })
        .filter(Boolean),
    [cart, products]
  );

  const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const updateCartQty = (productId, val, maxStock) => {
    const qty = Math.max(0, Math.min(maxStock, Number(val)));
    setCart((c) => ({ ...c, [productId]: qty }));
  };

  async function handleCheckout() {
    if (cartItems.length === 0) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await createOrder({ userId, items: cartItems });
      setCart({});
      setSuccessMsg('Pesanan dari keranjang berhasil dibuat!');
      setTimeout(() => onNavigate?.('My Orders'), 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-blue-600" />
          Keranjang Obat
        </h2>
        <p className="text-sm text-slate-500">Keranjang belanja obat Anda. Stok tersimpan di perangkat ini.</p>
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50/70 flex items-center justify-between gap-4">
            <span className="font-bold text-slate-700">Tambah Obat</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari obat..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm" />
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {filteredProducts.map((p) => (
              <div key={p.id} className={`flex items-center justify-between border rounded-xl p-3 ${cart[p.id] > 0 ? 'border-blue-500 bg-blue-50/10' : 'border-slate-200'}`}>
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-bold text-slate-800 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-blue-600 font-bold">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-slate-400">Stok: {p.stock}</p>
                </div>
                {p.stock > 0 ? (
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => updateCartQty(p.id, (cart[p.id] || 0) - 1, p.stock)}
                      className="w-7 h-7 rounded-lg bg-slate-100 font-bold text-sm">-</button>
                    <span className="w-8 text-center font-bold text-sm">{cart[p.id] ?? 0}</span>
                    <button type="button" onClick={() => updateCartQty(p.id, (cart[p.id] || 0) + 1, p.stock)}
                      className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-sm">+</button>
                  </div>
                ) : (
                  <span className="text-xs text-rose-500 font-bold">Habis</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Isi Keranjang ({cartItems.length})</h3>
            {cartItems.length > 0 && (
              <button type="button" onClick={() => setCart({})} className="text-rose-500 hover:text-rose-700">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {cartItems.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Keranjang kosong.</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.name} x{item.quantity}</span>
                  <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between font-black text-lg">
                  <span>Total</span>
                  <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
              <Button onClick={handleCheckout} disabled={loading} className="w-full mt-3">
                {loading ? 'Memproses...' : 'Checkout Pesanan'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
