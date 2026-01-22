import { useState } from "react";
import { Heart, X, Instagram, Tag, Plus, Settings, CheckSquare, Square, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductById } from "@/data/products";
import { INSTAGRAM_PROFILE_URL } from "@/constants/socialLinks";
import { toast } from "sonner";

const WishlistDrawer = () => {
  const {
    wishlist,
    categories,
    removeFromWishlist,
    moveToCategory,
    addCategory,
    clearWishlist
  } = useWishlist();
  const { t, isRTL, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const wishlistProducts = wishlist
    .map((item) => ({
      ...getProductById(item.productId),
      wishlistCategory: item.category,
      dateAdded: item.dateAdded
    }))
    .filter(Boolean);

  // Bulk action handlers
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
      setSelectedItems(new Set(wishlistProducts.map(item => item.id)));
    }
  };

  const bulkAddToCart = () => {
    selectedItems.forEach(productId => {
      const product = getProductById(productId);
      if (product) {
        addToCart({ id: productId, name: product.name, price: product.priceDZD, image: product.image });
        removeFromWishlist(productId);
      }
    });
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} ${language === "AR" ? "عنصر تم نقله للسلة" : language === "FR" ? "élément(s) déplacé(s) vers le panier" : "item(s) moved to cart"}`);
  };

  const bulkRemoveItems = () => {
    selectedItems.forEach(productId => removeFromWishlist(productId));
    setSelectedItems(new Set());
    toast.success(`${selectedItems.size} ${language === "AR" ? "عنصر تم حذفه من المفضلة" : language === "FR" ? "élément(s) supprimé(s) de la liste de souhaits" : "item(s) removed from wishlist"}`);
  };

  const confirmBulkRemove = () => {
    bulkRemoveItems();
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedItems(new Set());
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative p-2 text-primary hover:text-primary/80 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="h-5 w-5" strokeWidth={1.5} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
              {wishlist.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-md bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-primary flex items-center gap-2">
              <span className="text-muted-foreground font-normal">
                ({wishlist.length})
              </span>
              {isRTL ? "قائمة الأمنيات" : "My Wishlist"}
              <Heart className="h-5 w-5" />
            </SheetTitle>
            {wishlistProducts.length > 0 && (
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
                  onClick={bulkAddToCart}
                  className="text-xs"
                >
                  <ShoppingBag className="w-3 h-3 mr-1" />
                  {language === "AR" ? "للسلة" : language === "FR" ? "Au panier" : "To Cart"}
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
                          ? `هل أنت متأكد من حذف ${selectedItems.size} عنصر من قائمة الأمنيات؟`
                          : language === "FR"
                          ? `Êtes-vous sûr de vouloir supprimer ${selectedItems.size} élément(s) de votre liste de souhaits ?`
                          : `Are you sure you want to remove ${selectedItems.size} item(s) from your wishlist?`
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
          {bulkMode && wishlistProducts.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                checked={selectedItems.size === wishlistProducts.length}
                onCheckedChange={selectAllItems}
              />
              <label className="text-sm text-muted-foreground cursor-pointer" onClick={selectAllItems}>
                {language === "AR" ? "تحديد الكل" : language === "FR" ? "Tout sélectionner" : "Select All"}
              </label>
            </div>
          )}
        </SheetHeader>

        {/* Category Tabs */}
        {wishlistProducts.length > 0 && (
          <div className="px-6 py-3 bg-muted/30 rounded-lg mx-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const categoryItems = wishlist.filter(item => item.category === category);
                return (
                  <Badge
                    key={category}
                    variant={categoryItems.length > 0 ? "default" : "outline"}
                    className="text-xs"
                  >
                    {category} ({categoryItems.length})
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 px-6">
              {/* Animated Empty Wishlist Illustration */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-rose-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="relative">
                  <Heart className="h-24 w-24 text-muted-foreground/30 mx-auto mb-2" />
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2">
                    <div className="animate-bounce">
                      <span className="text-2xl">💝</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {isRTL ? "قائمة الأمنيات فارغة" : language === "FR" ? "Votre liste de souhaits est vide" : "Your wishlist is empty"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[280px] mx-auto">
                {isRTL
                  ? "ابدأ بحفظ المنتجات المفضلة لديك للرجوع إليها لاحقاً"
                  : language === "FR"
                  ? "Commencez à sauvegarder vos produits préférés pour plus tard"
                  : "Start saving your favorite products for later"}
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) =>
              product ? (
                <div
                  key={product.id}
                  className={`flex gap-4 p-3 rounded-lg border ${selectedItems.has(product.id) ? 'bg-primary/10 border-primary/20' : 'bg-card border-border'}`}
                >
                  {bulkMode && (
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedItems.has(product.id)}
                        onCheckedChange={() => toggleItemSelection(product.id)}
                      />
                    </div>
                  )}
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
                    <Link to={`/product/${product.id}?lang=${(searchParams.get("lang") || language).toLowerCase()}`}>
                      <h4 className="font-serif text-sm font-medium text-primary truncate hover:underline">
                        {product.name}
                      </h4>
                    </Link>

                    {/* Category Badge and Selector */}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        <Tag className="w-3 h-3 mr-1" />
                        {product.wishlistCategory}
                      </Badge>

                      <Select
                        value={product.wishlistCategory}
                        onValueChange={(newCategory) => moveToCategory(product.id, newCategory)}
                      >
                        <SelectTrigger className="w-24 h-6 text-xs border-none bg-transparent p-0 hover:bg-muted">
                          <Settings className="w-3 h-3" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-xs">
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new-category" className="text-xs text-primary">
                            <Plus className="w-3 h-3 mr-1" />
                            New Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="text-sm font-semibold text-foreground mt-1">
                      {formatPrice(product.priceDZD)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1 self-start">
                    <button
                      onClick={() => {
                        addToCart({ id: product.id, name: product.name, price: product.priceDZD, image: product.image });
                        removeFromWishlist(product.id);
                        toast.success(language === "AR" ? "تم إضافة العنصر للسلة" : language === "FR" ? "Article ajouté au panier" : "Item added to cart");
                      }}
                      className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={language === "AR" ? "إضافة للسلة" : language === "FR" ? "Ajouter au panier" : "Add to Cart"}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={t.wishlist.removeFromWishlist}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : ""}>
                        <AlertDialogHeader className={isRTL ? "text-right" : ""}>
                          <AlertDialogTitle className={isRTL ? "text-right" : ""}>
                            {language === "AR" ? "تأكيد الحذف" : language === "FR" ? "Confirmer la suppression" : "Confirm Removal"}
                          </AlertDialogTitle>
                          <AlertDialogDescription className={isRTL ? "text-right" : ""}>
                            {language === "AR"
                              ? `هل أنت متأكد من حذف "${product.name}" من قائمة الأمنيات؟`
                              : language === "FR"
                              ? `Êtes-vous sûr de vouloir supprimer "${product.name}" de votre liste de souhaits ?`
                              : `Are you sure you want to remove "${product.name}" from your wishlist?`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
                          <AlertDialogCancel>
                            {language === "AR" ? "إلغاء" : language === "FR" ? "Annuler" : "Cancel"}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              removeFromWishlist(product.id);
                              toast.success(language === "AR" ? "تم حذف العنصر من قائمة الأمنيات" : language === "FR" ? "Article supprimé de la liste de souhaits" : "Item removed from wishlist");
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
              ) : null
            )
          )}
        </div>

        {wishlistProducts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              onClick={() => {
                // Move all wishlist items to cart and remove from wishlist
                wishlistProducts.forEach(product => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.priceDZD,
                    image: product.image
                  });
                  removeFromWishlist(product.id);
                });
                toast.success(t.wishlist?.movedToCart || "Items moved to cart!");
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t.wishlist?.moveAllToCart || "Move All to Cart"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
