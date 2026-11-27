import React from 'react';
import { HERO_HIGHLIGHTS, type HeroHighlight } from '../data/landingData';

const HighlightIcon: React.FC<{ type: HeroHighlight['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'garment':
      return (
        <svg className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l-5 4 2 3 3-2v11h8V9l3 2 2-3-5-4a4 4 0 01-8 0z" />
        </svg>
      );
    case 'dryclean':
      return (
        <svg className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <circle cx="12" cy="13" r="4.5" />
          <path strokeLinecap="round" d="M7 6.5h2M12 6.5h.01" />
        </svg>
      );
    case 'delicate':
      return (
        <svg className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l-5 4 2 3 3-2v11h8V9l3 2 2-3-5-4a4 4 0 01-8 0z" />
          <path strokeLinecap="round" d="M12 11v4M10 13h4" />
        </svg>
      );
    case 'clock24':
      return (
        <svg className="w-6 h-6 text-[#2A2826]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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
    <section id="home" className="bg-[#F4EDE5] pt-8 sm:pt-12 pb-0 overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Main Hero Title */}
        <h1 className="text-center text-4xl sm:text-5xl md:text-[54px] font-extrabold text-[#1A1918] tracking-tight leading-[1.12] max-w-2xl mx-auto">
          Delivering excellence
          <br />
          every step ahead
        </h1>

        {/* 3-Column Hero Content Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-12 items-center gap-8 md:gap-4">
          {/* Left 2 Feature Callouts */}
          <div className="md:col-span-3 flex flex-row md:flex-col justify-around md:justify-center gap-6 md:gap-12 pb-4 md:pb-16">
            {leftItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center max-w-[165px] mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#E6DDD3] flex items-center justify-center mb-3 shadow-xs">
                  <HighlightIcon type={item.iconType} />
                </div>
                <p className="text-xs sm:text-[13px] font-semibold text-[#2B2927] leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Center Folded Colorful Clothes Stack + Burnt Orange Arch */}
          <div className="md:col-span-6 flex flex-col items-center justify-end relative pt-4">
            {/* Soft warm halo circle behind torso */}
            <div className="w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-[#EAE0D5] absolute top-2 z-0" />

            {/* Burnt Orange Bottom Pedestal Arch */}
            <div className="w-64 sm:w-80 h-36 sm:h-40 bg-[#C8430E] rounded-t-[40px] absolute bottom-0 z-10" />

            {/* Person Torso & Hands Holding Colorful Folded Clothes Stack */}
            <div className="relative z-20 flex flex-col items-center w-64 sm:w-76 pb-6">
              {/* Beige T-shirt shoulders */}
              <div className="w-52 sm:w-60 h-20 bg-[#D7C4B0] rounded-t-[56px] relative flex justify-center">
                <div className="w-16 h-5 bg-[#C5AE96] rounded-b-full" />
              </div>

              {/* Colorful Stack of 7 Neatly Folded Laundry Towels/Garments */}
              <div className="w-52 sm:w-60 -mt-6 space-y-1 drop-shadow-xl">
                {/* 1. Pastel Pink Folded Towel */}
                <div className="h-7 sm:h-8 w-full rounded-full bg-gradient-to-r from-[#F48FB1] via-[#F8BBD0] to-[#EC407A] border-b-2 border-black/10 shadow-xs transform -rotate-1" />
                {/* 2. Sunny Yellow Folded Towel */}
                <div className="h-7 sm:h-8 w-[98%] mx-auto rounded-full bg-gradient-to-r from-[#FDD835] via-[#FFEE58] to-[#FBC02D] border-b-2 border-black/10 shadow-xs" />
                {/* 3. Fresh Mint Green Folded Towel */}
                <div className="h-7 sm:h-8 w-full rounded-full bg-gradient-to-r from-[#66BB6A] via-[#81C784] to-[#43A047] border-b-2 border-black/10 shadow-xs transform rotate-1" />
                {/* 4. Sky Cyan Folded Towel */}
                <div className="h-7 sm:h-8 w-[97%] mx-auto rounded-full bg-gradient-to-r from-[#26C6DA] via-[#4DD0E1] to-[#00ACC1] border-b-2 border-black/10 shadow-xs" />
                {/* 5. Warm Coral Orange Folded Towel */}
                <div className="h-7 sm:h-8 w-full rounded-full bg-gradient-to-r from-[#FF7043] via-[#FF8A65] to-[#F4511E] border-b-2 border-black/10 shadow-xs" />
                {/* 6. Royal Blue Folded Towel */}
                <div className="h-7 sm:h-8 w-[99%] mx-auto rounded-full bg-gradient-to-r from-[#1E88E5] via-[#42A5F5] to-[#1565C0] border-b-2 border-black/10 shadow-xs" />
                {/* 7. Crisp Clean White Folded Towel */}
                <div className="h-6 sm:h-7 w-[95%] mx-auto rounded-full bg-gradient-to-r from-[#F5F5F5] via-[#FFFFFF] to-[#E0E0E0] border-b-2 border-black/15 shadow-md" />
              </div>

              {/* Stylized Hands Holding the Bottom of the Stack */}
              <div className="w-56 sm:w-64 flex justify-between px-3 -mt-3">
                <div className="w-12 h-7 rounded-full bg-[#DDA78D] border border-[#C68B71] transform rotate-12 shadow-sm" />
                <div className="w-12 h-7 rounded-full bg-[#DDA78D] border border-[#C68B71] transform -rotate-12 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Right 2 Feature Callouts */}
          <div className="md:col-span-3 flex flex-row md:flex-col justify-around md:justify-center gap-6 md:gap-12 pb-8 md:pb-16">
            {rightItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center max-w-[165px] mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#E6DDD3] flex items-center justify-center mb-3 shadow-xs">
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
