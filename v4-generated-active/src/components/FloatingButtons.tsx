import { useState, useEffect } from "react";
import { ArrowUp, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { INSTAGRAM_PROFILE_URL } from "@/constants/socialLinks";

const FloatingButtons = () => {
  const { isRTL, t } = useLanguage();
  const [isScrollVisible, setIsScrollVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrollVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`fixed bottom-6 z-50 flex flex-col items-center gap-3 transition-all duration-300 ${isRTL ? "left-6" : "right-6"}`}>
      {/* Scroll To Top Arrow - only shows when scrolled */}
      {isScrollVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 animate-fade-in cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Instagram Button */}
      <div className="relative group">
        {/* Text Label - Hidden by default, reveals on hover */}
        <div className={`absolute bottom-0 ${isRTL ? "right-full mr-3" : "left-full ml-3"} flex items-center bg-white text-foreground px-4 py-2 rounded-full shadow-lg w-0 overflow-hidden opacity-0 pointer-events-none group-hover:w-auto group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-in-out whitespace-nowrap`}>
          <span className="text-sm font-medium">{t.floatingButton.dmToOrder}</span>
        </div>
        
        {/* Instagram Button - Official Instagram gradient with hover glow */}
        <a
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-14 h-14 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(221,42,123,0.6)]"
          aria-label="Contact us on Instagram"
        >
          <Instagram className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
};

export default FloatingButtons;
