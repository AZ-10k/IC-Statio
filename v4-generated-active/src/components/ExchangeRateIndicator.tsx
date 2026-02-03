import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ExchangeRateIndicator = () => {
  const { currency, rates, isLoading } = useCurrency();
  const { language } = useLanguage();

  // Only show when not in DZD
  if (currency === "DZD") return null;

  const labels = {
    EN: { rate: "Exchange rate", loading: "Loading rates..." },
    FR: { rate: "Taux de change", loading: "Chargement..." },
    AR: { rate: "سعر الصرف", loading: "جاري التحميل..." },
  };

  const t = labels[language];
  const rateValue = Math.round(rates[currency]);
  const currencySymbol = currency === "EUR" ? "€" : "$";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>{t.loading}</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md cursor-help">
            <Info className="h-3 w-3" />
            <span>1 {currencySymbol} ≈ {rateValue.toLocaleString()} DA</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t.rate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExchangeRateIndicator;