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
  FileText,
  Download,
  Share2,
  ArrowLeft,
  RefreshCw,
  Phone,
  User,
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

// Fallback preset demo orders
const PRESET_ORDERS: Record<string, TrackingData> = {
  'KCK-2026-001': {
    order_number: 'KCK-2026-001',
    customer_name: 'Budi Santoso',
    customer_phone: '0812****432',
    service_type: 'Cuci Setrika Kiloan Reguler',
    weight_kg: 4.5,
    fragrance: 'Ocean Fresh (Tahan 14 Hari)',
    total_amount: 36000,
    status: 'setrika',
    payment_status: 'paid',
    created_at: '2026-11-27T09:49:57.885312+07:00',
    timeline: [
      {
        id: 1,
        status: 'terima',
        title: 'Cucian Diterima Kasir',
        description: 'Laundry ditimbang 4.50 Kg dan dipasangi barcode identitas anti-tertukar.',
        location: 'Kucek Hub Kaliurang KM 5',
        updated_by: 'Superadmin Kucek',
        timestamp: '27 Nov 2026, 09:49 WIB',
      },
      {
        id: 2,
        status: 'cuci',
        title: 'Pencucian Higienis (1 Mesin 1 Pelanggan)',
        description: 'Dicuci tersendiri dengan deterjen ramah serat dan pelembut Ocean Fresh.',
        location: 'Ruang Produksi Mesin A2',
        updated_by: 'Operator Produksi (Dedi)',
        timestamp: '27 Nov 2026, 10:49 WIB',
      },
      {
        id: 3,
        status: 'kering',
        title: 'Pengeringan Tabung Suhu Terkontrol 60°C',
        description: 'Suhu panas membasmi tungau & bakteri, pakaian bebas dari debu luar.',
        location: 'Ruang Dryer B1',
        updated_by: 'Operator Produksi (Dedi)',
        timestamp: '27 Nov 2026, 11:49 WIB',
      },
      {
        id: 4,
        status: 'setrika',
        title: 'Setrika Uap Rapi & Quality Control',
        description: 'Sedang di-steam dengan uap murni dan dilipat rapi sesuai standar kucek.id.',
        location: 'Meja Finishing & Packing',
        updated_by: 'Staff Finishing (Siti)',
        timestamp: '27 Nov 2026, 13:19 WIB',
      },
    ],
  },
  'KCK-2026-002': {
    order_number: 'KCK-2026-002',
    customer_name: 'Budi Santoso',
    customer_phone: '0812****432',
    service_type: 'Kiloan Reguler 2 Hari',
    weight_kg: 3.2,
    fragrance: 'Sakura Blossom',
    total_amount: 25600,
    status: 'cuci',
    payment_status: 'paid',
    created_at: '2026-11-27T11:15:00+07:00',
    timeline: [
      {
        id: 1,
        status: 'terima',
        title: 'Cucian Diterima Kasir',
        description: 'Laundry ditimbang 3.20 Kg dan dipasangi barcode identitas.',
        location: 'Kucek Hub Kaliurang KM 5',
        updated_by: 'Kasir Outlet',
        timestamp: '27 Nov 2026, 11:15 WIB',
      },
      {
        id: 2,
        status: 'cuci',
        title: 'Pencucian Tabung Khusus',
        description: 'Proses cuci sedang berlangsung di tabung cuci Mesin C1.',
        location: 'Ruang Produksi Mesin C1',
        updated_by: 'Operator Cuci',
        timestamp: '27 Nov 2026, 11:45 WIB',
      },
    ],
  },
  'KCK-2026-003': {
    order_number: 'KCK-2026-003',
    customer_name: 'Budi Santoso',
    customer_phone: '0812****432',
    service_type: 'Jemput Antar Kiloan',
    weight_kg: 5.0,
    fragrance: 'French Lavender',
    total_amount: 40000,
    status: 'terima',
    payment_status: 'pending',
    created_at: '2026-11-27T13:30:00+07:00',
    timeline: [
      {
        id: 1,
        status: 'terima',
        title: 'Dijemput Armada Kurir',
        description: 'Cucian telah di-pickup oleh armada kurir dan dalam perjalanan ke Kucek Hub.',
        location: 'Armada Motor 02 (Andi Wijaya)',
        updated_by: 'Kurir Andi',
        timestamp: '27 Nov 2026, 13:30 WIB',
      },
    ],
  },
};

