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
      className={`fixed top-0 left-0 right-0 w-full h-10 z-[60] transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5"
          : "bg-background/80 backdrop-blur-md border-b border-border/30"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="w-full px-4 flex items-center justify-between h-full">
        {/* Shipping info - positioned based on language direction */}
        <div className={`flex items-center gap-2 text-xs text-muted-foreground font-medium ${isRTL ? "flex-row-reverse" : ""}`}>
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

        {/* Language and Theme controls */}
        <div className={`flex items-center gap-2 min-h-[44px]`}>
          <ThemeToggle />
          <PreferencesMenu />
        </div>
      </div>
    </div>
  );
};

export default TopBar;