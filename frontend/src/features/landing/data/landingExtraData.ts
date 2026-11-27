export type SatuanCategoryKey = 'BEDDING' | 'FORMAL' | 'SHOES_BAGS' | 'HOUSEHOLD';

export interface SatuanCatalogItem {
  id: string;
  category: SatuanCategoryKey;
  name: string;
  treatment: string;
  duration: string;
  priceIdr: number;
  unit: string;
}

export interface ScentProfileItem {
  id: string;
  name: string;
  tagline: string;
  notes: string;
  durability: string;
  bestFor: string;
  accentColor: string;
  badgeText: string;
}

export interface HygieneProtocolItem {
  id: string;
  number: string;
  title: string;
  description: string;
  highlight: string;
}

export interface ComparisonRowItem {
  aspect: string;
  homeWash: string;
  regularLaundry: string;
  kucekId: string;
}

export interface CourierSlotItem {
  id: string;
  sessionName: string;
  timeRange: string;
  cutoffTime: string;
  description: string;
}

export interface CoverageAreaItem {
  id: string;
  district: string;
  landmarks: string;
  freeDeliveryRule: string;
  etaMinutes: string;
}

export interface LaundryFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SATUAN_CATEGORIES: { key: SatuanCategoryKey; label: string; count: number }[] = [
  { key: 'BEDDING', label: 'Perlengkapan Tidur', count: 4 },
  { key: 'FORMAL', label: 'Pakaian Formal & Jas', count: 4 },
  { key: 'SHOES_BAGS', label: 'Sepatu & Tas', count: 4 },
  { key: 'HOUSEHOLD', label: 'Karpet & Gorden', count: 4 },
];

export const SATUAN_ITEMS: SatuanCatalogItem[] = [
  // BEDDING
  {
    id: 'sat-1',
    category: 'BEDDING',
    name: 'Bedcover Ukuran King / Super King',
    treatment: 'Cuci tabung besar + pengering suhu rendah + kemas vakum',
    duration: '2 Hari',
    priceIdr: 35000,
    unit: 'pcs',
  },
  {
    id: 'sat-2',
    category: 'BEDDING',
    name: 'Bedcover Ukuran Single / Queen',
    treatment: 'Cuci antibakteri + pelembut serat mikro + kemas rapi',
    duration: '2 Hari',
    priceIdr: 25000,
    unit: 'pcs',
  },
  {
    id: 'sat-3',
    category: 'BEDDING',
    name: 'Sprei Set Lengkap (Sprei + Sarung Bantal Guling)',
    treatment: 'Cuci terpisah + setrika uap + parfum Lavender',
    duration: '2 Hari',
    priceIdr: 18000,
    unit: 'set',
  },
  {
    id: 'sat-4',
    category: 'BEDDING',
    name: 'Bantal / Guling Tidur',
    treatment: 'Sanitasi tungau + pengeringan menyeluruh tanpa lembap',
    duration: '2 Hari',
    priceIdr: 20000,
    unit: 'pcs',
  },

  // FORMAL
  {
    id: 'sat-5',
    category: 'FORMAL',
    name: 'Setelan Jas / Blazer Formal',
    treatment: 'Dry clean lembut + setrika uap vertikal + hanger & cover jas',
    duration: '2 Hari',
    priceIdr: 35000,
    unit: 'stel',
  },
  {
    id: 'sat-6',
    category: 'FORMAL',
    name: 'Gaun Pesta / Kebaya Payet',
    treatment: 'Pencucian tangan khusus serat halus + uap suhu rendah',
    duration: '3 Hari',
    priceIdr: 45000,
    unit: 'pcs',
  },
  {
    id: 'sat-7',
    category: 'FORMAL',
    name: 'Kemeja Batik Tulis / Sutra',
    treatment: 'Sabun khusus pelindung warna alami + gantung hanger',
    duration: '2 Hari',
    priceIdr: 20000,
    unit: 'pcs',
  },
  {
    id: 'sat-8',
    category: 'FORMAL',
    name: 'Jaket Kulit / Jaket Musim Dingin (Coat)',
    treatment: 'Pembersihan permukaan + pelembap bahan + kemas gantung',
    duration: '3 Hari',
    priceIdr: 40000,
    unit: 'pcs',
  },

  // SHOES & BAGS
  {
    id: 'sat-9',
    category: 'SHOES_BAGS',
    name: 'Sepatu Sneakers Canvas / Mesh',
    treatment: 'Deep clean sol, upper, insole + deodorizer antibakteri',
    duration: '2-3 Hari',
    priceIdr: 35000,
    unit: 'pasang',
  },
  {
    id: 'sat-10',
    category: 'SHOES_BAGS',
    name: 'Sepatu Putih (Un-yellowing & Deep Clean)',
    treatment: 'Pembersihan noda menguning pada midsole + proteksi warna',
    duration: '3 Hari',
    priceIdr: 45000,
    unit: 'pasang',
  },
  {
    id: 'sat-11',
    category: 'SHOES_BAGS',
    name: 'Tas Ransel / Backpack Harian',
    treatment: 'Cuci bagian dalam & luar + pengeringan sirkulasi udara',
    duration: '3 Hari',
    priceIdr: 30000,
    unit: 'pcs',
  },
  {
    id: 'sat-12',
    category: 'SHOES_BAGS',
    name: 'Helm Motor (Cuci Busa Dalam & Poles Visor)',
    treatment: 'Sanitasi busa antibau + pengeringan UV',
    duration: '1-2 Hari',
    priceIdr: 25000,
    unit: 'pcs',
  },

  // HOUSEHOLD
  {
    id: 'sat-13',
    category: 'HOUSEHOLD',
    name: 'Gorden Tebal / Blackout',
    treatment: 'Pelepasan debu + cuci lembut + setrika uap lipat gantung',
    duration: '3 Hari',
    priceIdr: 15000,
    unit: 'm2',
  },
  {
    id: 'sat-14',
    category: 'HOUSEHOLD',
    name: 'Karpet Ruang Tamu Bulu Halus',
    treatment: 'Vakum debu + sikat sampo karpet + pengeringan tuntas',
    duration: '3-4 Hari',
    priceIdr: 20000,
    unit: 'm2',
  },
  {
    id: 'sat-15',
    category: 'HOUSEHOLD',
    name: 'Boneka Ukuran Sedang / Besar',
    treatment: 'Cuci lembut tanpa merusak isian dakron + sanitasi',
    duration: '2-3 Hari',
    priceIdr: 25000,
    unit: 'pcs',
  },
  {
    id: 'sat-16',
    category: 'HOUSEHOLD',
    name: 'Sajadah Tebal / Mukena Set',
    treatment: 'Cuci higienis terpisah + aroma lembut non-alkohol',
    duration: '1-2 Hari',
    priceIdr: 15000,
    unit: 'set',
  },
];

