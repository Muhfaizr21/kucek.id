import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Truck,
  Package,
  Wallet,
  Users,
  ArrowLeft,
  Sparkles,
  LogOut,
  Tag,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../../services/authService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Kasir POS', path: '/admin/pos', icon: ShoppingBag },
    { label: 'Antrean Produksi', path: '/admin/antrean-produksi', icon: Layers },
    { label: 'Antar-Jemput', path: '/admin/dispatch-jemput', icon: Truck },
    { label: 'Data Pelanggan', path: '/admin/pelanggan', icon: UserCheck },
    { label: 'Layanan & Tarif', path: '/admin/layanan', icon: Tag },
    { label: 'Paket Langganan', path: '/admin/paket-langganan', icon: Package },
    { label: 'Laporan Keuangan', path: '/admin/laporan-keuangan', icon: Wallet },
    { label: 'Manajemen Staf', path: '/admin/manajemen-staf', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 sticky top-0 h-screen">
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link
            to="/admin"
            className="flex items-center space-x-2.5 text-white font-extrabold text-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0095FF] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>
              kucek<span className="text-sky-400">.id</span>
            </span>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40">
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
            Mode Aktif
          </p>
          <p className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Superadmin (Owner)
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0095FF] text-white shadow-lg shadow-sky-600/25'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Web Utama</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-600">v2.0</span>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] bg-slate-900 text-slate-200 flex flex-col h-full z-10">
            <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-white font-extrabold text-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0095FF] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>
                  kucek<span className="text-sky-400">.id</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-[#0095FF] text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Outlet Utama: Kucek.id Hub Kaliurang
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-extrabold bg-emerald-100 text-emerald-700 rounded-full">
              Operasional Buka
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">
                Masuk sebagai:
              </span>
              <strong className="text-xs font-extrabold text-slate-800">
                {currentUser?.name || 'Superadmin Kucek'}
              </strong>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
