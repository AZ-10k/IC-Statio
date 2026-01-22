import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { Product } from "@/data/products";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { language, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const formatPrice = useFormattedPrice();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceDZD,
      image: product.image,
    });
    onOpenChange(false);
  };

  const labels = {
    EN: { addToCart: "Add to Cart" },
    FR: { addToCart: "Ajouter au panier" },
    AR: { addToCart: "أضف للسلة" },
  };

  const t = labels[language];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left - Image */}
          <div className="aspect-square bg-muted">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left mb-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {product.category}
              </p>
              <DialogTitle className="font-serif text-2xl font-semibold text-primary">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <p className="text-primary text-xl font-bold mb-4">
              {formatPrice(product.priceDZD)}
            </p>

            <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-6">
              {product.description}
            </p>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 cursor-pointer"
            >
              <ShoppingBag className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t.addToCart}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
