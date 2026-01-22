import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import ProductCard from "./ProductCard";
import PriceRangeSlider from "./PriceRangeSlider";
import { products } from "@/data/products";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

const getSortLabels = (language: Language) => ({
  EN: {
    sortBy: "Sort By",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    nameAZ: "Name: A to Z",
    nameZA: "Name: Z to A",
  },
  FR: {
    sortBy: "Trier Par",
    priceLowHigh: "Prix: Croissant",
    priceHighLow: "Prix: Décroissant",
    nameAZ: "Nom: A à Z",
    nameZA: "Nom: Z à A",
  },
  AR: {
    sortBy: "ترتيب حسب",
    priceLowHigh: "السعر: من الأقل للأعلى",
    priceHighLow: "السعر: من الأعلى للأقل",
    nameAZ: "الاسم: أ إلى ي",
    nameZA: "الاسم: ي إلى أ",
  },
}[language]);

const ProductShowcase = () => {
  const { t, isRTL, language } = useLanguage();
  const sortLabels = getSortLabels(language);
  
  // Get min and max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products.map(p => p.priceDZD);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, []);

  const categories = [
    { key: "All", label: t.categories.all },
    { key: "Planners", label: t.categories.planners },
    { key: "Notebooks", label: t.categories.notebooks },
    { key: "Gift Tags", label: t.categories.giftTags },
    { key: "Accessories", label: t.categories.accessories },
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sortOption, setSortOption] = useState<SortOption | "">("");
  
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(
      product => product.priceDZD >= priceRange[0] && product.priceDZD <= priceRange[1]
    );
    
    // Apply sorting
    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortOption) {
          case "price-asc":
            return a.priceDZD - b.priceDZD;
          case "price-desc":
            return b.priceDZD - a.priceDZD;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [activeCategory, priceRange, sortOption]);

  const handleCategoryChange = (categoryKey: string) => {
    if (categoryKey === activeCategory) return;
    
    // Start fade out
    setIsAnimating(true);
    
    // After fade out, update category and fade in
    setTimeout(() => {
      setActiveCategory(categoryKey);
      
      // Small delay before fade in
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  return (
    <section id="products" className={`py-20 lg:py-28 bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mb-4">
            {t.products.bestSellers}
          </h2>
          <p className="text-foreground text-lg max-w-2xl mx-auto">
            {t.products.subtitle}
          </p>
        </div>

        {/* Filter Bar: Categories + Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 border-2 ${
                  activeCategory === category.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-primary border-primary hover:bg-primary/10"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex justify-center md:justify-end">
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-[200px] bg-background border-primary text-primary">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder={sortLabels.sortBy} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="price-asc">{sortLabels.priceLowHigh}</SelectItem>
                <SelectItem value="price-desc">{sortLabels.priceHighLow}</SelectItem>
                <SelectItem value="name-asc">{sortLabels.nameAZ}</SelectItem>
                <SelectItem value="name-desc">{sortLabels.nameZA}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="mb-10">
          <PriceRangeSlider
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>

        {/* Product Grid with Animation */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-all duration-200 ${
            isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
          }`}
        >
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">{t.products.noProductsFound}</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="block"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  priceDZD={product.priceDZD}
                  image={product.image}
                  category={product.category}
                  badge={product.badge}
                />
              </Link>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 lg:mt-16">
          <a
            href="#"
            className="inline-flex items-center text-primary font-medium hover:underline underline-offset-4 transition-all duration-200"
          >
            {t.products.viewAll}
            <svg
              className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
