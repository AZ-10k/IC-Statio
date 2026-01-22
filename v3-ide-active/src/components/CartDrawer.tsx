import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Plus, Minus, Trash2, CheckSquare, Square, MoveRight, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPriceWithConversion } from "@/utils/formatPrice";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { language, isRTL } = useLanguage();
  const { currency, rates } = useCurrency();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  // Bulk action handlers
  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const bulkRemoveItems = () => {
    selectedItems.forEach(itemId => removeFromCart(itemId));
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} ${language === "AR" ? "عنصر تم حذفه" : language === "FR" ? "élément(s) supprimé(s)" : "item(s) removed"}`);
  };

  const confirmBulkRemove = () => {
    bulkRemoveItems();
  };

  const bulkMoveToWishlist = () => {
    const itemsToMove = items.filter(item => selectedItems.has(item.id));
    itemsToMove.forEach(item => {
      if (!isInWishlist(item.id)) {
        addToWishlist(item.id);
        removeFromCart(item.id);
      }
    });
    setSelectedItems(new Set());
    toast.success(`${itemsToMove.length} ${language === "AR" ? "عنصر تم نقله للمفضلة" : language === "FR" ? "élément(s) déplacé(s) vers la liste de souhaits" : "item(s) moved to wishlist"}`);
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedItems(new Set());
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
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
          <span className="sr-only">{l.cart}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-md flex flex-col pt-10 z-[70]" dir={isRTL ? "rtl" : "ltr"}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-primary">
              <ShoppingBag className="h-5 w-5" />
              {l.cart} ({totalItems})
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBulkMode}
                className={`text-xs ${bulkMode ? 'bg-primary/10 text-primary' : ''}`}
              >
                {bulkMode ?
                  (language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel") :
                  (language === "AR" ? "تحديد متعدد" : language === "FR" ? "Sélection multiple" : "Select Multiple")
                }
              </Button>
            )}
          </div>

          {/* Bulk Actions Bar */}
          {bulkMode && selectedItems.size > 0 && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedItems.size} {language === "AR" ? "محدد" : language === "FR" ? "sélectionné(s)" : "selected"}
              </span>
              <div className="flex gap-1 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkMoveToWishlist}
                  className="text-xs"
                >
                  <MoveRight className="w-3 h-3 mr-1" />
                  {language === "AR" ? "للمفضلة" : language === "FR" ? "Souhaits" : "To Wishlist"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : ""}>
                    <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                      <AlertDialogTitle className={isRTL ? "text-right" : ""}>
                        {language === "AR" ? "تأكيد الحذف الجماعي" : language === "FR" ? "Confirmer la suppression en masse" : "Confirm Bulk Removal"}
                      </AlertDialogTitle>
                      <AlertDialogDescription className={isRTL ? "text-right" : ""}>
                        {language === "AR"
                          ? `هل أنت متأكد من حذف ${selectedItems.size} عنصر من السلة؟`
                          : language === "FR"
                          ? `Êtes-vous sûr de vouloir supprimer ${selectedItems.size} élément(s) du panier ?`
                          : `Are you sure you want to remove ${selectedItems.size} item(s) from your cart?`
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                      <AlertDialogCancel>
                        {language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel"}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmBulkRemove}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Select All */}
          {bulkMode && items.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                checked={selectedItems.size === items.length}
                onCheckedChange={selectAllItems}
              />
              <label className="text-sm text-muted-foreground cursor-pointer" onClick={selectAllItems}>
                {language === "AR" ? "تحديد الكل" : language === "FR" ? "Tout sélectionner" : "Select All"}
              </label>
            </div>
          )}
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              {/* Animated Empty Cart Illustration */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                <div className="relative">
                  <ShoppingBag className="h-24 w-24 text-muted-foreground/40 mb-2" />
                  <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-lg">😴</span>
                  </div>
                </div>
              </div>
              
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {language === "AR" ? "السلة فارغة" : language === "FR" ? "Votre panier est vide" : "Your cart is empty"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
                {language === "AR" 
                  ? "ابدأ باستكشاف منتجاتنا الرائعة!" 
                  : language === "FR" 
                  ? "Commencez à explorer nos produits incroyables !" 
                  : "Start exploring our amazing products!"}
              </p>
              <Button 
                onClick={() => setIsOpen(false)} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              >
                {l.startShopping}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className={`flex gap-3 p-3 rounded-lg ${selectedItems.has(item.id) ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}>
                  {bulkMode && (
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </div>
                  )}
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

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        if (!isInWishlist(item.id)) {
                          addToWishlist(item.id);
                          removeFromCart(item.id);
                          toast.success(language === "AR" ? "تم حفظ العنصر لاحقاً" : language === "FR" ? "Article sauvegardé pour plus tard" : "Item saved for later");
                        } else {
                          toast.info(language === "AR" ? "العنصر موجود بالفعل في المفضلة" : language === "FR" ? "L'article est déjà dans la liste de souhaits" : "Item already in wishlist");
                        }
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title={language === "AR" ? "حفظ لاحقاً" : language === "FR" ? "Sauvegarder pour plus tard" : "Save for Later"}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title={language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : ""}>
                        <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                          <AlertDialogTitle className={isRTL ? "text-right" : ""}>
                            {language === "AR" ? "تأكيد الحذف" : language === "FR" ? "Confirmer la suppression" : "Confirm Removal"}
                          </AlertDialogTitle>
                          <AlertDialogDescription className={isRTL ? "text-right" : ""}>
                            {language === "AR"
                              ? `هل أنت متأكد من حذف "${item.name}" من السلة؟`
                              : language === "FR"
                              ? `Êtes-vous sûr de vouloir supprimer "${item.name}" du panier ?`
                              : `Are you sure you want to remove "${item.name}" from your cart?`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                          <AlertDialogCancel>
                            {language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel"}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success(language === "AR" ? "تم حذف العنصر من السلة" : language === "FR" ? "Article supprimé du panier" : "Item removed from cart");
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            {/* Free Shipping Progress Bar */}
            {(() => {
              const freeShippingThreshold = 10000; // 10,000 DZD for free shipping
              const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
              const remaining = Math.max(freeShippingThreshold - subtotal, 0);
              const hasMetThreshold = subtotal >= freeShippingThreshold;
              
              return (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    {hasMetThreshold ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <span>🎉</span>
                        {language === "AR" ? "شحن مجاني!" : language === "FR" ? "Livraison gratuite!" : "Free Shipping!"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {language === "AR" 
                          ? `أضف ${remaining} د.ج للشحن المجاني`
                          : language === "FR"
                          ? `Ajoutez ${remaining} DZD pour la livraison gratuite`
                          : `Add ${remaining} DZD for free shipping`}
                      </span>
                    )}
                    <span className="text-muted-foreground font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                        hasMetThreshold 
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                          : "bg-gradient-to-r from-primary to-primary/70"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })()}

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
