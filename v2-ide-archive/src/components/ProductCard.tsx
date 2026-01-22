import { useState } from "react";
import { ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import WishlistButton from "./WishlistButton";
import ProductQuickView from "./ProductQuickView";
import PriceDisplay from "./PriceDisplay";
import { Product, getProductById } from "@/data/products";

interface ProductCardProps {
  id: string;
  name: string;
  priceDZD: number;
  image: string;
  category: string;
  badge?: "low-stock" | "new-arrival";
}

const ProductCard = ({ id, name, priceDZD, image, category, badge }: ProductCardProps) => {
  const { t, language, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const formatPrice = useFormattedPrice();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const product = getProductById(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({ id, name, price: priceDZD, image });
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
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
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
          {badge && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-2.5 py-1">
              {getBadgeContent()}
            </Badge>
          )}
          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-3 right-12 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background cursor-pointer"
            aria-label={ariaLabels[language]}
          >
            <Eye className="h-4 w-4 text-primary" />
          </button>
          <WishlistButton productId={id} size="sm" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4 lg:p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{category}</p>
          <h3 className="font-serif text-lg font-medium text-primary mb-2 line-clamp-1">{name}</h3>
          <div className="mb-3">
            <PriceDisplay priceDZD={priceDZD} size="md" />
          </div>
          <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
            <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {labels[language]}
          </Button>
        </div>
      </div>

      <ProductQuickView
        product={product || null}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

export default ProductCard;
