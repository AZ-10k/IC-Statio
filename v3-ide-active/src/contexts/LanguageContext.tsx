import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export type Language = "EN" | "FR" | "AR";

interface Translations {
  nav: {
    home: string;
    shop: string;
    ourStory: string;
    contact: string;
  };
  hero: {
    title1: string;
    title2: string;
    subtitle: string;
    shopButton: string;
    learnMore: string;
    shippingBanner: string;
  };
  products: {
    bestSellers: string;
    subtitle: string;
    viewAll: string;
    orderViaInstagram: string;
    noProductsFound: string;
    searchPlaceholder: string;
    descriptions: {
      [key: string]: string;
    };
  };
  search: {
    filters: string;
    clearAll: string;
    categories: string;
    priceRange: string;
    rating: string;
    viewAllResults: string;
    clearFilters: string;
    recentSearches: string;
    noRecentSearches: string;
  };
  categories: {
    all: string;
    planners: string;
    notebooks: string;
    giftTags: string;
    accessories: string;
  };
  productDetail: {
    backToCatalog: string;
    productNotFound: string;
    returnToCatalog: string;
    premiumQuality: string;
    shippingAll: string;
    securePackaging: string;
  };
  clientLove: {
    title: string;
    subtitle: string;
  };
  aboutUs: {
    title: string;
  };
  recentlyViewed: {
    title: string;
  };
  comparison: {
    title: string;
    product: string;
    price: string;
    rating: string;
    category: string;
    availability: string;
    actions: string;
    clearAll: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
  };
  footer: {
    catalog: string;
    company: string;
    legal: string;
    ourStory: string;
    faqs: string;
    shipping: string;
    shippingReturns: string;
    privacyPolicy: string;
    termsOfService: string;
    returns: string;
    description: string;
    madeWith: string;
    allRights: string;
    partnerBanner: string;
    partnerLink: string;
  };
  shippingPage: {
    title: string;
    shippingTitle: string;
    shippingContent: string;
    paymentTitle: string;
    paymentContent: string;
    returnsTitle: string;
    returnsContent: string;
  };
  floatingButton: {
    dmToOrder: string;
  };
  badges: {
    lowStock: string;
    newArrival: string;
  };
  wishlist: {
    addToWishlist: string;
    removeFromWishlist: string;
    moveAllToCart: string;
    movedToCart: string;
  };
  currency: string;
}

