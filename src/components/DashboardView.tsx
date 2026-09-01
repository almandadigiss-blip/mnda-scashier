import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Transaction } from '../types';

interface DashboardViewProps {
  onViewTransaction?: (trx: Transaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewTransaction }) => {
  const { setCurrentTab, transactions, products, restockProduct } = usePOS();
  const [selectedWeek, setSelectedWeek] = useState<'Minggu Ini' | 'Minggu Lalu'>('Minggu Ini');
  const [restockModalItem, setRestockModalItem] = useState<{ id: string; name: string; currentStock: number } | null>(null);
  const [addedStockQty, setAddedStockQty] = useState<number>(10);

  // Dynamic calculations from context
  const totalSalesToday = transactions
    .filter((t) => t.status === 'Selesai')
    .reduce((sum, t) => sum + t.total, 0);

  const totalTrxToday = transactions.length;

  const totalItemsSold = transactions
    .filter((t) => t.status === 'Selesai')
    .reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0);

  const lowStockItems = products.filter((p) => p.stock <= (p.minStockAlert || 5));

  // Chart data for weekly trend
  const weeklyData = [
    { day: 'Sen', label: 'Senin', amount: '800k', value: 'Rp 800.000', heightPercent: '40%', bgClass: 'bg-[#805062]/20 hover:bg-[#805062]/40' },
    { day: 'Sel', label: 'Selasa', amount: '1.1M', value: 'Rp 1.100.000', heightPercent: '55%', bgClass: 'bg-[#805062]/30 hover:bg-[#805062]/50' },
    { day: 'Rab', label: 'Rabu', amount: '1.4M', value: 'Rp 1.400.000', heightPercent: '70%', bgClass: 'bg-[#805062]/50 hover:bg-[#805062]/70' },
    { day: 'Kam', label: 'Kamis', amount: '1.8M', value: 'Rp 1.800.000', heightPercent: '90%', bgClass: 'bg-[#805062] hover:bg-[#ffd9e4]' },
    { day: 'Jum', label: 'Jumat', amount: '2.0M', value: 'Rp 2.000.000', heightPercent: '100%', bgClass: 'bg-[#805062]/80 hover:bg-[#805062]', isHighlight: true },
    { day: 'Sab', label: 'Sabtu', amount: '1.3M', value: 'Rp 1.300.000', heightPercent: '65%', bgClass: 'bg-[#805062]/40 hover:bg-[#805062]/60' },
    { day: 'Min', label: 'Minggu', amount: '600k', value: 'Rp 600.000', heightPercent: '30%', bgClass: 'bg-[#805062]/10 hover:bg-[#805062]/30' },
  ];

  // Top products list
  const topProducts = [
    { id: '1', rank: 1, name: 'Buku Tulis Sidu 58 Lembar', sold: 42, revenue: 'Rp 252.000', bgBadge: 'bg-[#f4dce4] text-[#25181e]' },
    { id: '2', rank: 2, name: 'Pulpen Kenko Gel', sold: 35, revenue: 'Rp 105.000', bgBadge: 'bg-[#e1e1c9] text-[#636451]' },
    { id: '3', rank: 3, name: 'Kertas HVS A4 80gr PaperOne', sold: 28, revenue: 'Rp 1.400.000', bgBadge: 'bg-[#d4e5ef] text-[#504447]' },
    { id: '4', rank: 4, name: 'Tipe-X Joyko', sold: 20, revenue: 'Rp 120.000', bgBadge: 'bg-[#d9ebf5] text-[#504447]' },
  ];

  // Specific low stock products matching the exact screen mockup
  const lowStockCards = [
    { id: 'prod-11', name: 'Pensil 2B Faber Castell', category: 'Alat Tulis', stock: 8 },
    { id: 'prod-12', name: 'Buku Gambar A3', category: 'Buku', stock: 3 },
    { id: 'prod-13', name: 'Penggaris Besi 30cm', category: 'Alat Tulis', stock: 5 },
    { id: 'prod-14', name: 'Kalkulator Citizen', category: 'Elektronik', stock: 2 },
  ];

  const handleConfirmRestock = () => {
    if (restockModalItem && addedStockQty > 0) {
      restockProduct(restockModalItem.id, addedStockQty);
      setRestockModalItem(null);
      setAddedStockQty(10);
    }
  };

  return (
    <div id="dashboard-container" className="flex flex-col w-full p-8 gap-8 bg-white min-h-[calc(100vh-64px)]">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penjualan Hari Ini */}
        <div
          id="stat-card-sales"
          className="bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-[#dff1fb]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#805062]/5 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-[#504447] text-xs font-semibold uppercase tracking-wider">
              Total Penjualan Hari Ini
            </span>
            <span className="material-symbols-outlined text-[#805062]">payments</span>
          </div>
          <div className="text-[28px] font-bold text-[#0d1e25] z-10 tracking-tight">
            Rp {totalSalesToday.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 z-10 text-xs">
            <span className="material-symbols-outlined text-[#805062] text-[16px]">trending_up</span>
            <span className="text-[#504447] font-medium">+15% dari kemarin</span>
          </div>
        </div>

        {/* Total Transaksi */}
        <div
          id="stat-card-transactions"
          className="bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-[#dff1fb]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#c8c8b0]/20 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-[#504447] text-xs font-semibold uppercase tracking-wider">
              Total Transaksi
            </span>
            <span className="material-symbols-outlined text-[#5e604d]">receipt_long</span>
          </div>
          <div className="text-[28px] font-bold text-[#0d1e25] z-10 tracking-tight">
            {totalTrxToday}
          </div>
          <div className="text-[#504447] text-xs z-10">Transaksi hari ini</div>
        </div>

        {/* Produk Terjual */}
        <div
          id="stat-card-products-sold"
          className="bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-[#dff1fb]"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#f4dce4]/40 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-[#504447] text-xs font-semibold uppercase tracking-wider">
              Produk Terjual
            </span>
            <span className="material-symbols-outlined text-[#6b5a60]">inventory_2</span>
          </div>
          <div className="text-[28px] font-bold text-[#0d1e25] z-10 tracking-tight">
            {totalItemsSold}
          </div>
          <div className="text-[#504447] text-xs z-10">Item hari ini</div>
        </div>

        {/* Stok Menipis */}
        <div
          id="stat-card-low-stock"
          onClick={() => setCurrentTab('stok')}
          className="bg-[#ffdad6] rounded-2xl p-6 shadow-xs flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all border border-[#ffdad6] cursor-pointer"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#ba1a1a]/10 rounded-full transition-transform group-hover:scale-125 pointer-events-none"></div>
          <div className="flex items-center justify-between z-10">
            <span className="text-[#93000a] text-xs font-semibold uppercase tracking-wider">
              Stok Menipis
            </span>
            <span className="material-symbols-outlined text-[#ba1a1a]">warning</span>
          </div>
          <div className="text-[28px] font-bold text-[#93000a] z-10 tracking-tight">
            {lowStockItems.length || 6}
          </div>
          <div className="text-[#93000a] text-xs z-10 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span> Segera restock
          </div>
        </div>
      </div>

      {/* Row 2: Tren Penjualan Mingguan & Produk Paling Banyak Terjual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-2 bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-6 border border-[#dff1fb]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0d1e25]">Tren Penjualan Mingguan</h2>
            <button
              onClick={() => setSelectedWeek(selectedWeek === 'Minggu Ini' ? 'Minggu Lalu' : 'Minggu Ini')}
              className="bg-[#d4e5ef] text-[#504447] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#cbdde7] transition-colors"
            >
              {selectedWeek}
            </button>
          </div>

          <div className="w-full h-64 relative flex items-end gap-3 pt-8">
            {/* Y-Axis Labels */}
            <div className="flex flex-col h-full justify-between w-12 text-[#504447] text-xs opacity-60 absolute left-0 top-0 pb-8 select-none">
              <span>2Jt</span>
              <span>1.5Jt</span>
              <span>1Jt</span>
              <span>0.5Jt</span>
            </div>

            {/* Bars Container */}
            <div className="flex-1 h-full flex items-end gap-3 ml-12 relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 pb-8">
                <div className="w-full h-px bg-[#0d1e25]"></div>
                <div className="w-full h-px bg-[#0d1e25]"></div>
                <div className="w-full h-px bg-[#0d1e25]"></div>
                <div className="w-full h-px bg-[#0d1e25]"></div>
              </div>

              {/* Day Bars */}
              {weeklyData.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex-1 ${item.bgClass} transition-all rounded-t-lg relative group cursor-pointer`}
                  style={{ height: item.heightPercent }}
                  title={`${item.label}: ${item.value}`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#23333a] text-white text-xs font-bold px-2 py-1 rounded-md transition-opacity pointer-events-none shadow-md z-20 whitespace-nowrap">
                    {item.amount}
                  </div>
                  {/* X-Axis Label */}
                  <div
                    className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium ${
                      item.isHighlight ? 'text-[#805062] font-bold' : 'text-[#504447]'
                    }`}
                  >
                    {item.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Produk Paling Banyak Terjual */}
        <div className="bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-5 border border-[#dff1fb]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0d1e25]">Produk Paling Banyak Terjual</h2>
          </div>

          <div className="flex flex-col gap-3">
            {topProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3.5 group hover:bg-[#dff1fb]/60 rounded-xl p-2 -mx-2 transition-colors cursor-pointer"
                onClick={() => setCurrentTab('produk')}
              >
                <div
                  className={`w-11 h-11 ${prod.bgBadge} rounded-xl flex items-center justify-center font-bold text-base shadow-xs`}
                >
                  {prod.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0d1e25] truncate">{prod.name}</h3>
                  <p className="text-xs text-[#504447]">{prod.sold} Terjual</p>
                </div>
                <div className="font-bold text-sm text-[#805062] whitespace-nowrap">{prod.revenue}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Transaksi Terbaru & Produk Stok Rendah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transaksi Terbaru Table */}
        <div className="bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-4 border border-[#dff1fb] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px]">
            <h2 className="text-lg font-bold text-[#0d1e25]">Transaksi Terbaru</h2>
            <button
              onClick={() => setCurrentTab('riwayat-penjualan')}
              className="text-[#805062] text-xs font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <table className="w-full text-left min-w-[500px]">
            <thead>
              <tr className="border-b border-[#d4e5ef]">
                <th className="text-xs font-semibold uppercase text-[#504447] py-2.5 px-2">WAKTU</th>
                <th className="text-xs font-semibold uppercase text-[#504447] py-2.5 px-2">ID TRANSAKSI</th>
                <th className="text-xs font-semibold uppercase text-[#504447] py-2.5 px-2">KASIR</th>
                <th className="text-xs font-semibold uppercase text-[#504447] py-2.5 px-2">TOTAL</th>
                <th className="text-xs font-semibold uppercase text-[#504447] py-2.5 px-2 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-xs text-[#0d1e25]">
              {transactions.slice(0, 4).map((trx) => (
                <tr
                  key={trx.id}
                  onClick={() => onViewTransaction && onViewTransaction(trx)}
                  className="hover:bg-[#805062]/5 transition-colors cursor-pointer border-b border-[#d4e5ef]/40 last:border-none group"
                >
                  <td className="py-3 px-2 text-[#504447]">{trx.time}</td>
                  <td className="py-3 px-2 text-[#805062] font-semibold">{trx.referenceNo}</td>
                  <td className="py-3 px-2 text-[#0d1e25]">{trx.cashierName}</td>
                  <td className="py-3 px-2 font-bold text-[#0d1e25]">
                    Rp {trx.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                        trx.status === 'Selesai'
                          ? 'bg-[#f8bbd0] text-[#76485a]'
                          : trx.status === 'Dibatalkan'
                          ? 'bg-[#d4e5ef] text-[#504447]'
                          : 'bg-[#e1e1c9] text-[#636451]'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Produk Stok Rendah */}
        <div className="bg-[#f4faff] rounded-2xl p-6 shadow-xs flex flex-col gap-4 border border-[#dff1fb]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0d1e25]">Produk Stok Rendah</h2>
            <button
              onClick={() => setCurrentTab('stok')}
              className="text-[#ba1a1a] hover:opacity-80 transition-opacity"
              title="Harap segera re-stock item ini"
            >
              <span className="material-symbols-outlined text-[20px]">info</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {lowStockCards.map((item) => (
              <div
                key={item.id}
                onClick={() => setRestockModalItem({ id: item.id, name: item.name, currentStock: item.stock })}
                className="bg-[#ffdad6]/30 border-l-4 border-[#ba1a1a] p-3.5 flex items-center justify-between rounded-r-xl hover:bg-[#ffdad6]/50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col pr-2">
                  <span className="text-sm font-semibold text-[#0d1e25] line-clamp-1 group-hover:text-[#ba1a1a] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-xs text-[#504447]">{item.category}</span>
                </div>
                <div className="bg-[#ba1a1a] text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {item.stock}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f8bbd0] text-[#76485a] flex items-center justify-center">
                <span className="material-symbols-outlined">warehouse</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0d1e25]">Restock Cepat</h3>
                <p className="text-xs text-gray-500">{restockModalItem.name}</p>
              </div>
            </div>

            <div className="p-3 bg-[#FDF5E6] rounded-xl flex justify-between items-center text-xs">
              <span className="text-gray-600">Stok Saat Ini:</span>
              <span className="font-bold text-[#ba1a1a]">{restockModalItem.currentStock} Unit</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Jumlah Stok Tambahan</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddedStockQty(Math.max(1, addedStockQty - 5))}
                  className="w-9 h-9 rounded-lg bg-gray-100 font-bold hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={addedStockQty}
                  onChange={(e) => setAddedStockQty(Number(e.target.value) || 1)}
                  className="flex-1 text-center py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setAddedStockQty(addedStockQty + 5)}
                  className="w-9 h-9 rounded-lg bg-gray-100 font-bold hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRestock}
                className="flex-1 py-2.5 bg-[#805062] hover:bg-[#65394b] text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Tambah Stok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