export const SCENT_PROFILES: ScentProfileItem[] = [
  {
    id: 'scent-sakura',
    name: 'Sakura Blossom',
    tagline: 'Harum bunga musim semi yang segar, manis tipis, dan elegan.',
    notes: 'Kelopak Bunga Sakura, White Peach, dan Jasmine Lembut',
    durability: 'Tahan 14-21 hari di dalam lemari tertutup',
    bestFor: 'Kemeja kerja, blus harian, dan pakaian kasual kampus',
    accentColor: '#C8430E',
    badgeText: 'Pilihan Terpopuler',
  },
  {
    id: 'scent-lavender',
    name: 'Lavender Breeze',
    tagline: 'Aroma herbal lavender yang menenangkan dan membuat tidur lebih nyenyak.',
    notes: 'French Lavender, Chamomile, dan Sentuhan Kayu Cedar',
    durability: 'Tahan 14-21 hari di dalam lemari tertutup',
    bestFor: 'Sprei, bedcover, sarung bantal, piyama, dan pakaian santai di rumah',
    accentColor: '#0D5CAD',
    badgeText: 'Favorit Perlengkapan Tidur',
  },
  {
    id: 'scent-ocean',
    name: 'Ocean Fresh',
    tagline: 'Kesan bersih, dingin, dan berenergi setelah beraktivitas seharian.',
    notes: 'Angin Laut Segar, Citrus Bergamot, dan Clean Cotton',
    durability: 'Tahan 14-18 hari di dalam lemari tertutup',
    bestFor: 'Kaos olahraga, jaket, celana jeans, dan pakaian aktivitas luar ruang',
    accentColor: '#0D5CAD',
    badgeText: 'Segar & Maskulin',
  },
  {
    id: 'scent-vanilla',
    name: 'Sweet Vanilla',
    tagline: 'Kehangatan aroma vanila lembut yang nyaman dan tidak menyengat.',
    notes: 'Madagascar Vanilla, White Musk, dan Almond Milk',
    durability: 'Tahan hingga 21 hari di dalam lemari tertutup',
    bestFor: 'Sweter, hoodie, cardigan rajut, dan selimut keluarga',
    accentColor: '#FDBE1A',
    badgeText: 'Hangat & Lembut',
  },
  {
    id: 'scent-baby',
    name: 'Tanpa Parfum (Ramah Bayi)',
    tagline: 'Murni bersih tanpa tambahan pewangi sintetis untuk kulit sensitif.',
    notes: '100% Bebas Alkohol & Pewangi Tambahan (Hypoallergenic)',
    durability: 'Netral dan aman langsung dipakai bayi maupun pemilik alergi',
    bestFor: 'Pakaian bayi baru lahir, pakaian dalam, dan pemilik kulit sensitif',
    accentColor: '#6E675F',
    badgeText: 'Aman Kulit Sensitif',
  },
];

