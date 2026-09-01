import React, { useState, useEffect } from 'react';
import { CashierProfile } from '../types';

interface CashierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cashierData: Omit<CashierProfile, 'id'>, makeActiveImmediately?: boolean) => void;
  initialCashier?: CashierProfile | null;
}

const AVATAR_PRESETS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD_ZlgQVaLvLiFgamRK7I477A85B6zSp9NOtuN5M_m6ML9tsvZEufs74g7vmEH42EWf6W_S_59F7rOOMx5tfm3cWFI2Sq77YZhY7uB-Syvzxanw6kS1tx8yrlEwlOohaXlqfrm2mlM0F9_gJEbErg7f4FMynR_P5wS4XXEkmAt80MwPdmwDFDZAfecVbyDK3EmQRGMcuIXPFqCSDwkkfMfnLUl-EWqeSMkhVLGjtQZG_OOD-SaJQ_tM',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
];

const JOB_PRESETS = [
  'Kasir',
  'Kasir Senior',
  'Kasir Shift Pagi',
  'Kasir Shift Malam',
  'Supervisor Kasir',
  'Store Manager',
  'Admin POS',
  'Barista / Kasir',
];

export const CashierModal: React.FC<CashierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCashier,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Kasir');
  const [isActive, setIsActive] = useState(true);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [makeActiveNow, setMakeActiveNow] = useState(false);

  useEffect(() => {
    if (initialCashier) {
      setName(initialCashier.name);
      setRole(initialCashier.role);
      setIsActive(initialCashier.isActive);
      setAvatar(initialCashier.avatar);
      setPhone(initialCashier.phone || '');
      setEmail(initialCashier.email || '');
      setMakeActiveNow(false);
    } else {
      setName('');
      setRole('Kasir');
      setIsActive(true);
      setAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
      setPhone('');
      setEmail('');
      setMakeActiveNow(true);
    }
  }, [initialCashier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        role: role.trim() || 'Kasir',
        isActive,
        avatar,
        phone: phone.trim(),
        email: email.trim(),
      },
      makeActiveNow
    );
    onClose();
  };

  return (
    <div
      id="cashier-modal-backdrop"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4faff] border-b border-[#dff1fb] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f8bbd0] text-[#76485a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </div>
            <div>
              <h2 className="font-bold text-base text-[#0d1e25]">
                {initialCashier ? 'Edit Akun Kasir' : 'Tambah Akun Kasir Baru'}
              </h2>
              <p className="text-xs text-[#504447]">
                Kelola identitas, job / posisi, dan status aktif kasir.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0d1e25] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Avatar Preview & Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#0d1e25] uppercase tracking-wide">
              Foto Profil / Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#805062] shadow-sm"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                    isActive ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                  title={isActive ? 'Status: Aktif' : 'Status: Tidak Aktif'}
                >
                  <span className="material-symbols-outlined text-white text-[12px]">
                    {isActive ? 'check' : 'close'}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <p className="text-xs text-[#504447]">Pilih preset foto avatar di bawah:</p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {AVATAR_PRESETS.map((pUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(pUrl)}
                      className={`w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                        avatar === pUrl
                          ? 'border-[#805062] ring-2 ring-[#f8bbd0] scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={pUrl} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nama Kasir */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0d1e25] uppercase tracking-wide">
              Nama Lengkap Kasir *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sarah Maharani, Budi Santoso..."
              className="bg-[#f4faff] border border-[#dff1fb] rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] focus:bg-white transition-all font-medium placeholder:text-[#504447]/50"
            />
          </div>

          {/* Job / Posisi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0d1e25] uppercase tracking-wide">
              Job / Posisi / Jabatan *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Kasir, Kasir Senior, Supervisor, Store Manager..."
              className="bg-[#f4faff] border border-[#dff1fb] rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] focus:bg-white transition-all font-medium placeholder:text-[#504447]/50"
            />
            {/* Quick Job Chips */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {JOB_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRole(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    role === preset
                      ? 'bg-[#805062] text-white'
                      : 'bg-[#FDF5E6] hover:bg-[#FCE4EC] text-[#504447]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Status Keaktifan (Aktif atau Tidak) */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl border border-[#dff1fb] bg-[#f4faff]/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#0d1e25] uppercase tracking-wide">
                  Status Akun Kasir
                </p>
                <p className="text-xs text-[#504447] mt-0.5">
                  Akun aktif dapat dipilih saat login kasir dan transaksi penjualan.
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-gray-200 text-gray-700 border border-gray-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-500'
                  }`}
                ></span>
                {isActive ? 'Aktif (Dapat Bertransaksi)' : 'Tidak Aktif (Dinonaktifkan)'}
              </span>
            </div>
          </div>

          {/* Kontak Opsional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#504447] uppercase tracking-wide">
                No. Telepon / WhatsApp (Opsional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="bg-[#f4faff] border border-[#dff1fb] rounded-xl px-3 py-2 text-xs text-[#0d1e25] focus:outline-none focus:border-[#805062]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#504447] uppercase tracking-wide">
                Email (Opsional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kasir@toko.com"
                className="bg-[#f4faff] border border-[#dff1fb] rounded-xl px-3 py-2 text-xs text-[#0d1e25] focus:outline-none focus:border-[#805062]"
              />
            </div>
          </div>

          {/* Make Active Immediately Option (for new cashiers or if active) */}
          {isActive && (
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#0d1e25] font-semibold p-2 bg-[#FDF5E6] rounded-xl">
              <input
                type="checkbox"
                checked={makeActiveNow}
                onChange={(e) => setMakeActiveNow(e.target.checked)}
                className="w-4 h-4 text-[#805062] rounded-sm focus:ring-[#805062]"
              />
              <span>Jadikan kasir ini yang aktif bertugas saat ini</span>
            </label>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#805062] hover:bg-[#65394b] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {initialCashier ? 'Simpan Perubahan' : 'Tambah Kasir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
