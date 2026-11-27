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

  // Menu utama (Seluruhnya halaman penuh dengan data real)
  const mainMenuItems = [
    { label: 'Dashboard', path: '/app', icon: LayoutGrid },
    { label: 'Pesan Jemput', path: '/app/pesan-jemput', icon: Truck },
    { label: 'Paket & Kuota', path: '/app/beli-paket', icon: Layers },
    { label: 'Pesanan Saya', path: '/app/riwayat', icon: ClipboardList },
    { label: 'Voucher & Promo', path: '/app/voucher', icon: TicketPercent },
    { label: 'Lacak Resi Live', path: '/app/lacak', icon: MessageCircle },
  ];

  const isSettingsActive = location.pathname === '/app/pengaturan';

  const renderSidebarContent = () => (
    <div className="flex flex-col justify-between h-full py-6 select-none">
      <div>
        {/* Brand Logo matching TechBomb two-tone style with blue underline accent */}
        <div className="px-8 mb-8 flex items-center justify-between">
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
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Section */}
        <div>
          <p className="px-8 text-[11.5px] font-medium text-[#94A3B8] mb-2.5">Menu</p>
          <nav className="space-y-1 pr-4">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === '/app/lacak' &&
                  (location.pathname.startsWith('/app/lacak') ||
                    location.pathname.startsWith('/track'))) ||
                (item.path === '/app/voucher' &&
                  location.pathname.startsWith('/app/voucher'));

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3.5 pl-8 pr-5 py-2.5 rounded-r-full text-[13.5px] font-semibold transition-all ${
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
        <div className="my-5 mx-8 border-t border-slate-100" />

        {/* Other Section (Profil & Settings Disatukan) */}
        <div>
          <p className="px-8 text-[11.5px] font-medium text-[#94A3B8] mb-2.5">Other</p>
          <div className="space-y-1 pr-4">
            <Link
              to="/app/pengaturan"
              onClick={() => setMobileSidebarOpen(false)}
              className={`w-full flex items-center gap-3.5 pl-8 pr-5 py-2.5 rounded-r-full text-[13.5px] font-semibold transition-all ${
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
              className="w-full flex items-center gap-3.5 pl-8 pr-5 py-2.5 rounded-r-full text-[13.5px] font-semibold text-[#64748B] hover:text-rose-600 hover:bg-rose-50/60 transition cursor-pointer"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Mini Card: Hygienic Protocol Info */}
      <div className="mx-6 p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#E1EDFC] hidden lg:block">
        <div className="flex items-center gap-2 text-[#0095FF] font-extrabold text-xs">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>1 Mesin 1 Pelanggan</span>
        </div>
        <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
          Pakaian Anda tidak pernah dicampur dengan milik pelanggan lain.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] flex font-sans text-[#111827]">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:block w-[240px] bg-white border-r border-slate-100 shrink-0 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-[250px] bg-white h-full z-10 shadow-2xl">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 px-5 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-[420px]">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="w-full bg-[#F5F7FA] rounded-xl px-4 py-2.5 flex items-center justify-between gap-2 border border-transparent focus-within:border-[#0095FF]/40 focus-within:bg-white transition"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari resi KCK-2026-001 atau layanan..."
                className="w-full bg-transparent text-xs font-medium text-slate-700 placeholder:text-[#94A3B8] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Cari"
                className="text-[#64748B] hover:text-[#0095FF] transition cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Notification Bell & User Profile */}
          <div className="flex items-center gap-5 sm:gap-6">
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
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
              )}
            </div>

            {/* User Profile Avatar + Name + Email */}
            <Link
              to="/app/pengaturan"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:border-[#0095FF] transition"
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

        {/* Main Workspace Canvas */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
