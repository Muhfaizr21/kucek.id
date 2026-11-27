import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Pagination } from '../../../components/ui/Pagination';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  LayoutGrid,
  List,
  Scale,
  Flame,
  PackageCheck,
  ShieldCheck,
  Droplets,
  User,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

type BackendOrderStatus =
  | 'terima'
  | 'cuci'
  | 'kering'
  | 'setrika'
  | 'packing'
  | 'selesai';

interface ProductionOrder {
  id: number;
  order_number: string;
  service_type: string;
  weight_kg: number;
  fragrance: string;
  total_amount: number;
  quota_used_kg: number;
  status: BackendOrderStatus;
  payment_status: string;
  payment_method: string;
  notes: string;
  created_at: string;
  customer?: {
    name: string;
    phone: string;
    area?: string;
  };
  items?: {
    id: number;
    item_name: string;
    quantity: number;
  }[];
}

const KANBAN_COLUMNS: {
  status: BackendOrderStatus;
  step: number;
  title: string;
  subtitle: string;
  machineLabel: string;
  operatorName: string;
  progressPct: number;
  topBorderCls: string;
  badgeCls: string;
  barCls: string;
  location: string;
}[] = [
  {
    status: 'terima',
    step: 1,
    title: 'Diterima & Timbang',
    subtitle: 'Tagging barcode & sortir',
    machineLabel: 'Meja Sortir #01',
    operatorName: 'Andi Saputra',
    progressPct: 16,
    topBorderCls: 'border-t-slate-500',
    badgeCls: 'bg-slate-100 text-slate-700',
    barCls: 'bg-slate-500',
    location: 'Meja Timbang & Sortir Outlet',
  },
  {
    status: 'cuci',
    step: 2,
    title: 'Pencucian Higienis',
    subtitle: '1 Mesin 1 Pelanggan',
    machineLabel: 'Washer Front-Load A2',
    operatorName: 'Yayan Hendra',
    progressPct: 35,
    topBorderCls: 'border-t-[#2563EB]',
    badgeCls: 'bg-blue-50 text-[#2563EB]',
    barCls: 'bg-[#2563EB]',
    location: 'Zona Washer Front-Load',
  },
  {
    status: 'kering',
    step: 3,
    title: 'Pengering 60°C',
    subtitle: 'Sterilisasi tungau & uap',
    machineLabel: 'Dryer Suhu B1',
    operatorName: 'Yayan Hendra',
    progressPct: 55,
    topBorderCls: 'border-t-indigo-500',
    badgeCls: 'bg-indigo-50 text-indigo-700',
    barCls: 'bg-indigo-500',
    location: 'Zona Dryer Suhu Terkontrol',
  },
  {
    status: 'setrika',
    step: 4,
    title: 'Setrika Uap & Parfum',
    subtitle: 'Boiler uap & parfum',
    machineLabel: 'Meja Boiler Uap #02',
    operatorName: 'Dina Lestari',
    progressPct: 75,
    topBorderCls: 'border-t-amber-500',
    badgeCls: 'bg-amber-50 text-amber-700',
    barCls: 'bg-amber-500',
    location: 'Meja Setrika Uap Presisi',
  },
  {
    status: 'packing',
    step: 5,
    title: 'QC & Packing Kedap',
    subtitle: 'Cek jumlah & segel',
    machineLabel: 'Stasiun Segel QC',
    operatorName: 'Dina Lestari',
    progressPct: 90,
    topBorderCls: 'border-t-purple-500',
    badgeCls: 'bg-purple-50 text-purple-700',
    barCls: 'bg-purple-500',
    location: 'Stasiun QC & Segel Kemasan',
  },
  {
    status: 'selesai',
    step: 6,
    title: 'Selesai / Siap Kirim',
    subtitle: 'Rak bersih & kurir',
    machineLabel: 'Rak Bersih Blok A',
    operatorName: 'Dedi Kurniawan',
    progressPct: 100,
    topBorderCls: 'border-t-emerald-500',
    badgeCls: 'bg-emerald-50 text-emerald-700',
    barCls: 'bg-emerald-500',
    location: 'Rak Penyimpanan Bersih / Kurir',
  },
];

const STATUS_SEQUENCE: BackendOrderStatus[] = [
  'terima',
  'cuci',
  'kering',
  'setrika',
  'packing',
  'selesai',
];

const formatRupiah = (n: number) =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

