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
  { key: 'terima', label: 'Diterima', subLabel: 'Outlet / Kurir', icon: PackageCheck },
  { key: 'cuci', label: 'Cuci Higienis', subLabel: '1 Mesin 1 Pelanggan', icon: Waves },
  { key: 'kering', label: 'Pengering', subLabel: 'Suhu Panas 60°C', icon: Flame },
  { key: 'setrika', label: 'Setrika Uap', subLabel: 'Rapi & Parfum', icon: Sparkles },
  { key: 'packing', label: 'QC & Packing', subLabel: 'Segel Higienis', icon: ShieldCheck },
  { key: 'siap_antar', label: 'Siap Diantar', subLabel: 'Menuju Alamat', icon: Truck },
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
      case 'terima':
        return 'Diterima di Outlet';
      case 'cuci':
        return 'Sedang Dicuci (1 Mesin 1 Pelanggan)';
      case 'kering':
        return 'Pengeringan Suhu 60°C';
      case 'setrika':
        return 'Sedang Disetrika Uap & QC';
      case 'packing':
        return 'QC & Packing Kedap Udara';
      case 'selesai':
        return 'Selesai & Diterima Pelanggan';
      default:
        return 'Sedang Diproses';
    }
  };

  const trackingMainContent = (
    <div className="space-y-6">
      {/* Sleek Sub-Header with Slim Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Live Order Tracking
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-extrabold text-[#0095FF] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Sync
            </span>
          </div>
          <h1 className="text-[23px] font-black text-[#111827] tracking-tight">
            Lacak Resi Cucian
          </h1>
          <p className="text-[13px] text-[#64748B] font-medium mt-0.5">
            Pantau tahapan cuci 1 mesin 1 pelanggan dan pergerakan kurir secara langsung.
          </p>
        </div>

        {/* Compact Search & Refresh */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nomor resi..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#0095FF] w-48 sm:w-56 shadow-2xs"
            />
          </form>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 400);
            }}
            title="Segarkan data"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0095FF] hover:border-[#0095FF] transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0095FF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Pills for Sample Orders */}
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-semibold text-[#94A3B8]">Contoh Resi Aktif:</span>
        {[
          { code: 'KCK-2026-001', label: 'Setrika Uap • 75%' },
          { code: 'KCK-2026-002', label: 'Sedang Dicuci • 35%' },
          { code: 'KCK-2026-003', label: 'Dijemput Kurir • 15%' },
        ].map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => handleSelectSample(s.code)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition cursor-pointer ${
              normalizedResi === s.code
                ? 'bg-[#111827] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{s.code}</span>
            <span className="ml-1 opacity-75 font-sans font-normal text-[10px]">({s.label})</span>
          </button>
        ))}
      </div>

      {/* Clean White Status Hero Card (TechBomb Style, Non-Clunky) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-6">
        {/* Top Meta Tags */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#F5F7FA] border border-slate-200 text-[#111827] font-mono text-xs font-black">
                #{trackingData.order_number}
              </span>
              <button
                type="button"
                onClick={handleCopyResi}
                className="px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
              >
                {copiedResi ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </>
                )}
              </button>

              <span
                className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                  trackingData.payment_status === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {trackingData.payment_status === 'paid' ? 'Lunas • QRIS' : 'Menunggu Bayar'}
              </span>

              <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-[#0095FF] border border-sky-100 text-[10.5px] font-extrabold">
                1 Mesin 1 Pelanggan
              </span>
            </div>

            <div className="flex items-center gap-2.5 mt-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                {getStatusLabelText()}
              </h2>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0095FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0095FF]" />
              </span>
            </div>

            <p className="text-xs text-[#64748B] mt-1">
              {trackingData.service_type} ({trackingData.weight_kg.toFixed(2)} Kg) • Pilihan Aroma:{' '}
              <b className="text-slate-800">{trackingData.fragrance}</b>
            </p>
          </div>

          {/* Right ETA Card */}
          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100 flex flex-col justify-between min-w-[240px]">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#94A3B8] mb-1">
              <span>Estimasi Cucian Selesai</span>
              <Clock className="w-3.5 h-3.5 text-[#0095FF]" />
            </div>
            <p className="text-base font-extrabold text-[#111827]">
              Hari ini, 17:00 WIB
            </p>
            <p className="text-[11px] text-[#64748B]">Sisa estimasi pengerjaan: ± 1-2 Jam</p>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60">
              <div className="flex justify-between text-[11px] font-extrabold mb-1">
                <span className="text-[#64748B]">Progres Pengerjaan</span>
                <span className="text-[#0095FF]">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0095FF] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sleek Connected Stepper (Horizontal on Desktop, Clean) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#94A3B8]">
              Alur Pengerjaan Cucian
            </h3>
            <span className="text-xs font-bold text-[#64748B]">
              Tahap {currentStageIndex + 1} dari {MASTER_STAGES.length}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 sm:gap-3">
            {MASTER_STAGES.map((stg, idx) => {
              const isPassed = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const Icon = stg.icon;

              return (
                <div
                  key={stg.key}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-sky-50/50 border-[#0095FF] shadow-xs'
                      : isPassed
                      ? 'bg-white border-slate-200'
                      : 'bg-[#F8FAFC] border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-[#0095FF] text-white shadow-xs'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold ${
                        isCurrent ? 'text-[#0095FF]' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      Step {idx + 1}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-extrabold truncate ${
                      isCurrent ? 'text-[#0095FF]' : isPassed ? 'text-[#111827]' : 'text-slate-400'
                    }`}
                  >
                    {stg.label}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5 truncate">
                    {stg.subLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-Column Bento Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Real Activity Logs + SOP Higienis */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Live Physical Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
              <div>
                <h3 className="text-sm font-extrabold text-[#111827] tracking-tight">
                  Jejak Aktivitas & Log Produksi
                </h3>
                <p className="text-xs text-[#94A3B8]">Audit stempel waktu resmi operator kucek.id</p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {trackingData.timeline.length} Aktivitas
              </span>
            </div>

            <div className="relative pl-5 border-l-2 border-slate-100 ml-2.5 space-y-5">
              {trackingData.timeline.map((evt, i) => {
                const isLatest = i === trackingData.timeline.length - 1;
                return (
                  <div key={evt.id || i} className="relative">
                    <div
                      className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isLatest ? 'bg-[#0095FF] ring-2 ring-sky-200' : 'bg-emerald-500'
                      }`}
                    />
                    <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-[#111827]">{evt.title}</span>
                        <span className="text-[10.5px] font-bold text-[#0095FF] bg-sky-50 px-2 py-0.5 rounded">
                          {evt.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">{evt.description}</p>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#94A3B8]">
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {evt.location}
                        </span>
                        <span>Oleh: {evt.updated_by}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Hygiene Guarantees */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                Standar Higienitas Kucek.id
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
                <p className="font-bold text-[#111827]">100% Tidak Dicampur</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">1 Mesin cuci khusus 1 pelanggan.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
                <p className="font-bold text-[#111827]">Dryer Panas 60°C</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Bebas debu jalanan & basmi tungau.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
                <p className="font-bold text-[#111827]">Parfum 14 Hari</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Grade konsentrat tinggi tahan lama.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
                <p className="font-bold text-[#111827]">Garansi Cuci Ulang</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Gratis cuci ulang bila kurang wangi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Kurir & e-Nota Digital */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Kurir */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                Kurir Antar-Jemput
              </h3>
              <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Siaga
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Kurir"
                className="w-11 h-11 rounded-xl object-cover border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-[#111827]">Raka Pratama</p>
                <p className="text-[11px] text-[#64748B]">Kurir Resmi Kucek • Armada 01</p>
                <p className="text-[10.5px] text-slate-500 font-semibold mt-0.5">
                  Honda Vario 160 (AB 4521 XY)
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/6281298765432?text=Halo%20Kurir%20Raka,%20saya%20pelanggan%20resi%20${trackingData.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp Kurir</span>
            </a>
          </div>

          {/* Card: e-Nota Digital */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.05)] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                Rincian e-Nota
              </h3>
              <span className="font-mono text-xs font-bold text-[#94A3B8]">
                #{trackingData.order_number}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Pelanggan:</span>
                <span className="font-bold text-[#111827]">{trackingData.customer_name}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Layanan:</span>
                <span className="font-bold text-[#111827]">{trackingData.service_type}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Bobot Cucian:</span>
                <span className="font-bold text-[#0095FF]">{trackingData.weight_kg.toFixed(2)} KG</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Pilihan Aroma:</span>
                <span className="font-bold text-[#111827]">{trackingData.fragrance}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="font-extrabold text-[#111827]">Total Tagihan:</span>
                <span className="text-base font-black text-[#0095FF]">
                  Rp {trackingData.total_amount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Mengunduh e-Nota #${trackingData.order_number}...`)}
              className="w-full mt-2 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 text-[#111827] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh e-Nota (PDF)</span>
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
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
