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
  },
  {
    id: "weekly-planner",
    name: "Weekly Planner",
    priceDZD: 5510,
    image: productWeekly,
    images: [productWeekly, productWeekly, productWeekly],
    category: "Planners",
    description: "Premium paper quality, crafted for professionals. Our Weekly Planner offers the perfect balance between detail and overview with spacious weekly layouts and goal-setting pages.",
  },
  {
    id: "academic-planner",
    name: "Academic Planner 2025-2026",
    priceDZD: 5800,
    image: productPlanner,
    images: [productPlanner, productPlanner, productPlanner],
    category: "Planners",
    description: "Designed for students and educators. Runs from September to August with exam schedules, assignment trackers, and semester goal pages.",
  },
  {
    id: "marble-notebook",
    name: "Marble Notebook",
    priceDZD: 4060,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    description: "Premium paper quality, crafted for professionals. This stunning marble-patterned notebook features 120 pages of smooth, fountain-pen friendly paper.",
  },
  {
    id: "leather-journal",
    name: "Leather Bound Journal",
    priceDZD: 5200,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    description: "Handcrafted genuine leather journal with 200 pages of ivory paper. Features a ribbon bookmark and elastic closure for a timeless writing experience.",
  },
  {
    id: "dotted-notebook",
    name: "Dotted Grid Notebook",
    priceDZD: 3500,
    image: productNotebook,
    images: [productNotebook, productNotebook, productNotebook],
    category: "Notebooks",
    description: "Perfect for bullet journaling and sketching. 160 pages of premium dotted paper with lay-flat binding and numbered pages.",
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
  },
  {
    id: "floral-gift-tags",
    name: "Floral Gift Tags Set",
    priceDZD: 1500,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    description: "Beautiful botanical-inspired gift tags. Includes 30 tags in 6 different floral designs with matching twine ribbons.",
  },
  {
    id: "minimalist-gift-tags",
    name: "Minimalist Gift Tags",
    priceDZD: 1200,
    image: productTags,
    images: [productTags, productTags, productTags],
    category: "Gift Tags",
    description: "Clean, modern design for the minimalist aesthetic. Set of 20 tags in neutral tones with simple geometric patterns.",
  },
  {
    id: "gold-gel-pen",
    name: "Gold Gel Pen",
    priceDZD: 2610,
    image: productPen,
    images: [productPen, productPen, productPen],
    category: "Accessories",
    description: "Write in style with our signature Gold Gel Pen. Features smooth-flowing ink, ergonomic grip, and a stunning gold-plated finish.",
  },
  {
    id: "pastel-sticky-notes",
    name: "Pastel Sticky Notes Set",
    priceDZD: 2175,
    image: productNotes,
    images: [productNotes, productNotes, productNotes],
    category: "Accessories",
    description: "Brighten your workspace with our Pastel Sticky Notes Set. Includes 6 different colors with strong adhesive that won't damage your pages.",
  },
  {
    id: "washi-tape-set",
    name: "Decorative Washi Tape Set",
    priceDZD: 1800,
    image: productNotes,
    images: [productNotes, productNotes, productNotes],
    category: "Accessories",
    description: "Add creativity to your journals and planners. Set of 10 rolls featuring elegant patterns in coordinating colors.",
  },
];

// Export products as alias for backward compatibility
export const products = productData;

export const getProductById = (id: string): Product | undefined => {
  return productData.find((product) => product.id === id);
};
