import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listMyPrescriptions, uploadPrescription } from '@/lib/apiPrescriptions';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-600 border-rose-200',
  Fulfilled: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function UploadResep() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [form, setForm] = useState({ doctorName: '', notes: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!userId) return;
    listMyPrescriptions(userId).then(setRecent).catch(() => {});
  }, [userId, successMsg]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await uploadPrescription({
        userId,
        doctorName: form.doctorName,
        notes: form.notes,
        imageUrl: form.imageUrl,
      });
      setForm({ doctorName: '', notes: '', imageUrl: '' });
      setSuccessMsg('Resep berhasil diupload! Tim apotek akan segera memproses.');
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
          <Upload className="w-7 h-7 text-blue-600" />
          Upload Resep
        </h2>
        <p className="text-sm text-slate-500">Unggah resep dokter Anda untuk pemesanan obat.</p>
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">{successMsg}</div>}

      <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Dokter</label>
            <input
              value={form.doctorName}
              onChange={(e) => setForm((f) => ({ ...f, doctorName: e.target.value }))}
              className="w-full p-2.5 border border-slate-300 rounded-lg"
              placeholder="Dr. ..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">URL Gambar Resep</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg"
              placeholder="https://..."
            />
            <p className="text-xs text-slate-400 mt-1">Masukkan link gambar resep (URL).</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Catatan</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full p-2.5 border border-slate-300 rounded-lg"
              placeholder="Catatan tambahan..."
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Mengupload...' : 'Upload Resep'}
          </Button>
        </form>
      </div>

      {recent.length > 0 && (
        <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Upload Terbaru
          </h3>
          <div className="space-y-2">
            {recent.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{r.doctor_name ?? 'Tanpa nama dokter'}</p>
                  <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <Badge className={statusColors[r.status] ?? ''}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
