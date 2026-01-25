import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Menu, X, Search, Heart, ShoppingBag, Sparkles, Package } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: t.nav.home, href: "/", icon: Package },
    { name: t.nav.shop, href: "/shop", icon: ShoppingBag },
    { name: t.nav.ourStory, href: "/about", icon: Sparkles },
    { name: t.nav.contact, href: "/contact", icon: Heart },
  ];

  return (
    <nav 
      className={`fixed top-10 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-primary/5" 
          : "bg-background/80 backdrop-blur-md border-b border-border/30"
      }`} 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-wine/50 to-transparent animate-pulse" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-center h-16 lg:h-20 ${language === "AR" ? "flex-row" : ""} justify-between`}>
          {/* Logo with enhanced styling */}
          <button onClick={handleHomeClick} className="flex items-center gap-3 cursor-pointer group bg-transparent border-none p-0" aria-label={language === "AR" ? "العودة إلى الصفحة الرئيسية" : language === "FR" ? "Retour à l'accueil" : "Go to homepage"}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-wine/20 to-blush/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <img
                src={logoStatio}
                alt="Instant Créatif Statio logo"
                loading="eager"
                decoding="async"
                className="relative h-10 w-auto max-h-10 object-contain rounded-full sm:h-16 sm:w-16 sm:max-h-16 ring-2 ring-wine/10 group-hover:ring-wine/30 transition-all duration-300 group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block flex items-center gap-3">
              <span className="font-serif text-lg font-semibold bg-gradient-to-r from-wine to-wine/70 bg-clip-text text-transparent leading-none group-hover:from-wine group-hover:to-wine transition-all duration-300">
                Instant Créatif Statio
              </span>
              <div className="text-xs text-muted-foreground font-medium mt-1">
                {language === "AR" ? "متجمل للمنتجات الورقية الفاخرة" : language === "FR" ? "Boutique de produits papier premium" : "Premium Paper Goods Boutique"}
              </div>
            </div>
          </button>

          {/* Desktop Navigation with enhanced styling */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => navigateWithLanguage(link.href)}
                  className="group relative px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-wine/10 hover:to-blush/10 hover:shadow-lg hover:shadow-wine/10 hover:scale-105 bg-transparent border-none p-0"
                  aria-label={link.name}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-wine/60 group-hover:text-wine transition-colors duration-300" />
                    <span className="relative z-10 group-hover:text-wine transition-colors duration-300">{link.name}</span>
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-wine via-wine/80 to-wine transition-all duration-300 group-hover:w-8 rounded-full" />
                </button>
              );
            })}
          </div>

          {/* Right side actions with enhanced styling */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <SearchBar />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Mobile Search */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-wine hover:bg-wine/10 hover:scale-110 transition-all duration-300"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              
              {/* Wishlist */}
              <WishlistDrawer />
              
              {/* Cart */}
              <CartDrawer />
              
              {/* Desktop: Language and Theme removed - now in TopBar */}
              
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-wine hover:bg-wine/10 hover:scale-110 transition-all duration-300 min-w-[44px] min-h-[44px]" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with enhanced styling */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 shadow-xl shadow-wine/5">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.name}
                      onClick={() => navigateWithLanguage(link.href)}
                      className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-wine py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-wine/10 hover:to-blush/5 cursor-pointer transition-all duration-300 hover:scale-105 bg-transparent border-none p-0 w-full text-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                      aria-label={link.name}
                    >
                      <Icon className="h-4 w-4 text-wine/60" />
                      <span>{link.name}</span>
                    </button>
                  );
                })}
                
                {/* Mobile: Language selection */}
                <div className="py-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground mb-3 block font-medium">
                    {language === "AR" ? "اللغة" : language === "FR" ? "Langue" : "Language"}
                  </span>
                  <div className="flex gap-2">
                    {(["EN", "FR", "AR"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`text-sm px-3 py-2 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                          language === lang
                            ? "bg-gradient-to-r from-wine to-wine/80 text-primary-foreground shadow-lg shadow-wine/25"
                            : "text-foreground hover:text-wine border border-border/50 hover:border-wine/30 hover:bg-blush/10"
                        }`}
                      >
                        <img 
                          src={lang === "AR" ? "/assets/flags/dz.svg" : lang === "FR" ? "/assets/flags/fr.svg" : "/assets/flags/gb.svg"} 
                          alt={lang} 
                          className="w-5 h-4 object-cover rounded-sm" 
                        /> 
                        <span className="font-medium">{lang}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Mobile: Currency selection */}
                <div className="py-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground mb-3 block font-medium">{t.currency}</span>
                  <div className="flex gap-2">
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`text-sm px-3 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                          currency === curr
                            ? "bg-gradient-to-r from-wine to-wine/80 text-primary-foreground shadow-lg shadow-wine/25"
                            : "text-foreground hover:text-wine border border-border/50 hover:border-wine/30 hover:bg-blush/10"
                        }`}
                      >
                        <span className="font-medium">{curr}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile: Preferences and Theme Toggle */}
                <div className="py-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-border/20 to-blush/5">
                      <PreferencesMenu />
                    </div>
                    <div className="p-2 rounded-xl bg-gradient-to-br from-border/20 to-blush/5">
                      <ThemeToggle />
                    </div>
                  </div>
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
