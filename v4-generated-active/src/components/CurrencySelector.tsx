import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const currencies: { code: "DZD" | "EUR" | "USD"; label: { EN: string; FR: string; AR: string } }[] = [
  { code: "DZD", label: { EN: "DZD: DA", FR: "DZD : DA", AR: "الدينار الجزائري: د.ج" } },
  { code: "EUR", label: { EN: "EUR: €", FR: "EUR : €", AR: "€ :اليورو" } },
  { code: "USD", label: { EN: "USD: $", FR: "USD : $", AR: "$ :الدولار الأمريكي" } },
];

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-muted"
      >
        {currencies.find(c => c.code === currency)?.label[language] || "DA"}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => {
                setCurrency(curr.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${
                currency === curr.code
                  ? "bg-blush text-primary font-medium"
                  : "text-foreground hover:bg-blush/50"
              }`}
            >
              {curr.label[language]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
