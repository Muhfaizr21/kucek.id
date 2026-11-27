import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface CustomerOrderRow {
  id: string;
  serviceName: string;
  orderNumber: string;
  dateAdded: string;
  priceText: string;
  statusLabel: string;
  statusType: 'in_process' | 'completed' | 'unpaid';
  qtyText: string;
}

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();

  // State terhubung ke Backend API (/api/v1/customer/hub) dengan initial fallback data kaya
  const [remainingQuotaKg, setRemainingQuotaKg] = useState<number>(15.5);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('KCK-2026-001');
  const monthlyUsageKg = 38.5;
  const monthlySpendRp = 166000;

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    fetch(`${apiBase}/customer/hub`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && payload?.data?.customer) {
          const cust = payload.data.customer;
          if (typeof cust.remaining_quota_kg === 'number') {
            setRemainingQuotaKg(cust.remaining_quota_kg);
          }
          if (
            Array.isArray(payload.data.active_orders) &&
            payload.data.active_orders.length > 0
          ) {
            const latest = payload.data.active_orders[0];
            if (latest.order_number) setActiveOrderNumber(latest.order_number);
          }
        }
      })
      .catch(() => {
        // Gunakan data default jika server lokal sedang tidak aktif
      });
  }, []);

  // 18 Bar Data untuk Grafik Batang Vertikal Bulat (identik dengan visual "Sales This Months" di referensi)
  const monthlyBarData = [
    { day: '01 Nov', heightPct: 52, kg: '4.2 Kg' },
    { day: '03 Nov', heightPct: 82, kg: '6.8 Kg' },
    { day: '05 Nov', heightPct: 68, kg: '5.5 Kg' },
    { day: '07 Nov', heightPct: 84, kg: '7.0 Kg' },
    { day: '09 Nov', heightPct: 26, kg: '2.1 Kg' },
    { day: '10 Nov', heightPct: 58, kg: '4.6 Kg' },
    { day: '12 Nov', heightPct: 82, kg: '6.7 Kg' },
    { day: '14 Nov', heightPct: 48, kg: '3.9 Kg' },
    { day: '16 Nov', heightPct: 26, kg: '2.0 Kg' },
    { day: '18 Nov', heightPct: 50, kg: '4.1 Kg' },
    { day: '20 Nov', heightPct: 63, kg: '5.2 Kg' },
    { day: '22 Nov', heightPct: 84, kg: '7.1 Kg' },
    { day: '24 Nov', heightPct: 52, kg: '4.3 Kg' },
    { day: '26 Nov', heightPct: 83, kg: '6.9 Kg' },
    { day: '28 Nov', heightPct: 51, kg: '4.2 Kg' },
    { day: '30 Nov', heightPct: 37, kg: '3.0 Kg' },
  ];

  // 3 Kartu Progres Cucian & Kurir (identik dengan visual "Product Delivery" di referensi)
  const deliveryProgressCards = [
    {
      id: activeOrderNumber,
      title: 'Cuci Setrika Kiloan • Ocean Fresh',
      toCustomer: 'Budi Santoso',
      fromOperator: 'Raka Pratama (Kurir)',
      badgeText: 'Selesai Diantar',
      badgeClass: 'bg-[#E6F8F3] text-[#10B981]',
      image: '/images/hero-stack.jpg',
    },
    {
      id: 'KCK-2026-002',
      title: 'Kiloan Reguler 4.5 Kg • Sakura',
      toCustomer: 'Budi Santoso',
      fromOperator: 'Dina (Meja Setrika Uap)',
      badgeText: 'Setrika Uap',
      badgeClass: 'bg-[#FEF6E0] text-[#EAB308]',
      image: '/images/auth-laundry.jpg',
    },
    {
      id: 'KCK-2026-003',
      title: 'Jemput Cucian • Gelombang Sore',
      toCustomer: 'Budi Santoso',
      fromOperator: 'Andi Wijaya (Armada 02)',
      badgeText: 'Dijemput Kurir',
      badgeClass: 'bg-[#E0F2FE] text-[#0095FF]',
      image: '/images/hero-stack.jpg',
    },
  ];

  // 6 Baris Tabel Riwayat & Rincian Nota (identik dengan visual "Stock Report" di referensi)
  const orderReportRows: CustomerOrderRow[] = [
    {
      id: '1',
      serviceName: 'Cuci Setrika Kiloan (Ocean Fresh)',
      orderNumber: `#${activeOrderNumber}`,
      dateAdded: '27 Nov, 2026',
      priceText: 'Rp 36.000',
      statusLabel: 'Disetrika Uap',
      statusType: 'in_process',
      qtyText: '4.50 KG',
    },
    {
      id: '2',
      serviceName: 'Dry Clean Jas & Blazer Eksekutif',
      orderNumber: '#KCK-2026-002',
      dateAdded: '22 Nov, 2026',
      priceText: 'Rp 65.000',
      statusLabel: 'Menunggu Bayar',
      statusType: 'unpaid',
      qtyText: '2 PCS',
    },
    {
      id: '3',
      serviceName: 'Bed Cover King Size + Sprei Set',
      orderNumber: '#KCK-2025-098',
      dateAdded: '18 Nov, 2026',
      priceText: 'Potong Kuota',
      statusLabel: 'Selesai & Rapi',
      statusType: 'completed',
      qtyText: '6.00 KG',
    },
    {
      id: '4',
      serviceName: 'Cuci Lipat Anak Kos (Vanilla Mist)',
      orderNumber: '#KCK-2025-084',
      dateAdded: '12 Nov, 2026',
      priceText: 'Potong Kuota',
      statusLabel: 'Selesai & Rapi',
      statusType: 'completed',
      qtyText: '5.20 KG',
    },
    {
      id: '5',
      serviceName: 'Treatment Noda Kemeja Putih',
      orderNumber: '#KCK-2025-071',
      dateAdded: '06 Nov, 2026',
      priceText: 'Rp 25.000',
      statusLabel: 'Selesai & Rapi',
      statusType: 'completed',
      qtyText: '3 PCS',
    },
    {
      id: '6',
      serviceName: 'Top-Up Paket Keluarga Ceria 50 Kg',
      orderNumber: '#PKG-KEL-050',
      dateAdded: '01 Nov, 2026',
      priceText: 'Rp 300.000',
      statusLabel: 'Kuota Aktif',
      statusType: 'in_process',
      qtyText: '50.0 KG',
    },
  ];

  // Avatar tim operator & kurir
  const teamAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  ];

  return (
    <CustomerLayout>
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* Page Heading */}
        <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
          Dashboard
        </h1>

        {/* ROW 1: 3 TOP KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Sisa Kuota Langganan */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[138px]">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-[#94A3B8]">
                Sisa Kuota Langganan
              </span>
              <Link
                to="/app/beli-paket"
                title="Tambah Kuota Paket"
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-5 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                {remainingQuotaKg.toFixed(2)} Kg
              </span>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E6F8F3] text-[#10B981] text-[10.5px] font-extrabold">
                  <TrendingUp className="w-3 h-3" />
                  5.5%
                </span>
                <p className="text-[10.5px] text-[#CBD5E1] font-medium mt-1">
                  Paket Keluarga Aktif s/d Des 2026
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Rata-rata / Pengeluaran Laundry */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[138px]">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-[#94A3B8]">
                Pengeluaran Bulan Ini
              </span>
              <Link
                to="/app/riwayat"
                title="Lihat Riwayat Pengeluaran"
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-5 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                Rp {monthlySpendRp.toLocaleString('id-ID')}
              </span>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFEBEB] text-[#F43F5E] text-[10.5px] font-extrabold">
                  <TrendingDown className="w-3 h-3" />
                  22.4%
                </span>
                <p className="text-[10.5px] text-[#CBD5E1] font-medium mt-1">
                  Lebih hemat dengan potong kuota
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Total Cucian Bersih & Tim Siaga */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[138px]">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-[#94A3B8]">
                Total Cucian Bersih Bulan Ini
              </span>
              <Link
                to={`/app/lacak/${activeOrderNumber}`}
                title="Lacak Pesanan Aktif"
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-3.5 flex items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold text-[#94A3B8] mb-1.5">
                  Tim Produksi & Kurir
                </p>
                <div className="flex items-center -space-x-2">
                  {teamAvatars.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="Kru Kucek"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                  <span className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#475569] text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    +8
                  </span>
                </div>
              </div>

              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                {monthlyUsageKg.toFixed(1)} Kg
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: BAR CHART (LEFT 7 COLS) & DONUT CHART (RIGHT 5 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 7 Cols: Vertical Blue Pill Bar Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Pemakaian Laundry Bulan Ini
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Akumulasi cucian kiloan & satuan dari semua layanan
                </p>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-black text-[#111827] leading-none">
                  {monthlyUsageKg.toFixed(2)} Kg
                </p>
                <p className="text-[11px] font-medium text-[#CBD5E1] mt-1">
                  Tersisa {remainingQuotaKg.toFixed(2)} Kg menuju batas kuota
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="mt-7 flex gap-4">
              {/* Y-Axis Labels */}
              <div className="flex flex-col justify-between text-[10.5px] font-semibold text-[#94A3B8] pb-6 select-none shrink-0">
                <span>10KG</span>
                <span>8KG</span>
                <span>6KG</span>
                <span>4KG</span>
                <span>2KG</span>
                <span>0KG</span>
              </div>

              {/* Bars + Grid Lines */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-[175px] flex items-end justify-between gap-1.5 sm:gap-2.5 px-2 pt-2 border-b border-slate-100">
                  {/* Horizontal subtle dashed guides */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((line) => (
                      <div
                        key={line}
                        className="w-full border-b border-dashed border-slate-100/90"
                      />
                    ))}
                  </div>

                  {/* 16 Rounded Vertical Blue Pill Bars */}
                  {monthlyBarData.map((bar, index) => (
                    <div
                      key={index}
                      className="relative z-10 flex-1 flex flex-col items-center justify-end h-full group"
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-[#111827] text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none shadow-md">
                        {bar.day}: {bar.kg}
                      </div>
                      <div
                        style={{ height: `${bar.heightPct}%` }}
                        className="w-2 sm:w-2.5 md:w-3 rounded-full bg-gradient-to-t from-[#0088FF] to-[#1AA3FF] group-hover:from-[#0066CC] group-hover:to-[#0095FF] transition-all duration-300 shadow-[0_4px_10px_-2px_rgba(0,149,255,0.4)]"
                      />
                    </div>
                  ))}
                </div>

                {/* X-Axis Labels */}
                <div className="flex items-center justify-between text-[10.5px] font-semibold text-[#94A3B8] pt-3 px-2 select-none">
                  <span>Nov 01</span>
                  <span>Nov 10</span>
                  <span>Nov 15</span>
                  <span>Nov 20</span>
                  <span>Nov 25</span>
                  <span>Nov 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Donut Chart (Komposisi Layanan) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Komposisi Layanan
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Rincian cucian dari semua kategori
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/app/beli-paket')}
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition cursor-pointer"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="my-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left Legend with Pill Indicators */}
              <div className="space-y-3.5 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-3 text-xs">
                  <span className="w-4 h-2 rounded-full bg-[#E5E7EB] shrink-0" />
                  <span className="text-[#94A3B8] font-medium min-w-[85px]">
                    Bed Cover
                  </span>
                  <span className="font-extrabold text-[#111827]">6.50 Kg</span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3 text-xs">
                  <span className="w-4 h-2 rounded-full bg-[#22C55E] shrink-0" />
                  <span className="text-[#94A3B8] font-medium min-w-[85px]">
                    Dry Clean
                  </span>
                  <span className="font-extrabold text-[#111827]">7.50 Kg</span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3 text-xs">
                  <span className="w-4 h-2 rounded-full bg-[#0095FF] shrink-0" />
                  <span className="text-[#94A3B8] font-medium min-w-[85px]">
                    Kiloan Rutin
                  </span>
                  <span className="font-extrabold text-[#111827]">24.50 Kg</span>
                </div>
              </div>

              {/* Right SVG 3-Segment Donut Chart matching reference screenshot */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  {/* Background Ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="15"
                  />
                  {/* Blue Segment (Kiloan Rutin ~58%) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#0095FF"
                    strokeWidth="15"
                    strokeDasharray="168 289"
                    strokeDashoffset="0"
                    strokeLinecap="butt"
                  />
                  {/* Green Segment (Dry Clean ~24%) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#2ECC71"
                    strokeWidth="15"
                    strokeDasharray="70 289"
                    strokeDashoffset="-218"
                    strokeLinecap="butt"
                  />
                </svg>

                {/* Center Label inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="text-[19px] font-black text-[#111827] leading-none">
                    {monthlyUsageKg.toFixed(2)} Kg
                  </span>
                  <span className="text-[9.5px] font-medium text-[#CBD5E1] mt-1">
                    Kuota 50 Kg Paket
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: DELIVERY PROGRESS (LEFT 5 COLS) & TRANSACTION REPORT TABLE (RIGHT 7 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 5 Cols: Progres Cucian & Kurir (matching "Product Delivery" dashed cards) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Progres Antar-Jemput
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  3 pesanan aktif & pengantaran terbaru
                </p>
              </div>
              <Link
                to={`/app/lacak/${activeOrderNumber}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-slate-200 text-[#64748B] text-[11px] font-bold transition shrink-0"
              >
                Lacak Resi
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {deliveryProgressCards.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/app/lacak/${item.id}`)}
                  className="p-3 rounded-2xl border border-dashed border-slate-200 hover:border-[#0095FF] transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-extrabold text-[#111827] truncate group-hover:text-[#0095FF] transition">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] text-[#94A3B8] font-medium mt-1">
                        <span>
                          Ke : <b className="text-slate-600">{item.toCustomer}</b>
                        </span>
                        <span>
                          Oleh : <b className="text-slate-600">{item.fromOperator}</b>
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold shrink-0 ${item.badgeClass}`}
                  >
                    {item.badgeText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 7 Cols: Riwayat & Nota Cucian Table (matching "Stock Report" table) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Rincian Nota & Kuota Cucian
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Total {orderReportRows.length} transaksi tercatat pada akun Anda
                </p>
              </div>
              <Link
                to="/app/pesan-jemput"
                className="px-3.5 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#0095FF] hover:text-white text-[#64748B] text-[11px] font-bold transition shrink-0"
              >
                Pesan Jemput +
              </Link>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#CBD5E1] border-b border-slate-100">
                    <th className="pb-3 pr-3 font-semibold">Layanan</th>
                    <th className="pb-3 px-2 font-semibold">No. Resi</th>
                    <th className="pb-3 px-2 font-semibold">Tanggal</th>
                    <th className="pb-3 px-2 font-semibold">Biaya</th>
                    <th className="pb-3 px-2 font-semibold">Status</th>
                    <th className="pb-3 pl-2 text-right font-semibold">Bobot / Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[12px]">
                  {orderReportRows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() =>
                        navigate(`/app/lacak/${row.orderNumber.replace('#', '')}`)
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-3 pr-3 font-bold text-[#111827]">
                        {row.serviceName}
                      </td>
                      <td className="py-3 px-2 font-semibold text-[#94A3B8]">
                        {row.orderNumber}
                      </td>
                      <td className="py-3 px-2 font-semibold text-[#64748B]">
                        {row.dateAdded}
                      </td>
                      <td className="py-3 px-2 font-bold text-[#111827]">
                        {row.priceText}
                      </td>
                      <td className="py-3 px-2 font-extrabold">
                        {row.statusType === 'in_process' && (
                          <span className="text-[#0095FF]">{row.statusLabel}</span>
                        )}
                        {row.statusType === 'completed' && (
                          <span className="text-[#10B981]">{row.statusLabel}</span>
                        )}
                        {row.statusType === 'unpaid' && (
                          <span className="text-[#F43F5E]">{row.statusLabel}</span>
                        )}
                      </td>
                      <td className="py-3 pl-2 text-right font-extrabold text-[#111827]">
                        {row.qtyText}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
