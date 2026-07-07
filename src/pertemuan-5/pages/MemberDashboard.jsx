import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Award, Coins, Sparkles, User, ShieldAlert } from 'lucide-react';

const tierConfigs = {
  Bronze: {
    bg: 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-50',
    border: 'border-amber-600/30',
    badge: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    description: 'Tier awal keanggotaan. Tingkatkan belanja untuk naik ke Silver!'
  },
  Silver: {
    bg: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 text-slate-50',
    border: 'border-slate-300/30',
    badge: 'bg-slate-300/20 text-slate-100 border-slate-200/40',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.15)]',
    description: 'Tier Menengah. Nikmati penawaran eksklusif dan kumpulkan poin lebih cepat!'
  },
  Gold: {
    bg: 'bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 text-yellow-50',
    border: 'border-yellow-400/40',
    badge: 'bg-white/20 text-yellow-100 border-yellow-200/50',
    glow: 'shadow-[0_0_25px_rgba(234,179,8,0.25)]',
    description: 'Tier Tertinggi! Anda adalah pelanggan prioritas kami dengan benefit maksimal.'
  },
};

export default function MemberDashboard() {
  const { profile, session, refreshProfile } = useAuth();

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const tier = profile?.tier ?? 'Bronze';
  const points = profile?.points ?? 0;
  const name = profile?.full_name ?? session?.user?.email?.split('@')[0] ?? 'Member';
  const email = session?.user?.email ?? '';

  // Calculate tier progress
  let nextTier = '';
  let pointsNeeded = 0;
  let progressPercent = 0;

  if (points < 100) {
    nextTier = 'Silver';
    pointsNeeded = 100 - points;
    progressPercent = Math.min(100, (points / 100) * 100);
  } else if (points < 500) {
    nextTier = 'Gold';
    pointsNeeded = 500 - points;
    progressPercent = Math.min(100, ((points - 100) / 400) * 100);
  } else {
    nextTier = 'Gold (Maksimal)';
    pointsNeeded = 0;
    progressPercent = 100;
  }

  const currentTierConfig = tierConfigs[tier] ?? tierConfigs.Bronze;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm p-6">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.12),transparent)] opacity-60" />
        <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]" />
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Dashboard Member
              </h2>
            </div>
            <p className="text-slate-500 text-sm italic">
              Selamat datang kembali, nikmati poin belanja dan status tier spesial Anda.
            </p>
          </div>
          {profile?.isFallback && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              Mode Demo (Gagal terhubung ke database)
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="relative overflow-hidden border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Profil Member</CardTitle>
              <CardDescription>Detail akun aktif</CardDescription>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform duration-300">
              <User className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-slate-800 truncate">{name}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Keanggotaan aktif</span>
              <span className="font-semibold text-slate-700">Member Resmi</span>
            </div>
          </CardContent>
        </Card>

        {/* Points Progress Card */}
        <Card className="relative overflow-hidden border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Poin</CardTitle>
              <CardDescription>Akumulasi poin Anda</CardDescription>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
              <Coins className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-emerald-600 tracking-tight">{points}</span>
              <span className="text-sm font-semibold text-slate-500">Poin</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Progress ke {nextTier}</span>
                <span className="text-slate-700">{points} / {points < 100 ? 100 : 500}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {pointsNeeded > 0 ? (
                <p className="text-[11px] font-semibold text-slate-400 pt-1 flex items-center gap-1">
                  Butuh <span className="text-emerald-600">{pointsNeeded} poin</span> lagi untuk naik tingkat.
                </p>
              ) : (
                <p className="text-[11px] font-semibold text-emerald-600 pt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse" /> Anda berada di Tier tertinggi!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tier Card */}
        <Card className={`relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-transparent ${currentTierConfig.bg} ${currentTierConfig.glow} group`}>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-wider">Level Keanggotaan</CardTitle>
              <CardDescription className="text-white/60">Loyalty tier</CardDescription>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black tracking-tight">{tier}</span>
              <Badge className={`text-xs px-2.5 py-0.5 border ${currentTierConfig.badge} font-bold`}>
                {tier} Member
              </Badge>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              {currentTierConfig.description}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Tier Benefits Info Section */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-800">Panduan Level & Poin Keanggotaan</CardTitle>
          <CardDescription>Mekanisme kenaikan level dan ketentuan perolehan poin</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/40">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 font-bold text-sm">BR</div>
            <div>
              <h5 className="font-bold text-slate-800 text-sm">Bronze Tier</h5>
              <p className="text-xs text-slate-500 mt-0.5">Syarat: 0 - 99 poin</p>
              <p className="text-xs text-slate-400 mt-1">Level default untuk member baru terdaftar.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/40">
            <div className="p-2 rounded-lg bg-slate-400/20 text-slate-700 font-bold text-sm">SL</div>
            <div>
              <h5 className="font-bold text-slate-800 text-sm">Silver Tier</h5>
              <p className="text-xs text-slate-500 mt-0.5">Syarat: 100 - 499 poin</p>
              <p className="text-xs text-slate-400 mt-1">Dapatkan promo khusus dan voucher diskon bulanan.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/40">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 font-bold text-sm">GD</div>
            <div>
              <h5 className="font-bold text-slate-800 text-sm">Gold Tier</h5>
              <p className="text-xs text-slate-500 mt-0.5">Syarat: $\ge$ 500 poin</p>
              <p className="text-xs text-slate-400 mt-1">Layanan prioritas, promo eksklusif, dan hadiah langsung.</p>
            </div>
          </div>
        </CardContent>
        <div className="px-6 py-4 bg-emerald-50/60 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-800 font-semibold">
          <span className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-emerald-600" />
            Ketentuan Poin: Belanja Rp 10.000 = 1 Poin (Pembulatan ke bawah)
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-emerald-700 italic">Poin bertambah otomatis setelah transaksi ditandai "Completed" oleh Admin.</span>
        </div>
      </Card>
    </div>
  );
}
