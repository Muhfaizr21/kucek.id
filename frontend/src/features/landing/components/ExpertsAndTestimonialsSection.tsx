import React from 'react';
import { Star } from 'lucide-react';
import { TEAM_EXPERTS, TESTIMONIALS } from '../data/landingData';

export const ExpertsAndTestimonialsSection: React.FC = () => {
  return (
    <section className="bg-white pb-16 sm:pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-20">
        {/* Part 1: Laundry experts passionate about clean (8 Circular Avatars) */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-xl mx-auto leading-tight">
            Laundry experts passionate about clean
          </h2>

          <div className="grid grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto">
            {TEAM_EXPERTS.map((expert) => (
              <div key={expert.id} className="flex flex-col items-center text-center group">
                <div
                  className={`w-16 h-16 sm:w-28 sm:h-28 rounded-full ${expert.bgClass} overflow-hidden p-1 shadow-xs group-hover:scale-105 transition duration-300`}
                >
                  <img
                    src={expert.avatarUrl}
                    alt={expert.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="mt-2.5 text-xs sm:text-sm font-bold text-[#1A1918] line-clamp-1">
                  {expert.name}
                </p>
                <p className="text-[10px] sm:text-xs text-[#78736E] hidden sm:block">
                  {expert.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Fresh laundry, happy customers speak volumes */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-xl mx-auto leading-tight">
            Fresh laundry, happy customers speak volumes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Portrait Photo */}
            <div className="md:col-span-4 rounded-3xl overflow-hidden bg-[#E5E0DA] min-h-[260px]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                alt="Happy customer smiling"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Testimonial Cards */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TESTIMONIALS.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF7F2] border border-[#EAE2D8] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#FDBE1A]">
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#FDBE1A]" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A4643] leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-[#EAE2D8]">
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-[#1A1918]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#78736E]">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
