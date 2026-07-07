import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from '@/lib/apiProducts';
import { Button } from '@/components/ui/button';

const emptyForm = { name: '', description: '', price: '', stock: '', image_url: '' };

export default function Products() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setProducts(await listProducts());
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || null,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus produk ini?')) return;
    try {
      await deleteProduct(id);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url ?? '',
    });
    setShowForm(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Produk</h2>
          <p className="text-sm text-slate-500">
            {isAdmin ? 'Kelola katalog produk apotek.' : 'Daftar produk yang tersedia.'}
          </p>
        </div>
        {isAdmin && (
          <Button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            + Tambah Produk
          </Button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {isAdmin && showForm && (
        <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3">
            {editingId ? 'Edit Produk' : 'Tambah Produk'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (Rp)</label>
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                type="number"
                min="0"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Stok</label>
              <input
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                type="number"
                min="0"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">URL Gambar</label>
              <input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/70 flex items-center justify-between">
          <div className="font-bold text-slate-700">Daftar Produk</div>
          <div className="text-xs text-slate-500">{loading ? 'Loading...' : `${products.length} item`}</div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Nama</th>
                <th className="py-2 pr-4">Harga</th>
                <th className="py-2 pr-4">Stok</th>
                <th className="py-2 pr-4">Deskripsi</th>
                {isAdmin && <th className="py-2 pr-4">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="py-2 pr-4 font-medium">{p.name}</td>
                  <td className="py-2 pr-4">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                  <td className="py-2 pr-4">{p.stock}</td>
                  <td className="py-2 pr-4 text-slate-500">{p.description ?? '-'}</td>
                  {isAdmin && (
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="py-10 text-center text-slate-500">
                    Belum ada produk.
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
