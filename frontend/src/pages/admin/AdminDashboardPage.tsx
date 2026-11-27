import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { 
  TrendingUp, 
  ShoppingBag, 
  Layers, 
  Truck, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Superadmin</h1>
            <p className="text-sm text-slate-500 mt-0.5">Ringkasan operasional dan keuangan outlet hari ini</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/admin/pos"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buka Kasir POS</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Omzet Hari Ini</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">Rp1.840.000</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">▲ 14% dari hari kemarin</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Berat Cuci</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">148.5 <span className="text-sm font-normal text-slate-400">Kg</span></p>
            <p className="text-xs text-slate-400 font-medium mt-1">28 Nota Kiloan</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Sedang Dikerjakan</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">12 <span className="text-sm font-normal text-slate-400">Order</span></p>
            <p className="text-xs text-amber-600 font-semibold mt-1">3 Order Express prioritas</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Permintaan Jemput</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">4 <span className="text-sm font-normal text-slate-400">Request</span></p>
            <Link to="/admin/dispatch-jemput" className="text-xs text-purple-600 font-semibold hover:underline mt-1 block">
              Tugaskan Kurir &rarr;
            </Link>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Order Cucian Terkini</h2>
              <p className="text-xs text-slate-400">Daftar transaksi yang baru saja masuk di outlet</p>
            </div>
            <Link to="/admin/antrean-produksi" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
              Lihat Papan Kanban <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">No. Resi</th>
                  <th className="py-3 px-3">Pelanggan</th>
                  <th className="py-3 px-3">Layanan</th>
                  <th className="py-3 px-3">Parfum</th>
                  <th className="py-3 px-3">Status Cuci</th>
                  <th className="py-3 px-3">Bayar</th>
                  <th className="py-3 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-bold text-sky-600">KCK-202611-001</td>
                  <td className="py-3.5 px-3 font-semibold">Faisal Muh</td>
                  <td className="py-3.5 px-3">Cuci Komplit (4.25 kg)</td>
                  <td className="py-3.5 px-3">Sakura Blossom</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      Sedang Disetrika
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">Lunas</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">Rp34.000</td>
                </tr>

                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-bold text-sky-600">KCK-202611-002</td>
                  <td className="py-3.5 px-3 font-semibold">Sarah Amelia</td>
                  <td className="py-3.5 px-3">Bedcover King + 2 Bantal</td>
                  <td className="py-3.5 px-3">Lavender Breeze</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      Sedang Dicuci
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">DP Rp20rb</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">Rp45.000</td>
                </tr>

                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-bold text-sky-600">KCK-202611-003</td>
                  <td className="py-3.5 px-3 font-semibold">Dimas Arya</td>
                  <td className="py-3.5 px-3">
                    Cuci Kering Lipat (5.0 kg) <span className="text-[10px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-black">EXPRESS</span>
                  </td>
                  <td className="py-3.5 px-3">Ocean Fresh</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                      QC & Packing
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">Potong Kuota</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">Rp0 (Quota)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
