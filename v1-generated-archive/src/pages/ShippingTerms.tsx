import { Link } from "react-router-dom";
import { ArrowLeft, Truck, CreditCard, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ShippingCalculator from "@/components/ShippingCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

const ShippingTerms = () => {
  const { t, isRTL } = useLanguage();

  const sections = [
    { icon: Truck, title: t.shippingPage.shippingTitle, content: t.shippingPage.shippingContent },
    { icon: CreditCard, title: t.shippingPage.paymentTitle, content: t.shippingPage.paymentContent },
    { icon: RotateCcw, title: t.shippingPage.returnsTitle, content: t.shippingPage.returnsContent },
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {t.productDetail.backToCatalog}
          </Link>

          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-8 text-center">{t.shippingPage.title}</h1>

            <div className="space-y-8 mb-12">
              {sections.map((section, index) => (
                <div key={index} className="bg-card rounded-lg p-6 lg:p-8 shadow-card hover:shadow-hover transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-semibold text-primary mb-2">{section.title}</h2>
                      <p className="text-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Calculator Widget */}
            <div className="bg-card rounded-lg p-6 lg:p-8 shadow-card">
              <ShippingCalculator />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ShippingTerms;
