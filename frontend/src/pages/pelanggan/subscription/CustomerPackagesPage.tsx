import React, { useState } from 'react';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { QrCode } from 'lucide-react';

export const CustomerPackagesPage: React.FC = () => {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  const packages = [
    { id: '1', name: 'Paket Anak Kos Hemat', quotaKg: 30, price: 180000, days: 30, savings: 'Hemat 25%' },
    { id: '2', name: 'Paket Keluarga Bahagia', quotaKg: 50, price: 300000, days: 45, savings: 'Hemat 30%' },
    { id: '3', name: 'Paket Sultan Mega', quotaKg: 100, price: 550000, days: 60, savings: 'Hemat 35%' },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paket Kuota Langganan Kiloan</h1>
          <p className="text-xs text-slate-500">Beli saldo kuota di depan, lebih hemat & otomatis terpotong saat laundry</p>
        </div>

        <div className="space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{pkg.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {pkg.savings}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Kuota: <b>{pkg.quotaKg} Kg</b> • Masa Aktif: <b>{pkg.days} Hari</b>
                </p>
                <p className="text-xl font-black text-sky-600 mt-2">Rp{pkg.price.toLocaleString('id-ID')}</p>
              </div>

              <button
                onClick={() => setSelectedPkg(pkg.name)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition"
              >
                Beli via QRIS
              </button>
            </div>
          ))}
        </div>

        {/* QRIS Simulated Modal */}
        {selectedPkg && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white max-w-xs w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bayar via QRIS</span>
              <h3 className="font-bold text-slate-900 text-sm">{selectedPkg}</h3>

              <div className="w-48 h-48 bg-slate-100 rounded-xl mx-auto flex items-center justify-center border-2 border-slate-200">
                <QrCode className="w-32 h-32 text-slate-800" />
              </div>

              <p className="text-[11px] text-slate-500">
                Scan kode QRIS di atas menggunakan GoPay, OVO, ShopeePay, BCA, atau mobile banking apapun.
              </p>

              <button
                onClick={() => {
                  alert('Pembayaran QRIS berhasil! Kuota langsung masuk ke akun Anda.');
                  setSelectedPkg(null);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Simulasi Bayar Berhasil
              </button>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
