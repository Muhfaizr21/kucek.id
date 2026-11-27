import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/layout/CustomerLayout';
import { Truck, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const CustomerPickupPage: React.FC = () => {
  const [address, setAddress] = useState('Kost Graha Asri No. 12, Jl. Cisitu Lama, Coblong, Bandung');
  const [timeSlot, setTimeSlot] = useState('14:00 - 16:00 WIB');
  const [serviceType, setServiceType] = useState('KILOAN');
  const [perfume, setPerfume] = useState('Sakura Blossom');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <CustomerLayout>
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Permintaan Jemput Berhasil!</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Kurir kami akan segera meluncur ke lokasi Anda pada slot waktu <b>{timeSlot}</b>. Siapkan kantong pakaian kotor Anda ya!
          </p>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
          >
            Kembali ke Beranda
          </button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Antar-Jemput</h1>
          <p className="text-xs text-slate-500">Pakaian dijemput dari kos/rumah, dicuci bersih, dan diantar kembali</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" /> Alamat Penjemputan
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-600" /> Slot Waktu Penjemputan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['09:00 - 12:00 WIB', '14:00 - 16:00 WIB', '16:30 - 19:00 WIB'].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                    timeSlot === slot ? 'bg-sky-50 border-sky-500 text-sky-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimasi Layanan
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="KILOAN">Kiloan Reguler (Baju Sehari-hari)</option>
                <option value="BEDCOVER">Bedcover / Selimut</option>
                <option value="SEPATU">Sepatu / Tas</option>
                <option value="CAMPUR">Campuran Kiloan & Satuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Aroma Parfum Pilihan
              </label>
              <select
                value={perfume}
                onChange={(e) => setPerfume(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="Sakura Blossom">🌸 Sakura Blossom</option>
                <option value="Lavender Breeze">🪻 Lavender Breeze</option>
                <option value="Ocean Fresh">🌊 Ocean Fresh</option>
                <option value="Sweet Vanilla">🍦 Sweet Vanilla</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Catatan untuk Kurir (Patokan Rumah)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pagar warna hitam di samping warkop"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Konfirmasi Pesan Penjemputan</span>
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
};
