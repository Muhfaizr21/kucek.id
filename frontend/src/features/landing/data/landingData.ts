export interface HeroHighlight {
  id: string;
  iconType: 'garment' | 'dryclean' | 'delicate' | 'clock24';
  text: string;
  position: 'left' | 'right';
}

export interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  theme: 'orange' | 'yellow' | 'blue';
  iconType: 'washer' | 'iron' | 'stain';
}

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface ProcessStepItem {
  stepNumber: number;
  text: string;
  badgeColor: 'orange' | 'yellow' | 'taupe' | 'blue';
}

export interface TeamExpert {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bgClass: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
  rating: number;
}

export interface PricingPackageItem {
  id: string;
  name: string;
  subtitle: string;
  priceDisplay: string;
  priceIdr: string;
  period: string;
  isFeatured: boolean;
  features: string[];
}

export interface ExperienceBenefitItem {
  number: number;
  title: string;
  description: string;
}

export const HERO_HIGHLIGHTS: HeroHighlight[] = [
  {
    id: 'hl-1',
    iconType: 'garment',
    text: 'Soft, fresh, and revitalized garments',
    position: 'left',
  },
  {
    id: 'hl-2',
    iconType: 'dryclean',
    text: 'Expertly dry-cleaned for pristine results',
    position: 'left',
  },
  {
    id: 'hl-3',
    iconType: 'delicate',
    text: 'Delicate fabrics treated with expertise',
    position: 'right',
  },
  {
    id: 'hl-4',
    iconType: 'clock24',
    text: '24 Hours Reception is open',
    position: 'right',
  },
];

export const ABOUT_PHOTOS = [
  {
    id: 'ab-1',
    url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
    alt: 'Checking clean garments on rack',
  },
  {
    id: 'ab-2',
    url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    alt: 'Steam ironing fresh clothes',
  },
  {
    id: 'ab-3',
    url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    alt: 'Loading front-load washing machine',
  },
  {
    id: 'ab-4',
    url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    alt: 'Smiling staff with laundry basket',
  },
];

export const SERVICE_CARDS: ServiceCardItem[] = [
  {
    id: 'srv-1',
    title: 'Quick Wash',
    description: 'Up soft, fresh, and washing garments.',
    theme: 'orange',
    iconType: 'washer',
  },
  {
    id: 'srv-2',
    title: 'Fresh Press',
    description: 'Expertly dry-cleaned for her pristine results.',
    theme: 'yellow',
    iconType: 'iron',
  },
  {
    id: 'srv-3',
    title: 'Stain Removal',
    description: 'Stain removal, treated stain-with expertise.',
    theme: 'blue',
    iconType: 'stain',
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'tm-1',
    title: 'Foundation',
    description: 'We received the foundation for first company.',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Foundation packing and folding clothes',
  },
  {
    id: 'tm-2',
    title: 'Local launch',
    description: 'Laundromats local launch, consistency, and first launch.',
    imageUrl: 'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Local laundromat launch with machines',
  },
  {
    id: 'tm-3',
    title: 'Current maturity',
    description: 'Now current the growth and stronger company.',
    imageUrl: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Modern washing machines in operation',
  },
  {
    id: 'tm-4',
    title: 'Service innovation',
    description: 'Service innovation to service for a laundry and service.',
    imageUrl: 'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Innovative laundry sorting shelves',
  },
];

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    stepNumber: 1,
    text: 'Soft, fresh, and revitalized garments',
    badgeColor: 'orange',
  },
  {
    stepNumber: 2,
    text: 'Expertly dry-cleaned for pristine results',
    badgeColor: 'yellow',
  },
  {
    stepNumber: 3,
    text: 'Delicate fabrics treated with expertise',
    badgeColor: 'taupe',
  },
  {
    stepNumber: 4,
    text: 'Our easy process for fresh laundry every time',
    badgeColor: 'blue',
  },
];

