import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const formatPrice = useFormattedPrice();
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = query.trim()
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
  };

  return (
    <div className="relative" ref={containerRef}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Search className="h-5 w-5" />
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
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full right-0 mt-2 w-72 lg:w-96 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 max-h-96 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            <div className="py-2">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={handleClose}
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
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(product.priceDZD)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              {t.products.noProductsFound}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
