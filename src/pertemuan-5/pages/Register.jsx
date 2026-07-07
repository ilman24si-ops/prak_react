import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getAuthErrorMessage } from '@/lib/authErrors';

export default function Register({ onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setErrorMsg(getAuthErrorMessage(error));
      setLoading(false);
      return;
    }

    setLoading(false);

    if (data.session) {
      setSuccessMsg('Akun berhasil dibuat. Anda sudah login.');
      return;
    }

    setSuccessMsg(
      'Akun berhasil dibuat. Cek inbox email untuk konfirmasi, lalu login. '
      + 'Jika tidak ada email, nonaktifkan "Confirm email" di Supabase Dashboard → Authentication → Providers → Email.'
    );
    setTimeout(() => onNavigate?.('Login'), 4000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-slate-800">Pendaftaran</h2>
        <p className="text-sm text-slate-500 mt-1 mb-5">Daftarkan akun baru (role default: Guest, Admin dapat mengubahnya).</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
              {successMsg}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition"
            type="submit"
          >
            {loading ? 'Creating account...' : 'Daftar'}
          </button>

          <div className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => onNavigate?.('Login')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
