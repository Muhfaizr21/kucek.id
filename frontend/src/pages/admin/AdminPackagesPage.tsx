import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Package, Plus } from 'lucide-react';

interface SubPackage {
  id: string;
  name: string;
  quotaKg: number;
  price: number;
  validityDays: number;
  totalSubscribers: number;
}

export const AdminPackagesPage: React.FC = () => {
  const [packages] = useState<SubPackage[]>([
    { id: '1', name: 'Paket Anak Kos Hemat', quotaKg: 30, price: 180000, validityDays: 30, totalSubscribers: 42 },
    { id: '2', name: 'Paket Keluarga Bahagia', quotaKg: 50, price: 300000, validityDays: 45, totalSubscribers: 28 },
    { id: '3', name: 'Paket Sultan Mega', quotaKg: 100, price: 550000, validityDays: 60, totalSubscribers: 15 },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Paket Langganan Kiloan</h1>
            <p className="text-xs text-slate-500">Buat paket kuota kiloan hemat yang bisa dibeli pelanggan secara mandiri</p>
          </div>
          <button
            onClick={() => alert('Fitur Tambah Paket Baru')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Paket Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700">
                  Masa Aktif {pkg.validityDays} Hari
                </span>
                <Package className="w-5 h-5 text-sky-500" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  Rp{pkg.price.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                  Dapat Kuota: {pkg.quotaKg} Kg (Rp{(pkg.price / pkg.quotaKg).toFixed(0)}/kg)
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Pelanggan Aktif:</span>
                <span className="font-bold text-slate-800">{pkg.totalSubscribers} Member</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
