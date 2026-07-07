import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listTestimonials, createTestimonial, approveTestimonial } from '@/lib/apiTestimonials';
import { Button } from '@/components/ui/button';
import { Star, MessageSquareQuote } from 'lucide-react';

function StarRating({ rating, onChange, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={readonly}
          onClick={() => onChange?.(n)}
          className={readonly ? 'cursor-default' : 'cursor-pointer'}>
          <Star className={`w-5 h-5 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function Testimoni() {
  const { session, isAdmin } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({ content: '', rating: 5 });

  const refresh = async () => {
    setLoading(true);
    try {
      setTestimonials(await listTestimonials({ approvedOnly: !isAdmin }));
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
    setSuccessMsg('');
    try {
      await createTestimonial({ userId: session?.user?.id, content: form.content, rating: form.rating });
      setForm({ content: '', rating: 5 });
      setSuccessMsg('Testimoni berhasil dikirim! Menunggu persetujuan admin.');
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleApprove(id, approved) {
    try {
      await approveTestimonial(id, approved);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquareQuote className="w-7 h-7 text-blue-600" />
          Testimoni
        </h2>
        <p className="text-sm text-slate-500">
          {isAdmin ? 'Kelola testimoni dari member.' : 'Bagikan pengalaman Anda dan baca ulasan lainnya.'}
        </p>
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}
      {successMsg && <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">{successMsg}</div>}

      {!isAdmin && (
        <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3">Tulis Testimoni</h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Rating</label>
              <StarRating rating={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
            </div>
            <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required rows={3} placeholder="Ceritakan pengalaman Anda..."
              className="w-full p-2.5 border border-slate-300 rounded-lg" />
            <Button type="submit">Kirim Testimoni</Button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{t.profiles?.full_name ?? 'Member'}</p>
                <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString('id-ID')}</p>
              </div>
              <StarRating rating={t.rating} readonly />
            </div>
            <p className="text-sm text-slate-600 mt-3 italic">"{t.content}"</p>
            {isAdmin && (
              <div className="flex gap-2 mt-3">
                {!t.is_approved ? (
                  <button type="button" onClick={() => handleApprove(t.id, true)}
                    className="text-xs font-bold text-emerald-600 hover:underline">Setujui</button>
                ) : (
                  <button type="button" onClick={() => handleApprove(t.id, false)}
                    className="text-xs font-bold text-rose-600 hover:underline">Cabut Persetujuan</button>
                )}
              </div>
            )}
          </div>
        ))}
        {testimonials.length === 0 && !loading && (
          <p className="col-span-2 text-center text-slate-400 py-10">Belum ada testimoni.</p>
        )}
      </div>
    </div>
  );
}
