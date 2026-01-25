import { useLanguage } from "@/contexts/LanguageContext";
import PreferencesMenu from "./PreferencesMenu";
import ThemeToggle from "./ThemeToggle";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";

const TopBar = () => {
  const { language } = useLanguage();
  const isRTL = language === "AR";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 left-0 right-0 flex items-center h-10 px-4 lg:px-8 z-[60] ${isRTL ? "rtl" : "ltr"} relative transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
          : "bg-background/80 backdrop-blur-md border-b border-border/30"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Center - Shipping info */}
      <div className={`absolute flex items-center gap-2 text-xs text-muted-foreground font-medium ${isRTL ? "flex-row-reverse" : ""} ${
        isRTL 
          ? "md:left-1/2 md:-translate-x-1/2 right-4 left-auto" 
          : "md:left-1/2 md:-translate-x-1/2 left-4 right-auto"
      }`}>
        {language === "AR" ? (
          <>
            {"نحن نشحن في جميع أنحاء الجزائر (58 ولاية)"}
            <Truck className="h-3 w-3 scale-x-[-1]" />
          </>
        ) : (
          <>
            <Truck className="h-3 w-3" />
            {language === "FR" 
              ? "Livraison dans toute l'Algérie (58 Wilayas)"
              : "We ship across all Algeria (58 Wilayas)"
            }
          </>
        )}
      </div>

      {/* Language and Theme controls - positioned based on language direction */}
      <div className={`flex items-center gap-2 ${isRTL ? "mr-auto" : "ml-auto"} min-h-[44px]`}>
        <ThemeToggle />
        <PreferencesMenu />
      </div>
    </div>
  );
};

export default TopBar;