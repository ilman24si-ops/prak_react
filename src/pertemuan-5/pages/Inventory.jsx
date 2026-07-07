import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listProducts } from '@/lib/apiProducts';
import { listInventoryMovements, addInventoryMovement } from '@/lib/apiInventory';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Inventory() {
  const { session } = useAuth();
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ productId: '', movementType: 'in', quantity: '', notes: '' });

  const refresh = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [prods, movs] = await Promise.all([listProducts(), listInventoryMovements()]);
      setProducts(prods);
      setMovements(movs);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const lowStock = products.filter((p) => p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    try {
      await addInventoryMovement({
        productId: form.productId,
        movementType: form.movementType,
        quantity: Number(form.quantity),
        notes: form.notes || null,
        createdBy: session?.user?.id,
      });
      setForm({ productId: '', movementType: 'in', quantity: '', notes: '' });
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  const movementLabels = { in: 'Stok Masuk', out: 'Stok Keluar', adjustment: 'Penyesuaian', pos_sale: 'Penjualan POS' };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-7 h-7 text-blue-600" />
          Inventory
        </h2>
        <p className="text-sm text-slate-500">Kelola stok obat dan pantau pergerakan inventory.</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/70 border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Produk</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{products.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Stok Menipis
          </p>
          <p className="text-3xl font-black text-amber-700 mt-1">{lowStock.length}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-rose-600 uppercase">Stok Habis</p>
          <p className="text-3xl font-black text-rose-700 mt-1">{outOfStock.length}</p>
        </div>
      </div>

      <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">Tambah Pergerakan Stok</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={form.productId}
            onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
            required
            className="p-2.5 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Pilih Produk</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (stok: {p.stock})</option>
            ))}
          </select>
          <select
            value={form.movementType}
            onChange={(e) => setForm((f) => ({ ...f, movementType: e.target.value }))}
            className="p-2.5 border border-slate-300 rounded-lg text-sm"
          >
            <option value="in">Stok Masuk</option>
            <option value="out">Stok Keluar</option>
          </select>
          <input
            type="number" min="1" required placeholder="Jumlah"
            value={form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
            className="p-2.5 border border-slate-300 rounded-lg text-sm"
          />
          <Button type="submit">Simpan</Button>
        </form>
      </div>

      <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/70 font-bold text-slate-700">Status Stok Produk</div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Produk</th>
                <th className="py-2 pr-4">Stok</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="py-2 pr-4 font-medium">{p.name}</td>
                  <td className="py-2 pr-4">{p.stock}</td>
                  <td className="py-2 pr-4">
                    {p.stock === 0 ? (
                      <Badge className="bg-rose-50 text-rose-600 border-rose-200">Habis</Badge>
                    ) : p.stock <= 10 ? (
                      <Badge className="bg-amber-50 text-amber-600 border-amber-200">Menipis</Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">Aman</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/70 font-bold text-slate-700">Riwayat Pergerakan Stok</div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Produk</th>
                <th className="py-2 pr-4">Tipe</th>
                <th className="py-2 pr-4">Jumlah</th>
                <th className="py-2 pr-4">Oleh</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-t border-slate-100">
                  <td className="py-2 pr-4 text-slate-500">
                    {new Date(m.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-2 pr-4 font-medium">{m.products?.name ?? '-'}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-flex items-center gap-1">
                      {m.movement_type === 'in' ? (
                        <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowUpCircle className="w-4 h-4 text-rose-500" />
                      )}
                      {movementLabels[m.movement_type] ?? m.movement_type}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{m.quantity}</td>
                  <td className="py-2 pr-4 text-slate-500">{m.profiles?.full_name ?? '-'}</td>
                </tr>
              ))}
              {movements.length === 0 && !loading && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Belum ada pergerakan stok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
