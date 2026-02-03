import { Helmet } from "react-helmet-async";
import { Product } from "@/data/products";

interface StructuredDataProps {
  type: "Organization" | "Product" | "BreadcrumbList";
  data?: Product | Array<{ name: string; url: string }>;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  let schema: Record<string, unknown> = {};

  switch (type) {
    case "Organization":
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Instant Créatif Statio",
        url: "https://icstatio.netlify.app",
        logo: "https://icstatio.netlify.app/logo-statio.jpg",
        sameAs: [
          "https://www.instagram.com/ic.statio/",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["English", "French", "Arabic"],
        },
      };
      break;

    case "Product":
      if (data && !Array.isArray(data)) {
        const product = data as Product;
        schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: Array.isArray(product.images) ? product.images : [product.image],
          description: product.description,
          category: product.category,
          offers: {
            "@type": "Offer",
            price: product.priceDZD,
            priceCurrency: "DZD",
            availability: "https://schema.org/InStock",
            url: `https://icstatio.netlify.app/product/${product.id}`,
          },
        };
      }
      break;

    case "BreadcrumbList":
      if (data && Array.isArray(data)) {
        schema = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };
      }
      break;
  }

  if (!schema || Object.keys(schema).length === 0) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
