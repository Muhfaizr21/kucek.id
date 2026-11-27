import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Plus } from 'lucide-react';

export const AdminFinancePage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Laporan Keuangan & Arus Kas</h1>
            <p className="text-xs text-slate-500">Pemasukan kasir, pencatatan biaya deterjen/listrik, dan laba bersih</p>
          </div>
          <button
            onClick={() => alert('Modal Catat Biaya Operasional Toko')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pengeluaran Toko</span>
          </button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pemasukan Bulan Ini</span>
            <p className="text-2xl font-black text-emerald-600 mt-2">Rp48.250.000</p>
            <p className="text-xs text-slate-400 mt-1">Uang Tunai + QRIS + Paket Langganan</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran Toko</span>
            <p className="text-2xl font-black text-red-600 mt-2">Rp18.420.000</p>
            <p className="text-xs text-slate-400 mt-1">Deterjen, Gas, Listrik, Plastik, Gaji</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laba Bersih Estimasi</span>
            <p className="text-2xl font-black text-slate-900 mt-2">Rp29.830.000</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">Margin Keuntungan: ~61.8%</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
