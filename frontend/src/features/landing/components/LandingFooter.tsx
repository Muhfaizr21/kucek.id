import React from 'react';
import { Link } from 'react-router-dom';

export const LandingFooter: React.FC = () => {
  return (
    <footer id="kontak" className="bg-[#1A1918] text-white py-14">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="text-2xl font-extrabold tracking-tight inline-block">
              kucek<span className="text-[#FDBE1A]">.id</span>
            </Link>
            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              Layanan laundry kiloan dan satuan dengan pencucian terpisah per pelanggan, setrika uap, penjemputan ke rumah, serta pelacakan status nota secara langsung.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-white/60">Navigasi</p>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="#beranda" className="hover:text-white transition inline-block py-1">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-white transition inline-block py-1">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#paket" className="hover:text-white transition inline-block py-1">
                  Paket Harga
                </a>
              </li>
              <li>
                <a href="#lacak" className="hover:text-[#FDBE1A] transition inline-block py-1">
                  Cek Resi & Kalkulator
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-xs">
            <p className="font-extrabold uppercase tracking-wider text-white/60">Alamat & Jam Operasional</p>
            <p className="text-white/80 leading-relaxed">
              Jl. Dipatiukur No. 45, Coblong, Kota Bandung
              <br />
              Buka Setiap Hari: 07.00 - 21.00 WIB (Pelacakan Online 24 Jam)
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white font-bold transition"
              >
                Masuk / Daftar Akun
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-2">
          <p>&copy; {new Date().getFullYear()} kucek.id. Seluruh hak cipta dilindungi.</p>
          <p>Layanan Laundry Kiloan, Satuan & Antar-Jemput</p>
        </div>
      </div>
    </footer>
  );
};
