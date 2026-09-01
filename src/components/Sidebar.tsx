import React from 'react';
import { usePOS } from '../context/POSContext';
import { TabType } from '../types';
import { LOGO_URL } from '../data/initialData';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, cart, products } = usePOS();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = products.filter((p) => p.stock <= (p.minStockAlert || 5)).length;

  const navItems: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'kasir', label: 'Kasir', icon: 'shopping_cart', badge: totalCartItems > 0 ? totalCartItems : undefined },
    { id: 'produk', label: 'Produk', icon: 'inventory_2' },
    { id: 'kategori', label: 'Kategori', icon: 'category' },
    { id: 'stok', label: 'Stok', icon: 'warehouse', badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'riwayat-penjualan', label: 'Riwayat Penjualan', icon: 'history' },
    { id: 'laporan', label: 'Laporan', icon: 'bar_chart' },
  ];

  return (
    <aside
      id="main-sidebar"
      className="fixed left-0 top-0 h-full w-72 bg-[#e4e4cc] z-50 flex flex-col pt-6 pb-8 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#d8d8bc]/50 select-none"
    >
      {/* Brand Logo & Title */}
      <div
        id="sidebar-brand"
        onClick={() => setCurrentTab('dashboard')}
        className="px-6 mb-8 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-white/70 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
          <img
            alt="MYCASHIER Logo"
            className="h-8 w-auto object-contain"
            src={LOGO_URL}
          />
        </div>
        <span className="font-bold text-xl text-[#805062] tracking-tight group-hover:text-[#65394b] transition-colors">
          MYCASHIER
        </span>
      </div>

      {/* Navigation List */}
      <nav id="sidebar-nav" className="flex-1 px-4 flex flex-col gap-1.5 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left w-full group ${
                isActive
                  ? 'bg-[#f8bbd0] text-[#76485a] font-semibold shadow-xs'
                  : 'text-[#504447] hover:bg-[#f4dce4]/70 hover:text-[#25181e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-[15px]">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-[#805062] text-white'
                      : item.id === 'stok'
                      ? 'bg-[#ba1a1a] text-white animate-pulse'
                      : 'bg-[#f8bbd0] text-[#76485a]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Bottom Setting Action */}
        <div className="mt-auto pt-4 border-t border-[#d8d8bc]/60">
          <button
            id="nav-link-pengaturan"
            onClick={() => setCurrentTab('pengaturan')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left w-full group ${
              currentTab === 'pengaturan'
                ? 'bg-[#f8bbd0] text-[#76485a] font-semibold shadow-xs'
                : 'text-[#504447] hover:bg-[#f4dce4]/70 hover:text-[#25181e]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px] transition-transform group-hover:rotate-45"
              style={{ fontVariationSettings: currentTab === 'pengaturan' ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
            <span className="text-[15px]">Pengaturan</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
