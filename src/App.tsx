import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Check,
  MapPin,
  MessageCircle,
  Send,
  Sun,
  Moon,
  Search,
  X,
  ShieldCheck,
  Copy,
  ChevronRight,
  ChevronDown,
  Filter,
  Menu,
  Zap,
  ExternalLink,
  Loader2,
  RefreshCw,
  Sparkles,
  Battery,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import {
  SITE_INFO,
  PAYMENT_METHODS,
  PaymentMethodId,
  CATEGORIES,
  MainCategory,
  ProductModel,
  ProductVariant,
  ProductColor,
  PRODUCT_MODELS,
  formatPrice,
  formatStorage,
  USED_IPHONES_BUYBACK,
  BATTERY_RULES,
  BATTERY_PRESETS,
  BODY_CONDITIONS,
  EXTRAS_OPTIONS,
  BLOCKED_REASON,
  getEsimDeduction,
  UsedGeneration,
  BodyOption
} from './data/prices';
import { KaspiIcon, HalykIcon, PaymentMethodIcon } from './components/PaymentIcons';

// Cart Item interface: stores specific variant + chosen payment method + color
interface CartItem {
  variantId: string;
  modelId: string;
  modelName: string;
  fullName: string;
  image: string;
  colorName?: string;
  paymentMethod: PaymentMethodId;
  quantity: number;
  prices: ProductVariant['prices'];
}

