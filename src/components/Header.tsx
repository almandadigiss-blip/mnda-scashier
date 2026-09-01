import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    currentCashier,
    setCurrentCashier,
    cashiers,
    products,
    setCurrentTab,
  } = usePOS();

  const [isCashierMenuOpen, setIsCashierMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const lowStockItems = products.filter((p) => p.stock <= (p.minStockAlert || 5));

  return (
    <header
      id="main-header"
      className="fixed top-0 left-72 right-0 h-16 bg-white/85 backdrop-blur-md z-40 flex items-center justify-between px-8 shadow-[0_1px_8px_rgba(0,0,0,0.02)] border-b border-[#e4e4cc]/60"
    >
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-80 md:w-96">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined text-[#827377] absolute left-3 pointer-events-none text-[20px]">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi atau produk..."
            className="w-full pl-10 pr-4 py-2 bg-[#FDF5E6]/90 hover:bg-[#FDF5E6] focus:bg-white text-[#0d1e25] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f8bbd0] border border-transparent focus:border-[#f8bbd0] transition-all placeholder:text-[#504447]/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-[#827377] hover:text-[#0d1e25]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsCashierMenuOpen(false);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#504447] hover:bg-[#FDF5E6] transition-colors relative"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {lowStockItems.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e4e4cc] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                <span className="font-semibold text-sm text-[#0d1e25]">Notifikasi & Peringatan</span>
                <span className="text-xs bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded-full font-medium">
                  {lowStockItems.length} Stok Menipis
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
                {lowStockItems.length === 0 ? (
                  <p className="text-xs text-gray-500 py-3 text-center">Semua stok produk dalam kondisi aman.</p>
                ) : (
                  lowStockItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        setCurrentTab('stok');
                      }}
                      className="p-2 bg-[#ffdad6]/30 hover:bg-[#ffdad6]/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#0d1e25]">{item.name}</p>
                        <p className="text-[11px] text-[#827377]">SKU: {item.sku}</p>
                      </div>
                      <span className="text-xs font-bold text-[#ba1a1a] bg-white px-2 py-0.5 rounded-lg shadow-xs">
                        Sisa {item.stock}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setIsNotificationsOpen(false);
                  setCurrentTab('stok');
                }}
                className="w-full mt-3 py-1.5 bg-[#FDF5E6] hover:bg-[#f8bbd0]/40 text-xs font-semibold text-[#805062] rounded-xl transition-colors text-center"
              >
                Lihat Semua Inventaris
              </button>
            </div>
          )}
        </div>

        {/* Cashier Profile Pill */}
        <div className="relative">
          <button
            id="cashier-profile-btn"
            onClick={() => {
              setIsCashierMenuOpen(!isCashierMenuOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1 pl-3 hover:bg-[#FDF5E6] rounded-full transition-all border border-transparent hover:border-[#e4e4cc]"
          >
            <div className="text-right leading-tight hidden sm:block">
              <p className="text-sm font-semibold text-[#0d1e25]">{currentCashier.name}</p>
              <p className="text-[11px] text-[#504447] font-semibold uppercase tracking-wider">
                {currentCashier.role}
              </p>
            </div>
            <img
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f8bbd0]/50 shadow-xs"
              src={currentCashier.avatar}
            />
          </button>

          {/* Cashier Switcher Menu */}
          {isCashierMenuOpen && (
            <div
              id="cashier-switcher-menu"
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e4e4cc] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="px-2 py-1.5 mb-2 border-b border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Ganti Akun Kasir Aktif</p>
              </div>
              <div className="flex flex-col gap-1">
                {cashiers.map((cashier) => (
                  <button
                    key={cashier.id}
                    onClick={() => {
                      setCurrentCashier(cashier);
                      setIsCashierMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-2 rounded-xl text-left transition-colors w-full ${
                      currentCashier.id === cashier.id
                        ? 'bg-[#f8bbd0]/40 font-semibold text-[#76485a]'
                        : 'hover:bg-[#FDF5E6] text-[#0d1e25]'
                    }`}
                  >
                    <img
                      src={cashier.avatar}
                      alt={cashier.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{cashier.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{cashier.role}</p>
                    </div>
                    {currentCashier.id === cashier.id && (
                      <span className="material-symbols-outlined text-[#805062] text-[18px]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsCashierMenuOpen(false);
                    setCurrentTab('pengaturan');
                  }}
                  className="w-full text-center py-1.5 text-xs text-[#805062] font-semibold hover:underline"
                >
                  Kelola Pengaturan Kasir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
