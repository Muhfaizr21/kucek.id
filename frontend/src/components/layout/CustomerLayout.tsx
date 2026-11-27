import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Truck, Package, Clock, Sparkles, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../../services/authService';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Beranda', path: '/app', icon: Home },
    { label: 'Pesan Jemput', path: '/app/pesan-jemput', icon: Truck },
    { label: 'Paket Kuota', path: '/app/beli-paket', icon: Package },
    { label: 'Riwayat', path: '/app/riwayat', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/app" className="flex items-center space-x-1.5 text-sky-600 font-extrabold text-xl">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>kucek<span className="text-slate-900">.id</span></span>
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full font-semibold">
              Pelanggan: {currentUser?.name || 'Budi Santoso'}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
        {children}
      </main>

      {/* Bottom Navigation for Mobile / Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center text-xs font-semibold transition ${
                  isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