// Reusable product image component with animated skeleton, loading spinner circle, and smooth fade-in
interface ProductImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  size?: 'normal' | 'thumb';
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  containerClassName = '',
  size = 'normal'
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setHasError(false);
  }, [src]);

  const roundedCls = size === 'thumb' ? 'rounded-lg' : 'rounded-2xl';

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-white ${roundedCls} ${containerClassName}`}>
      {/* Loading Skeleton & Spinner Indicator */}
      {!loaded && !hasError && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white animate-pulse z-10 transition-opacity duration-200 ${roundedCls}`}>
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Loader2 className={`${size === 'thumb' ? 'w-4 h-4 text-[#7a0f2d]' : 'w-6 h-6 text-[#7a0f2d]'} animate-spin`} />
          </div>
        </div>
      )}

      {/* Fallback in case of broken link */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-2 text-center">
          <span className="text-xl">📱</span>
          <span className="text-[10px] mt-1 line-clamp-1">{alt}</span>
        </div>
      ) : (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`${className} ${roundedCls} transition-all duration-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        />
      )}
    </div>
  );
};

// FAQ item interface
interface FaqItem {
  id: string;
  question: string;
  answer: string;
  hasTradeInLinks?: boolean;
  hasTelegramLink?: boolean;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-trade-in',
    question: 'Как работает программа Trade-In и какие устройства принимаются?',
    answer: 'В магазине Bylance по программе Trade-In принимаются исключительно оригинальные Apple iPhone!\n\n• Оценка в магазине: точную и итоговую оценку состояния телефона (экран, корпус, True Tone, Face ID, процент износа АКБ) делает наш специалист лично в магазине в Алматы (пр. Абылай хана, 113).\n• Онлайн-оценка через сайт: вы также можете предварительно попробовать рассчитать стоимость вашего iPhone онлайн через форму оценки на сайте (ссылка ниже) либо отправив фото и характеристики в WhatsApp.\n• Доплата: остаток стоимости любого нового устройства вы можете доплатить наличными с максимальной скидкой или оформить в рассрочку Kaspi / Halyk (0-0-12 / 0-0-24).\n\nВсе проверенные б/у iPhone, принятые по Trade-In, с реальными фото и процентом АКБ публикуются в нашем официальном Telegram-канале.',
    hasTradeInLinks: true,
  },
  {
    id: 'faq-1',
    question: 'Как работает рассрочка Kaspi и Halyk (0-0-12 / 0-0-24)?',
    answer: 'Оформление происходит через приложения Kaspi.kz и Halyk Bank на 3, 6, 12 или 24 месяца без процентов и скрытых переплат. Заявку можно оформить удаленно через менеджера в WhatsApp либо при личном визите в наш магазин в Алматы.'
  },
  {
    id: 'faq-2',
    question: 'Все ли товары в магазине новые и оригинальные?',
    answer: 'Да, 100% техники в этом каталоге — исключительно новые оригинальные запечатанные устройства в заводской упаковке. На всю технику Apple действует официальная гарантия 1 год, на Dyson — 2 года гарантии.'
  },
  {
    id: 'faq-3',
    question: 'В чем преимущество скидки за наличную оплату?',
    answer: 'При оплате наличными или прямым переводом на карту отсутствуют банковские эквайринговые комиссии за рассрочку, поэтому мы предоставляем максимальную скидку от базовой цены (колонка «Скидка за наличную оплату»).'
  },
  {
    id: 'faq-4',
    question: 'Можно ли выбрать разные способы оплаты для разных товаров в одном заказе?',
    answer: 'Да! Вы можете прямо в корзине или в карточке товара назначить для каждого устройства свой способ оплаты — например, один телефон оформить в Kaspi рассрочку, а второй оплатить со скидкой за наличные.'
  },
  {
    id: 'faq-5',
    question: 'Как быстро оформить заказ через WhatsApp?',
    answer: 'Вы можете нажать кнопку «Заказать сразу в WhatsApp» на карточке любого товара для мгновенного заказа в 1 клик, либо набрать корзину и отправить общий заказ. Менеджер мгновенно получит готовую спецификацию и подтвердит бронь.'
  },
  {
    id: 'faq-6',
    question: 'Где находится магазин и можно ли забрать самовывозом?',
    answer: 'Наш магазин расположен в г. Алматы на проспекте Абылай хана, 113. Вы можете приехать к нам лично, вскрыть и проверить запечатанную коробку, активировать устройство на месте и оплатить удобным способом.'
  },
  {
    id: 'faq-7',
    question: 'Где посмотреть каталог проверенной Б/У техники по Trade-In?',
    answer: 'Вся проверенная Б/У техника и устройства, принятые по программе Trade-In, выкладываются исключительно в нашем Telegram-канале с подробными живыми фотографиями, процентом АКБ и актуальными ценами.',
    hasTelegramLink: true,
  }
];

const VALUATION_FAQ_LIST: FaqItem[] = [
  {
    id: 'vfaq-1',
    question: 'Какие модели iPhone вы принимаете на выкуп и в Trade-In?',
    answer: 'Мы принимаем оригинальные Apple iPhone от iPhone X, XR, XS до iPhone 16 Pro Max. Устройство не должно иметь чужого Apple ID (Activation Lock), блокировки оператора или пароля на экране.',
  },
  {
    id: 'vfaq-2',
    question: 'Как и где проходит диагностика и выплата денег?',
    answer: 'Вы приезжаете в наш магазин в Алматы (пр. Абылай хана, 113). Мастер при вас за 5–10 минут проверяет функции (дисплей, True Tone, Face ID, камеры, АКБ). Деньги выплачиваются моментально на месте: наличными или переводом на Kaspi Gold.',
  },
  {
    id: 'vfaq-3',
    question: 'Как использовать сумму выкупа для покупки нового телефона (Trade-In)?',
    answer: 'Сумма предварительной оценки сразу вычитается из стоимости любого нового устройства из нашего каталога (Apple, Dyson, фототехника). Оставшуюся разницу вы можете доплатить наличными или оформить в рассрочку Kaspi / Halyk (0-0-12 / 0-0-24).',
  },
  {
    id: 'vfaq-4',
    question: 'Принимаются ли устройства с замененными экранами или АКБ?',
    answer: 'Да! В шаге 6 просто укажите «Менялся дисплей» или «Менялся аккумулятор». Калькулятор автоматически пересчитает честную стоимость.',
  },
  {
    id: 'vfaq-5',
    question: 'Обязательно ли иметь коробку и комплект?',
    answer: 'Комплект необязателен. Но если у вас сохранилась оригинальная коробка, мы начислим дополнительный бонус (отметьте пункт «Есть оригинальная коробка» в шаге 6).',
  },
];

export default function App() {
  // 1. THEME STATE (SYSTEM-AWARE BY DEFAULT + MANUAL TOGGLE)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      // If phone/device is set to dark mode, immediately render in dark mode!
      if (prefersDark) return true;
      const manual = localStorage.getItem('bylance_manual_theme');
      if (manual === 'dark') return true;
      if (manual === 'light') return false;
      return false;
    }
    return false;
  });

  // Real-time synchronization with OS system dark/light mode
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Whenever system theme toggles on phone/OS, immediately update!
      setIsDark(e.matches);
      localStorage.removeItem('bylance_manual_theme');
    };

    mql.addEventListener('change', handleSystemChange);
    return () => mql.removeEventListener('change', handleSystemChange);
  }, []);

  // Sync DOM with isDark
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Handler for toggle button
  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('bylance_manual_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // 2. GLOBAL PAYMENT METHOD
  const [globalPayment, setGlobalPayment] = useState<PaymentMethodId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bylance_payment_method') as PaymentMethodId;
      if (saved && ['kaspi', 'halyk', 'promo', 'cash'].includes(saved)) {
        return saved;
      }
    }
    return 'promo'; // default: Акционная цена
  });

  const handleSelectGlobalPayment = useCallback((method: PaymentMethodId) => {
    setGlobalPayment(method);
    localStorage.setItem('bylance_payment_method', method);
  }, []);

  // Per-card selections: modelId -> { colorId?, simType?, storage?, size?, paymentMethod? }
  const [cardSelections, setCardSelections] = useState<Record<string, {
    colorId?: string;
    simType?: 'ESIM' | 'SIM';
    storage?: string;
    size?: string;
    paymentMethod?: PaymentMethodId;
  }>>({});

  // ---------------------------------------------------------------------------
  // ⭐️ IPHONE VALUATION & TRADE-IN CALCULATOR (FROM BYLANCE_VALUATION)
  // ---------------------------------------------------------------------------
  const [selectedGen, setSelectedGen] = useState<UsedGeneration>(() => USED_IPHONES_BUYBACK[2] || USED_IPHONES_BUYBACK[0]); // iPhone 16
  const [selectedModel, setSelectedModel] = useState<UsedGeneration['models'][0]>(() => {
    const defaultGen = USED_IPHONES_BUYBACK[2] || USED_IPHONES_BUYBACK[0];
    return defaultGen.models[1] || defaultGen.models[0]; // iPhone 16
  });
  const [selectedStorage, setSelectedStorage] = useState<number>(128);
  const [batteryPct, setBatteryPct] = useState<number>(90);
  const [selectedBody, setSelectedBody] = useState<BodyOption>(BODY_CONDITIONS[0]); // Идеальное
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [copiedValuation, setCopiedValuation] = useState<boolean>(false);
  const [tradeInApplied, setTradeInApplied] = useState<{
    modelName: string;
    storage: number;
    price: number;
  } | null>(null);

  const handleSelectGen = useCallback((gen: UsedGeneration) => {
    setSelectedGen(gen);
    const firstModel = gen.models[0];
    setSelectedModel(firstModel);
    if (firstModel) {
      const storages = Object.keys(firstModel.prices).map(Number);
      setSelectedStorage(storages[0]);
    }
  }, []);

  const handleSelectModel = useCallback((model: UsedGeneration['models'][0]) => {
    setSelectedModel(model);
    const storages = Object.keys(model.prices).map(Number);
    if (!model.prices[selectedStorage]) {
      setSelectedStorage(storages[0]);
    }
  }, [selectedStorage]);

  const toggleExtra = useCallback((id: string) => {
    setSelectedExtras((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (id === 'replaced_screen_orig' && next[id]) {
        next.replaced_screen = false;
      } else if (id === 'replaced_screen' && next[id]) {
        next.replaced_screen_orig = false;
      }
      return next;
    });
  }, []);

  const handleResetValuation = useCallback(() => {
    const defaultGen = USED_IPHONES_BUYBACK[2] || USED_IPHONES_BUYBACK[0];
    setSelectedGen(defaultGen);
    setSelectedModel(defaultGen.models[1] || defaultGen.models[0]);
    setSelectedStorage(128);
    setBatteryPct(90);
    setSelectedBody(BODY_CONDITIONS[0]);
    setSelectedExtras({});
    setIsBlocked(false);
  }, []);

  // Valuation Calculation Logic
  const calculation = useMemo(() => {
    if (isBlocked) {
      return {
        price: 0,
        canBuy: false,
        reason: 'Телефоны с блокировкой iCloud или чужим Apple ID мы не покупаем.',
        activeExtrasLabels: [],
      };
    }
    const basePrice = selectedModel.prices[selectedStorage] || 0;
    let batteryCut = 0;
    for (const rule of BATTERY_RULES) {
      if (batteryPct >= rule.min) {
        batteryCut = rule.cut;
        break;
      }
    }
    const bodyCut = selectedBody.cut;
    let extrasCut = 0;
    let fixedExtraCut = 0;
    const activeExtrasLabels: string[] = [];

    EXTRAS_OPTIONS.forEach((extra) => {
      if (selectedExtras[extra.id]) {
        if (extra.isEsimOnly) {
          const esimCut = getEsimDeduction(selectedModel.name);
          fixedExtraCut += esimCut;
          activeExtrasLabels.push(`только eSIM (-${formatPrice(esimCut)})`);
        } else {
          extrasCut += extra.cut;
          activeExtrasLabels.push(extra.label.toLowerCase());
        }
      }
    });

    const totalCut = Math.min(batteryCut + bodyCut + extrasCut, 90);
    const priceAfterPct = Math.max(0, basePrice * (1 - totalCut / 100));
    const price = Math.max(
      0,
      Math.round((priceAfterPct - fixedExtraCut) / SITE_INFO.roundTo) * SITE_INFO.roundTo
    );

    return {
      price,
      canBuy: true,
      activeExtrasLabels,
    };
  }, [selectedModel, selectedStorage, batteryPct, selectedBody, selectedExtras, isBlocked]);

  // WhatsApp prefilled URL for Sell / Valuation
  const waUrlSell = useMemo(() => {
    if (!calculation.canBuy) {
      return `https://wa.me/${SITE_INFO.whatsapp}`;
    }
    const msg = [
      `Здравствуйте! Хочу продать iPhone в ${SITE_INFO.shopName}.`,
      `• Модель: ${selectedModel.name} (${formatStorage(selectedStorage)})`,
      `• Аккумулятор: ${batteryPct}%`,
      `• Корпус: ${selectedBody.label} (${selectedBody.hint})`,
      calculation.activeExtrasLabels.length > 0
        ? `• Особенности: ${calculation.activeExtrasLabels.join(', ')}`
        : null,
      `• Оценка на сайте: ${formatPrice(calculation.price)}`,
      `\nКогда можно приехать на проверку в магазин на пр. Абылай хана?`,
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [calculation, selectedModel, selectedStorage, batteryPct, selectedBody]);

  const copyValuationSummary = useCallback(() => {
    const summary = `${selectedModel.name} ${formatStorage(selectedStorage)}, АКБ ${batteryPct}%, ${selectedBody.label}. Оценка Bylance: ${formatPrice(calculation.price)}`;
    navigator.clipboard.writeText(summary);
    setCopiedValuation(true);
    setTimeout(() => setCopiedValuation(false), 2000);
  }, [selectedModel, selectedStorage, batteryPct, selectedBody, calculation.price]);

  // Active Page Navigation ('catalog' or 'valuation')
  const [activePage, setActivePage] = useState<'catalog' | 'valuation'>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.toLowerCase();
      if (h.includes('val') || h.includes('trade-in') || h.includes('calc')) {
        return 'valuation';
      }
    }
    return 'catalog';
  });

  const navigateTo = useCallback((page: 'catalog' | 'valuation') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', `#${page}`);
    } catch {}
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h.includes('val') || h.includes('trade-in') || h.includes('calc')) {
        setActivePage('valuation');
      } else if (h.includes('cat')) {
        setActivePage('catalog');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleApplyTradeIn = useCallback(() => {
    if (!calculation.canBuy || calculation.price <= 0) return;
    setTradeInApplied({
      modelName: `${selectedModel.name} (${formatStorage(selectedStorage)})`,
      storage: selectedStorage,
      price: calculation.price,
    });
    // Switch to catalog page
    setActivePage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', '#catalog');
    } catch {}
  }, [calculation, selectedModel, selectedStorage]);

  // 3. CART STATE (saved in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bylance_cart_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
      }
    }
    return [];
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bylance_cart_v2', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  // Add variant to cart with specific payment method and selected color
  const addToCart = useCallback((
    model: ProductModel,
    variant: ProductVariant,
    itemPaymentMethod: PaymentMethodId,
    chosenColor?: ProductColor
  ) => {
    setCart((prev) => {
      const colorLabel = chosenColor ? ` (${chosenColor.name})` : '';
      const existingIndex = prev.findIndex(
        (item) => item.variantId === variant.id &&
                  item.paymentMethod === itemPaymentMethod &&
                  item.colorName === (chosenColor ? chosenColor.name : undefined)
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      const newItem: CartItem = {
        variantId: variant.id,
        modelId: model.id,
        modelName: model.name,
        fullName: variant.fullName + colorLabel,
        image: chosenColor?.image || model.image,
        colorName: chosenColor?.name,
        paymentMethod: itemPaymentMethod,
        quantity: 1,
        prices: variant.prices,
      };

      return [...prev, newItem];
    });
  }, []);

  // Update quantity in cart
  const updateCartQuantity = useCallback((index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      const target = next[index];
      if (!target) return prev;
      const newQty = target.quantity + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index] = { ...target, quantity: newQty };
      return next;
    });
  }, []);

  // Change payment method for a specific item in cart
  const updateItemPaymentMethod = useCallback((index: number, newMethod: PaymentMethodId) => {
    setCart((prev) => {
      const next = [...prev];
      const target = next[index];
      if (!target) return prev;
      next[index] = { ...target, paymentMethod: newMethod };
      return next;
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Cart Totals calculation
  const cartTotals = useMemo(() => {
    let totalCount = 0;
    let totalPrice = 0;
    let hasUnpricedItems = false;

    for (const item of cart) {
      totalCount += item.quantity;
      const unitPrice = item.prices[item.paymentMethod];
      if (unitPrice !== null && unitPrice !== undefined) {
        totalPrice += unitPrice * item.quantity;
      } else {
        hasUnpricedItems = true;
      }
    }

    return { totalCount, totalPrice, hasUnpricedItems };
  }, [cart]);

  // 4. CATALOG FILTER & SEARCH STATE
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // PREVENT BACKGROUND PAGE FROM SCROLLING ON MOBILE & TABLET WHEN MODAL/DRAWER IS OPEN
  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isCartOpen, isMobileMenuOpen]);

  // Subcategories for active category
  const availableSubcategories = useMemo(() => {
    const list = PRODUCT_MODELS.filter((p) => {
      if (selectedCategory === 'all') return true;
      return p.category === selectedCategory;
    });
    return Array.from(new Set(list.map((p) => p.subcategory)));
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  // Filtered product models
  const filteredModels = useMemo(() => {
    return PRODUCT_MODELS.filter((model) => {
      if (selectedCategory !== 'all' && model.category !== selectedCategory) {
        return false;
      }
      if (selectedSubcategory !== 'all' && model.subcategory !== selectedSubcategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = model.name.toLowerCase().includes(query);
        const matchesSubcat = model.subcategory.toLowerCase().includes(query);
        const matchesVariant = model.variants.some((v) => v.fullName.toLowerCase().includes(query));
        if (!matchesName && !matchesSubcat && !matchesVariant) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  // Resolve active variant for a model based on current card selections
  const getActiveVariant = useCallback((model: ProductModel): ProductVariant => {
    const sel = cardSelections[model.id] || {};
    const chosenSim = sel.simType || (model.simOptions ? model.simOptions[0] : undefined);
    const chosenStorage = sel.storage || (model.storageOptions ? model.storageOptions[0] : undefined);
    const chosenSize = sel.size || (model.sizeOptions ? model.sizeOptions[0] : undefined);

    const match = model.variants.find((v) => {
      const simMatch = !chosenSim || v.simType === chosenSim;
      const storageMatch = !chosenStorage || v.storage === chosenStorage;
      const sizeMatch = !chosenSize || v.size === chosenSize;
      return simMatch && storageMatch && sizeMatch;
    });

    return match || model.variants[0];
  }, [cardSelections]);

  const getCardPaymentMethod = useCallback((modelId: string): PaymentMethodId => {
    return cardSelections[modelId]?.paymentMethod || globalPayment;
  }, [cardSelections, globalPayment]);

  const updateCardSelection = useCallback((
    modelId: string,
    updates: Partial<{
      colorId: string;
      simType: 'ESIM' | 'SIM';
      storage: string;
      size: string;
      paymentMethod: PaymentMethodId;
    }>
  ) => {
    setCardSelections((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        ...updates,
      },
    }));
  }, []);

  // DIRECT 1-CLICK ORDER VIA WHATSAPP FROM PRODUCT CARD
  const handleOrderNowWhatsApp = useCallback((
    model: ProductModel,
    variant: ProductVariant,
    methodId: PaymentMethodId,
    chosenColor?: ProductColor
  ) => {
    const methodObj = PAYMENT_METHODS.find((m) => m.id === methodId) || PAYMENT_METHODS[2];
    const priceVal = variant.prices[methodId];
    const priceStr = priceVal !== null && priceVal !== undefined
      ? formatPrice(priceVal)
      : 'Цена по запросу';

    const textLines = [
      `Здравствуйте! Хочу оформить заказ в ${SITE_INFO.shopName}:`,
      ``,
      `• Модель: ${variant.fullName}`,
    ];

    if (chosenColor) {
      textLines.push(`• Цвет: ${chosenColor.name}`);
    }

    textLines.push(
      `• Способ оплаты: ${methodObj.name}`,
      `• Цена: ${priceStr}`,
      ``,
      `Подскажите, есть ли в наличии и как оформить доставку/самовывоз?`
    );

    const url = `https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(textLines.join('\n'))}`;
    window.open(url, '_blank');
  }, []);

  // 5. WHATSAPP ORDER GENERATOR FOR CART
  const generateWhatsAppMessage = useCallback(() => {
    const lines: string[] = ['Здравствуйте! Хочу оформить заказ.', '', 'Мои товары:', ''];

    cart.forEach((item, index) => {
      const priceVal = item.prices[item.paymentMethod];
      const priceStr = priceVal !== null && priceVal !== undefined
        ? formatPrice(priceVal)
        : 'Уточняется у менеджера';

      const methodObj = PAYMENT_METHODS.find((m) => m.id === item.paymentMethod);
      const methodName = methodObj ? methodObj.name : item.paymentMethod;

      lines.push(`${index + 1}. ${item.fullName}`);
      lines.push(`Количество: ${item.quantity}`);
      lines.push(`Способ оплаты: ${methodName}`);
      lines.push(`Цена: ${priceStr}`);
      lines.push('');
    });

    const formattedTotal = cartTotals.totalPrice > 0
      ? formatPrice(cartTotals.totalPrice)
      : '0 ₸';

    const totalSuffix = cartTotals.hasUnpricedItems ? ' (без учета позиций с ценой по запросу)' : '';
    lines.push(`Сумма товаров: ${formattedTotal}${totalSuffix}`);

    if (tradeInApplied) {
      lines.push(`• Зачет Trade-In (${tradeInApplied.modelName}): -${formatPrice(tradeInApplied.price)}`);
      const finalToPay = Math.max(0, cartTotals.totalPrice - tradeInApplied.price);
      lines.push(`• Итого к доплате с учетом Trade-In: ${formatPrice(finalToPay)}`);
    } else {
      lines.push(`Итого к оплате: ${formattedTotal}${totalSuffix}.`);
    }

    return lines.join('\n');
  }, [cart, cartTotals, tradeInApplied]);

  const handleCheckoutWhatsApp = useCallback(() => {
    if (cart.length === 0) return;
    const msg = generateWhatsAppMessage();
    const url = `https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }, [cart, generateWhatsAppMessage]);

  const handleCopyOrder = useCallback(() => {
    const msg = generateWhatsAppMessage();
    navigator.clipboard.writeText(msg);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  }, [generateWhatsAppMessage]);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const logoSrc = `${baseUrl.replace(/\/$/, '')}/logo.svg`;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9fb] dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ====================================================================== */}
      {/* 1. HEADER (OPTIMIZED FOR MOBILE, TABLET & DESKTOP — NO OVERLAPS)       */}
      {/* ====================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0d14]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            {/* Hamburger Button visible on mobile AND tablet (< 1024px) to prevent collisions */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Открыть меню"
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo & Brand: Clicking Logo returns to catalog, identical layout on mobile & desktop */}
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className="flex items-center gap-2.5 focus-visible:outline-none text-left cursor-pointer active:scale-95 transition-transform"
              aria-label="В каталог Bylance"
            >
              <img
                src={logoSrc}
                alt={SITE_INFO.shopName}
                className="h-8 sm:h-10 w-auto object-contain rounded-lg shadow-sm shrink-0"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#7a0f2d] dark:text-[#ffead1] transition-colors leading-tight">
                  {SITE_INFO.shopName}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-[#ffead1]/70 leading-none">
                  Электроника в Алматы
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation: ONE unified segmented switcher button between Catalog and Trade-In + smooth links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {/* The single unified switcher button */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  navigateTo('catalog');
                  setTimeout(() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }), 50);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  activePage === 'catalog'
                    ? 'bg-[#7a0f2d] text-[#ffead1] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Каталог</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('valuation')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  activePage === 'valuation'
                    ? 'bg-[#7a0f2d] text-[#ffead1] shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Trade-In</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                navigateTo('catalog');
                setTimeout(() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Об основательнице
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('catalog');
                setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('catalog');
                setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Контакты
            </button>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              aria-label="Сменить тему"
              title={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#7a0f2d]" />}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#ffead1]/40 hover:bg-[#ffead1]/70 dark:bg-white/10 dark:hover:bg-white/15 text-[#2a1a1f] dark:text-[#ffead1] transition-all flex items-center gap-2 font-semibold text-xs sm:text-sm border border-[#7a0f2d]/15 dark:border-white/10"
              aria-label="Открыть корзину"
            >
              <ShoppingCart className="w-4 h-4 text-[#7a0f2d] dark:text-[#ffead1]" />
              <span className="hidden sm:inline">Корзина</span>
              {cartTotals.totalCount > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-black rounded-full bg-[#7a0f2d] text-[#ffead1]">
                  {cartTotals.totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* MOBILE NAVIGATION SIDE DRAWER (NO EMOJIS, CLEAN LABELS)                */}
      {/* ====================================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white dark:bg-[#121622] text-slate-900 dark:text-white h-full shadow-2xl flex flex-col z-10 p-5 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <span className="font-black text-xl text-[#7a0f2d] dark:text-[#ffead1]">
                {SITE_INFO.shopName}
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Categories Navigation (Emojis removed as requested) */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Категории каталога:
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Все товары</span>
                <span className="text-[11px] opacity-70">({PRODUCT_MODELS.length})</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('apple');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'apple'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Техника Apple</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'apple').length})
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('dyson');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'dyson'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Устройства Dyson</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'dyson').length})
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('other');
                  setSelectedSubcategory('all');
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'other'
                    ? 'bg-[#7a0f2d] text-[#ffead1] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border dark:border-[#b4401f]'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Фото и гаджеты</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'other').length})
                </span>
              </button>
            </div>

            {/* Pages & Sections in Store */}
            <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Страницы:
              </span>
              <button
                type="button"
                onClick={() => {
                  navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activePage === 'catalog'
                    ? 'bg-[#7a0f2d] text-[#ffead1]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>🛍️ Каталог новых устройств</span>
                <span className="text-[10px] opacity-80">Магазин</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('valuation');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activePage === 'valuation'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <span>🔄 Оценка и Trade-In iPhone</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold">
                  Trade-In
                </span>
              </button>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-2 mb-1">
                Разделы:
              </span>
              <button
                type="button"
                onClick={() => {
                  if (activePage !== 'valuation') navigateTo('valuation');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Как работает выкуп (3 шага)
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activePage !== 'catalog') navigateTo('catalog');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between cursor-pointer"
              >
                <span>Аружан Жеткерген</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-bold">Основательница</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Частые вопросы (FAQ)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Контакты в Алматы
              </button>
            </div>

            {/* Telegram Б/У Callout */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5 text-xs">
              <span className="font-bold text-[#229ED9] block">
                Каталог Б/У техники в Telegram
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                В нашем Telegram публикуются исключительно проверенные Б/У устройства и Trade-In с фото и АКБ.
              </p>
              <a
                href={`https://t.me/${SITE_INFO.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#229ED9] hover:underline pt-1 text-[11px]"
              >
                <span>Перейти в Telegram-канал ↗</span>
              </a>
            </div>

            {/* Direct WhatsApp Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${SITE_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Написать в WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MAIN CONTAINER                                                         */}
      {/* ====================================================================== */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-12">
        
        {/* ONE UNIFIED SWITCHER BUTTON BETWEEN CATALOG AND TRADE-IN */}
        <div className="flex justify-center -mt-2 sm:-mt-3">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                activePage === 'catalog'
                  ? 'bg-white dark:bg-[#1c2333] text-[#7a0f2d] dark:text-[#ffead1] shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-[#7a0f2d] dark:text-[#ffead1]" />
              <span>Каталог товаров</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('valuation')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                activePage === 'valuation'
                  ? 'bg-white dark:bg-[#1c2333] text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Оценка и Trade-In</span>
            </button>
          </div>
        </div>

        {activePage === 'catalog' && (
          <>
        {/* ====================================================================== */}
        {/* 1. CATALOG SECTION (IMMEDIATELY VISIBLE ON FIRST SCREEN)                */}
        {/* ====================================================================== */}
        <section id="catalog" className="space-y-4 scroll-mt-20">
          
          {/* Top Compact Catalog Header: Trust badge, Title & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold mb-1.5 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Оригинальная техника с официальной гарантией 1 год</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Каталог устройств в наличии
              </h1>
            </div>

            {/* Fast Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию модели..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7a0f2d]/30 dark:focus:ring-white/20 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Очистить поиск"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* APPLIED TRADE-IN DISCOUNT (if calculated by user) */}
          {tradeInApplied && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black">
                    Учтен ваш Trade-In: {tradeInApplied.modelName}
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300/80">
                    Скидка <span className="font-bold font-mono text-xs">{formatPrice(tradeInApplied.price)}</span> на покупку любого нового устройства!
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigateTo('valuation')}
                  className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-white text-xs font-bold transition-all border border-emerald-500/30 cursor-pointer"
                >
                  Изменить оценку
                </button>
                <button
                  type="button"
                  onClick={() => setTradeInApplied(null)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Сбросить
                </button>
              </div>
            </div>
          )}

          {/* Quick Global Payment Mode Selector Pills (Switches all catalog prices) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
              Цены в каталоге:
            </span>
            {PAYMENT_METHODS.map((m) => {
              const isSelected = globalPayment === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectGlobalPayment(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                    isSelected
                      ? m.id === 'cash'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f] shadow-xs'
                      : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  <PaymentMethodIcon method={m.id} className="w-3.5 h-3.5" />
                  <span>{m.name}</span>
                  {m.id === 'cash' && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold ml-0.5">
                      Скидка
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Tabs (Visible on all screens with horizontal scroll) */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 min-h-[40px] flex items-center justify-center active:scale-95 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                  : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
              }`}
            >
              Все товары ({PRODUCT_MODELS.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = PRODUCT_MODELS.filter((p) => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 min-h-[40px] flex items-center justify-center active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                      : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Subcategory Pills (Enlarged & Easy to Tap) */}
          {availableSubcategories.length > 1 && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5 mr-0.5">
                <Filter className="w-3.5 h-3.5 text-[#7a0f2d] dark:text-[#ffead1]" />
                <span>Подкатегория:</span>
              </span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`text-xs sm:text-sm px-4 py-2 rounded-xl border font-bold transition-all shrink-0 min-h-[38px] flex items-center justify-center active:scale-95 ${
                  selectedSubcategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                    : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                }`}
              >
                Все
              </button>

              {availableSubcategories.map((subcat) => (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-xl border font-bold transition-all shrink-0 min-h-[38px] flex items-center justify-center active:scale-95 ${
                    selectedSubcategory === subcat
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  {subcat}
                </button>
              ))}
            </div>
          )}

          {/* ================================================================== */}
          {/* GROUPED PRODUCT CARDS GRID                                         */}
          {/* ================================================================== */}
          {filteredModels.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#121622] rounded-2xl border border-slate-200/80 dark:border-white/10">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300 mb-2">
                Ничего не найдено по запросу «{searchQuery}»
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                className="text-xs font-bold text-[#7a0f2d] dark:text-[#ffead1] hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredModels.map((model) => {
                const activeVariant = getActiveVariant(model);
                const itemPayment = getCardPaymentMethod(model.id);
                const currentPrice = activeVariant.prices[itemPayment];
                const activeMethodObj = PAYMENT_METHODS.find((m) => m.id === itemPayment) || PAYMENT_METHODS[2];

                const cartMatch = cart.find(
                  (c) => c.variantId === activeVariant.id && c.paymentMethod === itemPayment
                );
                const cartQty = cartMatch ? cartMatch.quantity : 0;

                const sel = cardSelections[model.id] || {};
                const activeSim = sel.simType || (model.simOptions ? model.simOptions[0] : undefined);
                const activeStorage = sel.storage || (model.storageOptions ? model.storageOptions[0] : undefined);
                const activeSize = sel.size || (model.sizeOptions ? model.sizeOptions[0] : undefined);
                const activeColor = model.colorOptions?.find((c) => c.id === sel.colorId) || model.colorOptions?.[0];
                const displayImage = activeColor?.image || model.image;

                const kaspiPrice = activeVariant.prices.kaspi;
                const halykPrice = activeVariant.prices.halyk;
                const promoPrice = activeVariant.prices.promo;
                const cashPrice = activeVariant.prices.cash;

                const kaspi12 = kaspiPrice ? Math.round(kaspiPrice / 12) : null;
                const kaspi24 = kaspiPrice ? Math.round(kaspiPrice / 24) : null;
                const halyk12 = halykPrice ? Math.round(halykPrice / 12) : null;
                const halyk24 = halykPrice ? Math.round(halykPrice / 24) : null;

                const specParts: string[] = [];
                if (activeStorage) specParts.push(activeStorage);
                if (activeSim) specParts.push(activeSim === 'ESIM' ? 'eSIM' : 'SIM');
                if (activeSize) specParts.push(activeSize);
                if (activeColor) specParts.push(activeColor.name.split(' (')[0]);
                const specSubtitle = specParts.length > 0 ? specParts.join(' · ') : model.subcategory;

                return (
                  <div
                    key={model.id}
                    className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Product Photo Container: Compact size, rounded corners, pure white background */}
                      <div className="w-full h-52 sm:h-56 bg-white dark:bg-white p-5 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-100 relative rounded-t-2xl">
                        <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl p-1">
                          <ProductImage
                            src={displayImage}
                            alt={model.name}
                            fallbackSrc={model.image}
                            className="max-h-36 sm:max-h-42 w-auto max-w-[85%] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {activeColor && (
                          <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-white border border-white/20 shadow-2xs pointer-events-none">
                            {activeColor.name}
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 space-y-4">
                        
                        {/* Subcategory & Warranty & Title */}
                        <div className="space-y-1 sm:space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                              {model.subcategory}
                            </span>
                            <span className="text-[11px] sm:text-xs text-slate-400">
                              {model.warranty}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug pt-0.5">
                            {model.name}
                          </h3>
                        </div>

                        {/* SELECTOR: COLOR SELECTION WITH COMPACT ROUNDED WHITE THUMBNAILS */}
                        {model.colorOptions && model.colorOptions.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold uppercase tracking-wider text-[#7a0f2d] dark:text-[#ffead1]">
                                Цвет:
                              </span>
                              <span className="font-bold text-[#2a1a1f] dark:text-[#ffead1] bg-[#ffead1]/60 dark:bg-[#7a0f2d]/40 px-2.5 py-0.5 rounded-lg text-xs truncate ml-2 border border-[#7a0f2d]/20 dark:border-white/10 shadow-2xs">
                                {activeColor?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
                              {model.colorOptions.map((col) => {
                                const isColSel = activeColor?.id === col.id;
                                return (
                                  <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { colorId: col.id })}
                                    title={col.name}
                                    className={`group/color relative rounded-xl border-2 transition-all flex items-center justify-center shrink-0 active:scale-95 cursor-pointer overflow-hidden ${
                                      isColSel
                                        ? 'border-[#7a0f2d] dark:border-[#ffead1] ring-2 ring-[#b4401f]/40 dark:ring-[#ffead1]/30 scale-105 shadow-md'
                                        : 'border-slate-200 dark:border-white/10 hover:border-[#b4401f]/60 dark:hover:border-white/40 hover:scale-[1.02]'
                                    }`}
                                  >
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white flex items-center justify-center relative rounded-xl p-1 overflow-hidden shadow-2xs">
                                      <img
                                        src={col.image}
                                        alt={col.name}
                                        loading="lazy"
                                        className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover/color:scale-110"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                      {col.hex && (
                                        <span
                                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white absolute bottom-0.5 right-0.5 shadow-sm pointer-events-none"
                                          style={{ backgroundColor: col.hex }}
                                        />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SELECTOR 1: SIM TYPE */}
                        {model.simOptions && model.simOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Тип SIM-карты:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {model.simOptions.map((sim) => {
                                const isSel = activeSim === sim;
                                return (
                                  <button
                                    key={sim}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { simType: sim })}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                      isSel
                                        ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]/60 shadow-xs'
                                        : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                                    }`}
                                  >
                                    {sim === 'ESIM' ? 'eSIM' : 'Физическая SIM'}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SELECTOR 2: STORAGE (MEMORY) */}
                        {model.storageOptions && model.storageOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Объём памяти:
                            </span>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                              {model.storageOptions.map((storage) => {
                                const isSel = activeStorage === storage;
                                return (
                                  <button
                                    key={storage}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { storage })}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                      isSel
                                        ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]/60 shadow-xs'
                                        : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                                    }`}
                                  >
                                    {storage}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* SELECTOR 3: SIZE (FOR APPLE WATCH) */}
                        {model.sizeOptions && model.sizeOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Размер корпуса:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {model.sizeOptions.map((sz) => {
                                const isSel = activeSize === sz;
                                return (
                                  <button
                                    key={sz}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { size: sz })}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                                      isSel
                                        ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]/60 shadow-xs'
                                        : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                                    }`}
                                  >
                                    {sz}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* ================================================================ */}
                    {/* AUTHENTIC MULTI-COLOR PRICING TAG (КАК НА ФОТО ПОЛЬЗОВАТЕЛЯ)      */}
                    {/* ================================================================ */}
                    <div className="p-2.5 sm:p-3.5 border-t border-slate-100 dark:border-white/10 space-y-1.5 sm:space-y-2 bg-slate-50/60 dark:bg-[#0e121c]/90 mt-auto">
                      
                      {/* 1. Header Box: Model Title + Spec Summary (Wine Crimson #7a0f2d) */}
                      <div className="rounded-2xl bg-[#7a0f2d] text-white p-2.5 sm:p-3 shadow-xs">
                        <div className="font-extrabold text-sm sm:text-base leading-tight text-white tracking-tight">
                          {model.name}
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#ffead1] font-medium leading-tight mt-0.5 truncate">
                          {specSubtitle}
                        </div>
                      </div>

                      {/* 2. Kaspi Row (Warm Cream #ffead1 / #fff4e5) */}
                      <button
                        type="button"
                        onClick={() => updateCardSelection(model.id, { paymentMethod: 'kaspi' })}
                        className={`w-full text-left rounded-2xl bg-[#ffead1] hover:bg-[#ffe3c2] text-[#2a1a1f] p-2 sm:p-2.5 transition-all flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                          itemPayment === 'kaspi'
                            ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                            : 'opacity-95 hover:opacity-100'
                        }`}
                      >
                        <div className="shrink-0 leading-none">
                          <span className="font-black text-xs sm:text-sm text-[#F14635] block tracking-tight">
                            Kaspi
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-[#8a7267] font-semibold block mt-0.5">
                            рассрочка
                          </span>
                        </div>

                        <div className="text-center sm:text-left flex-1 px-1 min-w-0">
                          <span className="font-black font-mono text-base sm:text-base md:text-lg xl:text-xl text-[#2a1a1f] whitespace-nowrap block truncate">
                            {kaspiPrice !== null ? formatPrice(kaspiPrice) : 'По запросу'}
                          </span>
                        </div>

                        <div className="shrink-0 text-right leading-tight space-y-0.5">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">12 мес</span>
                            <span className="font-black text-xs sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {kaspi12 !== null ? formatPrice(kaspi12).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">24 мес</span>
                            <span className="font-black text-xs sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {kaspi24 !== null ? formatPrice(kaspi24).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 3. Halyk Row (Warm Cream #ffead1 / #fff4e5) */}
                      <button
                        type="button"
                        onClick={() => updateCardSelection(model.id, { paymentMethod: 'halyk' })}
                        className={`w-full text-left rounded-2xl bg-[#ffead1] hover:bg-[#ffe3c2] text-[#2a1a1f] p-2 sm:p-2.5 transition-all flex items-center justify-between gap-1.5 sm:gap-2 shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                          itemPayment === 'halyk'
                            ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                            : 'opacity-95 hover:opacity-100'
                        }`}
                      >
                        <div className="shrink-0 leading-none">
                          <span className="font-black text-xs sm:text-sm text-[#007A53] block tracking-tight">
                            Halyk
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-[#8a7267] font-semibold block mt-0.5">
                            рассрочка
                          </span>
                        </div>

                        <div className="text-center sm:text-left flex-1 px-1 min-w-0">
                          <span className="font-black font-mono text-base sm:text-base md:text-lg xl:text-xl text-[#2a1a1f] whitespace-nowrap block truncate">
                            {halykPrice !== null ? formatPrice(halykPrice) : 'По запросу'}
                          </span>
                        </div>

                        <div className="shrink-0 text-right leading-tight space-y-0.5">
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">12 мес</span>
                            <span className="font-black text-xs sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {halyk12 !== null ? formatPrice(halyk12).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-right">
                            <span className="text-[10px] sm:text-xs text-[#8a7267] font-semibold">24 мес</span>
                            <span className="font-black text-xs sm:text-xs xl:text-sm text-[#7a0f2d] font-mono whitespace-nowrap">
                              {halyk24 !== null ? formatPrice(halyk24).replace(' ₸', '') : '—'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* 4. Bottom 2 Blocks (АКЦИЯ & НАЛИЧНЫМИ side-by-side) */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {/* Left: АКЦИЯ (Wine Crimson #7a0f2d) */}
                        <button
                          type="button"
                          onClick={() => updateCardSelection(model.id, { paymentMethod: 'promo' })}
                          className={`w-full text-left rounded-2xl bg-[#7a0f2d] hover:bg-[#8e1236] text-white p-2.5 sm:p-3 transition-all flex flex-col justify-between shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                            itemPayment === 'promo'
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                              : 'opacity-95 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <span className="font-black text-xs uppercase tracking-wide block leading-none">
                              АКЦИЯ
                            </span>
                            <span className="text-[10px] text-[#ffead1]/90 font-medium block mt-1 leading-tight truncate">
                              при онлайн-оплате
                            </span>
                          </div>
                          <div className="mt-2.5">
                            <span className="font-black font-mono text-sm sm:text-base md:text-lg text-white block whitespace-nowrap leading-none truncate">
                              {promoPrice !== null ? formatPrice(promoPrice) : 'По запросу'}
                            </span>
                          </div>
                        </button>

                        {/* Right: НАЛИЧНЫМИ (Obsidian #2a1a1f) */}
                        <button
                          type="button"
                          onClick={() => updateCardSelection(model.id, { paymentMethod: 'cash' })}
                          className={`w-full text-left rounded-2xl bg-[#2a1a1f] hover:bg-[#3d262d] text-white p-2.5 sm:p-3 transition-all flex flex-col justify-between shadow-2xs relative cursor-pointer active:scale-[0.99] min-w-0 overflow-hidden ${
                            itemPayment === 'cash'
                              ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-[#121622] scale-[1.01]'
                              : 'opacity-95 hover:opacity-100'
                          }`}
                        >
                          <div>
                            <span className="font-black text-xs uppercase tracking-wide block leading-none">
                              НАЛИЧНЫМИ
                            </span>
                            <span className="text-[10px] text-[#ffead1]/80 font-medium block mt-1 leading-tight truncate">
                              бумажные деньги
                            </span>
                          </div>
                          <div className="mt-2.5">
                            <span className="font-black font-mono text-sm sm:text-base md:text-lg text-white block whitespace-nowrap leading-none truncate">
                              {cashPrice !== null ? formatPrice(cashPrice) : 'По запросу'}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* 5. Two Action Buttons: Direct 1-Click WhatsApp Order + Add to Cart */}
                      <div className="space-y-2 pt-2">
                        {/* Button 1: Order Now Directly via WhatsApp */}
                        <button
                          type="button"
                          onClick={() => handleOrderNowWhatsApp(model, activeVariant, itemPayment, activeColor)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-current" />
                          <span>Заказать сразу в WhatsApp</span>
                        </button>

                        {/* Button 2: Add to multi-product Cart */}
                        <button
                          type="button"
                          onClick={() => addToCart(model, activeVariant, itemPayment, activeColor)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 text-[#7a0f2d] dark:text-[#ffead1]" />
                          <span>
                            {cartQty > 0
                              ? `В корзине (${cartQty} шт.) +`
                              : 'В корзину'}
                          </span>
                        </button>

                        {/* Trade-In Quick Button or Applied Status */}
                        {model.category === 'apple' && (
                          <div className="pt-1">
                            {tradeInApplied ? (
                              <div className="py-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] flex items-center justify-between">
                                <span className="text-emerald-800 dark:text-emerald-300 font-semibold truncate">
                                  Trade-In ({tradeInApplied.modelName}):
                                </span>
                                <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 ml-1 shrink-0">
                                  -{formatPrice(tradeInApplied.price)}
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => navigateTo('valuation')}
                                className="w-full py-1.5 px-2 rounded-xl text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>Сдать старый iPhone по Trade-In</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CALLOUT BANNER: SWITCH TO VALUATION PAGE */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-600/15 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-amber-900/40 border border-amber-300 dark:border-amber-600/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Trade-In и Выкуп iPhone в Алматы
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                Хотите сдать свой старый iPhone или обменять на новый?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Узнайте точную стоимость вашего устройства в нашем онлайн-калькуляторе на отдельной странице оценки. Выплата сразу деньгами или скидка на новый товар!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('valuation')}
            className="shrink-0 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Перейти к оценке iPhone</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ====================================================================== */}
        {/* FOUNDER & STORE STORY: АРУЖАН ЖЕТКЕРГЕН                                */}
        {/* ====================================================================== */}
        <section id="founder" className="scroll-mt-20 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
            
            {/* PHOTO FIELD WITH LUXURY GRADIENT EFFECT */}
            <div className="relative group shrink-0 self-center lg:self-start">
              {/* Outer Radiant Ambient Gradient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#7a0f2d]/40 via-[#b4401f]/35 via-[#ffead1]/30 to-[#7a0f2d]/30 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              {/* Iridescent Gradient Border Ring */}
              <div className="p-1 rounded-[28px] bg-gradient-to-tr from-[#7a0f2d] via-[#b4401f] via-[#ffead1] to-[#7a0f2d] shadow-xl">
                {/* Photo Container Frame */}
                <div className="relative w-40 h-52 sm:w-48 sm:h-60 md:w-52 md:h-64 rounded-[24px] overflow-hidden bg-gradient-to-b from-[#2a1a1f] to-black flex items-center justify-center">
                  
                  {/* Founder Photo Image with Graceful Stylized Fallback */}
                  <img
                    src={SITE_INFO.founder?.image || '/aruzhan.jpg'}
                    alt={SITE_INFO.founder?.name || 'Аружан Жеткерген'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallback = document.getElementById('founder-gradient-avatar');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />

                  {/* Stylized Gradient Avatar Fallback (when local photo file is not yet placed) */}
                  <div
                    id="founder-gradient-avatar"
                    className="absolute inset-0 hidden flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-[#2a1a1f] via-[#7a0f2d] to-[#1a0f13] text-white"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b4401f] via-[#7a0f2d] to-[#2a1a1f] flex items-center justify-center text-[#ffead1] font-black text-2xl shadow-lg ring-2 ring-white/20 mb-2">
                      АЖ
                    </div>
                    <span className="text-xs font-black tracking-tight text-[#ffead1]">Аружан Жеткерген</span>
                    <span className="text-[10px] text-[#ffead1]/80 font-bold mt-0.5">@zaagaru</span>
                  </div>

                  {/* Aesthetic Bottom Gradient Fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                  {/* Floating Identity Badge on Photo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
                    <div className="px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-center shadow-xs">
                      <span className="text-[11px] font-black text-white block leading-tight truncate">
                        {SITE_INFO.founder?.name || 'Аружан Жеткерген'}
                      </span>
                      <span className="text-[9px] text-[#ffead1] font-extrabold uppercase tracking-wider block mt-0.5">
                        Основательница Bylance
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* BIO & TEXT INFO */}
            <div className="space-y-3.5 flex-1 min-w-0 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffead1] dark:bg-[#7a0f2d]/40 text-[#7a0f2d] dark:text-[#ffead1] text-xs font-bold border border-[#7a0f2d]/20 dark:border-[#ffead1]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Основательница магазина Bylance</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Аружан Жеткерген
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Казахстанский блогер и предпринимательница (Алматы & Астана)
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Основательница магазина <strong className="text-slate-900 dark:text-white font-bold">@bylance_kz</strong>, который уже более трех лет специализируется на продаже оригинальной техники брендов Apple и Dyson. В социальных сетях Аружан делится честными обзорами гаджетов, бэкстейджами ведения бизнеса, лайфстайлом и путешествиями.
              </p>

              {/* Stats badges (100% оригинал Apple & Dyson REMOVED as requested) */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Более 3 лет в бизнесе</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200">
                  360 000+ подписчиков
                </div>
              </div>
            </div>

            {/* Social Cards / Links */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[270px]">
              <a
                href="https://www.tiktok.com/@_zaag_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#1e2536] border border-slate-200 dark:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">
                    TT
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                      TikTok @_zaag_ ↗
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      280 000+ подписчиков
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/zaagaru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#1e2536] border border-slate-200 dark:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-black text-xs">
                    IG
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-rose-600 transition-colors">
                      Instagram @zaagaru ↗
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      80 000+ подписчиков
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/bylance_kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#1e2536] border border-slate-200 dark:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-xs">
                    BY
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-[#b4401f] transition-colors">
                      Магазин @bylance_kz ↗
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Оригинал Apple & Dyson
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
              </a>
            </div>

          </div>
        </section>

        {/* ====================================================================== */}
        {/* MESSENGERS BAR (RESPONSIVE TABLET/MOBILE LAYOUT — NO SQUEEZING)        */}
        {/* ====================================================================== */}
        <section className="bg-white dark:bg-[#121622] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Прямая связь и каталог Б/У техники
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#229ED9] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
                Telegram: только Б/У
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Новая техника в WhatsApp с моментальной консультацией, а свежие поступления проверенной Б/У техники — в Telegram.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0 w-full lg:w-auto">
            <a
              href={`https://wa.me/${SITE_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://t.me/${SITE_INFO.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#229ED9] hover:bg-[#1e8ec3] transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Каталог Б/У ↗</span>
            </a>

            <a
              href={SITE_INFO.gis}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#181d2a] dark:hover:bg-[#202738] transition-all border border-slate-200 dark:border-white/10"
            >
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2ГИС Алматы</span>
            </a>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* 6. FAQ SECTION (ACCORDION & EXPAND/COLLAPSE)                           */}
        {/* ====================================================================== */}
        <section id="faq" className="space-y-4 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-[#7a0f2d] dark:text-[#ffead1] uppercase tracking-wider">
              Помощь покупателю
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2a1a1f] dark:text-[#ffead1] mt-1">
              Часто задаваемые вопросы (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#ffead1]/70 mt-1">
              Ответы на популярные вопросы о рассрочке, гарантии, способах оплаты и получении заказов
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 pt-2">
            {FAQ_LIST.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#2a1a1f] dark:text-white hover:text-[#7a0f2d] dark:hover:text-[#ffead1] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#7a0f2d] dark:text-[#ffead1]' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 animate-fade-in space-y-3">
                      <p className="whitespace-pre-line">{faq.answer}</p>

                      {faq.hasTradeInLinks && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => navigateTo('valuation')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Онлайн-калькулятор оценки →</span>
                          </button>

                          <a
                            href={`https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent('Здравствуйте! Хочу оценить свой iPhone по программе Trade-In в магазине Bylance.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>Оценить в WhatsApp у сотрудника</span>
                          </a>

                          <a
                            href={`https://t.me/${SITE_INFO.telegram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Канал Trade-In и Б/У в Telegram</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                          >
                            <span>Наверх к каталогу ↑</span>
                          </button>
                        </div>
                      )}

                      {faq.hasTelegramLink && (
                        <div className="pt-1">
                          <a
                            href={`https://t.me/${SITE_INFO.telegram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Открыть Telegram-канал @{SITE_INFO.telegram} ↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ВОПРОСЫ И БЫСТРЫЕ ССЫЛКИ: WHATSAPP, TELEGRAM, TRADE-IN */}
          <div className="max-w-3xl mx-auto space-y-3 pt-2">
            
            {/* 1. WHATSAPP: Вопросы по товару или покупке */}
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Остались другие вопросы по товару или покупке?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Напишите нам в WhatsApp — менеджер на связи ежедневно и ответит за 2 минуты!
                </p>
              </div>

              <a
                href={`https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent('Здравствуйте! У меня есть вопрос по покупке техники в Bylance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 whitespace-nowrap w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Задать вопрос в WhatsApp</span>
              </a>
            </div>

            {/* 2. TELEGRAM: Б/У техника и канал */}
            <div className="p-5 sm:p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Ищете проверенную Б/У технику или Trade-In?
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#229ED9] text-white whitespace-nowrap hidden sm:inline-block">
                    Только Б/У
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Подпишитесь на наш Telegram — публикуем свежие поступления Б/У iPhone и Dyson с реальными фото и АКБ!
                </p>
              </div>

              <a
                href={`https://t.me/${SITE_INFO.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 whitespace-nowrap w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                <span>Канал Б/У в Telegram ↗</span>
              </a>
            </div>

            {/* 3. TRADE-IN: Обмен старого iPhone */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Хотите обменять старый iPhone на новую технику с доплатой?
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white whitespace-nowrap hidden sm:inline-block">
                    Trade-In
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  По программе Trade-In принимаются только Apple iPhone. Точную оценку сделает специалист в магазине или онлайн!
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('valuation')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 whitespace-nowrap w-full sm:w-auto cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Оценить в калькуляторе онлайн →</span>
              </button>
            </div>

          </div>
        </section>

        {/* ====================================================================== */}
        {/* 7. ADVANTAGES & GUARANTEES                                             */}
        {/* ====================================================================== */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Почему технику выбирают в Bylance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Надёжный магазин в Алматы с честными ценами и официальной гарантией
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#7a0f2d] dark:text-[#ffead1]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Оригинал</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Все устройства новые, запечатанные, в оригинальной заводской упаковке с официальной гарантией.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <KaspiIcon className="w-7 h-7 rounded-lg" />
                <HalykIcon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Рассрочка Kaspi и Halyk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Выгодные программы рассрочки 0-0-12 и 0-0-24 через Kaspi и Halyk Bank без скрытых переплат.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <RefreshCw className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Программа Trade-In</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Сдайте старый гаджет в зачёт нового с онлайн-оценкой за 5 минут в WhatsApp и минимальной доплатой.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#181d2a] border border-slate-100 dark:border-white/5 space-y-2">
              <MessageCircle className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Быстрый заказ в WhatsApp</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Заказ в 1 клик с карточки или отправка списка покупок из корзины прямо нашему менеджеру.
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================================== */}
        {/* 8. CONTACTS SECTION (ДВА МАГАЗИНА: ДЛЯ НОВЫХ И ДЛЯ Б/У)                */}
        {/* ====================================================================== */}
        <section id="contacts" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#7a0f2d] dark:text-[#ffead1] uppercase tracking-wider">
                Контакты и адреса
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Магазины Bylance в Алматы
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Один магазин для новой техники, второй — для Б/У техники и Trade-In
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${SITE_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shadow-sm flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Написать в WhatsApp</span>
              </a>

              <a
                href={SITE_INFO.gis}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-white transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>2ГИС</span>
              </a>
            </div>
          </div>

          {/* TWO STORE LOCATION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {SITE_INFO.addresses.map((addr) => {
              const isUsed = addr.id === 'used-store';
              return (
                <div
                  key={addr.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    isUsed
                      ? 'bg-amber-500/5 dark:bg-amber-950/25 border-amber-300/80 dark:border-amber-500/40 shadow-xs'
                      : 'bg-emerald-500/5 dark:bg-emerald-950/25 border-emerald-300/80 dark:border-emerald-500/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                      {isUsed ? (
                        <RefreshCw className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span>{addr.title}</span>
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isUsed
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'bg-emerald-600 text-white shadow-2xs'
                      }`}
                    >
                      {addr.badge}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{addr.address}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {addr.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Режим: <b className="text-slate-700 dark:text-slate-200 font-semibold">{addr.hours}</b>
                    </span>
                    <a
                      href={addr.gis}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      2ГИС ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-white/10 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">График работы обоих магазинов:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {SITE_INFO.hours} (без выходных)
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">Телефон и WhatsApp для консультаций:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {SITE_INFO.whatsappFormatted}
              </p>
            </div>
          </div>
        </section>
        </>
        )}

        {/* ====================================================================== */}
        {/* DEDICATED VALUATION PAGE (ВЫКУП И TRADE-IN IPHONE)                     */}
        {/* ====================================================================== */}
        {activePage === 'valuation' && (
          <>
            {/* 1. ⭐️ ОЦЕНКА И ВЫКУП IPHONE (ИНТЕГРАЦИЯ ИЗ BYLANCE_VALUATION) */}
            <section id="valuation" className="space-y-6 pt-1 scroll-mt-20">
              
              {/* Section Header & Reset */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-white dark:bg-[#121622] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-amber-500/30">
                    <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Оценка iPhone · Скупка и Trade-In в Алматы</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Узнайте, за сколько мы купим ваш iPhone
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Выберите поколение, память и состояние. Расчёт появится сразу, а заявку можно мгновенно отправить в WhatsApp или зачесть в Trade-In на новую технику.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetValuation}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white self-start sm:self-auto px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181d2a] hover:bg-slate-100 dark:hover:bg-[#202738] transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сбросить параметры</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                
                {/* LEFT COLUMN: 6 STEPS */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  
                  {/* STEP 1: GENERATION */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          Поколение iPhone
                        </h3>
                        <p className="text-[11px] text-slate-400">Выберите линейку вашего телефона</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                      {USED_IPHONES_BUYBACK.map((g) => {
                        const isSelected = selectedGen.gen === g.gen;
                        return (
                          <button
                            key={g.gen}
                            type="button"
                            onClick={() => handleSelectGen(g)}
                            className={`py-3 px-2 rounded-2xl text-center font-black text-sm transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738] hover:border-slate-300'
                            }`}
                          >
                            {g.gen}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: VERSION / MODEL */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          Версия модели
                        </h3>
                        <p className="text-[11px] text-slate-400">Выберите модификацию для iPhone {selectedGen.gen}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {selectedGen.models.map((m) => {
                        const isSelected = selectedModel.name === m.name;
                        return (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => handleSelectModel(m)}
                            className={`py-3 px-3 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738] hover:border-slate-300'
                            }`}
                          >
                            {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 3: STORAGE */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        3
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          Объём встроенной памяти
                        </h3>
                        <p className="text-[11px] text-slate-400">Указан в Настройки → Основные → Об этом устройстве</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {Object.keys(selectedModel.prices).map((s) => {
                        const storageNum = Number(s);
                        const isSelected = selectedStorage === storageNum;
                        return (
                          <button
                            key={storageNum}
                            type="button"
                            onClick={() => setSelectedStorage(storageNum)}
                            className={`py-3 px-3 rounded-2xl text-center font-bold text-xs sm:text-sm transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738] hover:border-slate-300'
                            }`}
                          >
                            {formatStorage(storageNum)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 4: BATTERY */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                          4
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            Ёмкость аккумулятора (АКБ)
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Настройки → Аккумулятор → Состояние аккумулятора
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#181d2a] px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-white/10">
                        <Battery className={`w-4 h-4 ${batteryPct >= 85 ? 'text-emerald-500' : batteryPct >= 80 ? 'text-amber-500' : 'text-rose-500'}`} />
                        <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                          {batteryPct}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-3">
                      <input
                        type="range"
                        min={50}
                        max={100}
                        step={1}
                        value={batteryPct}
                        onChange={(e) => setBatteryPct(Number(e.target.value))}
                        className="slider-battery"
                        aria-label="Ёмкость аккумулятора"
                      />
                      <div className="flex justify-between text-xs font-semibold text-slate-400 px-1">
                        <span>50%</span>
                        <span>75%</span>
                        <span>85%</span>
                        <span>100%</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium">
                          Быстрый выбор:
                        </span>
                        {BATTERY_PRESETS.map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setBatteryPct(pct)}
                            className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                              batteryPct === pct
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-2xs dark:bg-[#7a0f2d] dark:text-[#ffead1]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#202738]'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STEP 5: BODY CONDITIONS */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                          5
                        </span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            Состояние корпуса и стекла
                          </h3>
                          <p className="text-[11px] text-slate-400">Оцените внешний вид устройства</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">4 градации</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BODY_CONDITIONS.map((b) => {
                        const isSelected = selectedBody.id === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBody(b)}
                            className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all border cursor-pointer active:scale-95 ${
                              isSelected
                                ? 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] shadow-sm dark:bg-[#7a0f2d] dark:text-[#ffead1] dark:border-[#b4401f]'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full mb-2 border border-black/20 dark:border-white/20 shadow-xs"
                              style={{ backgroundColor: b.color }}
                            />
                            <span className="font-black text-xs sm:text-sm mb-1">{b.label}</span>
                            <span className={`text-[11px] leading-tight ${isSelected ? 'text-[#ffead1]/80' : 'text-slate-400'}`}>
                              {b.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 6: EXTRAS & DEFECTS */}
                  <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-7 h-7 rounded-full bg-[#7a0f2d] text-[#ffead1] text-xs font-black flex items-center justify-center shrink-0">
                        6
                      </span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                          Дополнительные параметры и нюансы
                        </h3>
                        <p className="text-[11px] text-slate-400">Отметьте, если есть особенности комплектации или ремонта</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {EXTRAS_OPTIONS.map((extra) => {
                        const isChecked = !!selectedExtras[extra.id];
                        return (
                          <button
                            key={extra.id}
                            type="button"
                            onClick={() => toggleExtra(extra.id)}
                            className={`p-3 rounded-2xl text-left flex items-center gap-3 transition-all border text-xs sm:text-sm font-bold cursor-pointer ${
                              isChecked
                                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-600/60 shadow-2xs'
                                : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738]'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                                isChecked ? 'bg-amber-600 text-white' : 'border border-slate-300 dark:border-white/20'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="flex-1">{extra.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Blocked Reason Switch */}
                    <button
                      type="button"
                      onClick={() => setIsBlocked(!isBlocked)}
                      className={`w-full p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all border text-xs sm:text-sm font-bold cursor-pointer ${
                        isBlocked
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700 shadow-2xs'
                          : 'bg-slate-50 dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#202738]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-xs shrink-0 transition-colors ${
                          isBlocked ? 'bg-rose-600 text-white' : 'border border-slate-300 dark:border-white/20'
                        }`}
                      >
                        {isBlocked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <span>{BLOCKED_REASON}</span>
                        {isBlocked && (
                          <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-1 font-normal leading-normal">
                            Внимание: устройства с чужим Apple ID или блокировкой активации не выкупаются.
                          </p>
                        )}
                      </div>
                    </button>
                  </div>

                </div>

                {/* RIGHT COLUMN: STICKY RESULT CARD */}
                <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
                  
                  <div className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#121826] text-slate-900 dark:text-white shadow-xl border border-slate-200/90 dark:border-white/10 relative overflow-hidden transition-colors">
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-[#7a0f2d] dark:text-amber-400 uppercase tracking-wider">
                        Предварительный расчет
                      </span>
                      <button
                        type="button"
                        onClick={copyValuationSummary}
                        disabled={!calculation.canBuy}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-40 cursor-pointer font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedValuation ? 'Скопировано!' : 'Копировать'}</span>
                      </button>
                    </div>

                    <div className="mb-5">
                      {calculation.canBuy ? (
                        <div>
                          <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#7a0f2d] dark:text-emerald-400 font-mono">
                            {formatPrice(calculation.price)}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                            Итоговая сумма подтверждается после 5-минутного осмотра в магазине на пр. Абылай хана, 113
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                            Выкуп невозможен
                          </div>
                          <p className="text-xs text-rose-500 dark:text-rose-300 mt-1">
                            {calculation.reason}
                          </p>
                        </div>
                      )}
                    </div>

                    {calculation.canBuy && (
                      <div className="py-3 px-3.5 rounded-2xl bg-slate-50 dark:bg-[#182033] border border-slate-200/70 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 space-y-2 mb-6">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Модель:</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {selectedModel.name} · {formatStorage(selectedStorage)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">АКБ:</span>
                          <span className="font-bold font-mono text-slate-900 dark:text-white">{batteryPct}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Корпус:</span>
                          <span className="font-bold text-slate-900 dark:text-white">{selectedBody.label}</span>
                        </div>
                        {calculation.activeExtrasLabels.length > 0 && (
                          <div className="flex items-start justify-between pt-1.5 border-t border-slate-200/60 dark:border-white/10">
                            <span className="text-slate-500 dark:text-slate-400">Особенности:</span>
                            <span className="font-bold text-right text-slate-900 dark:text-white pl-2">
                              {calculation.activeExtrasLabels.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2.5">
                      {/* Button 1: Send to WhatsApp */}
                      <a
                        href={waUrlSell}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                          calculation.canBuy
                            ? 'bg-[#25D366] hover:bg-[#20ba59] text-white active:scale-[0.99] cursor-pointer'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 pointer-events-none opacity-60'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Отправить заявку на выкуп в WhatsApp</span>
                      </a>

                      {/* Button 2: Apply to Trade-In for New Device */}
                      <button
                        type="button"
                        onClick={handleApplyTradeIn}
                        disabled={!calculation.canBuy}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border ${
                          calculation.canBuy
                            ? 'bg-[#7a0f2d] hover:bg-[#b4401f] text-[#ffead1] border-[#7a0f2d] shadow-sm active:scale-[0.99] cursor-pointer'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-transparent pointer-events-none opacity-60'
                        }`}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Обменять на новый по Trade-In (скидка {formatPrice(calculation.price)})</span>
                      </button>
                    </div>

                    {/* Guarantees List */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Деньги сразу: наличными или переводом на Kaspi Gold</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Быстрая диагностика за 5–10 минут при вас</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Честный расчет без скрытых комиссий</span>
                      </div>
                    </div>

                  </div>

                  {/* Direct Telegram & 2GIS Fast Links */}
                  {/* High-Visibility Telegram B/U Showcase Card */}
                  <a
                    href={`https://t.me/${SITE_INFO.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#229ED9]/15 via-[#229ED9]/10 to-[#229ED9]/25 hover:from-[#229ED9]/25 hover:to-[#229ED9]/35 border-2 border-[#229ED9]/60 hover:border-[#229ED9] shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                          <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#229ED9]">
                            Каталог Б/У в Telegram:
                          </div>
                          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                            @{SITE_INFO.telegram} ↗
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">
                            Реальные фото устройств и остаток АКБ
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 px-3 py-1.5 rounded-xl bg-[#229ED9] text-white text-xs font-black shadow-xs group-hover:bg-[#1a8bc0] transition-colors flex items-center gap-1">
                        <span>Открыть</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </a>

                </div>

              </div>

            </section>

            {/* 3. HOW IT WORKS (КАК РАБОТАЕТ ВЫКУП И TRADE-IN) */}
            <section id="how" className="py-8 bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-xs scroll-mt-20">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-black uppercase tracking-wider text-[#7a0f2d] dark:text-amber-400">
                  Прозрачный процесс
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Как работает скупка и Trade-In в Bylance
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Всего 3 простых шага от онлайн-оценки до получения денег или нового телефона
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/70 dark:border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-base shadow-xs">
                    1
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Оцените онлайн
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Выберите вашу модель iPhone, объём памяти и состояние аккумулятора в калькуляторе выше. Это занимает ровно минуту.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/70 dark:border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-base shadow-xs">
                    2
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Отправьте заявку в WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Нажмите «Отправить заявку» — откроется WhatsApp с заполненной спецификацией вашего устройства. Менеджер подтвердит время визита.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#181d2a] border border-slate-200/70 dark:border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center font-black text-base shadow-xs">
                    3
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Приезжайте и получите оплату
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Мастер проверит телефон за 5–10 минут в магазине на пр. Абылай хана, 113. Сразу выплачиваем деньги наличными/Kaspi или оформляем новый гаджет с зачетом суммы.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. VALUATION / TRADE-IN FAQ */}
            <section className="space-y-4">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Частые вопросы по выкупу
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2a1a1f] dark:text-[#ffead1] mt-1">
                  Вопросы о выкупе и Trade-In iPhone
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#ffead1]/70 mt-1">
                  Всё о диагностике, расчёте стоимости, способах выплаты и обмене на новый гаджет
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-3 pt-2">
                {VALUATION_FAQ_LIST.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-xs transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#2a1a1f] dark:text-white hover:text-[#7a0f2d] dark:hover:text-[#ffead1] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-amber-600 dark:text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 space-y-2">
                          <p className="whitespace-pre-line">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. PROMINENT TELEGRAM B/U SHOWCASE */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#229ED9]/20 via-[#229ED9]/15 to-[#229ED9]/25 border-2 border-[#229ED9]/60 dark:border-[#229ED9]/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-lg">
                  <Send className="w-7 h-7 -rotate-12 translate-x-0.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#229ED9] flex items-center justify-center md:justify-start gap-1.5">
                    <span>Канал проверенной техники</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    Каталог Б/У в Telegram: <span className="text-[#229ED9] underline decoration-2">@{SITE_INFO.telegram} ↗</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                    Каждый день выкладываем проверенные iPhone с остатком аккумулятора, подробными фото и ценой выкупа/продажи.
                  </p>
                </div>
              </div>
              <a
                href={`https://t.me/${SITE_INFO.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#229ED9] hover:bg-[#1a8bc0] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>Перейти в @{SITE_INFO.telegram} ↗</span>
              </a>
            </div>

            {/* 6. CALLOUT: GO TO STORE CATALOG */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#7a0f2d]/15 via-[#7a0f2d]/10 to-[#ffead1]/20 dark:from-[#7a0f2d]/40 dark:via-[#2a1a1f] dark:to-[#ffead1]/10 border border-[#7a0f2d]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#7a0f2d] text-[#ffead1] flex items-center justify-center shrink-0 shadow-sm">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#7a0f2d] dark:text-[#ffead1]">
                    Каталог техники в наличии
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    Готовы выбрать новое устройство?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                    В нашем каталоге представлены новые запечатанные Apple iPhone 16/15, MacBook, iPad, стайлеры Dyson и фототехника с гарантией и рассрочкой.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('catalog')}
                className="shrink-0 px-6 py-3 rounded-2xl bg-[#7a0f2d] hover:bg-[#8e1236] text-[#ffead1] font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Перейти в каталог магазина</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </main>

      {/* ====================================================================== */}
      {/* 9. FOOTER                                                              */}
      {/* ====================================================================== */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#7a0f2d] dark:text-[#ffead1] text-sm">
              {SITE_INFO.shopName}
            </span>
            <span>·</span>
            <span>Магазин оригинальной электроники в Алматы</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigateTo('catalog')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${activePage === 'catalog' ? 'text-[#7a0f2d] dark:text-[#ffead1] font-bold' : ''}`}
            >
              Каталог
            </button>
            <button
              type="button"
              onClick={() => navigateTo('valuation')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${activePage === 'valuation' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
            >
              Оценка iPhone
            </button>
            <a href="#founder" onClick={() => { if (activePage !== 'catalog') navigateTo('catalog'); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Об основательнице
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#contacts" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Контакты
            </a>
            <a
              href={`https://wa.me/${SITE_INFO.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline"
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/${SITE_INFO.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#229ED9] hover:underline"
            >
              Telegram (Б/У)
            </a>
          </div>
        </div>
      </footer>

      {/* ====================================================================== */}
      {/* 10. FIXED BOTTOM NAVIGATION BAR ("ОТДЕЛЬНАЯ СТРАНИЦА СНИЗУ")           */}
      {/* ====================================================================== */}
      <nav
        aria-label="Нижняя панель навигации"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c101a]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-white/10 shadow-2xl px-2 sm:px-6 py-2 transition-colors md:hidden"
      >
        <div className="max-w-xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
          {/* 1. Каталог */}
          <button
            type="button"
            onClick={() => navigateTo('catalog')}
            className={`flex-1 py-1 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center transition-all cursor-pointer ${
              activePage === 'catalog'
                ? 'text-[#7a0f2d] dark:text-[#ffead1] font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activePage === 'catalog'
                  ? 'bg-[#7a0f2d]/10 dark:bg-[#7a0f2d]/40 text-[#7a0f2d] dark:text-[#ffead1]'
                  : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight">Каталог</span>
          </button>

          {/* 2. Оценка iPhone */}
          <button
            type="button"
            onClick={() => navigateTo('valuation')}
            className={`flex-1 py-1 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center transition-all cursor-pointer ${
              activePage === 'valuation'
                ? 'text-amber-600 dark:text-amber-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                activePage === 'valuation'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : ''
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight">Оценка iPhone</span>
          </button>

          {/* 3. Корзина */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex-1 py-1 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold transition-all cursor-pointer relative"
          >
            <div className="relative">
              <div className="p-1.5 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
              </div>
              {cartTotals.totalCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-[#7a0f2d] text-[#ffead1] text-[10px] font-black font-mono shadow-2xs">
                  {cartTotals.totalCount}
                </span>
              )}
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight">
              {cartTotals.totalCount > 0 ? (
                <span className="font-bold text-[#7a0f2d] dark:text-[#ffead1] font-mono">
                  {cartTotals.totalPrice > 0 ? formatPrice(cartTotals.totalPrice) : 'Корзина'}
                </span>
              ) : (
                'Корзина'
              )}
            </span>
          </button>

          {/* 4. WhatsApp */}
          <a
            href={`https://wa.me/${SITE_INFO.whatsapp}?text=${encodeURIComponent('Здравствуйте! Хочу проконсультироваться по покупке или Trade-In в магазине Bylance.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-1 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 text-center text-slate-500 dark:text-slate-400 hover:text-[#25D366] font-semibold transition-all"
          >
            <div className="p-1.5 rounded-xl text-[#25D366]">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[11px] sm:text-xs tracking-tight">WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* ====================================================================== */}
      {/* 11. CART DRAWER (FULL HEIGHT ON TABLET & MOBILE, BODY SCROLL LOCKED,    */}
      {/*     NOWRAP ON PRICE SO ₸ NEVER BREAKS)                                 */}
      {/* ====================================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop with touch lock */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Content — 100dvh for exact mobile & tablet viewport height */}
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0e121c] text-slate-900 dark:text-white h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col z-10 transition-transform overscroll-contain touch-pan-y">
            
            {/* Header (Non-scrolling) */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#7a0f2d] dark:text-[#ffead1]" />
                <h2 className="text-lg font-black tracking-tight">
                  Корзина товаров
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ffead1] dark:bg-[#7a0f2d]/50 font-bold text-[#7a0f2d] dark:text-[#ffead1]">
                  {cartTotals.totalCount} шт.
                </span>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                aria-label="Закрыть корзину"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Helper Note (Non-scrolling) */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#121622] border-b border-slate-200/80 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
              Вы можете выбрать разный способ оплаты для каждого товара (например, один через Kaspi, другой за наличные).
            </div>

            {/* Cart Items List (Smooth, isolated scroll on mobile & tablet) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5 -webkit-overflow-scrolling-touch touch-pan-y">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-bold text-slate-700 dark:text-[#ffead1]">
                    В корзине пока ничего нет
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Выберите нужные товары в каталоге и добавьте их в корзину для быстрой отправки заказа в WhatsApp.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#7a0f2d] text-[#ffead1] text-xs font-bold hover:bg-[#b4401f] transition-colors"
                  >
                    Перейти в каталог
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const unitPrice = item.prices[item.paymentMethod];
                  const itemTotal = unitPrice !== null && unitPrice !== undefined
                    ? unitPrice * item.quantity
                    : null;

                  return (
                    <div
                      key={`${item.variantId}-${item.paymentMethod}-${index}`}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#181d2a] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail: white bg, rounded-xl */}
                        <div className="w-14 h-14 rounded-xl bg-white p-1 shrink-0 overflow-hidden border border-slate-200/60 dark:border-white/10 flex items-center justify-center shadow-2xs">
                          <ProductImage
                            src={item.image}
                            alt={item.fullName}
                            size="thumb"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                            {item.fullName}
                          </h4>
                          {item.colorName && (
                            <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 mt-0.5">
                              Цвет: {item.colorName}
                            </div>
                          )}
                          <div className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
                            {unitPrice !== null && unitPrice !== undefined
                              ? `${formatPrice(unitPrice)} за шт.`
                              : 'Цена по запросу'}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                          aria-label="Удалить товар"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* INDIVIDUAL PAYMENT METHOD SELECTION */}
                      <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                          Способ оплаты для этого товара:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                          {PAYMENT_METHODS.map((pm) => {
                            const isSelected = item.paymentMethod === pm.id;
                            return (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => updateItemPaymentMethod(index, pm.id)}
                                className={`py-1.5 px-1.5 rounded-lg text-[10px] font-bold transition-all border flex items-center justify-center gap-1 truncate ${
                                  isSelected
                                    ? pm.id === 'cash'
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      : 'bg-[#7a0f2d] text-[#ffead1] border-[#7a0f2d] dark:bg-[#7a0f2d] dark:border-[#b4401f] shadow-xs'
                                    : 'bg-slate-50 dark:bg-[#121622] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300'
                                }`}
                              >
                                <PaymentMethodIcon method={pm.id} className="w-3 h-3 shrink-0" />
                                <span className="truncate">{pm.shortLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stepper & Line Total (Nowrap Price) */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#121622] rounded-lg p-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, -1)}
                            className="p-1 rounded bg-white dark:bg-[#181d2a] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(index, 1)}
                            className="p-1 rounded bg-[#7a0f2d] text-[#ffead1] hover:bg-[#b4401f]"
                            aria-label="Увеличить количество"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black font-mono text-[#7a0f2d] dark:text-[#ffead1] whitespace-nowrap shrink-0">
                            {itemTotal !== null ? formatPrice(itemTotal) : 'По запросу'}
                          </div>
                          {item.paymentMethod === 'cash' && item.prices.kaspi && itemTotal !== null && (
                            <div className="text-[10px] text-rose-500 dark:text-rose-400 line-through font-bold">
                              {formatPrice(item.prices.kaspi * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer with Checkout (Non-scrolling, Nowrap Price) */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#0e121c] space-y-3 shrink-0">
                
                {/* Trade-In in Cart */}
                {tradeInApplied ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                        Скидка Trade-In ({tradeInApplied.modelName})
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Учтено по предварительной оценке
                      </span>
                    </div>
                    <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                      -{formatPrice(tradeInApplied.price)}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setTimeout(() => {
                        document.getElementById('valuation')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Сдать свой старый iPhone в Trade-In (минус от цены)</span>
                  </button>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-3 text-base sm:text-lg font-black">
                    <span className="text-slate-900 dark:text-white shrink-0">
                      {tradeInApplied ? 'Итого к доплате:' : 'Итого к оплате:'}
                    </span>
                    <span className="text-[#7a0f2d] dark:text-[#ffead1] font-mono text-xl whitespace-nowrap shrink-0 text-right">
                      {formatPrice(Math.max(0, cartTotals.totalPrice - (tradeInApplied ? tradeInApplied.price : 0)))}
                    </span>
                  </div>
                  {cartTotals.hasUnpricedItems && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400">
                      * В заказе есть позиции с ценой по запросу, менеджер уточнит их стоимость в WhatsApp.
                    </p>
                  )}
                </div>

                {/* Primary Button: WhatsApp Checkout */}
                <button
                  type="button"
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Оформить заказ через WhatsApp</span>
                </button>

                {/* Secondary Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <button
                    onClick={handleCopyOrder}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedNotification ? 'Текст заказа скопирован!' : 'Скопировать текст заказа'}</span>
                  </button>

                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline"
                  >
                    Очистить корзину
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
