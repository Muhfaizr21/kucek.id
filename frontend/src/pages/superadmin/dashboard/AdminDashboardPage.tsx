import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Pagination } from '../../../components/ui/Pagination';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  CheckCircle2,
  Users,
  Calendar,
  Download,
  ShoppingBag,
  Layers,
  Sparkles,
  Package,
  Truck,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface StatusBreakdown {
  status: string;
  count: number;
}

interface ServiceBreakdown {
  service_type: string;
  count: number;
  weight_kg: number;
  revenue: number;
}

interface DashboardOrder {
  id: number;
  order_number: string;
  service_type: string;
  weight_kg: number;
  fragrance: string;
  subtotal: number;
  total_amount: number;
  quota_used_kg: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  customer?: {
    id: number;
    name: string;
    phone: string;
    area: string;
  };
}

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  sub_role: string;
  is_active: boolean;
}

interface DashboardData {
  today_orders: number;
  total_orders: number;
  today_revenue: number;
  total_order_revenue: number;
  package_revenue: number;
  total_revenue: number;
  total_expenses: number;
  total_weight_kg: number;
  active_orders: number;
  express_active_count: number;
  total_customers: number;
  member_customers: number;
  total_staff: number;
  total_services: number;
  status_breakdown: StatusBreakdown[];
  service_breakdown: ServiceBreakdown[];
  recent_orders: DashboardOrder[];
}

const formatRupiah = (num: number) =>
  'Rp' + Math.round(num).toLocaleString('id-ID');

const getStageProgress = (status: string) => {
  switch (status) {
    case 'terima':
      return { pct: 20, label: 'Diterima', color: 'bg-slate-500' };
    case 'cuci':
      return { pct: 40, label: 'Dicuci', color: 'bg-[#2563EB]' };
    case 'kering':
      return { pct: 60, label: 'Pengering', color: 'bg-indigo-500' };
    case 'setrika':
      return { pct: 75, label: 'Setrika Uap', color: 'bg-amber-500' };
    case 'packing':
      return { pct: 90, label: 'QC & Packing', color: 'bg-purple-500' };
    case 'selesai':
      return { pct: 100, label: 'Selesai', color: 'bg-emerald-500' };
    default:
      return { pct: 50, label: status, color: 'bg-[#2563EB]' };
  }
};

