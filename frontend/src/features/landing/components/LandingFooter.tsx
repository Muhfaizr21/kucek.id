import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer id="kontak" className="bg-[#1A1918] text-white py-14 sm:py-16">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="text-2xl font-black tracking-tight inline-block">
              kucek<span className="text-[#C8430E]">.id</span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Standar baru laundry higienis modern dengan prinsip <strong className="text-white">1 Mesin 1 Pelanggan</strong>, filtrasi air murni bertingkat, uap boiler bertekanan, dan layanan antar-jemput bergaransi tepat waktu.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#FDBE1A] font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garansi 100% Cuci Ulang Gratis jika Kurang Bersih</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-white/50 text-[11px]">Navigasi Halaman</p>
            <ul className="space-y-2.5 text-white/80 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition inline-block py-0.5">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="hover:text-white transition inline-block py-0.5">
                  Tentang Kami & Standar Mutu
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="hover:text-white transition inline-block py-0.5">
                  Daftar Layanan & Tarif
                </Link>
              </li>
              <li>
                <Link to="/lacak" className="hover:text-[#FDBE1A] transition inline-block py-0.5 font-bold">
                  Lacak Resi Cucian Live
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition inline-block py-0.5">
                  Portal Masuk Pelanggan
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop Contact & Info */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-white/50 text-[11px]">Workshop & Operasional</p>
            <div className="space-y-2 text-white/80 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8430E] shrink-0 mt-0.5" />
                <span>Kucek Hub Kaliurang: Jl. Kaliurang KM 5 No. 12, Sleman, DI Yogyakarta</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FDBE1A] shrink-0" />
                <span>Buka Setiap Hari: 07.00 - 21.00 WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Hotline: 0812-9876-5432</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/app/pesan-jemput"
                className="px-5 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs font-bold transition shadow-sm"
              >
                Booking Penjemputan Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
          <p>&copy; {new Date().getFullYear()} kucek.id • Standar Higienis 1 Mesin 1 Pelanggan. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/layanan" className="hover:text-white transition">Kiloan & Satuan</Link>
            <span>•</span>
            <Link to="/tentang" className="hover:text-white transition">Standar Mutu</Link>
            <span>•</span>
            <Link to="/lacak" className="hover:text-white transition">Live Tracking</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
