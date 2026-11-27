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
  TrendingUp,
  Layers,
  Truck,
  Shirt,
  Loader2,
  X,
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
      // Tetap gunakan state yang ada bila gagal jaringan
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
    const randomCode = `POINREWARD${Math.floor(10 + Math.random() * 89)}`;
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
        return { label: 'Cuci Kiloan', icon: Truck, badge: 'bg-sky-50 text-[#0095FF] border-sky-200' };
      case 'satuan':
        return { label: 'Dry Clean & Satuan', icon: Shirt, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'paket':
        return { label: 'Paket Kuota', icon: Layers, badge: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Semua Layanan', icon: Sparkles, badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const getLeftStubGradient = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'from-emerald-500 to-teal-600';
      case 'amber':
        return 'from-amber-500 to-orange-500';
      case 'purple':
        return 'from-purple-600 to-indigo-600';
      case 'rose':
        return 'from-rose-500 to-pink-600';
      default:
        return 'from-[#0095FF] to-[#0070CC]';
    }
  };

  const formatDiscountStub = (v: VoucherItem) => {
    if (v.discount_type === 'percent') {
      return {
        main: `${v.discount_value}%`,
        sub: 'DISKON',
      };
    }
    const inThousands = Math.round(v.discount_value / 1000);
    return {
      main: `Rp${inThousands}RB`,
      sub: 'POTONGAN',
    };
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

  return (
    <CustomerLayout>
      <div className="max-w-[1180px] mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0095FF] text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <TicketPercent className="w-3.5 h-3.5" />
              Kucek Rewards & Promo Center
            </div>
            <h1 className="text-[22px] sm:text-[25px] font-black text-[#111827] tracking-tight">
              Dompet Voucher & Promo Member
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748B] font-medium mt-0.5">
              Klaim voucher diskon cucian, tukarkan kode promo spesial, dan gunakan langsung saat pesan penjemputan atau beli paket.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/app/pesan-jemput')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <Truck className="w-4 h-4 text-[#0095FF]" />
            <span>Pesan Jemput Sekarang</span>
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackBanner && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold transition ${
              feedbackBanner.type === 'success'
                ? 'bg-[#E6F8F3] border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  feedbackBanner.type === 'success' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              />
              <span>{feedbackBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Bento Row: Redeem Promo Code Input (7 Cols) + Loyalty & Savings Summary (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Banner: Redeem Promo Code */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#0095FF] via-[#0080E6] to-[#0066CC] rounded-3xl p-6 sm:p-7 text-white shadow-[0_12px_28px_-8px_rgba(0,149,255,0.45)] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-100">
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Punya Kode Promo Khusus?</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
                Tukarkan Kode Voucher & Dapatkan Potongan Instan
              </h2>
              <p className="text-xs text-white/85 mt-1 max-w-lg leading-relaxed">
                Masukkan kode promo dari WhatsApp Broadcast, Instagram kucek.id, atau kupon member untuk langsung masuk ke Dompet Voucher Anda.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!promoCodeInput.trim()) return;
                handleClaimVoucher({ code: promoCodeInput });
              }}
              className="mt-5 flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <TicketPercent className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  placeholder="Ketik kode promo (misal: TOPUPHEMAT35 / KUCEKVIP)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-[#111827] placeholder:text-slate-400 text-xs font-extrabold tracking-wider uppercase focus:outline-none focus:ring-3 focus:ring-white/40 shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={isClaiming || !promoCodeInput.trim()}
                className="px-6 py-3 rounded-xl bg-[#111827] hover:bg-slate-900 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shrink-0 shadow-md"
              >
                {isClaiming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Klaim Kode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-white/75 font-semibold">Kode Populer:</span>
              {['TOPUPHEMAT35', 'SULTAN50K', 'KUCEKVIP25'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setPromoCodeInput(chip)}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-mono font-bold transition cursor-pointer border border-white/20"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Right Card: Dompet Stats & Loyalty Points */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                    Kucek Loyalty Poin
                  </span>
                  <span className="text-xl font-black text-[#111827]">
                    {stats.loyalty_points} Poin
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRedeemLoyaltyPoints}
                disabled={isClaiming}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] transition cursor-pointer shadow-xs"
              >
                Tukar 100 Poin → Voucher
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  Voucher Aktif Siap Pakai
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#0095FF]">
                    {claimedVouchers.length}
                  </span>
                  <span className="text-xs font-bold text-[#94A3B8]">Kupon</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E6F8F3]/60 border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-800 block">
                  Total Hemat dari Promo
                </span>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-lg font-black text-emerald-700">
                    Rp {stats.total_saved_rp.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] bg-slate-50 px-3.5 py-2.5 rounded-xl flex items-center justify-between">
              <span>Setiap transaksi cuci & klaim promo menambah Kucek Poin otomatis.</span>
              <span className="font-extrabold text-[#0095FF] shrink-0 ml-2">Tier: Gold</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* 3 Main Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-[#0095FF] text-white shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)]'
                  : 'bg-[#F5F7FA] text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Dompet Voucher Saya</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'wallet'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {claimedVouchers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[#0095FF] text-white shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)]'
                  : 'bg-[#F5F7FA] text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Katalog Promo Spesial</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'catalog'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {catalogVouchers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#0095FF] text-white shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)]'
                  : 'bg-[#F5F7FA] text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Riwayat Terpakai</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'history'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {usedVouchers.length}
              </span>
            </button>
          </div>

          {/* Category & Search Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'kiloan', label: 'Kiloan' },
              { id: 'satuan', label: 'Satuan & Bed Cover' },
              { id: 'paket', label: 'Paket Kuota' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#111827] text-white'
                    : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari voucher..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#0095FF] w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Voucher Ticket Cards Grid */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <Loader2 className="w-7 h-7 text-[#0095FF] animate-spin mx-auto mb-2" />
            <p className="text-xs font-bold text-[#64748B]">Memuat Dompet Voucher & Katalog Promo...</p>
          </div>
        ) : activeTab === 'wallet' ? (
          filteredWallet.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 space-y-3">
              <TicketPercent className="w-10 h-10 text-[#0095FF] mx-auto opacity-75" />
              <h3 className="text-base font-extrabold text-[#111827]">
                Belum Ada Voucher di Kategori Ini
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Klaim voucher gratis dari tab Katalog Promo Spesial atau masukkan kode kupon di bagian atas.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2.5 rounded-xl bg-[#0095FF] text-white text-xs font-bold cursor-pointer"
              >
                Lihat Katalog Promo Spesial
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredWallet.map((claim) => {
                const v = claim.voucher;
                const stub = formatDiscountStub(v);
                const catMeta = getCategoryMeta(v.category);
                const CatIcon = catMeta.icon;

                return (
                  <div
                    key={claim.id}
                    className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_18px_-6px_rgba(15,23,42,0.08)] hover:border-[#0095FF] transition flex overflow-hidden relative group"
                  >
                    {/* Left Perforated Ticket Stub */}
                    <div
                      className={`w-32 sm:w-36 bg-gradient-to-b ${getLeftStubGradient(
                        v.badge_color
                      )} text-white p-4 flex flex-col items-center justify-center text-center relative shrink-0`}
                    >
                      {/* Top & Bottom Ticket Cutout Notches */}
                      <div className="w-5 h-5 rounded-full bg-[#F6F8FB] absolute -top-2.5 -right-2.5 z-10 border border-slate-200/60" />
                      <div className="w-5 h-5 rounded-full bg-[#F6F8FB] absolute -bottom-2.5 -right-2.5 z-10 border border-slate-200/60" />

                      <CatIcon className="w-6 h-6 text-white/90 mb-1.5" />
                      <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                        {stub.main}
                      </span>
                      <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/80 mt-1">
                        {stub.sub}
                      </span>
                      {v.max_discount > 0 && v.discount_type === 'percent' && (
                        <span className="mt-2 px-2 py-0.5 rounded bg-black/20 text-[9.5px] font-bold">
                          S/d Rp{(v.max_discount / 1000).toFixed(0)}rb
                        </span>
                      )}
                    </div>

                    {/* Right Ticket Body */}
                    <div className="flex-1 p-5 flex flex-col justify-between border-l-2 border-dashed border-slate-200">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${catMeta.badge}`}
                          >
                            {catMeta.label}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-[#111827] font-mono text-[11px] font-black">
                              {v.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(v.code)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                              title="Salin Kode Voucher"
                            >
                              {copiedCode === v.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <h3 className="text-sm sm:text-[15px] font-extrabold text-[#111827] leading-snug">
                          {v.title}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                          {v.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#94A3B8] font-semibold">
                          {v.min_weight_kg > 0 && <span>• Min. {v.min_weight_kg} Kg</span>}
                          {v.min_order_value > 0 && (
                            <span>• Min. Rp {v.min_order_value.toLocaleString('id-ID')}</span>
                          )}
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Clock className="w-3 h-3" /> Aktif s/d{' '}
                            {new Date(v.valid_until).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTermsVoucher(v)}
                          className="text-[11px] font-bold text-[#64748B] hover:text-[#111827] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>S&K Berlaku</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUseVoucherNow(v)}
                          className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-extrabold shadow-[0_6px_14px_-4px_rgba(0,149,255,0.45)] transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Pakai Sekarang</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === 'catalog' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCatalog.map((v) => {
              const stub = formatDiscountStub(v);
              const catMeta = getCategoryMeta(v.category);
              const CatIcon = catMeta.icon;
              const quotaPct = Math.min(100, Math.round((v.used_count / (v.total_quota || 100)) * 100));
              const isAlreadyInWallet = v.is_claimed && v.claimed_status === 'claimed';

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_18px_-6px_rgba(15,23,42,0.08)] hover:border-[#0095FF] transition flex overflow-hidden relative"
                >
                  {/* Left Perforated Ticket Stub */}
                  <div
                    className={`w-32 sm:w-36 bg-gradient-to-b ${getLeftStubGradient(
                      v.badge_color
                    )} text-white p-4 flex flex-col items-center justify-center text-center relative shrink-0`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#F6F8FB] absolute -top-2.5 -right-2.5 z-10" />
                    <div className="w-5 h-5 rounded-full bg-[#F6F8FB] absolute -bottom-2.5 -right-2.5 z-10" />

                    <CatIcon className="w-6 h-6 text-white/90 mb-1.5" />
                    <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                      {stub.main}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/80 mt-1">
                      {stub.sub}
                    </span>
                  </div>

                  {/* Right Body */}
                  <div className="flex-1 p-5 flex flex-col justify-between border-l-2 border-dashed border-slate-200">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${catMeta.badge}`}
                        >
                          {catMeta.label}
                        </span>
                        <span className="font-mono text-[11px] font-black text-[#111827] bg-slate-100 px-2.5 py-0.5 rounded-md">
                          {v.code}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-[15px] font-extrabold text-[#111827]">
                        {v.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        {v.description}
                      </p>

                      {/* Quota Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[10.5px] font-bold text-[#64748B] mb-1">
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

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTermsVoucher(v)}
                        className="text-[11px] font-bold text-[#64748B] hover:text-[#111827] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Detail S&K</span>
                      </button>

                      {isAlreadyInWallet ? (
                        <button
                          type="button"
                          onClick={() => handleUseVoucherNow(v)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sudah Diklaim • Pakai</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isClaiming}
                          onClick={() => handleClaimVoucher({ voucherId: v.id })}
                          className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-extrabold shadow-[0_6px_14px_-4px_rgba(0,149,255,0.45)] transition cursor-pointer"
                        >
                          + Klaim ke Dompet
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 3: Riwayat Terpakai */
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] p-6">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm font-extrabold text-[#111827]">
                  Belum Ada Riwayat Voucher Terpakai
                </p>
                <p className="text-xs text-[#64748B]">
                  Voucher yang Anda gunakan saat Pesan Jemput atau Beli Paket akan tercatat otomatis di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                        LUNAS
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#111827]">
                            {item.voucher.code}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            Hemat Rp {(item.saved_amount || item.voucher.discount_value).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#475569] mt-0.5">
                          {item.voucher.title}
                        </p>
                        <p className="text-[11px] text-[#94A3B8]">
                          Digunakan pada Resi: <b className="text-[#111827]">#{item.used_order_number || 'KCK-2026-004'}</b>
                        </p>
                      </div>
                    </div>

                    {item.used_order_number && !item.used_order_number.startsWith('PKG-') && (
                      <button
                        type="button"
                        onClick={() => navigate(`/app/lacak/${item.used_order_number}`)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#111827] hover:border-[#0095FF] transition cursor-pointer self-start sm:self-auto"
                      >
                        Lihat Nota Resi
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Syarat & Ketentuan Voucher */}
        {selectedTermsVoucher && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#0095FF] tracking-wider">
                    Syarat & Ketentuan Promo
                  </span>
                  <h3 className="text-base font-black text-[#111827]">
                    {selectedTermsVoucher.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTermsVoucher(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-[#475569]">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-[#64748B]">Kode Promo:</span>
                  <span className="font-mono font-black text-[#111827]">
                    {selectedTermsVoucher.code}
                  </span>
                </div>
                <p className="leading-relaxed">{selectedTermsVoucher.description}</p>
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-sky-950 font-medium leading-relaxed">
                  {selectedTermsVoucher.terms}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
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
                  className="flex-1 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs cursor-pointer"
                >
                  Gunakan Voucher Ini
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
