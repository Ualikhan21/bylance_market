/**
 * ============================================================================
 * 📱 BYLANCE — ДАННЫЕ ИНТЕРНЕТ-МАГАЗИНА ЭЛЕКТРОНИКИ
 * ============================================================================
 * Модели с выбором памяти и SIM, 4 способа оплаты, полный каталог.
 */
import { PRODUCT_IMAGES } from './productImages';

// 1. КОНТАКТЫ МАГАЗИНА
export const SITE_INFO = {
  shopName: "Bylance",
  city: "Алматы",
  logoPath: "/logo.svg",
  whatsapp: "77765293916",
  whatsappFormatted: "+7 (776) 529-39-16",
  telegram: "bylance",
  gis: "https://2gis.kz/almaty",
  address: "г. Алматы, пр. Абылай хана (точный адрес уточняйте в WhatsApp)",
  hours: "Ежедневно 10:00–20:00",
  roundTo: 1000,
};

// 2. ЧЕТЫРЕ СПОСОБА ОПЛАТЫ
export type PaymentMethodId = 'kaspi' | 'halyk' | 'promo' | 'cash';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  shortLabel: string;
  badge: string;
  description: string;
  color: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'kaspi',
    name: 'Kaspi рассрочка',
    shortLabel: 'Kaspi',
    badge: '0-0-12 / 0-0-24',
    description: 'Оформление рассрочки или кредита через Kaspi Bank',
    color: '#F14635',
  },
  {
    id: 'halyk',
    name: 'Halyk рассрочка',
    shortLabel: 'Halyk',
    badge: '0-0-12 / 0-0-24',
    description: 'Рассрочка без переплат через приложение Halyk Bank',
    color: '#008248',
  },
  {
    id: 'promo',
    name: 'Акционная цена',
    shortLabel: 'Акция',
    badge: 'Спеццена',
    description: 'Специальная сниженная цена по текущей акции магазина',
    color: '#E11D48',
  },
  {
    id: 'cash',
    name: 'Скидка за наличную оплату',
    shortLabel: 'Наличный расчёт',
    badge: 'Скидка',
    description: 'Лучшая цена при оплате наличными или прямым переводом',
    color: '#059669',
  },
];

// 3. КАТЕГОРИИ
export type MainCategory = 'apple' | 'dyson' | 'other';

export interface CategoryInfo {
  id: MainCategory;
  name: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'apple', name: 'APPLE', description: 'iPhone, iPad, MacBook, AirPods, Apple Watch' },
  { id: 'dyson', name: 'DYSON', description: 'Стайлеры и выпрямители волос' },
  { id: 'other', name: 'ДРУГИЕ ТОВАРЫ', description: 'Фотокамеры, Ray-Ban Meta, DJI, Яндекс Станция' },
];

// ВАРИАНТ ТОВАРА
export interface ProductVariant {
  id: string;
  fullName: string;
  simType?: 'ESIM' | 'SIM';
  storage?: string;
  size?: string;
  prices: {
    kaspi: number | null;
    halyk: number | null;
    promo: number | null;
    cash: number | null;
  };
}

// МОДЕЛЬ ТОВАРА (ГРУППА С ВЫБОРОМ ПАМЯТИ/SIM)
export interface ProductModel {
  id: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  badge?: string; // Никакого "Топ продаж" над телефонами!
  warranty: string;
  image: string;
  simOptions?: ('ESIM' | 'SIM')[];
  storageOptions?: string[];
  sizeOptions?: string[];
  variants: ProductVariant[];
}

