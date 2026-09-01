import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { CashierModal } from './CashierModal';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    currentCashier,
    switchActiveCashier,
    cashiers,
    products,
    setCurrentTab,
    addCashier,
    deleteCashier,
  } = usePOS();

  const [isCashierMenuOpen, setIsCashierMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddCashierModalOpen, setIsAddCashierModalOpen] = useState(false);
  const [cashierToDelete, setCashierToDelete] = useState<{ id: string; name: string; role: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lowStockItems = products.filter((p) => p.stock <= (p.minStockAlert || 5));

  const handleSelectCashier = (id: string, name: string) => {
    switchActiveCashier(id);
    setIsCashierMenuOpen(false);
    setToastMessage(`Kasir aktif berhasil diganti ke: ${name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteCashierClick = (e: React.MouseEvent, c: { id: string; name: string; role: string }) => {
    e.stopPropagation();
    if (cashiers.length <= 1) {
      setToastMessage('Tidak dapat menghapus. Minimal harus ada 1 akun kasir aktif.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    setCashierToDelete(c);
  };

  const handleConfirmDeleteCashier = () => {
    if (!cashierToDelete) return;
    const name = cashierToDelete.name;
    const ok = deleteCashier(cashierToDelete.id);
    setCashierToDelete(null);
    if (ok) {
      setToastMessage(`Akun kasir "${name}" berhasil dihapus.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <>
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
        <div className="flex items-center gap-4 sm:gap-5">
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

          {/* Cashier Profile Pill & Switcher */}
          <div className="relative">
            <button
              id="cashier-profile-btn"
              onClick={() => {
                setIsCashierMenuOpen(!isCashierMenuOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-3 p-1.5 pl-3.5 hover:bg-[#FDF5E6] rounded-full transition-all border border-[#e4e4cc]/60 hover:border-[#805062]/30 shadow-2xs group"
              title="Klik untuk ganti akun kasir"
            >
              <div className="text-right leading-tight hidden sm:block">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                  <p className="text-xs font-bold text-[#0d1e25]">{currentCashier.name}</p>
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[10px] text-[#805062] font-semibold uppercase tracking-wider">
                    {currentCashier.role}
                  </span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                    Aktif
                  </span>
                </div>
              </div>
              <div className="relative">
                <img
                  alt={currentCashier.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#805062]/30 shadow-xs group-hover:scale-105 transition-transform"
                  src={currentCashier.avatar}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <span className="material-symbols-outlined text-[#827377] text-[18px] mr-1 hidden sm:inline">
                expand_more
              </span>
            </button>

            {/* Cashier Switcher Menu */}
            {isCashierMenuOpen && (
              <div
                id="cashier-switcher-menu"
                className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-[#dff1fb] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Switcher Header */}
                <div className="px-2 py-1.5 mb-2 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#0d1e25]">Ganti Akun Kasir Aktif</p>
                    <p className="text-[11px] text-gray-500">Pilih kasir yang sedang bertugas</p>
                  </div>
                  <span className="text-[10px] font-bold bg-[#FDF5E6] text-[#805062] px-2 py-0.5 rounded-full">
                    {cashiers.length} Kasir
                  </span>
                </div>

                {/* Cashier Accounts List */}
                <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-0.5">
                  {cashiers.map((cashier) => {
                    const isOperative = currentCashier.id === cashier.id;
                    return (
                      <div
                        key={cashier.id}
                        onClick={() => handleSelectCashier(cashier.id, cashier.name)}
                        className={`group flex items-center gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-all border ${
                          isOperative
                            ? 'bg-[#f8bbd0]/35 border-[#805062]/40 shadow-xs'
                            : cashier.isActive
                            ? 'hover:bg-[#FDF5E6] border-transparent hover:border-gray-200'
                            : 'opacity-70 hover:opacity-100 bg-gray-50/70 border-transparent hover:border-gray-200'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={cashier.avatar}
                            alt={cashier.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              cashier.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>

                        {/* Name & Job */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-[#0d1e25] truncate">{cashier.name}</p>
                            {isOperative && (
                              <span className="text-[9px] font-extrabold bg-[#805062] text-white px-1.5 py-0.2 rounded-full shrink-0">
                                AKTIF
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#504447] font-medium truncate">
                              {cashier.role}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                cashier.isActive
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : 'text-gray-500 bg-gray-100'
                              }`}
                            >
                              {cashier.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                        </div>

                        {/* Actions: Delete Cashier Button & Selection */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Delete Account Button */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCashierClick(e, cashier)}
                            disabled={cashiers.length <= 1}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              cashiers.length <= 1
                                ? 'text-gray-300 cursor-not-allowed opacity-40'
                                : 'text-gray-400 hover:text-[#ba1a1a] hover:bg-red-50'
                            }`}
                            title={
                              cashiers.length <= 1
                                ? 'Minimal harus ada 1 akun kasir'
                                : `Hapus akun ${cashier.name}`
                            }
                          >
                            <span className="material-symbols-outlined text-[17px]">delete</span>
                          </button>

                          {/* Selection indicator */}
                          {isOperative ? (
                            <div className="w-6 h-6 rounded-full bg-[#805062] text-white flex items-center justify-center shadow-2xs">
                              <span className="material-symbols-outlined text-[15px]">check</span>
                            </div>
                          ) : (
                            <span className="text-[11px] font-bold text-[#805062] opacity-0 group-hover:opacity-100 hover:underline px-1">
                              Pilih
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Quick Actions */}
                <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setIsCashierMenuOpen(false);
                      setIsAddCashierModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#805062] bg-[#FDF5E6] hover:bg-[#FCE4EC] rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    Tambah Akun Kasir Baru
                  </button>

                  <button
                    onClick={() => {
                      setIsCashierMenuOpen(false);
                      setCurrentTab('pengaturan');
                    }}
                    className="w-full text-center py-1.5 text-[11px] text-[#504447] font-medium hover:text-[#0d1e25] hover:underline"
                  >
                    Buka Kelola Kasir Lengkap di Pengaturan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-[#0d1e25] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Add Cashier Modal from Header */}
      <CashierModal
        isOpen={isAddCashierModalOpen}
        onClose={() => setIsAddCashierModalOpen(false)}
        onSave={(data, makeActive) => {
          const created = addCashier(data);
          if (makeActive || data.isActive) {
            handleSelectCashier(created.id, created.name);
          } else {
            setToastMessage(`Akun kasir ${created.name} berhasil ditambahkan.`);
            setTimeout(() => setToastMessage(null), 3000);
          }
        }}
      />

      {/* Delete Cashier Confirmation Modal */}
      {cashierToDelete && (
        <div
          id="modal-delete-cashier"
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">person_remove</span>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#0d1e25]">Hapus Akun Kasir?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin menghapus akun{' '}
                <strong className="text-[#0d1e25]">{cashierToDelete.name}</strong> (
                {cashierToDelete.role})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => setCashierToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCashier}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

