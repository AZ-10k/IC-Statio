import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ZoomIn, X, ChevronLeft, ChevronRight, GitCompare, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";
import ProductReviews from "@/components/ProductReviews";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";
import PriceDisplay from "@/components/PriceDisplay";
import Breadcrumb from "@/components/Breadcrumb";
import ProductHelpModal from "@/components/ProductHelpModal";
import SizeGuide from "@/components/SizeGuide";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getProductById } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { t, isRTL, language } = useLanguage();
  const [searchParams] = useSearchParams();

  // Utility function to navigate while preserving language parameter
  const navigateWithLanguage = (url: string) => {
    const currentLang = (searchParams.get("lang") || language).toLowerCase();
    const urlObj = new URL(url, window.location.origin);

    // Only add lang parameter if it's not already present
    if (!urlObj.searchParams.has("lang")) {
      urlObj.searchParams.set("lang", currentLang);
    }

    window.location.href = urlObj.toString();
  };
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToComparison, isInComparison, maxComparisons, comparedProducts } = useComparison();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Track product view for recently viewed
  useEffect(() => {
    if (id && product) {
      addToRecentlyViewed(id);
    }
  }, [id, product, addToRecentlyViewed]);

  // Show sticky Add to Cart button on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px down
      if (window.scrollY > 400) {
        setShowStickyButton(true);
      } else {
        setShowStickyButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.priceDZD,
        image: product.images[0],
      });
    }
    const toastMsg = {
      EN: "Added to cart!",
      FR: "Ajouté au panier!",
      AR: "تمت الإضافة إلى السلة!",
    };
    toast.success(toastMsg[language]);
  };

  if (!product) {
    return (
      <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <main className="pt-24 lg:pt-28 container mx-auto px-4 lg:px-8">
          <div className="text-center py-20">
            <h1 className="font-serif text-3xl text-primary mb-4">{t.productDetail.productNotFound}</h1>
            <div onClick={() => navigateWithLanguage("/")} className="text-primary hover:underline cursor-pointer">
              {t.productDetail.returnToCatalog}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seoTitle = `${product.name} | Instant Créatif Statio`;
  const productDescription = t.products?.descriptions?.[product.id] || product.description;
  const seoDescription = productDescription.substring(0, 155) + "...";

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        productDescription={productDescription}
        canonical={`/product/${product.id}`}
        type="product"
        image={Array.isArray(product.images) ? product.images[0] : product.image}
      />
      {product && <StructuredData type="Product" data={product} />}
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb Navigation */}
          <Breadcrumb 
            items={[
              { 
                label: language === "AR" ? "المتجر" : language === "FR" ? "Boutique" : "Shop", 
                href: "/shop" 
              },
              { 
                label: product.category 
              },
              { 
                label: product.name 
              }
            ]}
            className="mb-6"
          />

          {/* Back Button */}
          <div
            onClick={() => navigateWithLanguage("/shop")}
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {t.productDetail.backToCatalog}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group cursor-zoom-in"
                onClick={() => setIsZoomOpen(true)}>
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  loading={selectedImage === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Zoom Indicator */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <ZoomIn className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {/* Wishlist Button */}
                <WishlistButton
                  productId={product.id}
                  size="lg"
                  className="absolute top-4 right-4"
                />

              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  {product.category}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-primary">
                    {product.name}
                  </h1>
                  <div className="flex gap-2">
                    <SizeGuide
                      productType={product.category.toLowerCase() as "notebook" | "planner" | "accessory"}
                      dimensions={{
                        width: product.category === "Planners" ? 21 : product.category === "Notebooks" ? 14.8 : 5,
                        height: product.category === "Planners" ? 29.7 : product.category === "Notebooks" ? 21 : 8,
                        thickness: product.category === "Planners" ? 2 : product.category === "Notebooks" ? 1.2 : 2
                      }}
                    />
                    <ProductHelpModal product={product} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <PriceDisplay priceDZD={product.priceDZD} size="lg" className="text-2xl lg:text-3xl" />
                  <ExchangeRateIndicator />
                </div>

              </div>

              <div className="border-t border-border pt-6">
                <p className="text-foreground leading-relaxed">
                  {t.products?.descriptions?.[product.id] || product.description}
                </p>
              </div>

              {/* Stock Availability */}
              {product.stockStatus && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  {product.stockStatus === "in-stock" && product.stock && product.stock <= 20 && (
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <span className="text-2xl">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {language === "AR" ? "متوفر في المخزون" : language === "FR" ? "En stock" : "In Stock"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === "AR" ? "جاهز للشحن الفوري" : language === "FR" ? "Prêt à être expédié" : "Ready to ship"}
                        </p>
                      </div>
                    </div>
                  )}
                  {product.stockStatus === "out-of-stock" && (
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <span className="text-2xl">✗</span>
                      </div>
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-400">
                          {language === "AR" ? "نفذت الكمية" : language === "FR" ? "En rupture de stock" : "Out of Stock"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === "AR" ? "سنعلمك عند توفره" : language === "FR" ? "Sera bientôt de retour" : "Will be back soon"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-foreground">
                  {language === "AR" ? "الكمية" : language === "FR" ? "Quantité" : "Quantity"}:
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                disabled={product.stockStatus === "out-of-stock"}
                className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {product.stockStatus === "out-of-stock"
                  ? (language === "AR" ? "نفذت الكمية" : language === "FR" ? "Épuisé" : "Out of Stock")
                  : (language === "AR" ? "أضف إلى السلة" : language === "FR" ? "Ajouter au panier" : "Add to Cart")}
              </Button>

              {/* Shipping Terms Link */}
              <div
                onClick={() => navigateWithLanguage("/shipping-terms")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-center block cursor-pointer"
              >
                {t.productDetail.shippingAll} →
              </div>

              {/* Features */}
              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{t.productDetail.premiumQuality}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{t.productDetail.shippingAll}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{t.productDetail.securePackaging}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 border-t border-border">
          <ProductReviews productId={product.id} />
        </div>

        {/* You May Also Like Section */}
        <RelatedProducts currentProduct={product} />


      </main>
      <Footer />
      <FloatingButtons />

      {/* Sticky Add to Cart Button */}
      {product && showStickyButton && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border shadow-2xl transition-all duration-300 ${
          showStickyButton ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-sm font-medium text-primary truncate">
                    {product.name}
                  </h3>
                  <PriceDisplay priceDZD={product.priceDZD} size="sm" />
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stockStatus === "out-of-stock"}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-base font-medium flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                <span className="hidden sm:inline">
                  {product.stockStatus === "out-of-stock"
                    ? (language === "AR" ? "نفذت الكمية" : language === "FR" ? "Épuisé" : "Out of Stock")
                    : (language === "AR" ? "أضف إلى السلة" : language === "FR" ? "Ajouter au panier" : "Add to Cart")}
                </span>
                <span className="sm:hidden">
                  {product.stockStatus === "out-of-stock"
                    ? (language === "AR" ? "نفذ" : language === "FR" ? "Épuisé" : "Out")
                    : (language === "AR" ? "أضف" : language === "FR" ? "Ajouter" : "Add")}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors`}
                  aria-label="Previous image"
                >
                  <ChevronLeft className={`h-8 w-8 text-white ${isRTL ? "rotate-180" : ""}`} />
                </button>
                <button
                  onClick={handleNextImage}
                  className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors`}
                  aria-label="Next image"
                >
                  <ChevronRight className={`h-8 w-8 text-white ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </>
            )}

            {/* Zoomed Image */}
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-white text-sm font-medium">
                {selectedImage + 1} / {product.images.length}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-white scale-110"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
