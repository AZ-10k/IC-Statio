import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const getSEOLabels = (language: "EN" | "FR" | "AR") => ({
  EN: {
    title: "Our Story - Instant Créatif Statio",
    description: "Learn about Instant Créatif Statio, the sister brand of Instant Créatif. We bring passion for design and detail to your daily life with premium planners and stationery.",
  },
  FR: {
    title: "Notre Histoire - Instant Créatif Statio",
    description: "Découvrez Instant Créatif Statio, la marque sœur d'Instant Créatif. Nous apportons passion du design et attention aux détails à votre quotidien.",
  },
  AR: {
    title: "قصتنا - إنستانت كرياتيف ستاتيو",
    description: "تعرف على إنستانت كرياتيف ستاتيو، العلامة التجارية الشقيقة لإنستانت كرياتيف. نجلب شغف التصميم والاهتمام بالتفاصيل إلى حياتك اليومية.",
  },
}[language]);

const About = () => {
  const { language, isRTL } = useLanguage();
  const seoLabels = getSEOLabels(language);

  const content = {
    EN: {
      title: "Our Story",
      backToHome: "Back to Home",
      welcome: "Welcome to",
      brandName: "Instant Créatif Statio",
      paragraph1: "We are the sister brand of",
      instantCreatif: "Instant Créatif",
      paragraph1b: ", known for crafting exquisite custom packaging and boxes. We bring that same passion for design and detail to your daily life.",
      paragraph2: "While Instant Créatif wraps your special gifts,",
      statio: "Statio",
      paragraph2b: "helps you organize your future with premium planners, notebooks, and tags.",
    },
    FR: {
      title: "Notre Histoire",
      backToHome: "Retour à l'accueil",
      welcome: "Bienvenue chez",
      brandName: "Instant Créatif Statio",
      paragraph1: "Nous sommes la marque sœur de",
      instantCreatif: "Instant Créatif",
      paragraph1b: ", connue pour la création d'emballages et de boîtes personnalisées exquises. Nous apportons cette même passion pour le design et le détail à votre vie quotidienne.",
      paragraph2: "Tandis qu'Instant Créatif emballe vos cadeaux spéciaux,",
      statio: "Statio",
      paragraph2b: "vous aide à organiser votre avenir avec des planners, des carnets et des étiquettes de qualité supérieure.",
    },
    AR: {
      title: "قصتنا",
      backToHome: "العودة للرئيسية",
      welcome: "مرحباً بكم في",
      brandName: "Instant Créatif Statio",
      paragraph1: "نحن العلامة التجارية الشقيقة لـ",
      instantCreatif: "Instant Créatif",
      paragraph1b: "، المعروفة بصناعة التغليف والصناديق المخصصة الرائعة. نحن نجلب نفس الشغف بالتصميم والتفاصيل إلى حياتكم اليومية.",
      paragraph2: "بينما يقوم Instant Créatif بتغليف هداياكم الخاصة،",
      statio: "Statio",
      paragraph2b: "يساعدكم على تنظيم مستقبلكم مع المخططات والدفاتر والعلامات الفاخرة.",
    },
  };

  const t = content[language];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <SEO 
        title={seoLabels.title}
        description={seoLabels.description}
        canonical="/about"
      />
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {t.backToHome}
          </Link>

          <section className="py-12 lg:py-20 bg-blush rounded-xl">
            <div className="max-w-4xl mx-auto text-center px-6">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary mb-8">
                {t.title}
              </h1>

              <div className="space-y-6 text-foreground text-lg lg:text-xl leading-relaxed">
                <p>
                  {t.welcome} <span className="font-serif font-semibold text-primary">{t.brandName}</span>.
                </p>
                <p>
                  {t.paragraph1} <span className="font-medium">{t.instantCreatif}</span>{t.paragraph1b}
                </p>
                <p>
                  {t.paragraph2} <span className="font-serif italic">{t.statio}</span> {t.paragraph2b}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default About;
