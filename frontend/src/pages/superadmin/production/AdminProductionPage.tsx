import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  RefreshCw,
  Search,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  status: BackendOrderStatus;
  payment_status: string;
  payment_method: string;
  notes: string;
  created_at: string;
  customer?: {
    name: string;
    phone: string;
  };
  items?: {
    id: number;
    item_name: string;
    quantity: number;
  }[];
}

const KANBAN_COLUMNS: {
  status: BackendOrderStatus;
  title: string;
  subtitle: string;
  badgeCls: string;
  location: string;
}[] = [
  {
    status: 'terima',
    title: '1. Diterima & Timbang',
    subtitle: 'Tagging barcode & sortir warna',
    badgeCls: 'bg-slate-200 text-slate-800',
    location: 'Meja Timbang & Sortir Outlet',
  },
  {
    status: 'cuci',
    title: '2. Pencucian Higienis',
    subtitle: '1 Mesin 1 Pelanggan',
    badgeCls: 'bg-sky-100 text-[#0095FF]',
    location: 'Zona Washer Front-Load',
  },
  {
    status: 'kering',
    title: '3. Pengering 60°C',
    subtitle: 'Sterilisasi tungau & bakteri',
    badgeCls: 'bg-indigo-100 text-indigo-700',
    location: 'Zona Dryer Suhu Terkontrol',
  },
  {
    status: 'setrika',
    title: '4. Setrika Uap & Parfum',
    subtitle: 'Boiler uap & semprot parfum',
    badgeCls: 'bg-amber-100 text-amber-800',
    location: 'Meja Setrika Uap Presisi',
  },
  {
    status: 'packing',
    title: '5. QC & Packing Kedap',
    subtitle: 'Cek jumlah & segel plastik',
    badgeCls: 'bg-purple-100 text-purple-800',
    location: 'Stasiun QC & Segel Kemasan',
  },
  {
    status: 'selesai',
    title: '6. Selesai / Siap Kirim',
    subtitle: 'Rak bersih / siap kurir',
    badgeCls: 'bg-emerald-100 text-emerald-800',
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

export const AdminProductionPage: React.FC = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scanInput, setScanInput] = useState('KCK-2026-001');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8080/api/v1/orders?limit=60', {
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

  const advanceOrderStatus = async (ord: ProductionOrder) => {
    const currentIndex = STATUS_SEQUENCE.indexOf(ord.status);
    if (currentIndex < 0 || currentIndex >= STATUS_SEQUENCE.length - 1) return;

    const nextStatus = STATUS_SEQUENCE[currentIndex + 1];
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
            description: `Cucian ${ord.order_number} (${
              ord.customer?.name || 'Pelanggan'
            }) memasuki tahap: ${nextCol?.title || nextStatus}.`,
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
          `Resi ${ord.order_number} berhasil digeser ke tahap "${nextCol?.title}" & halaman Lacak Resi pelanggan otomatis terupdate!`
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQuickScanAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.order_number.toLowerCase() === scanInput.trim().toLowerCase()
    );
    if (!found) {
      showToast(`Resi "${scanInput}" tidak ditemukan di antrean.`);
      return;
    }
    setShowScannerModal(false);
    await advanceOrderStatus(found);
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      (o.customer?.name || '').toLowerCase().includes(q) ||
      o.fragrance.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-[11px] font-extrabold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> SINKRONISASI REAL-TIME KE
              LACAK RESI PELANGGAN
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Papan Kanban Produksi (1 Mesin 1 Pelanggan)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Geser tahap cucian untuk memperbarui status pengerjaan dan
              telemetri lacak resi pelanggan secara langsung
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. Resi / Pelanggan..."
                className="pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
              />
            </div>

            <button
              onClick={fetchOrders}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowScannerModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>Scan Barcode Keranjang</span>
            </button>
          </div>
        </div>

        {/* 6-Stage Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const colOrders = filteredOrders.filter(
              (o) => o.status === col.status
            );
            return (
              <div
                key={col.status}
                className="bg-slate-200/60 rounded-2xl p-3 flex flex-col min-h-[460px] border border-slate-200/80"
              >
                <div className="flex items-center justify-between px-1 py-1.5 mb-2.5">
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">
                      {col.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {col.subtitle}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${col.badgeCls}`}
                  >
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-2.5 hover:border-[#0095FF] transition"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <Link
                          to={`/lacak/${order.order_number}`}
                          className="font-mono text-[11px] font-black text-[#0095FF] hover:underline flex items-center gap-1"
                        >
                          <span>{order.order_number}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                        {order.service_type === 'express' && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-black text-[9px] uppercase">
                            EXPRESS
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-extrabold text-slate-900">
                          {order.customer?.name || 'Pelanggan Walk-in'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 capitalize">
                          {order.weight_kg} Kg •{' '}
                          {order.fragrance.replace('_', ' ')}
                        </p>
                        {order.items && order.items.length > 0 && (
                          <p className="text-[10.5px] font-semibold text-purple-600 mt-1">
                            +{order.items.length} Item Satuan
                          </p>
                        )}
                      </div>

                      {col.status !== 'selesai' ? (
                        <button
                          type="button"
                          disabled={updatingId === order.id}
                          onClick={() => advanceOrderStatus(order)}
                          className="w-full py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-[#0095FF] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                          <span>
                            {updatingId === order.id
                              ? 'Memproses...'
                              : 'Geser Tahap Lanjut'}
                          </span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <div className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selesai & Terverifikasi</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {colOrders.length === 0 && (
                    <div className="h-32 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400 font-medium">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Scan Barcode Keranjang */}
        {showScannerModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#0095FF]" />
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm font-black text-[#0095FF]"
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
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0095FF] font-mono text-[11px] font-bold cursor-pointer"
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
                    className="px-5 py-2 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold cursor-pointer"
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
