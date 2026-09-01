import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TabType,
  Product,
  Category,
  CartItem,
  Transaction,
  PaymentMethod,
  CashierProfile,
  StoreSettings,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  CASHIER_PROFILES,
  STORE_SETTINGS,
} from '../data/initialData';

interface POSContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  products: Product[];
  categories: Category[];
  transactions: Transaction[];
  cart: CartItem[];
  currentCashier: CashierProfile;
  setCurrentCashier: (cashier: CashierProfile) => void;
  cashiers: CashierProfile[];
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartDiscount: number;
  setCartDiscount: (disc: number) => void;
  cartPaymentMethod: PaymentMethod;
  setCartPaymentMethod: (method: PaymentMethod) => void;
  cartAmountPaid: number;
  setCartAmountPaid: (amount: number) => void;
  cartSubtotal: number;
  cartTotal: number;
  cartChange: number;

  // Transaction Actions
  lastCompletedTransaction: Transaction | null;
  setLastCompletedTransaction: (trx: Transaction | null) => void;
  isSuccessModalOpen: boolean;
  setIsSuccessModalOpen: (open: boolean) => void;
  checkout: () => Transaction | null;
  cancelTransaction: (trxId: string) => void;

  // Product Actions
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  restockProduct: (id: string, additionalStock: number) => void;

  // Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Demo reset
  resetDemoData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // LocalStorage initialization with fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mycashier_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('mycashier_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('mycashier_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('mycashier_settings');
      return saved ? JSON.parse(saved) : STORE_SETTINGS;
    } catch {
      return STORE_SETTINGS;
    }
  });

  const [currentCashier, setCurrentCashier] = useState<CashierProfile>(CASHIER_PROFILES[0]);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[1], quantity: 3 },
  ]);
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [cartPaymentMethod, setCartPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [cartAmountPaid, setCartAmountPaid] = useState<number>(20000);
  const [lastCompletedTransaction, setLastCompletedTransaction] = useState<Transaction | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mycashier_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mycashier_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mycashier_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mycashier_settings', JSON.stringify(settings));
  }, [settings]);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartChange = Math.max(0, cartAmountPaid - cartTotal);

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setCartAmountPaid(0);
  };

  // Checkout process
  const checkout = (): Transaction | null => {
    if (cart.length === 0) return null;
    if (cartPaymentMethod === 'Tunai' && cartAmountPaid < cartTotal) {
      alert('Jumlah uang tunai yang dibayarkan kurang dari total pesanan!');
      return null;
    }

    const now = new Date();
    const formattedDate = `${now.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]} ${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const nextTrxNumber = 983 + transactions.length;
    const refNo = `TRX-0${nextTrxNumber}`;

    const newTrx: Transaction = {
      id: `trx-${Date.now()}`,
      referenceNo: refNo,
      date: formattedDate,
      time: formattedTime,
      cashierName: currentCashier.name,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: 0,
      total: cartTotal,
      paymentMethod: cartPaymentMethod,
      amountPaid: cartPaymentMethod === 'Tunai' ? cartAmountPaid : cartTotal,
      change: cartPaymentMethod === 'Tunai' ? cartChange : 0,
      status: 'Selesai',
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((item) => item.product.id === prod.id);
        if (inCart) {
          return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
        }
        return prod;
      })
    );

    // Save transaction
    setTransactions((prev) => [newTrx, ...prev]);
    setLastCompletedTransaction(newTrx);
    setIsSuccessModalOpen(true);

    // Reset cart
    clearCart();
    return newTrx;
  };

  const cancelTransaction = (trxId: string) => {
    setTransactions((prev) =>
      prev.map((trx) => (trx.id === trxId ? { ...trx, status: 'Dibatalkan' } : trx))
    );
  };

  // Product CRUD
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const restockProduct = (id: string, additionalStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + additionalStock } : p))
    );
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(STORE_SETTINGS);
    setCart([
      { product: INITIAL_PRODUCTS[0], quantity: 2 },
      { product: INITIAL_PRODUCTS[1], quantity: 3 },
    ]);
    setCartAmountPaid(20000);
    setCartDiscount(0);
    alert('Data contoh telah berhasil di-reset!');
  };

  return (
    <POSContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        products,
        categories,
        transactions,
        cart,
        currentCashier,
        setCurrentCashier,
        cashiers: CASHIER_PROFILES,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
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
        lastCompletedTransaction,
        setLastCompletedTransaction,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        checkout,
        cancelTransaction,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        resetDemoData,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
