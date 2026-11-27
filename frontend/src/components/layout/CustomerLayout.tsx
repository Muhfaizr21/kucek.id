import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Truck,
  Layers,
  ClipboardList,
  TicketPercent,
  MessageCircle,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Sparkles,
  User,
} from 'lucide-react';
import { getCurrentUser, logoutUser, type AuthUser } from '../../services/authService';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [avatarUrl, setAvatarUrl] = useState<string>(
    () =>
      getCurrentUser()?.avatar_url ||
      localStorage.getItem('kucek_customer_avatar') ||
      DEFAULT_AVATAR
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Sinkronisasi langsung ketika pengguna mengubah nama atau upload foto PP di halaman Settings
  useEffect(() => {
    const syncUser = () => {
      const updated = getCurrentUser();
      setCurrentUser(updated);
      setAvatarUrl(
        updated?.avatar_url ||
          localStorage.getItem('kucek_customer_avatar') ||
          DEFAULT_AVATAR
      );
    };
    window.addEventListener('kucek-user-updated', syncUser);
    return () => window.removeEventListener('kucek-user-updated', syncUser);
  }, []);

  const displayName = currentUser?.name || 'Budi Santoso';
  const displayEmail = currentUser?.email || 'user@kucek.id';

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login', { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    if (trimmed.toUpperCase().startsWith('KCK-')) {
      navigate(`/app/lacak/${trimmed.toUpperCase()}`);
    } else {
      navigate(`/app/riwayat?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const isMenuActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    if (path === '/app/lacak') {
      return (
        location.pathname.startsWith('/app/lacak') ||
        location.pathname.startsWith('/track')
      );
    }
    return location.pathname.startsWith(path);
  };

  // Menu utama
  const mainMenuItems = [
    { label: 'Dashboard', shortLabel: 'Beranda', path: '/app', icon: LayoutGrid },
    { label: 'Pesan Jemput', shortLabel: 'Jemput', path: '/app/pesan-jemput', icon: Truck },
    { label: 'Paket & Kuota', shortLabel: 'Paket', path: '/app/beli-paket', icon: Layers },
    { label: 'Pesanan Saya', shortLabel: 'Pesanan', path: '/app/riwayat', icon: ClipboardList },
    { label: 'Voucher & Promo', shortLabel: 'Voucher', path: '/app/voucher', icon: TicketPercent },
    { label: 'Lacak Resi Live', shortLabel: 'Lacak', path: '/app/lacak', icon: MessageCircle },
  ];

  const isSettingsActive = location.pathname.startsWith('/app/pengaturan');

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full py-6 select-none">
      <div>
        {/* Brand Logo matching TechBomb two-tone style with blue underline accent */}
        <div className="px-7 mb-8 flex items-center justify-between">
          <Link to="/app" className="inline-flex items-baseline tracking-tight">
            <span className="text-[23px] font-black text-[#0095FF]">kucek</span>
            <span className="text-[23px] font-black text-[#111827] relative">
              .id
              <span className="absolute -bottom-1 left-0.5 right-0 h-[3px] bg-[#0095FF] rounded-full" />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Section */}
        <div>
          <p className="px-7 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
            Menu
          </p>
          <nav className="space-y-1 pr-4">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isMenuActive(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3.5 pl-7 pr-5 py-2.5 rounded-r-full text-[13.5px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0095FF] text-white shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)]'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-5 mx-7 border-t border-slate-100" />

        {/* Other Section */}
        <div>
          <p className="px-7 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
            Other
          </p>
          <div className="space-y-1 pr-4">
            <Link
              to="/app/pengaturan"
              onClick={() => setMobileSidebarOpen(false)}
              className={`w-full flex items-center gap-3.5 pl-7 pr-5 py-2.5 rounded-r-full text-[13.5px] font-semibold transition-all duration-200 ${
                isSettingsActive
                  ? 'bg-[#0095FF] text-white shadow-[0_8px_18px_-4px_rgba(0,149,255,0.45)]'
                  : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
              }`}
            >
              <Settings className="w-[18px] h-[18px] shrink-0" />
              <span>Profil & Settings</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 pl-7 pr-5 py-2.5 rounded-r-full text-[13.5px] font-semibold text-[#64748B] hover:text-rose-600 hover:bg-rose-50/60 transition cursor-pointer"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Mini Card: Hygienic Protocol Info */}
      <div className="mx-5 p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#E1EDFC]">
        <div className="flex items-center gap-2 text-[#0095FF] font-extrabold text-xs">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>1 Mesin 1 Pelanggan</span>
        </div>
        <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
          Pakaian Anda dicuci terpisah dan higienis tanpa pernah dicampur.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] flex font-sans text-[#111827]">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:block w-[236px] bg-white border-r border-slate-100 shrink-0 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-[260px] max-w-[82vw] bg-white h-full z-10 shadow-2xl overflow-y-auto">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-7 lg:px-8 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-[440px]">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Buka Menu"
              className="lg:hidden p-2 rounded-xl bg-[#F5F7FA] text-slate-700 hover:bg-slate-200 transition shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo (visible on small phones) */}
            <Link
              to="/app"
              className="sm:hidden inline-flex items-baseline tracking-tight mr-1 shrink-0"
            >
              <span className="text-lg font-black text-[#0095FF]">kucek</span>
              <span className="text-lg font-black text-[#111827]">.id</span>
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="w-full bg-[#F5F7FA] rounded-xl px-3.5 py-2 sm:py-2.5 flex items-center justify-between gap-2 border border-transparent focus-within:border-[#0095FF]/40 focus-within:bg-white focus-within:shadow-xs transition"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari resi KCK-2026-001 atau layanan..."
                className="w-full bg-transparent text-xs font-medium text-slate-700 placeholder:text-[#94A3B8] focus:outline-none min-w-0"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="text-[#64748B] hover:text-[#0095FF] transition cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Notification Bell & User Profile */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Notification Bell with Blue Dot */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-[#94A3B8] hover:text-[#111827] hover:bg-slate-50 transition cursor-pointer"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5 fill-[#CBD5E1] text-[#94A3B8]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0095FF] border-2 border-white absolute top-1.5 right-1.5" />
              </button>

              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-76 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <span className="text-xs font-extrabold text-slate-900">
                        Notifikasi Cucian Live
                      </span>
                      <span className="text-[10px] font-bold text-[#0095FF] bg-sky-50 px-2 py-0.5 rounded-full">
                        3 Aktif
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs mt-1">
                      <div
                        onClick={() => {
                          setNotifOpen(false);
                          navigate('/app/lacak/KCK-2026-001');
                        }}
                        className="py-2.5 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
                      >
                        <p className="font-bold text-slate-800">
                          KCK-2026-001 • Tahap Setrika Uap
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Cucian 4.5 Kg Anda sedang disetrika uap & quality control.
                        </p>
                      </div>
                      <div
                        onClick={() => {
                          setNotifOpen(false);
                          navigate('/app/voucher');
                        }}
                        className="py-2.5 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
                      >
                        <p className="font-bold text-[#0095FF]">
                          3 Voucher Diskon Siap Dipakai!
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Gunakan KUCEKHEMAT20 atau ONGKIRGRATIS untuk pesanan berikutnya.
                        </p>
                      </div>
                      <div
                        onClick={() => {
                          setNotifOpen(false);
                          navigate('/app/beli-paket');
                        }}
                        className="py-2.5 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition"
                      >
                        <p className="font-bold text-slate-800">
                          Kuota Paket Keluarga Aktif
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Kelola saldo kuota langganan dan klaim promo top-up.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile Avatar + Name + Email */}
            <Link
              to="/app/pengaturan"
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-200 shadow-2xs group-hover:border-[#0095FF] transition"
              />
              <div className="hidden sm:block text-left">
                <p className="text-[13.5px] font-extrabold text-[#111827] leading-tight group-hover:text-[#0095FF] transition">
                  {displayName}
                </p>
                <p className="text-[11.5px] font-medium text-[#94A3B8] leading-tight mt-0.5">
                  {displayEmail}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Workspace Canvas (extra bottom padding on mobile for sticky bottom bar) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly App Bar for < 1024px) */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-40 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_-4px_rgba(15,23,42,0.06)]"
      >
        {[
          { label: 'Beranda', path: '/app', icon: LayoutGrid },
          { label: 'Jemput', path: '/app/pesan-jemput', icon: Truck },
          { label: 'Voucher', path: '/app/voucher', icon: TicketPercent },
          { label: 'Lacak', path: '/app/lacak', icon: MessageCircle },
          { label: 'Profil', path: '/app/pengaturan', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const active =
            item.path === '/app/pengaturan'
              ? isSettingsActive
              : isMenuActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition ${
                active ? 'text-[#0095FF]' : 'text-[#94A3B8] hover:text-[#111827]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
