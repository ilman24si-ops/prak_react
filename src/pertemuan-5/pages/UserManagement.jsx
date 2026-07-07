import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { deleteProfile, listUsers, updateProfile, ROLES } from '@/lib/apiUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldAlert, Edit, Trash2, X, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const roleColors = {
  Admin: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
  Member: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  Guest: 'bg-slate-50 text-slate-600 border-slate-200/50',
};

const tierColors = {
  Bronze: 'bg-amber-50 text-amber-700 border-amber-200/50',
  Silver: 'bg-slate-100 text-slate-700 border-slate-300/50',
  Gold: 'bg-yellow-50 text-yellow-700 border-yellow-200/50',
};

export default function UserManagement() {
  const { profile: adminProfile } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ full_name: '', role: 'Member', points: 0, tier: 'Bronze' });

  const refresh = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      setProfiles(await listUsers());
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingId) return;

    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateProfile(editingId, {
        full_name: draft.full_name,
        role: draft.role,
        points: Number(draft.points),
        tier: draft.tier,
      });
      setEditingId(null);
      setSuccessMsg('Profil pengguna berhasil diperbarui!');
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleDelete(id) {
    if (id === adminProfile?.id) {
      alert('Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif!');
      return;
    }
    if (!confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;

    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteProfile(id);
      setSuccessMsg('Pengguna berhasil dihapus.');
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm p-6">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.12),transparent)] opacity-60" />
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">User & Role Management</h2>
            <p className="text-slate-500 text-sm">Kelola hak akses pengguna, perbarui poin loyalitas, serta atur keanggotaan Admin/Member.</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          {successMsg}
        </div>
      )}

      {/* Main Table Card */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Daftar Pengguna
            </CardTitle>
            <CardDescription>Seluruh user terdaftar di database public.profiles</CardDescription>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase bg-white border px-3 py-1 rounded-xl shadow-inner">
            {loading ? 'Memuat...' : `${profiles.length} Pengguna`}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                  <th className="py-3 px-6">ID Pengguna</th>
                  <th className="py-3 px-6">Nama Lengkap</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6 text-center">Role</th>
                  <th className="py-3 px-6 text-center">Poin</th>
                  <th className="py-3 px-6 text-center">Tier</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {p.id}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700 whitespace-nowrap">
                      {p.full_name || 'Tanpa Nama'}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm whitespace-nowrap">
                      {p.email || '-'}
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <Badge className={`text-xs px-2.5 py-0.5 border ${roleColors[p.role] ?? roleColors.Member}`}>
                        {p.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700 whitespace-nowrap">
                      {p.points} Poin
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <Badge className={`text-xs px-2.5 py-0.5 border ${tierColors[p.tier] ?? tierColors.Bronze}`}>
                        {p.tier}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(p.id);
                            setDraft({
                              full_name: p.full_name ?? '',
                              role: p.role ?? 'Member',
                              points: p.points ?? 0,
                              tier: p.tier ?? 'Bronze',
                            });
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors"
                          title="Edit Pengguna"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                      Belum ada pengguna terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Editing Drawer / Box */}
      {editingId && (
        <Card className="border-blue-200 bg-blue-50/5 shadow-md p-6">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between border-b border-blue-100">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Ubah Profil & Hak Akses Pengguna
              </CardTitle>
              <CardDescription>ID Pengguna: {editingId}</CardDescription>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setDraft({ full_name: '', role: 'Member', points: 0, tier: 'Bronze' });
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  value={draft.full_name}
                  onChange={(e) => setDraft((d) => ({ ...d, full_name: e.target.value }))}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Role / Hak Akses</label>
                <select
                  value={draft.role}
                  onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Poin Belanja</label>
                <input
                  type="number"
                  min="0"
                  value={draft.points}
                  onChange={(e) => setDraft((d) => ({ ...d, points: Number(e.target.value) }))}
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tingkat Keanggotaan (Tier)</label>
                <select
                  value={draft.tier}
                  onChange={(e) => setDraft((d) => ({ ...d, tier: e.target.value }))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setDraft({ full_name: '', role: 'Member', points: 0, tier: 'Bronze' });
                  }}
                  className="rounded-xl"
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
