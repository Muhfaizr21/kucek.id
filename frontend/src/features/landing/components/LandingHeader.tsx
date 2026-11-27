import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Tentang Kami', to: '/tentang' },
    { label: 'Layanan & Tarif', to: '/layanan' },
    { label: 'Lacak Resi Live', to: '/lacak' },
  ];

  return (
    <header className="w-full bg-[#F4EDE5] sticky top-0 z-50 border-b border-[#E5DCD2]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo: kucek.id */}
        <Link
          to="/"
          className="text-2xl font-black text-[#1A1918] tracking-tight min-h-[44px] inline-flex items-center gap-1 group"
        >
          <span>kucek</span>
          <span className="text-[#C8430E] group-hover:scale-110 transition-transform">.id</span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center space-x-7 text-[13.5px] font-semibold text-[#57534E]"
        >
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`py-1 min-h-[44px] inline-flex items-center transition relative ${
                  isActive
                    ? 'text-[#1A1918] font-bold after:absolute after:bottom-3 after:left-0 after:right-0 after:h-0.5 after:bg-[#C8430E]'
                    : 'hover:text-[#1A1918]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 min-h-[44px] inline-flex items-center justify-center text-xs font-bold text-[#1A1918] hover:text-[#C8430E] transition"
          >
            Masuk Akun
          </Link>
          <Link
            to="/app/pesan-jemput"
            className="px-5 py-2.5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] active:bg-[#932F08] text-white text-xs font-extrabold tracking-wide shadow-sm hover:shadow-md transition-all"
          >
            Pesan Antar-Jemput
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
          className="md:hidden bg-[#F4EDE5] border-t border-[#E5DCD2] px-6 py-4 space-y-1 shadow-lg"
        >
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] text-sm ${
                  isActive ? 'text-[#C8430E] font-extrabold' : 'text-[#1A1918] font-bold'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#E5DCD2] flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[#D5C9BD] text-xs font-bold text-[#1A1918]"
            >
              Masuk Akun
            </Link>
            <Link
              to="/app/pesan-jemput"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] inline-flex items-center justify-center rounded-xl bg-[#C8430E] text-white text-xs font-extrabold shadow-sm"
            >
              Pesan Antar-Jemput
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};