const translations: Record<Language, Translations> = {
  EN: {
    nav: {
      home: "Home",
      shop: "Shop",
      ourStory: "Our Story",
      contact: "Contact",
    },
    hero: {
      title1: "Plan Your Days,",
      title2: "Create Your Moments.",
      subtitle: "Elegant stationery, planners, and tags for the organized mind.",
      shopButton: "Shop the Collection",
      learnMore: "Learn More",
      shippingBanner: "Shipping available across all of Algeria (58 Wilayas)",
    },
    products: {
      bestSellers: "Best Sellers",
      subtitle: "Discover our most loved pieces, crafted with care and designed to inspire your everyday moments.",
      viewAll: "View All Products",
      orderViaInstagram: "Order via Instagram",
    noProductsFound: "No products found",
    searchPlaceholder: "Search products...",
    descriptions: {
      "2026-daily-planner": "Premium paper quality, crafted for professionals. Our 2026 Executive Planner features 365 days of carefully designed layouts, including monthly overviews, weekly spreads, and daily planning pages.",
      "weekly-planner": "Perfect for short-term planning. This weekly planner provides ample space for daily tasks, appointments, and notes with a clean, organized layout.",
      "luxury-gift-tags": "Elegant gift tags made from premium cardstock with gold foil accents. Perfect for adding a special touch to your gifts.",
      "marble-notebook": "Beautiful marble-patterned notebook with high-quality paper. Ideal for notes, sketches, and creative writing.",
    },
  },
    search: {
      filters: "Filters",
      clearAll: "Clear All",
      categories: "Categories",
      priceRange: "Price Range",
      rating: "Rating",
      viewAllResults: "View all results",
      clearFilters: "Clear filters",
      recentSearches: "Recent Searches",
      noRecentSearches: "No recent searches",
    },
    categories: {
      all: "All",
      planners: "Planners",
      notebooks: "Notebooks",
      giftTags: "Gift Tags",
      accessories: "Accessories",
    },
    productDetail: {
      backToCatalog: "Back to Catalog",
      productNotFound: "Product Not Found",
      returnToCatalog: "← Return to Catalog",
      premiumQuality: "Premium quality materials",
      shippingAll: "Shipping across all 58 Wilayas",
      securePackaging: "Secure packaging",
    },
    clientLove: {
      title: "Client Love",
      subtitle: "Hear what our customers say about their experience with Statio.",
    },
    aboutUs: {
      title: "Our Story",
    },
    recentlyViewed: {
      title: "Recently Viewed",
    },
    comparison: {
      title: "Product Comparison",
      product: "Product",
      price: "Price",
      rating: "Rating",
      category: "Category",
      availability: "Availability",
      actions: "Actions",
      clearAll: "Clear All",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Have a question or want to place a custom order? We'd love to hear from you.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
    },
    footer: {
      catalog: "Catalog",
      company: "Company",
      legal: "Legal",
      ourStory: "Our Story",
      faqs: "FAQs",
      shipping: "Shipping",
      shippingReturns: "Shipping & Returns",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      returns: "Returns",
      description: "Elegant stationery, planners, and tags for the organized mind. Crafted with love and attention to detail.",
      madeWith: "Made with ♥ for the organized soul",
      allRights: "All rights reserved.",
      partnerBanner: "Looking for personalized boxes?",
      partnerLink: "Visit our partner brand Instant Créatif",
    },
    shippingPage: {
      title: "Shipping & Returns",
      shippingTitle: "Shipping",
      shippingContent: "Shipping via ZR Express to all 58 Wilayas across Algeria",
      paymentTitle: "Payment",
      paymentContent: "Payment: BaridiMob, CCP, or Cash on Delivery",
      returnsTitle: "Returns",
      returnsContent: "Returns accepted within 48 hours of delivery",
    },
    floatingButton: {
      dmToOrder: "DM us to Order",
    },
    badges: {
      lowStock: "Low Stock",
      newArrival: "New Arrival",
    },
    wishlist: {
      addToWishlist: "Add to wishlist",
      removeFromWishlist: "Remove from wishlist",
      moveAllToCart: "Move All to Cart",
      movedToCart: "Items moved to cart!",
    },
    currency: "Currency",
  },
  FR: {
    nav: {
      home: "Accueil",
      shop: "Boutique",
      ourStory: "Notre Histoire",
      contact: "Contact",
    },
    hero: {
      title1: "Planifiez vos journées,",
      title2: "Créez vos moments.",
      subtitle: "Papeterie élégante, planners et étiquettes pour l'esprit organisé.",
      shopButton: "Voir la Collection",
      learnMore: "En Savoir Plus",
      shippingBanner: "Livraison disponible dans toute l'Algérie (58 Wilayas)",
    },
    products: {
      bestSellers: "Meilleures Ventes",
      subtitle: "Découvrez nos pièces les plus aimées, fabriquées avec soin et conçues pour inspirer vos moments quotidiens.",
      viewAll: "Voir Tous les Produits",
      orderViaInstagram: "Commander sur Instagram",
      noProductsFound: "Aucun produit trouvé",
      searchPlaceholder: "Rechercher...",
      descriptions: {
        "2026-daily-planner": "Qualité de papier premium, conçue pour les professionnels. Notre Planificateur Exécutif 2026 propose 365 jours de mises en page soigneusement conçues, incluant des aperçus mensuels, des spreads hebdomadaires et des pages de planification quotidiennes.",
        "weekly-planner": "Parfait pour la planification à court terme. Ce planificateur hebdomadaire offre beaucoup d'espace pour les tâches quotidiennes, rendez-vous et notes avec une mise en page propre et organisée.",
        "luxury-gift-tags": "Étiquettes cadeaux élégantes fabriquées à partir de carton premium avec accents en feuille d'or. Parfaites pour ajouter une touche spéciale à vos cadeaux.",
        "marble-notebook": "Magnifique cahier à motif marbré avec du papier de haute qualité. Idéal pour les notes, croquis et écriture créative.",
      },
    },
    search: {
      filters: "Filtres",
      clearAll: "Tout Effacer",
      categories: "Catégories",
      priceRange: "Prix",
      rating: "Évaluation",
      viewAllResults: "Voir tous les résultats",
      clearFilters: "Effacer les filtres",
      recentSearches: "Recherches récentes",
      noRecentSearches: "Aucune recherche récente",
    },
    categories: {
      all: "Tout",
      planners: "Planners",
      notebooks: "Carnets",
      giftTags: "Étiquettes",
      accessories: "Accessoires",
    },
    productDetail: {
      backToCatalog: "Retour au Catalogue",
      productNotFound: "Produit Non Trouvé",
      returnToCatalog: "← Retour au Catalogue",
      premiumQuality: "Matériaux de qualité premium",
      shippingAll: "Livraison dans les 58 Wilayas",
      securePackaging: "Emballage sécurisé",
    },
    clientLove: {
      title: "Avis Clients",
      subtitle: "Découvrez ce que nos clients disent de leur expérience avec Statio.",
    },
    aboutUs: {
      title: "Notre Histoire",
    },
    recentlyViewed: {
      title: "Récemment Consultés",
    },
    comparison: {
      title: "Comparaison de Produits",
      product: "Produit",
      price: "Prix",
      rating: "Évaluation",
      category: "Catégorie",
      availability: "Disponibilité",
      actions: "Actions",
      clearAll: "Tout Effacer",
    },
    contact: {
      title: "Contactez-nous",
      subtitle: "Une question ou une commande personnalisée? Nous serions ravis de vous entendre.",
      name: "Nom",
      email: "Email",
      message: "Message",
      send: "Envoyer",
    },
    footer: {
      catalog: "Catalogue",
      company: "Entreprise",
      legal: "Légal",
      ourStory: "Notre Histoire",
      faqs: "FAQ",
      shipping: "Livraison",
      shippingReturns: "Livraison & Retours",
      privacyPolicy: "Politique de Confidentialité",
      termsOfService: "Conditions d'Utilisation",
      returns: "Retours",
      description: "Papeterie élégante, planners et étiquettes pour l'esprit organisé. Fabriqué avec amour et attention aux détails.",
      madeWith: "Fait avec ♥ pour l'âme organisée",
      allRights: "Tous droits réservés.",
      partnerBanner: "À la recherche de boîtes personnalisées?",
      partnerLink: "Visitez notre marque partenaire Instant Créatif",
    },
    shippingPage: {
      title: "Livraison & Retours",
      shippingTitle: "Livraison",
      shippingContent: "Livraison via ZR Express vers les 58 Wilayas à travers l'Algérie",
      paymentTitle: "Paiement",
      paymentContent: "Paiement: BaridiMob, CCP, ou Paiement à la livraison",
      returnsTitle: "Retours",
      returnsContent: "Retours acceptés dans les 48 heures suivant la livraison",
    },
    floatingButton: {
      dmToOrder: "Commandez par DM",
    },
    badges: {
      lowStock: "Stock Limité",
      newArrival: "Nouveauté",
    },
    wishlist: {
      addToWishlist: "Ajouter à la liste de souhaits",
      removeFromWishlist: "Retirer de la liste de souhaits",
      moveAllToCart: "Tout ajouter au panier",
      movedToCart: "Articles ajoutés au panier!",
    },
    currency: "Devise",
  },
  AR: {
    nav: {
      home: "الرئيسية",
      shop: "المتجر",
      ourStory: "قصتنا",
      contact: "اتصل بنا",
    },
    hero: {
      title1: "خطط ليومك،",
      title2: "اصنع لحظاتك.",
      subtitle: "قرطاسية أنيقة ومخططات وعلامات للعقل المنظم.",
      shopButton: "تسوق المجموعة",
      learnMore: "اعرف المزيد",
      shippingBanner: "التوصيل متاح في جميع أنحاء الجزائر (58 ولاية)",
    },
    products: {
      bestSellers: "الأكثر مبيعاً",
      subtitle: "اكتشف قطعنا المفضلة، المصنوعة بعناية والمصممة لإلهام لحظاتك اليومية.",
      viewAll: "عرض جميع المنتجات",
      orderViaInstagram: "اطلب عبر انستغرام",
      noProductsFound: "لم يتم العثور على منتجات",
      searchPlaceholder: "ابحث عن منتجات...",
      descriptions: {
        "2026-daily-planner": "جودة ورق مميزة، مصممة للمحترفين. مخططنا التنفيذي 2026 يوفر 365 يوماً من التخطيطات المصممة بعناية، بما في ذلك نظرة شهرية، جداول أسبوعية، وصفحات تخطيط يومية.",
        "weekly-planner": "مثالي للتخطيط قصير الأمد. يوفر هذا المخطط الأسبوعي مساحة كافية للمهام اليومية، المواعيد، والملاحظات مع تخطيط نظيف ومنظم.",
        "luxury-gift-tags": "علامات هدايا أنيقة مصنوعة من الكرتون المميز مع لمسات ذهبية. مثالية لإضافة لمسة خاصة لهداياك.",
        "marble-notebook": "دفتر جميل بتصميم رخامي مع ورق عالي الجودة. مثالي للملاحظات، الرسومات، والكتابة الإبداعية.",
      },
    },
    search: {
      filters: "التصفية",
      clearAll: "مسح الكل",
      categories: "الفئات",
      priceRange: "نطاق السعر",
      rating: "التقييم",
      viewAllResults: "عرض جميع النتائج",
      clearFilters: "مسح التصفية",
      recentSearches: "عمليات البحث الأخيرة",
      noRecentSearches: "لا توجد عمليات بحث حديثة",
    },
    categories: {
      all: "الكل",
      planners: "المخططات",
      notebooks: "الدفاتر",
      giftTags: "بطاقات الهدايا",
      accessories: "الإكسسوارات",
    },
    productDetail: {
      backToCatalog: "العودة للكتالوج",
      productNotFound: "المنتج غير موجود",
      returnToCatalog: "← العودة للكتالوج",
      premiumQuality: "مواد عالية الجودة",
      shippingAll: "التوصيل لجميع الولايات الـ58",
      securePackaging: "تغليف آمن",
    },
    clientLove: {
      title: "آراء العملاء",
      subtitle: "اكتشف ما يقوله عملاؤنا عن تجربتهم مع Statio.",
    },
    aboutUs: {
      title: "قصتنا",
    },
    recentlyViewed: {
      title: "المنتجات المُشاهدة مؤخراً",
    },
    comparison: {
      title: "مقارنة المنتجات",
      product: "المنتج",
      price: "السعر",
      rating: "التقييم",
      category: "الفئة",
      availability: "التوفر",
      actions: "الإجراءات",
      clearAll: "مسح الكل",
    },
    contact: {
      title: "تواصل معنا",
      subtitle: "هل لديك سؤال أو تريد طلب مخصص؟ نحب أن نسمع منك.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      send: "إرسال",
    },
    footer: {
      catalog: "الكتالوج",
      company: "الشركة",
      legal: "قانوني",
      ourStory: "قصتنا",
      faqs: "الأسئلة الشائعة",
      shipping: "الشحن",
      shippingReturns: "الشحن والإرجاع",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      returns: "الإرجاع",
      description: "قرطاسية أنيقة ومخططات وعلامات للعقل المنظم. مصنوعة بحب واهتمام بالتفاصيل.",
      madeWith: "صنع بـ ♥ للروح المنظمة",
      allRights: "جميع الحقوق محفوظة.",
      partnerBanner: "تبحث عن صناديق مخصصة؟",
      partnerLink: "قم بزيارة علامتنا الشريكة Instant Créatif",
    },
    shippingPage: {
      title: "الشحن والإرجاع",
      shippingTitle: "الشحن",
      shippingContent: "الشحن عبر ZR Express إلى جميع الولايات الـ58 في الجزائر",
      paymentTitle: "الدفع",
      paymentContent: "الدفع: بريدي موب، CCP، أو الدفع عند الاستلام",
      returnsTitle: "الإرجاع",
      returnsContent: "قبول الإرجاع خلال 48 ساعة من التسليم",
    },
    floatingButton: {
      dmToOrder: "راسلنا للطلب",
    },
    badges: {
      lowStock: "مخزون محدود",
      newArrival: "وصل حديثاً",
    },
    wishlist: {
      addToWishlist: "أضف إلى قائمة الأمنيات",
      removeFromWishlist: "إزالة من قائمة الأمنيات",
      moveAllToCart: "نقل الكل إلى السلة",
      movedToCart: "تم نقل العناصر إلى السلة!",
    },
    currency: "العملة",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "statio-language";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {

  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get initial language from localStorage only (window.location breaks React Router)
    const savedLang = localStorage.getItem("language");
    if (savedLang && (savedLang.toUpperCase() === "EN" || savedLang.toUpperCase() === "FR" || savedLang.toUpperCase() === "AR")) {
      return savedLang.toUpperCase() as Language;
    }
    
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && (saved === "EN" || saved === "FR" || saved === "AR")) {
        return saved as Language;
      }
    } catch (error) {
      // Ignore localStorage errors
    }
    
    return "EN";
  });

  
  // Persist to localStorage when language changes
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save language to localStorage:", error);
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    // Dispatch custom event for RTLProvider to listen to
    window.dispatchEvent(new CustomEvent("languageUpdated", { detail: { language: lang } }));
  };

  const t = translations[language];
  const isRTL = language === "AR";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
