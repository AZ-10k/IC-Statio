import productPlanner from "@/assets/product-planner.jpg";
import productNotebook from "@/assets/product-notebook.jpg";
import productTags from "@/assets/product-tags.jpg";
import productPen from "@/assets/product-pen.jpg";
import productWeekly from "@/assets/product-weekly.jpg";
import productNotes from "@/assets/product-notes.jpg";

export interface Product {
  id: string;
  name: string;
  nameFR?: string;
  nameAR?: string;
  priceDZD: number;
  image: string;
  images: string[];
  category: string;
  categoryFR?: string;
  categoryAR?: string;
  description: string;
  descriptionFR?: string;
  descriptionAR?: string;
  badge?: "low-stock" | "new-arrival";
  stock?: number; // undefined means unlimited/in stock
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock";
  rating?: number; // 0-5 stars
  reviewCount?: number;
  viewCount?: number; // How many times this product has been viewed
  purchaseCount?: number; // How many times this product has been purchased
  featuredReview?: {
    text: string;
    author: string;
  };
  // Advanced filtering fields
  brand?: string;
  material?: string;
  size?: string;
  color?: string[];
  tags?: string[];

  // Bundle/product collection fields
  isBundle?: boolean;
  bundleItems?: {
    productId: string;
    quantity: number;
  }[];
  bundleDiscount?: number; // percentage discount for bundle
}

