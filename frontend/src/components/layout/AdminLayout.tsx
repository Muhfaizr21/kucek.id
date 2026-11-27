import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Truck, 
  Wallet, 
  Package, 
  Users, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Kasir POS', path: '/admin/pos', icon: ShoppingBag },
    { label: 'Antrean Produksi', path: '/admin/antrean-produksi', icon: Layers },
    { label: 'Antar-Jemput', path: '/admin/dispatch-jemput', icon: Truck },
    { label: 'Paket Langganan', path: '/admin/paket-langganan', icon: Package },
    { label: 'Laporan Keuangan', path: '/admin/laporan-keuangan', icon: Wallet },
    { label: 'Manajemen Staf', path: '/admin/manajemen-staf', icon: Users, badge: 'Fase 2' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link to="/admin" className="flex items-center space-x-2 text-white font-extrabold text-xl">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span>kucek<span className="text-sky-400">.id</span></span>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mode Aktif</p>
          <p className="text-sm font-semibold text-sky-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Superadmin (Owner)
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-sky-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Ke Web Utama
          </Link>
          <span>v1.0.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Outlet Utama: Kucek.id Dipatiukur</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Buka</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">Masuk sebagai: <b className="text-slate-800">Owner Superadmin</b></span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
