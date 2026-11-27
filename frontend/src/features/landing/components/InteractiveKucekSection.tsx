import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';

const LANDING_PERFUME_OPTIONS: SelectOption[] = [
  { value: 'Sakura Blossom', label: '🌸 Sakura Blossom', description: 'Floral lembut khas musim semi Jepang', badge: 'Favorit' },
  { value: 'Lavender Breeze', label: '🪻 Lavender Breeze', description: 'Relaksasi aroma lavender segar alami' },
  { value: 'Ocean Fresh', label: '🌊 Ocean Fresh', description: 'Kesegaran semilir laut maskulin tahan lama' },
  { value: 'Sweet Vanilla', label: '🍦 Sweet Vanilla', description: 'Wangi manis hangat mewah yang elegan' },
  { value: 'Tanpa Parfum (Ramah Bayi)', label: '🍃 Tanpa Parfum (Ramah Bayi)', description: 'Hypoallergenic untuk kulit bayi sensitif', badge: 'Baby Safe' },
];

export const InteractiveKucekSection: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(5);
  const [speed, setSpeed] = useState<'REGULAR' | 'FAST' | 'EXPRESS'>('REGULAR');
  const [perfume, setPerfume] = useState('Sakura Blossom');

  const baseRatePerKg = 8000;
  const speedMultiplier = speed === 'REGULAR' ? 1 : speed === 'FAST' ? 1.35 : 2;
  const estimatedRegularTotal = Math.round(weightKg * baseRatePerKg * speedMultiplier);
  const estimatedMemberTotal = Math.round(weightKg * 6000);
  const savings = Math.max(0, estimatedRegularTotal - estimatedMemberTotal);

  return (
    <section id="kalkulator" className="bg-[#F4EDE5] py-16 sm:py-24 border-t border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
            Kalkulator Simulasi Biaya & Penghematan Kuota Cuci
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Hitung estimasi pengeluaran cucian Anda dan bandingkan keuntungan hemat hingga 30% menggunakan paket kuota langganan Kucek.id.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Customer Portal Tracking & Privacy Notice */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DDD3] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E6DDD3] text-[#C8430E] text-xs font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Pelacakan Terlindungi</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#1A1918]">
                Pelacakan Status Cucian Aman (Portal Pelanggan)
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Demi menjaga kerahasiaan pakaian dan privasi data pribadi Anda, pelacakan live telemetry (proses cuci, pengeringan, setrika uap, foto kemasan kedap) hanya dapat diakses melalui Akun Pelanggan yang terverifikasi.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#1A1918] font-semibold">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <span>Pantau tahap mesin cuci 1 mesin 1 pelanggan secara real-time</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <span>Timbangan digital transparan & foto hasil packing kedap udara</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B38] shrink-0 mt-0.5" />
                  <span>Riwayat transaksi e-Nota WhatsApp & saldo kuota langganan</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                className="w-full min-h-[44px] py-3 rounded-full bg-[#1A1918] hover:bg-black text-white font-extrabold text-xs transition inline-flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Masuk ke Akun untuk Lacak Resi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <p className="text-[11px] text-center text-[#57534E]">
                Belum punya akun? Registrasi otomatis saat order pertama di kasir / kurir.
              </p>
            </div>
          </div>

          {/* Right Card: Interactive Weight & Perfume Price Estimator */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DDD3] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1A1918]">
                    Kalkulator Biaya & Penghematan Kuota
                  </h3>
                  <p className="text-xs text-[#57534E]">
                    Simulasikan berat cucian dan bandingkan tarif kiloan reguler dengan paket langganan
                  </p>
                </div>
                <span className="text-2xl font-black text-[#C8430E] shrink-0">{weightKg} Kg</span>
              </div>

              {/* Weight Range Slider */}
              <div className="space-y-1.5">
                <label
                  htmlFor="weight-slider"
                  className="block text-xs font-bold text-[#1A1918]"
                >
                  Geser Berat Cucian (2 Kg sampai 30 Kg)
                </label>
                <input
                  id="weight-slider"
                  type="range"
                  min={2}
                  max={30}
                  step={0.5}
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-[#C8430E] h-6 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#57534E]">
                  <span>Min. 2 Kg</span>
                  <span>10 Kg</span>
                  <span>20 Kg</span>
                  <span>30 Kg</span>
                </div>
              </div>

              {/* Speed & Perfume Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-[#1A1918] mb-1.5">
                    Durasi Pengerjaan
                  </span>
                  <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Pilih durasi pengerjaan">
                    {[
                      { id: 'REGULAR', label: 'Reguler 2Hr' },
                      { id: 'FAST', label: 'Kilat 1Hr' },
                      { id: 'EXPRESS', label: 'Express 5J' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSpeed(opt.id as 'REGULAR' | 'FAST' | 'EXPRESS')}
                        className={`min-h-[44px] px-2 rounded-xl text-[11px] font-bold border transition ${
                          speed === opt.id
                            ? 'bg-[#1A1918] text-white border-[#1A1918]'
                            : 'bg-[#FAF7F2] text-[#3F3C39] border-[#D8CFC4] hover:bg-[#EFE9E2]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <CustomSelect
                    label="Pilihan Aroma Parfum"
                    value={perfume}
                    onChange={(val) => setPerfume(val)}
                    options={LANDING_PERFUME_OPTIONS}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Price Comparison Output Box */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#EAE2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#57534E] uppercase">
                  Estimasi Tarif Eceran ({weightKg} Kg • {perfume})
                </span>
                <p className="text-2xl font-black text-[#1A1918]">
                  Rp{estimatedRegularTotal.toLocaleString('id-ID')}
                </p>
                {savings > 0 && (
                  <p className="text-xs font-bold text-[#1E6B38]">
                    Dengan Paket Kuota hanya Rp{estimatedMemberTotal.toLocaleString('id-ID')} (Hemat Rp{savings.toLocaleString('id-ID')})
                  </p>
                )}
              </div>

              <Link
                to="/app/pesan-jemput"
                className="px-6 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#0D5CAD] hover:bg-[#094787] text-white font-extrabold text-xs transition shrink-0"
              >
                Jadwalkan Penjemputan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