// EDIT PRODUCTS HERE
export const productData: Product[] = [
  {
    id: "2026-daily-planner",
    name: "2026 Executive Planner",
    nameFR: "Agenda Exécutif 2026",
    nameAR: "مخطط تنفيذي 2026",
    priceDZD: 6525,
    image: productPlanner,
    images: [productPlanner, productPlanner, productPlanner],
    category: "Planners",
    categoryFR: "Agendas",
    categoryAR: "مخططات",
    description: "Premium paper quality, crafted for professionals. Our 2026 Executive Planner features 365 days of carefully designed layouts, including monthly overviews, weekly spreads, and daily planning pages.",
    descriptionFR: "Qualité de papier premium, conçu pour les professionnels. Notre Agenda Exécutif 2026 comprend 365 jours de mises en page soigneusement conçues, y compris des aperçus mensuels, des plannings hebdomadaires et des pages de planification quotidiennes.",
    descriptionAR: "جودة ورق فاخرة، مصمم للمحترفين. يتميز مخططنا التنفيذي 2026 بـ 365 يومًا من التصميمات المدروسة بعناية، بما في ذلك نظرات عامة شهرية وجداول أسبوعية وصفحات تخطيط يومية.",
    badge: "low-stock",
    stock: 3,
    stockStatus: "low-stock",
    rating: 4.8,
    reviewCount: 127,
    viewCount: 2450,
    purchaseCount: 180,
    featuredReview: {
      text: "Absolutely love this planner! The paper quality is exceptional and the layout is perfect for my busy schedule.",
      author: "Sarah M."
    },
    brand: "Premium Collection",
    material: "Paper, Leather",
    size: "A4",
    color: ["Black", "Brown"],
    tags: ["executive", "professional", "leather"],
  },
  {
    id: "weekly-planner",
    name: "Weekly Planner",
    nameFR: "Agenda Hebdomadaire",
    nameAR: "مخطط أسبوعي",
    priceDZD: 5510,
    image: productWeekly,
    images: [productWeekly, productWeekly, productWeekly],
    category: "Planners",
    categoryFR: "Agendas",
    categoryAR: "مخططات",
    description: "Premium paper quality, crafted for professionals. Our Weekly Planner offers the perfect balance between detail and overview with spacious weekly layouts and goal-setting pages.",
    descriptionFR: "Qualité de papier premium, conçu pour les professionnels. Notre Agenda Hebdomadaire offre l'équilibre parfait entre détail et vue d'ensemble avec des mises en page hebdomadaires spacieuses et des pages de définition d'objectifs.",
    descriptionAR: "جودة ورق فاخرة، مصمم للمحترفين. يوفر مخططنا الأسبوعي التوازن المثالي بين التفاصيل والنظرة العامة مع تخطيطات أسبوعية واسعة وصفحات تحديد الأهداف.",
    viewCount: 1890,
    purchaseCount: 145,
    brand: "Weekly Essentials",
    material: "Premium Paper",
    size: "A5",
    color: ["Blue", "White"],
    tags: ["weekly", "planning", "bullet-journal"],
  },
  {
    id: "academic-planner",
    name: "Academic Planner 2025-2026",
    nameFR: "Agenda Académique 2025-2026",
    nameAR: "مخطط أكاديمي 2025-2026",
    priceDZD: 5800,
    image: productPlanner,
    images: [productPlanner, productPlanner, productPlanner],
    category: "Planners",
    categoryFR: "Agendas",
    categoryAR: "مخططات",
    description: "Designed for students and educators. Runs from September to August with exam schedules, assignment trackers, and semester goal pages.",
    descriptionFR: "Conçu pour les étudiants et les enseignants. Fonctionne de septembre à août avec des calendriers d'examens, des suivis de devoirs et des pages d'objectifs semestriels.",
    descriptionAR: "مصمم للطلاب والمعلمين. يمتد من سبتمبر إلى أغسطس مع جداول الامتحانات ومتابعة الواجبات وصفحات أهداف الفصل الدراسي.",
    viewCount: 1650,
    purchaseCount: 120,
  },
  {
    id: "marble-notebook",
    name: "Marble Notebook",
    nameFR: "Carnet Marbré",
    nameAR: "دفتر رخامي",
    priceDZD: 4060,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    categoryFR: "Carnets",
    categoryAR: "دفاتر",
    description: "Premium paper quality, crafted for professionals. This stunning marble-patterned notebook features 120 pages of smooth, fountain-pen friendly paper.",
    descriptionFR: "Qualité de papier premium, conçu pour les professionnels. Ce magnifique carnet à motif marbré comprend 120 pages de papier lisse, adapté aux stylos plume.",
    descriptionAR: "جودة ورق فاخرة، مصمم للمحترفين. يتميز هذا الدفتر الرائع بنمط رخامي بـ 120 صفحة من الورق الناعم المناسب للأقلام الحبر.",
    viewCount: 2100,
    purchaseCount: 95,
    brand: "Artisan Notebooks",
    material: "Premium Paper, Cardboard",
    size: "A5",
    color: ["Marble"],
    tags: ["marble", "artisan", "fountain-pen", "120-pages"],
  },
  {
    id: "leather-journal",
    name: "Leather Bound Journal",
    nameFR: "Journal Relié en Cuir",
    nameAR: "مذكرة جلدية",
    priceDZD: 5200,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    categoryFR: "Carnets",
    categoryAR: "دفاتر",
    description: "Handcrafted genuine leather journal with 200 pages of ivory paper. Features a ribbon bookmark and elastic closure for a timeless writing experience.",
    descriptionFR: "Journal en cuir véritable fait à la main avec 200 pages de papier ivoire. Comprend un marque-page ruban et une fermeture élastique pour une expérience d'écriture intemporelle.",
    descriptionAR: "مذكرة جلد أصلي مصنوعة يدويًا مع 200 صفحة من الورق العاجي. تتميز بإشارة مرجعية من الشريط وإغلاق مرن لتجربة كتابة خالدة.",
    viewCount: 1800,
    purchaseCount: 75,
  },
  {
    id: "dotted-notebook",
    name: "Dotted Grid Notebook",
    nameFR: "Carnet à Points",
    nameAR: "دفتر منقط",
    priceDZD: 3500,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    categoryFR: "Carnets",
    categoryAR: "دفاتر",
    description: "Perfect for bullet journaling and sketching. 160 pages of premium dotted paper with lay-flat binding and numbered pages.",
    descriptionFR: "Parfait pour le bullet journal et le dessin. 160 pages de papier pointillé premium avec reliure à plat et pages numérotées.",
    descriptionAR: "مثالي لليوميات النقطية والرسم. 160 صفحة من الورق المنقط الفاخر مع تجليد مسطح وصفحات مرقمة.",
    viewCount: 2300,
    purchaseCount: 110,
  },
  {
    id: "luxury-gift-tags",
    name: "Luxury Gift Tags",
    nameFR: "Étiquettes Cadeaux de Luxe",
    nameAR: "بطاقات هدايا فاخرة",
    priceDZD: 1740,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    categoryFR: "Étiquettes Cadeaux",
    categoryAR: "بطاقات هدايا",
    description: "Premium paper quality, crafted for professionals. Our luxury gift tags add an elegant finishing touch to any present. Set of 24 tags with gold foil accents.",
    descriptionFR: "Qualité de papier premium, conçu pour les professionnels. Nos étiquettes cadeaux de luxe ajoutent une touche finale élégante à tout cadeau. Ensemble de 24 étiquettes avec accents en feuille d'or.",
    descriptionAR: "جودة ورق فاخرة، مصممة للمحترفين. تضيف بطاقات الهدايا الفاخرة لمسة نهائية أنيقة لأي هدية. مجموعة من 24 بطاقة مع لمسات من رقائق الذهب.",
    badge: "new-arrival",
    stock: 12,
    stockStatus: "in-stock",
    rating: 5.0,
    reviewCount: 43,
    viewCount: 890,
    purchaseCount: 65,
    featuredReview: {
      text: "Perfect gift for stationery lovers. The packaging was beautiful and the product exceeded expectations.",
      author: "Mohamed T."
    },
    brand: "Luxury Tags",
    material: "Premium Cardstock, Gold Foil",
    size: "Standard",
    color: ["Gold", "White"],
    tags: ["luxury", "gift", "gold-foil", "premium"],
  },
  {
    id: "floral-gift-tags",
    name: "Floral Gift Tags Set",
    nameFR: "Ensemble d'Étiquettes Florales",
    nameAR: "مجموعة بطاقات زهرية",
    priceDZD: 1500,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    categoryFR: "Étiquettes Cadeaux",
    categoryAR: "بطاقات هدايا",
    description: "Beautiful botanical-inspired gift tags. Includes 30 tags in 6 different floral designs with matching twine ribbons.",
    descriptionFR: "Belles étiquettes cadeaux d'inspiration botanique. Comprend 30 étiquettes dans 6 designs floraux différents avec rubans assortis.",
    descriptionAR: "بطاقات هدايا جميلة مستوحاة من النباتات. تتضمن 30 بطاقة في 6 تصاميم زهرية مختلفة مع أشرطة متطابقة.",
    viewCount: 750,
    purchaseCount: 55,
  },
  {
    id: "minimalist-gift-tags",
    name: "Minimalist Gift Tags",
    nameFR: "Étiquettes Minimalistes",
    nameAR: "بطاقات بسيطة",
    priceDZD: 1200,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    categoryFR: "Étiquettes Cadeaux",
    categoryAR: "بطاقات هدايا",
    description: "Clean, modern design for the minimalist aesthetic. Set of 20 tags in neutral tones with simple geometric patterns.",
    descriptionFR: "Design épuré et moderne pour l'esthétique minimaliste. Ensemble de 20 étiquettes en tons neutres avec des motifs géométriques simples.",
    descriptionAR: "تصميم نظيف وعصري للجمالية البسيطة. مجموعة من 20 بطاقة بألوان محايدة مع أنماط هندسية بسيطة.",
    viewCount: 680,
    purchaseCount: 42,
  },
  {
    id: "gold-gel-pen",
    name: "Gold Gel Pen",
    nameFR: "Stylo Gel Doré",
    nameAR: "قلم جل ذهبي",
    priceDZD: 2610,
    image: productPen,
    images: [productPen, productPen, productPen],
    category: "Accessories",
    categoryFR: "Accessoires",
    categoryAR: "إكسسوارات",
    description: "Write in style with our signature Gold Gel Pen. Features smooth-flowing ink, ergonomic grip, and a stunning gold-plated finish.",
    descriptionFR: "Écrivez avec style avec notre stylo gel doré signature. Comprend une encre à écoulement fluide, une prise ergonomique et une finition plaquée or époustouflante.",
    descriptionAR: "اكتب بأناقة مع قلم الجل الذهبي المميز. يتميز بحبر سلس الانسياب، ومقبض مريح، ولمسة نهائية مطلية بالذهب مذهلة.",
    viewCount: 1250,
    purchaseCount: 85,
  },
  {
    id: "pastel-sticky-notes",
    name: "Pastel Sticky Notes Set",
    nameFR: "Notes Adhésives Pastel",
    nameAR: "ملاحظات لاصقة باستيل",
    priceDZD: 2175,
    image: productNotes,
    images: [productNotes, productNotes, productNotes],
    category: "Accessories",
    categoryFR: "Accessoires",
    categoryAR: "إكسسوارات",
    description: "Brighten your workspace with our Pastel Sticky Notes Set. Includes 6 different colors with strong adhesive that won't damage your pages.",
    descriptionFR: "Égayez votre espace de travail avec notre ensemble de notes adhésives pastel. Comprend 6 couleurs différentes avec un adhésif fort qui n'endommagera pas vos pages.",
    descriptionAR: "أضئ مساحة عملك مع مجموعة الملاحظات اللاصقة الباستيل. تتضمن 6 ألوان مختلفة مع مادة لاصقة قوية لن تتلف صفحاتك.",
    viewCount: 980,
    purchaseCount: 67,
  },
  {
    id: "washi-tape-set",
    name: "Decorative Washi Tape Set",
    nameFR: "Ensemble de Rubans Washi Décoratifs",
    nameAR: "مجموعة أشرطة واشي زخرفية",
    priceDZD: 1800,
    image: productNotes,
    images: [productNotes, productNotes, productNotes],
    category: "Accessories",
    categoryFR: "Accessoires",
    categoryAR: "إكسسوارات",
    description: "Add creativity to your journals and planners. Set of 10 rolls featuring elegant patterns in coordinating colors.",
    descriptionFR: "Ajoutez de la créativité à vos journaux et agendas. Ensemble de 10 rouleaux avec des motifs élégants dans des couleurs coordonnées.",
    descriptionAR: "أضف الإبداع إلى مذكراتك ومخططاتك. مجموعة من 10 لفات تتميز بأنماط أنيقة بألوان منسقة.",
    viewCount: 1120,
    purchaseCount: 78,
  },
  // Bundle Products
  {
    id: "back-to-school-bundle",
    name: "Back to School Essentials Bundle",
    nameFR: "Pack Essentiel Rentrée Scolaire",
    nameAR: "حزمة أساسيات العودة للمدرسة",
    priceDZD: 15000,
    image: productPlanner,
    images: [productPlanner, productNotebook, productPen],
    category: "Bundles",
    categoryFR: "Packs",
    categoryAR: "حزم",
    description: "Complete stationery set for students including planner, notebooks, and writing instruments. Save 20% compared to buying individually!",
    descriptionFR: "Ensemble complet de papeterie pour étudiants comprenant agenda, carnets et instruments d'écriture. Économisez 20% par rapport à l'achat individuel!",
    descriptionAR: "مجموعة قرطاسية كاملة للطلاب تشمل مخطط ودفاتر وأدوات كتابة. وفر 20٪ مقارنة بالشراء الفردي!",
    badge: "new-arrival",
    rating: 4.9,
    reviewCount: 87,
    brand: "Student Essentials",
    tags: ["bundle", "back-to-school", "student", "complete-set"],
    isBundle: true,
    bundleItems: [
      { productId: "2026-daily-planner", quantity: 1 },
      { productId: "marble-notebook", quantity: 2 },
      { productId: "gold-gel-pen", quantity: 1 }
    ],
    bundleDiscount: 20
  },
  {
    id: "office-setup-bundle",
    name: "Professional Office Setup Bundle",
    nameFR: "Pack Bureau Professionnel",
    nameAR: "حزمة مكتب احترافية",
    priceDZD: 25000,
    image: productNotebook,
    images: [productNotebook, productPlanner, productPen, productTags],
    category: "Bundles",
    categoryFR: "Packs",
    categoryAR: "حزم",
    description: "Everything you need for a productive workspace. Premium planner, notebooks, pens, and organizational tools.",
    descriptionFR: "Tout ce dont vous avez besoin pour un espace de travail productif. Agenda premium, carnets, stylos et outils d'organisation.",
    descriptionAR: "كل ما تحتاجه لمساحة عمل منتجة. مخطط فاخر ودفاتر وأقلام وأدوات تنظيمية.",
    rating: 4.8,
    reviewCount: 156,
    brand: "Office Pro",
    tags: ["bundle", "office", "professional", "productivity"],
    isBundle: true,
    bundleItems: [
      { productId: "2026-daily-planner", quantity: 1 },
      { productId: "leather-journal", quantity: 1 },
      { productId: "gold-gel-pen", quantity: 2 },
      { productId: "luxury-gift-tags", quantity: 1 }
    ],
    bundleDiscount: 25
  },
  {
    id: "gift-box-bundle",
    name: "Luxury Gift Box Set",
    nameFR: "Coffret Cadeau de Luxe",
    nameAR: "صندوق هدايا فاخر",
    priceDZD: 18500,
    image: productTags,
    images: [productTags, productNotebook, productPen, productNotes],
    category: "Bundles",
    categoryFR: "Packs",
    categoryAR: "حزم",
    description: "Elegant gift set perfect for special occasions. Curated collection of premium stationery items beautifully packaged.",
    descriptionFR: "Coffret cadeau élégant parfait pour les occasions spéciales. Collection soigneusement sélectionnée d'articles de papeterie premium magnifiquement emballés.",
    descriptionAR: "مجموعة هدايا أنيقة مثالية للمناسبات الخاصة. مجموعة منتقاة من أدوات القرطاسية الفاخرة معبأة بشكل جميل.",
    badge: "new-arrival",
    rating: 5.0,
    reviewCount: 43,
    brand: "Luxury Gifts",
    tags: ["bundle", "gift", "luxury", "special-occasion"],
    isBundle: true,
    bundleItems: [
      { productId: "leather-journal", quantity: 1 },
      { productId: "gold-gel-pen", quantity: 1 },
      { productId: "luxury-gift-tags", quantity: 2 },
      { productId: "pastel-sticky-notes", quantity: 1 }
    ],
    bundleDiscount: 15
  },
];

// Export products as alias for backward compatibility
export const products = productData;

export const getProductById = (id: string): Product | undefined => {
  return productData.find((product) => product.id === id);
};
