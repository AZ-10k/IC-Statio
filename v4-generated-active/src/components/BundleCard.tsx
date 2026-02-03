import { useState } from "react";
import { Package, ShoppingBag, Eye, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductById } from "@/data/products";
import PriceDisplay from "./PriceDisplay";

interface BundleCardProps {
  bundle: {
    id: string;
    name: string;
    priceDZD: number;
    image: string;
    images: string[];
    description: string;
    badge?: string;
    rating?: number;
    reviewCount?: number;
    bundleItems?: {
      productId: string;
      quantity: number;
    }[];
    bundleDiscount?: number;
  };
  onViewDetails?: () => void;
}

const BundleCard = ({ bundle, onViewDetails }: BundleCardProps) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { currency, rates } = useCurrency();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Custom price formatting for bundles to ensure correct number display
  const formatBundlePrice = (priceDZD: number) => {
    let convertedPrice: number;

    if (currency === "DZD") {
      convertedPrice = priceDZD;
    } else {
      convertedPrice = priceDZD / rates[currency];
    }

    // Format number with thousand separators
    const formattedNumber = convertedPrice.toFixed(currency === "DZD" ? 0 : 2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Add LTR marks for Arabic to prevent number reversal
    const safeNumber = language === "AR" ? `\u200E${formattedNumber}\u200E` : formattedNumber;

    // Currency symbols and positioning
    switch (currency) {
      case "EUR":
        return `€${safeNumber}`;
      case "USD":
        return `$${safeNumber}`;
      case "DZD":
      default:
        if (language === "AR") {
          return `${safeNumber} د.ج`;
        }
        return `${safeNumber} DA`;
    }
  };

  // Calculate original price (sum of individual items)
  const calculateOriginalPrice = () => {
    if (!bundle.bundleItems) return 0;
    return bundle.bundleItems.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product ? product.priceDZD * item.quantity : 0);
    }, 0);
  };

  const originalPrice = calculateOriginalPrice();
  const savings = originalPrice - bundle.priceDZD;
  const savingsPercent = bundle.bundleDiscount || Math.round((savings / originalPrice) * 100);

  const handleAddBundleToCart = async () => {
    setIsAddingToCart(true);

    // Add each item in the bundle to cart
    if (bundle.bundleItems) {
      bundle.bundleItems.forEach((item) => {
        const product = getProductById(item.productId);
        if (product) {
          for (let i = 0; i < item.quantity; i++) {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.priceDZD,
              image: product.image
            });
          }
        }
      });
    }

    setIsAddingToCart(false);
    setAddedToCart(true);

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const bundleProducts = bundle.bundleItems
    ? bundle.bundleItems
        .map(item => getProductById(item.productId))
        .filter(Boolean)
    : [];

  const labels = {
    EN: {
      save: "Save",
      items: "items",
      item: "item",
      viewDetails: "View Details",
      addToCart: "Add Bundle to Cart",
      added: "Added to Cart!",
      includes: "Includes",
      bundleSavings: "Bundle Savings"
    },
    FR: {
      save: "Économisez",
      items: "articles",
      item: "article",
      viewDetails: "Voir les détails",
      addToCart: "Ajouter le lot au panier",
      added: "Ajouté au panier !",
      includes: "Inclut",
      bundleSavings: "Économies du lot"
    },
    AR: {
      save: "وفر",
      items: "عناصر",
      item: "عنصر",
      viewDetails: "عرض التفاصيل",
      addToCart: "إضافة الحزمة للسلة",
      added: "تم إضافته للسلة!",
      includes: "يشمل",
      bundleSavings: "توفير الحزمة"
    }
  };

  const l = labels[language as keyof typeof labels];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <Badge variant="secondary" className="text-xs">
              {l.save} {savingsPercent}%
            </Badge>
          </div>
        </div>

        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          {bundle.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bundle Image */}
        <div className="relative">
          <img
            src={bundle.image}
            alt={bundle.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-md">
            <Button variant="secondary" size="sm" onClick={onViewDetails}>
              <Eye className="w-4 h-4 mr-2" />
              {l.viewDetails}
            </Button>
          </div>
        </div>

        {/* Bundle Items Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{l.includes}:</p>
          <div className="flex flex-wrap gap-1">
            {bundleProducts.slice(0, 4).map((product, index) => (
              <div key={product.id} className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-4 h-4 object-cover rounded-full"
                />
                <span className="text-xs text-muted-foreground">
                  {bundle.bundleItems[index].quantity}x
                </span>
              </div>
            ))}
            {bundleProducts.length > 4 && (
              <div className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1">
                <Plus className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">
                  {bundleProducts.length - 4} {language === "AR" ? "أخرى" : language === "FR" ? "autres" : "more"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatBundlePrice(bundle.priceDZD)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatBundlePrice(originalPrice)}
              </span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {l.save} {formatBundlePrice(savings)}
            </Badge>
          </div>

        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddBundleToCart}
          disabled={isAddingToCart}
          className="w-full group-hover:bg-primary/90 transition-colors"
        >
          {isAddingToCart ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              {language === "AR" ? "جاري الإضافة..." : language === "FR" ? "Ajout en cours..." : "Adding..."}
            </div>
          ) : addedToCart ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {l.added}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {l.addToCart}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BundleCard;