import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Transaction, PaymentMethod } from '../types';

interface RiwayatPenjualanViewProps {
  onViewTransaction: (trx: Transaction) => void;
}

export const RiwayatPenjualanView: React.FC<RiwayatPenjualanViewProps> = ({ onViewTransaction }) => {
  const { transactions, cancelTransaction } = usePOS();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Selesai' | 'Dibatalkan'>('Semua');
  const [methodFilter, setMethodFilter] = useState<string>('Semua');
  const [cancelModalTrx, setCancelModalTrx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(search.toLowerCase()) ||
      t.date.toLowerCase().includes(search.toLowerCase()) ||
      t.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === 'Semua' || t.status === statusFilter;
    const matchMethod = methodFilter === 'Semua' || t.paymentMethod === methodFilter;

    return matchSearch && matchStatus && matchMethod;
  });

  const totalSuccessfulAmount = filtered
    .filter((t) => t.status === 'Selesai')
    .reduce((sum, t) => sum + t.total, 0);

  const handleConfirmCancel = () => {
    if (cancelModalTrx) {
      cancelTransaction(cancelModalTrx.id);
      setCancelModalTrx(null);
    }
  };

  return (
    <div id="riwayat-page" className="flex flex-col w-full p-8 gap-6 bg-white min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
            Riwayat Penjualan
          </h1>
          <p className="text-sm text-[#504447] mt-1">
            Arsip lengkap seluruh struk transaksi kasir dan status pembayaran.
          </p>
        </div>

        {/* Summary Pill */}
        <div className="bg-[#f4faff] border border-[#dff1fb] px-4 py-2.5 rounded-2xl flex items-center gap-4 shadow-2xs self-start sm:self-auto">
          <div>
            <p className="text-[11px] font-semibold text-[#504447] uppercase">Total Terfilter</p>
            <p className="text-lg font-bold text-[#805062]">
              Rp {totalSuccessfulAmount.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="h-8 w-px bg-[#dff1fb]"></div>
          <div>
            <p className="text-[11px] font-semibold text-[#504447] uppercase">Transaksi</p>
            <p className="text-lg font-bold text-[#0d1e25]">{filtered.length}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#f4faff] p-3 rounded-2xl border border-[#dff1fb]">
        {/* Status Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['Semua', 'Selesai', 'Dibatalkan'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-[#805062] shadow-xs font-bold'
                  : 'text-[#504447] hover:bg-white/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Method filter and Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-white border border-gray-200 text-xs font-semibold text-[#504447] rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#f8bbd0]"
          >
            <option value="Semua">Semua Metode</option>
            <option value="Tunai">Tunai</option>
            <option value="QRIS">QRIS</option>
            <option value="Kartu">Kartu</option>
            <option value="Transfer">Transfer</option>
          </select>

          <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2 flex-1 md:w-64 border border-gray-200 focus-within:ring-2 focus-within:ring-[#f8bbd0]">
            <span className="material-symbols-outlined text-[#827377] text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari TRX, kasir..."
              className="bg-transparent text-xs text-[#0d1e25] outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(55,71,79,0.04)] border border-[#dff1fb] overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-[#f4faff] border-b border-[#dff1fb]">
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  No. Referensi
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Kasir
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Item Dibeli
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Metode
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Total
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#0d1e25]">
              {filtered.map((trx) => (
                <tr
                  key={trx.id}
                  className="hover:bg-[#f8bbd0]/10 transition-colors border-b border-[#dff1fb]/60 last:border-none"
                >
                  <td className="p-4 font-mono font-bold text-[#805062]">{trx.referenceNo}</td>
                  <td className="p-4 text-xs text-[#504447]">
                    {trx.date} • {trx.time}
                  </td>
                  <td className="p-4 font-semibold text-xs text-[#0d1e25]">{trx.cashierName}</td>
                  <td className="p-4 text-xs text-[#504447]">
                    <div className="max-w-[200px] truncate" title={trx.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}>
                      {trx.items.length} item ({trx.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-[#d4e5ef] text-[#504447] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-sm text-[#0d1e25]">
                    Rp {trx.total.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                        trx.status === 'Selesai'
                          ? 'bg-[#f8bbd0] text-[#76485a]'
                          : 'bg-[#d4e5ef] text-[#504447]'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onViewTransaction(trx)}
                        className="px-2.5 py-1.5 bg-[#FDF5E6] hover:bg-[#f8bbd0] text-[#76485a] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        title="Lihat & Cetak Struk"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        Struk
                      </button>
                      {trx.status === 'Selesai' && (
                        <button
                          onClick={() => setCancelModalTrx(trx)}
                          className="w-8 h-8 rounded-lg hover:bg-[#ffdad6] text-gray-400 hover:text-[#ba1a1a] flex items-center justify-center transition-colors"
                          title="Batalkan Transaksi"
                        >
                          <span className="material-symbols-outlined text-[18px]">block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Transaction Modal */}
      {cancelModalTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[26px]">block</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0d1e25]">
                Batalkan Transaksi {cancelModalTrx.referenceNo}?
              </h3>
              <p className="text-xs text-[#504447] mt-1.5 leading-relaxed">
                Status transaksi akan diubah menjadi Dibatalkan. Nominal Rp{' '}
                {cancelModalTrx.total.toLocaleString('id-ID')} akan dikecualikan dari perhitungan
                omzet laporan.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setCancelModalTrx(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#504447] hover:bg-gray-100 border border-[#d4c2c6]"
              >
                Kembali
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs"
              >
                Konfirmasi Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
