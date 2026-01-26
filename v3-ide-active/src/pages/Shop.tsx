import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, X, SlidersHorizontal, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import AdvancedFilters, { FilterState } from "@/components/AdvancedFilters";
import BundleCard from "@/components/BundleCard";
import FloatingButtons from "@/components/FloatingButtons";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";
import Breadcrumb from "@/components/Breadcrumb";
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
import { Input } from "@/components/ui/input";

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
    { key: "Bundles", label: language === "AR" ? "الحزم" : language === "FR" ? "Lots" : "Bundles" },
    { key: "Planners", label: t.categories.planners },
    { key: "Notebooks", label: t.categories.notebooks },
    { key: "Gift Tags", label: t.categories.giftTags },
    { key: "Accessories", label: t.categories.accessories },
  ];

  // Read state from URL params
  const categoryFromUrl = searchParams.get("category") || "All";
  const searchFromUrl = searchParams.get("search") || "";
  const categoriesFromUrl = searchParams.get("categories")?.split(",") || [];
  const sortFromUrl = (searchParams.get("sort") as SortOption) || "";
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const minPriceFromUrl = parseInt(searchParams.get("minPrice") || String(minPrice), 10);
  const maxPriceFromUrl = parseInt(searchParams.get("maxPrice") || String(maxPrice), 10);
  const ratingFromUrl = searchParams.get("rating") ? parseInt(searchParams.get("rating")!, 10) : null;

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoriesFromUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceFromUrl, maxPriceFromUrl]);
  const [selectedRating, setSelectedRating] = useState<number | null>(ratingFromUrl);
  const [sortOption, setSortOption] = useState<SortOption | "">(sortFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    brands: [],
    materials: [],
    sizes: [],
    colors: [],
    tags: [],
    inStock: false,
    onSale: false
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Sync URL params when state changes
  const updateUrlParams = useCallback((updates: Record<string, string | number | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" ||
          (key === "category" && value === "All") ||
          (key === "search" && value === "") ||
          (key === "categories" && (!value || (Array.isArray(value) && value.length === 0))) ||
          (key === "page" && value === 1) ||
          (key === "minPrice" && value === minPrice) ||
          (key === "maxPrice" && value === maxPrice) ||
          (key === "rating" && value === null)) {
        newParams.delete(key);
      } else {
        newParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams, minPrice, maxPrice]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories (from advanced search)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    } else if (activeCategory !== "All") {
      // Filter by single category (legacy support)
      if (activeCategory === "Bundles") {
        filtered = filtered.filter(product => product.isBundle);
      } else {
        filtered = filtered.filter(product => product.category === activeCategory);
      }
    }

    // Filter by price range
    filtered = filtered.filter(
      product => product.priceDZD >= priceRange[0] && product.priceDZD <= priceRange[1]
    );

    // Filter by rating
    if (selectedRating !== null) {
      filtered = filtered.filter(product => product.rating && product.rating >= selectedRating);
    }

    // Advanced filters
    // Brand filter
    if (advancedFilters.brands.length > 0) {
      filtered = filtered.filter(product => product.brand && advancedFilters.brands.includes(product.brand));
    }

    // Material filter
    if (advancedFilters.materials.length > 0) {
      filtered = filtered.filter(product => product.material && advancedFilters.materials.includes(product.material));
    }

    // Size filter
    if (advancedFilters.sizes.length > 0) {
      filtered = filtered.filter(product => product.size && advancedFilters.sizes.includes(product.size));
    }

    // Color filter
    if (advancedFilters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.color && product.color.some(color => advancedFilters.colors.includes(color))
      );
    }

    // Tags filter
    if (advancedFilters.tags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags && product.tags.some(tag => advancedFilters.tags.includes(tag))
      );
    }

    // Stock filter
    if (advancedFilters.inStock) {
      filtered = filtered.filter(product => product.stockStatus === "in-stock");
    }

    // On sale filter (products with special pricing)
    if (advancedFilters.onSale) {
      filtered = filtered.filter(product => product.priceDZD < 3000);
    }

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
  }, [searchQuery, selectedCategories, activeCategory, priceRange, selectedRating, sortOption, advancedFilters]);

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
        language={language}
      />
      <Navbar />
      <main className="pt-20 lg:pt-24">
        <section className="py-16 lg:py-24 bg-background">
          <div className="w-full px-4">
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
                { 
                  label: language === "AR" ? "المتجر" : language === "FR" ? "Boutique" : "Shop" 
                }
              ]}
              className="mb-8"
            />

            {/* Header */}
            <div className="text-center mb-12 lg:mb-16">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mb-4">
                {pageLabels.title}
              </h1>
              <p className="text-foreground text-lg max-w-2xl mx-auto">
                {pageLabels.subtitle}
              </p>
            </div>

            {/* Filter Bar: Search + Categories + Sort */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              {/* Search Input */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t.products.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateUrlParams({ search: e.target.value, page: 1 });
                  }}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      updateUrlParams({ search: "", page: 1 });
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`lg:hidden ${showAdvancedFilters ? 'bg-primary/10' : ''}`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {language === "AR" ? "تصفية" : language === "FR" ? "Filtres" : "Filters"}
              </Button>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
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

            {/* Content and Sidebar Layout */}
            <div className="flex gap-8">
            {/* Advanced Filters Sidebar (Desktop) */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-4">
                <AdvancedFilters
                  currentFilters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Bundles Section */}
              {!isLoading && filteredProducts.some(p => p.isBundle) && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">
                      {language === "AR" ? "الحزم والمجموعات" : language === "FR" ? "Lots et Collections" : "Bundles & Collections"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts
                      .filter(product => product.isBundle)
                      .slice(0, 3)
                      .map((bundle) => (
                        <BundleCard
                          key={bundle.id}
                          bundle={bundle}
                          onViewDetails={() => {
                            // Navigate to bundle detail page (could be implemented later)
                            // TODO: Implement bundle detail navigation
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Regular Products Section */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {language === "AR" ? "المنتجات" : language === "FR" ? "Produits" : "Products"}
                  {filteredProducts.length > 0 && (
                    <span className="text-muted-foreground font-normal ml-2">
                      ({filteredProducts.filter(p => !p.isBundle).length})
                    </span>
                  )}
                </h2>
              </div>

              {/* Product Grid with Loading State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {isLoading ? (
                // Show 6 skeleton cards while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
                ) : paginatedProducts.length === 0 ? (
                  <div className="col-span-full text-center py-16 px-6">
                    {/* Enhanced Empty Search/Filter Results */}
                    <div className="relative mb-8 inline-block">
                      <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                      <div className="relative">
                        <svg className="h-32 w-32 mx-auto text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-bounce">
                          🔍
                        </div>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">
                      {language === "AR" ? "لم نجد أي منتجات" : language === "FR" ? "Aucun produit trouvé" : "No Products Found"}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {language === "AR"
                        ? "جرب تعديل الفلاتر أو نطاق السعر للعثور على ما تبحث عنه"
                        : language === "FR"
                        ? "Essayez d'ajuster vos filtres ou votre fourchette de prix pour trouver ce que vous recherchez"
                        : "Try adjusting your filters or price range to find what you're looking for"}
                    </p>
                    <Button
                      onClick={() => {
                        setSearchParams({});
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {language === "AR" ? "إعادة تعيين الفلاتر" : language === "FR" ? "Réinitialiser les filtres" : "Reset Filters"}
                    </Button>
                  </div>
                ) : (
                  paginatedProducts
                    .filter(product => !product.isBundle) // Exclude bundles from regular grid
                    .map((product, index) => (
                    <div
                      key={product.id}
                      onClick={(e) => {
                        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.product-card-content')) {
                          const currentLang = (searchParams.get("lang") || language).toLowerCase();
                          window.location.href = `/product/${product.id}?lang=${currentLang}`;
                        }
                      }}
                      className="block cursor-pointer product-card-wrapper"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          priceDZD={product.priceDZD}
                          image={product.image}
                          category={product.category}
                          badge={product.badge}
                          stock={product.stock}
                          stockStatus={product.stockStatus}
                          showActionButtons={false}
                          showReviews={false}
                        />
                    </div>
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
            </div>
          </div>

          {/* Mobile Advanced Filters Modal */}
          {showAdvancedFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdvancedFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-background p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {language === "AR" ? "التصفية المتقدمة" : language === "FR" ? "Filtres Avancés" : "Advanced Filters"}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <AdvancedFilters
                  currentFilters={advancedFilters}
                  onFiltersChange={(filters) => {
                    setAdvancedFilters(filters);
                    setShowAdvancedFilters(false);
                  }}
                />
              </div>
            </div>
          )}
    </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Shop;
