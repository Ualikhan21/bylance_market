/**
 * ============================================================================
 * 📱 BYLANCE — ДАННЫЕ ИНТЕРНЕТ-МАГАЗИНА ЭЛЕКТРОНИКИ
 * ============================================================================
 * Модели с выбором памяти и SIM, 4 способа оплаты, полный каталог.
 */
import { PRODUCT_IMAGES, WEBP_IMAGES } from './productImages';

export interface StoreAddress {
  id: string;
  title: string;
  address: string;
  description: string;
  hours: string;
  isMain: boolean;
  badge: string;
  gis: string;
}

// 1. КОНТАКТЫ МАГАЗИНА (ДВА АДРЕСА: ГЛАВНЫЙ И ВТОРОЙ ФИЛИАЛ)
export const SITE_INFO = {
  shopName: "Bylance",
  city: "Алматы",
  logoPath: "/logo.svg",
  whatsapp: "77765293916",
  whatsappFormatted: "+7 (776) 529-39-16",
  telegram: "bylance",
  gis: "https://2gis.kz/almaty",
  // Магазин новой техники
  address: "г. Алматы, пр. Абылай хана, 113",
  addressMain: "г. Алматы, пр. Абылай хана, 113",
  // Магазин Б/У техники и Trade-In
  addressSecond: "г. Алматы, пр. Абылай хана (ориентир уточняйте в WhatsApp)",
  addresses: [
    {
      id: 'new-store',
      title: 'Магазин новой техники',
      address: 'г. Алматы, пр. Абылай хана, 113',
      description: 'Магазин новой запечатанной техники: оригинальные устройства Apple, стайлеры Dyson и гаджеты с официальной гарантией 1–2 года и рассрочкой.',
      hours: 'Ежедневно 10:00–20:00',
      isMain: false,
      badge: 'Новая техника',
      gis: 'https://2gis.kz/almaty',
    },
    {
      id: 'used-store',
      title: 'Магазин Б/У техники и Trade-In',
      address: 'г. Алматы, пр. Абылай хана',
      description: 'Магазин проверенной Б/У техники и центр Trade-In: быстрая диагностика при вас, честный выкуп за наличные/Kaspi и выгодный обмен с доплатой.',
      hours: 'Ежедневно 10:00–20:00',
      isMain: false,
      badge: 'Б/У и Trade-In',
      gis: 'https://2gis.kz/almaty',
    },
  ] as StoreAddress[],
  hours: "Ежедневно 10:00–20:00",
  roundTo: 1000,
  founder: {
    name: "Аружан Жеткерген",
    role: "Основательница магазина Bylance",
    image: "/aruzhan.jpg",
    instagram: "zaagaru",
    tiktok: "_zaag_",
    shopInstagram: "bylance_kz",
  },
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
  { id: 'apple', name: 'Apple', description: 'iPhone, iPad, MacBook, AirPods, Apple Watch' },
  { id: 'dyson', name: 'Dyson', description: 'Стайлеры и выпрямители волос' },
  { id: 'other', name: 'Фото и гаджеты', description: 'Фотокамеры, Ray-Ban Meta, DJI, Яндекс Станция' },
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

// ЦВЕТ ТОВАРА (с мини-картинкой и плашкой)
export interface ProductColor {
  id: string;
  name: string;
  image: string;
  hex?: string;
}

// ГОТОВЫЕ ЦВЕТОВЫЕ НАБОРЫ (пользователь может менять картинки на свои в любое время)
// ГОТОВЫЕ ЦВЕТОВЫЕ НАБОРЫ С ПОДДЕРЖКОЙ WEBP ИЗОБРАЖЕНИЙ
export const IPHONE_18_PRO_COLORS: ProductColor[] = [
  { id: 'black', name: 'Black Titanium (Чёрный)', hex: '#212124', image: WEBP_IMAGES.iphone18ProBlack },
  { id: 'blue', name: 'Deep Blue (Тёмно-синий)', hex: '#27384e', image: WEBP_IMAGES.iphone18ProBlue },
  { id: 'red', name: 'Crimson Red (Красный титан)', hex: '#7a0f2d', image: WEBP_IMAGES.iphone18ProRed },
  { id: 'silver', name: 'Silver Titanium (Серебристый)', hex: '#e3e4e6', image: WEBP_IMAGES.iphone18ProSilver },
];

export const IPHONE_17_COLORS: ProductColor[] = [
  { id: 'black', name: 'Black (Чёрный)', hex: '#222326', image: WEBP_IMAGES.iphone17Black },
  { id: 'blue', name: 'Blue (Синий)', hex: '#3d6389', image: WEBP_IMAGES.iphone17Blue },
  { id: 'green', name: 'Green (Мятно-зелёный)', hex: '#5b8e78', image: WEBP_IMAGES.iphone17Green },
  { id: 'purple', name: 'Purple (Лавандовый)', hex: '#9d8db9', image: WEBP_IMAGES.iphone17Purple },
  { id: 'white', name: 'White (Белый)', hex: '#f7f7f9', image: WEBP_IMAGES.iphone17White },
];

export const IPHONE_17_PRO_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Dark Blue (Синий титан)', hex: '#24374e', image: WEBP_IMAGES.iphone17ProBlue },
  { id: 'orange', name: 'Cosmic Orange (Оранжевый)', hex: '#d96c34', image: WEBP_IMAGES.iphone17ProOrange },
  { id: 'white', name: 'White Titanium (Белый титан)', hex: '#f2f2f4', image: WEBP_IMAGES.iphone17ProWhite },
];

