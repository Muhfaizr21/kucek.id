import React, { useState } from 'react';
import { AdminLayout } from '../../../components/layout/AdminLayout';
import { 
  Printer, 
  Save, 
  Trash2
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  category: 'KILOAN' | 'SATUAN';
  qty: number;
  unit: string;
  price: number;
}

export const AdminPosPage: React.FC = () => {
  const [customerPhone, setCustomerPhone] = useState('081234567890');
  const [customerName, setCustomerName] = useState('Faisal Muh (Member 32.5 Kg)');
  const [perfume, setPerfume] = useState('Sakura Blossom');
  const [duration, setDuration] = useState<'REGULAR' | 'FAST' | 'EXPRESS'>('REGULAR');
  const [weightKg, setWeightKg] = useState<number>(3.5);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS' | 'PACKAGE'>('PACKAGE');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'Cuci Komplit Reguler', category: 'KILOAN', qty: 3.5, unit: 'kg', price: 8000 }
  ]);

  const addSatuanItem = (name: string, price: number) => {
    setCart((prev) => [...prev, { id: Date.now().toString(), name, category: 'SATUAN', qty: 1, unit: 'pcs', price }]);
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.qty * curr.price, 0);

  const handleWeightChange = (val: number) => {
    setWeightKg(val);
    setCart((prev) =>
      prev.map((item) => (item.category === 'KILOAN' ? { ...item, qty: val } : item))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kasir POS (Point of Sale)</h1>
            <p className="text-xs text-slate-500">Input pesanan kiloan, satuan, parfum, dan cetak nota thermal</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-900 transition"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Tes Print Thermal (58/80mm)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns: Inputs & Satuan Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Search & Info */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Data Pelanggan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pelanggan</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Kiloan Input Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Timbangan Kiloan</h3>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Tarif: Rp8.000/kg</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Berat Timbangan (Kg desimal):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.05"
                      value={weightKg}
                      onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
                      className="text-3xl font-black text-slate-900 w-36 px-3 py-1.5 border border-slate-300 rounded-xl"
                    />
                    <span className="text-base font-bold text-slate-500">Kg</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {[2.0, 3.0, 5.0, 7.5].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleWeightChange(preset)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                    >
                      {preset} kg
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Add Satuan Grid */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Tambah Item Satuan</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: 'Bedcover Sedang', price: 25000 },
                  { name: 'Bedcover King', price: 35000 },
                  { name: 'Jas / Blazer', price: 30000 },
                  { name: 'Sepatu Sneakers', price: 35000 },
                  { name: 'Selimut Tebal', price: 20000 },
                  { name: 'Gorden / m2', price: 15000 },
                  { name: 'Boneka Besar', price: 25000 },
                  { name: 'Helm Bogo', price: 25000 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => addSatuanItem(item.name, item.price)}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition active:scale-95 flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</span>
                    <span className="text-[11px] font-semibold text-sky-600 mt-2">Rp{item.price.toLocaleString('id-ID')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Aroma Parfum & Durasi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Aroma Parfum</label>
                  <select
                    value={perfume}
                    onChange={(e) => setPerfume(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  >
                    <option value="Sakura Blossom">🌸 Sakura Blossom (Favorit)</option>
                    <option value="Lavender Breeze">🪻 Lavender Breeze</option>
                    <option value="Ocean Fresh">🌊 Ocean Fresh</option>
                    <option value="Sweet Vanilla">🍦 Sweet Vanilla</option>
                    <option value="Non-Parfum">Baby Safe (Tanpa Parfum)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Pengerjaan</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                  >
                    <option value="REGULAR">Reguler (2-3 Hari)</option>
                    <option value="FAST">Kilat (1 Hari) +Rp3rb/kg</option>
                    <option value="EXPRESS">Express (5 Jam) 2x Lipat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Pakaian / Kondisi Awal</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Ada noda luntur di kemeja putih, jangan dilipat terlalu ketat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Cart, Billing & Submit */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ringkasan Nota Kasir</h3>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-slate-400">{item.qty} {item.unit} x Rp{item.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Rp{(item.qty * item.price).toLocaleString('id-ID')}
                      </span>
                      {item.category === 'SATUAN' && (
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Metode Bayar:</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PACKAGE')}
                    className={`p-2 rounded-xl font-bold border transition ${
                      paymentMethod === 'PACKAGE' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Potong Kuota
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-2 rounded-xl font-bold border transition ${
                      paymentMethod === 'CASH' ? 'bg-sky-50 border-sky-500 text-sky-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Tunai (Cash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-2 rounded-xl font-bold border transition ${
                      paymentMethod === 'QRIS' ? 'bg-purple-50 border-purple-500 text-purple-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    QRIS
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>Rp{subtotal.toLocaleString('id-ID')}</span>
                </div>
                {paymentMethod === 'PACKAGE' ? (
                  <div className="flex justify-between text-emerald-600 font-semibold text-xs">
                    <span>Dipotong Kuota Member:</span>
                    <span>-{weightKg} Kg</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-black text-slate-900 text-lg pt-2 border-t border-slate-200">
                  <span>Total Tagihan:</span>
                  <span>{paymentMethod === 'PACKAGE' ? 'Rp0 (Lunas Kuota)' : `Rp${subtotal.toLocaleString('id-ID')}`}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Thermal Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold uppercase text-slate-500">Pratinjau Nota Thermal</span>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Thermal Slip Simulation */}
            <div className="bg-slate-50 font-mono text-[11px] p-4 rounded-xl border border-dashed border-slate-300 space-y-2">
              <div className="text-center">
                <p className="font-bold text-sm">kucek.id Laundry</p>
                <p className="text-[10px] text-slate-500">Jl. Dipatiukur No. 45 Bandung</p>
                <p className="text-[10px] text-slate-500">WA: 0812-3456-7890</p>
                <p className="border-b border-dashed my-2"></p>
              </div>
              <p>No. Resi : KCK-202611-004</p>
              <p>Tgl     : 27/11/2026 13:20</p>
              <p>Cust    : {customerName}</p>
              <p>Parfum  : {perfume}</p>
              <p className="border-b border-dashed my-2"></p>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} ({item.qty} {item.unit})</span>
                  <span>{(item.qty * item.price).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <p className="border-b border-dashed my-2"></p>
              <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>{paymentMethod === 'PACKAGE' ? 'Rp0 (POTONG KUOTA)' : `Rp${subtotal.toLocaleString('id-ID')}`}</span>
              </div>
              <p className="border-b border-dashed my-2"></p>
              <p className="text-center text-[10px] text-slate-500">
                Pantau cucian: kucek.id/track/KCK-202611-004<br />
                Garansi komplain max 24 jam. Terima Kasih!
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Perintah cetak ESC/POS 58mm/80mm dikirim via Web Bluetooth!');
                  setShowReceiptModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
