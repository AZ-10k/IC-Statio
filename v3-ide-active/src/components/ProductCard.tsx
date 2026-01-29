import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag, Eye, GitCompare, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { useNotifications } from "@/contexts/NotificationContext";
import WishlistButton from "./WishlistButton";
import ProductQuickView from "./ProductQuickView";
import PriceDisplay from "./PriceDisplay";
import StarRating from "./StarRating";
import SocialProof from "./SocialProof";
import ReviewHighlights from "./ReviewHighlights";
import { Product, getProductById } from "@/data/products";

interface ProductCardProps {
  id: string;
  name: string;
  priceDZD: number;
  image: string;
  category: string;
  badge?: "low-stock" | "new-arrival";
  stock?: number;
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock";
  rating?: number;
  reviewCount?: number;
  showActionButtons?: boolean;
  showReviews?: boolean;
}

const ProductCard = ({ id, name, priceDZD, image, category, badge, stock, stockStatus, rating, reviewCount, showActionButtons = true, showReviews = true }: ProductCardProps) => {
  const { t, language, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const formatPrice = useFormattedPrice();
  const { addToComparison, isInComparison, maxComparisons, comparedProducts } = useComparison();
  const { subscribeToRestockAlert, subscribeToPriceAlert } = useNotifications();
  const [searchParams] = useSearchParams();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const getProductUrl = (productId: string) => {
    const currentLang = (searchParams.get("lang") || language).toLowerCase();
    return `/product/${productId}?lang=${currentLang}`;
  };

  const product = getProductById(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    for (let i = 0; i < quantity; i++) {
      addToCart({ id, name, price: priceDZD, image });
    }
    setQuantity(1);
    setShowQuickAdd(false);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const getBadgeContent = () => {
    if (badge === "low-stock") return t.badges.lowStock;
    if (badge === "new-arrival") return t.badges.newArrival;
    return null;
  };

  const labels = { 
    EN: "Add to Cart", 
    FR: "Ajouter au panier", 
    AR: "أضف للسلة" 
  };

  const ariaLabels = {
    EN: "Quick view",
    FR: "Aperçu rapide",
    AR: "عرض سريع"
  };

  return (
    <>
      <Link
        to={getProductUrl(id)}
        className="block"
              >
        <div className="product-card-content group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img 
            src={image} 
            alt={name} 
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Quick View Button - Always visible on mobile, hover on desktop */}
          <button
            onClick={handleQuickView}
            className="absolute top-3 right-12 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background cursor-pointer shadow-lg"
            aria-label={ariaLabels[language]}
          >
            <Eye className="h-4 w-4 text-primary" />
          </button>
          <WishlistButton productId={id} size="sm" className="absolute top-3 right-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg" />

          {showActionButtons && (
            <>
              {/* Compare Button - Always visible on mobile, hover on desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addToComparison(id);
                }}
                className={`absolute top-14 right-3 h-8 w-8 rounded-full backdrop-blur-sm flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg ${
                  isInComparison(id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/90 hover:bg-background text-primary"
                }`}
                aria-label={isInComparison(id) ? "Remove from comparison" : "Add to comparison"}
                disabled={comparedProducts.length >= maxComparisons && !isInComparison(id)}
              >
                <GitCompare className="h-4 w-4" />
              </button>

              {/* Price Alert Button - For in-stock items */}
              {stockStatus !== "out-of-stock" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    subscribeToPriceAlert(id, name, priceDZD);
                  }}
                  className="absolute top-24 right-3 h-6 w-6 rounded-full bg-background/90 hover:bg-background backdrop-blur-sm flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                  aria-label="Get price alerts"
                  title={language === "AR" ? "أشعرني بانخفاض السعر" : language === "FR" ? "Alerte prix" : "Price alert"}
                >
                  <span className="text-xs">💰</span>
                </button>
              )}
            </>
          )}
        </div>
        <div className="p-4 lg:p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{category}</p>
          <h3 className="font-serif text-lg font-medium text-primary mb-2 line-clamp-1">{name}</h3>
          
          {showReviews && (
            <>
              {/* Star Rating */}
              {rating && (
                <div className="mb-2">
                  <StarRating rating={rating} reviewCount={reviewCount} size="sm" />
                </div>
              )}

              {/* Social Proof - View/Purchase Counts */}
              <div className="mb-2">
                <SocialProof
                  viewCount={product?.viewCount}
                  purchaseCount={product?.purchaseCount}
                  size="sm"
                />
              </div>

              {/* Featured Review */}
              {product?.featuredReview && (
                <div className="mb-3">
                  <ReviewHighlights
                    rating={rating || 0}
                    reviewCount={reviewCount || 0}
                    featuredReview={product.featuredReview}
                    size="sm"
                  />
                </div>
              )}
            </>
          )}

          <div className="mb-3">
            <PriceDisplay priceDZD={priceDZD} size="md" />
          </div>
          
          {/* Stock Indicator */}
          {stockStatus && (
            <div className="mb-3">
              {stockStatus === "low-stock" && stock && (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {language === "AR" 
                    ? `${stock} فقط متبقية!`
                    : language === "FR"
                    ? `Plus que ${stock}!`
                    : `Only ${stock} left!`}
                </p>
              )}
              {stockStatus === "out-of-stock" && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                  {language === "AR" ? "نفذت الكمية" : language === "FR" ? "Épuisé" : "Out of Stock"}
                </p>
              )}
              {stockStatus === "in-stock" && stock && stock <= 20 && (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  {language === "AR" ? "متوفر" : language === "FR" ? "En stock" : "In Stock"}
                </p>
              )}
            </div>
          )}

          {/* Quick Add to Cart Interface */}
          {stockStatus === "out-of-stock" ? (
            <div className="space-y-2">
              <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
                <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {language === "AR" ? "نفذت الكمية" : language === "FR" ? "Épuisé" : "Out of Stock"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  subscribeToRestockAlert(id, name);
                }}
                className="w-full text-xs"
              >
                {language === "AR" ? "أشعرني عند التوفر" : language === "FR" ? "Me notifier" : "Notify when available"}
              </Button>
            </div>
          ) : showQuickAdd ? (
            <div className="space-y-2">
              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  className="p-1 hover:bg-background rounded transition-colors"
                  disabled={quantity <= 1}
                  aria-label={language === "AR" ? "إنقاص الكمية" : language === "FR" ? "Diminuer la quantité" : "Decrease quantity"}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium text-sm min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity + 1);
                  }}
                  className="p-1 hover:bg-background rounded transition-colors"
                  aria-label={language === "AR" ? "زيادة الكمية" : language === "FR" ? "Augmenter la quantité" : "Increase quantity"}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {quantity > 1
                  ? (language === "AR" ? `أضف ${quantity} إلى السلة` : language === "FR" ? `Ajouter ${quantity} au panier` : `Add ${quantity} to Cart`)
                  : labels[language]}
              </Button>

              {/* Cancel Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickAdd(false);
                  setQuantity(1);
                }}
                className="w-full text-xs"
              >
                {language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickAdd(true);
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {labels[language]}
            </Button>
          )}
        </div>
      </div>
      </Link>

      <ProductQuickView
        product={product || null}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

export default ProductCard;
