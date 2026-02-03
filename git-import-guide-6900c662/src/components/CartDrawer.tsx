import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { DialogDescription } from "@/components/ui/dialog";
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
  const { language, isRTL, t } = useLanguage();
  const { currency, rates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const navigate = useNavigate();

  // 🔨 THE FIX: Utility for hard navigation to prevent state freezing
  const navigateWithLanguage = (url: string) => {
    const currentLang = language.toLowerCase();
    setIsOpen(false);
    window.location.href = `${url}${url.includes('?') ? '&' : '?'}lang=${currentLang}`;
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

  const l = labels[language as keyof typeof labels];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary hover:bg-wine/10 transition-all duration-300">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-wine text-white text-[10px] flex items-center justify-center font-bold animate-in zoom-in">
              {totalItems}
            </span>
          )}
          <span className="sr-only">{l.cart}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-md flex flex-col pt-10 z-[70]" dir={isRTL ? "rtl" : "ltr"}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-primary font-serif">
              <ShoppingBag className="h-5 w-5 text-wine" />
              {l.cart} ({totalItems})
            </SheetTitle>
            <DialogDescription className="sr-only">Cart items</DialogDescription>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBulkMode}
                className={`text-xs ${bulkMode ? 'bg-wine/10 text-wine' : ''}`}
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
            <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-lg animate-in slide-in-from-top-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.size} {language === "AR" ? "محدد" : language === "FR" ? "sélectionné(s)" : "selected"}
              </span>
              <div className="flex gap-1 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkMoveToWishlist}
                  className="text-xs border-wine/20 text-wine hover:bg-wine/5"
                >
                  <Bookmark className="w-3 h-3 mr-1" />
                  {language === "AR" ? "للمفضلة" : language === "FR" ? "Souhaits" : "To Wishlist"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-destructive border-destructive/20 hover:bg-destructive/5"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                    <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                      <AlertDialogTitle>
                        {language === "AR" ? "تأكيد الحذف الجماعي" : language === "FR" ? "Confirmer la suppression en masse" : "Confirm Bulk Removal"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {language === "AR"
                          ? `هل أنت متأكد من أنك تريد إزالة ${selectedItems.size} عناصر من سلة التسوق الخاصة بك؟`
                          : language === "FR"
                          ? `Êtes-vous sûr de vouloir supprimer ${selectedItems.size} article(s) de votre panier ?`
                          : `Are you sure you want to remove ${selectedItems.size} item(s) from your cart?`
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={isRTL ? "flex-row-reverse gap-2" : ""}>
                      <AlertDialogCancel>{language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel"}</AlertDialogCancel>
                      <AlertDialogAction onClick={bulkRemoveItems} className="bg-destructive hover:bg-destructive/90">
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
            <div className="flex items-center gap-2 mt-2 px-1">
              <Checkbox
                id="select-all"
                checked={selectedItems.size === items.length}
                onCheckedChange={selectAllItems}
              />
              <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer select-none">
                {language === "AR" ? "تحديد الكل" : language === "FR" ? "Tout sélectionner" : "Select All"}
              </label>
            </div>
          )}
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-wine/5 rounded-full blur-2xl animate-pulse" />
                <div className="relative">
                  <ShoppingBag className="h-24 w-24 text-muted-foreground/40 mb-2" />
                  <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-lg">😴</span>
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{l.empty}</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
                {language === "AR" ? "ابدأ باستكشاف منتجاتنا الرائعة!" : language === "FR" ? "Commencez à explorer nos produits incroyables !" : "Start exploring our amazing products!"}
              </p>
              <Button onClick={() => setIsOpen(false)} className="bg-wine hover:bg-wine/90 text-white w-full">
                {l.startShopping}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 px-1">
              {items.map((item) => (
                <div key={item.id} className={`flex gap-3 p-3 rounded-xl transition-all duration-300 ${selectedItems.has(item.id) ? 'bg-wine/5 ring-1 ring-wine/20' : 'bg-muted/30 hover:bg-muted/50'}`}>
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
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigateWithLanguage(`/product/${item.id}`)}
                      className="font-medium text-sm text-primary truncate hover:text-wine hover:underline block text-left w-full"
                    >
                      {item.name}
                    </button>
                    <p className="text-sm text-black font-semibold mt-1">
                      {formatPriceWithConversion(item.price, currency, language, rates)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RESTORED Action Buttons */}
                  <div className="flex flex-col justify-between items-end">
                    <div className="flex flex-col gap-2">
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
                        className="text-muted-foreground hover:text-wine transition-colors p-1.5 hover:bg-wine/5 rounded-full"
                        title={language === "AR" ? "حفظ لاحقاً" : language === "FR" ? "Sauvegarder pour plus tard" : "Save for Later"}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors p-1.5 hover:bg-destructive/5 rounded-full"
                            title={language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                          <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                            <AlertDialogTitle>{language === "AR" ? "تأكيد الحذف" : language === "FR" ? "Confirmer la suppression" : "Confirm Removal"}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {language === "AR" ? `هل أنت متأكد من حذف "${item.name}"؟` : language === "FR" ? `Supprimer "${item.name}" du panier ?` : `Remove "${item.name}" from cart?`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className={isRTL ? "flex-row-reverse gap-2" : ""}>
                            <AlertDialogCancel>{language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel"}</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => {
                                removeFromCart(item.id);
                                toast.success(language === "AR" ? "تم حذف العنصر" : language === "FR" ? "Article supprimé" : "Item removed");
                              }} 
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {language === "AR" ? "حذف" : language === "FR" ? "Supprimer" : "Remove"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4 animate-in slide-in-from-bottom-4">
            {/* Free Shipping Progress */}
            {(() => {
              const freeShippingThreshold = 10000;
              const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
              const remaining = Math.max(freeShippingThreshold - subtotal, 0);
              const hasMetThreshold = subtotal >= freeShippingThreshold;
              
              return (
                <div className="bg-muted/30 rounded-xl p-3 space-y-2 border border-border/50">
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    {hasMetThreshold ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span>🎉</span> {language === "AR" ? "شحن مجاني!" : language === "FR" ? "Livraison gratuite!" : "Free Shipping!"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {language === "AR" ? `أضف ${remaining} د.ج للشحن المجاني` : language === "FR" ? `Ajoutez ${remaining} DZD pour la livraison gratuite` : `Add ${remaining} DZD for free shipping`}
                      </span>
                    )}
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ${hasMetThreshold ? "bg-emerald-500" : "bg-wine"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-between items-center text-lg font-serif font-bold text-primary">
              <span>{l.subtotal}</span>
              <span>{formatPriceWithConversion(subtotal, currency, language, rates)}</span>
            </div>

            <ExchangeRateIndicator />

            <Button
              className="w-full bg-wine hover:bg-wine/90 text-white h-12 text-base font-medium"
              onClick={() => navigateWithLanguage("/checkout")}
            >
              {l.proceedToCheckout}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;