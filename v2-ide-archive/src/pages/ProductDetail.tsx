import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import WishlistButton from "@/components/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";
import ProductReviews from "@/components/ProductReviews";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";
import PriceDisplay from "@/components/PriceDisplay";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getProductById } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { t, isRTL, language } = useLanguage();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceDZD,
      image: product.images[0],
    });
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
            <Link to="/" className="text-primary hover:underline">
              {t.productDetail.returnToCatalog}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seoTitle = `${product.name} | Instant Créatif Statio`;
  const seoDescription = product.description.substring(0, 155) + "...";

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonical={`/product/${product.id}`}
        type="product"
        image={Array.isArray(product.images) ? product.images[0] : product.image}
      />
      {product && <StructuredData type="Product" data={product} />}
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {t.productDetail.backToCatalog}
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  loading={selectedImage === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
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
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <PriceDisplay priceDZD={product.priceDZD} size="lg" className="text-2xl lg:text-3xl" />
                  <ExchangeRateIndicator />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ShoppingCart className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {language === "AR" ? "أضف إلى السلة" : language === "FR" ? "Ajouter au panier" : "Add to Cart"}
              </Button>

              {/* Shipping Terms Link */}
              <Link
                to="/shipping-terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors text-center block"
              >
                {t.productDetail.shippingAll} →
              </Link>

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
    </div>
  );
};

export default ProductDetail;
