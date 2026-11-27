import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  SEEDER_ACCOUNTS,
  loginWithApi,
  registerWithApi,
  type SeederAccount,
} from '../../../services/authService';

interface LoginPageProps {
  initialMode?: 'login' | 'register';
}

/**
 * Ikon Kartu Identitas (ID Card) persis seperti di sebelah input First name / Last name pada gambar referensi
 */
const IdBadgeIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
      active ? 'text-[#2185F0]' : 'text-[#8F9BB3]'
    }`}
  >
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <circle cx="8.5" cy="11" r="2" />
    <path d="M5.5 15.5c.8-1.4 1.8-2 3-2s2.2.6 3 2" />
    <line x1="14.5" y1="10" x2="18.5" y2="10" />
    <line x1="14.5" y1="14" x2="17.5" y2="14" />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ initialMode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tentukan mode awal dari URL (/register, /daftar vs /login) atau prop
  const derivedMode: 'login' | 'register' =
    initialMode ||
    (location.pathname === '/register' || location.pathname === '/daftar'
      ? 'register'
      : 'login');

  const [mode, setMode] = useState<'login' | 'register'>(derivedMode);
  const [selectedSeeder, setSelectedSeeder] = useState<'superadmin' | 'pelanggan'>('superadmin');

  // Form states
  const [firstName, setFirstName] = useState('Budi');
  const [lastName, setLastName] = useState('Santoso');
  const [email, setEmail] = useState(SEEDER_ACCOUNTS[0].email);
  const [phone, setPhone] = useState('081298765432');
  const [password, setPassword] = useState(SEEDER_ACCOUNTS[0].password);

  // UI states
  const [focusedField, setFocusedField] = useState<string>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const nextMode = location.pathname === '/register' ? 'register' : 'login';
    setMode(nextMode);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (nextMode === 'register') {
      setFirstName('Budi');
      setLastName('Santoso');
      setEmail('budi.santoso@kucek.id');
      setPhone('081298765432');
      setPassword('kucek123');
    } else {
      const currentAcc =
        SEEDER_ACCOUNTS.find((a) => a.id === selectedSeeder) || SEEDER_ACCOUNTS[0];
      setEmail(currentAcc.email);
      setPassword(currentAcc.password);
    }
  }, [location.pathname]);

  const handleSwitchMode = (targetMode: 'login' | 'register') => {
    setMode(targetMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    navigate(targetMode === 'register' ? '/register' : '/login', { replace: true });
  };

  const handleSelectSeeder = (account: SeederAccount) => {
    setSelectedSeeder(account.id);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (mode !== 'login') {
      setMode('login');
      navigate('/login', { replace: true });
    }
    setEmail(account.email);
    setPassword(account.password);
    setFocusedField('password');
  };

  const handleCycleSeederMethod = () => {
    const nextId = selectedSeeder === 'superadmin' ? 'pelanggan' : 'superadmin';
    const nextAcc = SEEDER_ACCOUNTS.find((a) => a.id === nextId) || SEEDER_ACCOUNTS[0];
    handleSelectSeeder(nextAcc);
  };

  const handleQuickLoginSeeder = async (account: SeederAccount) => {
    handleSelectSeeder(account);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginWithApi(account.email, account.password);
      setSuccessMessage(
        `Berhasil masuk sebagai ${result.user.name} (${result.user.role}). Mengalihkan...`
      );
      setTimeout(() => {
        navigate(result.redirectPath, { replace: true });
      }, 350);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Gagal masuk dengan akun seeder'
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await loginWithApi(email, password);
        setSuccessMessage(
          `Login berhasil! Mengalihkan ke ${
            result.redirectPath === '/admin' ? 'Dashboard Superadmin' : 'Portal Pelanggan'
          }...`
        );
        setTimeout(() => {
          navigate(result.redirectPath, { replace: true });
        }, 350);
      } else {
        if (!firstName.trim()) {
          throw new Error('Nama depan wajib diisi');
        }
        if (password.length < 6) {
          throw new Error('Kata sandi minimal 6 karakter');
        }
        const result = await registerWithApi({
          firstName,
          lastName,
          email,
          phone,
          password,
        });
        setSuccessMessage(
          `Akun ${result.user.name} berhasil dibuat! Mengalihkan ke Portal Pelanggan...`
        );
        setTimeout(() => {
          navigate(result.redirectPath, { replace: true });
        }, 450);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses akun'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row font-sans selection:bg-[#2185F0] selection:text-white">
      {/* LEFT COLUMN: Header + Form */}
      <div className="w-full lg:w-[55%] xl:w-[52%] min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-8 lg:py-10 relative z-20 bg-white">
          {/* Top Bar inside Card */}
          <header className="flex items-center justify-between sm:justify-start sm:gap-20">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none"
            >
              <span className="w-7 h-7 rounded-full bg-[#2185F0] shadow-md shadow-[#2185F0]/30 inline-block transition-transform group-hover:scale-105" />
              <span className="text-[15.5px] font-extrabold text-[#1A1D26] tracking-tight">
                kucek.id<span className="text-[#2185F0]">.</span>
              </span>
            </Link>

            <nav className="flex items-center gap-7 sm:gap-11 text-[13.5px] font-semibold">
              <Link
                to="/"
                className="text-[#8F9BB3] hover:text-[#1A1D26] transition"
              >
                Beranda
              </Link>
              <button
                type="button"
                onClick={() =>
                  handleSwitchMode(mode === 'register' ? 'login' : 'register')
                }
                className="text-[#8F9BB3] hover:text-[#1A1D26] transition cursor-pointer"
              >
                {mode === 'register' ? 'Masuk' : 'Daftar'}
              </button>
            </nav>
          </header>

          {/* Center Form Block */}
          <div className="my-auto py-6 sm:py-8 max-w-[440px] w-full">
            {/* Eyebrow */}
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8F9BB3] mb-2">
              {mode === 'register' ? 'MULAI SEKARANG GRATIS' : 'SELAMAT DATANG KEMBALI'}
            </p>

            {/* Headline with blue period dot */}
            <h1 className="text-[32px] sm:text-[42px] font-black text-[#1A1D26] tracking-tight leading-[1.12]">
              {mode === 'register' ? 'Buat akun baru' : 'Masuk ke akun'}
              <span className="text-[#2185F0]">.</span>
            </h1>

            {/* Subtitle Member Switch */}
            <p className="text-[13.5px] font-medium text-[#8F9BB3] mt-3">
              {mode === 'register' ? (
                <>
                  Sudah menjadi member?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="text-[#2185F0] font-bold hover:underline cursor-pointer"
                  >
                    Masuk
                  </button>
                </>
              ) : (
                <>
                  Belum punya akun member?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('register')}
                    className="text-[#2185F0] font-bold hover:underline cursor-pointer"
                  >
                    Buat akun baru
                  </button>
                </>
              )}
            </p>

            {/* 2 Seeder Accounts Quick Bar (Superadmin & User Pelanggan) */}
            <div className="mt-5 p-2.5 rounded-2xl bg-[#F4F7FB] border border-[#E4E9F2]">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#6E7A91]">
                  2 Akun Seeder Siap Pakai (Klik isi / Masuk Instan)
                </span>
                <span className="text-[10px] font-bold text-[#2185F0] bg-white px-2 py-0.5 rounded-full border border-[#2185F0]/20">
                  Auto Redirect
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SEEDER_ACCOUNTS.map((acc) => {
                  const isSelected =
                    mode === 'login' &&
                    email.toLowerCase() === acc.email.toLowerCase();

                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectSeeder(acc)}
                      className={`group rounded-xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#2185F0] shadow-sm'
                          : 'bg-white/60 border-transparent hover:bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {acc.id === 'superadmin' ? (
                            <ShieldCheck className="w-4 h-4 text-[#2185F0] shrink-0" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <span className="text-xs font-extrabold text-[#1A1D26] truncate">
                            {acc.badge}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickLoginSeeder(acc);
                          }}
                          disabled={isLoading}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2185F0]/10 text-[#2185F0] hover:bg-[#2185F0] hover:text-white transition shrink-0 cursor-pointer"
                        >
                          Masuk →
                        </button>
                      </div>
                      <div className="mt-1.5 text-[10.5px] text-[#6E7A91] font-medium truncate">
                        <span className="font-bold text-slate-700">{acc.email}</span> • sandi:{' '}
                        <code className="font-bold text-slate-800">{acc.password}</code>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form Inputs matching exact floating-label cards from reference image */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* First Name */}
                  <label
                    onClick={() => setFocusedField('firstName')}
                    className={`rounded-[16px] px-4 py-2.5 flex items-center justify-between gap-2.5 transition-all duration-200 cursor-text ${
                      focusedField === 'firstName'
                        ? 'bg-white border-[1.5px] border-[#2185F0] shadow-[0_8px_22px_-6px_rgba(33,133,240,0.28)]'
                        : 'bg-[#F3F5F9] border-[1.5px] border-transparent hover:bg-[#EBEEF5]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span
                        className={`block text-[10px] font-semibold leading-tight mb-0.5 transition-colors ${
                          focusedField === 'firstName'
                            ? 'text-[#2185F0]'
                            : 'text-[#8F9BB3]'
                        }`}
                      >
                        Nama depan
                      </span>
                      <input
                        type="text"
                        value={firstName}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField('')}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Budi"
                        required
                        className="w-full bg-transparent text-[13.5px] font-bold text-[#1A1D26] focus:outline-none placeholder:text-slate-300"
                      />
                    </div>
                    <IdBadgeIcon active={focusedField === 'firstName'} />
                  </label>

                  {/* Last Name */}
                  <label
                    onClick={() => setFocusedField('lastName')}
                    className={`rounded-[16px] px-4 py-2.5 flex items-center justify-between gap-2.5 transition-all duration-200 cursor-text ${
                      focusedField === 'lastName'
                        ? 'bg-white border-[1.5px] border-[#2185F0] shadow-[0_8px_22px_-6px_rgba(33,133,240,0.28)]'
                        : 'bg-[#F3F5F9] border-[1.5px] border-transparent hover:bg-[#EBEEF5]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span
                        className={`block text-[10px] font-semibold leading-tight mb-0.5 transition-colors ${
                          focusedField === 'lastName'
                            ? 'text-[#2185F0]'
                            : 'text-[#8F9BB3]'
                        }`}
                      >
                        Nama belakang
                      </span>
                      <input
                        type="text"
                        value={lastName}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField('')}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Santoso"
                        className="w-full bg-transparent text-[13.5px] font-bold text-[#1A1D26] focus:outline-none placeholder:text-slate-300"
                      />
                    </div>
                    <IdBadgeIcon active={focusedField === 'lastName'} />
                  </label>
                </div>
              )}

              {/* Email Field */}
              <label
                onClick={() => setFocusedField('email')}
                className={`rounded-[16px] px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-200 cursor-text ${
                  focusedField === 'email'
                    ? 'bg-white border-[1.5px] border-[#2185F0] shadow-[0_8px_22px_-6px_rgba(33,133,240,0.28)]'
                    : 'bg-[#F3F5F9] border-[1.5px] border-transparent hover:bg-[#EBEEF5]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-[10px] font-semibold leading-tight mb-0.5 transition-colors ${
                      focusedField === 'email' ? 'text-[#2185F0]' : 'text-[#8F9BB3]'
                    }`}
                  >
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@kucek.id"
                    required
                    className="w-full bg-transparent text-[13.5px] font-bold text-[#1A1D26] focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                <Mail
                  className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                    focusedField === 'email' ? 'text-[#2185F0]' : 'text-[#8F9BB3]'
                  }`}
                />
              </label>

              {/* Nomor WhatsApp (Khusus Register) */}
              {mode === 'register' && (
                <label
                  onClick={() => setFocusedField('phone')}
                  className={`rounded-[16px] px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-200 cursor-text ${
                    focusedField === 'phone'
                      ? 'bg-white border-[1.5px] border-[#2185F0] shadow-[0_8px_22px_-6px_rgba(33,133,240,0.28)]'
                      : 'bg-[#F3F5F9] border-[1.5px] border-transparent hover:bg-[#EBEEF5]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block text-[10px] font-semibold leading-tight mb-0.5 transition-colors ${
                        focusedField === 'phone' ? 'text-[#2185F0]' : 'text-[#8F9BB3]'
                      }`}
                    >
                      Nomor WhatsApp
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081298765432"
                      required
                      className="w-full bg-transparent text-[13.5px] font-bold text-[#1A1D26] focus:outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <Phone
                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                      focusedField === 'phone' ? 'text-[#2185F0]' : 'text-[#8F9BB3]'
                    }`}
                  />
                </label>
              )}

              {/* Password Field */}
              <label
                onClick={() => setFocusedField('password')}
                className={`rounded-[16px] px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-200 cursor-text ${
                  focusedField === 'password'
                    ? 'bg-white border-[1.5px] border-[#2185F0] shadow-[0_8px_22px_-6px_rgba(33,133,240,0.28)]'
                    : 'bg-[#F3F5F9] border-[1.5px] border-transparent hover:bg-[#EBEEF5]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-[10px] font-semibold leading-tight mb-0.5 transition-colors ${
                      focusedField === 'password' ? 'text-[#2185F0]' : 'text-[#8F9BB3]'
                    }`}
                  >
                    Kata sandi
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-transparent text-[13.5px] font-bold text-[#1A1D26] focus:outline-none placeholder:text-slate-300 tracking-wider"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                  className="text-[#8F9BB3] hover:text-[#2185F0] transition focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </label>

              {/* Bottom Pill Buttons Row (matching "Change method" & "Create account" pills) */}
              <div className="pt-3 flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={handleCycleSeederMethod}
                  className="flex-1 sm:flex-initial px-7 py-3.5 rounded-full bg-[#F3F5F9] hover:bg-[#E5EAF2] text-[#7F8BA3] hover:text-[#1A1D26] text-[12.5px] font-bold transition cursor-pointer"
                >
                  Ganti akun seeder
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial px-9 py-3.5 rounded-full bg-[#2185F0] hover:bg-[#1772D4] active:scale-[0.98] text-white text-[12.5px] font-bold shadow-[0_12px_25px_-6px_rgba(33,133,240,0.55)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : mode === 'register' ? (
                    <span>Buat akun</span>
                  ) : (
                    <>
                      <span>Masuk sekarang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Subtle Footer Info */}
          <div className="text-[11px] text-[#A0AEC0] font-medium flex items-center justify-between">
            <span>kucek.id • Platform Laundry & Pelanggan</span>
            <span className="hidden sm:inline">
              Target Redirect:{' '}
              <b className="text-slate-600">
                {mode === 'login' && email.toLowerCase() === 'admin@kucek.id'
                  ? '/admin (Superadmin)'
                  : '/app (Pelanggan)'}
              </b>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Aesthetic Sunlit Laundry Room with Organic S-Curve & Dashed Contour Path */}
        <div className="hidden lg:block lg:w-[45%] xl:w-[48%] min-h-screen relative overflow-hidden bg-[#1E293B]">
          {/* High-Resolution AI Generated Laundry Editorial Photo */}
          <img
            src="/images/auth-laundry.jpg"
            alt="Kucek.id Layanan Laundry Bersih dan Higienis"
            className="w-full h-full object-cover object-center scale-105 min-h-screen"
          />

          {/* Subtle Atmospheric Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A]/20 via-transparent to-white/10 pointer-events-none" />

          {/* Organic Wavy White Mask + Dashed Contour Line on Left Edge */}
          <svg
            viewBox="0 0 260 800"
            preserveAspectRatio="none"
            className="absolute top-0 bottom-0 -left-1 h-full w-[260px] pointer-events-none z-10"
          >
            {/* Solid White Wavy Cutout blending seamlessly with Left Panel */}
            <path
              d="M 0,0 L 215,0 C 235,65 105,155 128,265 C 150,375 235,430 198,535 C 160,640 75,710 65,800 L 0,800 Z"
              fill="#FFFFFF"
            />
            {/* Signature Dashed Parallel Contour Wave inside the white area */}
            <path
              d="M 145,0 C 165,70 40,160 65,270 C 90,380 175,435 138,540 C 100,645 25,715 15,800"
              fill="none"
              stroke="#D8E0EC"
              strokeWidth="1.6"
              strokeDasharray="6 6"
            />
          </svg>

          {/* Bottom-Right Editorial Stencil Monogram Logo (matching .AW in reference) */}
          <div className="absolute bottom-9 right-10 z-20 select-none pointer-events-none flex items-baseline text-white drop-shadow-md">
            <span className="text-xl font-black mr-0.5">.</span>
            <span className="text-[38px] font-black tracking-[-0.08em] leading-none font-serif">
              KW
            </span>
          </div>
        </div>
      </div>
  );
};
