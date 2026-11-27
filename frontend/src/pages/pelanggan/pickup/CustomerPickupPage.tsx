import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Scale,
  Calendar,
  Loader2,
  TicketPercent,
  Layers,
  Receipt,
  X,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';
import type { CustomerVoucherClaim, VoucherItem } from '../voucher/CustomerVoucherPage';

const SERVICE_OPTIONS: SelectOption[] = [
  {
    value: 'kiloan',
    label: 'Cuci Setrika Kiloan Reguler',
    description: 'Pencucian higienis 1 mesin 1 pelanggan + setrika uap rapi (Rp 8.000 / Kg)',
    badge: 'Rp 8.000/Kg',
  },
  {
    value: 'express',
    label: 'Cuci Setrika Express 24 Jam',
    description: 'Selesai 24 jam dengan prioritas mesin & antar-jemput ekspres (Rp 12.000 / Kg)',
    badge: 'Express 24J',
  },
  {
    value: 'satuan',
    label: 'Dry Clean & Bed Cover Satuan',
    description: 'Treatment deep clean bed cover, jas, kebaya, dan sepatu (Rp 25.000 / Pcs)',
    badge: 'Satuan / Pcs',
  },
];

const PERFUME_OPTIONS: SelectOption[] = [
  {
    value: 'ocean_fresh',
    label: 'Ocean Fresh',
    description: 'Aroma segar semilir angin laut yang maskulin & tahan 14 hari',
    badge: 'Terfavorit',
  },
  {
    value: 'sakura_blossom',
    label: 'Sakura Blossom',
    description: 'Keharuman kelopak bunga sakura musim semi Jepang yang lembut & elegan',
    badge: 'Best Seller',
  },
  {
    value: 'vanilla_mist',
    label: 'Vanilla Mist',
    description: 'Aroma vanila manis lembut, hangat, dan menenangkan',
  },
  {
    value: 'lavender_calm',
    label: 'Lavender Calm',
    description: 'Essential oil relaksasi alami, sangat nyaman untuk sprei & selimut',
  },
];

