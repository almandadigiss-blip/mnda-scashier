import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Category } from '../types';

export const KategoriView: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = usePOS();

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIsAddEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, { name: name.trim(), description: description.trim() });
    } else {
      addCategory({ name: name.trim(), description: description.trim() });
    }
    setIsAddEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div id="kategori-page" className="flex flex-col w-full p-8 gap-8 bg-white min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1e25] tracking-tight">
            Kategori Produk
          </h1>
          <p className="text-sm text-[#504447] mt-1">Kelola pengelompokan produk Anda.</p>
        </div>
        <button
          id="btn-tambah-kategori"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-[#805062] hover:bg-[#65394b] text-white px-5 py-2.5 rounded-xl transition-colors shadow-sm self-start sm:self-auto font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah Kategori
        </button>
      </div>

      {/* Categories Table Container */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(55,71,79,0.04)] border border-[#dff1fb] flex flex-col overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#f4faff] border-b border-[#dff1fb]">
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider w-1/4">
                  Nama Kategori
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider text-center w-28">
                  Jumlah Produk
                </th>
                <th className="p-4 text-xs font-semibold text-[#504447] uppercase tracking-wider text-right w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#0d1e25]">
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-[#f8bbd0]/15 group transition-colors relative border-b border-[#dff1fb]/60 last:border-none"
                  >
                    {/* Left subtle highlight bar */}
                    <td className="p-4 font-semibold text-[#0d1e25] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#805062]/40 group-hover:bg-[#805062] transition-colors"></div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4 text-[#504447]">{cat.description}</td>
                    <td className="p-4 text-center">
                      <span className="bg-[#d4e5ef] text-[#504447] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {count} Produk
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="w-9 h-9 rounded-full hover:bg-[#dff1fb] flex items-center justify-center text-[#504447] hover:text-[#805062] transition-colors"
                          title="Edit Kategori"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="w-9 h-9 rounded-full hover:bg-[#ffdad6] flex items-center justify-center text-gray-400 hover:text-[#ba1a1a] transition-colors"
                          title="Hapus Kategori"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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

      {/* Add / Edit Category Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-gray-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-lg text-[#0d1e25]">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Alat Tulis"
                  className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2.5 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#0d1e25] uppercase tracking-wide">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Buku, pensil, pulpen, dll."
                  className="bg-[#e7f6ff]/40 border border-[#d4c2c6] rounded-xl px-4 py-2 text-sm text-[#0d1e25] focus:outline-none focus:border-[#805062] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#504447] hover:bg-gray-100 border border-[#d4c2c6]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#805062] hover:bg-[#65394b] text-white shadow-xs"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[26px]">warning</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0d1e25]">
                Hapus Kategori "{deleteTarget.name}"?
              </h3>
              <p className="text-xs text-[#504447] mt-1.5 leading-relaxed">
                Kategori ini mungkin masih digunakan oleh beberapa produk dalam katalog. Apakah Anda
                yakin ingin menghapusnya?
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#504447] hover:bg-gray-100 border border-[#d4c2c6]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
