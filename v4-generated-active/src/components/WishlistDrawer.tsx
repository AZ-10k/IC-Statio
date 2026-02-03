import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPriceWithConversion } from "@/utils/formatPrice";
import { getProductById } from "@/data/products";
import { Heart, X, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const WishlistDrawer = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { isRTL, language } = useLanguage();
  const { currency, rates } = useCurrency();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hard navigation utility to prevent app state freezing
  const navigateWithLanguage = (url: string) => {
    const currentLang = language.toLowerCase();
    setIsOpen(false);
    window.location.href = `${url}${url.includes('?') ? '&' : '?'}lang=${currentLang}`;
  };

  const wishlistProducts = (wishlist ?? []).map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return {
        ...product,
        wishlistCategory: item.category,
        dateAdded: item.dateAdded
      };
    }).filter(Boolean);

  const toggleItemSelection = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === wishlistProducts.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(wishlistProducts.map(item => item!.id)));
    }
  };

  const bulkAddToCart = () => {
    const itemsToAdd = selectedItems.size;
    selectedItems.forEach(productId => {
      const product = getProductById(productId);
      if (product) {
        addToCart({ id: productId, name: product.name, price: product.priceDZD, image: product.image });
        removeFromWishlist(productId);
      }
    });
    setSelectedItems(new Set());
    toast.success(`${itemsToAdd} ${language === "AR" ? "عنصر تم نقله للسلة" : language === "FR" ? "élément(s) déplacé(s) vers le panier" : "item(s) moved to cart"}`);
  };

  const bulkRemoveItems = () => {
    selectedItems.forEach(productId => removeFromWishlist(productId));
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} ${language === "AR" ? "عنصر تم حذفه" : language === "FR" ? "élément(s) supprimé(s)" : "item(s) removed"}`);
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedItems(new Set());
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-primary hover:bg-wine/10 rounded-full transition-all duration-300">
          <Heart className="h-5 w-5" strokeWidth={1.5} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-wine text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-in zoom-in">
              {wishlist.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-md bg-background pt-10 z-[70]" dir={isRTL ? "rtl" : "ltr"}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-primary flex items-center gap-2">
              <Heart className="h-5 w-5 text-wine fill-wine/10" />
              <span>{isRTL ? "قائمة الأمنيات" : language === "FR" ? "Ma Liste" : "My Wishlist"}</span>
              <span className="text-muted-foreground font-normal">({wishlist.length})</span>
            </SheetTitle>
            {wishlistProducts.length > 0 && (
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

          {bulkMode && selectedItems.size > 0 && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-muted/50 rounded-lg animate-in slide-in-from-top-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.size} {language === "AR" ? "محدد" : language === "FR" ? "sélectionné(s)" : "selected"}
              </span>
              <div className="flex gap-1 ml-auto">
                <Button variant="outline" size="sm" onClick={bulkAddToCart} className="text-xs border-wine/20 text-wine hover:bg-wine/5">
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  {language === "AR" ? "للسلة" : "To Cart"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs text-destructive border-destructive/20 hover:bg-destructive/5">
                      <Trash2 className="w-3 h-3 mr-1" />
                      {language === "AR" ? "حذف" : "Remove"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                    <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                      <AlertDialogTitle>{language === "AR" ? "تأكيد الحذف" : "Confirm Removal"}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {language === "AR" ? `حذف ${selectedItems.size} عناصر؟` : `Remove ${selectedItems.size} items?`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={isRTL ? "flex-row-reverse gap-2" : ""}>
                      <AlertDialogCancel>{language === "AR" ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                      <AlertDialogAction onClick={bulkRemoveItems} className="bg-destructive">
                        {language === "AR" ? "حذف" : "Remove"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {bulkMode && wishlistProducts.length > 0 && (
            <div className="flex items-center gap-2 mt-2 px-1">
              <Checkbox id="wish-select-all" checked={selectedItems.size === wishlistProducts.length} onCheckedChange={selectAllItems} />
              <label htmlFor="wish-select-all" className="text-sm text-muted-foreground cursor-pointer select-none">
                {language === "AR" ? "تحديد الكل" : "Select All"}
              </label>
            </div>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto px-1">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="mb-4 flex justify-center">
                <Heart className="h-16 w-16 text-muted-foreground/20" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {isRTL ? "قائمة الأمنيات فارغة" : language === "FR" ? "Liste vide" : "Your wishlist is empty"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                {isRTL ? "ابدأ بحفظ المنتجات المفضلة لديك" : "Start saving your favorite products for later"}
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div key={product!.id} className={`flex gap-4 p-3 rounded-xl border transition-all duration-300 ${selectedItems.has(product!.id) ? 'bg-wine/5 border-wine/20' : 'bg-card border-border hover:shadow-sm'}`}>
                {bulkMode && (
                  <div className="flex items-center">
                    <Checkbox checked={selectedItems.has(product!.id)} onCheckedChange={() => toggleItemSelection(product!.id)} />
                  </div>
                )}
                <button 
                  onClick={() => navigateWithLanguage(`/product/${product!.id}`)} 
                  className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 block bg-muted"
                >
                  <img src={product!.image} alt={product!.name} className="w-full h-full object-cover" />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigateWithLanguage(`/product/${product!.id}`)}
                    className="font-serif text-sm font-medium text-primary truncate hover:text-wine block text-left w-full"
                  >
                    {product!.name}
                  </button>
                  <p className="text-sm font-semibold text-black mt-1">
                    {formatPriceWithConversion(product!.priceDZD, currency, language, rates)}
                  </p>
                </div>

                {/* RESTORED INDIVIDUAL ACTION BUTTONS */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      addToCart({ id: product!.id, name: product!.name, price: product!.priceDZD, image: product!.image });
                      removeFromWishlist(product!.id);
                      toast.success(language === "AR" ? "تم الإضافة للسلة" : "Added to cart");
                    }}
                    className="p-2 text-muted-foreground hover:text-wine hover:bg-wine/5 rounded-full transition-colors"
                    title={language === "AR" ? "إضافة للسلة" : "Add to Cart"}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-colors"
                        title={language === "AR" ? "حذف" : "Remove"}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                      <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                        <AlertDialogTitle>{language === "AR" ? "تأكيد الحذف" : "Confirm Removal"}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {language === "AR" ? `حذف "${product!.name}"؟` : `Remove "${product!.name}"?`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className={isRTL ? "flex-row-reverse gap-2" : ""}>
                        <AlertDialogCancel>{language === "AR" ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeFromWishlist(product!.id)} className="bg-destructive">
                          {language === "AR" ? "حذف" : "Remove"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistProducts.length > 0 && (
          <div className="mt-auto pt-6 border-t border-border bg-background">
            <Button
              onClick={() => {
                wishlistProducts.forEach(product => {
                  addToCart({ id: product!.id, name: product!.name, price: product!.priceDZD, image: product!.image });
                  removeFromWishlist(product!.id);
                });
                toast.success(language === "AR" ? "تم النقل الكل للسلة" : "All moved to cart");
              }}
              className="w-full bg-wine hover:bg-wine/90 text-white h-12 shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {language === "AR" ? "نقل الكل للسلة" : language === "FR" ? "Tout au panier" : "Move All to Cart"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;