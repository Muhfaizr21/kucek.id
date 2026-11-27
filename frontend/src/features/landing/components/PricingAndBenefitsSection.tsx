import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PRICING_PACKAGES, EXPERIENCE_BENEFITS } from '../data/landingData';

export const PricingAndBenefitsSection: React.FC = () => {
  return (
    <section id="pricing" className="bg-white pb-16 sm:pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-20">
        {/* Part 1: Tailored Laundry Packages Designed Specifically for Your Needs! */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-2xl mx-auto leading-tight">
            Tailored Laundry Packages Designed Specifically for Your Needs!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PACKAGES.map((pkg) => {
              const isOrange = pkg.isFeatured;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition duration-300 ${
                    isOrange
                      ? 'bg-[#C8430E] text-white shadow-xl shadow-[#C8430E]/20'
                      : 'bg-[#FAF7F2] text-[#1A1918] border border-[#E6DDD3]'
                  }`}
                >
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight">{pkg.name}</h3>
                      <p
                        className={`text-xs mt-0.5 ${
                          isOrange ? 'text-white/80' : 'text-[#78736E]'
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
                        <span className="text-xs font-semibold text-[#78736E]">
                          {pkg.period}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#C8430E] mt-1">{pkg.priceIdr}</p>
                    </div>

                    {/* Features Checklist */}
                    <ul className="space-y-2.5 text-xs">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isOrange
                                ? 'bg-white/20 text-white'
                                : 'bg-[#C8430E]/15 text-[#C8430E]'
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className={isOrange ? 'text-white/90' : 'text-[#4A4643]'}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/app/beli-paket"
                    className={`mt-8 w-full py-3 rounded-full text-center text-xs font-extrabold transition active:scale-95 block ${
                      isOrange
                        ? 'bg-[#FDBE1A] hover:bg-[#ECA909] text-[#1A1918]'
                        : 'bg-[#C8430E] hover:bg-[#B0390B] text-white'
                    }`}
                  >
                    Choose Plan
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Maximize your laundry experience here (2x2 Numbered Cards Grid) */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-xl mx-auto leading-tight">
            Maximize your laundry experience here
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {EXPERIENCE_BENEFITS.map((item) => (
              <div
                key={item.number}
                className="bg-[#F4EDE5] rounded-3xl p-6 sm:p-7 flex items-start gap-4 border border-[#E6DDD3]/60"
              >
                <span className="w-8 h-8 rounded-full bg-[#C8430E] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {item.number}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A1918] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6E6A66] leading-relaxed">
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
