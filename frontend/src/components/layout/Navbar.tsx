import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Search, LogIn, LayoutDashboard, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-sky-600 font-extrabold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span>kucek<span className="text-slate-900">.id</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <Link to="/" className={`hover:text-sky-600 transition ${location.pathname === '/' ? 'text-sky-600' : ''}`}>
            Beranda
          </Link>
          <Link to="/track" className={`hover:text-sky-600 transition flex items-center gap-1.5 ${location.pathname.startsWith('/track') ? 'text-sky-600' : ''}`}>
            <Search className="w-4 h-4" /> Cek Resi Live
          </Link>
          <Link to="/app" className="hover:text-sky-600 transition flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" /> Portal Pelanggan
          </Link>
          <Link to="/admin" className="hover:text-sky-600 transition flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-sky-600" /> Superadmin
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
