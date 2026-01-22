import { Link } from "react-router-dom";
import { productData, Product } from "@/data/products";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import WishlistButton from "./WishlistButton";

interface RelatedProductsProps {
  currentProduct: Product;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const formatPrice = useFormattedPrice();
  const { language, isRTL } = useLanguage();

  const relatedProducts = productData
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product.id !== currentProduct.id
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  const labels = {
    EN: "You May Also Like",
    FR: "Vous Aimerez Aussi",
    AR: "قد يعجبك أيضاً",
  };

  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-primary mb-8 text-center">
          {labels[language]}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <WishlistButton
                  productId={product.id}
                  size="sm"
                  className="absolute top-2 right-2"
                />
              </div>
              <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm font-semibold text-primary mt-1">
                {formatPrice(product.priceDZD)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
