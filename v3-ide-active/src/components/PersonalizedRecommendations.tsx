import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag } from "lucide-react";
import { productData, Product } from "@/data/products";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useCart } from "@/contexts/CartContext";
import PriceDisplay from "./PriceDisplay";

interface PersonalizedRecommendationsProps {
  excludeProductId?: string;
  maxItems?: number;
  className?: string;
}

const PersonalizedRecommendations = ({
  excludeProductId,
  maxItems = 4,
  className = ""
}: PersonalizedRecommendationsProps) => {
  const formatPrice = useFormattedPrice();
  const { language, isRTL } = useLanguage();
  const { viewedProducts } = useRecentlyViewed();
  const { items: cartItems } = useCart();

  const getPersonalizedRecommendations = (): Product[] => {
    const recommendations: Product[] = [];
    const usedIds = new Set(excludeProductId ? [excludeProductId] : []);

    // 1. Recently viewed products (highest priority for personalization)
    const recentRecommendations = viewedProducts
      .filter(product => !usedIds.has(product.id))
      .slice(0, 2);

    recommendations.push(...recentRecommendations);
    recentRecommendations.forEach(p => usedIds.add(p.id));

    // 2. Products from categories in user's cart
    const cartCategories = cartItems.map(item =>
      productData.find(p => p.id === item.id)?.category
    ).filter(Boolean);

    const cartBasedRecommendations = productData
      .filter(product =>
        cartCategories.includes(product.category) &&
        !usedIds.has(product.id)
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2);

    recommendations.push(...cartBasedRecommendations);
    cartBasedRecommendations.forEach(p => usedIds.add(p.id));

    // 3. Popular products with high ratings
    const popularRecommendations = productData
      .filter(product => !usedIds.has(product.id) && (product.rating || 0) >= 4.5)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, maxItems - recommendations.length);

    recommendations.push(...popularRecommendations);

    return recommendations.slice(0, maxItems);
  };

  const recommendations = getPersonalizedRecommendations();

  if (recommendations.length === 0) return null;

  const labels = {
    EN: {
      title: "Personalized for You",
      subtitle: "Based on your browsing history",
      viewAll: "View All"
    },
    FR: {
      title: "Personnalisé pour Vous",
      subtitle: "Basé sur votre historique de navigation",
      viewAll: "Voir Tout"
    },
    AR: {
      title: "مخصص لك",
      subtitle: "بناءً على سجل تصفحك",
      viewAll: "عرض الكل"
    }
  };

  const l = labels[language as keyof typeof labels];

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">{l.title}</h2>
              <p className="text-sm text-muted-foreground">{l.subtitle}</p>
            </div>
          </div>
          <Link
            to="/shop"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {l.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-background border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {product.category}
                </p>
                <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <PriceDisplay
                  priceDZD={product.priceDZD}
                  className="text-primary font-semibold text-sm"
                />

                {product.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < Math.floor(product.rating!) ? "text-amber-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;