const MASTER_STAGES = [
  {
    key: 'terima',
    label: 'Diterima di Outlet',
    subLabel: 'Timbang & Tag Barcode',
    icon: PackageCheck,
    estTime: '09:30 WIB',
  },
  {
    key: 'cuci',
    label: 'Pencucian Higienis',
    subLabel: '1 Mesin 1 Pelanggan',
    icon: Waves,
    estTime: '10:45 WIB',
  },
  {
    key: 'kering',
    label: 'Pengering Suhu 60°C',
    subLabel: 'Bebas Debu & Tungau',
    icon: Flame,
    estTime: '11:45 WIB',
  },
  {
    key: 'setrika',
    label: 'Setrika Uap & QC',
    subLabel: 'Rapi & Semprot Parfum',
    icon: Sparkles,
    estTime: '13:20 WIB',
  },
  {
    key: 'packing',
    label: 'Packing Kedap Udara',
    subLabel: 'Segel Higienis Rapi',
    icon: ShieldCheck,
    estTime: 'Est. 15:30 WIB',
  },
  {
    key: 'siap_antar',
    label: 'Siap Diantar Kurir',
    subLabel: 'Menuju Alamat Anda',
    icon: Truck,
    estTime: 'Est. 17:00 WIB',
  },
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

  // Sinkronisasi data dari backend API
  useEffect(() => {
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
                : d.service_type || 'Laundry Kiloan',
            weight_kg: d.weight_kg || 4.5,
            fragrance:
              d.fragrance === 'ocean_fresh'
                ? 'Ocean Fresh (Tahan 14 Hari)'
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
                      : 'Waktu Tercatat',
                  }))
                : PRESET_ORDERS['KCK-2026-001'].timeline,
          });
        } else if (PRESET_ORDERS[normalizedResi]) {
          setTrackingData(PRESET_ORDERS[normalizedResi]);
        }
      })
      .catch(() => {
        // Fallback ke preset demo orders
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

  const handleSelectSample = (sampleCode: string) => {
    setSearchInput(sampleCode);
    if (isCustomerPortal) {
      navigate(`/app/lacak/${sampleCode}`);
    } else {
      navigate(`/track/${sampleCode}`);
    }
  };

  const handleCopyResi = () => {
    navigator.clipboard.writeText(trackingData.order_number);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  // Kalkulasi Stage Index
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

  const currentStageIndex =
    statusToStageMap[trackingData.status.toLowerCase()] ?? 3;
  const progressPercent = Math.min(
    100,
    Math.round(((currentStageIndex + 0.65) / MASTER_STAGES.length) * 100)
  );

  const currentStageName =
    MASTER_STAGES[currentStageIndex]?.label || 'Sedang Disetrika Uap';

  // Konten Utama Pelacak Resi
  const trackingMainContent = (
    <div className="space-y-6">
      {/* Sub-header & Resi Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0095FF] text-[11px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#0095FF] animate-pulse" />
              Live Real-Time Tracker
            </span>
            <span className="text-xs text-[#94A3B8]">
              Diperbarui: Baru saja
            </span>
          </div>
          <h1 className="text-[22px] sm:text-[25px] font-black text-[#111827] tracking-tight">
            Lacak Resi & Status Cucian
          </h1>
          <p className="text-[13px] text-[#64748B] font-medium mt-0.5">
            Pantau tahapan cuci higienis 1 mesin 1 pelanggan dan pergerakan armada kurir secara langsung.
          </p>
        </div>

        {/* Action: Refresh Button */}
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[#111827] hover:bg-slate-50 text-xs font-bold shadow-xs transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#0095FF] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Segarkan Status</span>
        </button>
      </div>

      {/* Resi Search Card with Quick Demo Selector */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ketik nomor resi (contoh: KCK-2026-001)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/90 text-[13.5px] font-bold text-[#111827] focus:bg-white focus:outline-none focus:border-[#0095FF] focus:ring-3 focus:ring-[#0095FF]/15 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-[13px] font-bold shadow-[0_6px_16px_-4px_rgba(0,149,255,0.4)] transition cursor-pointer shrink-0"
          >
            Lacak Resi
          </button>
        </form>

        {/* Quick Sample Resi Pills */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11.5px]">
          <span className="font-semibold text-[#94A3B8]">Cek Resi Sampel:</span>
          {[
            { code: 'KCK-2026-001', note: 'Setrika Uap • 75%' },
            { code: 'KCK-2026-002', note: 'Sedang Dicuci • 35%' },
            { code: 'KCK-2026-003', note: 'Dijemput Kurir • 15%' },
          ].map((sample) => (
            <button
              key={sample.code}
              type="button"
              onClick={() => handleSelectSample(sample.code)}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                normalizedResi === sample.code
                  ? 'bg-[#0095FF] text-white shadow-xs'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-slate-200'
              }`}
            >
              <span>{sample.code}</span>
              <span className="opacity-75 text-[10px] font-normal">({sample.note})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Live Status Bento Banner */}
      <div className="bg-gradient-to-br from-[#0095FF] to-[#0077CC] rounded-3xl p-6 sm:p-8 text-white shadow-[0_12px_30px_-8px_rgba(0,149,255,0.45)] relative overflow-hidden">
        {/* Subtle background glow circle */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-mono text-xs font-black tracking-wider">
                NO. RESI: {trackingData.order_number}
              </span>
              <button
                type="button"
                onClick={handleCopyResi}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition cursor-pointer"
              >
                {copiedResi ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Resi</span>
                  </>
                )}
              </button>
              <span className="px-2.5 py-1 rounded-full bg-emerald-400/25 text-emerald-100 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-300/30">
                {trackingData.payment_status === 'paid' ? 'Lunas • QRIS' : 'Menunggu Bayar'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{currentStageName}</span>
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400" />
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-white/90 text-xs font-semibold mt-3">
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-lg">
                <Waves className="w-3.5 h-3.5 text-sky-200" />
                {trackingData.service_type} ({trackingData.weight_kg.toFixed(2)} Kg)
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Aroma: {trackingData.fragrance}
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                Higienis 1 Mesin 1 Pelanggan
              </span>
            </div>
          </div>

          {/* Right side: ETA card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col justify-between shrink-0 min-w-[240px]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                Estimasi Cucian Selesai
              </p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-300" />
                <span>Hari ini, 17:00 WIB</span>
              </p>
              <p className="text-[11px] text-white/80 font-medium mt-1">
                Sisa estimasi pengerjaan: <b className="text-white">± 1-2 Jam</b>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15">
              <div className="flex justify-between text-xs font-extrabold text-white mb-1.5">
                <span>Progres Pengerjaan</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Milestone Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
            Tahapan Pengerjaan Laundry Kucek
          </h3>
          <span className="text-xs font-semibold text-[#94A3B8]">
            Langkah {currentStageIndex + 1} dari {MASTER_STAGES.length}
          </span>
        </div>

        {/* Stepper Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 relative">
          {MASTER_STAGES.map((stage, idx) => {
            const isPassed = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`flex flex-col p-3.5 rounded-2xl border transition relative ${
                  isCurrent
                    ? 'bg-[#F0F9FF] border-[#0095FF] ring-2 ring-[#0095FF]/20'
                    : isPassed
                    ? 'bg-[#F8FAFC] border-emerald-200'
                    : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                      isCurrent
                        ? 'bg-[#0095FF] text-white shadow-[0_4px_12px_rgba(0,149,255,0.4)]'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      isCurrent
                        ? 'bg-[#0095FF] text-white'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </div>

                <p
                  className={`text-[13px] font-extrabold tracking-tight ${
                    isCurrent
                      ? 'text-[#0095FF]'
                      : isPassed
                      ? 'text-[#111827]'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5 leading-snug">
                  {stage.subLabel}
                </p>
                <p className="text-[10px] font-bold text-[#94A3B8] mt-2">
                  {isPassed || isCurrent ? stage.estTime : 'Menunggu'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Activity Feed & Hygiene Certificate (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Live Production Activity Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
                  Log Aktivitas & Jejak Fisik Cucian
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Audit stempel waktu resmi operator kucek.id
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px]">
                {trackingData.timeline.length} Aktivitas
              </span>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-100 ml-3 space-y-6">
              {trackingData.timeline.map((evt, i) => {
                const isLatest = i === trackingData.timeline.length - 1;
                return (
                  <div key={evt.id || i} className="relative group">
                    {/* Milestone Dot */}
                    <div
                      className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white transition ${
                        isLatest
                          ? 'bg-[#0095FF] ring-4 ring-[#0095FF]/20'
                          : 'bg-emerald-500'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>

                    <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <h4 className="text-[13.5px] font-extrabold text-[#111827]">
                          {evt.title}
                        </h4>
                        <span className="text-[11px] font-bold text-[#0095FF] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#475569] font-medium leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B]">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {evt.location}
                        </span>
                        <span className="flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-slate-200/80">
                          <User className="w-3 h-3 text-slate-400" />
                          Oleh: {evt.updated_by}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Jaminan Higienis & SOP 1 Mesin 1 Pelanggan */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
                  Protokol Higienitas Terjamin
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  SOP Standar Kucek.id untuk kesehatan & kerapian pakaian
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-950">1 Mesin 1 Pelanggan</p>
                  <p className="text-[11px] text-emerald-800/80 font-medium mt-0.5">
                    Pakaian tidak pernah dicampur dengan milik orang lain.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0095FF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-sky-950">Dryer Panas 60°C</p>
                  <p className="text-[11px] text-sky-800/80 font-medium mt-0.5">
                    Bebas jemur jalanan, debu polusi, dan bakteri mati tuntas.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-950">Parfum Grade Premium</p>
                  <p className="text-[11px] text-amber-800/80 font-medium mt-0.5">
                    Aroma {trackingData.fragrance} tahan hingga 14 hari di lemari.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-purple-950">Garansi Cuci Ulang</p>
                  <p className="text-[11px] text-purple-800/80 font-medium mt-0.5">
                    100% cuci ulang gratis bila terbukti kurang bersih atau rapi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Kurir Armada & e-Nota Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Kurir & Armada Antar-Jemput */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
                Armada & Kurir Antar-Jemput
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold">
                Kurir Siaga
              </span>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Kurir kucek.id"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[#111827] truncate">
                  Raka Pratama
                </p>
                <p className="text-xs text-[#64748B] font-medium">
                  Kurir Resmi Kucek • Armada 01
                </p>
                <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-semibold mt-0.5">
                  <span className="text-amber-500">★ 4.95</span>
                  <span>•</span>
                  <span>Honda Vario 160 (AB 4521 XY)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Alamat Pengantaran
                </p>
                <p className="font-bold text-[#111827] mt-1">
                  Jl. Kaliurang KM 5 No. 12, Sleman
                </p>
                <p className="text-[#64748B] text-[11px] mt-0.5">
                  Catatan: Pagar hitam samping Masjid Al-Hidayah
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`https://wa.me/6281298765432?text=Halo%20Kurir%20Raka%20kucek.id,%20saya%20pelanggan%20resi%20${trackingData.order_number}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Kurir</span>
              </a>
              <button
                type="button"
                onClick={() => alert(`Nomor Kurir Raka: 0812-9876-5432 (Armada 01)`)}
                className="w-full py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 text-[#475569] font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Panggilan Telepon Kurir</span>
              </button>
            </div>
          </div>

          {/* Card: e-Nota Digital & Rincian Pembayaran */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0095FF]" />
                <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
                  e-Nota Digital Cucian
                </h3>
              </div>
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
                <span>Nomor HP (Terproteksi):</span>
                <span className="font-bold text-[#111827]">{trackingData.customer_phone}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Paket Layanan:</span>
                <span className="font-bold text-[#111827]">{trackingData.service_type}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Bobot Timbang:</span>
                <span className="font-bold text-[#0095FF]">{trackingData.weight_kg.toFixed(2)} KG</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Aroma Pilihan:</span>
                <span className="font-bold text-[#111827]">{trackingData.fragrance}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Tarif Per Kg:</span>
                <span className="font-bold text-[#111827]">Rp 8.000 / Kg</span>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-200 space-y-1.5">
                <div className="flex justify-between text-[#64748B]">
                  <span>Subtotal Laundry:</span>
                  <span className="font-bold text-[#111827]">
                    Rp {trackingData.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Diskon Kuota Member:</span>
                  <span className="font-bold text-emerald-600">- Rp 0</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 font-extrabold">
                  <span className="text-[#111827]">Total Bayar:</span>
                  <span className="text-base text-[#0095FF]">
                    Rp {trackingData.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert(`Mengunduh e-Nota digital #${trackingData.order_number}...`)}
                className="flex-1 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 text-[#111827] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh e-Nota</span>
              </button>
              <button
                type="button"
                onClick={handleCopyResi}
                className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 text-[#64748B] transition cursor-pointer"
                title="Bagikan Resi"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card: Bantuan & Customer Service */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#111827]">Ada pertanyaan cucian?</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Hubungi Customer Care Kucek Hub Kaliurang
              </p>
            </div>
            <a
              href={`https://wa.me/6281298765432?text=Halo%20Admin%20kucek.id,%20saya%20mau%20konfirmasi%20resi%20${trackingData.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition"
            >
              Kucek Care
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  // Jika diakses dari dalam Customer Dashboard (pengguna login / route /app)
  if (isCustomerPortal) {
    return <CustomerLayout>{trackingMainContent}</CustomerLayout>;
  }

  // Jika diakses secara publik (tamu yang mengecek resi langsung dari landing page)
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Modern Public Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="inline-flex items-baseline tracking-tight">
              <span className="text-[22px] font-black text-[#0095FF]">kucek</span>
              <span className="text-[22px] font-black text-[#111827] relative">
                .id
                <span className="absolute -bottom-1 left-0.5 right-0 h-[3px] bg-[#0095FF] rounded-full" />
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-xs font-bold text-[#64748B]">
              <Link to="/" className="hover:text-[#111827] transition">
                Beranda
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-[#0095FF]">Lacak Resi Live</span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-[#0095FF] hover:bg-[#0080DB] text-white text-xs font-bold shadow-[0_4px_12px_rgba(0,149,255,0.35)] transition"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {trackingMainContent}
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-slate-200/70 py-6 text-center text-xs text-[#94A3B8]">
        <p>© 2026 kucek.id • Layanan Laundry Kiloan & Satuan Higienis 1 Mesin 1 Pelanggan</p>
      </footer>
    </div>
  );
};

export default TrackingPage;
