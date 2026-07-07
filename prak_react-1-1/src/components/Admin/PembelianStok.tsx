import React, { useEffect, useState } from 'react';
import supabase from '@/services/supabaseClient';
import { PembelianStok as PembelianStokType, Supplier } from '@/types';

const emptyForm = {
  nama_obat: '',
  jumlah: 0,
  harga_satuan: 0,
  supplier_id: '',
  tanggal_beli: new Date().toISOString().split('T')[0],
  catatan: '',
};

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

const PembelianStok: React.FC = () => {
  const [pembelians, setPembelians] = useState<PembelianStokType[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [pembelianRes, supplierRes] = await Promise.all([
      supabase
        .from('pembelian_stok')
        .select('*, supplier:suppliers(nama)')
        .order('tanggal_beli', { ascending: false }),
      supabase.from('suppliers').select('id, nama').order('nama'),
    ]);
    if (pembelianRes.error) setError(pembelianRes.error.message);
    else setPembelians(pembelianRes.data || []);
    if (!supplierRes.error) setSuppliers(supplierRes.data || []);
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'jumlah' || name === 'harga_satuan' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      nama_obat: form.nama_obat,
      jumlah: form.jumlah,
      harga_satuan: form.harga_satuan,
      total_harga: form.jumlah * form.harga_satuan,
      supplier_id: form.supplier_id,
      tanggal_beli: form.tanggal_beli,
      catatan: form.catatan,
    };

    if (editId) {
      const { error } = await supabase.from('pembelian_stok').update(payload).eq('id', editId);
      if (error) { setError(error.message); return; }
      setSuccess('Data pembelian berhasil diperbarui.');
    } else {
      const { error } = await supabase.from('pembelian_stok').insert([payload]);
      if (error) { setError(error.message); return; }
      setSuccess('Pembelian stok berhasil dicatat.');
    }
    setForm(emptyForm);
    setEditId(null);
    setFormVisible(false);
    fetchAll();
  };

  const handleEdit = (p: PembelianStokType) => {
    setForm({
      nama_obat: p.nama_obat,
      jumlah: p.jumlah,
      harga_satuan: p.harga_satuan,
      supplier_id: p.supplier_id,
      tanggal_beli: p.tanggal_beli,
      catatan: p.catatan || '',
    });
    setEditId(p.id!);
    setFormVisible(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus data pembelian ini?')) return;
    const { error } = await supabase.from('pembelian_stok').delete().eq('id', id);
    if (error) setError(error.message);
    else { setSuccess('Data pembelian berhasil dihapus.'); fetchAll(); }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormVisible(false);
    setError(null);
  };

  const totalPembelian = pembelians.reduce((sum, p) => sum + (p.total_harga || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Pembelian Stok</h2>
        {!formVisible && (
          <button
            onClick={() => { setFormVisible(true); setEditId(null); setForm(emptyForm); setError(null); setSuccess(null); }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            + Catat Pembelian
          </button>
        )}
      </div>

      {error && <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

      {formVisible && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {editId ? 'Edit Pembelian' : 'Catat Pembelian Stok'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nama Obat / Barang</label>
              <input
                type="text"
                name="nama_obat"
                value={form.nama_obat}
                onChange={handleChange}
                required
                placeholder="Paracetamol 500mg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
              <select
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">-- Pilih Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Jumlah</label>
              <input
                type="number"
                name="jumlah"
                value={form.jumlah}
                onChange={handleChange}
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Harga Satuan (Rp)</label>
              <input
                type="number"
                name="harga_satuan"
                value={form.harga_satuan}
                onChange={handleChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Beli</label>
              <input
                type="date"
                name="tanggal_beli"
                value={form.tanggal_beli}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Total Harga</label>
              <div className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700">
                {formatRupiah(form.jumlah * form.harga_satuan)}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Catatan (opsional)</label>
              <textarea
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                rows={2}
                placeholder="Catatan tambahan..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-1">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                {editId ? 'Simpan Perubahan' : 'Catat'}
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
      ) : pembelians.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Belum ada data pembelian stok.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Nama Obat</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-right">Jumlah</th>
                  <th className="px-4 py-3 text-right">Harga Satuan</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pembelians.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-600">{p.tanggal_beli}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nama_obat}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {(p.supplier as any)?.nama || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{p.jumlah}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(p.harga_satuan)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {formatRupiah(p.total_harga || p.jumlah * p.harga_satuan)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2 text-xs font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id!)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-right font-semibold text-gray-700">
                    Total Pembelian:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-purple-700">
                    {formatRupiah(totalPembelian)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PembelianStok;
