import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Sparkles, LayoutDashboard, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'ADMIN' | 'CUSTOMER'>('ADMIN');
  const [identifier, setIdentifier] = useState('admin@kucek.id');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-600/30 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke kucek.id</h1>
            <p className="text-xs text-slate-500 mt-1">Pilih portal akun yang ingin Anda akses</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mt-6">
            <button
              type="button"
              onClick={() => {
                setRole('ADMIN');
                setIdentifier('admin@kucek.id');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
                role === 'ADMIN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-sky-600" />
              <span>Superadmin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('CUSTOMER');
                setIdentifier('081234567890');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
                role === 'CUSTOMER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Pelanggan</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {role === 'ADMIN' ? 'Email / Username Superadmin' : 'Nomor WhatsApp Pelanggan'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                required
              />
            </div>

            {role === 'ADMIN' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pelanggan login instan tanpa password (verifikasi via kode OTP WhatsApp).</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <span>{role === 'ADMIN' ? 'Masuk ke Dashboard Superadmin' : 'Masuk ke Portal Pelanggan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Belum punya akun pelanggan? <Link to="/app" className="text-sky-600 font-bold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
