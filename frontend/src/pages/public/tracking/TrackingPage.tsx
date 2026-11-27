import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Search, CheckCircle2, Clock, MessageCircle, ArrowLeft } from 'lucide-react';
import type { Order, ProductionStatus } from '../../../types';

// Mock Data untuk demonstrasi
const mockOrder: Order = {
  id: 'ord-123',
  invoiceNumber: 'KCK-202611-001',
  customerName: 'Faisal Muh',
  customerPhone: '081234567890',
  perfume: 'Sakura Blossom',
  durationType: 'REGULAR',
  productionStatus: 'IRONING',
  paymentStatus: 'PAID',
  totalWeightKg: 4.25,
  totalAmount: 34000,
  paidAmount: 34000,
  createdAt: '27 Nov 2026, 09:30 WIB',
  estimatedCompletionAt: '28 Nov 2026, 17:00 WIB',
  specialNotes: 'Kemeja putih tolong digantung',
  items: [
    {
      id: 'it-1',
      name: 'Cuci Komplit (Cuci + Kering + Setrika)',
      category: 'KILOAN',
      quantity: 4.25,
      unit: 'kg',
      price: 8000,
      subtotal: 34000,
    },
  ],
};

const stages: { key: ProductionStatus; label: string; desc: string }[] = [
  { key: 'QUEUED', label: 'Diterima di Outlet', desc: 'Pakaian telah ditimbang dan masuk antrean' },
  { key: 'WASHING', label: 'Sedang Dicuci', desc: 'Diproses dalam mesin cuci dengan deterjen higienis' },
  { key: 'DRYING', label: 'Proses Pengeringan', desc: 'Dikeringkan di mesin dryer suhu terkontrol' },
  { key: 'IRONING', label: 'Sedang Disetrika', desc: 'Disetrika uap rapi & disemprot parfum pilihan' },
  { key: 'PACKING', label: 'QC & Packing', desc: 'Pengecekan kelengkapan & pembungkusan plastik' },
  { key: 'READY', label: 'Siap Diambil', desc: 'Cucian sudah wangi dan tersimpan di rak bersih' },
  { key: 'COMPLETED', label: 'Selesai / Diambil', desc: 'Pakaian telah diserahterimakan kepada pelanggan' },
];

export const TrackingPage: React.FC = () => {
  const { resi } = useParams<{ resi?: string }>();
  const [query, setQuery] = useState(resi || 'KCK-202611-001');

  const currentStageIndex = stages.findIndex((s) => s.key === mockOrder.productionStatus);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {/* Search Bar Resi */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 mb-8">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Masukkan No. Resi..."
            className="flex-1 py-1.5 px-2 text-sm font-semibold text-slate-800 focus:outline-none"
          />
          <button className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition">
            Lacak
          </button>
        </div>

        {/* Live Progress Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nomor Resi</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{mockOrder.invoiceNumber}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                {mockOrder.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Lunas'}
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs">
                Aroma: {mockOrder.perfume}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Status Pengerjaan</h3>
            
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6">
              {stages.map((stg, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stg.key} className="relative group">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isCurrent
                          ? 'bg-sky-600 text-white ring-4 ring-sky-100 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-bold ${isCurrent ? 'text-sky-600' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {stg.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-200">
                            Sedang Berlangsung
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{stg.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* e-Invoice Breakdown Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-4">Rincian e-Nota Cucian</h3>

          <div className="space-y-3 text-sm border-b border-slate-100 pb-4">
            <div className="flex justify-between text-slate-600">
              <span>Pelanggan:</span>
              <span className="font-semibold text-slate-800">{mockOrder.customerName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Waktu Masuk:</span>
              <span className="font-semibold text-slate-800">{mockOrder.createdAt}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimasi Selesai:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Clock className="w-4 h-4" /> {mockOrder.estimatedCompletionAt}
              </span>
            </div>
            {mockOrder.specialNotes && (
              <div className="flex justify-between text-slate-600">
                <span>Instruksi Khusus:</span>
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs">
                  {mockOrder.specialNotes}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {mockOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm py-1">
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.quantity} {item.unit} x Rp{item.price.toLocaleString('id-ID')}</p>
                </div>
                <span className="font-bold text-slate-900">Rp{item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-700">Total Tagihan:</span>
            <span className="text-xl font-black text-slate-900">Rp{mockOrder.totalAmount.toLocaleString('id-ID')}</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20kucek.id,%20saya%20mau%20tanya%20order%20resi%20KCK-202611-001"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Hubungi CS Outlet</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