export const CustomerPickupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialVoucherParam = searchParams.get('voucher') || '';

  const [pickupDate, setPickupDate] = useState('2026-11-28');
  const [address, setAddress] = useState(
    'Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta'
  );
  const [timeSlot, setTimeSlot] = useState('09:00 - 11:00 WIB (Gelombang Pagi)');
  const [serviceType, setServiceType] = useState('kiloan');
  const [weightKg, setWeightKg] = useState<number>(4.5);
  const [perfume, setPerfume] = useState('ocean_fresh');
  const [notes, setNotes] = useState('Kemeja putih mohon dipisah');

  // State data real pelanggan & voucher
  const [remainingQuotaKg, setRemainingQuotaKg] = useState<number>(15.5);
  const [useQuota, setUseQuota] = useState<boolean>(false);
  const [claimedVouchers, setClaimedVouchers] = useState<CustomerVoucherClaim[]>([]);
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>(initialVoucherParam);
  const [appliedVoucher, setAppliedVoucher] = useState<{
    voucher: VoucherItem;
    discountAmount: number;
  } | null>(null);
  const [voucherMsg, setVoucherMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderResult, setCreatedOrderResult] = useState<{
    orderNumber: string;
    subtotal: number;
    discount: number;
    totalAmount: number;
    voucherCode: string;
    quotaUsedKg: number;
    remainingQuotaKg: number;
  } | null>(null);

  const pricePerKg =
    serviceType === 'satuan' ? 25000 : serviceType === 'express' ? 12000 : 8000;
  const subtotal = Math.round(weightKg * pricePerKg);

  // Muat profil real & dompet voucher pelanggan
  useEffect(() => {
    const token = getAuthToken();
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

    fetch(`${apiBase}/customer/hub`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((payload) => {
        if (payload?.success && payload?.data?.customer) {
          const c = payload.data.customer;
          if (c.address) setAddress(c.address);
          if (typeof c.remaining_quota_kg === 'number') {
            setRemainingQuotaKg(c.remaining_quota_kg);
          }
          if (c.default_fragrance) setPerfume(c.default_fragrance);
        }
      })
      .catch(() => {});

    fetch(`${apiBase}/customer/vouchers`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((payload) => {
        if (payload?.success && payload?.data?.claimed_vouchers) {
          setClaimedVouchers(payload.data.claimed_vouchers);
        }
      })
      .catch(() => {});
  }, []);

  // Validasi voucher otomatis jika ada parameter ?voucher=... atau saat berat/layanan berubah
  const validateVoucherCode = async (codeToValidate: string, currentSubtotal: number, currentWeight: number, currentService: string) => {
    const cleanCode = codeToValidate.trim().toUpperCase();
    if (!cleanCode) {
      setAppliedVoucher(null);
      setVoucherMsg(null);
      return;
    }

    setIsValidatingVoucher(true);
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
          code: cleanCode,
          category: currentService === 'express' ? 'kiloan' : currentService,
          subtotal: currentSubtotal,
          weight_kg: currentWeight,
        }),
      });
      const payload = await res.json();
      if (res.ok && payload?.success && payload?.data?.valid) {
        setAppliedVoucher({
          voucher: payload.data.voucher,
          discountAmount: payload.data.discount_amount,
        });
        setUseQuota(false);
        setVoucherMsg({
          type: 'success',
          text: `${payload.message}: Hemat Rp ${payload.data.discount_amount.toLocaleString('id-ID')}`,
        });
      } else {
        setAppliedVoucher(null);
        setVoucherMsg({
          type: 'error',
          text: payload?.message || 'Voucher tidak memenuhi syarat untuk layanan/berat ini.',
        });
      }
    } catch {
      setVoucherMsg({
        type: 'error',
        text: 'Gagal memvalidasi voucher ke server.',
      });
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  useEffect(() => {
    if (initialVoucherParam) {
      validateVoucherCode(initialVoucherParam, subtotal, weightKg, serviceType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVoucherParam]);

  // Re-validate jika berat atau jenis layanan berubah saat voucher sedang aktif
  useEffect(() => {
    if (appliedVoucher) {
      validateVoucherCode(appliedVoucher.voucher.code, subtotal, weightKg, serviceType);
    }
    if (useQuota && (serviceType !== 'kiloan' || remainingQuotaKg < weightKg)) {
      setUseQuota(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightKg, serviceType]);

  const activeDiscount = useQuota
    ? subtotal
    : appliedVoucher
    ? appliedVoucher.discountAmount
    : 0;
  const finalTotal = Math.max(0, subtotal - activeDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${apiBase}/customer/book-pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          pickup_date: pickupDate,
          time_slot: timeSlot,
          address,
          service_type: serviceType,
          weight_kg: weightKg,
          fragrance: perfume,
          notes,
          voucher_code: !useQuota && appliedVoucher ? appliedVoucher.voucher.code : '',
          use_quota: useQuota,
        }),
      });

      const payload = await response.json();
      if (response.ok && payload?.success && payload?.data) {
        const d = payload.data;
        setCreatedOrderResult({
          orderNumber: d.order_number,
          subtotal: d.subtotal ?? subtotal,
          discount: d.discount ?? activeDiscount,
          totalAmount: d.total_amount ?? finalTotal,
          voucherCode: d.voucher_code || '',
          quotaUsedKg: d.quota_used_kg || 0,
          remainingQuotaKg: d.remaining_quota_kg ?? remainingQuotaKg,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrderResult) {
    return (
      <CustomerLayout>
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 text-center space-y-5 shadow-[0_8px_30px_-8px_rgba(15,23,42,0.08)]">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F8F3] text-[#10B981] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-xs font-extrabold">
            Resi Penjemputan Real-Time: #{createdOrderResult.orderNumber}
          </span>
          <h2 className="text-2xl font-black text-[#111827]">
            Jadwal Penjemputan Terkonfirmasi!
          </h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
            Kurir Raka Pratama akan menjemput cucian Anda di <b>{address}</b> pada{' '}
            <b>{pickupDate}</b> ({timeSlot}).
          </p>

          {/* Breakdown Nota Real */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 text-left space-y-2 text-xs">
            <div className="flex justify-between text-[#64748B]">
              <span>Estimasi Subtotal ({weightKg} Kg):</span>
              <span className="font-bold text-[#111827]">
                Rp {createdOrderResult.subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            {createdOrderResult.quotaUsedKg > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Potong Kuota Langganan ({createdOrderResult.quotaUsedKg} Kg):</span>
                <span>- Rp {createdOrderResult.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            {createdOrderResult.voucherCode && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Diskon Voucher ({createdOrderResult.voucherCode}):</span>
                <span>- Rp {createdOrderResult.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-[#111827]">
              <span>Total Tagihan:</span>
              <span className="text-[#0095FF]">
                Rp {createdOrderResult.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/app/lacak/${createdOrderResult.orderNumber}`)}
              className="px-6 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              Lacak Resi Sekarang
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/riwayat')}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Lihat di Pesanan Saya
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-[1280px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-black text-[#111827] tracking-tight">
              Pesan Penjemputan Kurir
            </h1>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              Pilih gelombang kurir, gunakan saldo kuota langganan atau voucher promo, dan pantau resi secara real-time.
            </p>
          </div>

          <Link
            to="/app/voucher"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 text-[#0095FF] hover:bg-sky-100 text-xs font-extrabold transition"
          >
            <TicketPercent className="w-4 h-4" />
            <span>{claimedVouchers.length} Voucher Tersedia di Dompet</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Column (8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0095FF]" /> Tanggal Penjemputan
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#0095FF]" /> Estimasi Berat / Jumlah (Kg/Pcs)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0095FF]" /> Alamat Lengkap Penjemputan
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0095FF]" /> Gelombang Kurir Antar-Jemput
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  '09:00 - 11:00 WIB (Gelombang Pagi)',
                  '13:00 - 15:30 WIB (Gelombang Siang)',
                  '16:30 - 19:00 WIB (Gelombang Sore)',
                ].map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setTimeSlot(slot)}
                    className={`p-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                      timeSlot === slot
                        ? 'bg-[#0095FF] border-[#0095FF] text-white shadow-[0_6px_16px_-4px_rgba(0,149,255,0.4)]'
                        : 'bg-[#F5F7FA] border-transparent text-[#64748B] hover:bg-slate-200/70'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <CustomSelect
                  label="Kategori Layanan"
                  value={serviceType}
                  onChange={(val) => setServiceType(val)}
                  options={SERVICE_OPTIONS}
                  size="md"
                />
              </div>

              <div>
                <CustomSelect
                  label="Karakter Aroma Parfum"
                  value={perfume}
                  onChange={(val) => setPerfume(val)}
                  options={PERFUME_OPTIONS}
                  size="md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#111827] mb-2">
                Catatan Khusus Produksi & Kurir
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kemeja putih dipisah, pagar hitam samping minimarket"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
              />
            </div>
          </div>

          {/* Right Column: Voucher, Quota & Real-time Cost Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Card 1: Gunakan Kuota Langganan atau Voucher Promo */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                <TicketPercent className="w-4 h-4 text-[#0095FF]" />
                <span>Kuota & Voucher Promo</span>
              </h3>

              {/* Option A: Potong Saldo Kuota */}
              <div
                onClick={() => {
                  if (serviceType === 'kiloan' && remainingQuotaKg >= weightKg) {
                    const next = !useQuota;
                    setUseQuota(next);
                    if (next) {
                      setAppliedVoucher(null);
                      setVoucherMsg(null);
                    }
                  }
                }}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  useQuota
                    ? 'bg-[#E6F8F3] border-emerald-400'
                    : serviceType === 'kiloan' && remainingQuotaKg >= weightKg
                    ? 'bg-[#F8FAFC] border-slate-200 hover:border-[#0095FF]'
                    : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0095FF]" />
                    <span className="text-xs font-extrabold text-[#111827]">
                      Potong Saldo Kuota Paket
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={useQuota}
                    readOnly
                    disabled={serviceType !== 'kiloan' || remainingQuotaKg < weightKg}
                    className="accent-emerald-600 w-4 h-4"
                  />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  Sisa saldo kuota: <b>{remainingQuotaKg.toFixed(2)} Kg</b>{' '}
                  {serviceType !== 'kiloan' && '(Khusus Kiloan Reguler)'}
                </p>
              </div>

              {/* Option B: Pilih / Ketik Kode Voucher */}
              {!useQuota && (
                <div className="space-y-2.5 pt-1">
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    Gunakan Kode Voucher Diskon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      placeholder="Kode voucher..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#F5F7FA] border border-slate-200 text-xs font-mono font-bold uppercase text-[#111827] focus:outline-none focus:border-[#0095FF]"
                    />
                    <button
                      type="button"
                      disabled={isValidatingVoucher || !voucherCodeInput.trim()}
                      onClick={() =>
                        validateVoucherCode(voucherCodeInput, subtotal, weightKg, serviceType)
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#111827] hover:bg-slate-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      {isValidatingVoucher ? '...' : 'Pakai'}
                    </button>
                  </div>

                  {/* Quick Select Claimed Vouchers from Wallet */}
                  {claimedVouchers.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10.5px] font-semibold text-[#94A3B8] block">
                        Pilih dari Dompet Voucher Anda:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {claimedVouchers
                          .filter((cv) => cv.voucher.category !== 'paket')
                          .map((cv) => {
                            const isSelected =
                              appliedVoucher?.voucher.code === cv.voucher.code;
                            return (
                              <button
                                key={cv.id}
                                type="button"
                                onClick={() => {
                                  setVoucherCodeInput(cv.voucher.code);
                                  validateVoucherCode(
                                    cv.voucher.code,
                                    subtotal,
                                    weightKg,
                                    serviceType
                                  );
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-extrabold border transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#0095FF] border-[#0095FF] text-white'
                                    : 'bg-sky-50/70 border-sky-200 text-[#0095FF] hover:bg-sky-100'
                                }`}
                              >
                                {cv.voucher.code}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {voucherMsg && (
                    <div
                      className={`p-2.5 rounded-xl text-[11px] font-bold flex items-center justify-between gap-2 ${
                        voucherMsg.type === 'success'
                          ? 'bg-[#E6F8F3] text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span>{voucherMsg.text}</span>
                      {appliedVoucher && (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedVoucher(null);
                            setVoucherCodeInput('');
                            setVoucherMsg(null);
                          }}
                          className="p-0.5 hover:bg-black/5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card 2: Ringkasan Estimasi Biaya Real-Time */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#0095FF]" />
                  <span>Ringkasan Estimasi Nota</span>
                </h3>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  +30 Poin
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Tarif Layanan:</span>
                  <span className="font-bold text-[#111827]">
                    Rp {pricePerKg.toLocaleString('id-ID')} / {serviceType === 'satuan' ? 'Pcs' : 'Kg'}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Estimasi Bobot / Jumlah:</span>
                  <span className="font-bold text-[#111827]">
                    {weightKg} {serviceType === 'satuan' ? 'Pcs' : 'Kg'}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Biaya Jemput-Antar Kurir:</span>
                  <span className="font-extrabold text-emerald-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal Cucian:</span>
                  <span className="font-bold text-[#111827]">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {activeDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold">
                    <span>
                      {useQuota
                        ? `Potong Kuota (${weightKg} Kg):`
                        : `Diskon (${appliedVoucher?.voucher.code}):`}
                    </span>
                    <span>- Rp {activeDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs font-extrabold text-[#111827]">
                    Estimasi Total Bayar:
                  </span>
                  <span className="text-xl font-black text-[#0095FF]">
                    Rp {finalTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs sm:text-sm shadow-[0_10px_22px_-6px_rgba(0,149,255,0.5)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menjadwalkan Kurir...</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Konfirmasi Jadwal Penjemputan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};
