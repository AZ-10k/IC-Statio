import { useSearchParams } from "react-router-dom";
import { productData, Product } from "@/data/products";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useCart } from "@/contexts/CartContext";
import WishlistButton from "./WishlistButton";

interface RelatedProductsProps {
  currentProduct: Product;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const formatPrice = useFormattedPrice();
  const { language, isRTL } = useLanguage();
  const { viewedProducts } = useRecentlyViewed();
  const { items: cartItems } = useCart();
  const [searchParams] = useSearchParams();

  const navigateToProduct = (productId: string) => {
    const currentLang = (searchParams.get("lang") || language).toLowerCase();
    window.location.href = `/product/${productId}?lang=${currentLang}`;
  };

  // Enhanced recommendation algorithm
  const getPersonalizedRecommendations = () => {
    const recommendations: Product[] = [];
    const usedIds = new Set([currentProduct.id]);

    // 1. Products from same category (highest priority)
    const sameCategoryProducts = productData
      .filter(product =>
        product.category === currentProduct.category &&
        !usedIds.has(product.id)
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Sort by rating

    recommendations.push(...sameCategoryProducts.slice(0, 2));
    sameCategoryProducts.slice(0, 2).forEach(p => usedIds.add(p.id));

    // 2. Recently viewed products (medium priority)
    const recentlyViewedRecommendations = viewedProducts
      .filter(product => !usedIds.has(product.id))
      .slice(0, 2);

    recommendations.push(...recentlyViewedRecommendations);
    recentlyViewedRecommendations.forEach(p => usedIds.add(p.id));

    // 3. Products in user's cart (suggest complementary items)
    const cartCategories = cartItems.map(item =>
      productData.find(p => p.id === item.id)?.category
    ).filter(Boolean);

    const complementaryProducts = productData
      .filter(product =>
        cartCategories.includes(product.category) &&
        product.category !== currentProduct.category &&
        !usedIds.has(product.id)
      )
      .slice(0, 1);

    recommendations.push(...complementaryProducts);
    complementaryProducts.forEach(p => usedIds.add(p.id));

    // 4. Popular products (fallback)
    const popularProducts = productData
      .filter(product => !usedIds.has(product.id))
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 4 - recommendations.length);

    recommendations.push(...popularProducts);

    return recommendations.slice(0, 4);
  };

  const relatedProducts = getPersonalizedRecommendations();

  if (relatedProducts.length === 0) return null;

  const labels = {
    EN: "Recommended for You",
    FR: "Recommandé pour Vous",
    AR: "موصى به لك",
  };

  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-primary mb-8 text-center">
          {labels[language]}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigateToProduct(product.id)}
              className="group block cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <WishlistButton
                  productId={product.id}
                  size="sm"
                  className="absolute top-2 right-2"
                />
              </div>
              <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-primary mt-1">
                {formatPrice(product.priceDZD)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
