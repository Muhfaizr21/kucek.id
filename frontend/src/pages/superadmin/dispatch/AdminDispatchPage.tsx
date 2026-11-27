import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  X,
  Navigation,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface DispatchOrder {
  id: number;
  order_number: string;
  service_type: string;
  weight_kg: number;
  fragrance: string;
  status: string;
  notes: string;
  pickup_time?: string | null;
  delivery_time?: string | null;
  created_at: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
    area: string;
  };
}

interface CourierUser {
  id: number;
  name: string;
  phone: string;
  sub_role: string;
}

export const AdminDispatchPage: React.FC = () => {
  const [orders, setOrders] = useState<DispatchOrder[]>([]);
  const [couriers, setCouriers] = useState<CourierUser[]>([]);
  const [selectedCourierMap, setSelectedCourierMap] = useState<
    Record<number, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchDispatch = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8080/api/v1/dispatch/pickups', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setOrders(json.data.orders || []);
          setCouriers(json.data.couriers || []);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispatch();
  }, [fetchDispatch]);

  const courierOptions: SelectOption[] =
    couriers.length > 0
      ? couriers.map((c) => ({
          value: c.name,
          label: `${c.name} (${c.phone})`,
          description: c.sub_role || 'Kurir Antar-Jemput Kucek.id',
          badge: 'Siaga',
        }))
      : [
          {
            value: 'Dedi Kurniawan (Armada 01)',
            label: 'Dedi Kurniawan (Armada 01)',
            description: 'Zona Sleman & Kampus UGM',
            badge: 'Siaga',
          },
          {
            value: 'Raka Pratama (Armada 02)',
            label: 'Raka Pratama (Armada 02)',
            description: 'Zona Kota Yogyakarta & Bantul',
            badge: 'Siaga',
          },
        ];

  const extractAssignedCourier = (notes: string): string | null => {
    if (!notes) return null;
    const match = notes.match(/Kurir:\s*([^•]+)/i);
    return match ? match[1].trim() : null;
  };

  const handleAssignCourier = async (
    ord: DispatchOrder,
    taskType: 'JEMPUT' | 'ANTAR',
    updateStatus?: string
  ) => {
    const chosenCourier =
      selectedCourierMap[ord.id] ||
      extractAssignedCourier(ord.notes) ||
      courierOptions[0]?.value ||
      'Dedi Kurniawan';

    setAssigningId(ord.id);
    try {
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:8080/api/v1/dispatch/pickups/${ord.id}/assign`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            courier_name: chosenCourier,
            dispatch_task: taskType,
            update_status: updateStatus || '',
          }),
        }
      );

      if (res.ok) {
        showToast(
          `Kurir "${chosenCourier}" berhasil ditugaskan untuk ${taskType} resi ${ord.order_number}!`
        );
        fetchDispatch();
      }
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-[11px] font-extrabold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> MANAJEMEN ARMADA KURIR &
              JADWAL JEMPUT-ANTAR
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Antar-Jemput & Dispatch Kurir
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Tugaskan kurir dari database staf untuk menjemput cucian kotor
              atau mengantar cucian bersih ke alamat pelanggan
            </p>
          </div>
          <button
            onClick={fetchDispatch}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
            />
            <span>Segarkan Jadwal</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((ord) => {
            const assignedCourier = extractAssignedCourier(ord.notes);
            const currentSelection =
              selectedCourierMap[ord.id] ||
              assignedCourier ||
              courierOptions[0]?.value ||
              '';
            const isReadyToDeliver =
              ord.status === 'packing' || ord.status === 'selesai';
            const waPhone = (ord.customer?.phone || '').startsWith('0')
              ? '62' + (ord.customer?.phone || '').slice(1)
              : ord.customer?.phone || '';

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#0095FF] bg-sky-50 px-2.5 py-1 rounded-lg">
                      {ord.order_number}
                    </span>
                    <span
                      className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-full ${
                        isReadyToDeliver
                          ? 'bg-emerald-50 text-emerald-700'
                          : assignedCourier
                          ? 'bg-sky-50 text-[#0095FF]'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {isReadyToDeliver
                        ? 'Siap Antar Balik'
                        : assignedCourier
                        ? 'Kurir Ditugaskan'
                        : 'Menunggu Jemput'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {ord.customer?.name || 'Pelanggan'}
                    </h3>
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>
                        {ord.customer?.phone || '-'} (Hubungi WhatsApp)
                      </span>
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#0095FF] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">
                        {ord.customer?.address ||
                          'Jl. Kaliurang KM 5, Sleman, Yogyakarta'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Zona: {ord.customer?.area || 'Sleman'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px] font-bold">
                        Layanan & Berat
                      </span>
                      <span className="font-extrabold text-slate-800 capitalize">
                        {ord.service_type} ({ord.weight_kg} Kg)
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px] font-bold">
                        Status Workshop
                      </span>
                      <span className="font-extrabold text-[#0095FF] uppercase">
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <CustomSelect
                    label="Pilih Armada Kurir Bertugas"
                    value={currentSelection}
                    onChange={(val) =>
                      setSelectedCourierMap((prev) => ({
                        ...prev,
                        [ord.id]: val,
                      }))
                    }
                    options={courierOptions}
                    size="sm"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={assigningId === ord.id}
                    onClick={() => handleAssignCourier(ord, 'JEMPUT')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Tugaskan Jemput</span>
                  </button>
                  <button
                    type="button"
                    disabled={assigningId === ord.id}
                    onClick={() =>
                      handleAssignCourier(ord, 'ANTAR', 'selesai')
                    }
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Antar Selesai</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};
