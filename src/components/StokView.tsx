import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Product } from '../types';

export const StokView: React.FC = () => {
  const { products, restockProduct } = usePOS();

  const [activeFilterTab, setActiveFilterTab] = useState<
    'Semua' | 'Stok Aman' | 'Stok Menipis' | 'Stok Habis'
  >('Semua');
  const [search, setSearch] = useState('');
  const [restockItem, setRestockItem] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [restockNote, setRestockNote] = useState('');

  // Metrics
  const totalProducts = products.length;
  const safeStockCount = products.filter((p) => p.stock > (p.minStockAlert || 5)).length;
  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= (p.minStockAlert || 5)
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    const minAlert = p.minStockAlert || 5;
    if (activeFilterTab === 'Stok Aman') return p.stock > minAlert;
    if (activeFilterTab === 'Stok Menipis') return p.stock > 0 && p.stock <= minAlert;
    if (activeFilterTab === 'Stok Habis') return p.stock === 0;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['SKU', 'Nama Produk', 'Kategori', 'Harga', 'Stok', 'Status'];
    const rows = products.map((p) => {
      let status = 'Stok Aman';
      if (p.stock === 0) status = 'Stok Habis';
      else if (p.stock <= (p.minStockAlert || 5)) status = 'Stok Menipis';
      return [p.sku, `"${p.name}"`, p.category, p.price, p.stock, status].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-stok-mycashier-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockItem && restockQty > 0) {
      restockProduct(restockItem.id, restockQty);
      setRestockItem(null);
      setRestockQty(10);
      setRestockNote('');
    }
  };

  return (
    <div id="stok-page" className="flex flex-col w-full p-8 gap-6 bg-white min-h-[calc(100vh-64px)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
            Manajemen Stok
          </h1>
          <p className="text-sm text-[#504447] mt-1">
            Pantau ketersediaan produk dan kelola inventaris secara real-time.
          </p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <button
            id="btn-export-stok"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#dff1fb] text-xs font-semibold text-[#504447] hover:bg-[#f4faff] transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Ekspor CSV
          </button>
          <button
            id="btn-tambah-stok"
            onClick={() => setRestockItem(products[0] || null)}
            className="flex items-center gap-2 bg-[#805062] hover:bg-[#65394b] text-white px-5 py-2.5 rounded-xl transition-colors shadow-sm font-semibold text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Stok
          </button>
        </div>
      </div>

      {/* 4 Bento Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produk */}
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
              Total Produk
            </p>
            <p className="text-2xl font-bold text-[#0d1e25] mt-1">{totalProducts}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#805062]/10 flex items-center justify-center text-[#805062]">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
        </div>

        {/* Stok Aman */}
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
              Stok Aman
            </p>
            <p className="text-2xl font-bold text-[#0d1e25] mt-1">{safeStockCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">check_circle</span>
          </div>
        </div>

        {/* Stok Menipis */}
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#504447] uppercase tracking-wider">
              Stok Menipis
            </p>
            <p className="text-2xl font-bold text-[#ba1a1a] mt-1">{lowStockCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
        </div>

        {/* Stok Habis */}
        <div className="bg-[#ffdad6]/40 border border-[#ffdad6] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#93000a] uppercase tracking-wider">
              Stok Habis
            </p>
            <p className="text-2xl font-bold text-[#ba1a1a] mt-1">{outOfStockCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">error</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#f4faff] p-3 rounded-2xl border border-[#dff1fb]">
        {/* Filter Pills */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {(['Semua', 'Stok Aman', 'Stok Menipis', 'Stok Habis'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeFilterTab === tab
                  ? 'bg-white text-[#805062] shadow-xs font-bold'
                  : 'text-[#504447] hover:bg-white/60'
              }`}
            >
              {tab === 'Semua' ? 'Semua Produk' : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2 w-full md:w-72 border border-gray-200 focus-within:ring-2 focus-within:ring-[#f8bbd0]">
          <span className="material-symbols-outlined text-[#827377] text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari SKU atau nama..."
            className="bg-transparent text-xs text-[#0d1e25] outline-none w-full"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(55,71,79,0.04)] border border-[#dff1fb] overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#f4faff] border-b border-[#dff1fb]">
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Produk
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  SKU
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Kategori
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Harga Jual
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Jumlah Stok
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
              {filteredProducts.map((p) => {
                const minAlert = p.minStockAlert || 5;
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= minAlert;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-[#f8bbd0]/10 transition-colors border-b border-[#dff1fb]/60 last:border-none"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-100 shrink-0"
                        />
                        <span className="font-semibold text-sm line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#504447]">{p.sku}</td>
                    <td className="p-4 text-xs text-[#504447]">{p.category}</td>
                    <td className="p-4 font-bold text-xs">
                      Rp {p.price.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 w-28">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{p.stock} Unit</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isOutOfStock
                                ? 'bg-[#ba1a1a]'
                                : isLowStock
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                          isOutOfStock
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOutOfStock ? 'STOK HABIS' : isLowStock ? 'STOK MENIPIS' : 'STOK AMAN'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setRestockItem(p)}
                        className="px-3 py-1.5 bg-[#FDF5E6] hover:bg-[#f8bbd0] text-[#76485a] font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#805062]">warehouse</span>
                <h3 className="font-bold text-lg text-[#0d1e25]">Restock Inventaris</h3>
              </div>
              <button
                onClick={() => setRestockItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmRestock} className="flex flex-col gap-4">
              {/* Product Selector / Display */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                  Pilih Produk
                </label>
                <select
                  value={restockItem.id}
                  onChange={(e) => {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) setRestockItem(found);
                  }}
                  className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Sisa: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Stock Preview */}
              <div className="p-3 bg-[#FDF5E6] rounded-xl flex justify-between items-center text-xs">
                <span className="text-gray-600">Stok Saat Ini:</span>
                <span className="font-bold text-base text-[#0d1e25]">{restockItem.stock} Unit</span>
              </div>

              {/* Add Quantity */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                  Jumlah Stok Masuk *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRestockQty(Math.max(1, restockQty - 10))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    required
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value) || 1)}
                    className="flex-1 text-center py-2 bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl font-bold text-base text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                  />
                  <button
                    type="button"
                    onClick={() => setRestockQty(restockQty + 10)}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Catatan / Supplier */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                  Catatan Pengadaan / Supplier (Opsional)
                </label>
                <input
                  type="text"
                  value={restockNote}
                  onChange={(e) => setRestockNote(e.target.value)}
                  placeholder="Contoh: Pengiriman batch supplier CV Mitra Jaya"
                  className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#504447] hover:bg-gray-100 border border-[#d4c2c6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#805062] hover:bg-[#65394b] text-white shadow-xs"
                >
                  Simpan Stok Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
