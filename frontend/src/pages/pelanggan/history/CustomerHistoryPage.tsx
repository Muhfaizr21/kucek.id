import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import {
  ArrowRight,
  Search,
  QrCode,
  CheckCircle2,
  Loader2,
  TicketPercent,
  X,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface RealOrder {
  id: number;
  order_number: string;
  service_type: string;
  weight_kg: number;
  fragrance: string;
  subtotal: number;
  discount: number;
  voucher_code?: string;
  quota_used_kg?: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  notes: string;
  created_at: string;
}

export const CustomerHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unpaid' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [payingOrder, setPayingOrder] = useState<RealOrder | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [payFeedback, setPayFeedback] = useState<string | null>(null);

  const fetchMyOrders = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${apiBase}/customer/my-orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const payload = await res.json();
      if (res.ok && payload?.success && Array.isArray(payload?.data)) {
        setOrders(payload.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handlePayOrder = async () => {
    if (!payingOrder) return;
    setIsPaying(true);
    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const res = await fetch(`${apiBase}/customer/orders/${payingOrder.id}/pay`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      const payload = await res.json();
      if (res.ok && payload?.success) {
        setPayFeedback(
          payload.message || `Pembayaran resi #${payingOrder.order_number} berhasil dikonfirmasi Lunas!`
        );
        await fetchMyOrders();
      }
    } finally {
      setIsPaying(false);
      setPayingOrder(null);
    }
  };

  const formatServiceName = (ord: RealOrder) => {
    const scentMap: Record<string, string> = {
      ocean_fresh: 'Ocean Fresh',
      sakura_blossom: 'Sakura Blossom',
      vanilla_mist: 'Vanilla Mist',
      lavender_calm: 'Lavender Calm',
    };
    const scent = scentMap[ord.fragrance] || ord.fragrance || 'Ocean Fresh';
    if (ord.service_type === 'satuan') {
      return `Dry Clean & Satuan • ${scent}`;
    }
    if (ord.service_type === 'express') {
      return `Cuci Setrika Express 24 Jam • ${scent}`;
    }
    return `Cuci Setrika Kiloan • ${scent}`;
  };

  const getStatusBadge = (ord: RealOrder) => {
    if (ord.payment_status === 'unpaid') {
      return {
        label: 'Menunggu Bayar',
        color: 'text-rose-600 bg-rose-50 border border-rose-200',
      };
    }
    switch (ord.status) {
      case 'terima':
        return { label: 'Diterima / Dijemput', color: 'text-[#0095FF] bg-sky-50' };
      case 'cuci':
        return { label: 'Sedang Dicuci', color: 'text-[#0095FF] bg-sky-50' };
      case 'kering':
        return { label: 'Pengeringan 60°C', color: 'text-amber-700 bg-amber-50' };
      case 'setrika':
        return { label: 'Disetrika Uap', color: 'text-[#0095FF] bg-sky-50' };
      case 'packing':
        return { label: 'QC & Packing', color: 'text-purple-700 bg-purple-50' };
      case 'selesai':
        return { label: 'Selesai Diantar', color: 'text-[#10B981] bg-[#E6F8F3]' };
      default:
        return { label: 'Sedang Diproses', color: 'text-[#0095FF] bg-sky-50' };
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'active' && ord.status === 'selesai') return false;
    if (statusFilter === 'unpaid' && ord.payment_status !== 'unpaid') return false;
    if (statusFilter === 'completed' && ord.status !== 'selesai') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        ord.order_number.toLowerCase().includes(q) ||
        ord.service_type.toLowerCase().includes(q) ||
        (ord.notes && ord.notes.toLowerCase().includes(q)) ||
        (ord.voucher_code && ord.voucher_code.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <CustomerLayout>
      <div className="max-w-[1140px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-black text-[#111827] tracking-tight">
              Pesanan & Riwayat Cucian
            </h1>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              Data transaksi real-time dari database, pelunasan QRIS instan, dan arsip pemakaian voucher/kuota
            </p>
          </div>
          <Link
            to="/app/pesan-jemput"
            className="px-4 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)] transition"
          >
            + Pesan Jemput Baru
          </Link>
        </div>

        {payFeedback && (
          <div className="p-4 rounded-2xl bg-[#E6F8F3] border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{payFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setPayFeedback(null)}
              className="p-1 hover:bg-black/5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Tabs & Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `Semua (${orders.length})` },
              {
                id: 'active',
                label: `Diproses (${orders.filter((o) => o.status !== 'selesai').length})`,
              },
              {
                id: 'unpaid',
                label: `Menunggu Bayar (${orders.filter((o) => o.payment_status === 'unpaid').length})`,
              },
              {
                id: 'completed',
                label: `Selesai (${orders.filter((o) => o.status === 'selesai').length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#0095FF] text-white shadow-xs'
                    : 'bg-[#F5F7FA] text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari resi atau layanan..."
              className="pl-9 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#0095FF] w-full sm:w-56"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-6 h-6 text-[#0095FF] animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-[#64748B]">Memuat riwayat pesanan dari database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto p-6">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#CBD5E1] border-b border-slate-100">
                    <th className="pb-3 pr-3">Layanan & Catatan</th>
                    <th className="pb-3 px-3">No. Resi</th>
                    <th className="pb-3 px-3">Tanggal</th>
                    <th className="pb-3 px-3">Tagihan & Promo</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Bobot / Qty</th>
                    <th className="pb-3 pl-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredOrders.map((ord) => {
                    const badge = getStatusBadge(ord);
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 pr-3">
                          <p className="font-extrabold text-[#111827]">
                            {formatServiceName(ord)}
                          </p>
                          {ord.notes && (
                            <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5 truncate max-w-xs">
                              {ord.notes}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-3 font-mono font-bold text-[#64748B]">
                          #{ord.order_number}
                        </td>
                        <td className="py-4 px-3 font-semibold text-[#64748B]">
                          {new Date(ord.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-3">
                          {ord.payment_method === 'kuota_langganan' ||
                          (ord.quota_used_kg && ord.quota_used_kg > 0) ? (
                            <span className="font-extrabold text-emerald-700">
                              Potong Kuota ({ord.quota_used_kg || ord.weight_kg} Kg)
                            </span>
                          ) : (
                            <div>
                              <span className="font-extrabold text-[#111827]">
                                Rp {ord.total_amount.toLocaleString('id-ID')}
                              </span>
                              {ord.voucher_code && (
                                <span className="ml-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-50 text-[#0095FF] font-mono text-[10px] font-bold">
                                  <TicketPercent className="w-2.5 h-2.5" />
                                  {ord.voucher_code}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-extrabold text-[#111827]">
                          {ord.weight_kg.toFixed(2)} {ord.service_type === 'satuan' ? 'PCS' : 'KG'}
                        </td>
                        <td className="py-4 pl-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {ord.payment_status === 'unpaid' && (
                              <button
                                type="button"
                                onClick={() => setPayingOrder(ord)}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition cursor-pointer shadow-xs"
                              >
                                Bayar QRIS
                              </button>
                            )}
                            <Link
                              to={`/app/lacak/${ord.order_number}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#0095FF] hover:text-white text-[#64748B] font-bold text-[11px] transition"
                            >
                              <span>Lacak</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QRIS Payment Modal for Unpaid Order */}
        {payingOrder && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-100">
              <span className="text-[10.5px] font-extrabold text-[#0095FF] uppercase tracking-wider">
                Pelunasan Nota Cucian QRIS
              </span>
              <h3 className="font-black text-[#111827] text-base">
                Resi #{payingOrder.order_number}
              </h3>
              <p className="text-xs text-[#64748B]">{formatServiceName(payingOrder)}</p>
              <p className="text-xl font-black text-[#0095FF]">
                Rp {payingOrder.total_amount.toLocaleString('id-ID')}
              </p>

              <div className="w-44 h-44 bg-[#F5F7FA] rounded-2xl mx-auto flex items-center justify-center border border-slate-200">
                <QrCode className="w-28 h-28 text-[#111827]" />
              </div>

              <p className="text-[11px] text-[#64748B]">
                Pindai QRIS untuk melunasi tagihan cucian secara otomatis (+25 Kucek Poin).
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isPaying}
                  onClick={handlePayOrder}
                  className="flex-1 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isPaying ? (
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
