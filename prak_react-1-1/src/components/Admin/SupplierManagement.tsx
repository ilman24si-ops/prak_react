import React, { useEffect, useState } from 'react';
import supabase from '@/services/supabaseClient';
import { Supplier } from '@/types';

const emptyForm: Supplier = {
  nama: '',
  kontak: '',
  email: '',
  alamat: '',
};

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Supplier>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setSuppliers(data || []);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (editId) {
      const { error } = await supabase
        .from('suppliers')
        .update({ nama: form.nama, kontak: form.kontak, email: form.email, alamat: form.alamat })
        .eq('id', editId);
      if (error) { setError(error.message); return; }
      setSuccess('Supplier berhasil diperbarui.');
    } else {
      const { error } = await supabase
        .from('suppliers')
        .insert([{ nama: form.nama, kontak: form.kontak, email: form.email, alamat: form.alamat }]);
      if (error) { setError(error.message); return; }
      setSuccess('Supplier berhasil ditambahkan.');
    }
    setForm(emptyForm);
    setEditId(null);
    setFormVisible(false);
    fetchSuppliers();
  };

  const handleEdit = (supplier: Supplier) => {
    setForm({ nama: supplier.nama, kontak: supplier.kontak, email: supplier.email, alamat: supplier.alamat });
    setEditId(supplier.id!);
    setFormVisible(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus supplier ini?')) return;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) setError(error.message);
    else { setSuccess('Supplier berhasil dihapus.'); fetchSuppliers(); }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormVisible(false);
    setError(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Kelola Supplier</h2>
        {!formVisible && (
          <button
            onClick={() => { setFormVisible(true); setEditId(null); setForm(emptyForm); setError(null); setSuccess(null); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Tambah Supplier
          </button>
        )}
      </div>

      {error && <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

      {formVisible && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {editId ? 'Edit Supplier' : 'Tambah Supplier Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nama Supplier</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
                placeholder="PT. Kimia Farma"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">No. Kontak</label>
              <input
                type="text"
                name="kontak"
                value={form.kontak}
                onChange={handleChange}
                required
                placeholder="08xxxxxxxxxx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="supplier@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
              <input
                type="text"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                required
                placeholder="Jl. Industri No. 5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-1">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                {editId ? 'Simpan Perubahan' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Memuat data...</div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Belum ada data supplier.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Kontak</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{s.kontak}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600">{s.alamat}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(s)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2 text-xs font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id!)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
