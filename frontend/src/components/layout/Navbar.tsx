import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#F4EDE5] border-b border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-extrabold text-[#1A1918] tracking-tight min-h-[44px] inline-flex items-center"
        >
          kucek<span className="text-[#C8430E]">.id</span>
        </Link>

        <nav
          aria-label="Navigasi Publik"
          className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#4A4643]"
        >
          <Link
            to="/"
            className={`hover:text-[#1A1918] transition py-1 min-h-[44px] inline-flex items-center ${
              location.pathname === '/' ? 'text-[#1A1918] font-bold border-b-2 border-[#1A1918]' : ''
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/track"
            className={`hover:text-[#1A1918] transition py-1 min-h-[44px] inline-flex items-center ${
              location.pathname.startsWith('/track')
                ? 'text-[#1A1918] font-bold border-b-2 border-[#1A1918]'
                : ''
            }`}
          >
            Cek Resi
          </Link>
        </nav>

        <div className="flex items-center">
          <Link
            to="/login"
            className="px-6 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-sm font-bold transition"
          >
            Daftar Akun
          </Link>
        </div>
      </div>
    </header>
  );
};
