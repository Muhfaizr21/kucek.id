import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COURIER_SLOTS, COVERAGE_AREAS, LAUNDRY_FAQS } from '../data/landingExtraData';

export const DeliveryAndFaqSection: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(COVERAGE_AREAS[0].id);
  const [openFaqId, setOpenFaqId] = useState<string | null>(LAUNDRY_FAQS[0].id);

  const selectedArea =
    COVERAGE_AREAS.find((area) => area.id === selectedAreaId) || COVERAGE_AREAS[0];

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white py-16 sm:py-24 border-t border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-24">
        {/* KONTEN 4: Info Area Antar-Jemput & Jadwal Rute Kurir */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
              Jadwal Rute Kurir & Area Antar-Jemput
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Armada kurir kucek.id beroperasi dalam 3 gelombang waktu setiap hari agar penjemputan dan pengantaran pakaian selalu tepat jadwal.
            </p>
          </div>

          {/* 3 Daily Courier Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COURIER_SLOTS.map((slot, idx) => {
              const badgeBg =
                idx === 0
                  ? 'bg-[#C8430E] text-white'
                  : idx === 1
                  ? 'bg-[#FDBE1A] text-[#1A1918]'
                  : 'bg-[#0D5CAD] text-white';

              return (
                <div
                  key={slot.id}
                  className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#E6DDD3] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${badgeBg}`}>
                        {slot.sessionName}
                      </span>
                      <span className="text-[11px] font-bold text-[#57534E]">
                        {slot.cutoffTime}
                      </span>
                    </div>
                    <p className="text-xl font-black text-[#1A1918] pt-1">{slot.timeRange}</p>
                    <p className="text-xs text-[#57534E] leading-relaxed">{slot.description}</p>
                  </div>

                  <Link
                    to="/app/pesan-jemput"
                    className="w-full min-h-[44px] inline-flex items-center justify-center rounded-full bg-white hover:bg-[#EFE9E2] text-[#1A1918] border border-[#D8CFC4] text-xs font-extrabold transition"
                  >
                    Pesan Slot {slot.sessionName}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Interactive Coverage Area Checker */}
          <div className="bg-[#F4EDE5] rounded-3xl p-6 sm:p-8 border border-[#E6DDD3] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1A1918]">
                Cek Ketentuan Gratis Ongkir di Area Kamu
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Pilih wilayah tempat tinggal atau kos Anda untuk melihat estimasi waktu tiba kurir dan syarat gratis ongkos jemput-antar:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1" role="group" aria-label="Pilih wilayah penjemputan">
                {COVERAGE_AREAS.map((area) => {
                  const isActive = area.id === selectedArea.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold text-left transition border ${
                        isActive
                          ? 'bg-[#C8430E] text-white border-[#C8430E]'
                          : 'bg-white text-[#1A1918] border-[#D8CFC4] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {area.district}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-[#E2D9CE] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2D8] pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-[#57534E]">
                    Wilayah Terpilih
                  </span>
                  <h4 className="text-lg font-black text-[#1A1918]">{selectedArea.district}</h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#0D5CAD]/10 text-[#0D5CAD] text-xs font-extrabold">
                  Estimasi Kurir: {selectedArea.etaMinutes}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-[#57534E]">
                  <b className="text-[#1A1918]">Cakupan Titik Jemput:</b> {selectedArea.landmarks}
                </p>
                <p className="text-[#1E6B38] font-bold">
                  Ketentuan Tarif: {selectedArea.freeDeliveryRule}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KONTEN 6: Tanya Jawab Operasional Nyata (Laundry-Specific FAQ) */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
              Pertanyaan yang Sering Ditanyakan di Kasir
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Informasi teknis seputar aturan timbangan minimum, pemotongan kuota paket, hingga prosedur garansi 24 jam.
            </p>
          </div>

          <div className="space-y-3">
            {LAUNDRY_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-[#E2D9CE] bg-[#FAF7F2] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full min-h-[56px] px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#F4EDE5] transition"
                  >
                    <span className="text-sm font-extrabold text-[#1A1918] leading-snug">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-full bg-[#E6DDD3] text-[#1A1918] font-extrabold text-sm flex items-center justify-center shrink-0"
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#3F3C39] leading-relaxed border-t border-[#EAE2D8]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
