import { Link, useSearchParams } from "react-router-dom";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import PriceDisplay from "./PriceDisplay";

const RecentlyViewed = () => {
  const { t, isRTL, language } = useLanguage();
  const { viewedProducts, removeFromRecentlyViewed } = useRecentlyViewed();
  const [searchParams] = useSearchParams();

  const getProductUrl = (productId: string) => {
    const currentLang = (searchParams.get("lang") || language).toLowerCase();
    return `/product/${productId}?lang=${currentLang}`;
  };

  if (viewedProducts.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            {t.recentlyViewed?.title || "Recently Viewed"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {viewedProducts.map((product) => (
            <Link
              key={product.id}
              to={getProductUrl(product.id)}
              className="block"
            >
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        removeFromRecentlyViewed(product.id);
                      }}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  <PriceDisplay
                    priceDZD={product.priceDZD}
                    className="text-primary font-semibold text-sm"
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;