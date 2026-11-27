import React from 'react';
import { Link } from 'react-router-dom';
import { LandingHeader } from '../../../features/landing/components/LandingHeader';
import { LandingFooter } from '../../../features/landing/components/LandingFooter';
import {
  ShieldCheck,
  Sparkles,
  Droplets,
  Flame,
  Clock,
  HeartHandshake,
  Award,
  ArrowRight,
} from 'lucide-react';
import { TEAM_EXPERTS, TIMELINE_MILESTONES } from '../../../features/landing/data/landingData';

export const AboutPage: React.FC = () => {
  const commitments = [
    {
      icon: ShieldCheck,
      color: 'bg-[#C8430E]',
      title: '1 Mesin 1 Pelanggan (Anti-Campur)',
      desc: 'Setiap helai pakaian Anda dicuci secara terpisah dalam tabung mandiri. Kami menolak keras mencampur pakaian antar-pelanggan demi higienitas mutlak dan mencegah risiko pakaian hilang atau tertukar.',
    },
    {
      icon: Droplets,
      color: 'bg-[#0D5CAD]',
      title: 'Air Murni Terfiltrasi 3 Tahap',
      desc: 'Air sumur dan PDAM disaring melalui filter sedimen, karbon aktif, dan resin pelembut. Hasilnya bebas zat besi dan kapur yang biasanya membuat pakaian putih cepat kusam dan menguning.',
    },
    {
      icon: Flame,
      color: 'bg-[#FDBE1A]',
      iconDark: true,
      title: 'Setrika Uap Boiler Industri Presisi',
      desc: 'Menggunakan uap murni bertekanan tinggi dari boiler komersial, bukan setrika listrik lempeng biasa. Menghilangkan kusut hingga serat terdalam tanpa risiko kain mengkilap, melar, atau gosong.',
    },
    {
      icon: Sparkles,
      color: 'bg-[#C8430E]',
      title: 'Parfum Mikrokapsul Tahan 14 Hari',
      desc: 'Formula parfum konsentrat impor dengan teknologi mikrokapsul yang menempel di pori kain dan melepaskan keharuman segar setiap kali pakaian bergerak. Bebas bau apek meski disimpan lama di lemari.',
    },
    {
      icon: Clock,
      color: 'bg-[#0D5CAD]',
      title: 'Pelacakan Status Resi Digital Real-Time',
      desc: 'Dari penimbangan di kasir, proses cuci, pengeringan suhu 60°C, setrika uap, hingga packing kedap udara, Anda dapat memantau setiap detik progres cucian melalui smartphone Anda.',
    },
    {
      icon: HeartHandshake,
      color: 'bg-emerald-600',
      title: 'Garansi 100% Bebas Risiko',
      desc: 'Jika ada cucian yang kurang licin, aroma belum optimal, atau noda yang bisa dibersihkan belum terangkat, kami cuci ulang tanpa biaya tambahan. Kepuasan Anda adalah reputasi kami.',
    },
  ];

  const workshopStats = [
    { value: '1 Mesin', label: '1 Pelanggan', sub: 'Higienis tanpa kompromi' },
    { value: '800+', label: 'Pelanggan Setia', sub: 'Aktif setiap bulan' },
    { value: '15.000+', label: 'Kg Pakaian Terawat', sub: 'Standar kualitas hotel' },
    { value: '100%', label: 'Garansi Cuci Ulang', sub: 'Bebas risiko & terjamin' },
  ];

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
              <span>Tentang Kucek.id • Dedikasi Kebersihan Pakaian</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-[54px] font-black text-[#1A1918] tracking-tight leading-[1.12] max-w-3xl mx-auto">
              Mendefinisikan ulang cara pakaian Anda dirawat dan dihargai
            </h1>

            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl mx-auto font-medium">
              Kami lahir dari rasa frustrasi terhadap kebiasaan laundry konvensional yang mencampur pakaian orang lain, menggunakan air keruh, dan setrika asal cepat. Di Kucek.id, pakaian Anda diperlakukan dengan kehormatan yang layak.
            </p>

            {/* Stats Band */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {workshopStats.map((st, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-[#E5DCD2] text-center shadow-xs"
                >
                  <p className="text-2xl sm:text-3xl font-black text-[#1A1918] tracking-tight">{st.value}</p>
                  <p className="text-xs font-bold text-[#C8430E] mt-0.5">{st.label}</p>
                  <p className="text-[10.5px] text-[#78716C] mt-1">{st.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. The Origin Story Section */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 items-center">
            {/* Left Photo Collage */}
            <div className="md:col-span-6 grid grid-cols-2 gap-3.5">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80"
                  alt="Proses setrika uap rapi kucek.id"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="space-y-3.5">
                <div className="rounded-3xl overflow-hidden aspect-square bg-slate-100 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80"
                    alt="Keranjang cucian bersih siap packing"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-square bg-[#F4EDE5] p-5 flex flex-col justify-center text-center">
                  <Award className="w-8 h-8 text-[#C8430E] mx-auto mb-2" />
                  <p className="text-xs font-extrabold text-[#1A1918]">Standar Higienitas 100%</p>
                  <p className="text-[10px] text-[#78716C] mt-1">Sertifikasi mesin industri & SOP higienis ketat</p>
                </div>
              </div>
            </div>

            {/* Right Story Copy */}
            <div className="md:col-span-6 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                Cerita di Balik Kucek.id
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight leading-tight">
                Pakaian yang bersih adalah hak mendasar, bukan kemewahan mahal.
              </h2>
              <div className="space-y-4 text-sm text-[#57534E] leading-relaxed">
                <p>
                  Semuanya berawal dari sebuah kenyataan pahit di industri laundry kiloan: banyak penyedia jasa yang menghemat biaya dengan menggabungkan cucian beberapa pelanggan ke dalam satu mesin raksasa. Dampaknya? Pakaian luntur, kancing patah, bau apek menyengat, hingga hilangnya pakaian favorit.
                </p>
                <p>
                  Kami mendirikan <strong>Kucek.id</strong> dengan prinsip yang tidak bisa ditawar: <strong>satu mesin hanya boleh memproses cucian satu pelanggan</strong>, apa pun paketnya. Pakaian Anda tidak pernah bersentuhan dengan pakaian orang asing.
                </p>
                <p>
                  Dipadukan dengan teknologi boiler uap murni suhu terkontrol dan sistem tracking digital terintegrasi, Kucek.id hadir untuk mengembalikan rasa tenang saat Anda menyerahkan pakaian harian maupun busana pesta termahal Anda kepada kami.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/app/pesan-jemput"
                  className="px-6 py-3 rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs font-extrabold tracking-wide shadow-sm transition inline-flex items-center gap-2"
                >
                  <span>Coba Layanan Jemput Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/layanan"
                  className="px-6 py-3 rounded-full bg-[#F4EDE5] hover:bg-[#EAE1D5] text-[#1A1918] text-xs font-extrabold tracking-wide transition"
                >
                  Lihat Katalog Layanan
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 6 Pilar Standar Kualitas Kucek.id */}
        <section className="py-16 sm:py-24 bg-[#FBF9F5]">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                SOP & Mutu Kerja
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
                6 Standar Ketat yang Menjaga Pakaian Anda Tetap Seperti Baru
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                Kami menerapkan prosedur operasional standar industri garmen untuk memastikan setiap serat kain mendapatkan perlakuan yang tepat dan higienis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commitments.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.04)] space-y-4 hover:border-[#C8430E]/40 hover:-translate-y-1 transition duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center shadow-xs`}
                    >
                      <Icon className={`w-6 h-6 ${c.iconDark ? 'text-[#1A1918]' : 'text-white'}`} />
                    </div>
                    <h3 className="text-base font-extrabold text-[#1A1918]">{c.title}</h3>
                    <p className="text-xs text-[#57534E] leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Perjalanan Tumbuh Kami (Milestone) */}
        <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                Langkah & Jejak Kami
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
                Dari Workshop Sederhana Menuju Standar Terpercaya
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Perjalanan konsistensi menjaga komitmen higienis bersama ribuan keluarga & profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TIMELINE_MILESTONES.map((tm) => (
                <div
                  key={tm.id}
                  className="bg-[#FBF9F5] rounded-3xl p-4 border border-slate-200/70 space-y-4 flex flex-col justify-between"
                >
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200">
                    <img
                      src={tm.imageUrl}
                      alt={tm.imageAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-sm font-extrabold text-[#1A1918]">{tm.title}</h4>
                    <p className="text-xs text-[#57534E] leading-relaxed">{tm.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Tim Ahli di Balik Mesin & Workshop */}
        <section className="py-16 sm:py-24 bg-[#FBF9F5]">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C8430E]">
                Para Profesional Perawat Kain
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
                Bertemu dengan Tim Ahli Kami
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Setiap staf di workshop Kucek.id telah tersertifikasi dalam pemahaman jenis serat kain, formula deterjen, dan teknik finishing uap.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {TEAM_EXPERTS.slice(0, 4).map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 text-center space-y-3 shadow-2xs hover:shadow-sm transition"
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden ring-4 ring-[#F4EDE5]">
                    <img
                      src={exp.avatarUrl}
                      alt={exp.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1A1918]">{exp.name}</h4>
                    <p className="text-[11px] font-semibold text-[#C8430E] mt-0.5">{exp.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Call To Action Banner */}
        <section className="py-16 sm:py-20 bg-[#1A1918] text-white">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Pakaian bersih, harum tahan lama, dan terawat rapi ada di depan mata.
            </h2>
            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
              Jadwalkan penjemputan gratis sekarang. Kurir kami siap meluncur ke depan pintu rumah atau kos Anda di area Sleman dan Yogyakarta.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/app/pesan-jemput"
                className="px-8 py-3.5 rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs sm:text-sm font-black tracking-wide shadow-md transition"
              >
                Pesan Antar-Jemput Gratis
              </Link>
              <Link
                to="/layanan"
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold tracking-wide transition border border-white/20"
              >
                Eksplorasi Layanan Lengkap
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
