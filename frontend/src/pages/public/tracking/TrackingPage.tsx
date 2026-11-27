import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { getCurrentUser } from '../../../services/authService';
import {
  Search,
  CheckCircle2,
  Clock,
  MessageCircle,
  Copy,
  Check,
  Truck,
  Sparkles,
  ShieldCheck,
  PackageCheck,
  Waves,
  Flame,
  MapPin,
  Download,
  ArrowLeft,
  RefreshCw,
  Navigation,
} from 'lucide-react';

interface TimelineEvent {
  id: number;
  status: string;
  title: string;
  description: string;
  location: string;
  updated_by: string;
  timestamp: string;
}

interface TrackingData {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  weight_kg: number;
  fragrance: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  timeline: TimelineEvent[];
}

const PRESET_ORDERS: Record<string, TrackingData> = {
  'KCK-2026-001': {
    order_number: 'KCK-2026-001',
    customer_name: 'Budi Santoso',
    customer_phone: '0812****432',
    service_type: 'Cuci Setrika Kiloan Reguler',
    weight_kg: 4.5,
    fragrance: 'Ocean Fresh',
    total_amount: 36000,
    status: 'setrika',
    payment_status: 'paid',
    created_at: '2026-11-27T09:49:57.885312+07:00',
    timeline: [
      {
        id: 1,
        status: 'terima',
        title: 'Cucian Diterima di Outlet',
        description: 'Laundry ditimbang 4.50 Kg dan dipasangi barcode identitas anti-tertukar.',
        location: 'Kucek Hub Kaliurang KM 5',
        updated_by: 'Kasir Outlet',
        timestamp: '09:49 WIB',
      },
      {
        id: 2,
        status: 'cuci',
        title: 'Pencucian Higienis (1 Mesin 1 Pelanggan)',
        description: 'Dicuci tersendiri dengan deterjen ramah serat dan pelembut Ocean Fresh.',
        location: 'Ruang Produksi Mesin A2',
        updated_by: 'Operator Dedi',
        timestamp: '10:49 WIB',
      },
      {
        id: 3,
        status: 'kering',
        title: 'Pengeringan Tabung Suhu 60°C',
        description: 'Suhu panas membasmi tungau & bakteri, pakaian bebas debu luar.',
        location: 'Ruang Dryer B1',
        updated_by: 'Operator Dedi',
        timestamp: '11:49 WIB',
      },
      {
        id: 4,
        status: 'setrika',
        title: 'Setrika Uap Rapi & Quality Control',
        description: 'Sedang di-steam dengan uap murni dan dilipat rapi sesuai standar kucek.id.',
        location: 'Meja Finishing & Packing',
        updated_by: 'Staff Dina',
        timestamp: '13:19 WIB',
      },
    ],
  },
  'KCK-2026-002': {
    order_number: 'KCK-2026-002',
    customer_name: 'Budi Santoso',
    customer_phone: '0812****432',
    service_type: 'Dry Clean Jas & Satuan',
    weight_kg: 2.0,
    fragrance: 'Sakura Blossom',
    total_amount: 65000,
    status: 'cuci',
    payment_status: 'unpaid',
    created_at: '2026-11-25T11:15:00+07:00',
    timeline: [
      {
        id: 1,
        status: 'terima',
        title: 'Jas Diterima di Outlet',
        description: 'Pengecekan bahan jas eksekutif dan pemisahan kancing khusus.',
        location: 'Kucek Hub Kaliurang',
        updated_by: 'Kasir Outlet',
        timestamp: '11:15 WIB',
      },
      {
        id: 2,
        status: 'cuci',
        title: 'Proses Dry Clean Ramah Serat',
        description: 'Pencucian khusus dry clean tanpa merusak serat kain jas wol.',
        location: 'Stasiun Dry Clean',
        updated_by: 'Spesialis Reza',
        timestamp: '12:30 WIB',
      },
    ],
  },
  'KCK-2026-003': {
    order_number: 'KCK-2026-003',
    customer_name: 'Budi Santoso',
    customer_phone: '0812****432',
    service_type: 'Jemput Antar Kiloan',
    weight_kg: 5.0,
    fragrance: 'Lavender Calm',
    total_amount: 32000,
    status: 'terima',
    payment_status: 'paid',
    created_at: '2026-11-27T13:30:00+07:00',
    timeline: [
      {
        id: 1,
        status: 'terima',
        title: 'Dijemput Armada Kurir 02',
        description: 'Cucian 5.0 Kg telah dijemput Kurir Andi Wijaya menuju Kucek Hub.',
        location: 'Jl. Kaliurang KM 5 No. 12',
        updated_by: 'Kurir Andi Wijaya',
        timestamp: '13:30 WIB',
      },
    ],
  },
};

