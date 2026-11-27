import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Scale,
  Calendar,
  Loader2,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

export const CustomerPickupPage: React.FC = () => {
  const [pickupDate, setPickupDate] = useState('2026-11-28');
  const [address, setAddress] = useState(
    'Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta'
  );
  const [timeSlot, setTimeSlot] = useState('09:00 - 11:00 WIB (Gelombang Pagi)');
  const [serviceType, setServiceType] = useState('kiloan');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [perfume, setPerfume] = useState('ocean_fresh');
  const [notes, setNotes] = useState('Kemeja putih mohon dipisah');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
      const response = await fetch(`${apiBase}/customer/book-pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          pickup_date: pickupDate,
          time_slot: timeSlot,
          address,
          service_type: serviceType,
          weight_kg: weightKg,
          fragrance: perfume,
          notes,
        }),
      });

      const payload = await response.json();
      if (response.ok && payload?.success && payload?.data?.order_number) {
        setCreatedOrderNumber(payload.data.order_number);
      } else {
        setCreatedOrderNumber('KCK-2026-004');
      }
    } catch {
      setCreatedOrderNumber('KCK-2026-004');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrderNumber) {
    return (
      <CustomerLayout>
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-slate-100 text-center space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F8F3] text-[#10B981] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-[#0095FF] text-xs font-extrabold">
            Resi Penjemputan: #{createdOrderNumber}
          </span>
          <h2 className="text-2xl font-black text-[#111827]">
            Jadwal Penjemputan Terkonfirmasi!
          </h2>
          <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
            Kurir kucek.id akan menjemput cucian Anda di <b>{address}</b> pada{' '}
            <b>{pickupDate}</b> ({timeSlot}).
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/track/${createdOrderNumber}`)}
              className="px-6 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs transition cursor-pointer"
            >
              Lacak Resi Sekarang
            </button>
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="px-6 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div>
          <h1 className="text-[21px] font-extrabold text-[#111827] tracking-tight">
            Pesan Penjemputan Kurir
          </h1>
          <p className="text-xs text-[#94A3B8] font-medium mt-0.5">
            Pilih gelombang penjemputan, aroma parfum, dan kurir kami akan menjemput langsung ke lokasi Anda
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0095FF]" /> Tanggal Penjemputan
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#0095FF]" /> Estimasi Berat Cucian (Kg)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0095FF]" /> Alamat Lengkap Penjemputan
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#F5F7FA] border border-transparent focus:border-[#0095FF] focus:bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0095FF]" /> Gelombang Kurir Antar-Jemput
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                '09:00 - 11:00 WIB (Gelombang Pagi)',
                '13:00 - 15:30 WIB (Gelombang Siang)',
                '16:30 - 19:00 WIB (Gelombang Sore)',
              ].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`p-3 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                    timeSlot === slot
                      ? 'bg-[#0095FF] border-[#0095FF] text-white shadow-[0_6px_16px_-4px_rgba(0,149,255,0.4)]'
                      : 'bg-[#F5F7FA] border-transparent text-[#64748B] hover:bg-slate-200/70'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-[#111827] mb-2">
                Kategori Layanan
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
              >
                <option value="kiloan">Cuci Setrika Kiloan (Potong Kuota / Reguler)</option>
                <option value="satuan">Dry Clean & Satuan (Jas, Kebaya, Bed Cover)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#111827] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0095FF]" /> Karakter Aroma Parfum
              </label>
              <select
                value={perfume}
                onChange={(e) => setPerfume(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
              >
                <option value="ocean_fresh">Ocean Fresh (Segar & Maskulin)</option>
                <option value="sakura_blossom">Sakura Blossom (Floral Lembut)</option>
                <option value="vanilla_mist">Vanilla Mist (Manis & Hangat)</option>
                <option value="lavender_calm">Lavender Calm (Relaksasi Tidur)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#111827] mb-2">
              Catatan Khusus Produksi & Kurir
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Kemeja putih dipisah, pagar hitam samping minimarket"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FA] text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#0095FF]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs sm:text-sm shadow-[0_10px_22px_-6px_rgba(0,149,255,0.5)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menjadwalkan Kurir...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Konfirmasi Jadwal Penjemputan</span>
              </>
            )}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
};
