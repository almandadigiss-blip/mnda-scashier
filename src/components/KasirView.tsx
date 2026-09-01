import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { PaymentMethod } from '../types';

export const KasirView: React.FC = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartDiscount,
    setCartDiscount,
    cartPaymentMethod,
    setCartPaymentMethod,
    cartAmountPaid,
    setCartAmountPaid,
    cartSubtotal,
    cartTotal,
    cartChange,
    checkout,
    lastCompletedTransaction,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    currentCashier,
    cashiers,
    switchActiveCashier,
  } = usePOS();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua Kategori');
  const [isSwitchCashierQuickOpen, setIsSwitchCashierQuickOpen] = useState(false);

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(localSearch.toLowerCase());
    const matchesCategory =
      selectedCat === 'Semua Kategori' ||
      p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Quick cash buttons for fast tender
  const quickCashAmounts = [
    cartTotal,
    Math.ceil(cartTotal / 10000) * 10000 || 10000,
    Math.ceil(cartTotal / 50000) * 50000 || 50000,
    100000,
  ].filter((v, idx, arr) => v > 0 && arr.indexOf(v) === idx);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="kasir-view" className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
      {/* Left Panel: Product Catalog */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-[#dff1fb]/60">
        {/* Catalog Header & Filters */}
        <div className="p-6 shrink-0 flex flex-col gap-4 z-10 shadow-2xs relative bg-white border-b border-[#f4faff]">
          {/* Search Input and Category Chips */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full group">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827377] group-focus-within:text-[#805062] transition-colors text-[20px]">
                search
              </span>
              <input
                id="catalog-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Cari produk berdasarkan nama atau SKU..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#FDF5E6] text-[#0d1e25] text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f8bbd0] border border-transparent focus:border-[#f8bbd0] transition-all placeholder:text-[#504447]/60"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Categories Scrollable Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar scroll-smooth w-full md:w-auto">
              <button
                id="cat-btn-all"
                onClick={() => setSelectedCat('Semua Kategori')}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                  selectedCat === 'Semua Kategori'
                    ? 'bg-[#f8bbd0] text-[#76485a] shadow-xs'
                    : 'bg-[#FDF5E6] hover:bg-[#FCE4EC] text-[#504447]'
                }`}
              >
                Semua Kategori
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCat(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                    selectedCat === cat.name
                      ? 'bg-[#f8bbd0] text-[#76485a] shadow-xs'
                      : 'bg-[#FDF5E6] hover:bg-[#FCE4EC] text-[#504447]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 relative scroll-smooth bg-[#f4faff]/30 pb-20">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8bbd0]/15 rounded-full blur-[100px] pointer-events-none"></div>

          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-2">
              <span className="material-symbols-outlined text-[48px] text-[#d4c2c6]">inventory_2</span>
              <p className="text-sm font-medium">Tidak ada produk yang cocok dengan pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-max relative z-10">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`group bg-white rounded-2xl shadow-[0_4px_20px_rgba(55,71,79,0.04)] border border-[#dff1fb]/60 overflow-hidden flex flex-col transition-all duration-300 ${
                      isOutOfStock
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(55,71,79,0.08)] cursor-pointer'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full aspect-square bg-[#FDF5E6] overflow-hidden">
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={product.image}
                        loading="lazy"
                      />
                      {/* Stock Badge */}
                      <div
                        className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs ${
                          isOutOfStock
                            ? 'bg-[#ba1a1a] text-white'
                            : product.stock <= 5
                            ? 'bg-[#fef7e0] text-[#b06000]'
                            : 'bg-[#FCE4EC] text-[#330f1f]'
                        }`}
                      >
                        {isOutOfStock ? 'Habis' : `Stok: ${product.stock}`}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-1 flex-1 justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-[#827377] tracking-wider uppercase">
                          SKU: {product.sku}
                        </p>
                        <h3 className="text-sm font-semibold text-[#0d1e25] line-clamp-2 mt-0.5 min-h-[40px]">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-100/80">
                        <p className="text-base font-bold text-[#805062]">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <button
                          aria-label={`Tambah ${product.name} ke keranjang`}
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) addToCart(product);
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
                            isOutOfStock
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#f8bbd0] text-[#76485a] hover:bg-[#805062] hover:text-white group-hover:scale-110'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Shopping Cart ("Pesanan Baru") */}
      <div
        id="cart-panel"
        className="w-[390px] xl:w-[420px] shrink-0 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.04)] z-20 flex flex-col h-full border-l border-[#e4e4cc]/60"
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 flex flex-col gap-2 border-b border-[#e4e4cc]/40 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#805062] text-[26px]">
                shopping_cart
              </span>
              <h2 className="font-bold text-xl text-[#0d1e25]">Pesanan Baru</h2>
              {cart.length > 0 && (
                <span className="bg-[#f8bbd0] text-[#76485a] text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                id="btn-clear-cart"
                onClick={clearCart}
                className="w-9 h-9 rounded-full bg-[#FDF5E6] text-[#ba1a1a] hover:bg-[#ffdad6] flex items-center justify-center transition-colors"
                title="Kosongkan Keranjang"
              >
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
              </button>
            )}
          </div>

          {/* Active Cashier Row & Quick Switcher */}
          <div className="relative">
            <div
              onClick={() => setIsSwitchCashierQuickOpen(!isSwitchCashierQuickOpen)}
              className="flex items-center justify-between p-2 bg-[#f4faff] hover:bg-[#eaf4fb] border border-[#dff1fb] rounded-xl cursor-pointer transition-colors"
              title="Klik untuk ganti kasir"
            >
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={currentCashier.avatar}
                  alt={currentCashier.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-[#805062]"
                />
                <div className="flex items-center gap-1.5 min-w-0 text-xs">
                  <span className="font-bold text-[#0d1e25] truncate">{currentCashier.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-[#805062] font-semibold truncate text-[11px]">{currentCashier.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                  Aktif
                </span>
                <span className="material-symbols-outlined text-[16px] text-gray-400">
                  expand_more
                </span>
              </div>
            </div>

            {/* Quick Switch Dropdown */}
            {isSwitchCashierQuickOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dff1fb] rounded-2xl shadow-xl p-2 z-30 animate-in fade-in">
                <div className="px-2 py-1 border-b border-gray-100 flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-500">Pilih Kasir Bertugas:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSwitchCashierQuickOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    Tutup
                  </button>
                </div>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  {cashiers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        switchActiveCashier(c.id);
                        setIsSwitchCashierQuickOpen(false);
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-xl cursor-pointer text-xs transition-colors ${
                        c.id === currentCashier.id
                          ? 'bg-[#f8bbd0]/40 font-bold text-[#76485a]'
                          : 'hover:bg-gray-50 text-[#0d1e25]'
                      }`}
                    >
                      <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate flex-1">{c.name}</span>
                      <span className="text-[10px] text-gray-500 font-normal">({c.role})</span>
                      <span
                        className={`text-[8px] font-bold px-1 py-0.2 rounded-sm ${
                          c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 scroll-smooth">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60 p-6 text-center my-auto">
              <span className="material-symbols-outlined text-[64px] mb-2 text-[#827377]/40">
                shopping_basket
              </span>
              <p className="font-semibold text-sm text-[#504447]">Keranjang masih kosong</p>
              <p className="text-xs text-gray-500 mt-1">
                Pilih produk dari katalog di sebelah kiri untuk memulai pesanan.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="group flex gap-3 p-3.5 bg-[#FDF5E6] rounded-xl relative overflow-hidden transition-all hover:shadow-[0_4px_12px_rgba(55,71,79,0.06)] border border-[#f4e6d2]/50"
              >
                {/* Hover Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#805062] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h4 className="font-semibold text-[#0d1e25] text-sm truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-[#504447] mt-0.5">
                    Rp {item.product.price.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-bold text-[#805062] text-sm">
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                  {/* Quantity Controls */}
                  <div className="flex items-center bg-white rounded-full shadow-xs p-0.5 border border-gray-100">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#504447] hover:bg-[#FDF5E6] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-[#0d1e25]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#504447] hover:bg-[#FDF5E6] transition-colors disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>

                {/* Hover Delete Action */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#ffdad6] text-[#93000a] rounded-full flex items-center justify-center group-hover:right-3 transition-all shadow-md"
                  title="Hapus"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        <div className="shrink-0 bg-white p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] relative z-20 flex flex-col gap-3 rounded-t-3xl border-t border-[#e4e4cc]/60">
          {/* Totals */}
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between items-center text-[#504447]">
              <span>Subtotal</span>
              <span className="font-semibold text-sm">
                Rp {cartSubtotal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#504447]">
              <span>Diskon</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max={cartSubtotal}
                  value={cartDiscount || ''}
                  placeholder="0"
                  onChange={(e) => setCartDiscount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-20 text-right py-0.5 px-2 bg-[#FDF5E6] rounded-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#f8bbd0]"
                />
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-100 my-1"></div>
            <div className="flex justify-between items-end">
              <span className="text-base font-bold text-[#0d1e25]">Total</span>
              <span className="text-[26px] font-extrabold text-[#805062] leading-none">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[11px] font-semibold text-[#827377] uppercase tracking-wider">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Tunai', 'Transfer', 'Kartu', 'QRIS'] as PaymentMethod[]).map((method) => {
                const isActive = cartPaymentMethod === method;
                const iconMap: Record<PaymentMethod, string> = {
                  Tunai: 'payments',
                  Transfer: 'account_balance',
                  Kartu: 'credit_card',
                  QRIS: 'qr_code_scanner',
                };
                return (
                  <button
                    key={method}
                    id={`pay-method-${method.toLowerCase()}`}
                    onClick={() => setCartPaymentMethod(method)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      isActive
                        ? 'bg-[#805062] text-white shadow-md'
                        : 'bg-[#FDF5E6] text-[#504447] hover:bg-[#FCE4EC]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {iconMap[method]}
                    </span>
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Input (For Cash / Tunai) */}
          {cartPaymentMethod === 'Tunai' && (
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 hide-scrollbar">
                {quickCashAmounts.map((amt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCartAmountPaid(amt)}
                    className="px-2.5 py-1 bg-[#FDF5E6] hover:bg-[#FCE4EC] text-[#504447] text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors"
                  >
                    {amt === cartTotal ? 'Pas' : `Rp ${amt.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm text-[#504447]">
                  Rp
                </span>
                <input
                  id="cash-amount-input"
                  type="number"
                  min="0"
                  value={cartAmountPaid || ''}
                  onChange={(e) => setCartAmountPaid(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FDF5E6] text-[#0d1e25] font-bold text-base rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f8bbd0] text-right transition-shadow"
                />
              </div>

              <div className="flex justify-between items-center bg-[#FCE4EC] px-4 py-2 rounded-xl">
                <span className="text-xs font-bold text-[#330f1f] uppercase tracking-wider">
                  Kembalian
                </span>
                <span className="text-base font-extrabold text-[#330f1f]">
                  Rp {cartChange.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            id="btn-pay-order"
            disabled={cart.length === 0}
            onClick={checkout}
            className="w-full py-3.5 bg-[#f8bbd0] hover:bg-[#805062] text-[#330f1f] hover:text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(128,80,98,0.2)] hover:shadow-[0_6px_20px_rgba(128,80,98,0.3)] mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            BAYAR (Rp {cartTotal.toLocaleString('id-ID')})
          </button>
        </div>
      </div>

      {/* Success Modal matching screen design */}
      {isSuccessModalOpen && lastCompletedTransaction && (
        <div
          id="success-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="bg-white w-[460px] max-w-full rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative transform scale-100 transition-transform">
            {/* Top Icon Badge */}
            <div className="absolute -top-10 w-20 h-20 bg-[#FCE4EC] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <span
                className="material-symbols-outlined text-[#805062] text-[42px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                task_alt
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#0d1e25] mt-6 mb-1">Transaksi Berhasil!</h2>
            <p className="text-sm text-[#504447] mb-5">
              {lastCompletedTransaction.paymentMethod === 'Tunai' ? (
                <>
                  Kembalian:{' '}
                  <strong className="text-[#805062] text-base font-bold">
                    Rp {lastCompletedTransaction.change.toLocaleString('id-ID')}
                  </strong>
                </>
              ) : (
                <>
                  Pembayaran{' '}
                  <strong className="text-[#805062] font-semibold">
                    {lastCompletedTransaction.paymentMethod}
                  </strong>{' '}
                  telah terverifikasi
                </>
              )}
            </p>

            {/* Receipt Summary Box */}
            <div className="w-full bg-[#FDF5E6] rounded-2xl p-4 mb-6 text-left flex flex-col gap-2 text-xs border border-[#f4e6d2]">
              <div className="flex justify-between text-[#504447]">
                <span>No. Referensi:</span>
                <span className="font-mono font-bold text-[#0d1e25]">
                  {lastCompletedTransaction.referenceNo}
                </span>
              </div>
              <div className="flex justify-between text-[#504447]">
                <span>Metode:</span>
                <span className="font-semibold text-[#0d1e25]">
                  {lastCompletedTransaction.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between text-[#504447]">
                <span>Waktu:</span>
                <span className="text-[#0d1e25]">
                  {lastCompletedTransaction.date}, {lastCompletedTransaction.time}
                </span>
              </div>
              <div className="flex justify-between text-[#504447]">
                <span>Kasir:</span>
                <span className="text-[#0d1e25]">{lastCompletedTransaction.cashierName}</span>
              </div>
              <div className="h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between font-bold text-sm text-[#0d1e25]">
                <span>Total Dibayar:</span>
                <span className="text-[#805062]">
                  Rp {lastCompletedTransaction.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <button
                id="btn-close-success-modal"
                onClick={() => setIsSuccessModalOpen(false)}
                className="flex-1 py-3 border-2 border-[#FCE4EC] text-[#504447] font-bold text-sm rounded-xl hover:bg-[#FDF5E6] transition-colors"
              >
                Tutup
              </button>
              <button
                id="btn-print-receipt"
                onClick={handlePrint}
                className="flex-1 py-3 bg-[#f8bbd0] text-[#330f1f] font-bold text-sm rounded-xl hover:bg-[#805062] hover:text-white transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
