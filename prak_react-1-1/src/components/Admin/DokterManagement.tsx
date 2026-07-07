import React, { useEffect, useState } from 'react';
import supabase from '@/services/supabaseClient';
import { Dokter } from '@/types';

const emptyForm: Dokter = {
  nama: '',
  spesialis: '',
  no_hp: '',
  alamat: '',
};

const DokterManagement: React.FC = () => {
  const [dokters, setDokters] = useState<Dokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Dokter>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDokters();
  }, []);

  const fetchDokters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dokters')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setDokters(data || []);
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
        .from('dokters')
        .update({ nama: form.nama, spesialis: form.spesialis, no_hp: form.no_hp, alamat: form.alamat })
        .eq('id', editId);
      if (error) { setError(error.message); return; }
      setSuccess('Dokter berhasil diperbarui.');
    } else {
      const { error } = await supabase
        .from('dokters')
        .insert([{ nama: form.nama, spesialis: form.spesialis, no_hp: form.no_hp, alamat: form.alamat }]);
      if (error) { setError(error.message); return; }
      setSuccess('Dokter berhasil ditambahkan.');
    }
    setForm(emptyForm);
    setEditId(null);
    setFormVisible(false);
    fetchDokters();
  };

  const handleEdit = (dokter: Dokter) => {
    setForm({ nama: dokter.nama, spesialis: dokter.spesialis, no_hp: dokter.no_hp, alamat: dokter.alamat });
    setEditId(dokter.id!);
    setFormVisible(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus dokter ini?')) return;
    const { error } = await supabase.from('dokters').delete().eq('id', id);
    if (error) setError(error.message);
    else { setSuccess('Dokter berhasil dihapus.'); fetchDokters(); }
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
        <h2 className="text-xl font-bold text-gray-800">Kelola Dokter</h2>
        {!formVisible && (
          <button
            onClick={() => { setFormVisible(true); setEditId(null); setForm(emptyForm); setError(null); setSuccess(null); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Tambah Dokter
          </button>
        )}
      </div>

      {error && <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

      {formVisible && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {editId ? 'Edit Dokter' : 'Tambah Dokter Baru'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nama Dokter</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
                placeholder="dr. Budi Santoso"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Spesialis</label>
              <input
                type="text"
                name="spesialis"
                value={form.spesialis}
                onChange={handleChange}
                required
                placeholder="Umum / Gigi / Penyakit Dalam"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">No. HP</label>
              <input
                type="text"
                name="no_hp"
                value={form.no_hp}
                onChange={handleChange}
                required
                placeholder="08xxxxxxxxxx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                placeholder="Jl. Melati No. 1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-1">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
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
      ) : dokters.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Belum ada data dokter.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Spesialis</th>
                <th className="px-4 py-3 text-left">No. HP</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dokters.map((d, i) => (
                <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{d.nama}</td>
                  <td className="px-4 py-3 text-gray-600">{d.spesialis}</td>
                  <td className="px-4 py-3 text-gray-600">{d.no_hp}</td>
                  <td className="px-4 py-3 text-gray-600">{d.alamat}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(d)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2 text-xs font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id!)}
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

export default DokterManagement;
