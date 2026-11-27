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
  priceDetail: string;
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
    text: 'Pakaian lembut, segar, dan kembali terawat',
    position: 'left',
  },
  {
    id: 'hl-2',
    iconType: 'dryclean',
    text: 'Pencucian terstandar untuk hasil bersih menyeluruh',
    position: 'left',
  },
  {
    id: 'hl-3',
    iconType: 'delicate',
    text: 'Serat kain sensitif ditangani dengan teliti',
    position: 'right',
  },
  {
    id: 'hl-4',
    iconType: 'clock24',
    text: 'Layanan penerimaan & pelacakan buka 24 jam',
    position: 'right',
  },
];

export const ABOUT_PHOTOS = [
  {
    id: 'ab-1',
    url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80',
    alt: 'Pemeriksaan kerapian pakaian di rak gantung kucek.id',
  },
  {
    id: 'ab-2',
    url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=600&q=80',
    alt: 'Proses setrika uap pakaian oleh staf kucek.id',
  },
  {
    id: 'ab-3',
    url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    alt: 'Memasukkan pakaian ke mesin cuci bukaan depan',
  },
  {
    id: 'ab-4',
    url: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80',
    alt: 'Staf kucek.id membawa keranjang pakaian bersih',
  },
];

export const SERVICE_CARDS: ServiceCardItem[] = [
  {
    id: 'srv-1',
    title: 'Cuci Cepat',
    description: 'Pakaian harian dicuci bersih, dikeringkan, dan dilipat rapi.',
    theme: 'orange',
    iconType: 'washer',
  },
  {
    id: 'srv-2',
    title: 'Setrika Uap',
    description: 'Setrika uap suhu terkontrol agar pakaian licin tanpa merusak serat.',
    theme: 'yellow',
    iconType: 'iron',
  },
  {
    id: 'srv-3',
    title: 'Angkat Noda',
    description: 'Pembersihan noda membandel dengan cairan khusus ramah kain.',
    theme: 'blue',
    iconType: 'stain',
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'tm-1',
    title: 'Langkah Awal',
    description: 'Memulai operasional workshop pertama dengan standar pencucian terpisah.',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Penataan dan pengemasan pakaian di awal berdirinya kucek.id',
  },
  {
    id: 'tm-2',
    title: 'Hadir di Lingkunganmu',
    description: 'Membuka layanan antar-jemput lokal untuk area tempat tinggal dan kos.',
    imageUrl: 'https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Deretan mesin cuci komersial di outlet kucek.id',
  },
  {
    id: 'tm-3',
    title: 'Standar Kematangan',
    description: 'Setiap mesin melewati sterilisasi rutin dengan takaran deterjen terukur.',
    imageUrl: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Pengoperasian mesin pencucian dan pengeringan modern',
  },
  {
    id: 'tm-4',
    title: 'Inovasi Layanan',
    description: 'Pelacakan status nota secara langsung dan sistem kuota langganan kiloan.',
    imageUrl: 'https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Penyortiran pakaian bersih berdasarkan nomor nota pelanggan',
  },
];

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    stepNumber: 1,
    text: 'Pakaian diterima, ditimbang, dan dicatat kondisinya',
    badgeColor: 'orange',
  },
  {
    stepNumber: 2,
    text: 'Dicuci terpisah per pelanggan tanpa dicampur',
    badgeColor: 'yellow',
  },
  {
    stepNumber: 3,
    text: 'Setrika uap rapi dengan aroma parfum pilihanmu',
    badgeColor: 'taupe',
  },
  {
    stepNumber: 4,
    text: 'Dikemas bersih dan siap diambil atau diantar',
    badgeColor: 'blue',
  },
];

