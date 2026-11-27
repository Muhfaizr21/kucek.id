import React from 'react';
import { Link } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { ArrowRight } from 'lucide-react';

export const CustomerHomePage: React.FC = () => {
  return (
    <CustomerLayout>
      <div className="space-y-5">
        {/* Active Order Card */}
        <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-3xl p-6 shadow-xl shadow-sky-600/15 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
              Cucian Sedang Berlangsung
            </span>
            <span className="text-xs font-bold text-sky-100">KCK-202611-001</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">Tahap: Sedang Disetrika Uap</h2>
          <p className="text-xs text-sky-100 mt-1">Estimasi selesai: Hari ini, pukul 17:00 WIB</p>

          {/* Mini Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[65%]"></div>
            </div>
            <div className="flex justify-between text-[11px] text-sky-100 font-medium">
              <span>Cuci</span>
              <span>Kering</span>
              <span className="font-bold text-white">Setrika (Saat Ini)</span>
              <span>Packing</span>
              <span>Selesai</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-sky-100">Aroma: <b>Sakura Blossom</b></span>
            <Link
              to="/track/KCK-202611-001"
              className="text-xs font-bold bg-white text-sky-700 px-3.5 py-1.5 rounded-xl shadow-sm hover:bg-sky-50 transition flex items-center gap-1"
            >
              <span>Detail Resi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Member Quota & Points Widgets */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sisa Kuota Kiloan</span>
            <p className="text-2xl font-black text-slate-900 mt-1">32.5 <span className="text-xs font-normal text-slate-400">Kg</span></p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Paket Aktif s/d 15 Des</p>
            <Link to="/app/beli-paket" className="text-xs text-sky-600 font-bold hover:underline mt-2 block">
              + Top Up Kuota
            </Link>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Poin Loyalitas</span>
            <p className="text-2xl font-black text-amber-500 mt-1">120 <span className="text-xs font-normal text-slate-400">Poin</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">Bisa tukar diskon Rp12.000</p>
            <button onClick={() => alert('Voucher diskon Rp12.000 ditukarkan!')} className="text-xs text-amber-600 font-bold hover:underline mt-2 block text-left">
              Tukar Kupon
            </button>
          </div>
        </div>

        {/* Main Action Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Punya Cucian Menumpuk?</h3>
            <p className="text-xs text-slate-500">Mager keluar rumah? Kurir kucek.id siap jemput ke tempatmu.</p>
          </div>
          <Link
            to="/app/pesan-jemput"
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 shrink-0 ml-3"
          >
            Pesan Jemput
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
};
