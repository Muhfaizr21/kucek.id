import React from 'react';
import { Link } from 'react-router-dom';
import { PRICING_PACKAGES, EXPERIENCE_BENEFITS } from '../data/landingData';

export const PricingAndBenefitsSection: React.FC = () => {
  return (
    <section id="paket" className="bg-white pb-16 sm:pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-20">
        {/* Part 1: Pilihan Paket Laundry Sesuai Kebutuhan Harianmu */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-2xl mx-auto leading-tight">
            Pilihan Paket Laundry Sesuai Kebutuhan Harianmu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PACKAGES.map((pkg) => {
              const isOrange = pkg.isFeatured;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${
                    isOrange
                      ? 'bg-[#C8430E] text-white shadow-lg shadow-[#C8430E]/15'
                      : 'bg-[#FAF7F2] text-[#1A1918] border border-[#E6DDD3]'
                  }`}
                >
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight">{pkg.name}</h3>
                      <p
                        className={`text-xs mt-0.5 ${
                          isOrange ? 'text-white/90' : 'text-[#57534E]'
                        }`}
                      >
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Price Box */}
                    <div
                      className={`rounded-2xl p-4 ${
                        isOrange ? 'bg-white text-[#1A1918]' : 'bg-white border border-[#EAE2D8]'
                      }`}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black tracking-tight text-[#1A1918]">
                          {pkg.priceDisplay}
                        </span>
                        <span className="text-xs font-semibold text-[#57534E]">
                          {pkg.period}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#C8430E] mt-1">{pkg.priceDetail}</p>
                    </div>

                    {/* Features Checklist */}
                    <ul className="space-y-2.5 text-xs">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isOrange
                                ? 'bg-white/25 text-white'
                                : 'bg-[#C8430E]/15 text-[#C8430E]'
                            }`}
                          >
                            <svg
                              aria-hidden="true"
                              className="w-2.5 h-2.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className={isOrange ? 'text-white' : 'text-[#3F3C39]'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/app/beli-paket"
                    className={`mt-8 w-full min-h-[44px] inline-flex items-center justify-center rounded-full text-center text-xs font-extrabold transition active:scale-95 ${
                      isOrange
                        ? 'bg-[#FDBE1A] hover:bg-[#E5A80E] text-[#1A1918]'
                        : 'bg-[#C8430E] hover:bg-[#AD380A] text-white'
                    }`}
                  >
                    Pilih Paket Ini
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Pengalaman laundry lebih tenang di sini (2x2 Numbered Cards Grid) */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-xl mx-auto leading-tight">
            Pengalaman laundry lebih tenang di sini
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {EXPERIENCE_BENEFITS.map((item) => (
              <div
                key={item.number}
                className="bg-[#F4EDE5] rounded-3xl p-6 sm:p-7 flex items-start gap-4 border border-[#E6DDD3]"
              >
                <span className="w-8 h-8 rounded-full bg-[#C8430E] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {item.number}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A1918] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
