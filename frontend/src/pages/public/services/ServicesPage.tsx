import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingHeader } from '../../../features/landing/components/LandingHeader';
import { LandingFooter } from '../../../features/landing/components/LandingFooter';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ServiceDetail {
  id: string;
  name: string;
  category: 'KILOAN' | 'SATUAN' | 'LINEN' | 'SEPATU';
  priceDisplay: string;
  unit: string;
  duration: string;
  description: string;
  highlights: string[];
  badge?: string;
}

export const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'KILOAN' | 'SATUAN' | 'LINEN' | 'SEPATU'>('KILOAN');
  const [calcWeight, setCalcWeight] = useState<number>(4);
  const [calcDuration, setCalcDuration] = useState<'REGULAR' | 'FAST' | 'EXPRESS'>('REGULAR');

  const servicesData: ServiceDetail[] = [
    // 1. Kiloan
    {
      id: 'kilo-1',
      name: 'Cuci Setrika Kiloan Reguler',
      category: 'KILOAN',
      priceDisplay: 'Rp 8.000',
      unit: '/ Kg',
      duration: '2 - 3 Hari Kerja',
      description: 'Pencucian pakaian harian dengan standar 1 mesin 1 pelanggan, disetrika uap boiler licin, dan dikemas kedap udara.',
      highlights: [
        '1 Mesin 1 Pelanggan (Tidak dicampur)',
        'Setrika uap boiler industri (bebas kilap)',
        'Gratis pilih aroma parfum tahan 14 hari',
        'Pengecekan saku & tagging barcode',
      ],
      badge: 'Paling Populer',
    },
    {
      id: 'kilo-2',
      name: 'Cuci Setrika Kilat 24 Jam',
      category: 'KILOAN',
      priceDisplay: 'Rp 12.000',
      unit: '/ Kg',
      duration: 'Selesai 24 Jam Tepat',
      description: 'Prioritas antrean mesin langsung dan penjemputan ekspres untuk Anda yang butuh pakaian siap pakai esok hari.',
      highlights: [
        'Prioritas mesin cuci & pengering langsung',
        'Selesai 24 jam tepat waktu',
        'Pemberitahuan WhatsApp saat selesai',
        'Standar packing kedap debu',
      ],
      badge: 'Kilat 24 Jam',
    },
    {
      id: 'kilo-3',
      name: 'Super Express 6 Jam',
      category: 'KILOAN',
      priceDisplay: 'Rp 16.000',
      unit: '/ Kg',
      duration: 'Selesai 6 Jam (Sameday)',
      description: 'Layanan darurat sameday. Pakaian masuk pagi, siang siap dipakai untuk rapat atau perjalanan mendadak.',
      highlights: [
        'Pengerjaan instan tanpa antre',
        'Mesin dedicated khusus pakaian Anda',
        'QC ekstra cepat berstandar tinggi',
        'Kurir prioritas antar-jemput langsung',
      ],
      badge: 'Super Express',
    },

    // 2. Satuan & Dry Clean
    {
      id: 'satuan-1',
      name: 'Jas & Blazer Formal',
      category: 'SATUAN',
      priceDisplay: 'Rp 30.000',
      unit: '/ Pcs',
      duration: '2 Hari Kerja',
      description: 'Dry clean khusus kain wol, semi-wol, dan kanvas jas tanpa merusak bantalan bahu dan lining dalam.',
      highlights: ['Treatment anti-kusut & anti-jamur', 'Finishing hanger tebal & plastik penutup jas', 'Perawatan kancing & saku presisi'],
      badge: 'Dry Clean',
    },
    {
      id: 'satuan-2',
      name: 'Kebaya, Gaun & Pakaian Berpayet',
      category: 'SATUAN',
      priceDisplay: 'Rp 35.000',
      unit: '/ Pcs',
      duration: '2 - 3 Hari Kerja',
      description: 'Penanganan manual ramah serat sutra, brokat, dan payet kristal agar tidak lepas atau rontok.',
      highlights: ['Pencucian manual tangan ahli', 'Deterjen non-alkali khusus kain lembut', 'Pengeringan alami tanpa putaran kasar'],
    },
    {
      id: 'satuan-3',
      name: 'Kemeja Formal Katun / Sutra',
      category: 'SATUAN',
      priceDisplay: 'Rp 15.000',
      unit: '/ Pcs',
      duration: '1 - 2 Hari Kerja',
      description: 'Fokus pada kerah kaku rapi, manset bersih dari noda keringat, dan bebas garis gosong.',
      highlights: ['Spotting noda daki di kerah & ketiak', 'Setrika uap vertikal presisi', 'Pilihan gantung atau lipat rapi'],
    },
    {
      id: 'satuan-4',
      name: 'Jaket Kulit & Windbreaker Outdoor',
      category: 'SATUAN',
      priceDisplay: 'Rp 35.000',
      unit: '/ Pcs',
      duration: '2 - 3 Hari Kerja',
      description: 'Pembersihan lapisan membran tahan air (Gore-Tex) dan conditioning kulit agar tidak pecah-pecah.',
      highlights: ['Leather conditioning oil khusus', 'Menjaga lapisan water-repellent', 'Aroma segar anti-lembab'],
    },

    // 3. Linen & Rumah Tangga
    {
      id: 'linen-1',
      name: 'Bed Cover King Size (200x200)',
      category: 'LINEN',
      priceDisplay: 'Rp 35.000',
      unit: '/ Pcs',
      duration: '2 Hari Kerja',
      description: 'Dicuci dalam washer komersial kapasitas 20 Kg. Dakron tidak menggumpal dan higienis hingga ke serat terdalam.',
      highlights: ['Sterilisasi panas 60°C basmi tungau', 'Pengeringan putar merata (dakron mengembang)', 'Parfum menenangkan untuk tidur lelap'],
      badge: 'Favorit Keluarga',
    },
    {
      id: 'linen-2',
      name: 'Bed Cover Sedang / Single',
      category: 'LINEN',
      priceDisplay: 'Rp 25.000',
      unit: '/ Pcs',
      duration: '2 Hari Kerja',
      description: 'Sangat cocok untuk bed cover kos mahasiswa atau kamar tamu. Bersih, wangi, dan dilipat rapi.',
      highlights: ['Sanitasi anti-bakteri', 'Kemasan kedap debu higienis', 'Aman untuk kulit sensitif'],
    },
    {
      id: 'linen-3',
      name: 'Selimut Tebal / Bulu Fleece',
      category: 'LINEN',
      priceDisplay: 'Rp 20.000',
      unit: '/ Pcs',
      duration: '2 Hari Kerja',
      description: 'Perlakuan khusus bulu selimut agar tetap halus mengembang, tidak kaku, dan bebas bau apek.',
      highlights: ['Pelembut serat grade premium', 'Bulu selimut tetap lembut halus', 'Kemasan rapi mudah disimpan'],
    },
    {
      id: 'linen-4',
      name: 'Gorden & Vitrase Tebal',
      category: 'LINEN',
      priceDisplay: 'Rp 15.000',
      unit: '/ m²',
      duration: '3 Hari Kerja',
      description: 'Menghilangkan endapan debu jalanan, bau asap, dan noda polusi pada jendela rumah Anda.',
      highlights: ['Pelepasan debu mikroskopis', 'Setrika uap vertikal agar lurus anggun', 'Aroma segar menyegarkan ruangan'],
    },

    // 4. Sepatu, Tas & Helm
    {
      id: 'sepatu-1',
      name: 'Deep Clean Sepatu Sneakers',
      category: 'SEPATU',
      priceDisplay: 'Rp 35.000',
      unit: '/ Pasang',
      duration: '2 Hari Kerja',
      description: 'Pencucian menyeluruh upper, midsole, outsole, insole, dan tali sepatu dengan sikat bulu kuda khusus.',
      highlights: ['Pembersih ramah kanvas & suede', 'Pengeringan UV anti-jamur', 'Semprotan deodorizer anti-bakteri'],
      badge: 'Spesialis Sneaker',
    },
    {
      id: 'sepatu-2',
      name: 'Unyellowing Sol Sepatu Kuning',
      category: 'SEPATU',
      priceDisplay: 'Rp 45.000',
      unit: '/ Pasang',
      duration: '2 - 3 Hari Kerja',
      description: 'Treatment oksidasi kimiawi mengembalikan warna putih bersih pada sol sepatu yang sudah menguning.',
      highlights: ['Formula pemutih sol berstandar lab', 'Tidak merusak tekstur karet', 'Hasil cerah seperti baru'],
    },
    {
      id: 'sepatu-3',
      name: 'Deep Clean Helm Bogo / Fullface',
      category: 'SEPATU',
      priceDisplay: 'Rp 25.000',
      unit: '/ Pcs',
      duration: '1 - 2 Hari Kerja',
      description: 'Busa dalam helm dicuci steril dari keringat dan minyak rambut, visor dipoles bening bebas gores halus.',
      highlights: ['Sterilisasi ozon anti-bakteri', 'Busa wangi segar tanpa apek', 'Visor jernih pandangan jelas'],
    },
    {
      id: 'sepatu-4',
      name: 'Perawatan Tas Kulit & Backpack',
      category: 'SEPATU',
      priceDisplay: 'Rp 40.000',
      unit: '/ Pcs',
      duration: '2 - 3 Hari Kerja',
      description: 'Membersihkan kotoran kompartemen dalam dan luar, serta pelembapan bahan kulit.',
      highlights: ['Pembersihan kompartemen detail', 'Aman untuk ritsleting logam', 'Bahan kulit lembut terlindungi'],
    },
  ];

  const fragrances = [
    {
      id: 'ocean_fresh',
      name: 'Ocean Fresh',
      badge: 'Terfavorit #1',
      desc: 'Aroma angin laut segar yang bersih, maskulin, dan memberi energi. Bertahan hingga 14 hari di serat kain.',
      color: 'border-sky-300 bg-sky-50/50',
    },
    {
      id: 'sakura_blossom',
      name: 'Sakura Blossom',
      badge: 'Best Seller',
      desc: 'Keharuman kelopak bunga sakura musim semi Jepang yang lembut, manis elegan, dan tidak menyengat.',
      color: 'border-pink-300 bg-pink-50/50',
    },
    {
      id: 'lavender_calm',
      name: 'Lavender Calm',
      badge: 'Relaksasi',
      desc: 'Ekstrak lavender alami yang menenangkan. Sangat disarankan untuk sprei, selimut, dan pakaian tidur.',
      color: 'border-purple-300 bg-purple-50/50',
    },
    {
      id: 'vanilla_mist',
      name: 'Vanilla Mist',
      badge: 'Hangat & Manis',
      desc: 'Aroma vanila lembut berkelas yang memberikan kesan hangat, mewah, dan nyaman dipakai seharian.',
      color: 'border-amber-300 bg-amber-50/50',
    },
    {
      id: 'baby_safe',
      name: 'Baby Safe (Hypoallergenic)',
      badge: 'Kulit Sensitif',
      desc: 'Bebas alkohol dan pewangi sintetis. Diformulasikan khusus untuk pakaian bayi, anak, dan kulit mudah alergi.',
      color: 'border-emerald-300 bg-emerald-50/50',
    },
  ];

  // Hitung estimasi harga
  const ratePerKg = calcDuration === 'EXPRESS' ? 16000 : calcDuration === 'FAST' ? 12000 : 8000;
  const estimatedCost = calcWeight * ratePerKg;

  const currentFilteredServices = servicesData.filter((s) => s.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1A1918] selection:bg-[#C8430E] selection:text-white">
      {/* 1. Header Navigation */}
      <LandingHeader />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="bg-[#F4EDE5] pt-12 pb-16 sm:py-20 border-b border-[#E5DCD2]/70">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DFD5] border border-[#D8CEC2] text-[11px] font-extrabold uppercase tracking-widest text-[#7C3517]">
              <Sparkles className="w-3.5 h-3.5 text-[#C8430E]" />
              <span>Daftar Layanan & Tarif Transparan • Kucek.id</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-[54px] font-black text-[#1A1918] tracking-tight leading-[1.12] max-w-3xl mx-auto">
              Perawatan pakaian spesialis dengan garansi bersih & higienis
            </h1>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl mx-auto font-medium">
              Dari cucian kiloan harian, gaun pernikahan berpayet, bed cover tebal, hingga sepatu kesayangan Anda. Semua diproses dengan standar <strong>1 Mesin 1 Pelanggan</strong> tanpa dicampur.
            </p>

            {/* Quick Filter Tabs */}
            <div className="pt-4 flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
              {[
                { key: 'KILOAN', label: '🧺 Cuci Kiloan' },
                { key: 'SATUAN', label: '👔 Dry Clean & Jas' },
                { key: 'LINEN', label: '🛏️ Bed Cover & Linen' },
                { key: 'SEPATU', label: '👟 Sepatu, Tas & Helm' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key as any)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    activeTab === t.key
                      ? 'bg-[#C8430E] text-white shadow-md'
                      : 'bg-white/80 text-[#57534E] hover:bg-white hover:text-[#1A1918] border border-[#E5DCD2]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Service Cards Grid */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                  Kategori: {activeTab === 'KILOAN' ? 'Cuci Kiloan Higienis' : activeTab === 'SATUAN' ? 'Satuan & Dry Clean' : activeTab === 'LINEN' ? 'Linen & Bed Cover' : 'Sepatu, Tas & Helm'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1918] mt-1">
                  Pilihan Paket & Tarif Layanan
                </h2>
              </div>
              <p className="text-xs text-[#78716C] max-w-xs">
                Semua layanan kiloan sudah termasuk cuci terpisah, setrika uap, parfum pilihan, dan packing bersegel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFilteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-[#FBF9F5] p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#C8430E]/50 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-extrabold text-[#1A1918] leading-snug">{srv.name}</h3>
                      {srv.badge && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#C8430E]/10 text-[#C8430E] shrink-0">
                          {srv.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight">
                        {srv.priceDisplay}
                      </span>
                      <span className="text-xs text-[#78716C] font-semibold">{srv.unit}</span>
                      <span className="ml-auto text-[11px] font-bold text-[#0D5CAD] bg-blue-50 px-2.5 py-1 rounded-md">
                        {srv.duration}
                      </span>
                    </div>

                    <p className="text-xs text-[#57534E] leading-relaxed">{srv.description}</p>

                    <div className="pt-2 border-t border-slate-200/70 space-y-2">
                      <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#78716C]">
                        Keunggulan Pengerjaan:
                      </p>
                      {srv.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#292524]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/app/pesan-jemput"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <span>Pesan Layanan Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Interactive Cost Calculator Widget */}
        <section className="py-16 sm:py-24 bg-[#FBF9F5]">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                Kalkulator Cepat Kiloan
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
                Hitung Estimasi Biaya Cucian Anda
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Transparan tanpa biaya tersembunyi. Termasuk gratis jemput untuk wilayah Sleman & kampus sekitarnya.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Sliders & Inputs */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-extrabold text-[#1A1918]">
                        Perkiraan Berat Cucian (Kg):
                      </label>
                      <span className="text-base font-black text-[#C8430E]">{calcWeight} Kg</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="0.5"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C8430E]"
                    />
                    <div className="flex justify-between text-[10px] text-[#78716C] mt-1 font-semibold">
                      <span>2 Kg (Sedikit)</span>
                      <span>10 Kg (Keluarga)</span>
                      <span>20 Kg (Banyak)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#1A1918] block mb-2">
                      Pilihan Kecepatan Selesai:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'REGULAR', label: 'Reguler', sub: '2-3 Hari', rate: '8rb/kg' },
                        { key: 'FAST', label: 'Kilat', sub: '24 Jam', rate: '12rb/kg' },
                        { key: 'EXPRESS', label: 'Express', sub: '6 Jam', rate: '16rb/kg' },
                      ].map((d) => (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => setCalcDuration(d.key as any)}
                          className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                            calcDuration === d.key
                              ? 'border-[#C8430E] bg-[#C8430E]/5 text-[#C8430E] font-extrabold ring-1 ring-[#C8430E]'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs font-bold">{d.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{d.sub}</p>
                          <span className="inline-block mt-1 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100">
                            Rp {d.rate}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Box */}
                <div className="bg-[#F4EDE5] p-6 sm:p-7 rounded-2xl border border-[#E5DCD2] space-y-5 text-center md:text-left">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3517]">
                      Total Estimasi Biaya
                    </span>
                    <p className="text-3xl sm:text-4xl font-black text-[#1A1918] tracking-tight mt-1">
                      Rp {estimatedCost.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[11px] text-[#78716C] mt-1">
                      {calcWeight} Kg × Rp {ratePerKg.toLocaleString('id-ID')} / Kg • Bebas biaya deterjen & pewangi
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-[#44403C] border-t border-[#E5DCD2] pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Termasuk 1 Mesin 1 Pelanggan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Gratis jemput & antar area Sleman</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Setrika uap boiler anti-gosong</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/app/pesan-jemput"
                      className="w-full py-3 px-5 rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs sm:text-sm font-extrabold tracking-wide flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <span>Pesan Antar-Jemput Untuk Ini</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Aroma Parfum Signature Gallery */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                Kemewahan Wewangian
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
                5 Pilihan Aroma Signature Tahan 14 Hari
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Formula minyak wangi grade A dengan teknologi mikrokapsul. Setiap order bebas memilih aroma favorit tanpa biaya tambahan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {fragrances.map((f) => (
                <div
                  key={f.id}
                  className={`p-6 rounded-3xl border ${f.color} space-y-3 flex flex-col justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-extrabold text-[#1A1918]">{f.name}</h4>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/90 text-[#1A1918] border border-black/5">
                        {f.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-[#C8430E] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gratis disemprotkan saat setrika uap</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Paket Langganan Kuota (Beli Sekali, Hemat Berkali-kali) */}
        <section className="py-16 sm:py-24 bg-[#FBF9F5]">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                Paket Hemat Kuota
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
                Langganan Kuota Kiloan: Hemat s/d 35%
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Beli kuota di awal, cucian diambil bertahap sesuai kebutuhan Anda. Kuota aktif hingga 60 hari.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Paket Mahasiswa Hemat',
                  quota: '20 Kg',
                  price: 'Rp 130.000',
                  unitPrice: 'Rp 6.500 / Kg',
                  validity: 'Berlaku 30 Hari',
                  savings: 'Hemat 20%',
                  features: ['Gratis antar-jemput tanpa minimum', 'Pilihan parfum Ocean Fresh / Vanilla', 'Selesai 2 hari kerja'],
                },
                {
                  name: 'Paket Keluarga Ceria',
                  quota: '50 Kg',
                  price: 'Rp 300.000',
                  unitPrice: 'Rp 6.000 / Kg',
                  validity: 'Berlaku 45 Hari',
                  savings: 'Hemat 28%',
                  popular: true,
                  features: [
                    'Prioritas antrean 1 Mesin 1 Pelanggan',
                    'Bebas pilih 5 aroma parfum premium',
                    'Gratis cuci 1 Bed Cover Sedang',
                    'Gratis antar-jemput door-to-door',
                  ],
                },
                {
                  name: 'Paket Eksekutif Sultan',
                  quota: '100 Kg',
                  price: 'Rp 550.000',
                  unitPrice: 'Rp 5.500 / Kg',
                  validity: 'Berlaku 60 Hari',
                  savings: 'Hemat 35%',
                  features: [
                    'Prioritas pengerjaan Express 1 Hari',
                    'Armada kurir prioritas pagi/sore',
                    'Gratis Dry Clean 2 Stel Jas',
                    'Customer support VIP 24 jam',
                  ],
                },
              ].map((pkg, i) => (
                <div
                  key={i}
                  className={`p-7 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all ${
                    pkg.popular
                      ? 'bg-white border-[#C8430E] ring-2 ring-[#C8430E] shadow-md -translate-y-1'
                      : 'bg-white border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#C8430E] text-white text-[10.5px] font-black tracking-wide shadow-xs uppercase">
                      Pilihan Paling Hemat
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-extrabold text-[#1A1918]">{pkg.name}</h4>
                      <span className="inline-block mt-1 text-[11px] font-extrabold text-[#C8430E] bg-[#C8430E]/10 px-2.5 py-0.5 rounded-full">
                        {pkg.savings}
                      </span>
                    </div>

                    <div>
                      <p className="text-3xl font-black text-[#1A1918] tracking-tight">{pkg.price}</p>
                      <p className="text-xs text-[#78716C] font-semibold mt-0.5">
                        Kuota {pkg.quota} ({pkg.unitPrice}) • {pkg.validity}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {pkg.features.map((feat, fi) => (
                        <div key={fi} className="flex items-start gap-2 text-xs text-[#292524]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/app/beli-paket"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        pkg.popular
                          ? 'bg-[#C8430E] hover:bg-[#AD380A] text-white shadow-xs'
                          : 'bg-[#F4EDE5] hover:bg-[#EAE1D5] text-[#1A1918]'
                      }`}
                    >
                      <span>Beli Paket Kuota Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Call To Action Footer Banner */}
        <section className="py-16 sm:py-20 bg-[#1A1918] text-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Butuh cucian bersih tanpa repot keluar rumah?
            </h2>
            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
              Jadwalkan kurir sekarang. Tim Kucek.id akan menjemput ke lokasi Anda, menimbang di tempat, dan mengantarkannya kembali dalam kondisi licin dan wangi mewah.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/app/pesan-jemput"
                className="px-8 py-3.5 rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs sm:text-sm font-black tracking-wide shadow-md transition"
              >
                Pesan Antar-Jemput Gratis
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold tracking-wide transition border border-white/20"
              >
                Masuk ke Akun Pelanggan
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <LandingFooter />
    </div>
  );
};
