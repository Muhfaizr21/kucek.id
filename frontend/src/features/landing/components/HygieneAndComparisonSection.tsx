import React from 'react';
import { HYGIENE_PROTOCOLS, COMPARISON_ROWS } from '../data/landingExtraData';

export const HygieneAndComparisonSection: React.FC = () => {
  return (
    <section className="bg-[#F4EDE5] py-16 sm:py-24 border-t border-[#E5DCD2]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-24">
        {/* KONTEN 3: Protokol Higienitas & Jaminan Keamanan Pakaian */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
              Protokol Higienitas & Jaminan Keamanan Pakaian
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Empat standar operasional wajib di workshop kucek.id untuk memastikan pakaian tidak tertukar, tidak dicampur, dan bebas kerusakan serat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HYGIENE_PROTOCOLS.map((protocol) => (
              <div
                key={protocol.id}
                className="bg-white rounded-3xl p-6 border border-[#E6DDD3] flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#C8430E]">
                      {protocol.number}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F4EDE5] text-[#1A1918]">
                      {protocol.highlight}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1A1918] leading-snug">
                    {protocol.title}
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {protocol.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KONTEN 5: Tabel Perbandingan: Cuci Sendiri vs Laundry Biasa vs kucek.id */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
              Mengapa Beralih ke Standar kucek.id?
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Perbandingan nyata cara pengerjaan cucian di rumah, laundry kiloan konvensional, dan sistem terstandar kucek.id.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6DDD3] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#E6DDD3] bg-[#FAF7F2] text-xs font-extrabold text-[#1A1918]">
                    <th className="py-4 px-5 w-1/4">Aspek Perawatan</th>
                    <th className="py-4 px-5 w-1/4 text-[#57534E]">Cuci Sendiri di Rumah</th>
                    <th className="py-4 px-5 w-1/4 text-[#57534E]">Laundry Kiloan Biasa</th>
                    <th className="py-4 px-5 w-1/4 bg-[#C8430E] text-white">
                      Standar kucek.id
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D8] text-xs">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.aspect} className="hover:bg-[#FAF7F2]/60 transition">
                      <td className="py-4 px-5 font-extrabold text-[#1A1918]">
                        {row.aspect}
                      </td>
                      <td className="py-4 px-5 text-[#57534E] leading-relaxed">
                        {row.homeWash}
                      </td>
                      <td className="py-4 px-5 text-[#57534E] leading-relaxed">
                        {row.regularLaundry}
                      </td>
                      <td className="py-4 px-5 font-bold text-[#1A1918] bg-[#C8430E]/5 leading-relaxed">
                        {row.kucekId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
