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
  LogOut,
  Tag,
  UserCheck,
  Menu,
  X,
  Search,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
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
  const [collapsed, setCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = globalSearch.trim();
    if (!q) return;
    if (q.toUpperCase().startsWith('KCK-')) {
      navigate('/admin/antrean-produksi');
    } else {
      navigate('/admin/pelanggan');
    }
  };

  const navItems = [
    { label: 'Statistik & Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Kasir POS', path: '/admin/pos', icon: ShoppingBag },
    {
      label: 'Antrean Produksi',
      path: '/admin/antrean-produksi',
      icon: Layers,
    },
    { label: 'Antar-Jemput Kurir', path: '/admin/dispatch-jemput', icon: Truck },
    { label: 'Data Pelanggan', path: '/admin/pelanggan', icon: UserCheck },
    { label: 'Layanan & Tarif', path: '/admin/layanan', icon: Tag },
    { label: 'Paket Langganan', path: '/admin/paket-langganan', icon: Package },
    { label: 'Keuangan & Kas', path: '/admin/laporan-keuangan', icon: Wallet },
    { label: 'Tim & Staf', path: '/admin/manajemen-staf', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row text-slate-900">
      {/* Wylro-Style Clean White Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex ${
          collapsed ? 'w-20' : 'w-60'
        } bg-white border-r border-slate-200/80 flex-col shrink-0 sticky top-0 h-screen transition-all duration-200 select-none`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-black text-base tracking-tighter shrink-0 shadow-xs">
              K
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-extrabold text-[15px] text-slate-900 tracking-tight">
                  Kucek Workspace
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center ${
                  collapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                } py-2.5 rounded-xl text-[13px] transition-all ${
                  isActive
                    ? 'bg-[#EEF4FF] text-[#2563EB] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-[17px] h-[17px] shrink-0 ${
                      isActive ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {isActive && !collapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Collapse Button & Copyright */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'gap-2.5 px-3'
            } py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>Lihat Web Pelanggan</span>}
          </Link>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center' : 'gap-2 px-3'
            } py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Kecilkan menu</span>
              </>
            )}
          </button>

          {!collapsed && (
            <p className="px-3 pt-1 text-[10px] text-slate-400">
              © 2026 kucek.id. Hak cipta dilindungi.
            </p>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] bg-white text-slate-800 flex flex-col h-full z-10 shadow-2xl">
            <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 font-extrabold text-base text-slate-900"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-black">
                  K
                </div>
                <span>Kucek Workspace</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs ${
                      isActive
                        ? 'bg-[#EEF4FF] text-[#2563EB] font-bold'
                        : 'text-slate-600 hover:bg-slate-50 font-medium'
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
        {/* Wylro-Style Clean White Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-7 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Outlet Utama: Kucek.id Hub Kaliurang</span>
            </div>
          </div>

          {/* Right Header Controls: Search + Bell + Help + Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            <form
              onSubmit={handleGlobalSearchSubmit}
              className="relative w-44 sm:w-64"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari resi, pelanggan..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2563EB]"
              />
            </form>

            <button
              type="button"
              onClick={() => navigate('/admin/antrean-produksi')}
              title="Antrean Produksi Aktif"
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/layanan')}
              title="Pengaturan Katalog & Tarif"
              className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 py-1 px-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-extrabold text-slate-900 leading-tight">
                    {currentUser?.name || 'Superadmin Kucek'}
                  </p>
                  <p className="text-[10.5px] font-medium text-slate-400 leading-tight">
                    Admin / Owner
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl p-1.5 z-50">
                  <Link
                    to="/admin/manajemen-staf"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Manajemen Tim & Staf</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-7 flex-1 overflow-y-auto">{children}</main>

        {/* Wylro-Style Clean Bottom Footer */}
        <footer className="px-7 py-3.5 bg-white border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>
            Kucek.id Laundry Management System • 1 Mesin 1 Pelanggan Standard
          </span>
          <div className="flex items-center gap-4">
            <Link to="/admin/layanan" className="hover:text-slate-700">
              Standar Tarif
            </Link>
            <Link to="/admin/laporan-keuangan" className="hover:text-slate-700">
              Audit Kas
            </Link>
            <Link to="/lacak" className="hover:text-slate-700">
              Portal Resi Live
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};
