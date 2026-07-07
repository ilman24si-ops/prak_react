import React, { useEffect, useState } from 'react';
import { listDokters, createDokter, updateDokter, deleteDokter } from '@/lib/apiDokter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, X, Save, Plus } from 'lucide-react';

const EMPTY = { nama: '', spesialis: '', no_hp: '', alamat: '' };

export default function KelolaDokter() {
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const refresh = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setDokters(await listDokters());
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (editingId) {
        await updateDokter(editingId, form);
        setSuccessMsg('Data dokter berhasil diperbarui.');
      } else {
        await createDokter(form);
        setSuccessMsg('Dokter baru berhasil ditambahkan.');
      }
      setForm(EMPTY);
      setEditingId(null);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (d) => {
    setForm({ nama: d.nama, spesialis: d.spesialis, no_hp: d.no_hp, alamat: d.alamat });
    setEditingId(d.id);
    setShowForm(true);
    setErrorMsg('');
    setSuccessMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus dokter ini? Tindakan ini tidak dapat dibatalkan.')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteDokter(id);
      setSuccessMsg('Dokter berhasil dihapus.');
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
    setErrorMsg('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm p-6">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent)] opacity-60" />
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kelola Dokter</h2>
            <p className="text-slate-500 text-sm">Tambah, edit, atau hapus data dokter yang terdaftar di klinik.</p>
          </div>
          {!showForm && (
          <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ backgroundColor: '#00A99D', color: '#fff', border: 'none' }}
              className="px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Tambah Dokter
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">{successMsg}</div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="border-emerald-200 bg-emerald-50/20 shadow-md">
          <CardHeader className="border-b border-emerald-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                {editingId ? 'Edit Data Dokter' : 'Tambah Dokter Baru'}
              </CardTitle>
              {editingId && <CardDescription>ID: {editingId}</CardDescription>}
            </div>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Dokter</label>
                <input
                  name="nama" value={form.nama} onChange={handleChange} required
                  placeholder="dr. Budi Santoso"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Spesialis</label>
                <input
                  name="spesialis" value={form.spesialis} onChange={handleChange} required
                  placeholder="Umum / Gigi / Penyakit Dalam"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">No. HP</label>
                <input
                  name="no_hp" value={form.no_hp} onChange={handleChange} required
                  placeholder="08xxxxxxxxxx"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat</label>
                <input
                  name="alamat" value={form.alamat} onChange={handleChange} required
                  placeholder="Jl. Melati No. 1, Jakarta"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={handleCancel} className="rounded-xl">Batal</Button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#00A99D', color: '#fff', border: 'none' }}
                  className="px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Simpan Perubahan' : 'Tambah'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>👨‍⚕️</span> Daftar Dokter
            </CardTitle>
            <CardDescription>Data dokter yang terdaftar di sistem</CardDescription>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase bg-white border px-3 py-1 rounded-xl shadow-inner">
            {loading ? 'Memuat...' : `${dokters.length} Dokter`}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                  <th className="py-3 px-6">No</th>
                  <th className="py-3 px-6">Nama Dokter</th>
                  <th className="py-3 px-6">Spesialis</th>
                  <th className="py-3 px-6">No. HP</th>
                  <th className="py-3 px-6">Alamat</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dokters.map((d, i) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-medium">{i + 1}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">{d.nama}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs px-2.5 py-1 rounded-full font-semibold">
                        {d.spesialis}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{d.no_hp}</td>
                    <td className="py-4 px-6 text-slate-500">{d.alamat}</td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {dokters.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                      Belum ada data dokter.
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
