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
      // Tetap gunakan data state awal jika server offline
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
        return { label: 'Cuci Kiloan', icon: Truck, color: 'text-[#0095FF] bg-sky-50' };
      case 'satuan':
        return { label: 'Dry Clean & Satuan', icon: Shirt, color: 'text-emerald-700 bg-emerald-50' };
      case 'paket':
        return { label: 'Paket Kuota', icon: Layers, color: 'text-purple-700 bg-purple-50' };
      default:
        return { label: 'Semua Layanan', icon: Sparkles, color: 'text-amber-700 bg-amber-50' };
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

  return (
    <CustomerLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Page Title & Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Member Privileges
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-extrabold text-[#0095FF]">
                Kucek Rewards Center
              </span>
            </div>
            <h1 className="text-[23px] font-black text-[#111827] tracking-tight">
              Voucher & Promo Member
            </h1>
            <p className="text-[13px] text-[#64748B] font-medium mt-0.5">
              Gunakan kupon potongan harga langsung saat pesan penjemputan atau aktivasi paket kuota.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/pesan-jemput')}
              className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold shadow-[0_4px_14px_rgba(0,149,255,0.35)] transition cursor-pointer"
            >
              Pesan Jemput Sekarang
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackBanner && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold transition shadow-xs ${
              feedbackBanner.type === 'success'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-800'
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
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Clean Bento Header: Redeem Promo Card (7 Cols) + Member Loyalty Card (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card 1: Tukar Kode Promo (Clean White Card with Subtle Accent) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] text-[#0095FF] flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-[15px] font-extrabold text-[#111827] tracking-tight">
                    Tukarkan Kode Voucher Promo
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Punya kode kupon khusus? Masukkan di sini untuk langsung masuk ke dompet Anda.
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!promoCodeInput.trim()) return;
                  handleClaimVoucher({ code: promoCodeInput });
                }}
                className="mt-4 flex gap-2"
              >
                <div className="relative flex-1">
                  <TicketPercent className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: TOPUPHEMAT35 atau KUCEKVIP..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono font-bold tracking-wider uppercase text-[#111827] focus:bg-white focus:outline-none focus:border-[#0095FF] transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isClaiming || !promoCodeInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-slate-800 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isClaiming ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Klaim Kode</span>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Chips */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-semibold text-[#94A3B8]">Kode Spesial Hari Ini:</span>
              {['TOPUPHEMAT35', 'SULTAN50K', 'KUCEKHEMAT20'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setPromoCodeInput(chip)}
                  className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] hover:bg-slate-200 text-[#475569] font-mono text-[10.5px] font-bold transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Loyalty Tier & Total Penghematan (Clean White Card) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                    Kucek Poin Member
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
                className="px-3.5 py-1.5 rounded-xl border border-amber-300 text-amber-700 hover:bg-amber-50 text-[11px] font-bold transition cursor-pointer"
              >
                Tukar 100 Poin
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100">
                <span className="text-[11px] font-medium text-[#64748B] block">
                  Voucher Aktif
                </span>
                <span className="text-lg font-black text-[#0095FF]">
                  {claimedVouchers.length} Kupon
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F0FDF4] border border-emerald-100">
                <span className="text-[11px] font-medium text-emerald-800 block">
                  Total Terhemat
                </span>
                <span className="text-lg font-black text-emerald-700">
                  Rp {stats.total_saved_rp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Segmented Tab & Filter Controls */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 bg-[#F5F7FA] p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Dompet Saya ({claimedVouchers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Katalog Promo ({catalogVouchers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Riwayat Terpakai ({usedVouchers.length})
            </button>
          </div>

          {/* Filter Chips & Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
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
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#F5F7FA] text-[#64748B] hover:bg-slate-200'
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
                className="pl-8 pr-3 py-1 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-[#111827] focus:outline-none focus:border-[#0095FF] w-32 sm:w-40"
              />
            </div>
          </div>
        </div>

        {/* Refined Voucher Cards List (Clean, Professional, Non-Clunky) */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <Loader2 className="w-6 h-6 text-[#0095FF] animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#64748B]">Memuat daftar voucher...</p>
          </div>
        ) : activeTab === 'wallet' ? (
          filteredWallet.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
              <TicketPercent className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <h3 className="text-sm font-bold text-[#111827]">
                Belum Ada Voucher di Dompet Anda
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Klaim voucher gratis dari tab Katalog Promo atau masukkan kode kupon spesial.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className="px-4 py-2 rounded-xl bg-[#0095FF] text-white text-xs font-bold cursor-pointer"
              >
                Buka Katalog Promo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWallet.map((claim) => {
                const v = claim.voucher;
                const catMeta = getCategoryMeta(v.category);
                const isPercent = v.discount_type === 'percent';

                return (
                  <div
                    key={claim.id}
                    className="bg-white rounded-2xl border border-slate-100 hover:border-[#0095FF]/60 hover:shadow-[0_8px_24px_-6px_rgba(0,149,255,0.12)] transition-all p-5 flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top Row: Category Pill & Copy Code */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${catMeta.color}`}
                        >
                          {catMeta.label}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-extrabold text-[#111827] bg-[#F5F7FA] px-2.5 py-0.5 rounded-md border border-slate-200">
                            {v.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(v.code)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Salin Kode"
                          >
                            {copiedCode === v.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Main Discount Headline */}
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span className="text-2xl font-black text-[#111827] tracking-tight">
                          {isPercent ? `${v.discount_value}% OFF` : `Potongan Rp ${(v.discount_value / 1000).toFixed(0)}rb`}
                        </span>
                        {v.max_discount > 0 && isPercent && (
                          <span className="text-[11px] text-[#94A3B8] font-semibold">
                            (Maks. Rp {(v.max_discount / 1000).toFixed(0)}rb)
                          </span>
                        )}
                      </div>

                      <h3 className="text-[13.5px] font-bold text-[#111827] leading-snug">
                        {v.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        {v.description}
                      </p>

                      {/* Terms meta */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#94A3B8]">
                        {v.min_weight_kg > 0 && <span>Min. {v.min_weight_kg} Kg</span>}
                        {v.min_order_value > 0 && (
                          <span>Min. Rp {v.min_order_value.toLocaleString('id-ID')}</span>
                        )}
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" />
                          Berlaku s/d {new Date(v.valid_until).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTermsVoucher(v)}
                        className="text-[11px] font-bold text-[#64748B] hover:text-[#111827] flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>S&K Lengkap</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUseVoucherNow(v)}
                        className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Gunakan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === 'catalog' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCatalog.map((v) => {
              const catMeta = getCategoryMeta(v.category);
              const isPercent = v.discount_type === 'percent';
              const isClaimed = v.is_claimed && v.claimed_status === 'claimed';
              const quotaPct = Math.min(100, Math.round((v.used_count / (v.total_quota || 100)) * 100));

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${catMeta.color}`}
                      >
                        {catMeta.label}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#111827] bg-[#F5F7FA] px-2.5 py-0.5 rounded-md">
                        {v.code}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-2xl font-black text-[#111827] tracking-tight">
                        {isPercent ? `${v.discount_value}% OFF` : `Potongan Rp ${(v.discount_value / 1000).toFixed(0)}rb`}
                      </span>
                      {v.max_discount > 0 && isPercent && (
                        <span className="text-[11px] text-[#94A3B8] font-semibold">
                          (Maks. Rp {(v.max_discount / 1000).toFixed(0)}rb)
                        </span>
                      )}
                    </div>

                    <h3 className="text-[13.5px] font-bold text-[#111827] leading-snug">
                      {v.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {v.description}
                    </p>

                    {/* Subtle Quota Indicator */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10.5px] font-medium text-[#94A3B8] mb-1">
                        <span>Kuota Terpakai</span>
                        <span>{v.used_count} dari {v.total_quota} kupon</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0095FF] rounded-full"
                          style={{ width: `${quotaPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTermsVoucher(v)}
                      className="text-[11px] font-bold text-[#64748B] hover:text-[#111827] flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>S&K</span>
                    </button>

                    {isClaimed ? (
                      <button
                        type="button"
                        onClick={() => handleUseVoucherNow(v)}
                        className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
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
                        + Simpan ke Dompet
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Tab 3: Riwayat Terpakai */
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm font-bold text-[#111827]">
                  Belum Ada Voucher yang Pernah Digunakan
                </p>
                <p className="text-xs text-[#64748B]">
                  Voucher yang digunakan saat transaksi cuci akan otomatis tercatat di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#111827] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.voucher.code}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Hemat Rp {(item.saved_amount || item.voucher.discount_value).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#111827] mt-1">
                        {item.voucher.title}
                      </p>
                      <p className="text-[11px] text-[#94A3B8]">
                        Digunakan pada Pesanan: <b className="text-slate-700">#{item.used_order_number || 'KCK-2026-004'}</b>
                      </p>
                    </div>

                    {item.used_order_number && !item.used_order_number.startsWith('PKG-') && (
                      <button
                        type="button"
                        onClick={() => navigate(`/app/lacak/${item.used_order_number}`)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0095FF] transition cursor-pointer self-start sm:self-auto"
                      >
                        Lihat Resi
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal S&K */}
        {selectedTermsVoucher && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#0095FF] tracking-wider">
                    Ketentuan Voucher
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
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
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
                  className="flex-1 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white font-bold text-xs cursor-pointer"
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
