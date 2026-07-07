import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listArticles, createArticle, deleteArticle } from '@/lib/apiArticles';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const emptyForm = { title: '', content: '', author: '', image_url: '' };

export default function ArtikelKesehatan() {
  const { isAdmin } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setArticles(await listArticles({ publishedOnly: !isAdmin }));
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [isAdmin]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createArticle({ ...form, is_published: true });
      setForm(emptyForm);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await deleteArticle(id);
      setSelected(null);
      await refresh();
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setSelected(null)} className="text-sm text-blue-600 font-bold hover:underline">
          ← Kembali
        </button>
        <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-6">
          {selected.image_url && (
            <img src={selected.image_url} alt={selected.title} className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          <h2 className="text-2xl font-bold text-slate-800">{selected.title}</h2>
          <p className="text-xs text-slate-400 mt-1">
            {selected.author ?? 'Apotek Keluarga 25'} · {new Date(selected.created_at).toLocaleDateString('id-ID')}
          </p>
          <p className="text-slate-600 mt-4 whitespace-pre-wrap leading-relaxed">{selected.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Artikel Kesehatan
          </h2>
          <p className="text-sm text-slate-500">
            {isAdmin ? 'Kelola artikel kesehatan untuk member.' : 'Baca tips dan informasi kesehatan.'}
          </p>
        </div>
        {isAdmin && <Button onClick={() => setShowForm(!showForm)}>+ Tulis Artikel</Button>}
      </div>

      {errorMsg && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errorMsg}</div>}

      {isAdmin && showForm && (
        <div className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required placeholder="Judul Artikel" className="w-full p-2.5 border border-slate-300 rounded-lg" />
            <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              placeholder="Penulis" className="w-full p-2.5 border border-slate-300 rounded-lg" />
            <input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="URL Gambar (opsional)" className="w-full p-2.5 border border-slate-300 rounded-lg" />
            <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              required rows={5} placeholder="Isi artikel..." className="w-full p-2.5 border border-slate-300 rounded-lg" />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button type="submit">Publikasikan</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((a) => (
          <div key={a.id}
            className="bg-white/70 border border-slate-200 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
            onClick={() => setSelected(a)}>
            {a.image_url && (
              <img src={a.image_url} alt={a.title} className="w-full h-36 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-slate-800 line-clamp-2">{a.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {a.author ?? 'Apotek Keluarga 25'} · {new Date(a.created_at).toLocaleDateString('id-ID')}
              </p>
              <p className="text-sm text-slate-500 mt-2 line-clamp-3">{a.content}</p>
              {isAdmin && (
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}
                  className="text-xs text-rose-600 font-bold mt-2 hover:underline">Hapus</button>
              )}
            </div>
          </div>
        ))}
        {articles.length === 0 && !loading && (
          <p className="col-span-3 text-center text-slate-400 py-10">Belum ada artikel.</p>
        )}
      </div>
    </div>
  );
}
