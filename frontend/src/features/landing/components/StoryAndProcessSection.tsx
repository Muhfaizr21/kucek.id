import React from 'react';
import { TIMELINE_MILESTONES, PROCESS_STEPS, type ProcessStepItem } from '../data/landingData';

const badgeColorMap: Record<ProcessStepItem['badgeColor'], string> = {
  orange: 'bg-[#C8430E] text-white',
  yellow: 'bg-[#FDBE1A] text-[#1A1918]',
  taupe: 'bg-[#9E968E] text-white',
  blue: 'bg-[#0D5CAD] text-white',
};

export const StoryAndProcessSection: React.FC = () => {
  return (
    <>
      {/* Section 1: From humble beginnings to excellence (Warm Beige Background) */}
      <section className="bg-[#F4EDE5] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-12">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
            From humble beginnings to excellence
          </h2>

          {/* 4-Column Milestone Grid (2x2 on mobile, 4 columns on desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {TIMELINE_MILESTONES.map((item) => (
              <div key={item.id} className="space-y-3.5">
                <div className="overflow-hidden rounded-2xl bg-[#E5DCD2] aspect-[4/3] shadow-xs">
                  <img
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A1918]">
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
      </section>

      {/* Section 2: Our easy process + Make laundry day hassle-free (White Background) */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-20">
          {/* 4 Circular Process Steps */}
          <div className="space-y-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight text-center md:text-left">
              Our easy process for fresh laundry every time
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="aspect-square rounded-full bg-[#EFE9E2] p-5 sm:p-7 flex flex-col items-center justify-center text-center shadow-2xs hover:bg-[#E7DFD5] transition"
                >
                  <span
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${badgeColorMap[step.badgeColor]} font-extrabold text-xs sm:text-sm flex items-center justify-center mb-3 shadow-xs`}
                  >
                    {step.stepNumber}
                  </span>
                  <p className="text-xs sm:text-[13px] font-semibold text-[#2B2927] leading-snug max-w-[145px]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Make laundry day hassle-free with NeatWash */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight leading-[1.15]">
                Make laundry day hassle-free with NeatWash
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6A66] leading-relaxed max-w-md">
                We&apos;re loving every laundry commitment to handling our clothes and delivering effortless care to fresh laundry, super clean, and happy customers every day.
              </p>
            </div>

            <div className="md:col-span-6">
              <div className="overflow-hidden rounded-3xl bg-[#DFD3C8] aspect-[16/10] relative flex items-end justify-center shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=900&q=80"
                  alt="Happy woman holding fresh folded laundry stack"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
