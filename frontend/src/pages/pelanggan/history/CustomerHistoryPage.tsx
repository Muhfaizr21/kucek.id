import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { ArrowRight } from 'lucide-react';

export const CustomerHistoryPage: React.FC = () => {
  const history = [
    {
      resi: 'KCK-2026-001',
      date: '27 Nov 2026',
      items: 'Cuci Setrika Kiloan • Ocean Fresh',
      weight: '4.50 KG',
      amountText: 'Rp 36.000',
      status: 'Disetrika Uap',
      statusColor: 'text-[#0095FF] bg-sky-50',
    },
    {
      resi: 'KCK-2026-002',
      date: '22 Nov 2026',
      items: 'Dry Clean Jas & Blazer Eksekutif',
      weight: '2 PCS',
      amountText: 'Rp 65.000',
      status: 'Menunggu Bayar',
      statusColor: 'text-rose-500 bg-rose-50',
    },
    {
      resi: 'KCK-2025-098',
      date: '18 Nov 2026',
      items: 'Bed Cover King Size + Sprei Set',
      weight: '6.00 KG',
      amountText: 'Potong Kuota',
      status: 'Selesai Diantar',
      statusColor: 'text-[#10B981] bg-[#E6F8F3]',
    },
    {
      resi: 'KCK-2025-084',
      date: '12 Nov 2026',
      items: 'Cuci Lipat Reguler • Vanilla Mist',
      weight: '5.20 KG',
      amountText: 'Potong Kuota',
      status: 'Selesai Diantar',
      statusColor: 'text-[#10B981] bg-[#E6F8F3]',
    },
  ];

  return (
    <CustomerLayout>
      <div className="max-w-[1100px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
              Pesanan & Riwayat Cucian
            </h1>
            <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
              Arsip nota digital, timeline 1 Mesin 1 Pelanggan, dan pemotongan kuota
            </p>
          </div>
          <Link
            to="/app/pesan-jemput"
            className="px-4 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)] transition"
          >
            + Pesan Jemput Baru
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="overflow-x-auto p-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#CBD5E1] border-b border-slate-100">
                  <th className="pb-3 pr-3">Layanan & Aroma</th>
                  <th className="pb-3 px-3">No. Resi</th>
                  <th className="pb-3 px-3">Tanggal</th>
                  <th className="pb-3 px-3">Pembayaran</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Bobot / Qty</th>
                  <th className="pb-3 pl-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {history.map((item) => (
                  <tr key={item.resi} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 pr-3 font-extrabold text-[#111827]">
                      {item.items}
                    </td>
                    <td className="py-4 px-3 font-bold text-[#94A3B8]">
                      #{item.resi}
                    </td>
                    <td className="py-4 px-3 font-semibold text-[#64748B]">
                      {item.date}
                    </td>
                    <td className="py-4 px-3 font-extrabold text-[#111827]">
                      {item.amountText}
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 font-extrabold text-[#111827]">
                      {item.weight}
                    </td>
                    <td className="py-4 pl-3 text-right">
                      <Link
                        to={`/track/${item.resi}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#0095FF] hover:text-white text-[#64748B] font-bold text-[11px] transition"
                      >
                        <span>Lacak</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
