import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';

export const LaporanView: React.FC = () => {
  const { transactions } = usePOS();
  const [timeRange, setTimeRange] = useState<'Hari Ini' | '7 Hari Terakhir' | 'Bulan Ini'>('Hari Ini');

  const validTransactions = transactions.filter((t) => t.status === 'Selesai');

  // Total metrics
  const totalRevenue = validTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactionsCount = validTransactions.length;
  const averageBasketValue =
    totalTransactionsCount > 0 ? Math.round(totalRevenue / totalTransactionsCount) : 0;
  const totalItemsSold = validTransactions.reduce(
    (sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  // Payment method breakdown
  const paymentBreakdown: Record<string, number> = validTransactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
    return acc;
  }, {} as Record<string, number>);

  // Cashier performance
  const cashierStats: Record<string, { count: number; revenue: number }> = validTransactions.reduce(
    (acc, t) => {
      if (!acc[t.cashierName]) {
        acc[t.cashierName] = { count: 0, revenue: 0 };
      }
      acc[t.cashierName].count += 1;
      acc[t.cashierName].revenue += t.total;
      return acc;
    },
    {} as Record<string, { count: number; revenue: number }>
  );

  const handleExportReport = () => {
    const lines = [
      'LAPORAN PENJUALAN MYCASHIER POS',
      `Tanggal Cetak: ${new Date().toLocaleString('id-ID')}`,
      `Rentang Waktu: ${timeRange}`,
      '',
      `Total Omzet: Rp ${totalRevenue.toLocaleString('id-ID')}`,
      `Jumlah Transaksi: ${totalTransactionsCount}`,
      `Rata-rata Transaksi (Basket Size): Rp ${averageBasketValue.toLocaleString('id-ID')}`,
      `Total Item Terjual: ${totalItemsSold} Unit`,
      '',
      '--- RINCIAN METODE PEMBAYARAN ---',
      ...Object.entries(paymentBreakdown).map(
        ([method, amt]: [string, number]) => `${method}: Rp ${amt.toLocaleString('id-ID')}`
      ),
      '',
      '--- KINERJA KASIR ---',
      ...Object.entries(cashierStats).map(
        ([name, stats]: [string, { count: number; revenue: number }]) =>
          `${name}: ${stats.count} Transaksi (Total Rp ${stats.revenue.toLocaleString('id-ID')})`
      ),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-penjualan-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="laporan-page" className="flex flex-col w-full p-8 gap-8 bg-white min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
            Laporan & Analitik Penjualan
          </h1>
          <p className="text-sm text-[#504447] mt-1">
            Ringkasan omzet, tren transaksi, dan distribusi metode pembayaran.
          </p>
        </div>
        <div className="flex gap-3 items-center self-start sm:self-auto">
          {/* Time range selector */}
          <div className="flex bg-[#f4faff] border border-[#dff1fb] p-1 rounded-xl">
            {(['Hari Ini', '7 Hari Terakhir', 'Bulan Ini'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-white text-[#805062] shadow-xs'
                    : 'text-[#504447] hover:text-[#0d1e25]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 bg-[#805062] hover:bg-[#65394b] text-white px-4 py-2 rounded-xl transition-colors font-semibold text-xs shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
            Total Omzet
          </p>
          <p className="text-2xl font-bold text-[#805062] mt-1">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-[#504447] mt-2">Omzet bersih dari transaksi selesai</p>
        </div>

        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
            Jumlah Transaksi
          </p>
          <p className="text-2xl font-bold text-[#0d1e25] mt-1">{totalTransactionsCount}</p>
          <p className="text-xs text-[#504447] mt-2">Struk berhasil diproses</p>
        </div>

        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
            Rata-rata Nilai Transaksi
          </p>
          <p className="text-2xl font-bold text-[#0d1e25] mt-1">
            Rp {averageBasketValue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-[#504447] mt-2">Rata-rata belanja per pelanggan</p>
        </div>

        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5">
          <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
            Produk Terjual
          </p>
          <p className="text-2xl font-bold text-[#0d1e25] mt-1">{totalItemsSold} Unit</p>
          <p className="text-xs text-[#504447] mt-2">Kuantitas produk keluar</p>
        </div>
      </div>

      {/* Payment Methods and Cashier Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0d1e25]">
              Distribusi Metode Pembayaran
            </h3>
            <span className="material-symbols-outlined text-[#805062]">donut_large</span>
          </div>

          <div className="flex flex-col gap-3">
            {Object.keys(paymentBreakdown).length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Belum ada transaksi selesai.</p>
            ) : (
              (Object.entries(paymentBreakdown) as [string, number][]).map(([method, amount]) => {
                const percentage = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                return (
                  <div key={method} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#0d1e25]">{method}</span>
                      <span className="text-[#805062]">
                        Rp {amount.toLocaleString('id-ID')} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-gray-100">
                      <div
                        className="h-full rounded-full bg-[#805062]"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cashier Performance */}
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0d1e25]">Kinerja Kasir</h3>
            <span className="material-symbols-outlined text-[#805062]">badge</span>
          </div>

          <div className="flex flex-col gap-3">
            {Object.keys(cashierStats).length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">Belum ada data kinerja kasir.</p>
            ) : (
              (Object.entries(cashierStats) as [string, { count: number; revenue: number }][]).map(
                ([name, stats]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f8bbd0] text-[#76485a] flex items-center justify-center font-bold text-sm">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#0d1e25]">{name}</p>
                        <p className="text-xs text-[#504447]">{stats.count} Transaksi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-[#805062]">
                        Rp {stats.revenue.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[11px] text-[#504447]">Total Kontribusi</p>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