export const AdminProductionPage: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scanInput, setScanInput] = useState('KCK-2026-001');

  // Pagination states
  const [kanbanCardsPerCol, setKanbanCardsPerCol] = useState<number>(3);
  const [colPageMap, setColPageMap] = useState<Record<string, number>>({});
  const [tablePage, setTablePage] = useState<number>(1);
  const [tablePageSize, setTablePageSize] = useState<number>(6);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8080/api/v1/orders?limit=80', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setOrders(json.data);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const moveOrderStatus = async (ord: ProductionOrder, direction: 1 | -1) => {
    const currentIndex = STATUS_SEQUENCE.indexOf(ord.status);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= STATUS_SEQUENCE.length) return;

    const nextStatus = STATUS_SEQUENCE[nextIndex];
    const nextCol = KANBAN_COLUMNS.find((c) => c.status === nextStatus);

    setUpdatingId(ord.id);
    try {
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:8080/api/v1/orders/${ord.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            status: nextStatus,
            description: `Resi ${ord.order_number} (${
              ord.customer?.name || 'Pelanggan'
            }) berpindah ke stasiun: ${nextCol?.title || nextStatus} (${
              nextCol?.machineLabel
            }).`,
            location: nextCol?.location || 'Workshop Kucek.id',
          }),
        }
      );

      if (res.ok) {
        setOrders((prev) =>
          prev.map((item) =>
            item.id === ord.id ? { ...item, status: nextStatus } : item
          )
        );
        showToast(
          `Resi ${ord.order_number} berhasil dipindahkan ke "${nextCol?.title}" & disinkronkan ke Lacak Resi Live!`
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuickScanAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.order_number.toLowerCase() === scanInput.trim().toLowerCase()
    );
    if (!found) {
      showToast(`Resi "${scanInput}" tidak ditemukan di antrean.`);
      return;
    }
    setShowScannerModal(false);
    await moveOrderStatus(found, 1);
  };

  const filteredOrders = orders.filter((o) => {
    if (
      serviceFilter !== 'ALL' &&
      o.service_type.toUpperCase() !== serviceFilter
    ) {
      return false;
    }
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      (o.customer?.name || '').toLowerCase().includes(q) ||
      o.fragrance.toLowerCase().includes(q)
    );
  });

  const paginatedTableOrders = filteredOrders.slice(
    (tablePage - 1) * tablePageSize,
    tablePage * tablePageSize
  );

  const totalOrdersCount = Math.max(orders.length, 1);

  return (
    <AdminLayout>
      <div className="space-y-5">
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Wylro-Style Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#2563EB] text-[10.5px] font-extrabold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> PROTOKOL 1 MESIN 1
              PELANGGAN • TELEMETRI LIVE
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Antrean & Stasiun Produksi Workshop
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kendalikan perpindahan tahap cucian per mesin. Setiap pergeseran
              otomatis memperbarui halaman Lacak Resi pelanggan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-xl bg-white border border-slate-200/90 p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-[#EEF4FF] text-[#2563EB]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Papan Stasiun</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#EEF4FF] text-[#2563EB]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabel & Pagination</span>
              </button>
            </div>

            <button
              onClick={fetchOrders}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Segarkan</span>
            </button>

            <button
              onClick={() => setShowScannerModal(true)}
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan Barcode Keranjang</span>
            </button>
          </div>
        </div>

        {/* 6 Wylro-Style Station Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {KANBAN_COLUMNS.map((col) => {
            const count = orders.filter((o) => o.status === col.status).length;
            const weightSum = orders
              .filter((o) => o.status === col.status)
              .reduce((acc, o) => acc + (o.weight_kg || 0), 0);
            const ratioPct = Math.round((count / totalOrdersCount) * 100);
            return (
              <div
                key={col.status}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-400">
                      Tahap {col.step}/6
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${col.badgeCls}`}
                    >
                      {count} Nota
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 mt-1.5 truncate">
                    {col.title}
                  </p>
                  <p className="text-[10.5px] font-semibold text-slate-400 mt-0.5">
                    Beban: <b className="text-slate-700">{weightSum.toFixed(1)} Kg</b>
                  </p>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(ratioPct, count > 0 ? 18 : 0)}%` }}
                      className={`h-full rounded-full ${col.barCls}`}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-600">
                    {ratioPct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter, Search & Per-Column Pagination Limit Controls */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'ALL', label: `Semua Antrean (${orders.length})` },
              { key: 'EXPRESS', label: 'Prioritas Express 24J' },
              { key: 'KILOAN', label: 'Kiloan Reguler' },
              { key: 'SATUAN', label: 'Satuan & Bedcover' },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setServiceFilter(f.key);
                  setTablePage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  serviceFilter === f.key
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {viewMode === 'kanban' && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold text-[11px]">
                  Kartu/Kolom:
                </span>
                {[2, 3, 5].map((lim) => (
                  <button
                    key={lim}
                    type="button"
                    onClick={() => {
                      setKanbanCardsPerCol(lim);
                      setColPageMap({});
                    }}
                    className={`w-7 h-7 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                      kanbanCardsPerCol === lim
                        ? 'bg-[#EEF4FF] text-[#2563EB] border border-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lim}
                  </button>
                ))}
              </div>
            )}

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setTablePage(1);
                }}
                placeholder="Cari No. Resi, Pelanggan, Aroma..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* VIEW MODE 1: WYLRO PRO KANBAN BOARD WITH PER-COLUMN PAGINATION */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {KANBAN_COLUMNS.map((col) => {
              const colOrders = filteredOrders.filter(
                (o) => o.status === col.status
              );
              const currentColPage = colPageMap[col.status] || 1;
              const totalColPages = Math.max(
                1,
                Math.ceil(colOrders.length / kanbanCardsPerCol)
              );
              const safeColPage = Math.min(currentColPage, totalColPages);
              const visibleColOrders = colOrders.slice(
                (safeColPage - 1) * kanbanCardsPerCol,
                safeColPage * kanbanCardsPerCol
              );

              return (
                <div
                  key={col.status}
                  className={`bg-white rounded-2xl border border-slate-200/85 border-t-4 ${col.topBorderCls} shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] flex flex-col justify-between min-h-[480px]`}
                >
                  {/* Column Header */}
                  <div>
                    <div className="p-3.5 border-b border-slate-100">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold text-slate-900">
                          {col.step}. {col.title}
                        </span>
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-full ${col.badgeCls}`}
                        >
                          {colOrders.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-1">
                        <span>{col.machineLabel}</span>
                        <span className="font-semibold text-slate-500">
                          {col.operatorName.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Cards List */}
                    <div className="p-2.5 space-y-2.5">
                      {visibleColOrders.map((order) => {
                        const custName =
                          order.customer?.name || 'Pelanggan Walk-in';
                        return (
                          <div
                            key={order.id}
                            className="p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-white border border-slate-200/80 hover:border-[#2563EB] hover:shadow-md transition-all space-y-3 group"
                          >
                            {/* Top Row: Resi + Priority */}
                            <div className="flex items-center justify-between gap-1">
                              <Link
                                to={`/lacak/${order.order_number}`}
                                className="font-mono text-[11px] font-black text-[#2563EB] hover:underline flex items-center gap-1"
                              >
                                <span>{order.order_number}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>

                              {order.service_type === 'express' ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 font-black text-[9px] uppercase flex items-center gap-0.5">
                                  <Flame className="w-2.5 h-2.5" /> EXPRESS
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[9px] uppercase">
                                  {order.service_type}
                                </span>
                              )}
                            </div>

                            {/* Customer Info with Avatar Initial */}
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#EEF4FF] text-[#2563EB] text-xs font-black flex items-center justify-center shrink-0">
                                {custName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold text-slate-900 truncate">
                                  {custName}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {order.customer?.phone || 'Outlet Walk-in'}
                                </p>
                              </div>
                            </div>

                            {/* Telemetry Pills: Weight & Perfume */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-extrabold text-slate-700 flex items-center gap-1">
                                <Scale className="w-2.5 h-2.5 text-[#2563EB]" />
                                {order.weight_kg} Kg
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-semibold text-slate-600 capitalize flex items-center gap-1">
                                <Droplets className="w-2.5 h-2.5 text-sky-500" />
                                {order.fragrance.replace('_', ' ')}
                              </span>
                            </div>

                            {/* Stage Progress Bar */}
                            <div>
                              <div className="flex items-center justify-between text-[10px] mb-1">
                                <span className="text-slate-400 font-medium">
                                  Progres Stasiun
                                </span>
                                <span className="font-extrabold text-slate-700">
                                  {col.progressPct}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
                                <div
                                  style={{ width: `${col.progressPct}%` }}
                                  className={`h-full rounded-full ${col.barCls}`}
                                />
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-1 flex items-center gap-1.5">
                              {col.step > 1 && (
                                <button
                                  type="button"
                                  disabled={updatingId === order.id}
                                  onClick={() => moveOrderStatus(order, -1)}
                                  title="Kembalikan ke tahap sebelumnya"
                                  className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer disabled:opacity-40"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {col.status !== 'selesai' ? (
                                <button
                                  type="button"
                                  disabled={updatingId === order.id}
                                  onClick={() => moveOrderStatus(order, 1)}
                                  className="flex-1 py-2 px-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50"
                                >
                                  <span>
                                    {updatingId === order.id
                                      ? 'Memproses...'
                                      : 'Geser Lanjut'}
                                  </span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              ) : (
                                <div className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-extrabold flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Siap Kirim / Ambil</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {colOrders.length === 0 && (
                        <div className="py-12 px-3 rounded-xl bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                          <PackageCheck className="w-6 h-6 text-slate-300 mb-1.5" />
                          <p className="text-[11px] font-bold text-slate-400">
                            Stasiun Kosong
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Mesin siap menerima keranjang berikutnya
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Per-Column Mini Pagination Footer */}
                  {colOrders.length > kanbanCardsPerCol && (
                    <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl flex items-center justify-between text-[10.5px]">
                      <span className="font-bold text-slate-500">
                        Hal {safeColPage}/{totalColPages}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={safeColPage <= 1}
                          onClick={() =>
                            setColPageMap((prev) => ({
                              ...prev,
                              [col.status]: safeColPage - 1,
                            }))
                          }
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-600 disabled:opacity-40 cursor-pointer"
                        >
                          &larr;
                        </button>
                        <button
                          type="button"
                          disabled={safeColPage >= totalColPages}
                          onClick={() =>
                            setColPageMap((prev) => ({
                              ...prev,
                              [col.status]: safeColPage + 1,
                            }))
                          }
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-600 disabled:opacity-40 cursor-pointer"
                        >
                          &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW MODE 2: WYLRO PRODUCTION AUDIT TABLE WITH FULL PAGINATION */
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase">
                    <th className="py-3 px-3">No. Resi & Pelanggan</th>
                    <th className="py-3 px-3">Layanan & Aroma</th>
                    <th className="py-3 px-3">Stasiun & Operator</th>
                    <th className="py-3 px-3">Progres Pengerjaan</th>
                    <th className="py-3 px-3">Tagihan</th>
                    <th className="py-3 px-3 text-right">Kontrol Tahap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedTableOrders.map((ord) => {
                    const col =
                      KANBAN_COLUMNS.find((c) => c.status === ord.status) ||
                      KANBAN_COLUMNS[0];
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-3">
                          <Link
                            to={`/lacak/${ord.order_number}`}
                            className="font-mono font-black text-[#2563EB] hover:underline"
                          >
                            {ord.order_number}
                          </Link>
                          <p className="font-bold text-slate-900 mt-0.5">
                            {ord.customer?.name || 'Pelanggan Walk-in'}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 capitalize">
                            {ord.service_type} ({ord.weight_kg} Kg)
                          </span>
                          <p className="text-[11px] text-slate-400 capitalize">
                            Parfum: {ord.fragrance.replace('_', ' ')}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${col.badgeCls}`}
                          >
                            {col.step}. {col.title}
                          </span>
                          <p className="text-[10.5px] text-slate-400 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" /> {col.operatorName} (
                            {col.machineLabel})
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-28 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                style={{ width: `${col.progressPct}%` }}
                                className={`h-full rounded-full ${col.barCls}`}
                              />
                            </div>
                            <span className="font-bold text-slate-700 text-[11px]">
                              {col.progressPct}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-black text-slate-900">
                          {formatRupiah(ord.total_amount)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {col.step > 1 && (
                              <button
                                type="button"
                                disabled={updatingId === ord.id}
                                onClick={() => moveOrderStatus(ord, -1)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                              >
                                &larr; Mundur
                              </button>
                            )}
                            {ord.status !== 'selesai' ? (
                              <button
                                type="button"
                                disabled={updatingId === ord.id}
                                onClick={() => moveOrderStatus(ord, 1)}
                                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Geser Lanjut &rarr;
                              </button>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-[11px]">
                                ✓ Selesai
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={tablePage}
              totalItems={filteredOrders.length}
              pageSize={tablePageSize}
              onPageChange={setTablePage}
              onPageSizeChange={setTablePageSize}
              pageSizeOptions={[5, 6, 10, 15]}
              itemLabel="antrean cucian"
            />
          </div>
        )}

        {/* Modal Scan Barcode Keranjang */}
        {showScannerModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#2563EB]" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    Scan Barcode / Input Cepat No. Resi
                  </h3>
                </div>
                <button
                  onClick={() => setShowScannerModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleQuickScanAdvance} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Nomor Resi Keranjang Cucian
                  </label>
                  <input
                    type="text"
                    required
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: KCK-2026-001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm font-black text-[#2563EB]"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {orders
                    .filter((o) => o.status !== 'selesai')
                    .slice(0, 4)
                    .map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setScanInput(o.order_number)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] font-mono text-[11px] font-bold cursor-pointer"
                      >
                        {o.order_number}
                      </button>
                    ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScannerModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Majukan 1 Tahap Produksi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
