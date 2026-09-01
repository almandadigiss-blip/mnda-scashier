import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Product } from '../types';

export const ProdukView: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = usePOS();

  const [search, setSearch] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('Semua');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Deletion States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
    description: '',
    minStockAlert: 5,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter products
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedFilterCategory === 'Semua' ||
      p.category.toLowerCase() === selectedFilterCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'Pakaian',
      price: 50000,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
      description: '',
      minStockAlert: 5,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image,
      description: p.description || '',
      minStockAlert: p.minStockAlert || 5,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || formData.price <= 0) {
      alert('Mohon lengkapi nama produk, SKU, dan harga jual yang valid.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      showToast(`Produk "${formData.name}" berhasil diperbarui.`);
    } else {
      addProduct(formData);
      showToast(`Produk "${formData.name}" berhasil ditambahkan.`);
    }
    setIsModalOpen(false);
  };

  // Single delete execution
  const handleConfirmSingleDelete = () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    deleteProduct(productToDelete.id);
    setSelectedIds((prev) => prev.filter((id) => id !== productToDelete.id));
    setProductToDelete(null);
    showToast(`Produk "${name}" berhasil dihapus.`);
  };

  // Bulk delete execution
  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    selectedIds.forEach((id) => deleteProduct(id));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast(`${count} produk berhasil dihapus.`);
  };

  // Checkbox toggle helpers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const uniqueCategories = ['Semua', ...Array.from(new Set(categories.map((c) => c.name)))];

  return (
    <div id="produk-page" className="flex flex-col w-full h-full relative p-6 sm:p-8 bg-white min-h-[calc(100vh-64px)] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="produk-toast"
          className="fixed bottom-6 right-6 z-[120] bg-[#0d1e25] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom-5 duration-200"
        >
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
            Manajemen Produk
          </h1>
          <p className="text-sm text-[#504447] mt-1">
            Kelola katalog produk, edit informasi, perbarui stok, atau hapus produk yang tidak lagi dijual.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="bg-[#f4faff] border border-[#dff1fb] p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#805062] shadow-xs'
                  : 'text-gray-500 hover:text-[#0d1e25]'
              }`}
              title="Tampilan Grid"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#805062] shadow-xs'
                  : 'text-gray-500 hover:text-[#0d1e25]'
              }`}
              title="Tampilan Tabel"
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
          </div>

          <button
            id="btn-tambah-produk"
            onClick={handleOpenAddModal}
            className="bg-[#805062] hover:bg-[#65394b] text-white font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Search, Filter & Select All Bar */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#dff1fb]/60 rounded-xl px-4 py-2.5 w-full lg:w-96 focus-within:ring-2 focus-within:ring-[#f8bbd0] focus-within:bg-white transition-all border border-transparent focus-within:border-[#f8bbd0]">
          <span className="material-symbols-outlined text-[#504447]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk, kategori, atau SKU..."
            className="bg-transparent border-none outline-none text-sm text-[#0d1e25] w-full placeholder:text-[#504447]/60"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilterCategory(cat)}
              className={`whitespace-nowrap font-semibold text-xs px-4 py-2 rounded-full uppercase tracking-wider transition-all shadow-2xs ${
                selectedFilterCategory === cat
                  ? 'bg-[#805062] text-white font-bold'
                  : 'bg-[#d9ebf5] text-[#504447] hover:bg-[#d4e5ef]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Subbar (Select all & stats) */}
      <div className="flex items-center justify-between py-2 px-1 mb-3 text-xs text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 hover:text-[#0d1e25]">
            <input
              type="checkbox"
              checked={filtered.length > 0 && selectedIds.length === filtered.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded text-[#805062] focus:ring-[#805062] cursor-pointer"
            />
            <span>Pilih Semua ({filtered.length})</span>
          </label>
          {selectedIds.length > 0 && (
            <span className="bg-[#f8bbd0]/60 text-[#76485a] font-bold px-2.5 py-0.5 rounded-full text-[11px]">
              {selectedIds.length} produk terpilih
            </span>
          )}
        </div>

        <span className="text-gray-400">
          Total: <strong className="text-[#0d1e25]">{products.length}</strong> produk
        </span>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-[#f4faff] rounded-3xl border border-dashed border-[#dff1fb] my-6">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xs mb-3 text-[#805062]">
            <span className="material-symbols-outlined text-[32px]">inventory_2</span>
          </div>
          <h3 className="font-bold text-base text-[#0d1e25]">Tidak Ada Produk Ditemukan</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm text-center">
            {search || selectedFilterCategory !== 'Semua'
              ? 'Tidak ada produk yang cocok dengan kata kunci atau filter kategori saat ini.'
              : 'Belum ada produk dalam katalog. Silakan klik tombol Tambah Produk.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-[#805062] hover:bg-[#65394b] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Produk Sekarang
          </button>
        </div>
      )}

      {/* Products Grid View */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 flex-1">
          {filtered.map((product) => {
            const isLowStock = product.stock <= (product.minStockAlert || 5);
            const isSelected = selectedIds.includes(product.id);
            return (
              <div
                key={product.id}
                id={`prod-card-${product.id}`}
                className={`bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(55,71,79,0.04)] hover:shadow-md transition-all relative group flex gap-4 items-center border ${
                  isSelected ? 'border-[#805062] bg-[#fdf8f9]' : 'border-[#dff1fb]'
                }`}
              >
                {/* Select checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(product.id)}
                    className="w-4 h-4 rounded text-[#805062] focus:ring-[#805062] cursor-pointer"
                  />
                </div>

                {/* Product Thumbnail with hover edit/delete */}
                <div className="w-24 h-24 rounded-xl bg-[#FDF5E6] flex-shrink-0 overflow-hidden relative border border-gray-100 ml-4 sm:ml-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="w-8 h-8 rounded-full bg-white text-[#805062] hover:bg-[#805062] hover:text-white flex items-center justify-center shadow-xs transition-colors"
                      title="Edit Produk"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="w-8 h-8 rounded-full bg-white text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white flex items-center justify-center shadow-xs transition-colors"
                      title="Hapus Produk"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-semibold text-[#504447] uppercase tracking-wider bg-[#d4e5ef] px-2 py-0.5 rounded-full truncate max-w-[130px]">
                      {product.category}
                    </span>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="w-7 h-7 rounded-lg text-gray-400 hover:text-[#805062] hover:bg-[#f4faff] flex items-center justify-center transition-colors"
                        title="Edit Produk"
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="w-7 h-7 rounded-lg text-gray-400 hover:text-[#ba1a1a] hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="Hapus Produk"
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm text-[#0d1e25] truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#827377] font-mono mt-0.5">SKU: {product.sku}</p>

                  <div className="flex justify-between items-end mt-2.5">
                    <div className="font-bold text-sm sm:text-base text-[#0d1e25]">
                      Rp {product.price.toLocaleString('id-ID')}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[11px] font-semibold ${
                        isLowStock ? 'text-[#ba1a1a]' : 'text-[#504447]'
                      }`}
                    >
                      {isLowStock ? (
                        <>
                          <span className="material-symbols-outlined text-[14px]">warning</span>
                          <span>{product.stock} Stok</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                          <span>{product.stock} Stok</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products Table View */}
      {viewMode === 'table' && filtered.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(55,71,79,0.04)] border border-[#dff1fb] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#f4faff] border-b border-[#dff1fb] text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  <th className="p-3.5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.length === filtered.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-[#805062] focus:ring-[#805062] cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5">Produk</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Harga Jual</th>
                  <th className="p-3.5 text-center">Stok</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {filtered.map((product) => {
                  const isLowStock = product.stock <= (product.minStockAlert || 5);
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-[#f8bbd0]/10 transition-colors ${
                        isSelected ? 'bg-[#fdf8f9]' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          className="w-4 h-4 rounded text-[#805062] focus:ring-[#805062] cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs sm:text-sm text-[#0d1e25] truncate">{product.name}</p>
                            <p className="text-[11px] text-gray-500 font-mono">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] font-semibold text-[#504447] bg-[#d4e5ef] px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-xs sm:text-sm text-[#0d1e25]">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isLowStock
                              ? 'bg-red-100 text-[#ba1a1a]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock} unit
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#805062] text-xs font-semibold text-gray-700 hover:text-[#805062] flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="px-2.5 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-semibold text-[#ba1a1a] flex items-center gap-1 transition-colors"
                            title="Hapus Produk"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0d1e25] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-700 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-6 h-6 rounded-full bg-[#805062] flex items-center justify-center font-bold">
              {selectedIds.length}
            </span>
            <span>Produk Terpilih</span>
          </div>
          <div className="h-4 w-px bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">delete</span>
              <span>Hapus {selectedIds.length} Produk</span>
            </button>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      <div className="mt-8 flex justify-between items-center bg-[#e7f6ff]/70 px-4 py-3 rounded-2xl border border-[#dff1fb]">
        <span className="text-xs text-[#504447]">
          Menampilkan 1-{filtered.length} dari {products.length} produk
        </span>
        <div className="flex gap-1.5">
          <button className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 transition-colors shadow-2xs">
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 transition-colors shadow-2xs">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Modal: Tambah / Edit Produk */}
      {isModalOpen && (
        <div
          id="modal-tambah-produk"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl flex flex-col border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-[#0d1e25]">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 flex flex-col gap-5">
              {/* Image Input Section */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-1/3 aspect-square bg-[#FDF5E6] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[#d4c2c6] hover:border-[#805062] transition-colors relative overflow-hidden group">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-3">
                      <span className="material-symbols-outlined text-[#827377] text-[32px] mb-1">
                        add_photo_alternate
                      </span>
                      <span className="text-xs text-[#504447] block font-medium">Unggah Foto</span>
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-2/3 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                      Nama Produk *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Silk Blouse Elegance"
                      className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] focus:ring-1 focus:ring-[#805062]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                      URL Gambar Foto Produk
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SKU */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                    SKU (Stock Keeping Unit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Contoh: BLS-001"
                    className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 text-sm font-mono text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                  />
                </div>

                {/* Kategori Dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                    Kategori *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="appearance-none bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 w-full text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] pr-8 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Harga */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                    Harga Jual (Rp) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      min="100"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) || 0 })
                      }
                      className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl pl-9 pr-4 py-2 w-full text-sm font-bold text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                    />
                  </div>
                </div>

                {/* Stok */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                    Stok Tersedia *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: Number(e.target.value) || 0 })
                    }
                    className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 w-full text-sm font-bold text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tambahkan catatan atau detail spesifikasi produk..."
                  className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] resize-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                {/* Delete Button inside edit modal */}
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prod = editingProduct;
                      setIsModalOpen(false);
                      setProductToDelete(prod);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#ba1a1a] hover:bg-red-50 border border-red-200 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                    Hapus Produk Ini
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#504447] hover:bg-gray-100 border border-[#d4c2c6] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#805062] hover:bg-[#65394b] text-white transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Simpan Produk
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Single Product) */}
      {productToDelete && (
        <div
          id="modal-delete-product"
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 flex flex-col gap-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#0d1e25]">Hapus Produk?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Apakah Anda yakin ingin menghapus produk ini dari katalog?
              </p>
            </div>

            {/* Product card preview */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-left">
              <img
                src={productToDelete.image}
                alt={productToDelete.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0d1e25] truncate">{productToDelete.name}</p>
                <p className="text-[11px] text-gray-500 font-mono">SKU: {productToDelete.sku}</p>
                <p className="text-xs font-bold text-[#805062] mt-0.5">
                  Rp {productToDelete.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div
          id="modal-bulk-delete-product"
          className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-red-100 flex flex-col gap-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_sweep</span>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#0d1e25]">Hapus {selectedIds.length} Produk?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Seluruh {selectedIds.length} produk yang dipilih akan dihapus permanen dari sistem POS.
              </p>
            </div>

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

