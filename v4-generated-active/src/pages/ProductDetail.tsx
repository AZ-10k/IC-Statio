import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ZoomIn, X, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { getProductById } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id: paramsId } = useParams<{ id: string }>();
  const location = useLocation();
  const lastProcessedId = useRef<string | null>(null);
  
  const activeId = useMemo(() => {
    if (paramsId) return paramsId;
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }, [paramsId, location.pathname]);

  const { t, isRTL, language } = useLanguage();
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const product = useMemo(() => getProductById(activeId || ""), [activeId]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // 🔄 FIXED RESET LOGIC: Uses a ref to ensure it only fires when the ID actually changes
  useEffect(() => {
    if (activeId && activeId !== lastProcessedId.current) {
      console.log("🚀 Switching Product to:", activeId);
      lastProcessedId.current = activeId;
      setSelectedImage(0);
      setQuantity(1);
      
      // We only scroll to top on the INITIAL load of a new product ID
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      addToRecentlyViewed(activeId);
    }
  }, [activeId, addToRecentlyViewed]); 

  useEffect(() => {
    const handleScroll = () => setShowStickyButton(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: product.id, name: product.name, price: product.priceDZD, image: product.images[0] });
    }
    toast.success(language === "AR" ? "تمت الإضافة" : "Added to cart!");
  };

  return (
    <div key={activeId} className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO title={product.name} description={product.description} image={product.images[0]} />
      
      <main className="pt-24 lg:pt-28">
        <div className="w-full px-4 py-8">
          <Link to="/shop" className="inline-flex items-center text-primary mb-6">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {t.productDetail.backToCatalog}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted relative group cursor-zoom-in" onClick={() => setIsZoomOpen(true)}>
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                <WishlistButton productId={product.id} className="absolute top-4 right-4" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-20 h-20 rounded-lg border-2 flex-shrink-0 ${selectedImage === idx ? "border-primary" : "border-transparent"}`}>
                    <img src={img} className="w-full h-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <h1 className="font-serif text-4xl font-semibold text-primary">{product.name}</h1>
              <div className="flex items-center gap-4">
                <PriceDisplay priceDZD={product.priceDZD} size="lg" />
                <ExchangeRateIndicator />
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <Button variant="ghost" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 py-6 text-lg" disabled={product.stockStatus === "out-of-stock"}>
                  <ShoppingCart className="mr-2" />
                  {product.stockStatus === "out-of-stock" ? "Out of Stock" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts key={`related-${activeId}`} currentProduct={product} />
        <div className="px-4 py-12 border-t">
          <ProductReviews productId={product.id} />
        </div>
      </main>

      <Footer />
      <FloatingButtons />

      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/90 border-0">
          <div className="h-full flex items-center justify-center relative">
            <button onClick={() => setIsZoomOpen(false)} className="absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={32} />
            </button>
            <img src={product.images[selectedImage]} className="max-h-full max-w-full object-contain" alt="Zoomed product" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;