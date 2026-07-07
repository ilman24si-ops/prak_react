import React, { useEffect, useState } from 'react';
import { listPembelianStok, createPembelianStok, updatePembelianStok, deletePembelianStok } from '@/lib/apiPembelianStok';
import { listSuppliers } from '@/lib/apiSupplier';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, X, Save, Plus } from 'lucide-react';

const TODAY = new Date().toISOString().split('T')[0];
const EMPTY = { nama_obat: '', jumlah: '', harga_satuan: '', supplier_id: '', tanggal_beli: TODAY, catatan: '' };
const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

export default function PembelianStok() {
  const [rows, setRows] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
      const [data, sups] = await Promise.all([listPembelianStok(), listSuppliers()]);
      setRows(data);
      setSuppliers(sups);
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
    const payload = {
      nama_obat: form.nama_obat,
      jumlah: Number(form.jumlah),
      harga_satuan: Number(form.harga_satuan),
      supplier_id: form.supplier_id,
      tanggal_beli: form.tanggal_beli,
      catatan: form.catatan,
    };
    try {
      if (editingId) {
        await updatePembelianStok(editingId, payload);
        setSuccessMsg('Data pembelian berhasil diperbarui.');
      } else {
        await createPembelianStok(payload);
        setSuccessMsg('Pembelian stok berhasil dicatat.');
      }
      setForm(EMPTY);
      setEditingId(null);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (r) => {
    setForm({
      nama_obat: r.nama_obat, jumlah: r.jumlah, harga_satuan: r.harga_satuan,
      supplier_id: r.supplier_id ?? '', tanggal_beli: r.tanggal_beli, catatan: r.catatan ?? '',
    });
    setEditingId(r.id);
    setShowForm(true);
    setErrorMsg('');
    setSuccessMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus data pembelian ini?')) return;
    setErrorMsg(''); setSuccessMsg('');
    try {
      await deletePembelianStok(id);
      setSuccessMsg('Data pembelian berhasil dihapus.');
      await refresh();
    } catch (err) { setErrorMsg(err.message); }
  };

  const handleCancel = () => {
    setForm(EMPTY); setEditingId(null); setShowForm(false); setErrorMsg('');
  };

  const totalNilai = rows.reduce((s, r) => s + (r.total_harga ?? Number(r.jumlah) * Number(r.harga_satuan)), 0);
  const previewTotal = Number(form.jumlah || 0) * Number(form.harga_satuan || 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm p-6">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(234,88,12,0.12),transparent)] opacity-60" />
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pembelian Stok</h2>
            <p className="text-slate-500 text-sm">Catat setiap transaksi pembelian stok obat dari supplier.</p>
          </div>
          {!showForm && (
          <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ backgroundColor: '#00A99D', color: '#fff', border: 'none' }}
              className="px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Catat Pembelian
            </button>
          )}
        </div>
      </div>

      {errorMsg && <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">{errorMsg}</div>}
      {successMsg && <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">{successMsg}</div>}

      {showForm && (
        <Card className="border-orange-200 bg-orange-50/10 shadow-md">
          <CardHeader className="border-b border-orange-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-orange-600" />
                {editingId ? 'Edit Pembelian' : 'Catat Pembelian Stok'}
              </CardTitle>
              {editingId && <CardDescription>ID: {editingId}</CardDescription>}
            </div>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Obat / Barang</label>
                <input name="nama_obat" value={form.nama_obat} onChange={handleChange} required placeholder="Paracetamol 500mg"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Supplier</label>
                <select name="supplier_id" value={form.supplier_id} onChange={handleChange} required
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm">
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah</label>
                <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} required min="1"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                <input type="number" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} required min="0"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Beli</label>
                <input type="date" name="tanggal_beli" value={form.tanggal_beli} onChange={handleChange} required
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Total Harga (otomatis)</label>
                <div className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-bold text-orange-700">{formatRp(previewTotal)}</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Catatan (opsional)</label>
                <textarea name="catatan" value={form.catatan} onChange={handleChange} rows={2} placeholder="Catatan tambahan..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none" />
              </div>
              <div className="md:col-span-2 flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={handleCancel} className="rounded-xl">Batal</Button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#00A99D', color: '#fff', border: 'none' }}
                  className="px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
                >
                  <Save className="w-4 h-4" />{editingId ? 'Simpan Perubahan' : 'Catat'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>🛒</span> Riwayat Pembelian Stok
            </CardTitle>
            <CardDescription>Semua transaksi pembelian stok</CardDescription>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase bg-white border px-3 py-1 rounded-xl shadow-inner">
            {loading ? 'Memuat...' : `${rows.length} Transaksi`}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                  <th className="py-3 px-6">No</th>
                  <th className="py-3 px-6">Tanggal</th>
                  <th className="py-3 px-6">Nama Obat</th>
                  <th className="py-3 px-6">Supplier</th>
                  <th className="py-3 px-6 text-right">Jumlah</th>
                  <th className="py-3 px-6 text-right">Harga Satuan</th>
                  <th className="py-3 px-6 text-right">Total</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-medium">{i + 1}</td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{r.tanggal_beli}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">{r.nama_obat}</td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{r.supplier?.nama ?? '-'}</td>
                    <td className="py-4 px-6 text-right font-medium text-slate-700">{r.jumlah}</td>
                    <td className="py-4 px-6 text-right text-slate-600">{formatRp(r.harga_satuan)}</td>
                    <td className="py-4 px-6 text-right font-bold text-orange-700 whitespace-nowrap">
                      {formatRp(r.total_harga ?? r.jumlah * r.harga_satuan)}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(r)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr><td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">Belum ada data pembelian stok.</td></tr>
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot className="bg-slate-50 border-t border-slate-200">
                  <tr>
                    <td colSpan={6} className="py-3 px-6 text-right font-bold text-slate-700 text-sm">Total Nilai Pembelian:</td>
                    <td className="py-3 px-6 text-right font-black text-orange-700">{formatRp(totalNilai)}</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
