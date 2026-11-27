import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Truck, MapPin, Phone, CheckCircle2 } from 'lucide-react';

interface PickupRequest {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  timeSlot: string;
  estimateKg: string;
  perfume: string;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP';
  courierName?: string;
}

const initialPickups: PickupRequest[] = [
  {
    id: 'req-1',
    customerName: 'Anindya Putri',
    phone: '081398765432',
    address: 'Kost Graha Asri No. 12, Jl. Cisitu Lama, Bandung',
    timeSlot: 'Hari ini (14:00 - 16:00 WIB)',
    estimateKg: '~5 Kg (Kiloan)',
    perfume: 'Sakura Blossom',
    status: 'PENDING',
  },
  {
    id: 'req-2',
    customerName: 'Reza Rahardian',
    phone: '081298761234',
    address: 'Apartemen Suites Dago Tower B Lt. 8 No. 802',
    timeSlot: 'Hari ini (16:00 - 18:00 WIB)',
    estimateKg: '~8 Kg + 1 Bedcover',
    perfume: 'Ocean Fresh',
    status: 'ASSIGNED',
    courierName: 'Kurir Andi',
  },
];

export const AdminDispatchPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>(initialPickups);

  const assignCourier = (id: string) => {
    setPickups((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'ASSIGNED', courierName: 'Kurir Toko (Faisal)' } : p))
    );
    alert('Tugas jemput berhasil ditugaskan ke kurir!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Antar-Jemput (Dispatcher)</h1>
          <p className="text-xs text-slate-500">Pantau dan kelola permintaan penjemputan pakaian dari aplikasi pelanggan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickups.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{item.customerName}</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.status === 'PENDING' ? 'Menunggu Penugasan' : `Ditugaskan: ${item.courierName}`}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item.address}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{item.phone}</span>
                </p>
                <p className="font-semibold text-sky-600">
                  Jadwal: {item.timeSlot} • Estimasi: {item.estimateKg}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-2">
                {item.status === 'PENDING' ? (
                  <button
                    onClick={() => assignCourier(item.id)}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Tugaskan Kurir / Ambil Sendiri</span>
                  </button>
                ) : (
                  <div className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Kurir Sedang OTW Menjemput</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
