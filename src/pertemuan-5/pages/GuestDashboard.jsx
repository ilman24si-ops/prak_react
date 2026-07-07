import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function GuestDashboard() {
  const { profile, session } = useAuth();
  const displayName = profile?.full_name ?? session?.user?.email ?? 'Guest';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white p-8 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,255,255,0.07),transparent)]" />
        <div className="relative">
          <p className="text-slate-400 text-sm font-medium mb-1">Selamat datang,</p>
          <h1 className="text-3xl font-bold tracking-tight">{displayName} 👋</h1>
          <p className="mt-2 text-slate-300 text-sm max-w-lg">
            Akun Anda saat ini memiliki akses <span className="font-bold text-yellow-400">Guest</span>.
            Hubungi Admin untuk mendapatkan akses penuh sebagai Member.
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
          <span className="text-4xl">🔒</span>
          <h3 className="font-bold text-slate-800">Akses Terbatas</h3>
          <p className="text-slate-500 text-sm">
            Role Guest hanya dapat melihat halaman ini. Fitur belanja & resep memerlukan role Member.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
          <span className="text-4xl">💊</span>
          <h3 className="font-bold text-slate-800">Produk Kami</h3>
          <p className="text-slate-500 text-sm">
            Jelajahi katalog produk obat-obatan dan suplemen kesehatan kami.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center gap-3">
          <span className="text-4xl">📰</span>
          <h3 className="font-bold text-slate-800">Artikel Kesehatan</h3>
          <p className="text-slate-500 text-sm">
            Baca artikel dan tips kesehatan terbaru dari tim apoteker kami.
          </p>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-yellow-800 text-lg">Ingin akses lebih?</h3>
          <p className="text-yellow-700 text-sm mt-1">
            Minta Admin untuk mengubah role Anda menjadi <strong>Member</strong> agar bisa memesan obat,
            upload resep, dan menikmati program loyalitas.
          </p>
        </div>
        <div className="shrink-0 bg-yellow-400 text-yellow-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm">
          Role: Guest
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>👤</span> Informasi Akun
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-slate-500 font-medium">Nama</span>
            <span className="font-bold text-slate-800">{profile?.full_name ?? '-'}</span>
          </div>
          <div className="flex justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-slate-500 font-medium">Email</span>
            <span className="font-bold text-slate-800 truncate max-w-[180px]">
              {session?.user?.email ?? '-'}
            </span>
          </div>
          <div className="flex justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-slate-500 font-medium">Role</span>
            <span className="font-bold text-yellow-600">Guest</span>
          </div>
          <div className="flex justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-slate-500 font-medium">Status</span>
            <span className="font-bold text-slate-500">Menunggu Verifikasi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
