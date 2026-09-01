import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { LOGO_URL } from '../data/initialData';

export const PengaturanView: React.FC = () => {
  const {
    settings,
    updateSettings,
    cashiers,
    currentCashier,
    setCurrentCashier,
    resetDemoData,
  } = usePOS();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [footerNote, setFooterNote] = useState(settings.footerNote);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div id="pengaturan-page" className="flex flex-col w-full p-8 gap-8 bg-white min-h-[calc(100vh-64px)] max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
          Pengaturan Toko & POS
        </h1>
        <p className="text-sm text-[#504447] mt-1">
          Konfigurasi identitas toko, informasi struk, dan profil kasir operasional.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-3 border border-emerald-200">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span className="text-sm font-semibold">Pengaturan toko berhasil diperbarui!</span>
        </div>
      )}

      {/* Profile & Identity Settings */}
      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
        <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-[#0d1e25] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#805062]">storefront</span>
            Identitas Toko
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
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>

      {/* Cashier Accounts */}
      <div className="bg-[#f4faff] border border-[#dff1fb] rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-base font-bold text-[#0d1e25] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#805062]">badge</span>
          Akun Kasir Terdaftar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cashiers.map((cashier) => {
            const isCurrent = currentCashier.id === cashier.id;
            return (
              <div
                key={cashier.id}
                onClick={() => setCurrentCashier(cashier)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 bg-white ${
                  isCurrent
                    ? 'border-[#805062] ring-2 ring-[#f8bbd0]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={cashier.avatar}
                  alt={cashier.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#0d1e25] truncate">{cashier.name}</p>
                  <p className="text-xs text-[#504447] uppercase font-semibold">{cashier.role}</p>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-[#805062] bg-[#f8bbd0]/50 px-2 py-0.5 rounded-full inline-block mt-1">
                      Aktif Sekarang
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Reset */}
      <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-red-900">Reset Data Demo Aplikasi</h3>
          <p className="text-xs text-red-700 mt-0.5">
            Kembalikan semua daftar produk, kategori, dan transaksi ke kondisi default awal.
          </p>
        </div>
        <button
          onClick={resetDemoData}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Reset Data Demo
        </button>
      </div>
    </div>
  );
};
