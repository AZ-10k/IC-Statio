import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoStatio from "@/assets/logo-statio.jpg";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PreferencesMenu from "./PreferencesMenu";
import SearchBar from "./SearchBar";
import WishlistDrawer from "./WishlistDrawer";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";

const currencies: Array<"DZD" | "EUR" | "USD"> = ["DZD", "EUR", "USD"];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Utility function to navigate while preserving language parameter
  const navigateWithLanguage = (url: string) => {
    const currentLang = (searchParams.get("lang") || language).toLowerCase();
    const urlObj = new URL(url, window.location.origin);

    // Only add lang parameter if it's not already present
    if (!urlObj.searchParams.has("lang")) {
      urlObj.searchParams.set("lang", currentLang);
    }

    window.location.href = urlObj.toString();
  };

  const handleHomeClick = () => {
    // Always navigate to home with current language parameter
    navigateWithLanguage("/");
    setIsMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle special cases for section scrolling
    if (href.startsWith("/#")) {
      e.preventDefault();
      const sectionId = href.substring(2);
      // If we're not on the home page, navigate there first
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.shop, href: "/shop" },
    { name: t.nav.ourStory, href: "/about" },
    { name: t.nav.contact, href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center h-16 lg:h-20 ${language === "AR" ? "flex-row" : ""} justify-between`}>
          <div onClick={handleHomeClick} className="flex items-center gap-3 cursor-pointer">
            <img
              src={logoStatio}
              alt="Instant Créatif Statio logo"
              loading="eager"
              decoding="async"
              className="h-10 w-auto max-h-10 object-contain rounded-full sm:h-16 sm:w-16 sm:max-h-16"
            />
            <span className="hidden sm:block font-serif text-lg font-semibold text-primary leading-none self-center">Instant Créatif Statio</span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                onClick={() => navigateWithLanguage(link.href)}
                className="group relative px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 cursor-pointer rounded-lg hover:bg-primary/5"
              >
                <span className="relative z-10 group-hover:text-primary transition-colors duration-300">{link.name}</span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-primary/60 via-primary to-primary/60 transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <SearchBar />
            <WishlistDrawer />
            {/* Cart Drawer - opens side drawer */}
            <CartDrawer />
            <Button variant="ghost" size="icon" className="lg:hidden text-primary cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  onClick={() => navigateWithLanguage(link.href)}
                  className="text-sm font-medium text-foreground hover:text-primary py-2 cursor-pointer"
                >
                  {link.name}
                </div>
              ))}
              {/* Mobile: Language selection */}
              <div className="py-2 border-t border-border">
                <span className="text-xs text-muted-foreground mb-2 block">
                  {language === "AR" ? "اللغة" : language === "FR" ? "Langue" : "Language"}
                </span>
                <div className="flex gap-2">
                    {(["EN", "FR", "AR"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`text-sm px-3 py-1.5 rounded cursor-pointer flex items-center gap-1.5 ${
                        language === lang
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:text-primary border border-border"
                      }`}
                    >
                      <img src={lang === "AR" ? "https://flagcdn.com/w40/dz.png" : lang === "FR" ? "https://flagcdn.com/w40/fr.png" : "https://flagcdn.com/w40/gb.png"} alt={lang} className="w-5 h-4 object-cover rounded-sm" /> {lang}
                    </button>
                  ))}
                </div>
              </div>
              {/* Mobile: Currency selection */}
              <div className="py-2">
                <span className="text-xs text-muted-foreground mb-2 block">{t.currency}</span>
                <div className="flex gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`text-sm px-3 py-1.5 rounded cursor-pointer ${
                        currency === curr
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:text-primary border border-border"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile: Preferences and Theme Toggle */}
              <div className="py-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <PreferencesMenu />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
