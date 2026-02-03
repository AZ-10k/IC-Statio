import { X, GitCompare, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import PriceDisplay from "./PriceDisplay";
import StarRating from "./StarRating";
import { toast } from "sonner";

const ProductComparison = () => {
  const { t, isRTL } = useLanguage();
  const { comparedProducts, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  if (comparedProducts.length === 0) return null;

  const handleAddToCart = (product: any) => {
    addToCart({ id: product.id, name: product.name, price: product.priceDZD, image: product.image });
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product: any) => {
    if (!isInWishlist(product.id)) {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-background shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <GitCompare className="w-4 h-4 mr-2" />
          Compare ({comparedProducts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            {t.comparison?.title || "Product Comparison"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium min-w-[200px]">
                    {t.comparison?.product || "Product"}
                  </th>
                  {comparedProducts.map((product) => (
                    <th key={product.id} className="text-center p-4 min-w-[250px] relative">
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <h3 className="font-medium text-sm text-center line-clamp-2">
                          {product.name}
                        </h3>
                        <button
                          onClick={() => removeFromComparison(product.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b">
                  <td className="p-4 font-medium bg-gray-50 dark:bg-gray-800">
                    {t.comparison?.price || "Price"}
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <PriceDisplay
                        priceDZD={product.priceDZD}
                        className="font-semibold"
                      />
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b">
                  <td className="p-4 font-medium bg-gray-50 dark:bg-gray-800">
                    {t.comparison?.rating || "Rating"}
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {product.rating ? (
                        <div className="flex flex-col items-center gap-1">
                          <StarRating rating={product.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No rating</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr className="border-b">
                  <td className="p-4 font-medium bg-gray-50 dark:bg-gray-800">
                    {t.comparison?.category || "Category"}
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr className="border-b">
                  <td className="p-4 font-medium bg-gray-50 dark:bg-gray-800">
                    {t.comparison?.availability || "Availability"}
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <Badge
                        variant={
                          product.stockStatus === "in-stock"
                            ? "default"
                            : product.stockStatus === "low-stock"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {product.stockStatus === "in-stock"
                          ? (t.badges?.inStock || "In Stock")
                          : product.stockStatus === "low-stock"
                          ? (t.badges?.lowStock || "Low Stock")
                          : (t.badges?.outOfStock || "Out of Stock")}
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 font-medium bg-gray-50 dark:bg-gray-800">
                    {t.comparison?.actions || "Actions"}
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="w-full"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          {t.common?.addToCart || "Add to Cart"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToWishlist(product)}
                          disabled={isInWishlist(product.id)}
                          className="w-full"
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          {isInWishlist(product.id)
                            ? (t.wishlist?.added || "Added")
                            : (t.wishlist?.add || "Add to Wishlist")}
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clear All Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={clearComparison}>
              {t.comparison?.clearAll || "Clear All"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparison;