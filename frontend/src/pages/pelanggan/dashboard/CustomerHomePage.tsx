import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { MoreHorizontal, TrendingUp, TrendingDown, TicketPercent, ArrowRight } from 'lucide-react';
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

interface DeliveryCardItem {
  id: string;
  title: string;
  toCustomer: string;
  fromOperator: string;
  badgeText: string;
  badgeClass: string;
  image: string;
}

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate();

  // State terhubung penuh ke Backend API (/api/v1/customer/hub)
  const [remainingQuotaKg, setRemainingQuotaKg] = useState<number>(15.5);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('KCK-2026-001');
  const [monthlyUsageKg, setMonthlyUsageKg] = useState<number>(26.2);
  const [monthlySpendRp, setMonthlySpendRp] = useState<number>(203000);
  const [claimedVouchersCount, setClaimedVouchersCount] = useState<number>(3);
  const [composition, setComposition] = useState({
    kiloanKg: 18.2,
    satuanKg: 8.0,
    expressKg: 3.5,
  });

  const [deliveryProgressCards, setDeliveryProgressCards] = useState<DeliveryCardItem[]>([
    {
      id: 'KCK-2026-001',
      title: 'Cuci Setrika Kiloan • Ocean Fresh',
      toCustomer: 'Budi Santoso',
      fromOperator: 'Dina (Meja Setrika Uap)',
      badgeText: 'Setrika Uap',
      badgeClass: 'bg-[#FEF6E0] text-[#EAB308]',
      image: '/images/hero-stack.jpg',
    },
    {
      id: 'KCK-2026-003',
      title: 'Jemput Cucian • Lavender Calm',
      toCustomer: 'Budi Santoso',
      fromOperator: 'Andi Wijaya (Armada 02)',
      badgeText: 'Dijemput Kurir',
      badgeClass: 'bg-[#E0F2FE] text-[#0095FF]',
      image: '/images/auth-laundry.jpg',
    },
    {
      id: 'KCK-2026-004',
      title: 'Bed Cover King Size • Vanilla',
      toCustomer: 'Budi Santoso',
      fromOperator: 'Raka Pratama (Kurir)',
      badgeText: 'Selesai Diantar',
      badgeClass: 'bg-[#E6F8F3] text-[#10B981]',
      image: '/images/hero-stack.jpg',
    },
  ]);

  const [orderReportRows, setOrderReportRows] = useState<CustomerOrderRow[]>([
    {
      id: '1',
      serviceName: 'Cuci Setrika Kiloan (Ocean Fresh)',
      orderNumber: '#KCK-2026-001',
      dateAdded: '27 Nov, 2026',
      priceText: 'Rp 36.000',
      statusLabel: 'Disetrika Uap',
      statusType: 'in_process',
      qtyText: '4.50 KG',
    },
    {
      id: '2',
      serviceName: 'Jemput Kiloan (KUCEKHEMAT20)',
      orderNumber: '#KCK-2026-003',
      dateAdded: '27 Nov, 2026',
      priceText: 'Rp 32.000',
      statusLabel: 'Dijemput Kurir',
      statusType: 'in_process',
      qtyText: '5.00 KG',
    },
    {
      id: '3',
      serviceName: 'Dry Clean Jas & Blazer Eksekutif',
      orderNumber: '#KCK-2026-002',
      dateAdded: '25 Nov, 2026',
      priceText: 'Rp 65.000',
      statusLabel: 'Menunggu Bayar',
      statusType: 'unpaid',
      qtyText: '2.00 PCS',
    },
    {
      id: '4',
      serviceName: 'Bed Cover King Size + Sprei Set',
      orderNumber: '#KCK-2026-004',
      dateAdded: '22 Nov, 2026',
      priceText: 'Rp 35.000',
      statusLabel: 'Selesai Diantar',
      statusType: 'completed',
      qtyText: '6.00 KG',
    },
    {
      id: '5',
      serviceName: 'Cuci Lipat Reguler (Potong Kuota)',
      orderNumber: '#KCK-2026-005',
      dateAdded: '18 Nov, 2026',
      priceText: 'Potong Kuota',
      statusLabel: 'Selesai Diantar',
      statusType: 'completed',
      qtyText: '5.20 KG',
    },
    {
      id: '6',
      serviceName: 'Express 1 Hari (Ocean Fresh)',
      orderNumber: '#KCK-2026-006',
      dateAdded: '13 Nov, 2026',
      priceText: 'Rp 35.000',
      statusLabel: 'Selesai Diantar',
      statusType: 'completed',
      qtyText: '3.50 KG',
    },
  ]);

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
        if (payload?.success && payload?.data) {
          const d = payload.data;
          const cust = d.customer;
          if (cust && typeof cust.remaining_quota_kg === 'number') {
            setRemainingQuotaKg(cust.remaining_quota_kg);
          }
          if (typeof d.claimed_vouchers_count === 'number') {
            setClaimedVouchersCount(d.claimed_vouchers_count);
          }
          if (d.stats) {
            if (typeof d.stats.monthly_spend_rp === 'number' && d.stats.monthly_spend_rp > 0) {
              setMonthlySpendRp(d.stats.monthly_spend_rp);
            }
            if (typeof d.stats.monthly_usage_kg === 'number' && d.stats.monthly_usage_kg > 0) {
              setMonthlyUsageKg(d.stats.monthly_usage_kg);
            }
            if (d.stats.composition) {
              setComposition({
                kiloanKg: d.stats.composition.kiloan_kg || 18.2,
                satuanKg: d.stats.composition.satuan_kg || 8.0,
                expressKg: d.stats.composition.express_kg || 3.5,
              });
            }
          }

          if (Array.isArray(d.active_orders) && d.active_orders.length > 0) {
            setActiveOrderNumber(d.active_orders[0].order_number);
          }

          if (Array.isArray(d.all_orders) && d.all_orders.length > 0) {
            const scentLabel: Record<string, string> = {
              ocean_fresh: 'Ocean Fresh',
              sakura_blossom: 'Sakura',
              vanilla_mist: 'Vanilla',
              lavender_calm: 'Lavender',
            };

            const mappedRows: CustomerOrderRow[] = d.all_orders.slice(0, 6).map((ord: any) => {
              const scent = scentLabel[ord.fragrance] || ord.fragrance || 'Ocean Fresh';
              const srvName =
                ord.service_type === 'satuan'
                  ? `Dry Clean & Satuan (${scent})`
                  : ord.service_type === 'express'
                  ? `Express 24 Jam (${scent})`
                  : `Cuci Setrika Kiloan (${scent})`;

              let statusLabel = 'Disetrika Uap';
              let statusType: 'in_process' | 'completed' | 'unpaid' = 'in_process';

              if (ord.payment_status === 'unpaid') {
                statusLabel = 'Menunggu Bayar';
                statusType = 'unpaid';
              } else if (ord.status === 'selesai') {
                statusLabel = 'Selesai Diantar';
                statusType = 'completed';
              } else if (ord.status === 'terima') {
                statusLabel = 'Dijemput Kurir';
              } else if (ord.status === 'cuci') {
                statusLabel = 'Sedang Dicuci';
              } else if (ord.status === 'kering') {
                statusLabel = 'Pengering 60°C';
              }

              const priceText =
                ord.payment_method === 'kuota_langganan' || ord.quota_used_kg > 0
                  ? 'Potong Kuota'
                  : `Rp ${Number(ord.total_amount).toLocaleString('id-ID')}`;

              return {
                id: String(ord.id),
                serviceName: ord.voucher_code ? `${srvName} • ${ord.voucher_code}` : srvName,
                orderNumber: `#${ord.order_number}`,
                dateAdded: new Date(ord.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                priceText,
                statusLabel,
                statusType,
                qtyText: `${Number(ord.weight_kg).toFixed(2)} ${
                  ord.service_type === 'satuan' ? 'PCS' : 'KG'
                }`,
              };
            });
            setOrderReportRows(mappedRows);

            const mappedCards: DeliveryCardItem[] = d.all_orders.slice(0, 3).map((ord: any, i: number) => {
              const scent = scentLabel[ord.fragrance] || 'Ocean Fresh';
              const isDone = ord.status === 'selesai';
              const isPickup = ord.status === 'terima';
              return {
                id: ord.order_number,
                title:
                  ord.service_type === 'satuan'
                    ? `Dry Clean & Satuan • ${scent}`
                    : `Cuci Setrika ${Number(ord.weight_kg).toFixed(1)} Kg • ${scent}`,
                toCustomer: cust?.name || 'Budi Santoso',
                fromOperator: isDone
                  ? 'Raka Pratama (Kurir)'
                  : isPickup
                  ? 'Andi Wijaya (Armada 02)'
                  : 'Dina (Meja Setrika Uap)',
                badgeText: isDone
                  ? 'Selesai Diantar'
                  : isPickup
                  ? 'Dijemput Kurir'
                  : 'Setrika Uap',
                badgeClass: isDone
                  ? 'bg-[#E6F8F3] text-[#10B981]'
                  : isPickup
                  ? 'bg-[#E0F2FE] text-[#0095FF]'
                  : 'bg-[#FEF6E0] text-[#EAB308]',
                image: i % 2 === 0 ? '/images/hero-stack.jpg' : '/images/auth-laundry.jpg',
              };
            });
            setDeliveryProgressCards(mappedCards);
          }
        }
      })
      .catch(() => {});
  }, []);

  // 16 Bar Data untuk Grafik Batang Vertikal Bulat
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

  const crewAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&q=80',
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-[1280px] mx-auto">
        {/* Page Heading + Quick Action to Voucher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
            Dashboard
          </h1>

          <Link
            to="/app/voucher"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#0095FF] text-xs font-extrabold text-[#111827] shadow-2xs transition"
          >
            <TicketPercent className="w-4 h-4 text-[#0095FF]" />
            <span>{claimedVouchersCount} Voucher Promo Aktif</span>
          </Link>
        </div>

        {/* ROW 1: 3 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Sisa Kuota Langganan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[138px]">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-[#94A3B8]">
                Sisa Kuota Langganan
              </span>
              <Link
                to="/app/beli-paket"
                title="Top-up Paket Kuota"
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                {remainingQuotaKg.toFixed(2)} Kg
              </span>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E6F8F3] text-[#10B981] text-[10.5px] font-extrabold">
                  <TrendingUp className="w-3 h-3" />
                  5.5%
                </span>
                <p className="text-[10px] font-medium text-[#CBD5E1] mt-1">
                  Paket Keluarga Aktif s/d Des 2026
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Pengeluaran Bulan Ini */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[138px]">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-semibold text-[#94A3B8]">
                Pengeluaran Bulan Ini
              </span>
              <Link
                to="/app/riwayat"
                title="Lihat Riwayat Nota"
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-4 flex items-end justify-between gap-2">
              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                Rp {monthlySpendRp.toLocaleString('id-ID')}
              </span>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEECEB] text-[#F43F5E] text-[10.5px] font-extrabold">
                  <TrendingDown className="w-3 h-3" />
                  18.9%
                </span>
                <p className="text-[10px] font-medium text-[#CBD5E1] mt-1">
                  Lebih hemat dengan Paket & Voucher
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Total Cucian Bersih & Tim Siaga */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between min-h-[138px] sm:col-span-2 lg:col-span-1">
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
                  Kru & Kurir Siaga
                </p>
                <div className="flex items-center -space-x-2">
                  {crewAvatars.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Kru Kucek"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                  <span className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#475569] text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    +12
                  </span>
                </div>
              </div>

              <span className="text-[25px] sm:text-[27px] font-black text-[#111827] tracking-tight leading-none">
                {monthlyUsageKg.toFixed(1)} Kg
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: Vertical Pill Bar Chart (7 Cols) + Donut Chart (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 7 Cols: Pemakaian Laundry Bulan Ini */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Pemakaian Laundry Bulan Ini
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Akumulasi cucian kiloan, satuan & antar-jemput
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[20px] sm:text-[22px] font-black text-[#111827] tracking-tight leading-none">
                  {monthlyUsageKg.toFixed(2)} Kg
                </p>
                <p className="text-[10.5px] font-medium text-[#CBD5E1] mt-1">
                  Target kuota hemat 50.00 Kg
                </p>
              </div>
            </div>

            <div className="mt-7 flex gap-2.5 sm:gap-3">
              <div className="flex flex-col justify-between text-[10px] sm:text-[10.5px] font-semibold text-[#94A3B8] pb-6 pr-1 select-none shrink-0">
                <span>10 Kg</span>
                <span>8 Kg</span>
                <span>6 Kg</span>
                <span>4 Kg</span>
                <span>2 Kg</span>
                <span>0 Kg</span>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="h-[175px] sm:h-[185px] flex items-end justify-between gap-1 sm:gap-2.5 px-1 border-b border-slate-100 pb-2">
                  {monthlyBarData.map((bar, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full flex items-end justify-center group relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-[#111827] text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none z-10">
                        {bar.kg}
                      </div>
                      <div
                        style={{ height: `${bar.heightPct}%` }}
                        className="w-1.5 sm:w-2.5 rounded-full bg-[#0095FF] group-hover:bg-[#0077CC] transition-all duration-300 shadow-[0_4px_10px_-2px_rgba(0,149,255,0.45)]"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[9.5px] sm:text-[10.5px] font-semibold text-[#94A3B8] pt-3 px-1">
                  <span>01 Nov</span>
                  <span>10 Nov</span>
                  <span>15 Nov</span>
                  <span>20 Nov</span>
                  <span>25 Nov</span>
                  <span>30 Nov</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Komposisi Layanan */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Komposisi Layanan
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Rincian jenis layanan yang Anda gunakan
                </p>
              </div>
              <Link
                to="/app/pesan-jemput"
                title="Pesan Jemput Cucian"
                className="w-7 h-5 rounded-md bg-[#F5F7FA] hover:bg-slate-200 text-[#94A3B8] flex items-center justify-center transition"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Link>
            </div>

            <div className="my-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-3 w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-2 rounded-full bg-[#E2E8F0] inline-block" />
                    <span className="text-xs font-medium text-[#94A3B8]">
                      Express 24J
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#111827]">
                    {composition.expressKg.toFixed(2)} Kg
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-2 rounded-full bg-[#10B981] inline-block" />
                    <span className="text-xs font-medium text-[#94A3B8]">
                      Dry Clean & Satuan
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#111827]">
                    {composition.satuanKg.toFixed(2)} Kg
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-2 rounded-full bg-[#0095FF] inline-block" />
                    <span className="text-xs font-medium text-[#94A3B8]">
                      Kiloan Setrika
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#111827]">
                    {composition.kiloanKg.toFixed(2)} Kg
                  </span>
                </div>
              </div>

              <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="13"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#0095FF"
                    strokeWidth="13"
                    strokeDasharray="165 289"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="13"
                    strokeDasharray="70 289"
                    strokeDashoffset="-175"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <span className="text-[18px] sm:text-[19px] font-black text-[#111827] tracking-tight leading-none">
                    {monthlyUsageKg.toFixed(2)} Kg
                  </span>
                  <span className="text-[9.5px] font-medium text-[#CBD5E1] mt-1">
                    1 Mesin 1 Pelanggan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Progres Antar-Jemput (5 Cols) + Rincian Nota & Kuota Cucian (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 5 Cols: Progres Antar-Jemput */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Progres Antar-Jemput
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Pesanan aktif & pengantaran terbaru Anda
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
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-extrabold text-[#111827] truncate group-hover:text-[#0095FF] transition">
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
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[10.5px] font-extrabold shrink-0 ${item.badgeClass}`}
                  >
                    {item.badgeText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 7 Cols: Rincian Nota & Kuota Cucian */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] border border-slate-100/80 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-[17px] font-extrabold text-[#111827] tracking-tight">
                  Rincian Nota & Kuota Cucian
                </h2>
                <p className="text-[11.5px] font-medium text-[#CBD5E1] mt-0.5">
                  Total {orderReportRows.length} transaksi & pemotongan kuota terakhir
                </p>
              </div>

              <Link
                to="/app/pesan-jemput"
                className="px-3.5 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#0095FF] hover:text-white text-[#64748B] text-[11px] font-bold transition shrink-0"
              >
                Pesan Jemput
              </Link>
            </div>

            {/* Mobile Compact Card List (< 640px) */}
            <div className="sm:hidden mt-4 space-y-2.5">
              {orderReportRows.map((row) => (
                <div
                  key={row.id}
                  onClick={() =>
                    navigate(`/app/lacak/${row.orderNumber.replace('#', '')}`)
                  }
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#94A3B8]">
                        {row.orderNumber}
                      </span>
                      <span className="text-[10.5px] text-[#64748B]">{row.dateAdded}</span>
                    </div>
                    <p className="text-xs font-extrabold text-[#111827] truncate mt-0.5">
                      {row.serviceName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#111827] block">
                      {row.priceText}
                    </span>
                    <span
                      className={`text-[10px] font-bold inline-flex items-center gap-0.5 ${
                        row.statusType === 'in_process'
                          ? 'text-[#0095FF]'
                          : row.statusType === 'completed'
                          ? 'text-[#10B981]'
                          : 'text-[#F43F5E]'
                      }`}
                    >
                      {row.statusLabel} <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= 640px) */}
            <div className="hidden sm:block mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse">
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
                      <td className="py-3 px-2 font-bold">
                        <span
                          className={
                            row.statusType === 'in_process'
                              ? 'text-[#0095FF]'
                              : row.statusType === 'completed'
                              ? 'text-[#10B981]'
                              : 'text-[#F43F5E]'
                          }
                        >
                          {row.statusLabel}
                        </span>
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
