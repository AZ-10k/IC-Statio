import { useState, useRef, useEffect } from "react";
import { Search, X, Filter, ChevronDown, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const formatPrice = useFormattedPrice();
  const { t, language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Get price range
  const minPrice = Math.min(...products.map(p => p.priceDZD));
  const maxPrice = Math.max(...products.map(p => p.priceDZD));

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("statio-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent search
  const addToRecentSearches = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("statio-recent-searches", JSON.stringify(updated));
  };

  const filteredProducts = products.filter((product) => {
    // Text search
    const matchesQuery = !query.trim() ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    // Price filter
    const matchesPrice = product.priceDZD >= priceRange[0] && product.priceDZD <= priceRange[1];

    // Rating filter
    const matchesRating = selectedRating === null || (product.rating && product.rating >= selectedRating);

    return matchesQuery && matchesCategory && matchesPrice && matchesRating;
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setShowFilters(false);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      addToRecentSearches(searchTerm.trim());
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setSelectedRating(null);
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
    priceRange[0] > minPrice ||
    priceRange[1] < maxPrice ||
    selectedRating !== null;

  return (
    <div className="relative" ref={containerRef}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
          <span className="sr-only">Search</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.products.searchPlaceholder}
              className="w-48 lg:w-64 px-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(query);
                }
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`relative ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                !
              </Badge>
            )}
          </Button>

          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Enhanced Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 lg:w-[600px] bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 max-h-[600px] overflow-y-auto">
          {/* Filters Panel */}
          {showFilters && (
            <div className="border-b border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">
                  {language === "AR" ? "التصفية" : language === "FR" ? "Filtres" : "Filters"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  {language === "AR" ? "مسح الكل" : language === "FR" ? "Tout effacer" : "Clear All"}
                </Button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-medium mb-2 uppercase tracking-wider">
                  {language === "AR" ? "الفئات" : language === "FR" ? "Catégories" : "Categories"}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-xs cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-medium mb-2 uppercase tracking-wider">
                  {language === "AR" ? "نطاق السعر" : language === "FR" ? "Prix" : "Price Range"}
                </h4>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={maxPrice}
                    min={minPrice}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-xs font-medium mb-2 uppercase tracking-wider">
                  {language === "AR" ? "التقييم" : language === "FR" ? "Évaluation" : "Rating"}
                </h4>
                <div className="flex gap-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        selectedRating === rating
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() || hasActiveFilters ? (
              <>
                {filteredProducts.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-border bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        {filteredProducts.length} {language === "AR" ? "منتج" : language === "FR" ? "produit(s)" : "product(s)"} found
                      </p>
                    </div>
                    {filteredProducts.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}?lang=${language.toLowerCase()}`}
                        onClick={() => {
                          handleClose();
                          handleSearchSubmit(query);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-semibold text-primary">
                              {formatPrice(product.priceDZD)}
                            </p>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-muted-foreground">
                                  {product.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {filteredProducts.length > 6 && (
                      <div className="px-4 py-2 border-t border-border">
                        <Link
                          to={`/shop?lang=${language.toLowerCase()}&search=${encodeURIComponent(query)}${selectedCategories.length > 0 ? `&categories=${selectedCategories.join(',')}` : ''}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}${selectedRating ? `&rating=${selectedRating}` : ''}`}
                          onClick={handleClose}
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          {language === "AR" ? "عرض جميع النتائج" : language === "FR" ? "Voir tous les résultats" : "View all results"} ({filteredProducts.length})
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <p className="text-sm mb-2">{t.products.noProductsFound}</p>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        {language === "AR" ? "مسح التصفية" : language === "FR" ? "Effacer les filtres" : "Clear filters"}
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Recent Searches */
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    {language === "AR" ? "عمليات البحث الأخيرة" : language === "FR" ? "Recherches récentes" : "Recent Searches"}
                  </p>
                </div>
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <p className="text-sm text-foreground">{search}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-4 text-center text-muted-foreground">
                    <p className="text-xs">
                      {language === "AR" ? "لا توجد عمليات بحث حديثة" : language === "FR" ? "Aucune recherche récente" : "No recent searches"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
