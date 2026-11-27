import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';
import {
  Plus,
  ShieldCheck,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  Phone,
  Mail,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface StaffRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'superadmin' | 'kasir' | 'operator' | 'kurir';
  sub_role: string;
  is_active: boolean;
}

const ROLE_OPTIONS: SelectOption[] = [
  {
    value: 'kasir',
    label: 'Kasir POS & Front Desk',
    description: 'Menerima cucian walk-in, timbang kiloan, cetak struk nota',
    badge: 'Kasir',
  },
  {
    value: 'operator',
    label: 'Operator Produksi (Cuci & Setrika Uap)',
    description: 'Mengelola mesin cuci, dryer 60°C, setrika uap & Kanban',
    badge: 'Workshop',
  },
  {
    value: 'kurir',
    label: 'Kurir Armada Antar-Jemput',
    description: 'Menjemput cucian kotor & mengantar cucian bersih pelanggan',
    badge: 'Logistik',
  },
  {
    value: 'superadmin',
    label: 'Superadmin / Co-Owner Outlet',
    description: 'Akses penuh ke keuangan, pengaturan tarif & manajemen staf',
    badge: 'Full Akses',
  },
];

const formatRoleBadge = (role: string) => {
  switch (role.toLowerCase()) {
    case 'superadmin':
      return { label: 'SUPERADMIN', cls: 'bg-slate-900 text-white' };
    case 'kasir':
      return { label: 'KASIR POS', cls: 'bg-sky-50 text-[#0095FF]' };
    case 'operator':
      return { label: 'OPERATOR PRODUKSI', cls: 'bg-purple-50 text-purple-700' };
    case 'kurir':
      return { label: 'KURIR ANTAR-JEMPUT', cls: 'bg-amber-50 text-amber-700' };
    default:
      return { label: role.toUpperCase(), cls: 'bg-slate-100 text-slate-700' };
  }
};

export const AdminStaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('kasir');
  const [subRole, setSubRole] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8080/api/v1/staff', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setStaffList(json.data);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('kasir');
    setSubRole('Shift Pagi Outlet Utama');
    setPassword('staf123');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (st: StaffRecord) => {
    setEditingStaff(st);
    setName(st.name);
    setEmail(st.email);
    setPhone(st.phone);
    setRole(st.role);
    setSubRole(st.sub_role || '');
    setPassword('');
    setIsActive(st.is_active);
    setShowModal(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const token = getAuthToken();
    const url = editingStaff
      ? `http://localhost:8080/api/v1/staff/${editingStaff.id}`
      : 'http://localhost:8080/api/v1/staff';
    const method = editingStaff ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: name.trim(),
        email:
          email.trim() ||
          `${name.toLowerCase().replace(/\s+/g, '.')}@kucek.id`,
        phone: phone.trim(),
        role,
        sub_role: subRole.trim(),
        password: password || 'staf123',
        is_active: isActive,
      }),
    });

    if (res.ok) {
      setShowModal(false);
      showToast(
        editingStaff
          ? `Akun staf "${name}" berhasil diperbarui!`
          : `Akun staf baru "${name}" berhasil dibuat!`
      );
      fetchStaff();
    }
  };

  const handleDeleteStaff = async (st: StaffRecord) => {
    if (st.email === 'admin@kucek.id') {
      showToast('Akun Superadmin utama tidak dapat dihapus.');
      return;
    }
    const token = getAuthToken();
    const res = await fetch(`http://localhost:8080/api/v1/staff/${st.id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      showToast(`Akun staf "${st.name}" berhasil dihapus.`);
      fetchStaff();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toastMsg && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> MANAJEMEN TIM & HAK AKSES
              OPERASIONAL
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Staf & Hak Akses
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola akun karyawan Kasir POS, Operator Produksi, dan Armada
              Kurir Antar-Jemput
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchStaff}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs sm:text-sm shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Akun Staf</span>
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase">
                  <th className="py-3.5 px-5">Nama & Spesialisasi Tugas</th>
                  <th className="py-3.5 px-5">Email & WhatsApp</th>
                  <th className="py-3.5 px-5">Role / Hak Akses</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {staffList.map((st) => {
                  const badge = formatRoleBadge(st.role);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80">
                      <td className="py-4 px-5">
                        <p className="font-extrabold text-slate-900 text-sm">
                          {st.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {st.sub_role || 'Staf Operasional Outlet'}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />{' '}
                          {st.email}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />{' '}
                          {st.phone}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full font-extrabold text-[10.5px] ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 font-bold ${
                            st.is_active ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              st.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          />
                          {st.is_active ? 'Aktif Bertugas' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(st)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0095FF] hover:text-white text-slate-700 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Role</span>
                          </button>
                          {st.email !== 'admin@kucek.id' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(st)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Create / Edit Staff */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingStaff
                    ? `Edit Akun Staf: ${editingStaff.name}`
                    : 'Tambah Akun Staf Operasional Baru'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Nama Lengkap Staf
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Riko Pratama"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Email Login
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama.staf@kucek.id"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      {editingStaff
                        ? 'Reset Kata Sandi (Opsional)'
                        : 'Kata Sandi Awal'}
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        editingStaff
                          ? 'Kosongkan jika tetap'
                          : 'Minimal 6 karakter'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <CustomSelect
                  label="Role & Hak Akses Sistem"
                  value={role}
                  onChange={setRole}
                  options={ROLE_OPTIONS}
                  size="md"
                />

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Penugasan Shift / Zona Armada
                  </label>
                  <input
                    type="text"
                    value={subRole}
                    onChange={(e) => setSubRole(e.target.value)}
                    placeholder="Contoh: Armada 02 - Zona Kota Yogyakarta / Meja Setrika Uap"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <span>Status Akun Aktif Bertugas</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Simpan Akun Staf
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
