import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const BestSellers = () => {
  const { t, isRTL } = useLanguage();
  
  // Only show first 4 products as "Best Sellers"
  const bestSellers = products.slice(0, 4);

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

        {/* Product Grid - 4 Best Sellers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {bestSellers.map((product, index) => (
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
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 lg:mt-16">
          <Link to="/shop">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg">
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
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
