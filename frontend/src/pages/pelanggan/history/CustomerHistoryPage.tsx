import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { ArrowRight } from 'lucide-react';

export const CustomerHistoryPage: React.FC = () => {
  const history = [
    { resi: 'KCK-202611-001', date: '27 Nov 2026', items: 'Cuci Komplit (4.25 kg)', amount: 34000, status: 'SEDANG DISETRIKA' },
    { resi: 'KCK-202610-098', date: '18 Nov 2026', items: 'Cuci Kering Lipat (5.0 kg)', amount: 0, note: 'Potong Kuota', status: 'SELESAI' },
    { resi: 'KCK-202610-045', date: '04 Nov 2026', items: 'Bedcover King + Jas Blazer', amount: 65000, status: 'SELESAI' },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Riwayat Transaksi Cucian</h1>
          <p className="text-xs text-slate-500">Arsip seluruh nota digital dan status pengerjaan cucian Anda</p>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.resi} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sky-600 text-xs">{item.resi}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 text-sm mt-1">{item.items}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.date} • {item.note || `Rp${item.amount.toLocaleString('id-ID')}`}</p>
              </div>

              <Link
                to={`/track/${item.resi}`}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1"
              >
                <span>Lihat Nota</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
};
