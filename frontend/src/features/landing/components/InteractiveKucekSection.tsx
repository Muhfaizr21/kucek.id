import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';

const LANDING_PERFUME_OPTIONS: SelectOption[] = [
  { value: 'Sakura Blossom', label: '🌸 Sakura Blossom', description: 'Floral lembut khas musim semi Jepang', badge: 'Favorit' },
  { value: 'Lavender Breeze', label: '🪻 Lavender Breeze', description: 'Relaksasi aroma lavender segar alami' },
  { value: 'Ocean Fresh', label: '🌊 Ocean Fresh', description: 'Kesegaran semilir laut maskulin tahan lama' },
  { value: 'Sweet Vanilla', label: '🍦 Sweet Vanilla', description: 'Wangi manis hangat mewah yang elegan' },
  { value: 'Tanpa Parfum (Ramah Bayi)', label: '🍃 Tanpa Parfum (Ramah Bayi)', description: 'Hypoallergenic untuk kulit bayi sensitif', badge: 'Baby Safe' },
];

interface TrackSampleRecord {
  code: string;
  customer: string;
  stageLabel: string;
  progressPercent: number;
  perfume: string;
  weightKg: number;
  estimatedDone: string;
}

const SAMPLE_ORDERS: Record<string, TrackSampleRecord> = {
  'KCK-202611-001': {
    code: 'KCK-202611-001',
    customer: 'Faisal Muh',
    stageLabel: 'Tahap 4 dari 6: Sedang Disetrika Uap',
    progressPercent: 68,
    perfume: 'Sakura Blossom',
    weightKg: 4.25,
    estimatedDone: 'Hari ini, 17:00 WIB',
  },
  'KCK-202611-002': {
    code: 'KCK-202611-002',
    customer: 'Sarah Amelia',
    stageLabel: 'Tahap 2 dari 6: Sedang Dicuci',
    progressPercent: 35,
    perfume: 'Lavender Breeze',
    weightKg: 3.5,
    estimatedDone: 'Besok, 14:00 WIB',
  },
  'KCK-202611-003': {
    code: 'KCK-202611-003',
    customer: 'Dimas Arya',
    stageLabel: 'Tahap 6 dari 6: Siap Diambil di Rak',
    progressPercent: 100,
    perfume: 'Ocean Fresh',
    weightKg: 5.0,
    estimatedDone: 'Sudah Selesai',
  },
};

type LookupState = 'idle' | 'loading' | 'found' | 'not_found';

