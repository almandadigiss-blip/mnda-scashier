import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Product } from '../types';

export const ProdukView: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = usePOS();

  const [search, setSearch] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
      category: categories[0]?.name || 'Alat Tulis',
      price: 10000,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
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
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div id="produk-page" className="flex flex-col w-full h-full relative p-8 bg-white min-h-[calc(100vh-64px)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
            Manajemen Produk
          </h1>
          <p className="text-sm text-[#504447] mt-1">
            Kelola katalog produk, harga, dan ketersediaan stok.
          </p>
        </div>
        <button
          id="btn-tambah-produk"
          onClick={handleOpenAddModal}
          className="bg-[#805062] hover:bg-[#65394b] text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Produk
        </button>
      </div>

      {/* Search and Category Filter Chips */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#dff1fb]/60 rounded-xl px-4 py-2.5 w-full md:w-96 focus-within:ring-2 focus-within:ring-[#f8bbd0] focus-within:bg-white transition-all border border-transparent focus-within:border-[#f8bbd0]">
          <span className="material-symbols-outlined text-[#504447]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk atau SKU..."
            className="bg-transparent border-none outline-none text-sm text-[#0d1e25] w-full placeholder:text-[#504447]/60"
          />
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {['Semua', 'Pakaian', 'Aksesoris', 'Sepatu', 'Alat Tulis', 'Buku', 'Home Decor'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilterCategory(cat)}
                className={`whitespace-nowrap font-semibold text-xs px-4 py-2 rounded-full uppercase tracking-wider transition-all shadow-xs ${
                  selectedFilterCategory === cat
                    ? 'bg-[#ddc6ce] text-[#625158] font-bold'
                    : 'bg-[#d9ebf5] text-[#504447] hover:bg-[#d4e5ef]'
                }`}
              >
                {cat === 'Pakaian' ? 'Pakaian Wanita' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Products Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 flex-1">
        {filtered.map((product) => {
          const isLowStock = product.stock <= (product.minStockAlert || 5);
          return (
            <div
              key={product.id}
              id={`prod-card-${product.id}`}
              className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(55,71,79,0.04)] hover:shadow-md transition-shadow relative group flex gap-4 items-center border border-[#dff1fb]"
            >
              {/* Product Thumbnail with hover edit */}
              <div className="w-24 h-24 rounded-xl bg-[#FDF5E6] flex-shrink-0 overflow-hidden relative border border-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    className="bg-white text-[#805062] p-1.5 rounded-full shadow-sm hover:bg-[#805062] hover:text-white transition-colors"
                    title="Edit Produk"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[11px] font-semibold text-[#504447] uppercase tracking-wider bg-[#d4e5ef] px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-gray-400 hover:text-[#ba1a1a] transition-colors p-1"
                    title="Hapus Produk"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <h3 className="font-semibold text-sm text-[#0d1e25] truncate" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-xs text-[#827377] font-mono mt-0.5">SKU: {product.sku}</p>

                <div className="flex justify-between items-end mt-3">
                  <div className="font-bold text-base text-[#0d1e25]">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      isLowStock ? 'text-[#ba1a1a]' : 'text-[#504447]'
                    }`}
                  >
                    {isLowStock ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        <span>{product.stock} Sisa Stok</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                        <span>{product.stock} In Stock</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#504447] hover:bg-gray-100 border border-[#d4c2c6] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#805062] hover:bg-[#65394b] text-white transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
