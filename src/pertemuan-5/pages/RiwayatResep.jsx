import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listMyPrescriptions } from '@/lib/apiPrescriptions';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-600 border-rose-200',
  Fulfilled: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function RiwayatResep() {
  const { session } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    setLoading(true);
    listMyPrescriptions(session.user.id)
      .then(setPrescriptions)
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          Riwayat Resep Obat
        </h2>
        <p className="text-sm text-slate-500">Lihat semua resep yang pernah Anda upload.</p>
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}

      <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50/70 flex justify-between">
          <span className="font-bold text-slate-700">Daftar Resep</span>
          <span className="text-xs text-slate-400">{loading ? 'Loading...' : `${prescriptions.length} resep`}</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Tanggal</th>
                <th className="py-2 pr-4">Dokter</th>
                <th className="py-2 pr-4">Catatan</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Gambar</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 text-slate-500">
                    {new Date(r.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 pr-4 font-medium">{r.doctor_name ?? '-'}</td>
                  <td className="py-3 pr-4 text-slate-500 max-w-xs truncate">{r.notes ?? '-'}</td>
                  <td className="py-3 pr-4">
                    <Badge className={statusColors[r.status] ?? ''}>{r.status}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    {r.image_url ? (
                      <a href={r.image_url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs font-bold">Lihat</a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
              {prescriptions.length === 0 && !loading && (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">Belum ada riwayat resep.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
