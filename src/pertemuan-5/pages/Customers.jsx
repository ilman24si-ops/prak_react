import React, { useEffect, useState } from 'react';
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from '@/lib/apiCustomers';
import { Button } from '@/components/ui/button';

const emptyForm = {
  nama_lengkap: '',
  email: '',
  nomor_hp: '',
  alamat: '',
};

const segmenColor = {
  Inactive: 'bg-slate-100 text-slate-500',
  Low:      'bg-blue-50 text-blue-600',
  Medium:   'bg-yellow-50 text-yellow-700',
  High:     'bg-orange-50 text-orange-700',
  VIP:      'bg-purple-50 text-purple-700',
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const refresh = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setCustomers(await listCustomers());
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
    try {
      if (editingId) {
        await updateCustomer(editingId, form);
      } else {
        await createCustomer(form);
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
    if (!confirm('Hapus customer ini?')) return;
    try {
      await deleteCustomer(id);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  function startEdit(c) {
    setEditingId(c.id_pelanggan);
    setForm({
      nama_lengkap: c.nama_lengkap ?? '',
      email:        c.email ?? '',
      nomor_hp:     c.nomor_hp ?? '',
      alamat:       c.alamat ?? '',
    });
    setShowForm(true);
  }

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.nama_lengkap ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.nomor_hp ?? '').includes(q) ||
      (c.id_pelanggan ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customer</h2>
          <p className="text-sm text-slate-500">Kelola data pelanggan (CRM internal).</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          + Tambah Customer
        </Button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Form tambah / edit */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3">
            {editingId ? 'Edit Customer' : 'Tambah Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                value={form.nama_lengkap}
                onChange={(e) => setForm((f) => ({ ...f, nama_lengkap: e.target.value }))}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                type="email"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor HP</label>
              <input
                value={form.nomor_hp}
                onChange={(e) => setForm((f) => ({ ...f, nomor_hp: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
              <input
                value={form.alamat}
                onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white/70 backdrop-blur border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="font-bold text-slate-700">
            Daftar Customer
            <span className="ml-2 text-xs font-normal text-slate-400">
              {loading ? 'Memuat...' : `${filtered.length} dari ${customers.length} pelanggan`}
            </span>
          </div>
          <input
            type="text"
            placeholder="Cari nama, email, nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wide">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Nomor HP</th>
                <th className="py-3 px-4">Alamat</th>
                <th className="py-3 px-4 text-center">Segmen</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
                <th className="py-3 px-4 text-right">Total Belanja</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id_pelanggan} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-400">{c.id_pelanggan}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">{c.nama_lengkap}</td>
                  <td className="py-3 px-4 text-slate-600">{c.email ?? '-'}</td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{c.nomor_hp ?? '-'}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-[180px] truncate">{c.alamat ?? '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${segmenColor[c.segmen_pelanggan] ?? 'bg-slate-100 text-slate-500'}`}>
                      {c.segmen_pelanggan ?? '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status_member === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {c.status_member ?? '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-700">
                    {(c.total_transaksi ?? 0).toLocaleString('id-ID')}x
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 whitespace-nowrap">
                    Rp {(c.total_nominal ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id_pelanggan)}
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    {search ? 'Tidak ada hasil pencarian.' : 'Belum ada data customer.'}
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