export const PRODUCT_MODELS: ProductModel[] = [
  // ==========================================
  // 1. IPHONE 18 PRO
  // ==========================================
  {
    id: 'model-ip18p',
    name: 'iPhone 18 Pro',
    category: 'apple',
    subcategory: 'iPhone 18',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.iphone,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ'],
    variants: [
      {
        id: '18-pro-esim-256',
        fullName: 'iPhone 18 Pro (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 864000, halyk: 900000, promo: 750000, cash: 720000 },
      },
      {
        id: '18-pro-esim-512',
        fullName: 'iPhone 18 Pro (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 996000, halyk: 1037500, promo: 864000, cash: 830000 },
      },
      {
        id: '18-pro-esim-1tb',
        fullName: 'iPhone 18 Pro (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 1260000, halyk: 1312500, promo: 1092000, cash: 1050000 },
      },
      {
        id: '18-pro-sim-256',
        fullName: 'iPhone 18 Pro (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 900000, halyk: 937500, promo: 780000, cash: 750000 },
      },
      {
        id: '18-pro-sim-512',
        fullName: 'iPhone 18 Pro (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 1044000, halyk: 1087500, promo: 905000, cash: 870000 },
      },
      {
        id: '18-pro-sim-1tb',
        fullName: 'iPhone 18 Pro (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1320000, halyk: 1375000, promo: 1144000, cash: 1100000 },
      },
    ],
  },

  // ==========================================
  // 2. IPHONE 18 PRO MAX
  // ==========================================
  {
    id: 'model-ip18pm',
    name: 'iPhone 18 Pro Max',
    category: 'apple',
    subcategory: 'iPhone 18',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.iphone,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
    variants: [
      {
        id: '18-pm-esim-256',
        fullName: 'iPhone 18 Pro Max (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 984000, halyk: 1025000, promo: 853000, cash: 820000 },
      },
      {
        id: '18-pm-esim-512',
        fullName: 'iPhone 18 Pro Max (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 1164000, halyk: 1212500, promo: 1010000, cash: 970000 },
      },
      {
        id: '18-pm-esim-1tb',
        fullName: 'iPhone 18 Pro Max (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 1416000, halyk: 1475000, promo: 1248000, cash: 1180000 },
      },
      {
        id: '18-pm-esim-2tb',
        fullName: 'iPhone 18 Pro Max (ESIM) 2 ТБ',
        simType: 'ESIM',
        storage: '2 ТБ',
        prices: { kaspi: 1680000, halyk: 1750000, promo: 1456000, cash: 1400000 },
      },
      {
        id: '18-pm-sim-256',
        fullName: 'iPhone 18 Pro Max (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 1020000, halyk: 1062500, promo: 884000, cash: 850000 },
      },
      {
        id: '18-pm-sim-512',
        fullName: 'iPhone 18 Pro Max (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 1200000, halyk: 1250000, promo: 1040000, cash: 1000000 },
      },
      {
        id: '18-pm-sim-1tb',
        fullName: 'iPhone 18 Pro Max (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1500000, halyk: 1562500, promo: 1300000, cash: 1250000 },
      },
      {
        id: '18-pm-sim-2tb',
        fullName: 'iPhone 18 Pro Max (SIM) 2 ТБ',
        simType: 'SIM',
        storage: '2 ТБ',
        prices: { kaspi: 1800000, halyk: 1875000, promo: 1560000, cash: 1500000 },
      },
    ],
  },

  // ==========================================
  // 3. IPHONE DUO
  // ==========================================
  {
    id: 'model-ip-duo',
    name: 'iPhone DUO',
    category: 'apple',
    subcategory: 'iPhone Duo',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.iphone,
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ'],
    variants: [
      {
        id: 'duo-256',
        fullName: 'iPhone DUO 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 1500000, halyk: 1562500, promo: 1300000, cash: 1250000 },
      },
      {
        id: 'duo-512',
        fullName: 'iPhone DUO 512 ГБ',
        storage: '512 ГБ',
        prices: { kaspi: 1680000, halyk: 1750000, promo: 1456000, cash: 1400000 },
      },
      {
        id: 'duo-1tb',
        fullName: 'iPhone DUO 1 ТБ',
        storage: '1 ТБ',
        prices: { kaspi: 2220000, halyk: 2312500, promo: 1924000, cash: 1850000 },
      },
    ],
  },

  // ==========================================
  // 4. IPHONE 17
  // ==========================================
  {
    id: 'model-ip17',
    name: 'iPhone 17',
    category: 'apple',
    subcategory: 'iPhone 17',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.iphone,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ'],
    variants: [
      {
        id: '17-esim-256',
        fullName: 'iPhone 17 (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 600000, halyk: 625000, promo: 520000, cash: 500000 },
      },
      {
        id: '17-sim-256',
        fullName: 'iPhone 17 (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 600000, halyk: 625000, promo: 520000, cash: 500000 },
      },
    ],
  },

  // ==========================================
  // 5. IPHONE 17 PRO
  // ==========================================
  {
    id: 'model-ip17p',
    name: 'iPhone 17 Pro',
    category: 'apple',
    subcategory: 'iPhone 17',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.iphone,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ'],
    variants: [
      {
        id: '17-p-esim-256',
        fullName: 'iPhone 17 Pro (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 720000, halyk: 750000, promo: 624000, cash: 600000 },
      },
      {
        id: '17-p-esim-512',
        fullName: 'iPhone 17 Pro (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 864000, halyk: 900000, promo: 748000, cash: 720000 },
      },
      {
        id: '17-p-esim-1tb',
        fullName: 'iPhone 17 Pro (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 984000, halyk: 1025000, promo: 852000, cash: 820000 },
      },
      {
        id: '17-p-sim-256',
        fullName: 'iPhone 17 Pro (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 804000, halyk: 837500, promo: 697000, cash: 670000 },
      },
      {
        id: '17-p-sim-512',
        fullName: 'iPhone 17 Pro (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 960000, halyk: 1000000, promo: 832000, cash: 800000 },
      },
      {
        id: '17-p-sim-1tb',
        fullName: 'iPhone 17 Pro (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1104000, halyk: 1150000, promo: 957000, cash: 920000 },
      },
    ],
  },

  // ==========================================
  // 6. IPHONE 17 PRO MAX
  // ==========================================
  {
    id: 'model-ip17pm',
    name: 'iPhone 17 Pro Max',
    category: 'apple',
    subcategory: 'iPhone 17',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.iphone,
    simOptions: ['ESIM', 'SIM'],
    storageOptions: ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
    variants: [
      {
        id: '17-pm-esim-256',
        fullName: 'iPhone 17 Pro Max (ESIM) 256 ГБ',
        simType: 'ESIM',
        storage: '256 ГБ',
        prices: { kaspi: 780000, halyk: 812500, promo: 676000, cash: 650000 },
      },
      {
        id: '17-pm-esim-512',
        fullName: 'iPhone 17 Pro Max (ESIM) 512 ГБ',
        simType: 'ESIM',
        storage: '512 ГБ',
        prices: { kaspi: 900000, halyk: 937500, promo: 780000, cash: 750000 },
      },
      {
        id: '17-pm-esim-1tb',
        fullName: 'iPhone 17 Pro Max (ESIM) 1 ТБ',
        simType: 'ESIM',
        storage: '1 ТБ',
        prices: { kaspi: 1020000, halyk: 1062500, promo: 884000, cash: 850000 },
      },
      {
        id: '17-pm-esim-2tb',
        fullName: 'iPhone 17 Pro Max (ESIM) 2 ТБ',
        simType: 'ESIM',
        storage: '2 ТБ',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
      {
        id: '17-pm-sim-256',
        fullName: 'iPhone 17 Pro Max (SIM) 256 ГБ',
        simType: 'SIM',
        storage: '256 ГБ',
        prices: { kaspi: 840000, halyk: 875000, promo: 728000, cash: 700000 },
      },
      {
        id: '17-pm-sim-512',
        fullName: 'iPhone 17 Pro Max (SIM) 512 ГБ',
        simType: 'SIM',
        storage: '512 ГБ',
        prices: { kaspi: 984000, halyk: 1025000, promo: 853000, cash: 820000 },
      },
      {
        id: '17-pm-sim-1tb',
        fullName: 'iPhone 17 Pro Max (SIM) 1 ТБ',
        simType: 'SIM',
        storage: '1 ТБ',
        prices: { kaspi: 1104000, halyk: 1150000, promo: 957000, cash: 920000 },
      },
      {
        id: '17-pm-sim-2tb',
        fullName: 'iPhone 17 Pro Max (SIM) 2 ТБ',
        simType: 'SIM',
        storage: '2 ТБ',
        prices: { kaspi: 1224000, halyk: 1275000, promo: 1061000, cash: 1020000 },
      },
    ],
  },

  // ==========================================
  // 7. IPAD A16
  // ==========================================
  {
    id: 'model-ipad-a16',
    name: 'iPad A16',
    category: 'apple',
    subcategory: 'iPad',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.ipad,
    storageOptions: ['128 ГБ', '256 ГБ'],
    variants: [
      {
        id: 'ipad-a16-128',
        fullName: 'iPad A16 128 ГБ',
        storage: '128 ГБ',
        prices: { kaspi: 300000, halyk: 312500, promo: 260000, cash: 250000 },
      },
      {
        id: 'ipad-a16-256',
        fullName: 'iPad A16 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 360000, halyk: 375000, promo: 312000, cash: 300000 },
      },
    ],
  },

  // ==========================================
  // 8. IPAD AIR 11 M4 (2026)
  // ==========================================
  {
    id: 'model-ipad-air-m4',
    name: 'iPad Air 11 M4 (2026)',
    category: 'apple',
    subcategory: 'iPad',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.ipad,
    storageOptions: ['128 ГБ', '256 ГБ'],
    variants: [
      {
        id: 'ipad-air11-m4-128',
        fullName: 'iPad Air 11 M4 (2026) 128 ГБ',
        storage: '128 ГБ',
        prices: { kaspi: 480000, halyk: 500000, promo: 416000, cash: 400000 },
      },
      {
        id: 'ipad-air11-m4-256',
        fullName: 'iPad Air 11 M4 (2026) 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 540000, halyk: 562500, promo: 468000, cash: 450000 },
      },
    ],
  },

  // ==========================================
  // 9. MACBOOK NEO 13
  // ==========================================
  {
    id: 'model-mb-neo13',
    name: 'MacBook Neo 13',
    category: 'apple',
    subcategory: 'MacBook',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.macbook,
    storageOptions: ['256 ГБ', '512 ГБ'],
    variants: [
      {
        id: 'mb-neo13-256',
        fullName: 'MacBook Neo 13 256 ГБ',
        storage: '256 ГБ',
        prices: { kaspi: 480000, halyk: 500000, promo: 416000, cash: 400000 },
      },
      {
        id: 'mb-neo13-512',
        fullName: 'MacBook Neo 13 512 ГБ',
        storage: '512 ГБ',
        prices: { kaspi: 540000, halyk: 562500, promo: 468000, cash: 450000 },
      },
    ],
  },

  // ==========================================
  // 10. MACBOOK AIR 13 M5 (2026)
  // ==========================================
  {
    id: 'model-mb-air13-m5',
    name: 'MacBook Air 13 M5 (2026)',
    category: 'apple',
    subcategory: 'MacBook',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.macbook,
    storageOptions: ['512 ГБ'],
    variants: [
      {
        id: 'mb-air13-m5-512',
        fullName: 'MacBook Air 13 M5 (2026) 512 ГБ',
        storage: '512 ГБ',
        prices: { kaspi: 876000, halyk: 912500, promo: 760000, cash: 730000 },
      },
    ],
  },

  // ==========================================
  // 11. AIRPODS 4 (БАЗОВЫЙ)
  // ==========================================
  {
    id: 'model-airpods-4',
    name: 'AirPods 4 (базовый)',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.airpods,
    variants: [
      {
        id: 'airpods-4-base',
        fullName: 'AirPods 4 (базовый)',
        prices: { kaspi: 72000, halyk: 75000, promo: 63000, cash: 60000 },
      },
    ],
  },

  // ==========================================
  // 12. AIRPODS 5
  // ==========================================
  {
    id: 'model-airpods-5',
    name: 'AirPods 5',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.airpods,
    variants: [
      {
        id: 'airpods-5',
        fullName: 'AirPods 5',
        prices: { kaspi: 102000, halyk: 106250, promo: 88000, cash: 85000 },
      },
    ],
  },

  // ==========================================
  // 13. AIRPODS 5 С БЕСПРОВОДНОЙ ЗАРЯДКОЙ
  // ==========================================
  {
    id: 'model-airpods-5-wireless',
    name: 'AirPods 5 с беспроводной зарядкой',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.airpods,
    variants: [
      {
        id: 'airpods-5-wireless',
        fullName: 'AirPods 5 с беспроводной зарядкой',
        prices: { kaspi: 120000, halyk: 125000, promo: 104000, cash: 100000 },
      },
    ],
  },

  // ==========================================
  // 14. AIRPODS PRO
  // ==========================================
  {
    id: 'model-airpods-pro',
    name: 'AirPods Pro',
    category: 'apple',
    subcategory: 'AirPods',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.airpods,
    variants: [
      {
        id: 'airpods-pro',
        fullName: 'AirPods Pro',
        prices: { kaspi: 140400, halyk: 146250, promo: 120000, cash: 117000 },
      },
    ],
  },

  // ==========================================
  // 15. APPLE WATCH SERIES 11
  // ==========================================
  {
    id: 'model-aw-11',
    name: 'Apple Watch Series 11',
    category: 'apple',
    subcategory: 'Apple Watch',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.watch,
    sizeOptions: ['42 мм', '46 мм'],
    variants: [
      {
        id: 'aw-11-42',
        fullName: 'Apple Watch Series 11 (42 мм)',
        size: '42 мм',
        prices: { kaspi: 210000, halyk: 218750, promo: 182000, cash: 175000 },
      },
      {
        id: 'aw-11-46',
        fullName: 'Apple Watch Series 11 (46 мм)',
        size: '46 мм',
        prices: { kaspi: 240000, halyk: 250000, promo: 208000, cash: 200000 },
      },
    ],
  },

  // ==========================================
  // 16. APPLE WATCH SE
  // ==========================================
  {
    id: 'model-aw-se',
    name: 'Apple Watch SE',
    category: 'apple',
    subcategory: 'Apple Watch',
    warranty: '1 год официальной гарантии',
    image: PRODUCT_IMAGES.watch,
    sizeOptions: ['40 мм', '44 мм'],
    variants: [
      {
        id: 'aw-se-40',
        fullName: 'Apple Watch SE (40 мм)',
        size: '40 мм',
        prices: { kaspi: 168000, halyk: 175000, promo: 146000, cash: 140000 },
      },
      {
        id: 'aw-se-44',
        fullName: 'Apple Watch SE (44 мм)',
        size: '44 мм',
        prices: { kaspi: 192000, halyk: 200000, promo: 167000, cash: 160000 },
      },
    ],
  },

  // ==========================================
  // 17. DYSON AIRSTRAIT
  // ==========================================
  {
    id: 'model-dyson-airstrait',
    name: 'Dyson Airstrait',
    category: 'dyson',
    subcategory: 'Airstrait',
    warranty: '2 года гарантии',
    image: PRODUCT_IMAGES.dyson,
    variants: [
      {
        id: 'dyson-airstrait',
        fullName: 'Dyson Airstrait',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 18. DYSON AIRWRAP HS08
  // ==========================================
  {
    id: 'model-dyson-hs08',
    name: 'Dyson HS08 Airwrap Ceramic Pink',
    category: 'dyson',
    subcategory: 'Airwrap HS08',
    warranty: '2 года гарантии',
    image: PRODUCT_IMAGES.dyson,
    variants: [
      {
        id: 'dyson-hs08',
        fullName: 'Dyson HS08 Airwrap Ceramic Pink',
        prices: { kaspi: 315000, halyk: 328000, promo: 275000, cash: 265000 },
      },
    ],
  },

  // ==========================================
  // 19. DYSON AIRWRAP HS09
  // ==========================================
  {
    id: 'model-dyson-hs09',
    name: 'Dyson Airwrap HS09',
    category: 'dyson',
    subcategory: 'Airwrap HS09',
    warranty: '2 года гарантии',
    image: PRODUCT_IMAGES.dyson,
    variants: [
      {
        id: 'dyson-hs09',
        fullName: 'Dyson Airwrap HS09',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 20. ФОТОАППАРАТЫ CANON
  // ==========================================
  {
    id: 'model-canon',
    name: 'Фотоаппараты Canon',
    category: 'other',
    subcategory: 'Фотокамеры',
    warranty: 'Официальная гарантия',
    image: PRODUCT_IMAGES.canon,
    variants: [
      {
        id: 'canon-camera',
        fullName: 'Фотоаппарат Canon EOS',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 21. SONY ZV-E10
  // ==========================================
  {
    id: 'model-sony-zve10',
    name: 'Sony ZV-E10',
    category: 'other',
    subcategory: 'Фотокамеры',
    warranty: 'Официальная гарантия',
    image: PRODUCT_IMAGES.sony,
    variants: [
      {
        id: 'sony-zve10',
        fullName: 'Sony ZV-E10 Mirrorless',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 22. RAY-BAN META
  // ==========================================
  {
    id: 'model-rayban-meta',
    name: 'Умные очки Ray-Ban Meta',
    category: 'other',
    subcategory: 'Умные гаджеты',
    warranty: 'Официальная гарантия',
    image: PRODUCT_IMAGES.rayban,
    variants: [
      {
        id: 'rayban-meta',
        fullName: 'Умные очки Ray-Ban Meta Smart Glasses',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 23. КВАДРОКОПТЕРЫ DJI
  // ==========================================
  {
    id: 'model-dji',
    name: 'Квадрокоптеры и стедикамы DJI',
    category: 'other',
    subcategory: 'DJI',
    warranty: 'Официальная гарантия',
    image: PRODUCT_IMAGES.dji,
    variants: [
      {
        id: 'dji-drone',
        fullName: 'Квадрокоптер DJI Mavic / Mini',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },

  // ==========================================
  // 24. ЯНДЕКС СТАНЦИЯ
  // ==========================================
  {
    id: 'model-yandex-station',
    name: 'Яндекс Станция',
    category: 'other',
    subcategory: 'Умный дом',
    warranty: 'Официальная гарантия',
    image: PRODUCT_IMAGES.yandex,
    variants: [
      {
        id: 'yandex-station',
        fullName: 'Умная колонка Яндекс Станция с Алисой',
        prices: { kaspi: null, halyk: null, promo: null, cash: null },
      },
    ],
  },
];

// ХЕЛПЕРЫ ФОРМАТИРОВАНИЯ
export const formatPrice = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return '';
  return val.toLocaleString('ru-RU').replace(/\u00a0/g, ' ') + '\u00A0₸';
};
