import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';
import { Pagination } from '../../../components/ui/Pagination';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  Package,
  Award,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  FileText,
  Scale,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';

interface CustomerRecord {
  id: number;
  name: string;
  phone: string;
  address: string;
  area: string;
  default_fragrance: string;
  total_orders: number;
  loyalty_points: number;
  total_saved_rp: number;
  package_id?: number | null;
  remaining_quota: number;
  package_expiry_at?: string | null;
  package?: {
    id: number;
    name: string;
    quota_kg: number;
  } | null;
}

interface PackageOptionItem {
  id: number;
  name: string;
  quota_kg: number;
  price: number;
}

const AREA_OPTIONS: SelectOption[] = [
  {
    value: 'Sleman (Zona Gratis Ongkir)',
    label: 'Sleman (Zona Gratis Ongkir)',
    description: 'Kaliurang, Pogung, Seturan, Gejayan, Condongcatur',
    badge: 'Gratis Ongkir',
  },
  {
    value: 'Kota Yogyakarta (Zona Gratis Ongkir)',
    label: 'Kota Yogyakarta (Zona Gratis Ongkir)',
    description: 'Demangan, Kotabaru, Malioboro, Timoho, Umbulharjo',
    badge: 'Gratis Ongkir',
  },
  {
    value: 'Bantul Utara (Gratis Min. 5 Kg)',
    label: 'Bantul Utara (Gratis Min. 5 Kg)',
    description: 'Kasihan, Sewon, Banguntapan',
    badge: 'Min. 5 Kg',
  },
];

