import React from 'react';
import { ABOUT_PHOTOS, SERVICE_CARDS, type ServiceCardItem } from '../data/landingData';

const ServiceOutlineIcon: React.FC<{ type: ServiceCardItem['iconType']; isDarkText: boolean }> = ({
  type,
  isDarkText,
}) => {
  const strokeColor = isDarkText ? '#1A1918' : '#FFFFFF';
  switch (type) {
    case 'washer':
      return (
        <svg aria-hidden="true" className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.6">
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <circle cx="12" cy="14.5" r="3.8" />
          <circle cx="7.5" cy="5.5" r="0.8" fill={strokeColor} />
          <circle cx="10.5" cy="5.5" r="0.8" fill={strokeColor} />
        </svg>
      );
    case 'iron':
      return (
        <svg aria-hidden="true" className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16l-2-7H9c-3 0-5 3-5 7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10V7c0-1.1.9-2 2-2h5" />
          <line x1="3" y1="20" x2="21" y2="20" strokeLinecap="round" />
        </svg>
      );
    case 'stain':
      return (
        <svg aria-hidden="true" className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l-5 4 2 3 3-2v11h8V9l3 2 2-3-5-4a4 4 0 01-8 0z" />
          <path strokeLinecap="round" d="M12 11v4M10 13h4" />
        </svg>
      );
  }
};

export const AboutAndServicesSection: React.FC = () => {
  return (
    <section id="tentang" className="bg-white py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-20">
        {/* Part 1: About Us Beyond Your Expectations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Text & 800+ Stat */}
          <div className="md:col-span-5 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight leading-[1.15]">
              Lebih dari sekadar
              <br />
              layanan cuci biasa
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Layanan laundry kucek.id memastikan setiap potong pakaian dicuci dalam mesin terpisah, menggunakan air terfiltrasi, dan tercatat secara transparan dari kasir hingga rak pengambilan.
            </p>

            <div className="pt-2">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#1A1918] tracking-tight">
                800+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#57534E] mt-1">
                Pelanggan rutin
                <br />
                setiap bulan
              </p>
            </div>
          </div>

          {/* Right Column: 2x2 Rounded Photo Grid */}
          <div className="md:col-span-7 grid grid-cols-2 gap-3.5 sm:gap-4">
            {ABOUT_PHOTOS.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl bg-[#F4EDE5] aspect-[4/3]"
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  width={600}
                  height={450}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Expert Laundry Services Delivered Fresh */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight">
            Layanan perawatan pakaian yang selalu segar
          </h2>

          {/* 3 Bold Colored Cards (Orange, Yellow, Blue) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {SERVICE_CARDS.map((card) => {
              const themeClasses = {
                orange: 'bg-[#C8430E] text-white',
                yellow: 'bg-[#FDBE1A] text-[#1A1918]',
                blue: 'bg-[#0D5CAD] text-white',
              }[card.theme];

              const descColor =
                card.theme === 'yellow' ? 'text-[#2B2927]' : 'text-white/90';

              return (
                <div
                  key={card.id}
                  className={`${themeClasses} rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[190px] sm:min-h-[230px]`}
                >
                  <div>
                    <ServiceOutlineIcon
                      type={card.iconType}
                      isDarkText={card.theme === 'yellow'}
                    />
                  </div>

                  <div className="mt-8 space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                      {card.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${descColor}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
