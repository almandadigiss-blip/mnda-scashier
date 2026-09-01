export type TabType =
  | 'dashboard'
  | 'kasir'
  | 'produk'
  | 'kategori'
  | 'stok'
  | 'riwayat-penjualan'
  | 'laporan'
  | 'pengaturan';

export type PaymentMethod = 'Tunai' | 'Transfer' | 'Kartu' | 'QRIS';

export type TransactionStatus = 'Selesai' | 'Dibatalkan' | 'Tertunda';

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  minStockAlert?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export interface TransactionItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  referenceNo: string;
  date: string;
  time: string;
  cashierName: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status: TransactionStatus;
  note?: string;
}

export interface CashierProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isActive: boolean;
  phone?: string;
  email?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  footerNote: string;
  taxPercent: number;
  currency: string;
  autoPrintReceipt: boolean;
}
