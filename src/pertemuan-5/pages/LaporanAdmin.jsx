import React, { useEffect, useState } from 'react';
import { getLaporanSummary } from '@/lib/apiLaporan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n ?? 0);

const formatDate = (d) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

function StatCard({ icon, label, value, color = 'blue', sub }) {
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-violet-500 to-violet-600',
    rose: 'from-rose-500 to-rose-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[color]} text-white p-5 shadow-lg`}>
      <div className="absolute -right-4 -top-4 text-6xl opacity-20 select-none">{icon}</div>
      <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-black leading-tight">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-75">{sub}</p>}
    </div>
  );
}

export default function LaporanAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('ringkasan');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        setData(await getLaporanSummary());
      } catch (e) {
        setErrorMsg(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
        {errorMsg}
      </div>
    );
  }

  const { products, pembelian, suppliers, dokters, orders } = data;

  // Kalkulasi
  const totalPembelian = pembelian.reduce((s, r) => s + (r.total_harga ?? r.jumlah * r.harga_satuan), 0);
  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const totalRevenue = completedOrders.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);
  const stokHabis = products.filter((p) => p.stock <= 0).length;
  const stokRendah = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  const tabs = [
    { id: 'ringkasan', label: '📊 Ringkasan' },
    { id: 'pembelian', label: '🛒 Pembelian Stok' },
    { id: 'produk', label: '💊 Produk & Stok' },
    { id: 'dokter', label: '👨‍⚕️ Dokter' },
    { id: 'supplier', label: '🏭 Supplier' },
    { id: 'pesanan', label: '🧾 Pesanan' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/70 shadow-sm p-6">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.15),transparent)] opacity-60" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Admin</h2>
          <p className="text-slate-500 text-sm mt-1">
            Laporan lengkap seluruh data operasional apotek — stok, pembelian, dokter, supplier, dan pesanan.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="💊" label="Total Produk" value={products.length} color="blue" />
        <StatCard icon="⚠️" label="Stok Habis" value={stokHabis} color="rose" sub={`${stokRendah} stok rendah`} />
        <StatCard icon="🛒" label="Pembelian Stok" value={pembelian.length} color="orange" sub={formatRp(totalPembelian)} />
        <StatCard icon="🏭" label="Supplier" value={suppliers.length} color="purple" />
        <StatCard icon="👨‍⚕️" label="Dokter" value={dokters.length} color="green" />
        <StatCard icon="💰" label="Pendapatan" value={formatRp(totalRevenue)} color="amber" sub={`${completedOrders.length} selesai / ${orders.length} total`} />
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Ringkasan */}
      {activeTab === 'ringkasan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-800">📦 Status Stok Produk</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {products.slice(0, 10).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                    <span className="text-slate-700 font-medium truncate max-w-[60%]">{p.name}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                      p.stock <= 0 ? 'bg-rose-100 text-rose-700'
                      : p.stock <= 10 ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {p.stock <= 0 ? 'Habis' : `${p.stock} unit`}
                    </span>
                  </div>
                ))}
                {products.length > 10 && (
                  <p className="text-xs text-slate-400 text-center pt-2">+{products.length - 10} produk lainnya</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-800">🧾 10 Pesanan Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {orders.slice(0, 10).map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-slate-700 font-medium">{formatDate(o.created_at)}</p>
                      <p className="text-slate-400 text-xs font-mono">{o.id.slice(0, 8)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{formatRp(o.total_amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700'
                        : o.status === 'Pending' ? 'bg-amber-100 text-amber-700'
                        : o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-center text-slate-400 py-6 text-sm">Belum ada pesanan.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Pembelian Stok */}
      {activeTab === 'pembelian' && (
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                🛒 Laporan Pembelian Stok
              </CardTitle>
              <CardDescription>{pembelian.length} transaksi — Total: <strong className="text-orange-700">{formatRp(totalPembelian)}</strong></CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Nama Obat</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4 text-right">Jumlah</th>
                    <th className="py-3 px-4 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pembelian.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{r.tanggal_beli}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{r.nama_obat}</td>
                      <td className="py-3 px-4 text-slate-500">{r.supplier?.nama ?? '-'}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700">{r.jumlah}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{formatRp(r.harga_satuan)}</td>
                      <td className="py-3 px-4 text-right font-bold text-orange-700 whitespace-nowrap">
                        {formatRp(r.total_harga ?? r.jumlah * r.harga_satuan)}
                      </td>
                    </tr>
                  ))}
                  {pembelian.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-slate-400">Belum ada data pembelian stok.</td></tr>
                  )}
                </tbody>
                {pembelian.length > 0 && (
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={6} className="py-3 px-4 text-right font-bold text-slate-700">Total Nilai Pembelian:</td>
                      <td className="py-3 px-4 text-right font-black text-orange-700">{formatRp(totalPembelian)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Produk & Stok */}
      {activeTab === 'produk' && (
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">💊 Laporan Produk & Stok</CardTitle>
              <CardDescription>{products.length} produk terdaftar</CardDescription>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-semibold">{stokHabis} Habis</span>
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">{stokRendah} Rendah</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Produk</th>
                    <th className="py-3 px-4 text-right">Harga</th>
                    <th className="py-3 px-4 text-right">Stok</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Nilai Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p, i) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{p.name}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{formatRp(p.price)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-700">{p.stock}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          p.stock <= 0 ? 'bg-rose-100 text-rose-700'
                          : p.stock <= 10 ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.stock <= 0 ? 'Habis' : p.stock <= 10 ? 'Rendah' : 'Tersedia'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-700">
                        {formatRp(p.stock * p.price)}
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-400">Belum ada produk.</td></tr>
                  )}
                </tbody>
                {products.length > 0 && (
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={5} className="py-3 px-4 text-right font-bold text-slate-700">Total Nilai Stok:</td>
                      <td className="py-3 px-4 text-right font-black text-blue-700">
                        {formatRp(products.reduce((s, p) => s + p.stock * p.price, 0))}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Dokter */}
      {activeTab === 'dokter' && (
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">👨‍⚕️ Laporan Dokter</CardTitle>
            <CardDescription>{dokters.length} dokter terdaftar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Dokter</th>
                    <th className="py-3 px-4">Spesialis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dokters.map((d, i) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{d.nama}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {d.spesialis}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dokters.length === 0 && (
                    <tr><td colSpan={3} className="py-12 text-center text-slate-400">Belum ada data dokter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Supplier */}
      {activeTab === 'supplier' && (
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">🏭 Laporan Supplier</CardTitle>
            <CardDescription>{suppliers.length} supplier terdaftar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Supplier</th>
                    <th className="py-3 px-4 text-right">Jml Pembelian</th>
                    <th className="py-3 px-4 text-right">Total Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliers.map((s, i) => {
                    const supPembelian = pembelian.filter((p) => p.supplier?.nama === s.nama);
                    const supTotal = supPembelian.reduce((sum, p) => sum + (p.total_harga ?? p.jumlah * p.harga_satuan), 0);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{s.nama}</td>
                        <td className="py-3 px-4 text-right font-medium text-slate-700">{supPembelian.length}</td>
                        <td className="py-3 px-4 text-right font-bold text-violet-700">{formatRp(supTotal)}</td>
                      </tr>
                    );
                  })}
                  {suppliers.length === 0 && (
                    <tr><td colSpan={4} className="py-12 text-center text-slate-400">Belum ada data supplier.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Pesanan */}
      {activeTab === 'pesanan' && (
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">🧾 Laporan Pesanan</CardTitle>
              <CardDescription>{orders.length} total pesanan — Pendapatan: <strong className="text-emerald-700">{formatRp(totalRevenue)}</strong></CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Completed','Pending','Processing','Cancelled'].map((st) => (
                <span key={st} className={`px-2 py-1 rounded-full font-semibold ${
                  st === 'Completed' ? 'bg-emerald-100 text-emerald-700'
                  : st === 'Pending' ? 'bg-amber-100 text-amber-700'
                  : st === 'Cancelled' ? 'bg-rose-100 text-rose-700'
                  : 'bg-blue-100 text-blue-700'
                }`}>
                  {orders.filter((o) => o.status === st).length} {st}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 font-bold bg-slate-50/30 border-b border-slate-100">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">ID Pesanan</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o, i) => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-400">{i + 1}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{o.id.slice(0, 12)}...</td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{formatDate(o.created_at)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">{formatRp(o.total_amount)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700'
                          : o.status === 'Pending' ? 'bg-amber-100 text-amber-700'
                          : o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-slate-400">Belum ada data pesanan.</td></tr>
                  )}
                </tbody>
                {orders.length > 0 && (
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right font-bold text-slate-700">Total Pendapatan (Completed):</td>
                      <td className="py-3 px-4 text-right font-black text-emerald-700">{formatRp(totalRevenue)}</td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
