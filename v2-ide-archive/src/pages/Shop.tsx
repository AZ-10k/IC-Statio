import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import FloatingButtons from "@/components/FloatingButtons";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";
import SEO from "@/components/SEO";
import { products } from "@/data/products";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

const PRODUCTS_PER_PAGE = 12;

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

const getPageLabels = (language: Language) => ({
  EN: {
    title: "Our Collection",
    subtitle: "Explore our full range of elegant stationery, planners, and accessories.",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  FR: {
    title: "Notre Collection",
    subtitle: "Explorez notre gamme complète de papeterie élégante, planners et accessoires.",
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    of: "sur",
  },
  AR: {
    title: "مجموعتنا",
    subtitle: "استكشف مجموعتنا الكاملة من القرطاسية الأنيقة والمخططات والإكسسوارات.",
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    of: "من",
  },
}[language]);

const getSEOLabels = (language: Language) => ({
  EN: {
    title: "Shop - Our Planners & Notebooks | Instant Créatif Statio",
    description: "Explore our collection of elegant planners, notebooks, and stationery accessories. Premium quality stationery delivered across Algeria.",
  },
  FR: {
    title: "Boutique - Nos Agendas et Carnets | Instant Créatif Statio",
    description: "Découvrez notre collection de planners élégants, carnets et accessoires de papeterie. Papeterie de qualité supérieure livrée partout en Algérie.",
  },
  AR: {
    title: "المتجر - دفاتر التخطيط والدفاتر | إنستانت كرياتيف ستاتيو",
    description: "اكتشف مجموعتنا من دفاتر التخطيط الأنيقة والدفاتر وإكسسوارات القرطاسية. قرطاسية عالية الجودة يتم توصيلها في جميع أنحاء الجزائر.",
  },
}[language]);

const Shop = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const sortLabels = getSortLabels(language);
  const pageLabels = getPageLabels(language);
  const seoLabels = getSEOLabels(language);
  
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

  // Read state from URL params
  const categoryFromUrl = searchParams.get("category") || "All";
  const sortFromUrl = (searchParams.get("sort") as SortOption) || "";
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const minPriceFromUrl = parseInt(searchParams.get("minPrice") || String(minPrice), 10);
  const maxPriceFromUrl = parseInt(searchParams.get("maxPrice") || String(maxPrice), 10);

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceFromUrl, maxPriceFromUrl]);
  const [sortOption, setSortOption] = useState<SortOption | "">(sortFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  
  // Sync URL params when state changes
  const updateUrlParams = useCallback((updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || 
          (key === "category" && value === "All") ||
          (key === "page" && value === 1) ||
          (key === "minPrice" && value === minPrice) ||
          (key === "maxPrice" && value === maxPrice)) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams, minPrice, maxPrice]);

  // Filter and sort products
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleCategoryChange = (categoryKey: string) => {
    if (categoryKey === activeCategory) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setActiveCategory(categoryKey);
      setCurrentPage(1);
      updateUrlParams({ category: categoryKey, page: 1 });
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 200);
  };

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setSortOption(value as SortOption);
      updateUrlParams({ sort: value });
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 200);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    updateUrlParams({ minPrice: value[0], maxPrice: value[1], page: 1 });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    updateUrlParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={seoLabels.title}
        description={seoLabels.description}
        canonical="/shop"
      />
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 lg:mb-16">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mb-4">
                {pageLabels.title}
              </h1>
              <p className="text-foreground text-lg max-w-2xl mx-auto">
                {pageLabels.subtitle}
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
                <Select value={sortOption} onValueChange={handleSortChange}>
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
            <div className="mb-6">
              <PriceRangeSlider
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={handlePriceRangeChange}
              />
            </div>

            {/* Exchange Rate Indicator */}
            <div className="flex justify-end mb-6">
              <ExchangeRateIndicator />
            </div>

            {/* Product Grid with Loading State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {isLoading ? (
                // Show 6 skeleton cards while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : paginatedProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">{t.products.noProductsFound}</p>
                </div>
              ) : (
                paginatedProducts.map((product, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  <ChevronLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
                  {pageLabels.previous}
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  {pageLabels.page} {currentPage} {pageLabels.of} {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  {pageLabels.next}
                  <ChevronRight className={`h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Shop;
