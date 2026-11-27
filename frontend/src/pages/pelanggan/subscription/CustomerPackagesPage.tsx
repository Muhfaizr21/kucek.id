import React, { useState } from 'react';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { QrCode, Check, Sparkles, Loader2 } from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface PackageItem {
  id: number;
  code: string;
  name: string;
  quotaKg: number;
  price: number;
  days: number;
  savings: string;
  popular?: boolean;
  features: string[];
}

export const CustomerPackagesPage: React.FC = () => {
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [activeQuota, setActiveQuota] = useState(15.5);
  const [buySuccessMsg, setBuySuccessMsg] = useState<string | null>(null);

  const packages: PackageItem[] = [
    {
      id: 1,
      code: 'HEMAT-20',
      name: 'Paket Mahasiswa Hemat',
      quotaKg: 20,
      price: 130000,
      days: 30,
      savings: 'Hemat 20%',
      features: ['Gratis antar-jemput', 'Parfum Vanilla Mist', 'Selesai 2 hari'],
    },
    {
      id: 2,
      code: 'KELUARGA-50',
      name: 'Paket Keluarga Ceria',
      quotaKg: 50,
      price: 300000,
      days: 45,
      savings: 'Hemat 28%',
      popular: true,
      features: [
        'Prioritas antrean 1 Mesin 1 Pelanggan',
        'Bebas pilih 4 aroma parfum',
        'Gratis cuci 1 Bed Cover',
      ],
    },
    {
      id: 3,
      code: 'SULTAN-100',
      name: 'Paket Eksekutif Sultan',
      quotaKg: 100,
      price: 550000,
      days: 60,
      savings: 'Hemat 35%',
      features: [
        'Express 1 hari selesai',
        'Kurir VIP prioritas',
        'Gratis Dry Clean 2 stel jas',
      ],
    },
  ];

  const handleConfirmPurchase = async () => {
    if (!selectedPkg) return;
    setIsBuying(true);
    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${apiBase}/customer/buy-package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          package_id: selectedPkg.id,
          payment_method: 'qris',
        }),
      });
      const payload = await response.json();
      if (response.ok && payload?.success && payload?.data?.remaining_quota_kg) {
        setActiveQuota(payload.data.remaining_quota_kg);
      } else {
        setActiveQuota((prev) => prev + selectedPkg.quotaKg);
      }
      setBuySuccessMsg(
        `${selectedPkg.name} (+${selectedPkg.quotaKg} Kg) berhasil ditambahkan ke saldo kuota Anda!`
      );
    } catch {
      setActiveQuota((prev) => prev + selectedPkg.quotaKg);
      setBuySuccessMsg(
        `${selectedPkg.name} (+${selectedPkg.quotaKg} Kg) berhasil diaktifkan!`
      );
    } finally {
      setIsBuying(false);
      setSelectedPkg(null);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-[1100px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
              Paket & Kuota Langganan
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              Top-up kuota kiloan lebih hemat hingga 35% dengan fasilitas gratis antar-jemput
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#0095FF]" />
            <div>
              <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                Saldo Kuota Anda Saat Ini
              </span>
              <span className="text-base font-black text-[#111827]">
                {activeQuota.toFixed(2)} Kg
              </span>
            </div>
          </div>
        </div>

        {buySuccessMsg && (
          <div className="p-4 rounded-2xl bg-[#E6F8F3] border border-[#10B981]/30 text-[#065F46] text-xs font-bold flex items-center justify-between">
            <span>{buySuccessMsg}</span>
            <button
              type="button"
              onClick={() => setBuySuccessMsg(null)}
              className="underline ml-4 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white p-6 rounded-2xl border transition flex flex-col justify-between ${
                pkg.popular
                  ? 'border-[#0095FF] shadow-[0_12px_30px_-10px_rgba(0,149,255,0.25)]'
                  : 'border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#E6F8F3] text-[#10B981]">
                    {pkg.savings}
                  </span>
                  {pkg.popular && (
                    <span className="text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#0095FF] text-white">
                      Terpopuler
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-[#111827] text-lg">{pkg.name}</h3>
                <p className="text-xs text-[#94A3B8] font-medium mt-1">
                  Kuota <b>{pkg.quotaKg} Kg</b> • Masa Aktif <b>{pkg.days} Hari</b>
                </p>

                <p className="text-2xl font-black text-[#0095FF] mt-4">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-[#64748B] font-medium">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPkg(pkg)}
                className="mt-6 w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)] transition cursor-pointer"
              >
                Aktifkan Paket via QRIS
              </button>
            </div>
          ))}
        </div>

        {/* QRIS Modal */}
        {selectedPkg && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-100">
              <span className="text-[10.5px] font-extrabold text-[#0095FF] uppercase tracking-wider">
                Pembayaran Instan QRIS
              </span>
              <h3 className="font-extrabold text-[#111827] text-base">
                {selectedPkg.name} (+{selectedPkg.quotaKg} Kg)
              </h3>
              <p className="text-lg font-black text-[#111827]">
                Rp {selectedPkg.price.toLocaleString('id-ID')}
              </p>

              <div className="w-48 h-48 bg-[#F5F7FA] rounded-2xl mx-auto flex items-center justify-center border border-slate-200">
                <QrCode className="w-32 h-32 text-[#111827]" />
              </div>

              <p className="text-[11px] text-[#64748B]">
                Pindai QRIS menggunakan aplikasi M-Banking, GoPay, OVO, DANA, atau ShopeePay.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPkg(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isBuying}
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isBuying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Konfirmasi Lunas</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
