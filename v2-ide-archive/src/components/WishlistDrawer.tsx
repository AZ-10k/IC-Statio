import { Heart, X, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductById } from "@/data/products";
import { INSTAGRAM_PROFILE_URL } from "@/constants/socialLinks";

const WishlistDrawer = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const wishlistProducts = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative p-2 text-primary hover:text-primary/80 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
              {wishlist.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-md bg-background">
        <SheetHeader>
          <SheetTitle className="font-serif text-primary flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {isRTL ? "قائمة الأمنيات" : "My Wishlist"}
            <span className="text-muted-foreground font-normal">
              ({wishlist.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? "قائمة الأمنيات فارغة" : "Your wishlist is empty"}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {isRTL
                  ? "أضف منتجات للحفظ لاحقاً"
                  : "Add products to save for later"}
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) =>
              product ? (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-lg bg-card border border-border"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`}>
                      <h4 className="font-serif text-sm font-medium text-primary truncate hover:underline">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.category}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {formatPrice(product.priceDZD)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors self-start"
                    aria-label={t.wishlist.removeFromWishlist}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null
            )
          )}
        </div>

        {wishlistProducts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90 border-0"
            >
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                <Instagram className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t.products.orderViaInstagram}
              </a>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
