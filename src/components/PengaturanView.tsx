import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { LOGO_URL } from '../data/initialData';
import { CashierModal } from './CashierModal';
import { CashierProfile } from '../types';

export const PengaturanView: React.FC = () => {
  const {
    settings,
    updateSettings,
    cashiers,
    currentCashier,
    switchActiveCashier,
    addCashier,
    updateCashier,
    deleteCashier,
    toggleCashierStatus,
    resetDemoData,
  } = usePOS();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState<CashierProfile | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      address,
      phone,
      footerNote,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenAddCashier = () => {
    setEditingCashier(null);
    setIsCashierModalOpen(true);
  };

  const handleOpenEditCashier = (cashier: CashierProfile) => {
    setEditingCashier(cashier);
    setIsCashierModalOpen(true);
  };

  const handleSaveCashierModal = (
    cashierData: Omit<CashierProfile, 'id'>,
    makeActiveImmediately?: boolean
  ) => {
    if (editingCashier) {
      updateCashier(editingCashier.id, cashierData);
      if (makeActiveImmediately && cashierData.isActive) {
        switchActiveCashier(editingCashier.id);
      }
    } else {
      const created = addCashier(cashierData);
      if (makeActiveImmediately && cashierData.isActive) {
        switchActiveCashier(created.id);
      }
    }
  };

  const handleDeleteCashier = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus akun kasir "${name}"?`)) {
      deleteCashier(id);
    }
  };

  const filteredCashiers = cashiers.filter((c) => {
    if (statusFilter === 'active') return c.isActive;
    if (statusFilter === 'inactive') return !c.isActive;
    return true;
  });

  const activeCount = cashiers.filter((c) => c.isActive).length;
  const inactiveCount = cashiers.filter((c) => !c.isActive).length;

  return (
    <div id="pengaturan-page" className="flex flex-col w-full p-8 gap-8 bg-white min-h-[calc(100vh-64px)] max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
          Pengaturan Toko & POS
        </h1>
        <p className="text-sm text-[#504447] mt-1">
          Konfigurasi identitas toko, informasi struk, dan kelola akun kasir aktif.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-3 border border-emerald-200 animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span className="text-sm font-semibold">Pengaturan toko berhasil diperbarui!</span>
        </div>
      )}

      {/* Cashier Accounts Management Section */}
      <div className="bg-[#f4faff] border border-[#dff1fb] rounded-3xl p-6 sm:p-7 flex flex-col gap-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dff1fb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#805062] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0d1e25]">
                Manajemen Akun Kasir
              </h2>
              <p className="text-xs text-[#504447]">
                Kelola nama kasir, job/jabatan, status keaktifan, dan ganti kasir yang sedang bertugas.
              </p>
            </div>
          </div>

          <button
            id="btn-add-cashier"
            onClick={handleOpenAddCashier}
            className="px-4 py-2.5 bg-[#805062] hover:bg-[#65394b] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Tambah Akun Kasir
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#805062] text-white'
                  : 'text-[#504447] hover:bg-gray-100'
              }`}
            >
              Semua ({cashiers.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'text-[#504447] hover:bg-gray-100'
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-gray-600 text-white'
                  : 'text-[#504447] hover:bg-gray-100'
              }`}
            >
              Tidak Aktif ({inactiveCount})
            </button>
          </div>

          <div className="text-xs text-[#504447] flex items-center gap-2">
            <span>Kasir bertugas saat ini:</span>
            <span className="font-bold text-[#805062] bg-[#FDF5E6] px-2.5 py-1 rounded-full border border-[#f8bbd0]">
              {currentCashier.name} ({currentCashier.role})
            </span>
          </div>
        </div>

        {/* Cashier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCashiers.map((cashier) => {
            const isCurrentlyOperative = currentCashier.id === cashier.id;
            return (
              <div
                key={cashier.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 bg-white relative ${
                  isCurrentlyOperative
                    ? 'border-[#805062] ring-2 ring-[#805062]/20 shadow-md'
                    : cashier.isActive
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                    : 'border-gray-200 bg-gray-50/70 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Badge */}
                {isCurrentlyOperative && (
                  <div className="absolute top-3 right-3 bg-[#805062] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    KASIR AKTIF
                  </div>
                )}

                {/* Profile Information: Nama & Job */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={cashier.avatar}
                      alt={cashier.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                        cashier.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                      title={cashier.isActive ? 'Status: Aktif' : 'Status: Tidak Aktif'}
                    >
                      <span className="material-symbols-outlined text-white text-[10px]">
                        {cashier.isActive ? 'check' : 'close'}
                      </span>
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-12">
                    {/* Nama Kasir */}
                    <h3 className="font-bold text-sm text-[#0d1e25] truncate" title={cashier.name}>
                      {cashier.name}
                    </h3>
                    
                    {/* Job / Posisi */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#805062] text-[15px]">work</span>
                      <p className="text-xs font-semibold text-[#805062] truncate">
                        {cashier.role}
                      </p>
                    </div>

                    {/* Status Aktif atau Tidak Badge */}
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          cashier.isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cashier.isActive ? 'bg-emerald-600' : 'bg-gray-400'
                          }`}
                        />
                        {cashier.isActive ? 'Status: Aktif' : 'Status: Tidak Aktif'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info if available */}
                {(cashier.phone || cashier.email) && (
                  <div className="text-[11px] text-[#504447] flex flex-col gap-0.5 pt-2 border-t border-gray-100">
                    {cashier.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[13px] text-gray-400">call</span>
                        <span>{cashier.phone}</span>
                      </div>
                    )}
                    {cashier.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[13px] text-gray-400">mail</span>
                        <span>{cashier.email}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Status Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleCashierStatus(cashier.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        cashier.isActive
                          ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                      title="Ubah status keaktifan kasir"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {cashier.isActive ? 'toggle_on' : 'toggle_off'}
                      </span>
                      {cashier.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEditCashier(cashier)}
                        className="w-8 h-8 rounded-lg hover:bg-[#FDF5E6] text-[#504447] hover:text-[#805062] flex items-center justify-center transition-colors"
                        title="Edit Profil Kasir"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteCashier(cashier.id, cashier.name)}
                        disabled={cashiers.length <= 1}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          cashiers.length <= 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-red-50 text-[#ba1a1a]'
                        }`}
                        title="Hapus Kasir"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Switch Active Cashier Action */}
                  <button
                    onClick={() => switchActiveCashier(cashier.id)}
                    disabled={isCurrentlyOperative}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isCurrentlyOperative
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'bg-[#805062] hover:bg-[#65394b] text-white shadow-2xs'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isCurrentlyOperative ? 'check' : 'login'}
                    </span>
                    {isCurrentlyOperative ? 'Sedang Digunakan' : 'Ganti Jadi Kasir Aktif'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile & Identity Settings */}
      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-3xl p-6 sm:p-7 flex flex-col gap-5">
          <h2 className="text-base font-bold text-[#0d1e25] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#805062]">storefront</span>
            Identitas Toko & Informasi Struk
          </h2>

          <div className="flex items-center gap-4 pb-4 border-b border-[#dff1fb]">
            <img
              src={LOGO_URL}
              alt="Logo"
              className="w-16 h-16 object-contain bg-white p-2 rounded-2xl border border-gray-200 shadow-xs"
            />
            <div>
              <p className="font-bold text-sm text-[#0d1e25]">{settings.storeName}</p>
              <p className="text-xs text-[#504447]">Logo resmi MYCASHIER POS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                Nama Toko *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                Alamat Toko
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
              Catatan Footer Struk Kasir
            </label>
            <textarea
              rows={2}
              value={footerNote}
              onChange={(e) => setFooterNote(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#805062] hover:bg-[#65394b] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Simpan Identitas Toko
            </button>
          </div>
        </div>
      </form>

      {/* Demo Reset */}
      <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-red-900">Reset Data Demo Aplikasi</h3>
          <p className="text-xs text-red-700 mt-0.5">
            Kembalikan semua daftar produk, kategori, kasir, dan transaksi ke kondisi default awal.
          </p>
        </div>
        <button
          onClick={resetDemoData}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Reset Data Demo
        </button>
      </div>

      {/* Cashier Modal */}
      <CashierModal
        isOpen={isCashierModalOpen}
        onClose={() => setIsCashierModalOpen(false)}
        initialCashier={editingCashier}
        onSave={handleSaveCashierModal}
      />
    </div>
  );
};

