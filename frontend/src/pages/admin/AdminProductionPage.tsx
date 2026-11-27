import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import type { ProductionStatus } from '../../types';

interface KanbanOrder {
  id: string;
  resi: string;
  customer: string;
  weight: number;
  perfume: string;
  isExpress?: boolean;
  status: ProductionStatus;
}

const initialOrders: KanbanOrder[] = [
  { id: '1', resi: 'KCK-202611-005', customer: 'Budi Santoso', weight: 3.2, perfume: 'Ocean Fresh', status: 'QUEUED' },
  { id: '2', resi: 'KCK-202611-002', customer: 'Sarah Amelia', weight: 4.0, perfume: 'Lavender Breeze', status: 'WASHING' },
  { id: '3', resi: 'KCK-202611-006', customer: 'Rian Pratama', weight: 2.5, perfume: 'Sweet Vanilla', status: 'DRYING' },
  { id: '4', resi: 'KCK-202611-001', customer: 'Faisal Muh', weight: 4.25, perfume: 'Sakura Blossom', status: 'IRONING' },
  { id: '5', resi: 'KCK-202611-003', customer: 'Dimas Arya', weight: 5.0, perfume: 'Ocean Fresh', isExpress: true, status: 'PACKING' },
  { id: '6', resi: 'KCK-202611-004', customer: 'Nadia Putri', weight: 3.0, perfume: 'Sakura Blossom', status: 'READY' },
];

const columns: { status: ProductionStatus; title: string; color: string }[] = [
  { status: 'QUEUED', title: '1. Antrean Cuci', color: 'border-slate-300' },
  { status: 'WASHING', title: '2. Sedang Dicuci', color: 'border-blue-400' },
  { status: 'DRYING', title: '3. Pengeringan', color: 'border-amber-400' },
  { status: 'IRONING', title: '4. Setrika Uap', color: 'border-orange-400' },
  { status: 'PACKING', title: '5. QC & Packing', color: 'border-purple-400' },
  { status: 'READY', title: '6. Siap Diambil', color: 'border-emerald-400' },
];

export const AdminProductionPage: React.FC = () => {
  const [orders, setOrders] = useState<KanbanOrder[]>(initialOrders);

  const moveOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== id) return ord;
        const colKeys = columns.map((c) => c.status);
        const currentIndex = colKeys.indexOf(ord.status);
        if (currentIndex < colKeys.length - 1) {
          const nextStatus = colKeys[currentIndex + 1];
          if (nextStatus === 'READY') {
            alert(`Pesan WhatsApp otomatis terkirim ke ${ord.customer}: Cucian siap diambil!`);
          }
          return { ...ord, status: nextStatus };
        }
        return ord;
      })
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Papan Antrean Produksi (Kanban)</h1>
            <p className="text-xs text-slate-500">Geser tahapan cuci, pengering, setrika uap, hingga packing selesai</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Mode Barcode Scanner USB Aktif. Arahkan scanner ke label barcode pakaian.')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-900 transition"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>Mode Scan Barcode</span>
            </button>
          </div>
        </div>

        {/* 6 Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {columns.map((col) => {
            const itemsInCol = orders.filter((o) => o.status === col.status);

            return (
              <div key={col.status} className={`bg-slate-100/80 rounded-2xl p-3 border-t-4 ${col.color} flex flex-col min-h-[480px]`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-black text-slate-700">{col.title}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {itemsInCol.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {itemsInCol.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-600 text-xs">{item.resi}</span>
                        {item.isExpress && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase animate-pulse">
                            Express
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-slate-800 text-xs line-clamp-1">{item.customer}</p>
                        <p className="text-[11px] text-slate-400">{item.weight} Kg • {item.perfume}</p>
                      </div>

                      {col.status !== 'READY' ? (
                        <button
                          onClick={() => moveOrder(item.id)}
                          className="w-full mt-1 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-600 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                        >
                          <span>Lanjut</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 mt-1 py-1 bg-emerald-50 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Siap di Rak</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {itemsInCol.length === 0 && (
                    <div className="text-center py-10 text-xs text-slate-400 italic">
                      Tidak ada antrean
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};
