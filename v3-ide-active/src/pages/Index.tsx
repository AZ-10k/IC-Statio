import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import RecentlyViewed from "@/components/RecentlyViewed";
import ClientLove from "@/components/ClientLove";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { useLanguage } from "@/contexts/LanguageContext";

const getSEOLabels = (language: "EN" | "FR" | "AR") => ({
  EN: {
    title: "Instant Créatif Statio - Premium Stationery & Planners Algeria",
    description: "Discover elegant stationery, planners, and accessories. Premium quality products crafted with love, delivered across Algeria.",
  },
  FR: {
    title: "Instant Créatif Statio - Papeterie & Agendas Algérie",
    description: "Découvrez notre papeterie élégante, planners et accessoires. Produits de qualité supérieure fabriqués avec amour, livrés partout en Algérie.",
  },
  AR: {
    title: "إنستانت كرياتيف ستاتيو - قرطاسية فاخرة ومخططات الجزائر",
    description: "اكتشف القرطاسية الأنيقة والمخططات والإكسسوارات. منتجات عالية الجودة مصنوعة بحب، يتم توصيلها في جميع أنحاء الجزائر.",
  },
}[language]);

const Index = () => {
  const { isRTL, language } = useLanguage();
  const seoLabels = getSEOLabels(language);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={seoLabels.title}
        description={seoLabels.description}
        canonical="/"
      />
      <StructuredData type="Organization" />
      <Navbar />
      <main>
        <Hero />
        <BestSellers />
        <RecentlyViewed />
        <ClientLove />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
