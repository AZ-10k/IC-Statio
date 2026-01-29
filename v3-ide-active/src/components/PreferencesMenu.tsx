import { useState, useEffect } from "react";
import { Globe, Check, ChevronDown, Languages, X, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "AR", name: "العربية", flag: "https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Algeria.svg" },
  { code: "EN", name: "English", flag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" },
  { code: "FR", name: "Français", flag: "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg" },
];

const currencies: { code: "DZD" | "EUR" | "USD"; label: { EN: string; FR: string; AR: string } }[] = [
  { code: "DZD", label: { EN: "DZD: Algerian Dinar", FR: "DZD : Dinar algérien", AR: "د.ج : الدينار الجزائري" } },
  { code: "EUR", label: { EN: "EUR: Euro", FR: "EUR : Euro", AR: "EUR : اليورو" } },
  { code: "USD", label: { EN: "USD: US Dollar", FR: "USD : Dollar américain", AR: "USD : الدولار الأمريكي" } },
];

const currencySymbols: { code: "DZD" | "EUR" | "USD"; symbol: string }[] = [
  { code: "DZD", symbol: "د.ج" },
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
];

const PreferencesMenu = () => {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { language, setLanguage, isRTL } = useLanguage();
  const { setCurrency, currency: currentCurrencyState } = useCurrency();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [pendingLanguage, setPendingLanguage] = useState<Language>(language);
  const [pendingCurrency, setPendingCurrency] = useState<"DZD" | "EUR" | "USD">(currentCurrencyState || "DZD");

  // --- NEW: Sync Language when URL changes manually ---
  useEffect(() => {
    const urlLang = searchParams.get("lang")?.toUpperCase() as Language;
    if (urlLang && languages.some(l => l.code === urlLang) && urlLang !== language) {
      setLanguage(urlLang);
      setPendingLanguage(urlLang);
    }
  }, [searchParams, language, setLanguage]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isClickInsidePopover = target.closest('[data-radix-popover-content]');
      const isClickInsideTrigger = target.closest('[data-radix-popover-trigger]');
      
      if (!isClickInsidePopover && !isClickInsideTrigger && (languageOpen || currencyOpen)) {
        setLanguageOpen(false);
        setCurrencyOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, languageOpen, currencyOpen]);

  const handleConfirm = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLanguage(pendingLanguage);
    setCurrency(pendingCurrency);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("lang", pendingLanguage.toLowerCase());
    newSearchParams.delete("currency"); 
    
    const queryString = newSearchParams.toString();
    const newPath = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
    
    navigate(newPath, { replace: true });
    setOpen(false);
    
    if (isMobile) {
      const event = new CustomEvent('closeMobileMenu');
      window.dispatchEvent(event);
    }
  };

  const labels = {
    EN: { 
      language: "Language", 
      currency: "Currency",
      confirm: "Confirm Selection",
      selectLanguageAndCurrency: "Select the Language and Currency"
    },
    FR: { 
      language: "Langue", 
      currency: "Devise",
      confirm: "Confirmer la sélection",
      selectLanguageAndCurrency: "Sélectionnez la langue et la devise"
    },
    AR: { 
      language: "اللغة", 
      currency: "العملة",
      confirm: "تأكيد الاختيار",
      selectLanguageAndCurrency: "اختر اللغة والعملة"
    },
  };

  const t = labels[language];
  const currentLanguageItem = languages.find(lang => lang.code === language);
  const currentCurrencySymbol = currencySymbols.find(sym => sym.code === currentCurrencyState);

  const handleLanguageToggle = () => {
    if (currencyOpen) setCurrencyOpen(false);
    setLanguageOpen(!languageOpen);
  };

  const handleCurrencyToggle = () => {
    if (languageOpen) setLanguageOpen(false);
    setCurrencyOpen(!currencyOpen);
  };

  const handleLanguageSelect = (langCode: Language, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingLanguage(langCode);
    setLanguageOpen(false);
  };

  const handleCurrencySelect = (currCode: "DZD" | "EUR" | "USD", e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingCurrency(currCode);
    setCurrencyOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setPendingLanguage(language);
      setPendingCurrency(currentCurrencyState);
      setLanguageOpen(false);
      setCurrencyOpen(false);
    }
  };

  const CollapsibleSection = ({ 
    title, 
    isOpen, 
    onToggle, 
    children,
    showChevron = true,
    selectedValue,
    selectedIcon
  }: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    showChevron?: boolean;
    selectedValue?: string;
    selectedIcon?: React.ReactNode;
  }) => (
    <div>
      <div className="py-1">
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className="border border-border/50 rounded-lg overflow-hidden transition-all duration-200">
        <div 
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "px-3 py-2 bg-background transition-all duration-200 cursor-pointer hover:bg-muted/50 border-b border-border/50",
            isOpen && "bg-blue-50 border-blue-200"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedValue && (
                <span className="text-sm text-muted-foreground">{selectedValue}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedIcon}
              {showChevron && (
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
              )}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="p-1 bg-background animate-in fade-in-0 zoom-in-95 duration-200">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-foreground hover:text-primary cursor-pointer flex items-center px-2 py-1 transition-all duration-200"
          aria-label="Preferences"
        >
          <span className="flex items-center">
            {currentLanguageItem && (
              <>
                <img 
                  src={currentLanguageItem.flag} 
                  alt={currentLanguageItem.name} 
                  className={cn("w-4 h-3 object-cover rounded-sm", isRTL ? "ml-1" : "mr-1")} 
                />
                <span className="font-medium text-sm">{currentLanguageItem.name}</span>
              </>
            )}
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-sm">
              {language !== "AR" && currentCurrencyState === "DZD" ? "DA" : currentCurrencySymbol?.symbol}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200 ml-1", open && "rotate-180")} strokeWidth={1.5} />
          </span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent
        className={cn(
          "w-64 p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-xl shadow-wine/10 rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200",
          isMobile ? "bottom-4" : ""
        )}
        align={isMobile ? "center" : "end"}
        side={isMobile ? "top" : "bottom"}
        sideOffset={8}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="relative border-b border-border/50 px-3 pt-1 pb-3 flex flex-col items-center">
          <div className={cn("w-full flex justify-end", isRTL ? "flex-row-reverse" : "")}>
            <Button
              variant="ghost"
              size="sm"
              onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); }}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground -mb-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground font-medium text-center px-4 leading-tight">
            {t.selectLanguageAndCurrency}
          </p>
        </div>

        <div className="px-3 pb-3 space-y-2 mt-2">
          <CollapsibleSection
            title={t.language}
            isOpen={languageOpen}
            onToggle={handleLanguageToggle}
            selectedValue={languages.find(lang => lang.code === pendingLanguage)?.name}
            selectedIcon={<Languages className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onPointerDown={(e) => handleLanguageSelect(lang.code, e)}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm cursor-pointer transition-all duration-200 rounded min-h-[36px] text-foreground hover:bg-blue-600 hover:text-white"
                >
                  <span className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse" : "")}>
                    {isRTL ? (
                      <>
                        <span className="font-medium text-sm">{lang.name}</span>
                        <img src={lang.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
                      </>
                    ) : (
                      <>
                        <img src={lang.flag} alt="" className="w-4 h-3 object-cover rounded-sm" />
                        <span className="font-medium text-sm">{lang.name}</span>
                      </>
                    )}
                  </span>
                  {pendingLanguage === lang.code && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title={t.currency}
            isOpen={currencyOpen}
            onToggle={handleCurrencyToggle}
            selectedValue={currencies.find(curr => curr.code === pendingCurrency)?.label[language]}
            selectedIcon={<Banknote className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-1">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onPointerDown={(e) => handleCurrencySelect(curr.code, e)}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm cursor-pointer transition-all duration-200 rounded min-h-[36px] text-foreground hover:bg-blue-600 hover:text-white"
                >
                  <span className="font-medium text-sm">{curr.label[language]}</span>
                  {pendingCurrency === curr.code && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        <div className="p-3 border-t border-border/50 bg-muted/30">
          <Button
            type="button"
            onPointerDown={handleConfirm}
            className="w-full bg-wine hover:bg-wine/90 text-primary-foreground h-9 text-sm font-medium shadow-lg transition-all duration-300 hover:scale-105"
          >
            {t.confirm}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PreferencesMenu;