export const TEAM_EXPERTS: TeamExpert[] = [
  {
    id: 'exp-1',
    name: 'Arif Pratama',
    role: 'Kepala Kualitas Cuci',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#DCE8F5]',
  },
  {
    id: 'exp-2',
    name: 'Rina Wijaya',
    role: 'Spesialis Serat Kain',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#E8E4DF]',
  },
  {
    id: 'exp-3',
    name: 'Siti Nurhaliza',
    role: 'Ahli Setrika Uap',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#F0EAE2]',
  },
  {
    id: 'exp-4',
    name: 'Maya Putri',
    role: 'Spesialis Dry Clean',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#1D4E89]',
  },
  {
    id: 'exp-5',
    name: 'Budi Santoso',
    role: 'Penanganan Noda',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#D6E4F0]',
  },
  {
    id: 'exp-6',
    name: 'Hendra Kusuma',
    role: 'Pemeriksa Kelengkapan',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#E5E0DA]',
  },
  {
    id: 'exp-7',
    name: 'Dewi Lestari',
    role: 'Pewangi & Pengemasan',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#EFECE8]',
  },
  {
    id: 'exp-8',
    name: 'Nadia Safitri',
    role: 'Koordinator Antar-Jemput',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    bgClass: 'bg-[#1B5299]',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'tst-1',
    name: 'Marina Sari',
    role: 'Pelanggan Paket 30 Kg',
    quote:
      'Setiap kemeja kerja kembali dalam keadaan rapi, harum Sakura Blossom, dan lipatannya presisi. Bisa cek status cucian dari HP bikin tenang.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    id: 'tst-2',
    name: 'Kevin Dirgantara',
    role: 'Pelanggan Paket 50 Kg',
    quote:
      'Pesan penjemputan dari kos sangat praktis. Kuota kiloan memotong pengeluaran laundry bulanan saya dan jadwal selesainya selalu tepat waktu.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

export const PRICING_PACKAGES: PricingPackageItem[] = [
  {
    id: 'pkg-quick',
    name: 'Cuci Cepat',
    subtitle: 'Paket hemat anak kos & harian',
    priceDisplay: 'Rp180rb',
    priceDetail: 'Kuota 30 Kg (Rp6.000/kg)',
    period: '/ 30 hari',
    isFeatured: true,
    features: [
      'Kuota cuci kering lipat 30 Kg',
      'Bebas pilih 5 aroma parfum',
      'Pencucian 1 mesin 1 pelanggan',
      'Pantau status nota via web & WA',
    ],
  },
  {
    id: 'pkg-press',
    name: 'Setrika Rapi',
    subtitle: 'Cuci komplit + setrika uap',
    priceDisplay: 'Rp300rb',
    priceDetail: 'Kuota 50 Kg (Rp6.000/kg)',
    period: '/ 45 hari',
    isFeatured: false,
    features: [
      'Kuota cuci + setrika uap 50 Kg',
      'Gratis antar-jemput radius 3 km',
      'Opsi gantung hanger untuk kemeja',
      'Prioritas pengerjaan lebih cepat',
    ],
  },
  {
    id: 'pkg-stain',
    name: 'Paket Keluarga',
    subtitle: 'Perawatan lengkap rumah tangga',
    priceDisplay: 'Rp550rb',
    priceDetail: 'Kuota 100 Kg (Rp5.500/kg)',
    period: '/ 60 hari',
    isFeatured: false,
    features: [
      'Kuota keluarga 100 Kg berlaku 60 hari',
      'Termasuk pembersihan noda ringan',
      'Potongan khusus cuci bedcover & jas',
      'Jadwal jemput rutin mingguan',
    ],
  },
];

export const EXPERIENCE_BENEFITS: ExperienceBenefitItem[] = [
  {
    number: 1,
    title: 'Layanan jemput dan antar langsung ke depan pintu',
    description:
      'Atur jadwal penjemputan dari ponselmu. Kurir kami mengambil pakaian kotor dari rumah, kos, atau apartemen sesuai slot waktu yang kamu pilih.',
  },
  {
    number: 2,
    title: 'Pencatatan kondisi awal pakaian yang transparan',
    description:
      'Setiap pakaian diperiksa dan difoto saat masuk kasir, sehingga bahan sensitif maupun noda khusus ditangani dengan tepat sejak awal.',
  },
  {
    number: 3,
    title: 'Deterjen lembut ramah kulit dan parfum tahan lama',
    description:
      'Menggunakan deterjen hipoalergenik serta 5 pilihan aroma khas mulai dari Sakura Blossom, Lavender Breeze, hingga Ocean Fresh.',
  },
  {
    number: 4,
    title: 'Pantau setiap tahap pencucian secara langsung',
    description:
      'Lihat posisi cucianmu mulai dari antrean cuci, pengeringan, setrika uap, hingga siap diambil hanya dengan memasukkan nomor nota.',
  },
];
