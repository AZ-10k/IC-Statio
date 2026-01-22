import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
}

const SEO = ({ title, description, canonical, image, type = "website" }: SEOProps) => {
  const baseUrl = "https://icstatio.netlify.app";
  const defaultImage = `${baseUrl}/logo-statio.jpg`;
  const ogImage = image || defaultImage;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Instant Créatif Statio" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_FR" />
      <meta property="og:locale:alternate" content="ar_DZ" />
      {canonical && <meta property="og:url" content={`${baseUrl}${canonical}`} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@ic.statio" />
      <meta name="twitter:creator" content="@ic.statio" />
    </Helmet>
  );
};

export default SEO;
