import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#F4EDE5] sticky top-0 z-50 border-b border-[#E5DCD2]/70">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: kucek.id */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-[#1A1918] tracking-tight min-h-[44px] inline-flex items-center"
        >
          kucek<span className="text-[#C8430E]">.id</span>
        </Link>

        {/* Center Navigation Links (Desktop: 4 items matching reference) */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#4A4643]"
        >
          <a
            href="#beranda"
            className="text-[#1A1918] font-bold border-b-2 border-[#1A1918] py-1 min-h-[44px] inline-flex items-center"
          >
            Beranda
          </a>
          <a
            href="#tentang"
            className="hover:text-[#1A1918] transition py-1 min-h-[44px] inline-flex items-center"
          >
            Tentang Kami
          </a>
          <a
            href="#paket"
            className="hover:text-[#1A1918] transition py-1 min-h-[44px] inline-flex items-center"
          >
            Harga
          </a>
          <a
            href="#kontak"
            className="hover:text-[#1A1918] transition py-1 min-h-[44px] inline-flex items-center"
          >
            Kontak
          </a>
        </nav>

        {/* Right Action Button */}
        <div className="hidden md:flex items-center">
          <Link
            to="/login"
            className="px-6 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] active:bg-[#932F08] text-white text-sm font-bold transition"
          >
            Daftar Akun
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-[#1A1918] hover:bg-[#E8DFD5] active:bg-[#DDD2C5] transition"
        >
          {mobileMenuOpen ? (
            <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Navigasi Seluler"
          className="md:hidden bg-[#F4EDE5] border-t border-[#E5DCD2] px-6 py-4 space-y-1"
        >
          <a
            href="#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] text-sm font-bold text-[#1A1918]"
          >
            Beranda
          </a>
          <a
            href="#tentang"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] text-sm font-medium text-[#4A4643]"
          >
            Tentang Kami
          </a>
          <a
            href="#paket"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] text-sm font-medium text-[#4A4643]"
          >
            Harga
          </a>
          <a
            href="#kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] text-sm font-medium text-[#4A4643]"
          >
            Kontak
          </a>
          <div className="pt-3 border-t border-[#E5DCD2]">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-sm font-bold"
            >
              Daftar Akun
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