export const IPHONE_A16_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Blue (Синий)', hex: '#3f6795', image: WEBP_IMAGES.iphoneA16Blue },
  { id: 'lightblue', name: 'Light Blue (Голубой)', hex: '#97bfdf', image: WEBP_IMAGES.iphoneA16LightBlue },
  { id: 'pink', name: 'Pink (Розовый)', hex: '#e7a9b6', image: WEBP_IMAGES.iphoneA16Pink },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e2e3e5', image: WEBP_IMAGES.iphoneA16Silver },
  { id: 'yellow', name: 'Yellow (Лимонный)', hex: '#edd362', image: WEBP_IMAGES.iphoneA16Yellow },
];

export const IPHONE_DUO_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Deep Blue (Глубокий синий)', hex: '#1e324f', image: WEBP_IMAGES.iphoneDuoBlue },
  { id: 'white', name: 'Pure White (Белоснежный)', hex: '#ffffff', image: WEBP_IMAGES.iphoneDuoWhite },
];

export const IPAD_AIR_M4_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Blue (Синий)', hex: '#899ab0', image: WEBP_IMAGES.ipadAirBlue },
  { id: 'purple', name: 'Purple (Фиолетовый)', hex: '#b8b1ca', image: WEBP_IMAGES.ipadAirPurple },
  { id: 'space-gray', name: 'Space Gray (Серый космос)', hex: '#6e6f73', image: WEBP_IMAGES.ipadAirSpaceGray },
  { id: 'starlight', name: 'Starlight (Сияющая звезда)', hex: '#e5e0d8', image: WEBP_IMAGES.ipadAirStarlight },
];

export const MACBOOK_AIR_M5_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Midnight Blue (Тёмно-синий)', hex: '#263445', image: WEBP_IMAGES.macbookAirBlue },
  { id: 'golden', name: 'Starlight Gold (Золотистый)', hex: '#e9dfcc', image: WEBP_IMAGES.macbookAirGolden },
  { id: 'lightblue', name: 'Sky Blue (Небесный)', hex: '#b0c5da', image: WEBP_IMAGES.macbookAirLightBlue },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e2e3e5', image: WEBP_IMAGES.macbookAirSilver },
];

export const MACBOOK_NEO_COLORS: ProductColor[] = [
  { id: 'blue', name: 'Neo Blue (Нео-синий)', hex: '#314a6b', image: WEBP_IMAGES.macbookNeoBlue },
  { id: 'pink', name: 'Neo Pink (Нео-розовый)', hex: '#df9fae', image: WEBP_IMAGES.macbookNeoPink },
  { id: 'silver', name: 'Neo Silver (Серебристый)', hex: '#e1e2e4', image: WEBP_IMAGES.macbookNeoSilver },
  { id: 'yellow', name: 'Neo Yellow (Солнечный)', hex: '#e8cd5e', image: WEBP_IMAGES.macbookNeoYellow },
];

