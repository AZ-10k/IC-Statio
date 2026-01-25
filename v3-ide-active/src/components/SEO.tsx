import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  language?: "EN" | "FR" | "AR";
}

const SEO = ({ title, description, canonical, image, type = "website", language = "EN" }: SEOProps) => {
  const baseUrl = "https://icstatio.netlify.app";
  const defaultImage = `${baseUrl}/logo-statio.jpg`;
  const ogImage = image || defaultImage;
  const currentPath = canonical || "/";
  
  // Locale mapping
  const localeMap = {
    EN: "en_US",
    FR: "fr_FR",
    AR: "ar_DZ"
  };
  
  // Build canonical URL with language parameter
  const canonicalUrl = canonical ? `${baseUrl}${canonical}?lang=${language.toLowerCase()}` : undefined;
  const ogUrl = canonicalUrl || baseUrl;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* hreflang links for multilingual SEO */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}${currentPath}?lang=en`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}${currentPath}?lang=fr`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}${currentPath}?lang=ar`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${currentPath}?lang=en`} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Instant Créatif Statio" />
      <meta property="og:locale" content={localeMap[language]} />
      {/* Only show alternates for OTHER languages */}
      {language !== "EN" && <meta property="og:locale:alternate" content="en_US" />}
      {language !== "FR" && <meta property="og:locale:alternate" content="fr_FR" />}
      {language !== "AR" && <meta property="og:locale:alternate" content="ar_DZ" />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      
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