export const HYGIENE_PROTOCOLS: HygieneProtocolItem[] = [
  {
    id: 'hyg-1',
    number: '01',
    title: '1 Mesin 1 Pelanggan (Tanpa Campur)',
    description:
      'Cucian Anda tidak pernah digabungkan dengan pakaian milik orang lain di dalam tabung mesin cuci maupun mesin pengering.',
    highlight: 'Higienis & Bebas Tertukar',
  },
  {
    id: 'hyg-2',
    number: '02',
    title: 'Inspeksi Foto Awal & Label Tahan Air',
    description:
      'Setiap kantong diberi kode resi tahan air dan pakaian yang memiliki noda khusus difoto di kasir sebagai bukti kondisi awal.',
    highlight: 'Dokumentasi Transparan',
  },
  {
    id: 'hyg-3',
    number: '03',
    title: 'Setrika Uap Boiler (Bukan Setrika Listrik)',
    description:
      'Menggunakan uap panas bertekanan tanpa elemen logam panas berlebih, sehingga sablon tidak meleleh dan kemeja tidak mengilap.',
    highlight: 'Aman untuk Semua Serat',
  },
  {
    id: 'hyg-4',
    number: '04',
    title: 'Garansi Cuci & Setrika Ulang 24 Jam',
    description:
      'Jika dalam 24 jam setelah pengambilan ditemukan pakaian yang kurang rapi atau kurang harum, kami cuci ulang tanpa biaya tambahan.',
    highlight: 'Jaminan Kepuasan Nyata',
  },
];

export const COMPARISON_ROWS: ComparisonRowItem[] = [
  {
    aspect: 'Pemisahan Pakaian di Mesin',
    homeWash: 'Sendiri, tapi kapasitas mesin rumah terbatas',
    regularLaundry: 'Sering digabung pelanggan lain agar hemat listrik',
    kucekId: '1 Mesin 1 Nota Pelanggan (Dijamin Terpisah)',
  },
  {
    aspect: 'Teknologi Pengeringan',
    homeWash: 'Jemur matahari (rawan bau apek saat mendung)',
    regularLaundry: 'Jemur luar ruang terkena debu jalanan',
    kucekId: '100% Mesin Dryer Tertutup Suhu Terkontrol',
  },
  {
    aspect: 'Metode Penyetrikaan',
    homeWash: 'Setrika listrik biasa (memakan waktu berjam-jam)',
    regularLaundry: 'Setrika listrik (rawan meninggalkan bekas kilap)',
    kucekId: 'Setrika Uap Boiler Industri (Licin & Aman Sablon)',
  },
  {
    aspect: 'Pelacakan Posisi Cucian',
    homeWash: 'Harus dikerjakan sendiri dari awal sampai akhir',
    regularLaundry: 'Nota kertas (harus tanya manual lewat chat)',
    kucekId: 'Live Tracking 6 Tahap via Nomor Resi & Notifikasi WA',
  },
  {
    aspect: 'Keamanan & Bukti Kondisi Awal',
    homeWash: 'Tergantung ketelitian sendiri',
    regularLaundry: 'Tidak ada catatan jika kancing lepas atau luntur',
    kucekId: 'Inspeksi Foto di Kasir + Garansi Klaim 1x24 Jam',
  },
];

export const COURIER_SLOTS: CourierSlotItem[] = [
  {
    id: 'slot-pagi',
    sessionName: 'Gelombang Pagi',
    timeRange: '09.00 - 12.00 WIB',
    cutoffTime: 'Pesan sebelum 08.45 WIB',
    description: 'Cocok untuk mahasiswa dan pekerja sebelum berangkat beraktivitas.',
  },
  {
    id: 'slot-siang',
    sessionName: 'Gelombang Siang',
    timeRange: '13.00 - 16.00 WIB',
    cutoffTime: 'Pesan sebelum 12.45 WIB',
    description: 'Jadwal favorit penjemputan pakaian keluarga dan sprei/bedcover.',
  },
  {
    id: 'slot-sore',
    sessionName: 'Gelombang Sore',
    timeRange: '16.30 - 19.00 WIB',
    cutoffTime: 'Pesan sebelum 16.00 WIB',
    description: 'Pilihan praktis sepulang kerja atau kuliah di sore hari.',
  },
];

