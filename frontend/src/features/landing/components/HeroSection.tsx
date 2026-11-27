import React from 'react';
import { HERO_HIGHLIGHTS, type HeroHighlight } from '../data/landingData';

const HighlightIcon: React.FC<{ type: HeroHighlight['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'garment':
      return (
        <svg aria-hidden="true" className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l-5 4 2 3 3-2v11h8V9l3 2 2-3-5-4a4 4 0 01-8 0z" />
        </svg>
      );
    case 'dryclean':
      return (
        <svg aria-hidden="true" className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <circle cx="12" cy="13" r="4.5" />
          <path strokeLinecap="round" d="M7 6.5h2M12 6.5h.01" />
        </svg>
      );
    case 'delicate':
      return (
        <svg aria-hidden="true" className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l-5 4 2 3 3-2v11h8V9l3 2 2-3-5-4a4 4 0 01-8 0z" />
          <path strokeLinecap="round" d="M12 11v4M10 13h4" />
        </svg>
      );
    case 'clock24':
      return (
        <svg aria-hidden="true" className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="8.5" />
          <text x="12" y="15" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="currentColor" stroke="none">
            24
          </text>
        </svg>
      );
  }
};

export const HeroSection: React.FC = () => {
  const leftItems = HERO_HIGHLIGHTS.filter((item) => item.position === 'left');
  const rightItems = HERO_HIGHLIGHTS.filter((item) => item.position === 'right');

  return (
    <section id="beranda" className="bg-[#F4EDE5] pt-8 sm:pt-12 pb-0 overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Main Hero Title */}
        <h1 className="text-center text-3xl sm:text-5xl md:text-[52px] font-extrabold text-[#1A1918] tracking-tight leading-[1.14] max-w-2xl mx-auto">
          Merawat pakaian terbaikmu
          <br />
          di setiap langkah pencucian
        </h1>

        {/* 3-Column Hero Content Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-12 items-center gap-6 md:gap-4">
          {/* Left 2 Feature Callouts */}
          <div className="md:col-span-3 flex flex-row md:flex-col justify-around md:justify-center gap-6 md:gap-12 pb-2 md:pb-14">
            {leftItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center max-w-[175px] mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#E6DDD3] flex items-center justify-center mb-3">
                  <HighlightIcon type={item.iconType} />
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-[#2B2927] leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Center AI-Generated Studio Photograph */}
          <div className="md:col-span-6 flex justify-center items-end">
            <div className="w-72 sm:w-88 md:w-96 overflow-hidden rounded-t-[44px]">
              <img
                src="/images/hero-stack.jpg"
                alt="Staf kucek.id memegang tumpukan tujuh lipatan pakaian bersih warna-warni"
                width={640}
                height={800}
                fetchPriority="high"
                className="w-full h-auto object-cover block"
              />
            </div>
          </div>

          {/* Right 2 Feature Callouts */}
          <div className="md:col-span-3 flex flex-row md:flex-col justify-around md:justify-center gap-6 md:gap-12 pb-8 md:pb-14">
            {rightItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center max-w-[175px] mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#E6DDD3] flex items-center justify-center mb-3">
                  <HighlightIcon type={item.iconType} />
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-[#2B2927] leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