export const InteractiveKucekSection: React.FC = () => {
  const [resiInput, setResiInput] = useState('KCK-202611-001');
  const [lookupState, setLookupState] = useState<LookupState>('found');
  const [activeRecord, setActiveRecord] = useState<TrackSampleRecord | null>(
    SAMPLE_ORDERS['KCK-202611-001']
  );

  const [weightKg, setWeightKg] = useState<number>(5);
  const [speed, setSpeed] = useState<'REGULAR' | 'FAST' | 'EXPRESS'>('REGULAR');
  const [perfume, setPerfume] = useState('Sakura Blossom');

  const baseRatePerKg = 8000;
  const speedMultiplier = speed === 'REGULAR' ? 1 : speed === 'FAST' ? 1.35 : 2;
  const estimatedRegularTotal = Math.round(weightKg * baseRatePerKg * speedMultiplier);
  const estimatedMemberTotal = Math.round(weightKg * 6000);
  const savings = Math.max(0, estimatedRegularTotal - estimatedMemberTotal);

  const runResiLookup = (codeToSearch: string) => {
    const normalized = codeToSearch.trim().toUpperCase();
    if (!normalized) {
      setLookupState('idle');
      setActiveRecord(null);
      return;
    }

    setLookupState('loading');
    setTimeout(() => {
      const match = SAMPLE_ORDERS[normalized];
      if (match) {
        setActiveRecord(match);
        setLookupState('found');
      } else {
        setActiveRecord(null);
        setLookupState('not_found');
      }
    }, 220);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runResiLookup(resiInput);
  };

  return (
    <section id="lacak" className="bg-[#F4EDE5] py-16 sm:py-24 border-t border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
            Lacak Status Nota atau Hitung Estimasi Biaya Cuci
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Masukkan kode nota untuk memeriksa posisi cucian saat ini, atau geser berat pakaian untuk menghitung perbandingan tarif eceran dan paket kuota.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Card: Live Resi Tracker with Empty, Loading, Error & Found States (R-27) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DDD3] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-[#1A1918]">
                Cek Status Cucian Langsung
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Ketik nomor resi yang tertera pada nota WhatsApp atau pilih salah satu kode sampel di bawah untuk mencoba pelacakan.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3 pt-1">
                <div>
                  <label
                    htmlFor="resi-input"
                    className="block text-xs font-bold text-[#1A1918] mb-1.5"
                  >
                    Nomor Resi Laundry
                  </label>
                  <input
                    id="resi-input"
                    type="text"
                    value={resiInput}
                    onChange={(e) => {
                      setResiInput(e.target.value);
                      if (!e.target.value.trim()) {
                        setLookupState('idle');
                        setActiveRecord(null);
                      }
                    }}
                    placeholder="Contoh: KCK-202611-001"
                    className="w-full px-4 py-3 min-h-[44px] rounded-2xl bg-[#FAF7F2] border border-[#D8CFC4] text-sm font-bold text-[#1A1918]"
                  />
                </div>

                {/* Quick Sample Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#57534E]">Coba kode:</span>
                  {Object.keys(SAMPLE_ORDERS).map((sampleCode) => (
                    <button
                      key={sampleCode}
                      type="button"
                      onClick={() => {
                        setResiInput(sampleCode);
                        runResiLookup(sampleCode);
                      }}
                      className="px-2.5 py-1 min-h-[32px] rounded-lg bg-[#F4EDE5] hover:bg-[#E6DDD3] text-[11px] font-bold text-[#1A1918] transition"
                    >
                      {sampleCode}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] py-3 rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white font-extrabold text-xs transition active:scale-95"
                >
                  Periksa Status Nota
                </button>
              </form>
            </div>

            {/* R-27: 4 Complete UI States (Idle/Empty, Loading, Error, Found) */}
            <div aria-live="polite" className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8]">
              {lookupState === 'idle' && (
                <p className="text-xs text-[#57534E] text-center py-3">
                  Masukkan nomor resi di atas untuk menampilkan tahapan pencucian.
                </p>
              )}

              {lookupState === 'loading' && (
                <div className="py-4 text-center space-y-2">
                  <div className="w-6 h-6 rounded-full border-2 border-[#C8430E] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-[#57534E]">
                    Memeriksa data antrean mesin...
                  </p>
                </div>
              )}

              {lookupState === 'not_found' && (
                <div className="py-2 space-y-1.5">
                  <p className="text-xs font-extrabold text-[#B0390B]">
                    Nomor resi &ldquo;{resiInput}&rdquo; tidak ditemukan.
                  </p>
                  <p className="text-[11px] text-[#57534E]">
                    Pastikan format resi benar atau klik tombol sampel <b>KCK-202611-001</b> di atas.
                  </p>
                </div>
              )}

              {lookupState === 'found' && activeRecord && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#1A1918]">
                      {activeRecord.code} ({activeRecord.customer})
                    </span>
                    <span className="font-bold text-[#C8430E]">{activeRecord.weightKg} Kg</span>
                  </div>
                  <p className="text-xs font-bold text-[#1A1918]">{activeRecord.stageLabel}</p>
                  <div className="w-full h-2.5 bg-[#E5DCD2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8430E] rounded-full transition-all duration-300"
                      style={{ width: `${activeRecord.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#57534E] pt-1">
                    <span>Parfum: {activeRecord.perfume}</span>
                    <Link
                      to={`/track/${activeRecord.code}`}
                      className="text-[#C8430E] font-extrabold underline"
                    >
                      Buka Rincian e-Nota
                    </Link>
                  </div>
                </div>
              )}
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
                  className="w-full accent-[#C8430E] h-6"
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
