import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { KasirView } from './components/KasirView';
import { ProdukView } from './components/ProdukView';
import { KategoriView } from './components/KategoriView';
import { StokView } from './components/StokView';
import { RiwayatPenjualanView } from './components/RiwayatPenjualanView';
import { LaporanView } from './components/LaporanView';
import { PengaturanView } from './components/PengaturanView';
import { ReceiptModal } from './components/ReceiptModal';
import { Transaction } from './types';

const MainLayout: React.FC = () => {
  const { currentTab, settings } = usePOS();
  const [selectedReceiptTrx, setSelectedReceiptTrx] = useState<Transaction | null>(null);

  return (
    <div className="flex min-h-screen bg-white font-sans text-[#0d1e25] antialiased">
      {/* Fixed Left Sidebar (Warm Sage Background #e4e4cc) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header />

        {/* Dynamic Page Views */}
        <main className="flex-1 mt-16 bg-white overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView onViewTransaction={(trx) => setSelectedReceiptTrx(trx)} />
          )}
          {currentTab === 'kasir' && <KasirView />}
          {currentTab === 'produk' && <ProdukView />}
          {currentTab === 'kategori' && <KategoriView />}
          {currentTab === 'stok' && <StokView />}
          {currentTab === 'riwayat-penjualan' && (
            <RiwayatPenjualanView onViewTransaction={(trx) => setSelectedReceiptTrx(trx)} />
          )}
          {currentTab === 'laporan' && <LaporanView />}
          {currentTab === 'pengaturan' && <PengaturanView />}
        </main>
      </div>

      {/* Struk / Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTrx}
        settings={settings}
        onClose={() => setSelectedReceiptTrx(null)}
      />
    </div>
  );
};

export function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}

export default App;