export const TEAM_EXPERTS: TeamExpert[] = [
  {
    id: 'exp-1',
    name: 'Arif Pratama',
    role: 'Head of Wash Quality',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#DCE8F5]',
  },
  {
    id: 'exp-2',
    name: 'Rina Wijaya',
    role: 'Fabric Care Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#E8E4DF]',
  },
  {
    id: 'exp-3',
    name: 'Siti Nurhaliza',
    role: 'Steam Press Expert',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#F0EAE2]',
  },
  {
    id: 'exp-4',
    name: 'Maya Putri',
    role: 'Dry Clean Master',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#1D4E89]',
  },
  {
    id: 'exp-5',
    name: 'Budi Santoso',
    role: 'Stain Removal Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#D6E4F0]',
  },
  {
    id: 'exp-6',
    name: 'Hendra Kusuma',
    role: 'Quality Control Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#E5E0DA]',
  },
  {
    id: 'exp-7',
    name: 'Dewi Lestari',
    role: 'Aroma & Finishing',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#EFECE8]',
  },
  {
    id: 'exp-8',
    name: 'Nadia Safitri',
    role: 'Customer Care Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#1B5299]',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'tst-1',
    name: 'Marina Sari',
    role: 'Regular Customer & Member',
    quote:
      'Their attention to detail is unmatched! Every shirt comes back crisp, smelling like Sakura Blossom, and neatly folded. Live tracking makes it so effortless.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    id: 'tst-2',
    name: 'Kevin Dirgantara',
    role: '50Kg Package Subscriber',
    quote:
      'Booking pickup from my apartment takes 20 seconds. The quota subscription saves me 30% every month and the 24-hour guarantee gives total peace of mind.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

export const PRICING_PACKAGES: PricingPackageItem[] = [
  {
    id: 'pkg-quick',
    name: 'Quick Wash',
    subtitle: 'Daily garment wash & fold',
    priceDisplay: '$70',
    priceIdr: 'Rp180.000 / 30 Kg',
    period: '/month package',
    isFeatured: true,
    features: [
      '30 Kg monthly laundry quota',
      'Wash, dry & neat fold included',
      'Free premium perfume choice',
      'Real-time WhatsApp & web tracking',
    ],
  },
  {
    id: 'pkg-press',
    name: 'Fresh Press',
    subtitle: 'Full wash + steam ironing',
    priceDisplay: '$78',
    priceIdr: 'Rp300.000 / 50 Kg',
    period: '/month package',
    isFeatured: false,
    features: [
      '50 Kg monthly laundry quota',
      'Professional steam ironing & hanger',
      'Free pickup & delivery radius 3 km',
      'Priority 24-hour turnaround option',
    ],
  },
  {
    id: 'pkg-stain',
    name: 'Stain Removal',
    subtitle: 'Family & executive care',
    priceDisplay: '$170',
    priceIdr: 'Rp550.000 / 100 Kg',
    period: '/60 days package',
    isFeatured: false,
    features: [
      '100 Kg family quota (60 days validity)',
      'Deep stain & delicate fabric treatment',
      'Bedcover & suit dry-clean discount',
      'Dedicated VIP courier pickup',
    ],
  },
];

export const EXPERIENCE_BENEFITS: ExperienceBenefitItem[] = [
  {
    number: 1,
    title: 'This convenient pick & delivery experience here',
    description:
      'Schedule door-to-door pickup directly from your smartphone. Our courier arrives on time at your home, boarding house, or office.',
  },
  {
    number: 2,
    title: 'Minimize care around expert fabric stain cleaning here',
    description:
      'Every garment is inspected and photographed at check-in so delicate fibers and tough stains get the exact treatment they need.',
  },
  {
    number: 3,
    title: 'Eco-safe gentle soaps and freshly scented garments',
    description:
      'We use hypoallergenic detergents and 5 signature long-lasting perfumes—from Sakura Blossom to Ocean Fresh.',
  },
  {
    number: 4,
    title: 'Maximize your laundry experience here',
    description:
      'Monitor every stage from Washing, Drying, Steam Ironing, to QC Packing live via your receipt code without any hassle.',
  },
];
