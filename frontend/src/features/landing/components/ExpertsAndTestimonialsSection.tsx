import React from 'react';
import { TEAM_EXPERTS, TESTIMONIALS } from '../data/landingData';

export const ExpertsAndTestimonialsSection: React.FC = () => {
  return (
    <section className="bg-white pb-16 sm:pb-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-20">
        {/* Part 1: Tim spesialis yang peduli pada kebersihan (8 Circular Avatars) */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-xl mx-auto leading-tight">
            Tim spesialis yang peduli pada kebersihan
          </h2>

          <div className="grid grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto">
            {TEAM_EXPERTS.map((expert) => (
              <div key={expert.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 sm:w-28 sm:h-28 rounded-full ${expert.bgClass} overflow-hidden p-1`}
                >
                  <img
                    src={expert.avatarUrl}
                    alt={`Potret ${expert.name}, ${expert.role}`}
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="mt-2.5 text-xs sm:text-sm font-bold text-[#1A1918] line-clamp-1">
                  {expert.name}
                </p>
                <p className="text-[11px] sm:text-xs text-[#57534E] hidden sm:block">
                  {expert.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Pakaian bersih, cerita pelanggan berbicara */}
        <div className="space-y-10">
          <h2 className="text-center text-2xl sm:text-4xl font-extrabold text-[#1A1918] tracking-tight max-w-xl mx-auto leading-tight">
            Pakaian bersih, cerita pelanggan berbicara
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Portrait Photo */}
            <div className="md:col-span-4 rounded-3xl overflow-hidden bg-[#E5E0DA] min-h-[260px]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                alt="Pelanggan setia kucek.id"
                width={700}
                height={800}
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
                    <div
                      className="flex items-center gap-1 text-[#C8430E]"
                      aria-label={`Penilaian ${item.rating} dari 5`}
                    >
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <svg
                          key={idx}
                          aria-hidden="true"
                          className="w-4 h-4 fill-[#FDBE1A]"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#3F3C39] leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-[#EAE2D8]">
                    <img
                      src={item.avatarUrl}
                      alt={`Foto ${item.name}`}
                      width={80}
                      height={80}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-[#1A1918]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#57534E]">{item.role}</p>
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
