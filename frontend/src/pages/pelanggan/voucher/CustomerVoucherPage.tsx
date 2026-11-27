import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { getAuthToken } from '../../../services/authService';
import {
  TicketPercent,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Gift,
  ArrowRight,
  Clock,
  Info,
  Search,
  Award,
  Truck,
  Shirt,
  Layers,
  Loader2,
  X,
  TrendingUp,
  Calculator,
} from 'lucide-react';

export interface VoucherItem {
  id: number;
  code: string;
  title: string;
  description: string;
  category: 'all' | 'kiloan' | 'satuan' | 'paket' | string;
  discount_type: 'percent' | 'fixed' | string;
  discount_value: number;
  max_discount: number;
  min_order_value: number;
  min_weight_kg: number;
  total_quota: number;
  used_count: number;
  badge_color: string;
  terms: string;
  valid_until: string;
  is_claimed?: boolean;
  claimed_status?: string;
}

export interface CustomerVoucherClaim {
  id: number;
  customer_id: number;
  voucher_id: number;
  voucher: VoucherItem;
  status: 'claimed' | 'used' | 'expired';
  claimed_at: string;
  used_at?: string;
  used_order_number?: string;
  saved_amount?: number;
}

export const CustomerVoucherPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'wallet' | 'catalog' | 'history'>('wallet');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [selectedTermsVoucher, setSelectedTermsVoucher] = useState<VoucherItem | null>(null);

  // Interactive Savings Simulator state
  const [simWeightKg, setSimWeightKg] = useState<number>(5);
  const [simService, setSimService] = useState<'kiloan' | 'satuan'>('kiloan');

  const [claimedVouchers, setClaimedVouchers] = useState<CustomerVoucherClaim[]>([]);
  const [catalogVouchers, setCatalogVouchers] = useState<VoucherItem[]>([]);
  const [usedVouchers, setUsedVouchers] = useState<CustomerVoucherClaim[]>([]);
  const [stats, setStats] = useState({
    active_count: 3,
    used_count: 1,
    total_saved_rp: 42000,
    loyalty_points: 320,
  });

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${apiBase}/customer/vouchers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const payload = await res.json();
      if (res.ok && payload?.success && payload?.data) {
        setClaimedVouchers(payload.data.claimed_vouchers || []);
        setCatalogVouchers(payload.data.catalog_vouchers || []);
        setUsedVouchers(payload.data.used_vouchers || []);
        if (payload.data.stats) {
          setStats(payload.data.stats);
        }
      }
    } catch {
      // Gunakan fallback state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleClaimVoucher = async (opts: { code?: string; voucherId?: number }) => {
    setIsClaiming(true);
    setFeedbackBanner(null);
    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${apiBase}/customer/vouchers/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          code: opts.code || '',
          voucher_id: opts.voucherId || 0,
        }),
      });
      const payload = await res.json();
      if (res.ok && payload?.success) {
        setFeedbackBanner({
          type: 'success',
          message: payload.message || 'Voucher berhasil ditambahkan ke Dompet Voucher Anda!',
        });
        setPromoCodeInput('');
        await fetchVouchers();
        setActiveTab('wallet');
      } else {
        setFeedbackBanner({
          type: 'error',
          message: payload?.message || 'Gagal mengklaim kode voucher.',
        });
      }
    } catch {
      setFeedbackBanner({
        type: 'error',
        message: 'Terjadi kesalahan koneksi saat mengklaim voucher.',
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRedeemLoyaltyPoints = async () => {
    if (stats.loyalty_points < 100) {
      setFeedbackBanner({
        type: 'error',
        message: 'Poin Anda belum mencukupi (minimal 100 Kucek Poin).',
      });
      return;
    }
    const randomCode = `KUCEKPOIN${Math.floor(10 + Math.random() * 89)}`;
    await handleClaimVoucher({ code: randomCode });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleUseVoucherNow = (v: VoucherItem) => {
    if (v.category === 'paket') {
      navigate(`/app/beli-paket?voucher=${encodeURIComponent(v.code)}`);
    } else {
      navigate(`/app/pesan-jemput?voucher=${encodeURIComponent(v.code)}`);
    }
  };

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'kiloan':
        return {
          label: 'Cuci Kiloan',
          icon: Truck,
          pillClass: 'text-[#0095FF] bg-sky-50 border-sky-100',
          boxClass: 'bg-[#F0F7FF] text-[#0095FF] border-sky-100',
        };
      case 'satuan':
        return {
          label: 'Dry Clean & Satuan',
          icon: Shirt,
          pillClass: 'text-[#10B981] bg-[#E6F8F3] border-emerald-100',
          boxClass: 'bg-[#E6F8F3] text-[#10B981] border-emerald-100',
        };
      case 'paket':
        return {
          label: 'Paket Kuota',
          icon: Layers,
          pillClass: 'text-purple-700 bg-purple-50 border-purple-100',
          boxClass: 'bg-purple-50 text-purple-600 border-purple-100',
        };
      default:
        return {
          label: 'Semua Layanan',
          icon: Sparkles,
          pillClass: 'text-amber-700 bg-[#FEF6E0] border-amber-100',
          boxClass: 'bg-[#FEF6E0] text-amber-600 border-amber-100',
        };
    }
  };

  const filterVoucherItem = (v: VoucherItem) => {
    if (categoryFilter !== 'all' && v.category !== categoryFilter && v.category !== 'all') {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        v.code.toLowerCase().includes(q) ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }
    return true;
  };

  const filteredWallet = claimedVouchers.filter((cv) => filterVoucherItem(cv.voucher));
  const filteredCatalog = catalogVouchers.filter((v) => filterVoucherItem(v));
  const filteredHistory = usedVouchers.filter((cv) => filterVoucherItem(cv.voucher));

  // Simulator calculation
  const simBasePrice = simService === 'kiloan' ? simWeightKg * 8000 : simWeightKg * 25000;
  const simBestVoucher =
    simService === 'kiloan'
      ? { code: 'KUCEKHEMAT20', discount: Math.min(25000, Math.round(simBasePrice * 0.2)) }
      : { code: 'BEDCOVER30', discount: Math.min(40000, Math.round(simBasePrice * 0.3)) };

  return (
    <CustomerLayout>
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* Page Heading (TechBomb Consistent) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
              Voucher & Promo
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              Kelola kupon aktif, klaim promo katalog, dan tukarkan Kucek Loyalty Poin Anda
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/app/pesan-jemput')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)] transition cursor-pointer self-start sm:self-auto"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Gunakan untuk Pesan Jemput</span>
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackBanner && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold transition shadow-2xs ${
              feedbackBanner.type === 'success'
                ? 'bg-[#E6F8F3] border-emerald-200 text-[#065F46]'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  feedbackBanner.type === 'success' ? 'text-[#10B981]' : 'text-rose-600'
                }`}
              />
              <span>{feedbackBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ROW 1: 3 TechBomb KPI Cards (Consistent with Dashboard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* KPI 1: Voucher Aktif */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[132px]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#94A3B8]">
                Voucher Aktif Siap Pakai
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#F0F7FF] text-[#0095FF] flex items-center justify-center">
                <TicketPercent className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                {claimedVouchers.length} Kupon
              </span>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-[#0095FF] text-[10.5px] font-extrabold">
                  Dompet Aktif
                </span>
                <p className="text-[10px] font-medium text-[#CBD5E1] mt-1">
                  Otomatis potong tagihan nota
                </p>
              </div>
            </div>
          </div>

          {/* KPI 2: Total Penghematan Promo */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[132px]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#94A3B8]">
                Total Penghematan Promo
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#E6F8F3] text-[#10B981] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                Rp {stats.total_saved_rp.toLocaleString('id-ID')}
              </span>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E6F8F3] text-[#10B981] text-[10.5px] font-extrabold">
                  <TrendingUp className="w-3 h-3" />
                  18.9% Hemat
                </span>
                <p className="text-[10px] font-medium text-[#CBD5E1] mt-1">
                  Dari {usedVouchers.length} transaksi berpromo
                </p>
              </div>
            </div>
          </div>

          {/* KPI 3: Kucek Loyalty Poin */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[132px] sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#94A3B8]">
                Saldo Kucek Loyalty Poin
              </span>
              <button
                type="button"
                onClick={handleRedeemLoyaltyPoints}
                disabled={isClaiming}
                className="px-2.5 py-1 rounded-lg bg-[#FEF6E0] hover:bg-amber-100 text-amber-700 text-[10.5px] font-extrabold transition cursor-pointer"
              >
                Tukar 100 Poin → Voucher
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                {stats.loyalty_points} Poin
              </span>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF6E0] text-amber-700 text-[10.5px] font-extrabold">
                  <Award className="w-3 h-3" />
                  Gold Member
                </span>
                <p className="text-[10px] font-medium text-[#CBD5E1] mt-1">
                  +30 poin setiap pesan jemput
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Unified Toolbar (Segmented Tabs + Category Pills + Search) */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'wallet' as const, label: 'Dompet Saya', count: claimedVouchers.length },
              { id: 'catalog' as const, label: 'Katalog Promo', count: catalogVouchers.length },
              { id: 'history' as const, label: 'Riwayat Terpakai', count: usedVouchers.length },
            ].map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#0095FF] text-white shadow-[0_4px_12px_-2px_rgba(0,149,255,0.4)]'
                      : 'text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Filters & Search */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'kiloan', label: 'Kiloan' },
                { id: 'satuan', label: 'Satuan' },
                { id: 'paket', label: 'Paket Kuota' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[#111827] text-white'
                      : 'bg-[#F5F7FA] text-[#64748B] hover:bg-slate-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:flex-initial min-w-[150px]">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode / promo..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF]/40 focus:bg-white text-xs font-medium text-[#111827] focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* ROW 3: Bento Grid (8 Cols Voucher List + 4 Cols Redeem & Savings Calculator) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left 8 Cols: Voucher List */}
          <div className="lg:col-span-8 space-y-4">
            {isLoading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                <Loader2 className="w-6 h-6 text-[#0095FF] animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#64748B]">
                  Memuat daftar voucher pelanggan...
                </p>
              </div>
            ) : activeTab === 'wallet' ? (
              filteredWallet.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
                  <TicketPercent className="w-8 h-8 text-[#94A3B8] mx-auto" />
                  <h3 className="text-sm font-bold text-[#111827]">
                    Belum Ada Voucher di Kategori Ini
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Klaim kupon gratis dari tab Katalog Promo atau masukkan kode promo di panel sebelah kanan.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="px-4 py-2 rounded-xl bg-[#0095FF] text-white text-xs font-bold cursor-pointer"
                  >
                    Jelajahi Katalog Promo
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredWallet.map((claim) => {
                    const v = claim.voucher;
                    const catMeta = getCategoryMeta(v.category);
                    const CatIcon = catMeta.icon;
                    const isPercent = v.discount_type === 'percent';

                    return (
                      <div
                        key={claim.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] hover:border-[#0095FF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                          {/* Left Visual Icon Badge */}
                          <div
                            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${catMeta.boxClass}`}
                          >
                            <CatIcon className="w-5 h-5" />
                            <span className="text-[10px] font-black mt-0.5">
                              {isPercent
                                ? `${v.discount_value}%`
                                : `${Math.round(v.discount_value / 1000)}RB`}
                            </span>
                          </div>

                          {/* Middle Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${catMeta.pillClass}`}
                              >
                                {catMeta.label}
                              </span>
                              <span className="text-[11px] font-semibold text-[#10B981] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Aktif s/d{' '}
                                {new Date(v.valid_until).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-[15px] font-extrabold text-[#111827] group-hover:text-[#0095FF] transition leading-snug">
                              {v.title}
                            </h3>
                            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                              {v.description}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-[#94A3B8] font-medium">
                              {v.min_weight_kg > 0 && <span>• Min. {v.min_weight_kg} Kg</span>}
                              {v.min_order_value > 0 && (
                                <span>• Min. Rp {v.min_order_value.toLocaleString('id-ID')}</span>
                              )}
                              {v.max_discount > 0 && isPercent && (
                                <span>
                                  • Maks. potongan Rp {v.max_discount.toLocaleString('id-ID')}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedTermsVoucher(v)}
                                className="text-[#0095FF] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Info className="w-3 h-3" />
                                <span>Detail S&K</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right Action Zone */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(v.code)}
                            title="Salin Kode Voucher"
                            className="px-2.5 py-1 rounded-lg bg-[#F5F7FA] hover:bg-slate-200/80 border border-dashed border-slate-300 text-[#111827] font-mono text-xs font-extrabold inline-flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <span>{v.code}</span>
                            {copiedCode === v.code ? (
                              <Check className="w-3.5 h-3.5 text-[#10B981]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUseVoucherNow(v)}
                            className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold shadow-[0_6px_14px_-4px_rgba(0,149,255,0.45)] transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Pakai Voucher</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : activeTab === 'catalog' ? (
              <div className="space-y-3.5">
                {filteredCatalog.map((v) => {
                  const catMeta = getCategoryMeta(v.category);
                  const CatIcon = catMeta.icon;
                  const isPercent = v.discount_type === 'percent';
                  const isClaimed = v.is_claimed && v.claimed_status === 'claimed';
                  const quotaPct = Math.min(
                    100,
                    Math.round((v.used_count / (v.total_quota || 100)) * 100)
                  );

                  return (
                    <div
                      key={v.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] hover:border-[#0095FF]/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                        <div
                          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${catMeta.boxClass}`}
                        >
                          <CatIcon className="w-5 h-5" />
                          <span className="text-[10px] font-black mt-0.5">
                            {isPercent
                              ? `${v.discount_value}%`
                              : `${Math.round(v.discount_value / 1000)}RB`}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${catMeta.pillClass}`}
                            >
                              {catMeta.label}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#64748B] bg-[#F5F7FA] px-2 py-0.5 rounded">
                              {v.code}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-[15px] font-extrabold text-[#111827] leading-snug">
                            {v.title}
                          </h3>
                          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                            {v.description}
                          </p>

                          {/* Quota Bar */}
                          <div className="mt-2.5 max-w-xs">
                            <div className="flex justify-between text-[10px] font-semibold text-[#94A3B8] mb-1">
                              <span>Kuota Promo Terklaim</span>
                              <span>
                                {v.used_count}/{v.total_quota} ({quotaPct}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#0095FF] rounded-full"
                                style={{ width: `${quotaPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedTermsVoucher(v)}
                          className="text-[11px] font-bold text-[#94A3B8] hover:text-[#111827] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Syarat & Ketentuan</span>
                        </button>

                        {isClaimed ? (
                          <button
                            type="button"
                            onClick={() => handleUseVoucherNow(v)}
                            className="px-4 py-2 rounded-xl bg-[#E6F8F3] text-[#10B981] hover:bg-emerald-100 text-xs font-extrabold transition inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tersimpan • Pakai</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isClaiming}
                            onClick={() => handleClaimVoucher({ voucherId: v.id })}
                            className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                          >
                            + Klaim ke Dompet
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Tab 3: Riwayat Terpakai */
              <div className="bg-white rounded-2xl border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] p-5">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-sm font-bold text-[#111827]">
                      Belum Ada Riwayat Voucher Terpakai
                    </p>
                    <p className="text-xs text-[#64748B]">
                      Voucher yang Anda gunakan saat Pesan Jemput atau Beli Paket akan tercatat di sini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-[#E6F8F3] text-[#10B981] flex items-center justify-center font-black text-[11px] shrink-0">
                            TERPAKAI
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-[#111827]">
                                {item.voucher.code}
                              </span>
                              <span className="text-[10.5px] font-extrabold text-[#10B981] bg-[#E6F8F3] px-2 py-0.5 rounded-md">
                                Hemat Rp{' '}
                                {(
                                  item.saved_amount || item.voucher.discount_value
                                ).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#111827] mt-0.5">
                              {item.voucher.title}
                            </p>
                            <p className="text-[11px] text-[#94A3B8]">
                              Resi Transaksi:{' '}
                              <b className="text-slate-700">
                                #{item.used_order_number || 'KCK-2026-004'}
                              </b>
                            </p>
                          </div>
                        </div>

                        {item.used_order_number &&
                          !item.used_order_number.startsWith('PKG-') && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/app/lacak/${item.used_order_number}`)
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0095FF] transition cursor-pointer self-start sm:self-auto"
                            >
                              Lacak Resi
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right 4 Cols: Redeem Promo Code Input + Interactive Savings Simulator */}
          <div className="lg:col-span-4 space-y-5">
            {/* Side Card 1: Klaim Kode Promo Kustom */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] text-[#0095FF] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111827]">
                    Klaim Kode Kupon Baru
                  </h2>
                  <p className="text-[11px] text-[#94A3B8]">
                    Masukkan kode promo dari mitra / broadcast WA
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!promoCodeInput.trim()) return;
                  handleClaimVoucher({ code: promoCodeInput });
                }}
                className="space-y-2.5"
              >
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  placeholder="Ketik kode (misal: TOPUPHEMAT35)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white text-xs font-mono font-bold uppercase text-[#111827] focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isClaiming || !promoCodeInput.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isClaiming ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Tukarkan Kode Promo</span>
                  )}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10.5px] font-semibold text-[#94A3B8] block mb-1.5">
                  Klik untuk isi kode populer:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['TOPUPHEMAT35', 'SULTAN50K', 'KUCEKVIP25'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setPromoCodeInput(chip)}
                      className="px-2.5 py-1 rounded-lg bg-[#F5F7FA] hover:bg-sky-50 hover:text-[#0095FF] text-[#475569] font-mono text-[10.5px] font-bold transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Card 2: Simulasi Kalkulator Penghematan Voucher */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E6F8F3] text-[#10B981] flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#111827]">
                    Simulasi Hemat Cucian
                  </h2>
                  <p className="text-[11px] text-[#94A3B8]">
                    Cek rekomendasi voucher terbaik otomatis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#F5F7FA] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSimService('kiloan')}
                  className={`py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    simService === 'kiloan'
                      ? 'bg-white text-[#111827] shadow-2xs'
                      : 'text-[#64748B]'
                  }`}
                >
                  Kiloan (Rp 8rb)
                </button>
                <button
                  type="button"
                  onClick={() => setSimService('satuan')}
                  className={`py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                    simService === 'satuan'
                      ? 'bg-white text-[#111827] shadow-2xs'
                      : 'text-[#64748B]'
                  }`}
                >
                  Satuan (Rp 25rb)
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#64748B]">
                    Estimasi {simService === 'kiloan' ? 'Berat Cucian' : 'Jumlah Pakaian'}:
                  </span>
                  <span className="text-[#0095FF] font-black">
                    {simWeightKg} {simService === 'kiloan' ? 'Kg' : 'Pcs'}
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={15}
                  step={1}
                  value={simWeightKg}
                  onChange={(e) => setSimWeightKg(Number(e.target.value))}
                  className="w-full accent-[#0095FF]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#64748B]">
                  <span>Tarif Normal:</span>
                  <span className="line-through">
                    Rp {simBasePrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[#10B981] font-extrabold">
                  <span>Potongan ({simBestVoucher.code}):</span>
                  <span>- Rp {simBestVoucher.discount.toLocaleString('id-ID')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/70 flex justify-between items-baseline">
                  <span className="font-bold text-[#111827]">Estimasi Bayar:</span>
                  <span className="text-base font-black text-[#0095FF]">
                    Rp {(simBasePrice - simBestVoucher.discount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/app/pesan-jemput?voucher=${simBestVoucher.code}`)
                }
                className="w-full py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Pesan dengan {simBestVoucher.code}
              </button>
            </div>
          </div>
        </div>

        {/* Modal S&K */}
        {selectedTermsVoucher && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#0095FF] tracking-wider">
                    Syarat & Ketentuan Promo
                  </span>
                  <h3 className="text-[15px] font-black text-[#111827]">
                    {selectedTermsVoucher.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTermsVoucher(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#475569]">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between">
                  <span className="text-[#64748B]">Kode Voucher:</span>
                  <span className="font-mono font-bold text-[#111827]">
                    {selectedTermsVoucher.code}
                  </span>
                </div>
                <p className="leading-relaxed">{selectedTermsVoucher.description}</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[#111827] font-medium leading-relaxed">
                  {selectedTermsVoucher.terms}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTermsVoucher(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const v = selectedTermsVoucher;
                    setSelectedTermsVoucher(null);
                    handleUseVoucherNow(v);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white font-bold text-xs cursor-pointer"
                >
                  Gunakan Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerVoucherPage;
