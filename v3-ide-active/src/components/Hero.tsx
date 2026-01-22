import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import heroImage from "@/assets/hero-stationery.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleShopClick = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLearnMoreClick = () => {
    navigate("/about");
  };

  return (
    <section className={`relative min-h-screen bg-blush flex items-center pt-16 lg:pt-20 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Shipping Banner */}
      <div className="absolute top-16 lg:top-20 left-0 right-0 bg-primary text-primary-foreground py-2.5 z-10">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-center gap-2 text-sm">
          <Truck className="h-4 w-4" />
          <span>{t.hero.shippingBanner}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className={`text-center lg:text-${isRTL ? "right" : "left"} space-y-6 lg:space-y-8 animate-fade-in`}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-primary leading-tight tracking-tight">
              {t.hero.title1}
              <br />
              <span className="font-light italic">{t.hero.title2}</span>
            </h1>
            <p className={`text-lg md:text-xl text-foreground max-w-xl mx-auto ${isRTL ? "lg:mr-0 lg:ml-auto" : "lg:mx-0"}`}>
              {t.hero.subtitle}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? "lg:justify-end" : "lg:justify-start"}`}>
              <Button 
                size="lg" 
                onClick={handleShopClick}
                className="text-base px-8 py-6 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {t.hero.shopButton}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleLearnMoreClick}
                className="text-base px-8 py-6 rounded-md font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
              >
                {t.hero.learnMore}
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative overflow-hidden rounded-lg shadow-hover">
              <img
                src={heroImage}
                alt="Premium stationery collection featuring planners, notebooks, and accessories"
                loading="eager"
                decoding="async"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-background rounded-full opacity-60 blur-xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-background rounded-full opacity-40 blur-2xl" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
