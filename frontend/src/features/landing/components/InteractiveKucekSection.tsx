import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, Calculator, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const InteractiveKucekSection: React.FC = () => {
  const navigate = useNavigate();
  const [resiCode, setResiCode] = useState('KCK-202611-001');
  const [weightKg, setWeightKg] = useState<number>(5);
  const [speed, setSpeed] = useState<'REGULAR' | 'FAST' | 'EXPRESS'>('REGULAR');
  const [perfume, setPerfume] = useState('Sakura Blossom');

  const baseRatePerKg = 8000;
  const speedMultiplier = speed === 'REGULAR' ? 1 : speed === 'FAST' ? 1.35 : 2;
  const estimatedRegularTotal = Math.round(weightKg * baseRatePerKg * speedMultiplier);
  const estimatedMemberTotal = Math.round(weightKg * 6000); // Rp6.000/kg with 50kg package
  const savings = Math.max(0, estimatedRegularTotal - estimatedMemberTotal);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = resiCode.trim() || 'KCK-202611-001';
    navigate(`/track/${target}`);
  };

  return (
    <section id="calculator" className="bg-[#F4EDE5] py-16 sm:py-24 border-t border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C8430E]/10 text-[#C8430E] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Smart Tools kucek.id
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
            Track Your Order Live or Estimate Your Laundry Cost
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6A66]">
            Pantau progres cucian Anda detik ini juga tanpa perlu login, atau hitung penghematan biaya cuci dengan kalkulator pintar kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Live Resi Tracker + Mini Live Preview */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DDD3] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-2xl bg-[#C8430E]/10 text-[#C8430E] flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1A1918]">
                Cek Resi Cucian Real-Time
              </h3>
              <p className="text-xs text-[#6E6A66] leading-relaxed">
                Masukkan nomor nota atau klik kode sampel di bawah untuk melihat tahapan mesin cuci, pengering, setrika uap, hingga siap diambil.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3 pt-1">
                <input
                  type="text"
                  value={resiCode}
                  onChange={(e) => setResiCode(e.target.value)}
                  placeholder="Contoh: KCK-202611-001"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E2D9CE] text-sm font-bold text-[#1A1918] focus:outline-none focus:ring-2 focus:ring-[#C8430E]"
                />
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#C8430E] hover:bg-[#B0390B] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <span>Lacak Status Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Instant Preview Status Pill */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#1A1918]">Sampel: KCK-202611-001</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FDBE1A]/30 text-[#8A6100] font-bold text-[10px]">
                  Sedang Disetrika Uap
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5DCD2] rounded-full overflow-hidden">
                <div className="h-full bg-[#C8430E] w-2/3 rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#78736E]">
                <span>Aroma: Sakura Blossom</span>
                <Link to="/track/KCK-202611-001" className="text-[#C8430E] font-bold hover:underline">
                  Buka Detail &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive Weight & Perfume Price Estimator */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DDD3] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0D5CAD]/10 text-[#0D5CAD] flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1A1918]">
                      Simulasi Biaya & Kuota Hemat
                    </h3>
                    <p className="text-xs text-[#6E6A66]">
                      Geser berat cucian dan pilih kecepatan layanan
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-black text-[#C8430E]">{weightKg} Kg</span>
              </div>

              {/* Weight Range Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={0.5}
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-[#C8430E] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-[#78736E]">
                  <span>Min. 2 Kg</span>
                  <span>10 Kg</span>
                  <span>20 Kg</span>
                  <span>30 Kg</span>
                </div>
              </div>

              {/* Speed & Perfume Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1.5">
                    Kecepatan Pengerjaan
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'REGULAR', label: 'Reguler' },
                      { id: 'FAST', label: 'Kilat 1Hr' },
                      { id: 'EXPRESS', label: 'Express 5J' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSpeed(opt.id as 'REGULAR' | 'FAST' | 'EXPRESS')}
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition ${
                          speed === opt.id
                            ? 'bg-[#1A1918] text-white border-[#1A1918]'
                            : 'bg-[#FAF7F2] text-[#4A4643] border-[#E2D9CE]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1.5">
                    Pilihan Aroma Parfum Gratis
                  </label>
                  <select
                    value={perfume}
                    onChange={(e) => setPerfume(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E2D9CE] text-xs font-bold text-[#1A1918]"
                  >
                    <option value="Sakura Blossom">🌸 Sakura Blossom</option>
                    <option value="Lavender Breeze">🪻 Lavender Breeze</option>
                    <option value="Ocean Fresh">🌊 Ocean Fresh</option>
                    <option value="Sweet Vanilla">🍦 Sweet Vanilla</option>
                    <option value="Baby Safe Non-Parfum">👶 Baby Safe (Non-Parfum)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Comparison Output Box */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#EAE2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#78736E] uppercase">
                  Estimasi Tarif Eceran ({speed})
                </span>
                <p className="text-2xl font-black text-[#1A1918]">
                  Rp{estimatedRegularTotal.toLocaleString('id-ID')}
                </p>
                {savings > 0 && (
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Pakai Paket Kuota hanya Rp{estimatedMemberTotal.toLocaleString('id-ID')} (Hemat Rp{savings.toLocaleString('id-ID')})
                  </p>
                )}
              </div>

              <Link
                to="/app/pesan-jemput"
                className="px-6 py-3.5 rounded-full bg-[#0D5CAD] hover:bg-[#094787] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition shrink-0"
              >
                <Truck className="w-4 h-4" />
                <span>Pesan Jemput Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
