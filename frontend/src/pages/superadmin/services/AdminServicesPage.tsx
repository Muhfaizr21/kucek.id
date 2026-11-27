import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';
import { Pagination } from '../../../components/ui/Pagination';
import {
  Tag,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Clock,
  Layers,
  Sparkles,
  Power,
  RefreshCw,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

export interface ServiceCatalogItem {
  id: number;
  code: string;
  name: string;
  category: 'KILOAN' | 'SATUAN' | 'SEPATU_HELM' | 'RUMAH_TANGGA' | string;
  price: number;
  unit: string;
  description: string;
  estimated_hours: number;
  is_active: boolean;
  sort_order: number;
}

const CATEGORY_OPTIONS: SelectOption[] = [
  {
    value: 'SATUAN',
    label: 'Satuan Pakaian & Bedcover',
    description: 'Bedcover, Selimut, Jas, Blazer, Kebaya, Boneka',
    badge: 'Satuan',
  },
  {
    value: 'KILOAN',
    label: 'Layanan Kiloan Harian',
    description: 'Cuci Setrika Reguler, Express 24J, Cuci Kering Lipat',
    badge: 'Kiloan',
  },
  {
    value: 'SEPATU_HELM',
    label: 'Treatment Sepatu, Helm & Tas',
    description: 'Deep clean sneakers, cuci helm bogo/full face, tas kulit',
    badge: 'Spesialis',
  },
  {
    value: 'RUMAH_TANGGA',
    label: 'Rumah Tangga & Interior (m2)',
    description: 'Gorden jendela, vitrase, karpet ruangan tebal',
    badge: 'Interior',
  },
];

const UNIT_OPTIONS: SelectOption[] = [
  { value: 'pcs', label: 'Per Potong / Pcs (/pcs)' },
  { value: 'kg', label: 'Per Kilogram (/kg)' },
  { value: 'pasang', label: 'Per Pasang (/pasang)' },
  { value: 'm2', label: 'Per Meter Persegi (/m2)' },
  { value: 'set', label: 'Per Set Lengkap (/set)' },
];

const formatRupiah = (n: number) =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

const getCategoryBadge = (cat: string) => {
  switch (cat) {
    case 'KILOAN':
      return { label: 'Kiloan', cls: 'bg-sky-50 text-[#0095FF]' };
    case 'SATUAN':
      return { label: 'Satuan & Bedcover', cls: 'bg-purple-50 text-purple-600' };
    case 'SEPATU_HELM':
      return { label: 'Sepatu & Helm', cls: 'bg-amber-50 text-amber-600' };
    case 'RUMAH_TANGGA':
      return { label: 'Karpet & Gorden', cls: 'bg-emerald-50 text-emerald-600' };
    default:
      return { label: cat, cls: 'bg-slate-100 text-slate-600' };
  }
};

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Modal Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceCatalogItem | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SATUAN');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [estHours, setEstHours] = useState('48');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch('http://localhost:8080/api/v1/admin/services', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setServices(json.data);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openAddModal = () => {
    setEditingItem(null);
    setCode('');
    setName('');
    setCategory('SATUAN');
    setPrice('25000');
    setUnit('pcs');
    setEstHours('48');
    setDescription('');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (item: ServiceCatalogItem) => {
    setEditingItem(item);
    setCode(item.code);
    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
    setUnit(item.unit);
    setEstHours(String(item.estimated_hours || 48));
    setDescription(item.description || '');
    setIsActive(item.is_active);
    setShowModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || Number(price) <= 0) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const url = editingItem
        ? `http://localhost:8080/api/v1/admin/services/${editingItem.id}`
        : 'http://localhost:8080/api/v1/admin/services';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          code: code.trim(),
          name: name.trim(),
          category,
          price: Number(price),
          unit,
          estimated_hours: Number(estHours) || 48,
          description: description.trim(),
          is_active: isActive,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        showToast(
          editingItem
            ? `Tarif "${name}" berhasil diperbarui dan langsung sinkron ke Kasir POS!`
            : `Layanan baru "${name}" berhasil ditambahkan ke katalog POS!`
        );
        fetchServices();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (item: ServiceCatalogItem) => {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:8080/api/v1/admin/services/${item.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          code: item.code,
          name: item.name,
          category: item.category,
          price: item.price,
          unit: item.unit,
          estimated_hours: item.estimated_hours,
          description: item.description,
          is_active: !item.is_active,
        }),
      }
    );
    if (res.ok) {
      showToast(
        !item.is_active
          ? `Layanan "${item.name}" diaktifkan kembali di Kasir POS.`
          : `Layanan "${item.name}" dinonaktifkan sementara dari Kasir POS.`
      );
      fetchServices();
    }
  };

  const handleDeleteService = async (item: ServiceCatalogItem) => {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:8080/api/v1/admin/services/${item.id}`,
      {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (res.ok) {
      showToast(`Item layanan "${item.name}" berhasil dihapus.`);
      fetchServices();
    }
  };

  const filteredServices = services.filter((item) => {
    const matchCat = filterCat === 'ALL' || item.category === filterCat;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeCount = services.filter((s) => s.is_active).length;
  const satuanCount = services.filter((s) => s.category !== 'KILOAN').length;

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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-[11px] font-extrabold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> KONFIGURASI DINAMIS KASIR POS
              & KATALOG
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Katalog Layanan & Pengaturan Tarif
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Atur bebas seluruh item satuan (Bedcover, Jas, Sepatu, Helm,
              Karpet) dan tarif kiloan. Setiap perubahan langsung tersinkron ke
              Kasir POS!
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchServices}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Segarkan</span>
            </button>
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs sm:text-sm shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Layanan Baru</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Total Item Layanan
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {services.length} Layanan
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                {activeCount} Aktif tampil di Kasir POS
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0095FF] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Item Satuan & Spesialis
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {satuanCount} Item Satuan
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bedcover, Jas, Sneakers, Helm, Gorden
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Tarif Dasar Kiloan
              </span>
              <p className="text-2xl font-black text-[#0095FF] mt-1">
                {formatRupiah(
                  services.find((s) => s.code === 'KILOAN-REG')?.price || 8000
                )}{' '}
                <span className="text-xs text-slate-400 font-bold">/ Kg</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dapat diubah kapan saja oleh Owner
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'ALL', label: 'Semua Layanan' },
              { key: 'SATUAN', label: 'Satuan & Bedcover' },
              { key: 'KILOAN', label: 'Kiloan Harian' },
              { key: 'SEPATU_HELM', label: 'Sepatu & Helm' },
              { key: 'RUMAH_TANGGA', label: 'Karpet & Gorden' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterCat(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  filterCat === tab.key
                    ? 'bg-[#0095FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama layanan atau kode..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0095FF]"
            />
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((item) => {
            const cat = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  item.is_active
                    ? 'border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] hover:border-[#0095FF]'
                    : 'border-slate-200/60 opacity-60 bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${cat.cls}`}
                    >
                      {cat.label}
                    </span>
                    <span className="font-mono text-[10.5px] font-bold text-slate-400">
                      {item.code}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                    {item.description ||
                      'Layanan pencucian standar higienis kucek.id'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black text-[#0095FF]">
                        {formatRupiah(item.price)}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {' '}
                        / {item.unit}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{item.estimated_hours} Jam
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                      item.is_active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{item.is_active ? 'Aktif di POS' : 'Nonaktif'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0095FF] hover:text-white text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah Harga</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(item)}
                      title="Hapus layanan"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white px-5 pb-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredServices.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[6, 9, 12]}
            itemLabel="layanan & tarif"
          />
        </div>

        {/* Modal Create / Edit Service */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingItem
                      ? `Edit Layanan & Tarif: ${editingItem.name}`
                      : 'Tambah Layanan & Tarif Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Harga baru langsung aktif di Kasir POS & Katalog Pelanggan
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Nama Item / Layanan
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Bedcover King / Sepatu Sneakers"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0095FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Kode SKU
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Otomatis"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <CustomSelect
                  label="Kategori Layanan"
                  value={category}
                  onChange={setCategory}
                  options={CATEGORY_OPTIONS}
                  size="md"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Harga Tarif (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#0095FF] focus:outline-none focus:border-[#0095FF]"
                    />
                  </div>

                  <CustomSelect
                    label="Satuan Hitung"
                    value={unit}
                    onChange={setUnit}
                    options={UNIT_OPTIONS}
                    size="md"
                  />

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Estimasi Selesai (Jam)
                    </label>
                    <input
                      type="number"
                      value={estHours}
                      onChange={(e) => setEstHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Deskripsi Standar Pengerjaan
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Deep clean anti-tungau suhu 60°C + kemas plastik vakum"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-[#0095FF]"
                    />
                    <span>Tampilkan langsung di Kasir POS</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Menyimpan...' : 'Simpan Tarif Layanan'}
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
