import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#F4EDE5] sticky top-0 z-50 border-b border-[#E7DEC3]/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo (NeatWash / kucek.id style) */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold text-[#1A1918] tracking-tight flex items-center gap-1.5"
        >
          <span>NeatWash</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#C8430E]/10 text-[#C8430E]">
            kucek.id
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#4A4643]">
          <a
            href="#home"
            className="text-[#1A1918] font-semibold border-b-2 border-[#1A1918] pb-0.5"
          >
            Home
          </a>
          <a href="#about" className="hover:text-[#1A1918] transition">
            About us
          </a>
          <a href="#pricing" className="hover:text-[#1A1918] transition">
            Pricing
          </a>
          <a href="#calculator" className="hover:text-[#1A1918] transition">
            Cek Resi & Kalkulator
          </a>
          <Link to="/app" className="hover:text-[#C8430E] transition font-semibold">
            Portal Pelanggan
          </Link>
          <Link to="/admin" className="hover:text-[#0D5CAD] transition font-semibold">
            Superadmin
          </Link>
        </nav>

        {/* Right Sign Up Pill Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full bg-[#C8430E] hover:bg-[#B0390B] text-white text-sm font-semibold shadow-sm transition active:scale-95"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#1A1918] hover:bg-[#E8DFD5] transition"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F4EDE5] border-t border-[#E5DCD2] px-6 py-5 space-y-3">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#1A1918]"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#4A4643]"
          >
            About us
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#4A4643]"
          >
            Pricing
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#4A4643]"
          >
            Cek Resi & Kalkulator
          </a>
          <div className="pt-2 border-t border-[#E5DCD2] flex flex-col gap-2">
            <Link
              to="/app"
              className="text-sm font-semibold text-[#C8430E]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Portal Pelanggan (/app)
            </Link>
            <Link
              to="/admin"
              className="text-sm font-semibold text-[#0D5CAD]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard Superadmin (/admin)
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 w-full py-2.5 rounded-full bg-[#C8430E] text-white text-center text-sm font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
