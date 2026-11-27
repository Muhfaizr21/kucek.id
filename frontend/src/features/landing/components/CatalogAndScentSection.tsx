import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SATUAN_CATEGORIES,
  SATUAN_ITEMS,
  SCENT_PROFILES,
  type SatuanCategoryKey,
} from '../data/landingExtraData';

export const CatalogAndScentSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SatuanCategoryKey>('BEDDING');
  const [selectedScentId, setSelectedScentId] = useState<string>(SCENT_PROFILES[0].id);

  const filteredItems = SATUAN_ITEMS.filter((item) => item.category === activeCategory);
  const activeScent =
    SCENT_PROFILES.find((scent) => scent.id === selectedScentId) || SCENT_PROFILES[0];

  return (
    <section id="katalog-satuan" className="bg-white py-16 sm:py-24 border-t border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-24">
        {/* KONTEN 1: Katalog Tarif Satuan & Perawatan Khusus */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
              Katalog Tarif Satuan & Perawatan Khusus
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Transparansi harga untuk perawatan item berukuran besar, pakaian formal, hingga pencucian sepatu dan tas.
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div
            role="tablist"
            aria-label="Kategori Layanan Satuan"
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {SATUAN_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition ${
                    isSelected
                      ? 'bg-[#C8430E] text-white shadow-sm'
                      : 'bg-[#F4EDE5] text-[#3F3C39] hover:bg-[#E6DDD3]'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>

          {/* 2x2 Grid of Satuan Items for Selected Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF7F2] border border-[#E6DDD3] rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-extrabold text-[#1A1918] leading-snug">
                      {item.name}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#EFE9E2] text-[#3F3C39] text-[11px] font-bold shrink-0">
                      Estimasi {item.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">{item.treatment}</p>
                </div>

                <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-[#C8430E]">
                      Rp{item.priceIdr.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs font-semibold text-[#57534E]"> / {item.unit}</span>
                  </div>
                  <Link
                    to="/app/pesan-jemput"
                    className="px-4 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#1A1918] hover:bg-[#33312E] text-white text-xs font-bold transition"
                  >
                    Pesan Jemput Item
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KONTEN 2: Galeri Karakter Aroma Parfum (Interactive Scent Bar) */}
        <div className="bg-[#F4EDE5] rounded-[36px] p-6 sm:p-10 border border-[#E6DDD3] space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1918] tracking-tight">
              Pilih Karakter Aroma Parfum Pakaianmu
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Setiap cucian sudah termasuk parfum grade laundry premium yang disemprotkan setelah proses setrika uap dingin agar wangi terkunci di serat kain. Klik aroma untuk melihat karakternya:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: 5 Scent Selector Buttons */}
            <div
              role="tablist"
              aria-label="Daftar Aroma Parfum"
              className="lg:col-span-5 flex flex-col gap-2.5"
            >
              {SCENT_PROFILES.map((scent) => {
                const isSelected = scent.id === activeScent.id;
                return (
                  <button
                    key={scent.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedScentId(scent.id)}
                    className={`w-full min-h-[52px] px-5 py-3.5 rounded-2xl text-left flex items-center justify-between transition border ${
                      isSelected
                        ? 'bg-[#1A1918] text-white border-[#1A1918] shadow-sm'
                        : 'bg-white text-[#1A1918] border-[#E2D9CE] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{scent.name}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#FDBE1A] text-[#1A1918]'
                          : 'bg-[#F4EDE5] text-[#57534E]'
                      }`}
                    >
                      {scent.badgeText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Scent Profile Detail Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D9CE] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D8] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8430E]">
                      Profil Aroma Terpilih
                    </span>
                    <h3 className="text-2xl font-black text-[#1A1918] mt-0.5">
                      {activeScent.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#F4EDE5] text-[#1A1918] text-xs font-extrabold">
                    Gratis di Semua Paket
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#2B2927] leading-relaxed">
                  {activeScent.tagline}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-1">
                    <span className="text-[11px] font-extrabold uppercase text-[#57534E]">
                      Komposisi Aroma (Notes)
                    </span>
                    <p className="text-xs font-bold text-[#1A1918] leading-snug">
                      {activeScent.notes}
                    </p>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-1">
                    <span className="text-[11px] font-extrabold uppercase text-[#57534E]">
                      Ketahanan Wangi
                    </span>
                    <p className="text-xs font-bold text-[#1A1918] leading-snug">
                      {activeScent.durability}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#EFE9E2] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-[#57534E]">
                    Paling Cocok Untuk:
                  </span>
                  <p className="text-xs font-extrabold text-[#1A1918] mt-0.5">
                    {activeScent.bestFor}
                  </p>
                </div>
                <Link
                  to="/app/pesan-jemput"
                  className="px-5 min-h-[44px] inline-flex items-center justify-center rounded-full bg-[#C8430E] hover:bg-[#AD380A] text-white text-xs font-extrabold shrink-0 transition"
                >
                  Pilih Aroma Ini
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
