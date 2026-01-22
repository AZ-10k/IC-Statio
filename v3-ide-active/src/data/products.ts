import productPlanner from "@/assets/product-planner.jpg";
import productNotebook from "@/assets/product-notebook.jpg";
import productTags from "@/assets/product-tags.jpg";
import productPen from "@/assets/product-pen.jpg";
import productWeekly from "@/assets/product-weekly.jpg";
import productNotes from "@/assets/product-notes.jpg";

export interface Product {
  id: string;
  name: string;
  priceDZD: number;
  image: string;
  images: string[];
  category: string;
  description: string;
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
    priceDZD: 6525,
    image: productPlanner,
    images: [productPlanner, productPlanner, productPlanner],
    category: "Planners",
    description: "Premium paper quality, crafted for professionals. Our 2026 Executive Planner features 365 days of carefully designed layouts, including monthly overviews, weekly spreads, and daily planning pages.",
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
    priceDZD: 5510,
    image: productWeekly,
    images: [productWeekly, productWeekly, productWeekly],
    category: "Planners",
    description: "Premium paper quality, crafted for professionals. Our Weekly Planner offers the perfect balance between detail and overview with spacious weekly layouts and goal-setting pages.",
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
    priceDZD: 5800,
    image: productPlanner,
    images: [productPlanner, productPlanner, productPlanner],
    category: "Planners",
    description: "Designed for students and educators. Runs from September to August with exam schedules, assignment trackers, and semester goal pages.",
    viewCount: 1650,
    purchaseCount: 120,
  },
  {
    id: "marble-notebook",
    name: "Marble Notebook",
    priceDZD: 4060,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    description: "Premium paper quality, crafted for professionals. This stunning marble-patterned notebook features 120 pages of smooth, fountain-pen friendly paper.",
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
    priceDZD: 5200,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    description: "Handcrafted genuine leather journal with 200 pages of ivory paper. Features a ribbon bookmark and elastic closure for a timeless writing experience.",
    viewCount: 1800,
    purchaseCount: 75,
  },
  {
    id: "dotted-notebook",
    name: "Dotted Grid Notebook",
    priceDZD: 3500,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    description: "Perfect for bullet journaling and sketching. 160 pages of premium dotted paper with lay-flat binding and numbered pages.",
    viewCount: 2300,
    purchaseCount: 110,
  },
  {
    id: "luxury-gift-tags",
    name: "Luxury Gift Tags",
    priceDZD: 1740,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    description: "Premium paper quality, crafted for professionals. Our luxury gift tags add an elegant finishing touch to any present. Set of 24 tags with gold foil accents.",
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
    priceDZD: 1500,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    description: "Beautiful botanical-inspired gift tags. Includes 30 tags in 6 different floral designs with matching twine ribbons.",
    viewCount: 750,
    purchaseCount: 55,
  },
  {
    id: "minimalist-gift-tags",
    name: "Minimalist Gift Tags",
    priceDZD: 1200,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    description: "Clean, modern design for the minimalist aesthetic. Set of 20 tags in neutral tones with simple geometric patterns.",
    viewCount: 680,
    purchaseCount: 42,
  },
  {
    id: "gold-gel-pen",
    name: "Gold Gel Pen",
    priceDZD: 2610,
    image: productPen,
    images: [productPen, productPen, productPen],
    category: "Accessories",
    description: "Write in style with our signature Gold Gel Pen. Features smooth-flowing ink, ergonomic grip, and a stunning gold-plated finish.",
    viewCount: 1250,
    purchaseCount: 85,
  },
  {
    id: "pastel-sticky-notes",
    name: "Pastel Sticky Notes Set",
    priceDZD: 2175,
    image: productNotes,
    images: [productNotes, productNotes, productNotes],
    category: "Accessories",
    description: "Brighten your workspace with our Pastel Sticky Notes Set. Includes 6 different colors with strong adhesive that won't damage your pages.",
    viewCount: 980,
    purchaseCount: 67,
  },
  {
    id: "washi-tape-set",
    name: "Decorative Washi Tape Set",
    priceDZD: 1800,
    image: productNotes,
    images: [productNotes, productNotes, productNotes],
    category: "Accessories",
    description: "Add creativity to your journals and planners. Set of 10 rolls featuring elegant patterns in coordinating colors.",
    viewCount: 1120,
    purchaseCount: 78,
  },
  // Bundle Products
  {
    id: "back-to-school-bundle",
    name: "Back to School Essentials Bundle",
    priceDZD: 15000, // Discounted price
    image: productPlanner,
    images: [productPlanner, productNotebook, productPen],
    category: "Bundles",
    description: "Complete stationery set for students including planner, notebooks, and writing instruments. Save 20% compared to buying individually!",
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
    priceDZD: 25000,
    image: productNotebook,
    images: [productNotebook, productPlanner, productPen, productTags],
    category: "Bundles",
    description: "Everything you need for a productive workspace. Premium planner, notebooks, pens, and organizational tools.",
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
    priceDZD: 18500,
    image: productTags,
    images: [productTags, productNotebook, productPen, productNotes],
    category: "Bundles",
    description: "Elegant gift set perfect for special occasions. Curated collection of premium stationery items beautifully packaged.",
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
