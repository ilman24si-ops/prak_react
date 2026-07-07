import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listPromos, listActivePromos, createPromo, updatePromo, deletePromo } from '@/lib/apiPromos';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const emptyForm = { title: '', content: '', discount_percent: '', valid_until: '' };

export default function BroadcastPromo() {
  const { isAdmin } = useAuth();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      setPromos(isAdmin ? await listPromos() : await listActivePromos());
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [isAdmin]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createPromo({
        title: form.title,
        content: form.content,
        discount_percent: Number(form.discount_percent) || 0,
        valid_until: form.valid_until || null,
        is_active: true,
      });
      setForm(emptyForm);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function toggleActive(id, current) {
    try {
      await updatePromo(id, { is_active: !current });
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus promo ini?')) return;
    try {
      await deletePromo(id);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-blue-600" />
            Broadcast Promo
          </h2>
          <p className="text-sm text-slate-500">
            {isAdmin ? 'Buat dan kelola promo untuk member.' : 'Lihat promo dan penawaran terbaru.'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)}>+ Buat Promo</Button>
        )}
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}

      {isAdmin && showForm && (
        <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3">Promo Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required placeholder="Judul Promo" className="p-2.5 border border-slate-300 rounded-lg" />
            <input value={form.discount_percent} onChange={(e) => setForm((f) => ({ ...f, discount_percent: e.target.value }))}
              type="number" min="0" max="100" placeholder="Diskon (%)" className="p-2.5 border border-slate-300 rounded-lg" />
            <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required rows={2} placeholder="Isi promo..." className="md:col-span-2 p-2.5 border border-slate-300 rounded-lg" />
            <input value={form.valid_until} onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
              type="date" className="p-2.5 border border-slate-300 rounded-lg" />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button type="submit">Broadcast</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((p) => (
          <div key={p.id} className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-800">{p.title}</h3>
              {p.discount_percent > 0 && (
                <Badge className="bg-rose-50 text-rose-600 border-rose-200 shrink-0">
                  -{p.discount_percent}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-2">{p.content}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
              <span>{new Date(p.created_at).toLocaleDateString('id-ID')}</span>
              {p.valid_until && <span>Berlaku s/d {new Date(p.valid_until).toLocaleDateString('id-ID')}</span>}
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                <button type="button" onClick={() => toggleActive(p.id, p.is_active)}
                  className="text-xs font-bold text-blue-600 hover:underline">
                  {p.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button type="button" onClick={() => handleDelete(p.id)}
                  className="text-xs font-bold text-rose-600 hover:underline">Hapus</button>
              </div>
            )}
          </div>
        ))}
        {promos.length === 0 && !loading && (
          <p className="col-span-2 text-center text-slate-400 py-10">Belum ada promo.</p>
        )}
      </div>
    </div>
  );
}