export const WATCH_11_COLORS: ProductColor[] = [
  { id: 'black', name: 'Jet Black (Глянцевый чёрный)', hex: '#1a1a1a', image: WEBP_IMAGES.watch11Black },
  { id: 'grey', name: 'Space Grey (Космический серый)', hex: '#58595b', image: WEBP_IMAGES.watch11Grey },
  { id: 'pink', name: 'Rose Pink (Розовый)', hex: '#e8b8b8', image: WEBP_IMAGES.watch11Pink },
  { id: 'silver', name: 'Silver (Серебристый)', hex: '#e2e3e5', image: WEBP_IMAGES.watch11Silver },
];

export const WATCH_SE_COLORS: ProductColor[] = [
  { id: 'black', name: 'Midnight Black (Тёмная ночь)', hex: '#1f2022', image: WEBP_IMAGES.watchSe40Black },
  { id: 'golden', name: 'Starlight Gold (Сияющая звезда)', hex: '#e6ded3', image: WEBP_IMAGES.watchSe40Golden },
];

export const IPHONE_PRO_COLORS: ProductColor[] = IPHONE_18_PRO_COLORS;
export const IPHONE_BASE_COLORS: ProductColor[] = IPHONE_17_COLORS;
export const IPAD_COLORS: ProductColor[] = IPAD_AIR_M4_COLORS;
export const MACBOOK_COLORS: ProductColor[] = MACBOOK_AIR_M5_COLORS;
export const WATCH_COLORS: ProductColor[] = WATCH_11_COLORS;

export const DYSON_COLORS: ProductColor[] = [
  { id: 'ceramic-pink', name: 'Ceramic Pink (Керамический розовый)', hex: '#dfa8a8', image: PRODUCT_IMAGES.dyson },
  { id: 'strawberry-bronze', name: 'Strawberry Bronze (Клубничная бронза)', hex: '#c9826f', image: PRODUCT_IMAGES.dyson },
  { id: 'nickel-copper', name: 'Nickel / Copper (Никель и медь)', hex: '#907f76', image: PRODUCT_IMAGES.dyson },
  { id: 'prussian-blue', name: 'Prussian Blue (Синий индиго)', hex: '#26384a', image: PRODUCT_IMAGES.dyson },
];

