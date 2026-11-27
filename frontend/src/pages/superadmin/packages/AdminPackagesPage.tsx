import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  Sparkles,
  Star,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface AdminPackageRecord {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  quota_kg: number;
  validity_days: number;
  features: string;
  is_popular: boolean;
  is_active: boolean;
  subscriber_count: number;
}

const formatRupiah = (n: number) =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

export const AdminPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<AdminPackageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<AdminPackageRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('185000');
  const [quotaKg, setQuotaKg] = useState('30');
  const [validityDays, setValidityDays] = useState('30');
  const [features, setFeatures] = useState(
    'Cuci + Setrika Uap, Gratis Antar-Jemput, 1 Mesin 1 Pelanggan'
  );
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8080/api/v1/admin/packages', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setPackages(json.data);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const openAddModal = () => {
    setEditingPkg(null);
    setCode('');
    setName('');
    setDescription('');
    setPrice('200000');
    setQuotaKg('35');
    setValidityDays('30');
    setFeatures(
      'Cuci + Setrika Uap, Gratis Antar-Jemput Tanpa Minimum, Bebas Pilih Parfum'
    );
    setIsPopular(false);
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (pkg: AdminPackageRecord) => {
    setEditingPkg(pkg);
    setCode(pkg.code);
    setName(pkg.name);
    setDescription(pkg.description || '');
    setPrice(String(pkg.price));
    setQuotaKg(String(pkg.quota_kg));
    setValidityDays(String(pkg.validity_days));
    setFeatures(pkg.features || '');
    setIsPopular(pkg.is_popular);
    setIsActive(pkg.is_active);
    setShowModal(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || Number(price) <= 0 || Number(quotaKg) <= 0) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const autoCode =
        code.trim() ||
        `PKG-${name.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}-${quotaKg}`;
      const url = editingPkg
        ? `http://localhost:8080/api/v1/admin/packages/${editingPkg.id}`
        : 'http://localhost:8080/api/v1/admin/packages';
      const method = editingPkg ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          code: autoCode,
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          quota_kg: Number(quotaKg),
          validity_days: Number(validityDays) || 30,
          features: features.trim(),
          is_popular: isPopular,
          is_active: isActive,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        showToast(
          editingPkg
            ? `Paket "${name}" berhasil diperbarui dan sinkron ke katalog pelanggan!`
            : `Paket baru "${name}" berhasil diterbitkan!`
        );
        fetchPackages();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePackage = async (pkg: AdminPackageRecord) => {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:8080/api/v1/admin/packages/${pkg.id}`,
      {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (res.ok) {
      showToast(`Paket "${pkg.name}" berhasil dihapus.`);
      fetchPackages();
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-[11px] font-extrabold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> MANAJEMEN MEMBERSHIP & KUOTA
              KILOAN
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Paket Langganan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Atur paket kuota kiloan, harga bundel, masa aktif, dan fitur
              keuntungan member. Sinkron langsung ke Portal Pelanggan
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchPackages}
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
              <span>Tambah Paket Baru</span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white p-6 rounded-2xl border flex flex-col justify-between transition ${
                pkg.is_popular
                  ? 'border-[#0095FF] ring-2 ring-[#0095FF]/15 shadow-md'
                  : 'border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0095FF] flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pkg.is_popular && (
                      <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />{' '}
                        Terpopuler
                      </span>
                    )}
                    <span className="text-xs font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                      {pkg.subscriber_count || 0} Member Aktif
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mt-4">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {pkg.description || pkg.features}
                </p>

                <p className="text-3xl font-black text-[#0095FF] mt-3">
                  {pkg.quota_kg}{' '}
                  <span className="text-base font-bold text-slate-400">
                    Kg Kuota
                  </span>
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Harga Paket:</span>
                    <span className="font-black text-slate-900">
                      {formatRupiah(pkg.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Masa Berlaku:</span>
                    <span className="font-bold text-slate-900">
                      {pkg.validity_days} Hari
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga Efektif / Kg:</span>
                    <span className="font-extrabold text-emerald-600">
                      {formatRupiah(pkg.price / Math.max(pkg.quota_kg, 1))} / Kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#0095FF] hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Harga & Kuota</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePackage(pkg)}
                  title="Hapus Paket"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Create / Edit Package */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingPkg
                    ? `Edit Paket: ${editingPkg.name}`
                    : 'Buat Paket Langganan Kuota Baru'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Nama Paket Langganan
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Paket Anak Kos Hemat"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Kode Paket
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="HEMAT-30"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Kuota (Kg)
                    </label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={quotaKg}
                      onChange={(e) => setQuotaKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#0095FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Harga Paket (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min={10000}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Masa Aktif (Hari)
                    </label>
                    <input
                      type="number"
                      required
                      min={7}
                      value={validityDays}
                      onChange={(e) => setValidityDays(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Deskripsi Singkat
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cocok untuk mahasiswa & pekerja kantoran..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Daftar Keuntungan (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                    />
                    <span>Tandai sebagai Paket Terpopuler</span>
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
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      {submitting ? 'Menyimpan...' : 'Simpan Paket'}
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
