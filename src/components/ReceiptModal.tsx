import React from 'react';
import { Transaction, StoreSettings } from '../types';
import { LOGO_URL } from '../data/initialData';

interface ReceiptModalProps {
  transaction: Transaction | null;
  settings: StoreSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  settings,
  onClose,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center no-print">
          <span className="font-bold text-xs text-gray-700">Pratinjau Struk Pembayaran</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div
          id="printable-receipt"
          className="p-6 overflow-y-auto font-mono text-xs text-gray-800 flex flex-col gap-3 print:p-0 print:m-0"
        >
          {/* Store Info */}
          <div className="text-center flex flex-col items-center gap-1 border-b border-dashed border-gray-300 pb-4">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain mb-1" />
            <h2 className="font-bold text-sm tracking-tight text-gray-900">{settings.storeName}</h2>
            <p className="text-[10px] text-gray-500">{settings.tagline}</p>
            <p className="text-[10px] text-gray-500">{settings.address}</p>
            <p className="text-[10px] text-gray-500">Telp: {settings.phone}</p>
          </div>

          {/* Transaction Metadata */}
          <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 pb-3 text-[11px]">
            <div className="flex justify-between">
              <span>No. Ref:</span>
              <span className="font-bold">{transaction.referenceNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu:</span>
              <span>
                {transaction.date}, {transaction.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{transaction.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span>Metode:</span>
              <span>{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className={`font-bold ${
                  transaction.status === 'Selesai' ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex flex-col gap-2 border-b border-dashed border-gray-300 pb-3 text-[11px]">
            {transaction.items.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="font-bold text-gray-900">{item.name}</span>
                <div className="flex justify-between text-gray-600">
                  <span>
                    {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="flex flex-col gap-1 border-b border-dashed border-gray-300 pb-3 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rp {transaction.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon:</span>
                <span>-Rp {transaction.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-gray-900 mt-1">
              <span>TOTAL:</span>
              <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-1">
              <span>Dibayar:</span>
              <span>Rp {transaction.amountPaid.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Kembalian:</span>
              <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-gray-500 mt-1 leading-relaxed">
            <p>{settings.footerNote}</p>
            <p className="mt-2 font-bold text-gray-400">=== TERIMA KASIH ===</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 no-print">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-[#805062] hover:bg-[#65394b] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Cetak Struk
          </button>
        </div>
      </div>
    </div>
  );
};
