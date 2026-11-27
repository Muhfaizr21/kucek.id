import React from 'react';
import { LandingHeader } from '../../features/landing/components/LandingHeader';
import { HeroSection } from '../../features/landing/components/HeroSection';
import { AboutAndServicesSection } from '../../features/landing/components/AboutAndServicesSection';
import { StoryAndProcessSection } from '../../features/landing/components/StoryAndProcessSection';
import { ExpertsAndTestimonialsSection } from '../../features/landing/components/ExpertsAndTestimonialsSection';
import { PricingAndBenefitsSection } from '../../features/landing/components/PricingAndBenefitsSection';
import { CatalogAndScentSection } from '../../features/landing/components/CatalogAndScentSection';
import { HygieneAndComparisonSection } from '../../features/landing/components/HygieneAndComparisonSection';
import { DeliveryAndFaqSection } from '../../features/landing/components/DeliveryAndFaqSection';
import { InteractiveKucekSection } from '../../features/landing/components/InteractiveKucekSection';
import { LandingFooter } from '../../features/landing/components/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1918] selection:bg-[#C8430E] selection:text-white">
      {/* 1. Header Navigation (kucek.id) */}
      <LandingHeader />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. About Us (800+ Customers & 2x2 Grid) + 3 Bold Colored Service Cards */}
        <AboutAndServicesSection />

        {/* 4. Story Timeline (4 columns) + 4 Circular Process Steps + Make Laundry Hassle-Free */}
        <StoryAndProcessSection />

        {/* 5. 8 Circular Laundry Experts + Customer Testimonials */}
        <ExpertsAndTestimonialsSection />

        {/* 6. Tailored Laundry Packages (3 Pricing Cards) + Maximize Experience (4 Numbered Cards) */}
        <PricingAndBenefitsSection />

        {/* 7. KONTEN TAMBAHAN 1 & 2: Katalog Tarif Satuan Interaktif & Galeri Karakter Aroma Parfum */}
        <CatalogAndScentSection />

        {/* 8. KONTEN TAMBAHAN 3 & 5: Protokol Higienitas 1 Mesin 1 Pelanggan & Tabel Perbandingan */}
        <HygieneAndComparisonSection />

        {/* 9. KONTEN TAMBAHAN 4 & 6: Jadwal Rute Kurir Antar-Jemput & Tanya Jawab Operasional Nyata */}
        <DeliveryAndFaqSection />

        {/* 10. Alat Interaktif: Cek Status Resi Live & Kalkulator Estimasi Biaya */}
        <InteractiveKucekSection />
      </main>

      {/* 11. Footer */}
      <LandingFooter />
    </div>
  );
};
