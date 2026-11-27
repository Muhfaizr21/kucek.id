import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { Plus, ShieldCheck } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  phone: string;
  role: 'KASIR' | 'OPERATOR' | 'KURIR';
  status: 'ACTIVE' | 'INACTIVE';
}

export const AdminStaffPage: React.FC = () => {
  const [staffList] = useState<StaffUser[]>([
    { id: '1', name: 'Andi Saputra', phone: '081234560001', role: 'KASIR', status: 'ACTIVE' },
    { id: '2', name: 'Yayan Hendra', phone: '081234560002', role: 'OPERATOR', status: 'ACTIVE' },
    { id: '3', name: 'Dedi Kurniawan', phone: '081234560003', role: 'KURIR', status: 'ACTIVE' },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Staf & Hak Akses</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">Fase 2 Ready</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Siap diaktifkan kapan saja saat bisnis merekrut staf kasir, operator, dan kurir terpisah
            </p>
          </div>
          <button
            onClick={() => alert('Modal Tambah Karyawan Baru')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Staf</span>
          </button>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
          <div>
            <p className="font-bold text-sky-800">Konsep Arsitektur 2-Role Saat Ini:</p>
            <p className="text-sky-700 mt-0.5">
              Saat ini Anda mengoperasikan toko sebagai <b>Superadmin All-in-One</b>. Begitu staf didaftarkan di sini, mereka dapat login dengan hak akses terisolasi (misal: Kasir tidak bisa melihat laba-rugi Superadmin).
            </p>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Nama Staf</th>
                <th className="py-3 px-3">No. WhatsApp</th>
                <th className="py-3 px-3">Role Akses</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {staffList.map((staf) => (
                <tr key={staf.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">{staf.name}</td>
                  <td className="py-3 px-3">{staf.phone}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700">
                      {staf.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {staf.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="text-sky-600 hover:underline font-bold">Atur PIN</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
