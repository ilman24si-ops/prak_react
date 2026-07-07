import React, { useEffect, useState } from 'react';
import supabase from '@/services/supabaseClient';
import { PembelianStok } from '@/types';

interface StatCard {
  label: string;
  value: string | number;
  color: string;
  icon: string;
}

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

const LaporanAdmin: React.FC = () => {
  const [stats, setStats] = useState({
    totalDokter: 0,
    totalSupplier: 0,
    totalPembelian: 0,
    totalNilaiPembelian: 0,
    totalUser: 0,
  });
  const [recentPembelian, setRecentPembelian] = useState<PembelianStok[]>([]);
  const [obatTerbanyak, setObatTerbanyak] = useState<{ nama_obat: string; total_qty: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    const [dokterRes, supplierRes, pembelianRes, userRes] = await Promise.all([
      supabase.from('dokters').select('id', { count: 'exact', head: true }),
      supabase.from('suppliers').select('id', { count: 'exact', head: true }),
      supabase.from('pembelian_stok').select('*, supplier:suppliers(nama)').order('tanggal_beli', { ascending: false }),
      supabase.from('users').select('id', { count: 'exact', head: true }),
    ]);

    const pembelianData: PembelianStok[] = pembelianRes.data || [];
    const totalNilai = pembelianData.reduce((sum, p) => sum + (p.total_harga || 0), 0);

    // Aggregate top obat by jumlah
    const obatMap: Record<string, number> = {};
    pembelianData.forEach((p) => {
      obatMap[p.nama_obat] = (obatMap[p.nama_obat] || 0) + p.jumlah;
    });
    const sorted = Object.entries(obatMap)
      .map(([nama_obat, total_qty]) => ({ nama_obat, total_qty }))
      .sort((a, b) => b.total_qty - a.total_qty)
      .slice(0, 5);

    setStats({
      totalDokter: dokterRes.count || 0,
      totalSupplier: supplierRes.count || 0,
      totalPembelian: pembelianData.length,
      totalNilaiPembelian: totalNilai,
      totalUser: userRes.count || 0,
    });
    setRecentPembelian(pembelianData.slice(0, 5));
    setObatTerbanyak(sorted);
    setLoading(false);
  };

  const cards: StatCard[] = [
    { label: 'Total Dokter', value: stats.totalDokter, color: 'bg-blue-500', icon: '👨‍⚕️' },
    { label: 'Total Supplier', value: stats.totalSupplier, color: 'bg-green-500', icon: '🏭' },
    { label: 'Total Pembelian', value: stats.totalPembelian, color: 'bg-purple-500', icon: '🛒' },
    { label: 'Nilai Pembelian', value: formatRupiah(stats.totalNilaiPembelian), color: 'bg-orange-500', icon: '💰' },
    { label: 'Total User', value: stats.totalUser, color: 'bg-gray-600', icon: '👤' },
  ];

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Memuat laporan...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Laporan & Statistik</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} text-white rounded-xl p-4 shadow`}>
            <div className="text-3xl mb-1">{card.icon}</div>
            <div className="text-2xl font-bold leading-tight">{card.value}</div>
            <div className="text-xs mt-1 opacity-90">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pembelian Terbaru */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-700 mb-4">5 Pembelian Terakhir</h3>
          {recentPembelian.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada data pembelian.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b text-xs uppercase">
                <tr>
                  <th className="pb-2 text-left">Tanggal</th>
                  <th className="pb-2 text-left">Obat</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentPembelian.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 text-gray-500">{p.tanggal_beli}</td>
                    <td className="py-2 font-medium text-gray-800">{p.nama_obat}</td>
                    <td className="py-2 text-right text-purple-700 font-semibold">
                      {formatRupiah(p.total_harga || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Obat Terbeli */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Top 5 Obat Terbeli (Qty)</h3>
          {obatTerbanyak.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada data.</p>
          ) : (
            <div className="space-y-3">
              {obatTerbanyak.map((o, i) => {
                const max = obatTerbanyak[0].total_qty;
                const pct = Math.round((o.total_qty / max) * 100);
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-400', 'bg-gray-500'];
                return (
                  <div key={o.nama_obat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {i + 1}. {o.nama_obat}
                      </span>
                      <span className="text-gray-500">{o.total_qty} unit</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${colors[i]} h-2 rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-right">
        <button
          onClick={fetchLaporan}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default LaporanAdmin;
