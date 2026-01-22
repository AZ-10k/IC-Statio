import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPriceWithConversion } from "@/utils/formatPrice";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();
  const { language, isRTL } = useLanguage();
  const { currency, rates } = useCurrency();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  const labels = {
    EN: {
      cart: "Cart",
      empty: "Your cart is empty",
      startShopping: "Start Shopping",
      subtotal: "Subtotal",
      viewCart: "View Cart",
      continueShopping: "Continue Shopping",
      proceedToCheckout: "Proceed to Checkout",
    },
    FR: {
      cart: "Panier",
      empty: "Votre panier est vide",
      startShopping: "Commencer les achats",
      subtotal: "Sous-total",
      viewCart: "Voir le panier",
      continueShopping: "Continuer les achats",
      proceedToCheckout: "Passer la commande",
    },
    AR: {
      cart: "السلة",
      empty: "سلتك فارغة",
      startShopping: "ابدأ التسوق",
      subtotal: "المجموع الفرعي",
      viewCart: "عرض السلة",
      continueShopping: "متابعة التسوق",
      proceedToCheckout: "متابعة الدفع",
    },
  };

  const l = labels[language];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
          <span className="sr-only">{l.cart}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-primary">
            <ShoppingBag className="h-5 w-5" />
            {l.cart} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">{l.empty}</p>
              <Button onClick={() => setIsOpen(false)} className="bg-primary text-primary-foreground">
                {l.startShopping}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 object-cover rounded-md" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-primary font-semibold">
                      {formatPriceWithConversion(item.price, currency, language, rates)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex justify-between items-center text-base font-semibold">
              <span>{l.subtotal}</span>
              <div className="flex items-center gap-2">
                <span className="text-primary">
                  {formatPriceWithConversion(subtotal, currency, language, rates)}
                </span>
                <ExchangeRateIndicator />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleProceedToCheckout}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {l.proceedToCheckout}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="flex-1 cursor-pointer"
              >
                {l.continueShopping}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