const MASTER_STAGES = [
  { key: 'terima', label: 'Diterima', subLabel: 'Timbang & Tag', time: '09:49', icon: PackageCheck },
  { key: 'cuci', label: 'Pencucian', subLabel: '1 Mesin 1 User', time: '10:49', icon: Waves },
  { key: 'kering', label: 'Pengering', subLabel: 'Dryer 60°C', time: '11:49', icon: Flame },
  { key: 'setrika', label: 'Setrika Uap', subLabel: 'Steam & Parfum', time: '13:19', icon: Sparkles },
  { key: 'packing', label: 'QC & Packing', subLabel: 'Segel Higienis', time: 'Est 15:30', icon: ShieldCheck },
  { key: 'siap_antar', label: 'Pengantaran', subLabel: 'Armada Kurir', time: 'Est 17:00', icon: Truck },
];

export const TrackingPage: React.FC = () => {
  const { resi } = useParams<{ resi?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();
  const isCustomerPortal = !!currentUser || location.pathname.startsWith('/app');

  const normalizedResi = (resi || 'KCK-2026-001').toUpperCase().trim();
  const [searchInput, setSearchInput] = useState(normalizedResi);
  const [copiedResi, setCopiedResi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData>(
    PRESET_ORDERS[normalizedResi] || PRESET_ORDERS['KCK-2026-001']
  );

  useEffect(() => {
    setSearchInput(normalizedResi);
    setIsLoading(true);
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

    fetch(`${apiBase}/track/${normalizedResi}`)
      .then((res) => {
        if (!res.ok) throw new Error('Resi not found');
        return res.json();
      })
      .then((payload) => {
        if (payload?.success && payload?.data) {
          const d = payload.data;
          setTrackingData({
            order_number: d.order_number || normalizedResi,
            customer_name: d.customer_name || 'Pelanggan Kucek',
            customer_phone: d.customer_phone || '0812****000',
            service_type:
              d.service_type === 'kiloan'
                ? 'Cuci Setrika Kiloan Reguler'
                : d.service_type === 'satuan'
                ? 'Dry Clean & Satuan'
                : d.service_type || 'Laundry Kiloan',
            weight_kg: d.weight_kg || 4.5,
            fragrance:
              d.fragrance === 'ocean_fresh'
                ? 'Ocean Fresh'
                : d.fragrance === 'sakura_blossom'
                ? 'Sakura Blossom'
                : d.fragrance === 'vanilla_mist'
                ? 'Vanilla Mist'
                : d.fragrance || 'Ocean Fresh',
            total_amount: d.total_amount || 36000,
            status: d.status || 'setrika',
            payment_status: d.payment_status || 'paid',
            created_at: d.created_at || '2026-11-27T09:49:57Z',
            timeline:
              Array.isArray(d.timeline) && d.timeline.length > 0
                ? d.timeline.map((t: any) => ({
                    id: t.id,
                    status: t.status,
                    title: t.title,
                    description: t.description,
                    location: t.location,
                    updated_by: t.updated_by,
                    timestamp: t.timestamp
                      ? new Date(t.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        }) + ' WIB'
                      : 'Tercatat',
                  }))
                : PRESET_ORDERS['KCK-2026-001'].timeline,
          });
        } else if (PRESET_ORDERS[normalizedResi]) {
          setTrackingData(PRESET_ORDERS[normalizedResi]);
        }
      })
      .catch(() => {
        if (PRESET_ORDERS[normalizedResi]) {
          setTrackingData(PRESET_ORDERS[normalizedResi]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [normalizedResi]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;
    if (isCustomerPortal) {
      navigate(`/app/lacak/${query}`);
    } else {
      navigate(`/track/${query}`);
    }
  };

  const handleSelectSample = (code: string) => {
    setSearchInput(code);
    if (isCustomerPortal) {
      navigate(`/app/lacak/${code}`);
    } else {
      navigate(`/track/${code}`);
    }
  };

  const handleCopyResi = () => {
    navigator.clipboard.writeText(trackingData.order_number);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  const statusToStageMap: Record<string, number> = {
    terima: 0,
    queued: 0,
    cuci: 1,
    washing: 1,
    kering: 2,
    drying: 2,
    setrika: 3,
    ironing: 3,
    packing: 4,
    siap_antar: 5,
    kirim: 5,
    ready: 5,
    selesai: 5,
    completed: 5,
  };

  const currentStageIndex = statusToStageMap[trackingData.status.toLowerCase()] ?? 3;
  const progressPercent = Math.min(
    100,
    Math.round(((currentStageIndex + 0.65) / MASTER_STAGES.length) * 100)
  );

  const getStatusLabelText = () => {
    switch (trackingData.status.toLowerCase()) {
      case 'menunggu_jemput':
        return 'Menunggu Penjemputan Kurir';
      case 'diambil_kurir':
        return 'Diambil Kurir Menuju Outlet';
      case 'terima':
        return 'Diterima & Timbang di Outlet';
      case 'cuci':
        return 'Pencucian Tabung Khusus';
      case 'kering':
        return 'Pengeringan Suhu 60°C';
      case 'setrika':
        return 'Setrika Uap & QC';
      case 'packing':
        return 'Segel Packing Higienis';
      case 'diantar_kurir':
        return 'Sedang Diantar Kurir ke Rumah';
      case 'selesai':
        return 'Selesai & Diterima Pelanggan';
      default:
        return 'Sedang Diproses';
    }
  };

  const trackingMainContent = (
    <div className="max-w-[1280px] mx-auto space-y-6">
      {/* Top Heading + Search Bar Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
            Lacak Resi Live
          </h1>
          <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
            Telemetri pengerjaan cucian 1 Mesin 1 Pelanggan dan status kurir antar-jemput
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ketik nomor resi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0095FF] shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold shadow-[0_4px_12px_rgba(0,149,255,0.35)] transition cursor-pointer shrink-0"
            >
              Lacak
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 400);
            }}
            title="Segarkan Status"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0095FF] transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0095FF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Switcher Resi Aktif */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-semibold text-[#94A3B8]">Pilih Resi Cepat:</span>
        {[
          { code: 'KCK-2026-001', label: 'Setrika Uap • 78%' },
          { code: 'KCK-2026-002', label: 'Proses Cuci • 35%' },
          { code: 'KCK-2026-003', label: 'Dijemput Kurir • 15%' },
        ].map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => handleSelectSample(s.code)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              normalizedResi === s.code
                ? 'bg-[#0095FF] text-white shadow-2xs'
                : 'bg-white border border-slate-200/80 text-[#64748B] hover:text-[#111827]'
            }`}
          >
            <span className="font-mono">{s.code}</span>
            <span className="ml-1.5 opacity-85 font-normal">({s.label})</span>
          </button>
        ))}
      </div>

      {/* ROW 1: 3 TechBomb Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Nomor Resi & Tahap Aktif */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[132px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-semibold text-[#94A3B8]">
                Resi #{trackingData.order_number}
              </span>
              <button
                type="button"
                onClick={handleCopyResi}
                className="text-slate-400 hover:text-[#0095FF] transition cursor-pointer"
                title="Salin Nomor Resi"
              >
                {copiedResi ? (
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0095FF] text-[10.5px] font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0095FF] animate-ping" />
              Live
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <span className="text-[20px] sm:text-[22px] font-black text-[#111827] tracking-tight leading-none block">
                {getStatusLabelText()}
              </span>
              <p className="text-[11px] font-medium text-[#64748B] mt-1.5">
                {trackingData.service_type} ({trackingData.weight_kg.toFixed(2)} Kg)
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Estimasi Selesai & Progress Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[132px]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#94A3B8]">
              Estimasi Selesai & Antar
            </span>
            <Clock className="w-4 h-4 text-[#0095FF]" />
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[20px] sm:text-[22px] font-black text-[#111827] tracking-tight">
                Hari ini, 17:00 WIB
              </span>
              <span className="text-xs font-extrabold text-[#0095FF]">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0095FF] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Status Tagihan & Protokol Higienitas */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[132px] sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-[#94A3B8]">
              Tagihan & Aroma Pilihan
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                trackingData.payment_status === 'paid'
                  ? 'bg-[#E6F8F3] text-[#10B981]'
                  : 'bg-[#FEECEB] text-[#F43F5E]'
              }`}
            >
              {trackingData.payment_status === 'paid' ? 'Lunas • QRIS' : 'Belum Bayar'}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <span className="text-[23px] sm:text-[25px] font-black text-[#111827] tracking-tight leading-none">
              Rp {trackingData.total_amount.toLocaleString('id-ID')}
            </span>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4F8FD] text-[#0095FF] text-[10.5px] font-extrabold">
                {trackingData.fragrance}
              </span>
              <p className="text-[10px] font-medium text-[#CBD5E1] mt-1">
                1 Mesin 1 Pelanggan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: Connected Pipeline Stepper Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-[16px] font-extrabold text-[#111827] tracking-tight">
              Alur Produksi & Pengantaran
            </h2>
            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">
              Tahap {currentStageIndex + 1} dari {MASTER_STAGES.length} • Diawasi sensor IoT & staf QC Kucek Hub
            </p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-[#F5F7FA] text-[#64748B] text-[11px] font-bold">
            Stasiun Aktif: Meja Steam Uap #04
          </span>
        </div>

        {/* Desktop Connected Horizontal Stepper */}
        <div className="hidden md:block relative pt-2 pb-1">
          {/* Background Track Line */}
          <div className="absolute top-7 left-[8%] right-[8%] h-1 bg-slate-100 rounded-full" />
          {/* Active Fill Line */}
          <div
            className="absolute top-7 left-[8%] h-1 bg-[#0095FF] rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(84, (currentStageIndex / (MASTER_STAGES.length - 1)) * 84)}%`,
            }}
          />

          <div className="relative z-10 grid grid-cols-6 gap-2">
            {MASTER_STAGES.map((stg, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const Icon = stg.icon;

              return (
                <div key={stg.key} className="flex flex-col items-center text-center px-1">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-[#0095FF] text-white ring-4 ring-[#0095FF]/15 shadow-[0_6px_16px_-2px_rgba(0,149,255,0.45)] scale-105'
                        : isPassed
                        ? 'bg-[#10B981] text-white shadow-xs'
                        : 'bg-[#F5F7FA] text-[#94A3B8] border border-slate-200/80'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <p
                    className={`text-xs font-extrabold mt-3 ${
                      isCurrent
                        ? 'text-[#0095FF]'
                        : isPassed
                        ? 'text-[#111827]'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {stg.label}
                  </p>
                  <p className="text-[10.5px] text-[#94A3B8] font-medium mt-0.5">
                    {stg.subLabel}
                  </p>
                  <span
                    className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-sky-50 text-[#0095FF]'
                        : isPassed
                        ? 'bg-[#E6F8F3] text-[#10B981]'
                        : 'text-slate-400'
                    }`}
                  >
                    {stg.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Compact 2x3 Grid Stepper (< 768px) */}
        <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {MASTER_STAGES.map((stg, idx) => {
            const isPassed = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stg.icon;

            return (
              <div
                key={stg.key}
                className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  isCurrent
                    ? 'bg-sky-50/60 border-[#0095FF]'
                    : isPassed
                    ? 'bg-white border-slate-200/80'
                    : 'bg-[#F8FAFC] border-slate-100 opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-[#0095FF] text-white'
                      : isPassed
                      ? 'bg-[#10B981] text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-extrabold truncate ${
                      isCurrent
                        ? 'text-[#0095FF]'
                        : isPassed
                        ? 'text-[#111827]'
                        : 'text-slate-400'
                    }`}
                  >
                    {stg.label}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] truncate">{stg.subLabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROW 3: Two-Column Bento Details (7 Cols Activity Log + Route / 5 Cols Courier + e-Nota) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols */}
        <div className="lg:col-span-7 space-y-5">
          {/* Live Route Visualizer Banner */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#0095FF]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                  Rute Pengantaran Armada
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#0095FF] bg-sky-50 px-2.5 py-0.5 rounded-md">
                Jarak 2.4 Km • ±12 Menit
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-dashed border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                  Titik Asal Outlet
                </span>
                <p className="text-xs font-extrabold text-[#111827] mt-0.5">
                  Kucek Hub Kaliurang KM 5
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[#0095FF] flex-1 max-w-[140px] mx-2">
                <span className="w-2 h-2 rounded-full bg-[#0095FF]" />
                <div className="flex-1 border-t-2 border-dashed border-[#0095FF]" />
                <Truck className="w-4 h-4 shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-slate-300" />
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">
                  Titik Antar Pelanggan
                </span>
                <p className="text-xs font-extrabold text-[#111827] mt-0.5">
                  Jl. Kaliurang KM 5 No. 12, Sleman
                </p>
              </div>
            </div>
          </div>

          {/* Card: Live Physical Timeline */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#111827] tracking-tight">
                  Jejak Aktivitas & Log Produksi
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Audit stempel waktu resmi operator kucek.id
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#64748B] bg-[#F5F7FA] px-2.5 py-1 rounded-lg">
                {trackingData.timeline.length} Log Tercatat
              </span>
            </div>

            <div className="relative pl-5 border-l-2 border-slate-100 ml-2.5 space-y-4">
              {trackingData.timeline.map((evt, i) => {
                const isLatest = i === trackingData.timeline.length - 1;
                return (
                  <div key={evt.id || i} className="relative">
                    <div
                      className={`absolute -left-[27px] top-2 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isLatest
                          ? 'bg-[#0095FF] ring-3 ring-[#0095FF]/20'
                          : 'bg-[#10B981]'
                      }`}
                    />
                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 hover:border-slate-200 transition">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-extrabold text-[#111827]">
                          {evt.title}
                        </span>
                        <span className="text-[10.5px] font-bold text-[#0095FF] bg-sky-50 px-2 py-0.5 rounded-md">
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#94A3B8]">
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <MapPin className="w-3 h-3 text-[#0095FF]" />
                          {evt.location}
                        </span>
                        <span>Petugas: {evt.updated_by}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Courier Dispatch + e-Nota + Hygiene SOP */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Kurir Antar-Jemput */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-[#111827] tracking-tight">
                Kurir & Armada Tugas
              </h3>
              <span className="text-[10.5px] font-extrabold text-[#10B981] bg-[#E6F8F3] px-2.5 py-0.5 rounded-md">
                Kurir Siaga
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Kurir Raka Pratama"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#111827] truncate">
                    Raka Pratama (Armada 01)
                  </p>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    Honda Vario 160 • AB 4521 XY
                  </p>
                  <p className="text-[10.5px] font-bold text-amber-500 mt-0.5">
                    ★ 4.95 • 1.240 Pengantaran
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/6281298765432?text=Halo%20Kurir%20Raka,%20saya%20pelanggan%20resi%20${trackingData.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Kurir via WhatsApp</span>
            </a>
          </div>

          {/* Card: e-Nota Digital */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-[15px] font-extrabold text-[#111827] tracking-tight">
                Rincian e-Nota Cucian
              </h3>
              <span className="font-mono text-xs font-bold text-[#94A3B8]">
                #{trackingData.order_number}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Nama Pelanggan:</span>
                <span className="font-bold text-[#111827]">{trackingData.customer_name}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>WhatsApp Terdaftar:</span>
                <span className="font-bold text-[#111827]">{trackingData.customer_phone}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Jenis Layanan:</span>
                <span className="font-bold text-[#111827]">{trackingData.service_type}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Bobot Timbang:</span>
                <span className="font-extrabold text-[#0095FF]">
                  {trackingData.weight_kg.toFixed(2)} KG
                </span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Karakter Parfum:</span>
                <span className="font-bold text-[#111827]">{trackingData.fragrance}</span>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-baseline">
                <span className="font-extrabold text-[#111827]">Total Tagihan:</span>
                <span className="text-lg font-black text-[#0095FF]">
                  Rp {trackingData.total_amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Mengunduh e-Nota #${trackingData.order_number}...`)}
              className="w-full py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-slate-200/80 text-[#111827] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh e-Nota Digital (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isCustomerPortal) {
    return <CustomerLayout>{trackingMainContent}</CustomerLayout>;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-baseline tracking-tight">
            <span className="text-[22px] font-black text-[#0095FF]">kucek</span>
            <span className="text-[22px] font-black text-[#111827]">.id</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#0095FF] text-white text-xs font-bold shadow-xs hover:bg-[#0080DB] transition"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {trackingMainContent}
      </main>
    </div>
  );
};

export default TrackingPage;
