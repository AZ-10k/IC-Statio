import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "AR", name: "العربية", flag: "/assets/flags/dz.svg" },
  { code: "EN", name: "English", flag: "/assets/flags/gb.svg" },
  { code: "FR", name: "Français", flag: "/assets/flags/fr.svg" },
];

const currencies: { code: "DZD" | "EUR" | "USD"; label: { EN: string; FR: string; AR: string } }[] = [
  { code: "DZD", label: { EN: "DZD: DA", FR: "DZD : DA", AR: "الدينار الجزائري: د.ج" } },
  { code: "EUR", label: { EN: "EUR: €", FR: "EUR : €", AR: "€ :اليورو" } },
  { code: "USD", label: { EN: "USD: $", FR: "USD : $", AR: "$ :الدولار الأمريكي" } },
];

const PreferencesMenu = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, isRTL } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [pendingLanguage, setPendingLanguage] = useState<Language>(language);
  const [pendingCurrency, setPendingCurrency] = useState<"DZD" | "EUR" | "USD">(currency);

  const labels = {
    EN: { 
      language: "Language", 
      currency: "Currency",
      confirm: "Confirm"
    },
    FR: { 
      language: "Langue", 
      currency: "Devise",
      confirm: "Confirmer"
    },
    AR: { 
      language: "اللغة", 
      currency: "العملة",
      confirm: "تأكيد"
    },
  };

  const t = labels[language];

  // Reset pending selections when popover opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setPendingLanguage(language);
      setPendingCurrency(currency);
    }
  };

  const handleConfirm = () => {
    setLanguage(pendingLanguage);
    setCurrency(pendingCurrency);
    setOpen(false);
  };

  const hasChanges = pendingLanguage !== language || pendingCurrency !== currency;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-foreground hover:text-primary cursor-pointer flex items-center gap-1 px-2"
          aria-label="Preferences"
        >
          <Globe className="h-5 w-5" strokeWidth={1.5} />
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 bg-background border-border shadow-lg"
        align="end"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Language Section */}
        <div className="p-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {t.language}
          </p>
          <div className="space-y-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setPendingLanguage(lang.code);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
                  pendingLanguage === lang.code
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="flex items-center gap-2">
                  <img 
                    src={lang.flag} 
                    alt={lang.name} 
                    className="w-5 h-4 object-cover rounded-sm" 
                  />
                  <span>{lang.name}</span>
                </span>
                {pendingLanguage === lang.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Section */}
        <div className="p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {t.currency}
          </p>
          <div className="space-y-1">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  setPendingCurrency(curr.code);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
                  pendingCurrency === curr.code
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span className="flex items-center" dir={language === "AR" ? "ltr" : "auto"}>
                  {curr.label[language]}
                </span>
                {pendingCurrency === curr.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="p-3 border-t border-border">
          <Button
            onClick={handleConfirm}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            disabled={!hasChanges}
          >
            {t.confirm}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PreferencesMenu;