export const COVERAGE_AREAS: CoverageAreaItem[] = [
  {
    id: 'area-1',
    district: 'Dipatiukur & Lebakgede',
    landmarks: 'Sekitar UNPAD Dipatiukur, Jalan Hasanudin, Tubagus Ismail',
    freeDeliveryRule: 'Gratis Ongkir (Min. 3 Kg atau Member Paket Kuota)',
    etaMinutes: '15 - 25 Menit',
  },
  {
    id: 'area-2',
    district: 'Dago & Cisitu',
    landmarks: 'Cisitu Indah, Cisitu Lama, Simpang Dago, Dago Asri',
    freeDeliveryRule: 'Gratis Ongkir (Min. 4 Kg atau Member Paket Kuota)',
    etaMinutes: '20 - 30 Menit',
  },
  {
    id: 'area-3',
    district: 'Tamansari & Cihampelas',
    landmarks: 'Kawasan ITB, Balubur, Cihampelas Walk, Wastukencana',
    freeDeliveryRule: 'Gratis Ongkir (Min. 4 Kg atau Member Paket Kuota)',
    etaMinutes: '20 - 35 Menit',
  },
  {
    id: 'area-4',
    district: 'Ciumbuleuit & Setiabudi',
    landmarks: 'Sekitar UNPAR, Hegarmanah, Gegerkalong, Ledeng',
    freeDeliveryRule: 'Gratis Ongkir (Min. 5 Kg atau Member Paket Kuota)',
    etaMinutes: '25 - 40 Menit',
  },
];

export const LAUNDRY_FAQS: LaundryFaqItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana jika berat cucian kiloan saya kurang dari batas minimum 2 Kg?',
    answer:
      'Timbangan kasir kami tetap mencatat berat riil pakaian Anda (misalnya 1,35 Kg), namun sistem mengenakan tarif batas minimum operasional sebesar 2,0 Kg (Rp16.000 untuk layanan reguler) karena setiap nota tetap dicuci dalam 1 mesin tersendiri tanpa digabung pelanggan lain.',
  },
  {
    id: 'faq-2',
    question: 'Apakah pakaian putih dipisahkan dari pakaian berwarna yang rawan luntur?',
    answer:
      'Saat serah terima di kasir atau kurir, tim kami melakukan penyortiran awal. Jika terdapat pakaian baru atau bahan jin/batik yang berpotensi luntur, kasir akan memotret dan menanyakan apakah ingin dipisahkan ke siklus cuci tersendiri agar pakaian putih Anda tetap aman.',
  },
  {
    id: 'faq-3',
    question: 'Bagaimana perhitungan jika sisa kuota paket saya tinggal 1,5 Kg sedangkan cucian saya 4,0 Kg?',
    answer:
      'Sistem secara otomatis memotong habis sisa kuota 1,5 Kg Anda hingga menjadi 0 Kg, lalu Anda hanya perlu membayar selisih kelebihan beratnya saja yaitu 2,5 Kg dikalikan tarif kiloan reguler (tanpa biaya denda apa pun).',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana prosedur klaim garansi jika ada pakaian yang kurang rapi atau tertinggal?',
    answer:
      'Anda memiliki waktu 1 x 24 jam sejak status nota berubah menjadi Selesai/Diambil. Cukup buka halaman Cek Resi atau hubungi WhatsApp outlet dengan menyertakan nomor resi dan foto pakaian, tim kami akan menjemput dan mencuci ulang secara gratis.',
  },
  {
    id: 'faq-5',
    question: 'Kapan saya harus melakukan pembayaran untuk pesanan antar-jemput?',
    answer:
      'Untuk layanan jemputan, kurir akan membawa pakaian Anda ke outlet terlebih dahulu untuk ditimbang secara akurat di kasir. Setelah berat riil tercatat, e-Nota resmi akan dikirim ke WhatsApp Anda dan pembayaran dapat dilakukan melalui QRIS, potong kuota paket, atau tunai saat pakaian bersih diantar kembali.',
  },
];
