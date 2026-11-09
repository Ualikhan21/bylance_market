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
  Sparkles
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
  formatPrice
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
  className?: string;
  containerClassName?: string;
  size?: 'normal' | 'thumb';
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  size = 'normal'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
  }, [src]);

  const roundedCls = size === 'thumb' ? 'rounded-lg' : 'rounded-2xl';

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${roundedCls} ${containerClassName}`}>
      {/* Loading Skeleton & Spinner Indicator */}
      {!loaded && !hasError && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/70 dark:from-[#151926] dark:to-[#1f2638] animate-pulse z-10 transition-opacity duration-300 ${roundedCls}`}>
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Loader2 className={`${size === 'thumb' ? 'w-4 h-4 text-[#5B0601] dark:text-rose-400' : 'w-7 h-7 text-[#5B0601] dark:text-rose-400'} animate-spin`} />
            {size !== 'thumb' && (
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide">
                Загрузка фото...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Fallback in case of broken link */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-2 text-center">
          <span className="text-xl">📱</span>
          <span className="text-[10px] mt-1 line-clamp-1">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} ${roundedCls} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
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
    answer: 'В магазине Bylance по программе Trade-In принимаются исключительно оригинальные Apple iPhone!\n\n• Оценка в офисе: точную и итоговую оценку состояния телефона (экран, корпус, True Tone, Face ID, процент износа АКБ) делает наш специалист лично в офисе в Алматы (пр. Абылай хана).\n• Онлайн-оценка через сайт: вы также можете предварительно попробовать рассчитать стоимость вашего iPhone онлайн через форму оценки на сайте (ссылка ниже) либо отправив фото и характеристики в WhatsApp.\n• Доплата: остаток стоимости любого нового устройства вы можете доплатить наличными с максимальной скидкой или оформить в рассрочку Kaspi / Halyk (0-0-12 / 0-0-24).\n\nВсе проверенные б/у iPhone, принятые по Trade-In, с реальными фото и процентом АКБ публикуются в нашем официальном Telegram-канале.',
    hasTradeInLinks: true,
  },
  {
    id: 'faq-1',
    question: 'Как работает рассрочка Kaspi и Halyk (0-0-12 / 0-0-24)?',
    answer: 'Оформление происходит через приложения Kaspi.kz и Halyk Bank на 3, 6, 12 или 24 месяца без процентов и скрытых переплат. Заявку можно оформить удаленно через менеджера в WhatsApp либо при личном визите в наш офис в Алматы.'
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
    answer: 'Наш офис расположен в г. Алматы на проспекте Абылай хана. Вы можете приехать к нам лично, вскрыть и проверить запечатанную коробку, активировать устройство на месте и оплатить удобным способом.'
  },
  {
    id: 'faq-7',
    question: 'Где посмотреть каталог проверенной Б/У техники по Trade-In?',
    answer: 'Вся проверенная Б/У техника и устройства, принятые по программе Trade-In, выкладываются исключительно в нашем Telegram-канале с подробными живыми фотографиями, процентом АКБ и актуальными ценами.',
    hasTelegramLink: true,
  }
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
    lines.push(`Итого: ${formattedTotal}${totalSuffix}.`);

    return lines.join('\n');
  }, [cart, cartTotals]);

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

            {/* Logo & Brand: 'Bylance' is pure white in dark mode */}
            <a href="#" className="flex items-center gap-2.5 focus-visible:outline-none">
              <img
                src={logoSrc}
                alt={SITE_INFO.shopName}
                className="h-8 sm:h-10 w-auto object-contain rounded-lg shadow-sm"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#5B0601] dark:text-white transition-colors">
                  {SITE_INFO.shopName}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Электроника в Алматы
                </span>
              </div>
            </a>
          </div>

          {/* Top Header Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <a
              href="#catalog"
              className="py-1 px-2 rounded-lg hover:text-[#5B0601] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Каталог
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">·</span>
            <a
              href="#faq"
              className="py-1 px-2 rounded-lg hover:text-[#5B0601] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              FAQ
            </a>
            <span className="text-slate-300 dark:text-slate-700 select-none">·</span>
            <a
              href="#contacts"
              className="py-1 px-2 rounded-lg hover:text-[#5B0601] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              О нас
            </a>
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
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#5B0601]" />}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-all flex items-center gap-2 font-semibold text-xs sm:text-sm"
              aria-label="Открыть корзину"
            >
              <ShoppingCart className="w-4 h-4 text-[#5B0601] dark:text-white" />
              <span className="hidden sm:inline">Корзина</span>
              {cartTotals.totalCount > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-black rounded-full bg-[#5B0601] text-white">
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
              <span className="font-black text-xl text-[#5B0601] dark:text-white">
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
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#5B0601] text-white dark:bg-white dark:text-slate-900'
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
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'apple'
                    ? 'bg-[#5B0601] text-white dark:bg-white dark:text-slate-900'
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
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'dyson'
                    ? 'bg-[#5B0601] text-white dark:bg-white dark:text-slate-900'
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
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCategory === 'other'
                    ? 'bg-[#5B0601] text-white dark:bg-white dark:text-slate-900'
                    : 'hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Фото и гаджеты</span>
                <span className="text-[11px] opacity-70">
                  ({PRODUCT_MODELS.filter((p) => p.category === 'other').length})
                </span>
              </button>
            </div>

            {/* Sections in Store */}
            <div className="space-y-1 pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Разделы магазина:
              </span>
              <a
                href="#catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Каталог товаров
              </a>
              <a
                href="#trade-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between"
              >
                <span>Программа Trade-In</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold">Обмен</span>
              </a>
              <a
                href="#founder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between"
              >
                <span>Аружан Жеткерген</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-bold">Основательница</span>
              </a>
              <a
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Частые вопросы (FAQ)
              </a>
              <a
                href="#contacts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Контакты в Алматы
              </a>
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8 sm:space-y-10">

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
                className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B0601]/20 dark:focus:ring-white/20 shadow-xs"
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

          {/* TRADE-IN BANNER & HIGHLIGHT (UP AT TOP) */}
          <div id="trade-in" className="scroll-mt-20 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 dark:from-amber-950/30 dark:via-rose-950/30 dark:to-amber-950/30 border border-amber-300/60 dark:border-amber-700/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white leading-snug">
                  Обменяйте старый iPhone на любую новую технику с доплатой
                </h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Принимаются только Apple iPhone · Онлайн-оценка за 5 минут у сотрудника
                </p>
              </div>
            </div>

            <a
              href="https://bylance.kz/trade-in"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95 whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>Онлайн-оценка на сайте ↗</span>
            </a>
          </div>

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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? m.id === 'cash'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-[#5B0601] text-white border-[#5B0601] dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
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
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 min-h-[40px] flex items-center justify-center active:scale-95 ${
                selectedCategory === 'all'
                  ? 'bg-[#5B0601] text-white border-[#5B0601] shadow-sm dark:bg-white dark:text-slate-900 dark:border-white'
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
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 min-h-[40px] flex items-center justify-center active:scale-95 ${
                    isSelected
                      ? 'bg-[#5B0601] text-white border-[#5B0601] shadow-sm dark:bg-white dark:text-slate-900 dark:border-white'
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
                <Filter className="w-3.5 h-3.5 text-[#5B0601] dark:text-rose-400" />
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
                className="text-xs font-bold text-[#5B0601] dark:text-rose-400 hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

                return (
                  <div
                    key={model.id}
                    className="rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Product Studio Photo Container */}
                      <div className="w-full aspect-square bg-[#f5f6f8] dark:bg-[#181d2a] p-4 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-white/5">
                        <ProductImage
                          src={displayImage}
                          alt={model.name}
                          className="w-full h-full object-contain rounded-2xl mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                        />
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

                        {/* SELECTOR: COLOR SELECTION WITH MINI PICTURE THUMBNAILS */}
                        {model.colorOptions && model.colorOptions.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Цвет:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white truncate ml-2">
                                {activeColor?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                              {model.colorOptions.map((col) => {
                                const isColSel = activeColor?.id === col.id;
                                return (
                                  <button
                                    key={col.id}
                                    type="button"
                                    onClick={() => updateCardSelection(model.id, { colorId: col.id })}
                                    title={col.name}
                                    className={`group/color relative p-0.5 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 active:scale-95 ${
                                      isColSel
                                        ? 'border-[#5B0601] dark:border-rose-400 ring-2 ring-[#5B0601]/25 dark:ring-rose-400/30 scale-105 shadow-xs'
                                        : 'border-slate-200/90 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30'
                                    }`}
                                  >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-[#1a2030] flex items-center justify-center relative">
                                      <img
                                        src={col.image}
                                        alt={col.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform group-hover/color:scale-110"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                      {col.hex && (
                                        <span
                                          className="w-3 h-3 rounded-full border border-black/15 dark:border-white/20 absolute bottom-0.5 right-0.5 shadow-xs pointer-events-none"
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
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                                      isSel
                                        ? 'bg-[#5B0601] text-white border-[#5B0601] dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
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
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                                      isSel
                                        ? 'bg-[#5B0601] text-white border-[#5B0601] dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
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
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                                      isSel
                                        ? 'bg-[#5B0601] text-white border-[#5B0601] dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
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

                    {/* Bottom: Payment Selector + Active Variant Price + 2 ACTION BUTTONS (Pinned at same height on every card) */}
                    <div className="p-4 sm:p-5 pt-3.5 border-t border-slate-100 dark:border-white/10 space-y-3 bg-slate-50/50 dark:bg-[#141926]/50 mt-auto">
                      
                      {/* SELECTOR 4: INDIVIDUAL PAYMENT METHOD (ALWAYS PINNED TO BOTTOM ROW) */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          Оплата для этого товара:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {PAYMENT_METHODS.map((pm) => {
                            const isSel = itemPayment === pm.id;
                            return (
                              <button
                                key={pm.id}
                                type="button"
                                onClick={() => updateCardSelection(model.id, { paymentMethod: pm.id })}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border flex items-center gap-1.5 truncate ${
                                  isSel
                                    ? pm.id === 'cash'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500 shadow-xs'
                                      : 'bg-rose-50 text-[#5B0601] border-[#5B0601] dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-700'
                                    : 'bg-white dark:bg-[#181d2a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300'
                                }`}
                              >
                                <PaymentMethodIcon method={pm.id} className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{pm.shortLabel}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="font-medium truncate">{activeVariant.fullName}</span>
                          <span className={`font-bold shrink-0 flex items-center gap-1 ${
                            itemPayment === 'cash' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#5B0601] dark:text-rose-300'
                          }`}>
                            <PaymentMethodIcon method={itemPayment} className="w-3.5 h-3.5 shrink-0" />
                            <span>{activeMethodObj.name}</span>
                          </span>
                        </div>

                        {currentPrice !== null && currentPrice !== undefined ? (
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-2xl font-black text-[#5B0601] dark:text-white font-mono whitespace-nowrap shrink-0">
                              {formatPrice(currentPrice)}
                            </span>
                            {itemPayment === 'cash' && activeVariant.prices.kaspi && (
                              <span className="text-xs font-bold text-rose-500 dark:text-rose-400 line-through whitespace-nowrap decoration-rose-500">
                                {formatPrice(activeVariant.prices.kaspi)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                              Цена по запросу
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                              Уточняйте в WhatsApp
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 2 Buttons: Direct 1-Click WhatsApp Order + Add to Cart */}
                      <div className="space-y-2">
                        {/* Button 1: Order Now Directly via WhatsApp */}
                        <button
                          type="button"
                          onClick={() => handleOrderNowWhatsApp(model, activeVariant, itemPayment, activeColor)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                          <Zap className="w-4 h-4 fill-current" />
                          <span>Заказать сразу в WhatsApp</span>
                        </button>

                        {/* Button 2: Add to multi-product Cart */}
                        <button
                          type="button"
                          onClick={() => addToCart(model, activeVariant, itemPayment, activeColor)}
                          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1e2436] dark:hover:bg-[#283149] transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 active:scale-[0.99]"
                        >
                          <ShoppingCart className="w-4 h-4 text-[#5B0601] dark:text-white" />
                          <span>
                            {cartQty > 0
                              ? `В корзине (${cartQty} шт.) +`
                              : 'В корзину'}
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ====================================================================== */}
        {/* FOUNDER & STORE STORY: АРУЖАН ЖЕТКЕРГЕН                                */}
        {/* ====================================================================== */}
        {/* ====================================================================== */}
        {/* FOUNDER & STORE STORY: АРУЖАН ЖЕТКЕРГЕН                                */}
        {/* ====================================================================== */}
        <section id="founder" className="scroll-mt-20 rounded-3xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
            
            {/* PHOTO FIELD WITH LUXURY GRADIENT EFFECT */}
            <div className="relative group shrink-0 self-center lg:self-start">
              {/* Outer Radiant Ambient Gradient Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#5B0601]/40 via-rose-500/35 via-amber-400/30 to-[#229ED9]/35 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              {/* Iridescent Gradient Border Ring */}
              <div className="p-1 rounded-[28px] bg-gradient-to-tr from-[#5B0601] via-rose-500 via-amber-400 to-[#229ED9] shadow-xl">
                {/* Photo Container Frame */}
                <div className="relative w-40 h-52 sm:w-48 sm:h-60 md:w-52 md:h-64 rounded-[24px] overflow-hidden bg-gradient-to-b from-slate-900 to-black flex items-center justify-center">
                  
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
                    className="absolute inset-0 hidden flex-col items-center justify-center p-4 text-center bg-gradient-to-tr from-[#5B0601] via-rose-950 to-slate-900 text-white"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-[#5B0601] flex items-center justify-center text-white font-black text-2xl shadow-lg ring-2 ring-white/20 mb-2">
                      АЖ
                    </div>
                    <span className="text-xs font-black tracking-tight">Аружан Жеткерген</span>
                    <span className="text-[10px] text-amber-300 font-bold mt-0.5">@zaagaru</span>
                  </div>

                  {/* Aesthetic Bottom Gradient Fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                  {/* Floating Identity Badge on Photo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
                    <div className="px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-center shadow-xs">
                      <span className="text-[11px] font-black text-white block leading-tight truncate">
                        {SITE_INFO.founder?.name || 'Аружан Жеткерген'}
                      </span>
                      <span className="text-[9px] text-amber-300 font-extrabold uppercase tracking-wider block mt-0.5">
                        Основательница Bylance
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* BIO & TEXT INFO */}
            <div className="space-y-3.5 flex-1 min-w-0 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#5B0601] dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900/50">
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
                  <div className="w-8 h-8 rounded-lg bg-[#5B0601] text-white flex items-center justify-center font-black text-xs">
                    BY
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-[#5B0601] transition-colors">
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
            <span className="text-xs font-bold text-[#5B0601] dark:text-rose-400 uppercase tracking-wider">
              Помощь покупателю
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Часто задаваемые вопросы (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
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
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-[#5B0601] dark:hover:text-rose-300 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#5B0601] dark:text-white' : 'text-slate-400'
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
                          <a
                            href="https://bylance.kz/trade-in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Онлайн-оценка на сайте ↗</span>
                          </a>

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

                          <a
                            href="#catalog"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
                          >
                            <span>Перейти в каталог</span>
                          </a>
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
                  По программе Trade-In принимаются только Apple iPhone. Точную оценку сделает сотрудник в офисе или онлайн!
                </p>
              </div>

              <a
                href="https://bylance.kz/trade-in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 whitespace-nowrap w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Онлайн-оценка на сайте ↗</span>
              </a>
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
              <ShieldCheck className="w-6 h-6 text-[#5B0601] dark:text-rose-400" />
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
        {/* 8. CONTACTS SECTION                                                    */}
        {/* ====================================================================== */}
        <section id="contacts" className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#5B0601] dark:text-rose-400 uppercase tracking-wider">
                Контакты
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Магазин Bylance в Алматы
              </h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/10 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">Адрес офиса:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {SITE_INFO.address}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">График работы:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {SITE_INFO.hours}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block text-xs">Телефон и WhatsApp:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {SITE_INFO.whatsappFormatted}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================== */}
      {/* 9. FOOTER                                                              */}
      {/* ====================================================================== */}
      <footer className="mt-12 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0a0d14] py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#5B0601] dark:text-white text-sm">
              {SITE_INFO.shopName}
            </span>
            <span>·</span>
            <span>Магазин оригинальной электроники в Алматы</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href="#founder" className="hover:text-slate-900 dark:hover:text-white transition-colors">
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
      {/* 10. FLOATING BOTTOM BAR (NOWRAP PRICE, PERFECT MOBILE/TABLET FIT)      */}
      {/* ====================================================================== */}
      {cartTotals.totalCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto">
          <div className="bg-[#5B0601] dark:bg-rose-950 text-white rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between gap-3 border border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-black text-sm shrink-0">
                {cartTotals.totalCount}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-rose-200 block truncate">
                  В корзине
                </span>
                <span className="text-base sm:text-lg font-black font-mono whitespace-nowrap inline-block">
                  {cartTotals.totalPrice > 0 ? formatPrice(cartTotals.totalPrice) : 'По запросу'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white text-[#5B0601] font-bold text-xs sm:text-sm hover:bg-rose-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            >
              <span>В корзину</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121622] text-slate-900 dark:text-white h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col z-10 transition-transform overscroll-contain touch-pan-y">
            
            {/* Header (Non-scrolling) */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#5B0601] dark:text-rose-400" />
                <h2 className="text-lg font-black tracking-tight">
                  Корзина товаров
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 font-bold text-slate-600 dark:text-slate-300">
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
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#181d2a] border-b border-slate-200/80 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
              Вы можете выбрать разный способ оплаты для каждого товара (например, один через Kaspi, другой за наличные).
            </div>

            {/* Cart Items List (Smooth, isolated scroll on mobile & tablet) */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3.5 -webkit-overflow-scrolling-touch touch-pan-y">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                    В корзине пока ничего нет
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Выберите нужные товары в каталоге и добавьте их в корзину для быстрой отправки заказа в WhatsApp.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#5B0601] text-white text-xs font-bold hover:bg-[#780c05] transition-colors"
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
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-[#121622] p-1 shrink-0 overflow-hidden border border-slate-200/60 dark:border-white/5 flex items-center justify-center">
                          <ProductImage
                            src={item.image}
                            alt={item.fullName}
                            size="thumb"
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
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
                                      : 'bg-[#5B0601] text-white border-[#5B0601] dark:bg-rose-600 dark:border-rose-600 shadow-xs'
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
                            className="p-1 rounded bg-[#5B0601] text-white hover:bg-[#780c05]"
                            aria-label="Увеличить количество"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black font-mono text-[#5B0601] dark:text-rose-400 whitespace-nowrap shrink-0">
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
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-3 text-base sm:text-lg font-black">
                    <span className="text-slate-900 dark:text-white shrink-0">Итого к оплате:</span>
                    <span className="text-[#5B0601] dark:text-white font-mono text-xl whitespace-nowrap shrink-0 text-right">
                      {formatPrice(cartTotals.totalPrice)}
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