const STAFF_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [periodFilter, setPeriodFilter] = useState('1 – 30 Nov 2026');

  // Pagination states for bottom tables
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(5);
  const [staffPage, setStaffPage] = useState(1);
  const [staffPageSize] = useState(5);

  const fetchDashboard = useCallback(async () => {
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const [statsRes, staffRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/stats/dashboard', { headers }),
        fetch('http://localhost:8080/api/v1/staff', { headers }),
      ]);

      if (statsRes.ok) {
        const json = await statsRes.json();
        if (json.data) setData(json.data);
      }
      if (staffRes.ok) {
        const sJson = await staffRes.json();
        if (Array.isArray(sJson.data)) setStaffList(sJson.data);
      }
    } catch {
      // fallback handled below
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const totalRevenue = data?.total_revenue || 842000;
  const totalExpenses = data?.total_expenses || 280000;
  const netProfit = totalRevenue - totalExpenses;
  const marginPct =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '66.7';

  const totalWeightKg = data?.total_weight_kg || 42.5;
  const totalOrders = data?.total_orders || 6;
  const completedOrders =
    data?.status_breakdown?.find((s) => s.status === 'selesai')?.count || 3;
  const totalCustomers = data?.total_customers || 5;
  const memberCustomers = data?.member_customers || 3;

  // Service Revenue Breakdown for Donut 1
  const pkgRev = data?.package_revenue || 480000;
  const kiloanRev =
    data?.service_breakdown?.find((s) => s.service_type === 'kiloan')
      ?.revenue || 212000;
  const satuanRev =
    data?.service_breakdown?.find((s) => s.service_type === 'satuan')
      ?.revenue || 110000;
  const expressRev =
    data?.service_breakdown?.find((s) => s.service_type === 'express')
      ?.revenue || 85000;
  const deliveryRev = 35000;
  const sumDonut1 =
    pkgRev + kiloanRev + satuanRev + expressRev + deliveryRev || 1;

  const revenueSlices = [
    {
      label: 'Paket Kuota Member',
      amount: pkgRev,
      pct: ((pkgRev / sumDonut1) * 100).toFixed(1),
      color: '#2563EB',
      dot: 'bg-[#2563EB]',
    },
    {
      label: 'Cuci Setrika Kiloan',
      amount: kiloanRev,
      pct: ((kiloanRev / sumDonut1) * 100).toFixed(1),
      color: '#8B5CF6',
      dot: 'bg-purple-500',
    },
    {
      label: 'Satuan & Bedcover',
      amount: satuanRev,
      pct: ((satuanRev / sumDonut1) * 100).toFixed(1),
      color: '#10B981',
      dot: 'bg-emerald-500',
    },
    {
      label: 'Express Kilat 24J',
      amount: expressRev,
      pct: ((expressRev / sumDonut1) * 100).toFixed(1),
      color: '#F59E0B',
      dot: 'bg-amber-500',
    },
    {
      label: 'Layanan Antar-Jemput',
      amount: deliveryRev,
      pct: ((deliveryRev / sumDonut1) * 100).toFixed(1),
      color: '#94A3B8',
      dot: 'bg-slate-400',
    },
  ];

  // Workload / Activity Breakdown for Donut 2
  const workloadSlices = [
    {
      label: 'Pencucian Washer Higienis',
      hours: '16.5 Kg',
      pct: '38.8',
      val: 38.8,
      color: '#2563EB',
      dot: 'bg-[#2563EB]',
    },
    {
      label: 'Setrika Uap & Parfum',
      hours: '11.0 Kg',
      pct: '25.9',
      val: 25.9,
      color: '#8B5CF6',
      dot: 'bg-purple-500',
    },
    {
      label: 'Pengering Suhu 60°C',
      hours: '7.5 Kg',
      pct: '17.6',
      val: 17.6,
      color: '#10B981',
      dot: 'bg-emerald-500',
    },
    {
      label: 'QC & Segel Kemasan',
      hours: '4.5 Kg',
      pct: '10.6',
      val: 10.6,
      color: '#F59E0B',
      dot: 'bg-amber-500',
    },
    {
      label: 'Armada Kurir Jemput',
      hours: '3.0 Kg',
      pct: '7.1',
      val: 7.1,
      color: '#94A3B8',
      dot: 'bg-slate-400',
    },
  ];

  // Paginated Orders for Bottom Left Table
  const allOrders = data?.recent_orders || [];
  const paginatedOrders = allOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );

  // Paginated Staff for Bottom Right Table
  const enrichedStaff = (
    staffList.length > 0
      ? staffList
      : [
          {
            id: 1,
            name: 'Superadmin Kucek',
            role: 'superadmin',
            sub_role: 'Kepala Outlet & QC',
            email: 'admin@kucek.id',
            phone: '081234567890',
            is_active: true,
          },
          {
            id: 2,
            name: 'Andi Saputra',
            role: 'kasir',
            sub_role: 'Kasir POS Shift Pagi',
            email: 'andi@kucek.id',
            phone: '081234560001',
            is_active: true,
          },
          {
            id: 3,
            name: 'Yayan Hendra',
            role: 'operator',
            sub_role: 'Spesialis Washer & Dryer',
            email: 'yayan@kucek.id',
            phone: '081234560002',
            is_active: true,
          },
          {
            id: 4,
            name: 'Dina Lestari',
            role: 'operator',
            sub_role: 'Meja Setrika Uap Presisi',
            email: 'dina@kucek.id',
            phone: '081234560004',
            is_active: true,
          },
          {
            id: 5,
            name: 'Dedi Kurniawan',
            role: 'kurir',
            sub_role: 'Armada 01 - Zona Sleman',
            email: 'dedi@kucek.id',
            phone: '081234560003',
            is_active: true,
          },
        ]
  ).map((st, idx) => ({
    ...st,
    avatar: STAFF_AVATARS[idx % STAFF_AVATARS.length],
    hoursTracked: `${32 - idx * 3}j ${45 - idx * 5}m`,
    hoursPct: Math.max(45, 92 - idx * 9),
    tasksCompleted: Math.max(6, 18 - idx * 2),
    productivity: Math.max(76, 94 - idx * 4),
  }));

  const paginatedStaff = enrichedStaff.slice(
    (staffPage - 1) * staffPageSize,
    staffPage * staffPageSize
  );

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Wylro-Style Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Statistik & Performa Operasional
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis performa aktivitas laundry, arus kas outlet, dan
              produktivitas tim secara menyeluruh
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setPeriodFilter(
                  periodFilter === '1 – 30 Nov 2026'
                    ? 'Oktober – Nov 2026'
                    : '1 – 30 Nov 2026'
                )
              }
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{periodFilter}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Ekspor</span>
            </button>

            <Link
              to="/admin/pos"
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Kasir POS</span>
            </Link>
          </div>
        </div>

        {/* ROW 1: 6 Wylro-Style KPI Cards with Colored Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Card 1: Pendapatan */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Pendapatan
                  </span>
                  <p className="text-base sm:text-[17px] font-black text-slate-900 truncate">
                    {formatRupiah(totalRevenue)}
                  </p>
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-600 mt-2.5">
                ↗ 12.5% vs bln lalu
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Target : Rp1.000.000
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: '92%' }}
                  className="h-full rounded-full bg-[#2563EB]"
                />
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-700">
                92%
              </span>
            </div>
          </div>

          {/* Card 2: Pengeluaran */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Pengeluaran
                  </span>
                  <p className="text-base sm:text-[17px] font-black text-slate-900 truncate">
                    {formatRupiah(totalExpenses)}
                  </p>
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-rose-600 mt-2.5">
                ↗ 6.3% vs bln lalu
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Anggaran : Rp650.000
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: '43%' }}
                  className="h-full rounded-full bg-rose-500"
                />
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-700">
                43%
              </span>
            </div>
          </div>

          {/* Card 3: Laba Bersih */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Laba Bersih
                  </span>
                  <p className="text-base sm:text-[17px] font-black text-slate-900 truncate">
                    {formatRupiah(netProfit)}
                  </p>
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-600 mt-2.5">
                ↗ 16.2% vs bln lalu
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Margin : {marginPct}%
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: '100%' }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-700">
                108%
              </span>
            </div>
          </div>

          {/* Card 4: Volume Cuci */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Volume Cuci
                  </span>
                  <p className="text-base sm:text-[17px] font-black text-slate-900 truncate">
                    {totalWeightKg.toFixed(1)} Kg
                  </p>
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-600 mt-2.5">
                ↗ 8.2% vs bln lalu
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Target : 50.0 Kg
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: '86%' }}
                  className="h-full rounded-full bg-purple-500"
                />
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-700">
                86%
              </span>
            </div>
          </div>

          {/* Card 5: Nota Selesai */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Nota Selesai
                  </span>
                  <p className="text-base sm:text-[17px] font-black text-slate-900 truncate">
                    {completedOrders} Nota
                  </p>
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-600 mt-2.5">
                ↗ 18.7% vs bln lalu
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Total : {totalOrders} Nota
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{
                    width: `${Math.round(
                      (completedOrders / Math.max(totalOrders, 1)) * 100
                    )}%`,
                  }}
                  className="h-full rounded-full bg-amber-500"
                />
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-700">
                {Math.round((completedOrders / Math.max(totalOrders, 1)) * 100)}
                %
              </span>
            </div>
          </div>

          {/* Card 6: Pelanggan Aktif */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Pelanggan Aktif
                  </span>
                  <p className="text-base sm:text-[17px] font-black text-slate-900 truncate">
                    {totalCustomers} User
                  </p>
                </div>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-600 mt-2.5">
                ↗ 9.7% vs bln lalu
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Member Kuota : {memberCustomers}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: '78%' }}
                  className="h-full rounded-full bg-teal-500"
                />
              </div>
              <span className="text-[10.5px] font-extrabold text-slate-700">
                78%
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: 3 Wylro-Style Charts (SVG Line/Area Chart + 2 Multi-Segment Donut Charts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Chart 1 (5 Cols): Evolusi Pendapatan dan Pengeluaran (SVG Dual Line & Area Chart) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                Evolusi Pendapatan dan Pengeluaran
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
                Bulan Ini
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2.5 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />{' '}
                Pendapatan
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />{' '}
                Pengeluaran
              </span>
            </div>

            {/* SVG Line + Area Chart */}
            <div className="mt-3 relative">
              <svg
                viewBox="0 0 420 175"
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines & Y-Axis Labels */}
                {[
                  { y: 18, label: '1.0jt' },
                  { y: 48, label: '750rb' },
                  { y: 78, label: '500rb' },
                  { y: 108, label: '250rb' },
                  { y: 138, label: '100rb' },
                  { y: 158, label: '0' },
                ].map((g) => (
                  <g key={g.y}>
                    <text
                      x="0"
                      y={g.y + 3}
                      className="fill-slate-400 text-[9px] font-semibold"
                    >
                      {g.label}
                    </text>
                    <line
                      x1="36"
                      y1={g.y}
                      x2="412"
                      y2={g.y}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Revenue Area & Line */}
                <path
                  d="M 40 132 L 90 108 L 145 96 L 200 78 L 255 64 L 310 54 L 365 42 L 410 26 L 410 158 L 40 158 Z"
                  fill="url(#revGrad)"
                />
                <path
                  d="M 40 132 L 90 108 L 145 96 L 200 78 L 255 64 L 310 54 L 365 42 L 410 26"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Expense Area & Line */}
                <path
                  d="M 40 148 L 90 142 L 145 135 L 200 137 L 255 129 L 310 124 L 365 120 L 410 112 L 410 158 L 40 158 Z"
                  fill="url(#expGrad)"
                />
                <path
                  d="M 40 148 L 90 142 L 145 135 L 200 137 L 255 129 L 310 124 L 365 120 L 410 112"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  [40, 132],
                  [90, 108],
                  [145, 96],
                  [200, 78],
                  [255, 64],
                  [310, 54],
                  [365, 42],
                  [410, 26],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill="#2563EB"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                ))}

                {[
                  [40, 148],
                  [90, 142],
                  [145, 135],
                  [200, 137],
                  [255, 129],
                  [310, 124],
                  [365, 120],
                  [410, 112],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill="#F43F5E"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pl-8 pr-1 -mt-2">
                <span>1 Nov</span>
                <span>6 Nov</span>
                <span>11 Nov</span>
                <span>16 Nov</span>
                <span>21 Nov</span>
                <span>26 Nov</span>
                <span>30 Nov</span>
              </div>
            </div>
          </div>

          {/* Chart 2 (3.5/4 Cols): Distribusi Pendapatan Layanan */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Distribusi Pendapatan Layanan
            </h2>

            <div className="my-3 flex items-center justify-between gap-4">
              {/* Multi-segment Donut */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="15"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="15"
                    strokeDasharray="115 289"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#8B5CF6"
                    strokeWidth="15"
                    strokeDasharray="75 289"
                    strokeDashoffset="-117"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="15"
                    strokeDasharray="48 289"
                    strokeDashoffset="-194"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="15"
                    strokeDasharray="34 289"
                    strokeDashoffset="-244"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                  <span className="text-xs font-black text-slate-900 leading-tight">
                    {formatRupiah(totalRevenue)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Total
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-2 min-w-0">
                {revenueSlices.map((s) => (
                  <div key={s.label} className="text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`}
                      />
                      <span className="font-bold text-slate-800 truncate">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 pl-3.5">
                      {formatRupiah(s.amount)} ({s.pct}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                to="/admin/layanan"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Lihat semua layanan
              </Link>
            </div>
          </div>

          {/* Chart 3 (3 Cols): Distribusi Beban Kerja & Aktivitas Workshop */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Volume per Stasiun Kerja
            </h2>

            <div className="my-3 flex items-center justify-between gap-3">
              {/* Donut 2 */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="15"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="15"
                    strokeDasharray="112 289"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#8B5CF6"
                    strokeWidth="15"
                    strokeDasharray="75 289"
                    strokeDashoffset="-114"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="15"
                    strokeDasharray="51 289"
                    strokeDashoffset="-191"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="15"
                    strokeDasharray="32 289"
                    strokeDashoffset="-244"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-slate-900">
                    {totalWeightKg.toFixed(1)} Kg
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Total
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                {workloadSlices.map((w) => (
                  <div key={w.label} className="text-[10.5px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${w.dot}`}
                      />
                      <span className="font-bold text-slate-800 truncate">
                        {w.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 pl-3.5">
                      {w.hours} ({w.pct}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                to="/admin/antrean-produksi"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Lihat detail produksi
              </Link>
            </div>
          </div>
        </div>

        {/* ROW 3: Wylro-Style Bottom Tables WITH PAGINATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Table (7 Cols): Performa Order & Layanan */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Performa Pesanan & Layanan
                </h2>
                <Link
                  to="/admin/antrean-produksi"
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Lihat semua pesanan
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 pr-3">Pesanan & Layanan</th>
                      <th className="py-2.5 px-2">Berat</th>
                      <th className="py-2.5 px-2">Nilai Nota</th>
                      <th className="py-2.5 px-2">Progres Produksi</th>
                      <th className="py-2.5 pl-2 text-right">Margin / Bayar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedOrders.map((ord, idx) => {
                      const st = getStageProgress(ord.status);
                      const iconColors = [
                        'bg-blue-50 text-[#2563EB]',
                        'bg-emerald-50 text-emerald-600',
                        'bg-purple-50 text-purple-600',
                        'bg-amber-50 text-amber-600',
                        'bg-sky-50 text-sky-600',
                      ];
                      const Icons = [
                        Layers,
                        Package,
                        Sparkles,
                        Truck,
                        ShoppingBag,
                      ];
                      const RowIcon = Icons[idx % Icons.length];
                      return (
                        <tr
                          key={ord.id}
                          onClick={() => navigate('/admin/antrean-produksi')}
                          className="hover:bg-slate-50/80 transition cursor-pointer"
                        >
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  iconColors[idx % iconColors.length]
                                }`}
                              >
                                <RowIcon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">
                                  {ord.customer?.name || 'Walk-in'} •{' '}
                                  <span className="font-mono text-[#2563EB]">
                                    {ord.order_number}
                                  </span>
                                </p>
                                <p className="text-[10.5px] text-slate-400 capitalize truncate">
                                  Layanan {ord.service_type} (
                                  {ord.fragrance.replace('_', ' ')})
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 font-semibold text-slate-600 whitespace-nowrap">
                            {ord.weight_kg.toFixed(1)} Kg
                          </td>
                          <td className="py-3 px-2 font-bold text-slate-900 whitespace-nowrap">
                            {ord.quota_used_kg > 0 && ord.total_amount === 0
                              ? `Kuota ${ord.quota_used_kg}Kg`
                              : formatRupiah(ord.total_amount)}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  style={{ width: `${st.pct}%` }}
                                  className={`h-full rounded-full ${st.color}`}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-slate-600">
                                {st.pct}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pl-2 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                                ord.payment_status === 'paid'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-amber-50 text-amber-600'
                              }`}
                            >
                              {ord.payment_status === 'paid'
                                ? 'Lunas (68%)'
                                : 'Piutang'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={orderPage}
              totalItems={allOrders.length}
              pageSize={orderPageSize}
              onPageChange={setOrderPage}
              onPageSizeChange={setOrderPageSize}
              pageSizeOptions={[4, 5, 8]}
              itemLabel="pesanan"
            />
          </div>

          {/* Right Table (5 Cols): Aktivitas Tim & Produktivitas Staf */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Aktivitas Tim & Produktivitas
                </h2>
                <Link
                  to="/admin/manajemen-staf"
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  Lihat seluruh tim
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 pr-2">Staf Operasional</th>
                      <th className="py-2.5 px-2">Jam Kerja</th>
                      <th className="py-2.5 px-2 text-center">Nota</th>
                      <th className="py-2.5 pl-2 text-right">Produktivitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/80">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">
                                {member.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {member.sub_role || member.role}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700 whitespace-nowrap">
                              {member.hoursTracked}
                            </span>
                            <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                              <div
                                style={{ width: `${member.hoursPct}%` }}
                                className="h-full rounded-full bg-[#2563EB]"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-slate-700">
                          {member.tasksCompleted}
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-extrabold text-[10.5px]">
                            {member.productivity}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={staffPage}
              totalItems={enrichedStaff.length}
              pageSize={staffPageSize}
              onPageChange={setStaffPage}
              itemLabel="staf"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