const SCENT_OPTIONS: SelectOption[] = [
  { value: 'ocean_fresh', label: 'Ocean Fresh (Segar Angin Laut)' },
  { value: 'sakura_blossom', label: 'Sakura Blossom (Floral Jepang)' },
  { value: 'lavender_calm', label: 'Lavender Calm (Relaksasi Tidur)' },
  { value: 'vanilla_mist', label: 'Vanilla Mist (Manis & Hangat)' },
];

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [packages, setPackages] = useState<PackageOptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MEMBER' | 'REGULAR'>(
    'ALL'
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal Create / Edit Customer
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(
    null
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Sleman (Zona Gratis Ongkir)');
  const [fragrance, setFragrance] = useState('ocean_fresh');
  const [quotaKg, setQuotaKg] = useState('0');
  const [points, setPoints] = useState('0');
  const [selectedPkgId, setSelectedPkgId] = useState<string>('NONE');

  // Modal Top-up Quota
  const [topupCustomer, setTopupCustomer] = useState<CustomerRecord | null>(
    null
  );
  const [addQuota, setAddQuota] = useState('30');
  const [addPoints, setAddPoints] = useState('50');
  const [extendDays, setExtendDays] = useState('30');

  // Modal Detail Orders
  const [detailCustomer, setDetailCustomer] = useState<CustomerRecord | null>(
    null
  );
  const [customerOrders, setCustomerOrders] = useState<
    {
      id: number;
      order_number: string;
      service_type: string;
      weight_kg: number;
      total_amount: number;
      status: string;
      created_at: string;
    }[]
  >([]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const [custRes, pkgRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/customers', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch('http://localhost:8080/api/v1/packages'),
      ]);

      if (custRes.ok) {
        const json = await custRes.json();
        if (Array.isArray(json.data)) {
          setCustomers(json.data);
        }
      }
      if (pkgRes.ok) {
        const pkgJson = await pkgRes.json();
        if (Array.isArray(pkgJson.data)) {
          setPackages(pkgJson.data);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const openAddCustomer = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setAddress('');
    setArea('Sleman (Zona Gratis Ongkir)');
    setFragrance('ocean_fresh');
    setQuotaKg('0');
    setPoints('50');
    setSelectedPkgId('NONE');
    setShowFormModal(true);
  };

  const openEditCustomer = (cust: CustomerRecord) => {
    setEditingCustomer(cust);
    setName(cust.name);
    setPhone(cust.phone);
    setAddress(cust.address || '');
    setArea(cust.area || 'Sleman (Zona Gratis Ongkir)');
    setFragrance(cust.default_fragrance || 'ocean_fresh');
    setQuotaKg(String(cust.remaining_quota || 0));
    setPoints(String(cust.loyalty_points || 0));
    setSelectedPkgId(cust.package_id ? String(cust.package_id) : 'NONE');
    setShowFormModal(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const token = getAuthToken();
    const url = editingCustomer
      ? `http://localhost:8080/api/v1/customers/${editingCustomer.id}`
      : 'http://localhost:8080/api/v1/customers';
    const method = editingCustomer ? 'PUT' : 'POST';

    const pkgIdNum =
      selectedPkgId !== 'NONE' ? Number(selectedPkgId) : undefined;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        area,
        default_fragrance: fragrance,
        package_id: pkgIdNum || null,
        remaining_quota: Number(quotaKg) || 0,
        loyalty_points: Number(points) || 0,
      }),
    });

    if (res.ok) {
      setShowFormModal(false);
      showToast(
        editingCustomer
          ? `Profil pelanggan "${name}" berhasil diperbarui!`
          : `Pelanggan baru "${name}" berhasil didaftarkan!`
      );
      fetchCustomers();
    }
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupCustomer) return;

    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:8080/api/v1/customers/${topupCustomer.id}/topup-quota`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          add_quota_kg: Number(addQuota) || 0,
          add_points: Number(addPoints) || 0,
          extend_days: Number(extendDays) || 30,
        }),
      }
    );

    if (res.ok) {
      showToast(
        `Berhasil menambahkan +${addQuota} Kg kuota untuk ${topupCustomer.name}!`
      );
      setTopupCustomer(null);
      fetchCustomers();
    }
  };

  const handleViewOrders = async (cust: CustomerRecord) => {
    setDetailCustomer(cust);
    setCustomerOrders([]);
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:8080/api/v1/customers/${cust.id}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.data?.orders) {
        setCustomerOrders(json.data.orders);
      }
    }
  };

  const handleDeleteCustomer = async (cust: CustomerRecord) => {
    const token = getAuthToken();
    const res = await fetch(
      `http://localhost:8080/api/v1/customers/${cust.id}`,
      {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    if (res.ok) {
      showToast(`Data pelanggan "${cust.name}" berhasil dihapus.`);
      fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const isMember = c.remaining_quota > 0;
    if (filterType === 'MEMBER' && !isMember) return false;
    if (filterType === 'REGULAR' && isMember) return false;

    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q)
    );
  });

  const totalQuotaPool = customers.reduce(
    (acc, c) => acc + (c.remaining_quota || 0),
    0
  );
  const activeMembersCount = customers.filter(
    (c) => c.remaining_quota > 0
  ).length;

  const packageSelectOptions: SelectOption[] = [
    { value: 'NONE', label: 'Reguler (Tanpa Paket Langganan)' },
    ...packages.map((p) => ({
      value: String(p.id),
      label: `${p.name} (${p.quota_kg} Kg)`,
      badge: `Rp${Math.round(p.price / 1000)}rb`,
    })),
  ];

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
              <Sparkles className="w-3.5 h-3.5" /> DIREKTORI USER & MEMBER KUOTA
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Manajemen Data Pelanggan (User)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pantau sisa kuota kiloan member, poin loyalitas, alamat
              antar-jemput, dan lakukan top-up kuota manual
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchCustomers}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddCustomer}
              className="px-4 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-bold text-xs sm:text-sm shadow-[0_6px_16px_-4px_rgba(0,149,255,0.45)] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pelanggan Baru</span>
            </button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Total User Terdaftar
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {customers.length} Pelanggan
              </p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                {activeMembersCount} Member Paket Aktif
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#0095FF] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Total Saldo Kuota Member
              </span>
              <p className="text-2xl font-black text-[#0095FF] mt-1">
                {totalQuotaPool.toFixed(1)} Kg
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Siap dipakai potong kuota di POS / Jemput
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Total Poin Loyalitas
              </span>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {customers.reduce((acc, c) => acc + (c.loyalty_points || 0), 0)}{' '}
                Poin
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dapat ditukar voucher diskon cucian
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { key: 'ALL', label: `Semua User (${customers.length})` },
              {
                key: 'MEMBER',
                label: `Member Kuota (${activeMembersCount})`,
              },
              {
                key: 'REGULAR',
                label: `Reguler Walk-in (${
                  customers.length - activeMembersCount
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterType(tab.key as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  filterType === tab.key
                    ? 'bg-[#0095FF] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, nomor WA, atau alamat..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0095FF]"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase">
                  <th className="py-3.5 px-4">Pelanggan & Kontak</th>
                  <th className="py-3.5 px-4">Alamat & Zona Jemput</th>
                  <th className="py-3.5 px-4">Status Paket & Sisa Kuota</th>
                  <th className="py-3.5 px-4">Riwayat & Poin</th>
                  <th className="py-3.5 px-4 text-right">
                    Aksi Manajemen Owner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCustomers
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((cust) => {
                  const waPhone = cust.phone.startsWith('0')
                    ? '62' + cust.phone.slice(1)
                    : cust.phone;
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-sky-100 text-[#0095FF] font-black flex items-center justify-center shrink-0">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">
                              {cust.name}
                            </p>
                            <a
                              href={`https://wa.me/${waPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline mt-0.5"
                            >
                              <Phone className="w-3 h-3" /> {cust.phone} (Chat
                              WA)
                            </a>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {cust.address || 'Alamat belum diatur'}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#0095FF] shrink-0" />
                          <span>{cust.area || 'Sleman'}</span>
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        {cust.remaining_quota > 0 ? (
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0095FF] font-extrabold text-[10.5px]">
                              {cust.package?.name || 'Member Kuota Aktif'}
                            </span>
                            <p className="text-sm font-black text-slate-900 mt-1">
                              Sisa: {cust.remaining_quota.toFixed(1)} Kg
                            </p>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10.5px]">
                            Reguler Non-Paket (0 Kg)
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-800">
                          {cust.total_orders}x Transaksi Cuci
                        </p>
                        <p className="text-[11px] font-extrabold text-amber-600 mt-0.5">
                          ★ {cust.loyalty_points} Poin • Parfum:{' '}
                          <span className="capitalize text-slate-500">
                            {(cust.default_fragrance || 'ocean_fresh').replace(
                              '_',
                              ' '
                            )}
                          </span>
                        </p>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setTopupCustomer(cust);
                              setAddQuota('30');
                              setAddPoints('50');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-[#0095FF] text-[#0095FF] hover:text-white font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>+Kuota</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewOrders(cust)}
                            title="Lihat Riwayat Nota"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditCustomer(cust)}
                            title="Edit Profil Pelanggan"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomer(cust)}
                            title="Hapus Pelanggan"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 pb-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCustomers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[4, 5, 10]}
              itemLabel="pelanggan"
            />
          </div>
        </div>

        {/* Modal Create / Edit Customer */}
        {showFormModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingCustomer
                    ? `Edit Data Pelanggan: ${editingCustomer.name}`
                    : 'Tambah Pelanggan & Member Baru'}
                </h3>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomer} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Anindya Putri"
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
                      placeholder="081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <CustomSelect
                  label="Zona & Area Kurir Antar-Jemput"
                  value={area}
                  onChange={setArea}
                  options={AREA_OPTIONS}
                  size="md"
                />

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Alamat Lengkap Penjemputan
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah/kos, patokan kurir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSelect
                    label="Paket Langganan Member"
                    value={selectedPkgId}
                    onChange={setSelectedPkgId}
                    options={packageSelectOptions}
                    size="md"
                  />
                  <CustomSelect
                    label="Aroma Parfum Default"
                    value={fragrance}
                    onChange={setFragrance}
                    options={SCENT_OPTIONS}
                    size="md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Saldo Kuota Cucian (Kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={quotaKg}
                      onChange={(e) => setQuotaKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#0095FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Poin Loyalitas
                    </label>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-amber-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Simpan Data Pelanggan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Top-Up Kuota Manual */}
        {topupCustomer && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Top-Up Kuota Member: {topupCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sisa kuota saat ini:{' '}
                    <b className="text-[#0095FF]">
                      {topupCustomer.remaining_quota.toFixed(1)} Kg
                    </b>
                  </p>
                </div>
                <button
                  onClick={() => setTopupCustomer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTopUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    Tambahan Kuota Cucian (+Kg)
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {['30', '50', '100'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAddQuota(val)}
                        className={`py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                          addQuota === val
                            ? 'bg-[#EBF5FF] border-[#0095FF] text-[#0095FF]'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        +{val} Kg
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    value={addQuota}
                    onChange={(e) => setAddQuota(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-[#0095FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Bonus Poin Loyalitas
                    </label>
                    <input
                      type="number"
                      value={addPoints}
                      onChange={(e) => setAddPoints(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Perpanjang Aktif (Hari)
                    </label>
                    <input
                      type="number"
                      value={extendDays}
                      onChange={(e) => setExtendDays(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTopupCustomer(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Proses Top-Up Kuota
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Riwayat Nota Pelanggan */}
        {detailCustomer && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Riwayat Nota Cucian: {detailCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {detailCustomer.phone} • {detailCustomer.address}
                  </p>
                </div>
                <button
                  onClick={() => setDetailCustomer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {customerOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Belum ada riwayat transaksi nota untuk pelanggan ini.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-xs font-black text-[#0095FF]">
                          {ord.order_number}
                        </span>
                        <p className="text-xs font-bold text-slate-800 capitalize mt-0.5">
                          Layanan {ord.service_type} ({ord.weight_kg} Kg)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-900">
                          Rp{Math.round(ord.total_amount).toLocaleString('id-ID')}
                        </p>
                        <span className="text-[10px] font-extrabold uppercase text-emerald-600">
                          Status: {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
