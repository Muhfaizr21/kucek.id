import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, CheckCircle2, ShieldCheck, Clock, ArrowRight, Truck } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';

export const LandingPage: React.FC = () => {
  const [resiInput, setResiInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (resiInput.trim()) {
      navigate(`/track/${resiInput.trim()}`);
    } else {
      navigate('/track');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-6 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Laundry Modern Kiloan & Satuan
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Cucian Bersih, Harum, & <br />
            <span className="text-sky-600 underline decoration-sky-300 decoration-wavy decoration-2">
              Bisa Dipantau Real-Time
            </span>
          </h1>

          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
            Tinggalkan nota kertas! Bersama <b>kucek.id</b>, nikmati layanan laundry antar-jemput, paket langganan kiloan hemat, dan pelacakan status cucian live dari smartphone Anda.
          </p>

          {/* Quick Resi Tracker Box */}
          <div className="mt-10 max-w-xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-sky-600/10 border border-slate-200">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={resiInput}
                  onChange={(e) => setResiInput(e.target.value)}
                  placeholder="Masukkan Nomor Resi (misal: KCK-001)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Lacak Cucian</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2 text-left px-2">
              Contoh resi untuk uji coba: <Link to="/track/KCK-202611-001" className="text-sky-600 font-semibold underline">KCK-202611-001</Link>
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Selesai Tepat Waktu
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-500" /> Garansi Bersih 24 Jam
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Layanan Kilat & Express 5 Jam
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Layanan Favorit di kucek.id</h2>
          <p className="text-slate-500 text-sm mt-2">Pilihan paket fleksibel sesuai kebutuhan Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">Reguler & Express</span>
            <h3 className="text-lg font-bold text-slate-900 mt-3">Cuci Komplit (Cuci + Kering + Setrika)</h3>
            <p className="text-sm text-slate-500 mt-1">Pakaian bersih rapi disetrika uap dan disemprot parfum pilihan.</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">Rp8.000<span className="text-xs font-medium text-slate-500">/kg</span></span>
              <span className="text-xs text-slate-500">Estimasi 2-3 Hari</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-sky-500 shadow-lg shadow-sky-500/10 relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-black uppercase tracking-wider">
              Paling Hemat
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Langganan</span>
            <h3 className="text-lg font-bold text-slate-900 mt-3">Paket Kuota Kiloan 50 Kg</h3>
            <p className="text-sm text-slate-500 mt-1">Beli saldo kuota di depan, lebih hemat hingga 30% untuk kos & keluarga.</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-600">Rp300.000<span className="text-xs font-medium text-slate-500">/50kg</span></span>
              <span className="text-xs text-emerald-600 font-bold">Hemat Rp100.000</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">Satuan & Spesial</span>
            <h3 className="text-lg font-bold text-slate-900 mt-3">Bedcover, Sepatu, Jas</h3>
            <p className="text-sm text-slate-500 mt-1">Perawatan khusus kain tebal, dry clean jas formal, dan deep clean sepatu.</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">Mulai Rp20rb<span className="text-xs font-medium text-slate-500">/pcs</span></span>
              <span className="text-xs text-slate-500">Free Plastik Hanger</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-slate-900 text-white py-14 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Truck className="w-10 h-10 text-sky-400 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-black">Mager keluar rumah? Kami yang jemput cucianmu!</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Pesan penjemputan online lewat portal pelanggan kucek.id. Kurir kami akan segera meluncur ke lokasi Anda.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/app/pesan-jemput"
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              Pesan Jemput Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