// МОДЕЛЬ ТОВАРА (ГРУППА С ВЫБОРОМ ПАМЯТИ/SIM/ЦВЕТА)
export interface ProductModel {
  id: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  badge?: string; // Никакого "Топ продаж" над телефонами!
  warranty: string;
  image: string;
  colorOptions?: ProductColor[];
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
    image: WEBP_IMAGES.iphone18Pro,
    colorOptions: IPHONE_18_PRO_COLORS,
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
    image: WEBP_IMAGES.iphone18Pro,
    colorOptions: IPHONE_18_PRO_COLORS,
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
    image: WEBP_IMAGES.iphoneDuoBlue,
    colorOptions: IPHONE_DUO_COLORS,
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
    image: WEBP_IMAGES.iphone17Black,
    colorOptions: IPHONE_17_COLORS,
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
    image: WEBP_IMAGES.iphone17ProBlue,
    colorOptions: IPHONE_17_PRO_COLORS,
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
    image: WEBP_IMAGES.iphone17ProBlue,
    colorOptions: IPHONE_17_PRO_COLORS,
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
    image: WEBP_IMAGES.iphoneA16Blue,
    colorOptions: IPHONE_A16_COLORS,
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
    image: WEBP_IMAGES.ipadAirSpaceGray,
    colorOptions: IPAD_AIR_M4_COLORS,
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
    image: WEBP_IMAGES.macbookNeoSilver,
    colorOptions: MACBOOK_NEO_COLORS,
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
    image: WEBP_IMAGES.macbookAirSilver,
    colorOptions: MACBOOK_AIR_M5_COLORS,
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
    image: WEBP_IMAGES.watch11Black,
    colorOptions: WATCH_11_COLORS,
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
    image: WEBP_IMAGES.watchSe40Black,
    colorOptions: WATCH_SE_COLORS,
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
    colorOptions: DYSON_COLORS,
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
    colorOptions: DYSON_COLORS,
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
    colorOptions: DYSON_COLORS,
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

export const formatStorage = (gb: number): string =>
  gb >= 1024 ? `${gb / 1024} ТБ` : `${gb} ГБ`;

// ============================================================================
// ⭐️ ДАННЫЕ ОЦЕНКИ И ВЫКУПА Б/У IPHONE (ИЗ BYLANCE_VALUATION)
// ============================================================================
export interface UsedGeneration {
  gen: string;
  models: {
    label: string;
    name: string;
    prices: Record<number, number>;
  }[];
}

export const USED_IPHONES_BUYBACK: UsedGeneration[] = [
  {
    gen: "18",
    models: [
      { label: "Обычный", name: "iPhone 18", prices: { 128: 360000, 256: 410000, 512: 480000 } },
      { label: "Air", name: "iPhone Air", prices: { 256: 410000, 512: 490000, 1024: 560000 } },
      { label: "Pro", name: "iPhone 18 Pro", prices: { 256: 520000, 512: 600000, 1024: 680000 } },
      { label: "Pro Max", name: "iPhone 18 Pro Max", prices: { 256: 600000, 512: 690000, 1024: 780000 } },
    ],
  },
  {
    gen: "17",
    models: [
      { label: "Обычный", name: "iPhone 17", prices: { 128: 280000, 256: 330000, 512: 400000 } },
      { label: "Air", name: "iPhone Air", prices: { 256: 330000, 512: 390000, 1024: 450000 } },
      { label: "Pro", name: "iPhone 17 Pro", prices: { 256: 450000, 512: 520000, 1024: 600000 } },
      { label: "Pro Max", name: "iPhone 17 Pro Max", prices: { 256: 520000, 512: 600000, 1024: 680000 } },
    ],
  },
  {
    gen: "16",
    models: [
      { label: "16e", name: "iPhone 16e", prices: { 128: 170000, 256: 200000, 512: 240000 } },
      { label: "Обычный", name: "iPhone 16", prices: { 128: 190000, 256: 225000, 512: 270000 } },
      { label: "Plus", name: "iPhone 16 Plus", prices: { 128: 210000, 256: 250000, 512: 300000 } },
      { label: "Pro", name: "iPhone 16 Pro", prices: { 128: 290000, 256: 330000, 512: 390000, 1024: 450000 } },
      { label: "Pro Max", name: "iPhone 16 Pro Max", prices: { 256: 400000, 512: 460000, 1024: 520000 } },
    ],
  },
  {
    gen: "15",
    models: [
      { label: "Обычный", name: "iPhone 15", prices: { 128: 155000, 256: 185000, 512: 225000 } },
      { label: "Plus", name: "iPhone 15 Plus", prices: { 128: 175000, 256: 205000, 512: 245000 } },
      { label: "Pro", name: "iPhone 15 Pro", prices: { 128: 230000, 256: 265000, 512: 310000, 1024: 360000 } },
      { label: "Pro Max", name: "iPhone 15 Pro Max", prices: { 256: 330000, 512: 380000, 1024: 430000 } },
    ],
  },
  {
    gen: "14",
    models: [
      { label: "Обычный", name: "iPhone 14", prices: { 128: 115000, 256: 135000, 512: 165000 } },
      { label: "Plus", name: "iPhone 14 Plus", prices: { 128: 130000, 256: 150000, 512: 180000 } },
      { label: "Pro", name: "iPhone 14 Pro", prices: { 128: 190000, 256: 215000, 512: 250000, 1024: 285000 } },
      { label: "Pro Max", name: "iPhone 14 Pro Max", prices: { 128: 230000, 256: 255000, 512: 295000, 1024: 335000 } },
    ],
  },
  {
    gen: "13",
    models: [
      { label: "mini", name: "iPhone 13 mini", prices: { 128: 85000, 256: 100000, 512: 120000 } },
      { label: "Обычный", name: "iPhone 13", prices: { 128: 100000, 256: 118000, 512: 140000 } },
      { label: "Pro", name: "iPhone 13 Pro", prices: { 128: 145000, 256: 165000, 512: 190000, 1024: 215000 } },
      { label: "Pro Max", name: "iPhone 13 Pro Max", prices: { 128: 175000, 256: 195000, 512: 225000, 1024: 255000 } },
    ],
  },
  {
    gen: "12",
    models: [
      { label: "mini", name: "iPhone 12 mini", prices: { 64: 55000, 128: 65000, 256: 75000 } },
      { label: "Обычный", name: "iPhone 12", prices: { 64: 70000, 128: 80000, 256: 92000 } },
      { label: "Pro", name: "iPhone 12 Pro", prices: { 128: 105000, 256: 118000, 512: 138000 } },
      { label: "Pro Max", name: "iPhone 12 Pro Max", prices: { 128: 125000, 256: 140000, 512: 160000 } },
    ],
  },
  {
    gen: "11",
    models: [
      { label: "Обычный", name: "iPhone 11", prices: { 64: 55000, 128: 62000, 256: 72000 } },
      { label: "Pro", name: "iPhone 11 Pro", prices: { 64: 75000, 256: 90000, 512: 105000 } },
      { label: "Pro Max", name: "iPhone 11 Pro Max", prices: { 64: 90000, 256: 105000, 512: 120000 } },
    ],
  },
  {
    gen: "X",
    models: [
      { label: "X", name: "iPhone X", prices: { 64: 45000, 256: 55000 } },
      { label: "XR", name: "iPhone XR", prices: { 64: 55000, 128: 62000, 256: 70000 } },
      { label: "XS", name: "iPhone XS", prices: { 64: 55000, 256: 65000, 512: 75000 } },
      { label: "XS Max", name: "iPhone XS Max", prices: { 64: 65000, 256: 75000, 512: 85000 } },
    ],
  },
];

export const BATTERY_RULES = [
  { min: 90, cut: 0 },
  { min: 85, cut: 3 },
  { min: 80, cut: 7 },
  { min: 75, cut: 12 },
  { min: 0, cut: 18 },
];

export const BATTERY_PRESETS = [75, 80, 85, 90, 100];

export interface BodyOption {
  id: string;
  label: string;
  hint: string;
  color: string;
  cut: number;
}

export const BODY_CONDITIONS: BodyOption[] = [
  {
    id: "perfect",
    label: "Идеальное",
    hint: "Как новый, без следов",
    color: "#38bdf8",
    cut: 0,
  },
  {
    id: "good",
    label: "Хорошее",
    hint: "Еле заметные потёртости",
    color: "#34d399",
    cut: 5,
  },
  {
    id: "average",
    label: "Среднее",
    hint: "Мелкие царапины",
    color: "#fbbf24",
    cut: 12,
  },
  {
    id: "poor",
    label: "Плохое",
    hint: "Заметные царапины, вмятины",
    color: "#f87171",
    cut: 22,
  },
];

export interface ExtraDefect {
  id: string;
  label: string;
  cut: number;
  isEsimOnly?: boolean;
}

export const getEsimDeduction = (modelName: string): number => {
  if (modelName.toLowerCase().includes('pro')) {
    return 40000;
  }
  return 30000;
};

export const EXTRAS_OPTIONS: ExtraDefect[] = [
  { id: "esim_only", label: "Только eSIM (США)", cut: 0, isEsimOnly: true },
  { id: "no_box", label: "Нет коробки и зарядки", cut: 3 },
  { id: "broken_biometrics", label: "Не работает Face ID / Touch ID", cut: 15 },
  { id: "replaced_glass", label: "Менялось заднее стекло", cut: 5 },
  { id: "replaced_screen_orig", label: "Менялся экран (оригинал)", cut: 5 },
  { id: "replaced_screen", label: "Менялся экран (неоригинал)", cut: 10 },
];

export const BLOCKED_REASON = "Заблокирован iCloud / чужой Apple ID";

