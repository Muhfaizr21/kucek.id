import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { CustomSelect, type SelectOption } from '../../../components/ui/Select';
import {
  Printer,
  Trash2,
  Tag,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { getAuthToken } from '../../../services/authService';
import type { ServiceCatalogItem } from '../services/AdminServicesPage';

const POS_PERFUME_OPTIONS: SelectOption[] = [
  {
    value: 'ocean_fresh',
    label: '🌊 Ocean Fresh',
    badge: 'Terfavorit',
    description: 'Aroma segar semilir laut tahan 14 hari',
  },
  {
    value: 'sakura_blossom',
    label: '🌸 Sakura Blossom',
    badge: 'Best Seller',
    description: 'Floral lembut khas musim semi Jepang',
  },
  {
    value: 'lavender_calm',
    label: '🪻 Lavender Calm',
    description: 'Aromaterapi lavender segar menenangkan',
  },
  {
    value: 'vanilla_mist',
    label: '🍦 Vanilla Mist',
    description: 'Wangi manis lembut hangat & elegan',
  },
  {
    value: 'no_perfume',
    label: '🍃 Baby Safe (Tanpa Parfum)',
    badge: 'Hypoallergenic',
    description: 'Bebas wewangian untuk bayi & kulit alergi',
  },
];

const POS_DURATION_OPTIONS: SelectOption[] = [
  {
    value: 'REGULAR',
    label: 'Reguler (2-3 Hari)',
    description: 'Standar pengerjaan workshop normal',
  },
  {
    value: 'FAST',
    label: 'Kilat (1 Hari / 24 Jam)',
    description: '+Rp 4.000 / Kg prioritas pengerjaan',
    badge: '+Rp4rb/Kg',
  },
  {
    value: 'EXPRESS',
    label: 'Super Express (6 Jam)',
    description: 'Prioritas tertinggi mesin cuci & setrika langsung (2x Tarif)',
    badge: '2x Tarif',
  },
];

interface CartItem {
  id: string;
  name: string;
  category: 'KILOAN' | 'SATUAN';
  qty: number;
  unit: string;
  price: number;
}

interface CustomerLookup {
  id: number;
  name: string;
  phone: string;
  address: string;
  area: string;
  default_fragrance: string;
  remaining_quota: number;
  package?: {
    name: string;
  };
}

const formatRupiah = (n: number) =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

export const AdminPosPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [customers, setCustomers] = useState<CustomerLookup[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('NEW');

  const [customerPhone, setCustomerPhone] = useState('081298765432');
  const [customerName, setCustomerName] = useState('Budi Santoso');
  const [customerAddress, setCustomerAddress] = useState(
    'Jl. Kaliurang KM 5 No. 12, Sleman'
  );
  const [customerQuota, setCustomerQuota] = useState<number>(15.5);

  const [perfume, setPerfume] = useState('ocean_fresh');
  const [duration, setDuration] = useState<'REGULAR' | 'FAST' | 'EXPRESS'>(
    'REGULAR'
  );
  const [weightKg, setWeightKg] = useState<number>(4.0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'CASH' | 'QRIS' | 'PACKAGE'
  >('QRIS');

  const [satuanCart, setSatuanCart] = useState<CartItem[]>([]);
  const [catFilter, setCatFilter] = useState<string>('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{
    order_number: string;
    total_amount: number;
    quota_used_kg: number;
    customer_name: string;
  } | null>(null);

  const fetchPosData = useCallback(async () => {
    try {
      const token = getAuthToken();
      const [srvRes, custRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/services?active_only=true'),
        fetch('http://localhost:8080/api/v1/customers', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      if (srvRes.ok) {
        const srvJson = await srvRes.json();
        if (Array.isArray(srvJson.data)) {
          setServices(srvJson.data);
        }
      }

      if (custRes.ok) {
        const custJson = await custRes.json();
        if (Array.isArray(custJson.data) && custJson.data.length > 0) {
          setCustomers(custJson.data);
          const first = custJson.data[0];
          setSelectedCustomerId(String(first.id));
          setCustomerName(first.name);
          setCustomerPhone(first.phone);
          setCustomerAddress(first.address || '');
          setCustomerQuota(first.remaining_quota || 0);
          if (first.default_fragrance) {
            setPerfume(first.default_fragrance);
          }
        }
      }
    } catch {
      // fallback handled
    }
  }, []);

  useEffect(() => {
    fetchPosData();
  }, [fetchPosData]);

  const handleSelectCustomer = (val: string) => {
    setSelectedCustomerId(val);
    if (val === 'NEW') {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerQuota(0);
      if (paymentMethod === 'PACKAGE') setPaymentMethod('QRIS');
      return;
    }
    const found = customers.find((c) => String(c.id) === val);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address || '');
      setCustomerQuota(found.remaining_quota || 0);
      if (found.default_fragrance) setPerfume(found.default_fragrance);
    }
  };

  // Base Kiloan Price from dynamic Service Catalog
  const baseKiloanPrice =
    services.find((s) => s.code === 'KILOAN-REG')?.price || 8000;

  const effectiveKiloanRate =
    duration === 'EXPRESS'
      ? baseKiloanPrice * 2
      : duration === 'FAST'
      ? baseKiloanPrice + 4000
      : baseKiloanPrice;

  const satuanCatalog = services.filter((s) => s.category !== 'KILOAN');
  const filteredSatuan = satuanCatalog.filter(
    (s) => catFilter === 'ALL' || s.category === catFilter
  );

  const addSatuanToCart = (srv: ServiceCatalogItem) => {
    setSatuanCart((prev) => {
      const existing = prev.find((i) => i.id === String(srv.id));
      if (existing) {
        return prev.map((i) =>
          i.id === String(srv.id) ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: String(srv.id),
          name: srv.name,
          category: 'SATUAN',
          qty: 1,
          unit: srv.unit,
          price: srv.price,
        },
      ];
    });
  };

  const updateSatuanQty = (id: string, delta: number) => {
    setSatuanCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeSatuanItem = (id: string) => {
    setSatuanCart((prev) => prev.filter((i) => i.id !== id));
  };

  const kiloanSubtotal = weightKg > 0 ? weightKg * effectiveKiloanRate : 0;
  const satuanSubtotal = satuanCart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const grossTotal = kiloanSubtotal + satuanSubtotal;

  // Quota deduction simulation
  const quotaApplicableKg =
    paymentMethod === 'PACKAGE' && weightKg > 0
      ? Math.min(customerQuota, weightKg)
      : 0;
  const quotaDiscountRp = quotaApplicableKg * effectiveKiloanRate;
  const finalPayable = Math.max(0, grossTotal - quotaDiscountRp);

  const customerOptions: SelectOption[] = [
    {
      value: 'NEW',
      label: '+ Input Pelanggan Baru (Walk-in)',
      description: 'Otomatis terdaftar ke database pelanggan kucek.id',
      badge: 'Baru',
    },
    ...customers.map((c) => ({
      value: String(c.id),
      label: `${c.name} (${c.phone})`,
      description: c.address || c.area,
      badge:
        c.remaining_quota > 0
          ? `Kuota ${c.remaining_quota.toFixed(1)} Kg`
          : 'Reguler',
    })),
  ];

  const handleCreatePosOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) return;
    if (weightKg <= 0 && satuanCart.length === 0) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const serviceType =
        duration === 'EXPRESS' || duration === 'FAST'
          ? 'express'
          : weightKg === 0 && satuanCart.length > 0
          ? 'satuan'
          : 'kiloan';

      const res = await fetch('http://localhost:8080/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          address: customerAddress.trim(),
          service_type: serviceType,
          weight_kg: weightKg,
          fragrance: perfume,
          price_per_kg: effectiveKiloanRate,
          payment_method:
            paymentMethod === 'PACKAGE'
              ? 'kuota'
              : paymentMethod.toLowerCase(),
          payment_status: 'paid',
          notes:
            notes.trim() ||
            `Transaksi Kasir POS (${duration}) • ${satuanCart
              .map((s) => `${s.qty}x ${s.name}`)
              .join(', ')}`,
          items: satuanCart.map((s) => ({
            item_name: s.name,
            quantity: s.qty,
            unit_price: s.price,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const ord = json.data;
        setCreatedOrder({
          order_number: ord.order_number,
          total_amount: ord.total_amount,
          quota_used_kg: ord.quota_used_kg || 0,
          customer_name: customerName,
        });
        setSatuanCart([]);
        fetchPosData();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-[11px] font-extrabold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> TERHUBUNG KE DATABASE LAYANAN
              & ANTREAN KANBAN
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Kasir Point of Sale (POS)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Penerimaan cucian walk-in, kalkulasi timbangan digital + item
              satuan dinamis, dan potong kuota member otomatis
            </p>
          </div>
          <Link
            to="/admin/layanan"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition"
          >
            <Tag className="w-3.5 h-3.5 text-sky-400" />
            <span>Setting Harga & Item Satuan</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Input Panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Data Pelanggan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#0095FF]" /> 1. Pilih
                  Member atau Input Pelanggan Walk-in
                </h3>
                <Link
                  to="/admin/pelanggan"
                  className="text-xs font-bold text-[#0095FF] hover:underline"
                >
                  Kelola Data User &rarr;
                </Link>
              </div>

              <CustomSelect
                label="Cari dari Direktori Pelanggan / Member"
                value={selectedCustomerId}
                onChange={handleSelectCustomer}
                options={customerOptions}
                size="md"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pelanggan
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama pelanggan..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Saldo Kuota Member
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-sky-50 border border-sky-200/80 text-xs font-black text-[#0095FF] flex items-center justify-between">
                    <span>{customerQuota.toFixed(1)} Kg</span>
                    <span className="text-[10px] font-bold">
                      {customerQuota > 0 ? 'Member Aktif' : 'Non-Paket'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Timbangan Kiloan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  2. Input Timbangan Cucian Kiloan (Setrika Uap)
                </h3>
                <span className="text-xs font-extrabold text-[#0095FF]">
                  Tarif Aktif: {formatRupiah(effectiveKiloanRate)} / Kg
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex-1 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      DIGITAL SCALE INPUT (KG)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={weightKg}
                        onChange={(e) =>
                          setWeightKg(
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-28 bg-transparent text-3xl font-black text-sky-400 focus:outline-none border-b border-slate-700"
                      />
                      <span className="text-base font-bold text-slate-400">
                        Kg
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">
                      Subtotal Kiloan
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      {formatRupiah(kiloanSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-2 gap-2">
                  {[0, 3.0, 4.5, 6.0].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWeightKg(preset)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                        weightKg === preset
                          ? 'bg-[#0095FF] border-[#0095FF] text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {preset === 0 ? '0 Kg (Satuan)' : `${preset} Kg`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Tambah Item Satuan (100% Dinamis dari Database /admin/layanan) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    3. Tambah Item Satuan & Treatment Khusus
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Daftar item ini diambil langsung dari database{' '}
                    <b>Layanan & Tarif</b>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { key: 'ALL', label: 'Semua' },
                    { key: 'SATUAN', label: 'Bedcover & Jas' },
                    { key: 'SEPATU_HELM', label: 'Sepatu & Helm' },
                    { key: 'RUMAH_TANGGA', label: 'Gorden & Karpet' },
                  ].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setCatFilter(c.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                        catFilter === c.key
                          ? 'bg-[#0095FF] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {filteredSatuan.map((srv) => {
                  const inCart = satuanCart.find(
                    (i) => i.id === String(srv.id)
                  );
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => addSatuanToCart(srv)}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative ${
                        inCart
                          ? 'border-[#0095FF] bg-[#F0F7FF] ring-1 ring-[#0095FF]'
                          : 'border-slate-200 hover:border-[#0095FF] hover:bg-sky-50/30'
                      }`}
                    >
                      {inCart && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0095FF] text-white text-[10px] font-black flex items-center justify-center">
                          {inCart.qty}
                        </span>
                      )}
                      <p className="text-xs font-extrabold text-slate-800 pr-5 line-clamp-1">
                        {srv.name}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs font-black text-[#0095FF]">
                          {formatRupiah(srv.price)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          /{srv.unit}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Aroma Parfum & Durasi */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                4. Aroma Parfum & Kecepatan Pengerjaan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="Aroma Parfum Pilihan"
                  value={perfume}
                  onChange={setPerfume}
                  options={POS_PERFUME_OPTIONS}
                  size="md"
                />

                <CustomSelect
                  label="Durasi Pengerjaan"
                  value={duration}
                  onChange={(val) => setDuration(val as any)}
                  options={POS_DURATION_OPTIONS}
                  size="md"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Catatan Khusus Operator Produksi
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kemeja putih dipisah, jangan dilipat terlalu keras"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Right 1 Column: Live Receipt & Checkout */}
          <div className="space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] sticky top-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-dashed border-slate-200 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0095FF] bg-sky-50 px-2.5 py-1 rounded-md">
                      NOTA TRANSAKSI POS
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-2">
                      Rincian Tagihan
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10.5px] font-bold text-slate-400 block">
                      Pelanggan
                    </span>
                    <span className="text-xs font-extrabold text-slate-800">
                      {customerName || 'Walk-in'}
                    </span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {weightKg > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">
                          Cuci Setrika Kiloan ({duration})
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {weightKg} Kg × {formatRupiah(effectiveKiloanRate)}
                        </p>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        {formatRupiah(kiloanSubtotal)}
                      </span>
                    </div>
                  )}

                  {satuanCart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.qty} {item.unit} × {formatRupiah(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateSatuanQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateSatuanQty(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSatuanItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {weightKg <= 0 && satuanCart.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">
                      Masukkan berat kiloan atau klik item satuan di kiri.
                    </p>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-2">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { key: 'QRIS', label: 'QRIS Instan' },
                        { key: 'CASH', label: 'Tunai Kasir' },
                        { key: 'PACKAGE', label: 'Potong Kuota' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setPaymentMethod(m.key)}
                        className={`py-2.5 px-2 rounded-xl text-[11px] font-extrabold border transition cursor-pointer ${
                          paymentMethod === m.key
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal Kotor</span>
                    <span className="font-bold text-slate-800">
                      {formatRupiah(grossTotal)}
                    </span>
                  </div>
                  {quotaApplicableKg > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Potong Kuota ({quotaApplicableKg} Kg)</span>
                      <span>- {formatRupiah(quotaDiscountRp)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Bayar</span>
                    <span className="text-xl text-[#0095FF]">
                      {formatRupiah(finalPayable)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  disabled={
                    submitting || (weightKg <= 0 && satuanCart.length === 0)
                  }
                  onClick={handleCreatePosOrder}
                  className="w-full py-3.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white font-black text-xs sm:text-sm shadow-[0_8px_20px_-4px_rgba(0,149,255,0.5)] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  <span>
                    {submitting
                      ? 'Menyimpan Transaksi...'
                      : 'Simpan & Cetak Struk Nota'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Confirmation Modal */}
        {createdOrder && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-[#0095FF] text-[10.5px] font-extrabold">
                  TRANSAKSI TERSIMPAN DI DATABASE
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Resi: {createdOrder.order_number}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atas nama <b>{createdOrder.customer_name}</b> telah masuk ke
                  Antrean Produksi Kanban.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Resi Live:</span>
                  <span className="font-mono font-black text-slate-900">
                    {createdOrder.order_number}
                  </span>
                </div>
                {createdOrder.quota_used_kg > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Kuota Member Terpakai:</span>
                    <span>{createdOrder.quota_used_kg} Kg</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Dibayar:</span>
                  <span>{formatRupiah(createdOrder.total_amount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreatedOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Transaksi Baru
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/antrean-produksi')}
                  className="flex-1 py-2.5 rounded-xl bg-[#0095FF] hover:bg-[#007ACC] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Lihat di Kanban</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
