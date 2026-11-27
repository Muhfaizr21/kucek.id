import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { QrCode, Check, Sparkles, Loader2, TicketPercent, Award, X } from 'lucide-react';
import { getAuthToken } from '../../../services/authService';
import type { CustomerVoucherClaim } from '../voucher/CustomerVoucherPage';

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

const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: 1,
    code: 'HEMAT-20',
    name: 'Paket Mahasiswa Hemat',
    quotaKg: 20,
    price: 130000,
    days: 30,
    savings: 'Hemat 20%',
    features: ['Gratis antar-jemput tanpa minimum', 'Parfum Vanilla Mist / Ocean Fresh', 'Selesai 2 hari kerja'],
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
      'Bebas pilih 4 aroma parfum premium',
      'Gratis cuci 1 Bed Cover Reguler',
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
      'Express 1 hari selesai tanpa biaya tambahan',
      'Kurir VIP prioritas gelombang pagi/sore',
      'Gratis Dry Clean 2 stel jas eksekutif',
    ],
  },
];

export const CustomerPackagesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialVoucherParam = searchParams.get('voucher') || '';

  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_PACKAGES);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [activeQuota, setActiveQuota] = useState(15.5);
  const [activePackageName, setActivePackageName] = useState('Paket Keluarga Ceria');
  const [loyaltyPoints, setLoyaltyPoints] = useState(320);
  const [buySuccessMsg, setBuySuccessMsg] = useState<string | null>(null);

  // Voucher state for package purchase
  const [voucherCodeInput, setVoucherCodeInput] = useState(initialVoucherParam);
  const [claimedVouchers, setClaimedVouchers] = useState<CustomerVoucherClaim[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [voucherFeedback, setVoucherFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

    // 1. Fetch real package catalog from PostgreSQL
    fetch(`${apiBase}/packages`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload?.data) && payload.data.length > 0) {
          const mapped: PackageItem[] = payload.data.map((p: any, idx: number) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            quotaKg: p.quota_kg,
            price: p.price,
            days: p.validity_days,
            savings: idx === 0 ? 'Hemat 20%' : idx === 1 ? 'Hemat 28%' : 'Hemat 35%',
            popular: p.code === 'KELUARGA-50' || idx === 1,
            features:
              DEFAULT_PACKAGES.find((d) => d.code === p.code)?.features ||
              DEFAULT_PACKAGES[idx % DEFAULT_PACKAGES.length].features,
          }));
          setPackages(mapped);
        }
      })
      .catch(() => {});

    // 2. Fetch real customer quota & active package
    fetch(`${apiBase}/customer/hub`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && payload?.data?.customer) {
          const c = payload.data.customer;
          if (typeof c.remaining_quota_kg === 'number') setActiveQuota(c.remaining_quota_kg);
          if (c.package?.name) setActivePackageName(c.package.name);
          if (typeof c.loyalty_points === 'number') setLoyaltyPoints(c.loyalty_points);
        }
      })
      .catch(() => {});

    // 3. Fetch customer's claimed vouchers
    fetch(`${apiBase}/customer/vouchers`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && payload?.data?.claimed_vouchers) {
          setClaimedVouchers(payload.data.claimed_vouchers);
        }
      })
      .catch(() => {});
  }, []);

  const handleValidatePkgVoucher = async (code: string, pkg: PackageItem) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setAppliedDiscount(0);
      setAppliedVoucherCode('');
      setVoucherFeedback(null);
      return;
    }

    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${apiBase}/customer/vouchers/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          code: clean,
          category: 'paket',
          subtotal: pkg.price,
          weight_kg: pkg.quotaKg,
        }),
      });
      const payload = await res.json();
      if (res.ok && payload?.success && payload?.data?.valid) {
        setAppliedDiscount(payload.data.discount_amount);
        setAppliedVoucherCode(payload.data.voucher.code);
        setVoucherFeedback({
          type: 'success',
          text: `Voucher ${payload.data.voucher.code} aktif! Potongan Rp ${payload.data.discount_amount.toLocaleString('id-ID')}`,
        });
      } else {
        setAppliedDiscount(0);
        setAppliedVoucherCode('');
        setVoucherFeedback({
          type: 'error',
          text: payload?.message || 'Voucher tidak berlaku untuk paket ini.',
        });
      }
    } catch {
      setVoucherFeedback({
        type: 'error',
        text: 'Gagal memvalidasi kode voucher.',
      });
    }
  };

  const handleOpenPackageModal = (pkg: PackageItem) => {
    setSelectedPkg(pkg);
    setAppliedDiscount(0);
    setAppliedVoucherCode('');
    setVoucherFeedback(null);
    if (voucherCodeInput.trim()) {
      handleValidatePkgVoucher(voucherCodeInput, pkg);
    }
  };

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
          voucher_code: appliedVoucherCode,
        }),
      });
      const payload = await response.json();
      if (response.ok && payload?.success && payload?.data) {
        setActiveQuota(payload.data.remaining_quota_kg);
        setActivePackageName(selectedPkg.name);
        if (payload.data.loyalty_points) setLoyaltyPoints(payload.data.loyalty_points);
        const discNote =
          payload.data.discount > 0
            ? ` (Hemat Rp ${payload.data.discount.toLocaleString('id-ID')} dengan voucher ${payload.data.voucher_code})`
            : '';
        setBuySuccessMsg(
          `${selectedPkg.name} (+${selectedPkg.quotaKg} Kg) berhasil ditambahkan ke saldo kuota Anda!${discNote} (+100 Kucek Poin)`
        );
      } else {
        setActiveQuota((prev) => prev + selectedPkg.quotaKg);
        setBuySuccessMsg(
          `${selectedPkg.name} (+${selectedPkg.quotaKg} Kg) berhasil ditambahkan ke saldo kuota Anda!`
        );
      }
    } finally {
      setIsBuying(false);
      setSelectedPkg(null);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-[1280px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-black text-[#111827] tracking-tight">
              Paket & Kuota Langganan
            </h1>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              Top-up kuota kiloan lebih hemat hingga 35% dengan fasilitas gratis antar-jemput & dukungan kode voucher
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                  Kucek Poin
                </span>
                <span className="text-sm font-black text-[#111827]">
                  {loyaltyPoints} Poin
                </span>
              </div>
            </div>

            <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#0095FF]" />
              <div>
                <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                  Saldo Kuota ({activePackageName})
                </span>
                <span className="text-base font-black text-[#111827]">
                  {activeQuota.toFixed(2)} Kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Banner Link */}
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50/70 border border-sky-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0095FF] text-white flex items-center justify-center shrink-0">
              <TicketPercent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#111827]">
                Gunakan Kode Promo <span className="font-mono text-[#0095FF]">TOPUPHEMAT35</span> atau <span className="font-mono text-[#0095FF]">SULTAN50K</span>
              </p>
              <p className="text-[11px] text-[#64748B]">
                Dapatkan potongan langsung hingga Rp 50.000 saat aktivasi paket langganan via QRIS.
              </p>
            </div>
          </div>
          <Link
            to="/app/voucher"
            className="px-3.5 py-2 rounded-xl bg-white border border-sky-200 text-[#0095FF] text-xs font-extrabold hover:bg-sky-50 transition shrink-0 self-start sm:self-auto"
          >
            Lihat Dompet Voucher
          </Link>
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
              className={`bg-white p-6 rounded-3xl border transition flex flex-col justify-between ${
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
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5">
                  Setara Rp {Math.round(pkg.price / pkg.quotaKg).toLocaleString('id-ID')} / Kg
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
                onClick={() => handleOpenPackageModal(pkg)}
                className="mt-6 w-full py-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)] transition cursor-pointer"
              >
                Aktifkan Paket via QRIS
              </button>
            </div>
          ))}
        </div>

        {/* QRIS Checkout Modal with Real Voucher Integration */}
        {selectedPkg && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10.5px] font-extrabold text-[#0095FF] uppercase tracking-wider">
                    Checkout & Pembayaran QRIS
                  </span>
                  <h3 className="font-black text-[#111827] text-base">
                    {selectedPkg.name} (+{selectedPkg.quotaKg} Kg)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPkg(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Voucher Input in Checkout Modal */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <label className="block text-[11px] font-extrabold text-[#111827]">
                  Punya Voucher Paket Langganan?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: TOPUPHEMAT35 / SULTAN50K"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold uppercase text-[#111827] focus:outline-none focus:border-[#0095FF]"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidatePkgVoucher(voucherCodeInput, selectedPkg)}
                    className="px-3.5 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>

                {/* Quick pills for package vouchers */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['TOPUPHEMAT35', 'SULTAN50K', ...claimedVouchers.map((c) => c.voucher.code)]
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .slice(0, 4)
                    .map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setVoucherCodeInput(code);
                          handleValidatePkgVoucher(code, selectedPkg);
                        }}
                        className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[#0095FF] font-mono text-[10px] font-extrabold cursor-pointer hover:bg-sky-100"
                      >
                        {code}
                      </button>
                    ))}
                </div>

                {voucherFeedback && (
                  <p
                    className={`text-[11px] font-bold ${
                      voucherFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {voucherFeedback.text}
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="space-y-1.5 text-xs px-1">
                <div className="flex justify-between text-[#64748B]">
                  <span>Harga Paket ({selectedPkg.quotaKg} Kg):</span>
                  <span className="font-bold text-[#111827]">
                    Rp {selectedPkg.price.toLocaleString('id-ID')}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold">
                    <span>Diskon Voucher ({appliedVoucherCode}):</span>
                    <span>- Rp {appliedDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-[#111827] pt-1.5 border-t border-slate-100">
                  <span>Total Bayar QRIS:</span>
                  <span className="text-lg text-[#0095FF]">
                    Rp {Math.max(0, selectedPkg.price - appliedDiscount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="w-44 h-44 bg-[#F5F7FA] rounded-2xl mx-auto flex items-center justify-center border border-slate-200">
                <QrCode className="w-28 h-28 text-[#111827]" />
              </div>

              <p className="text-[11px] text-center text-[#64748B]">
                Pindai QRIS menggunakan M-Banking, GoPay, OVO, DANA, atau ShopeePay.
              </p>

              <div className="flex items-center gap-2 pt-1">
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
                  className="flex-1 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
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
