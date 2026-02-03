import { useCurrency, useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice as formatPriceUtil } from "@/utils/formatPrice";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  priceDZD: number;
  showOriginal?: boolean;
  className?: string;
  originalClassName?: string;
  size?: "sm" | "md" | "lg";
}

const PriceDisplay = ({ 
  priceDZD, 
  showOriginal = true, 
  className,
  originalClassName,
  size = "md" 
}: PriceDisplayProps) => {
  const { currency, isLoading } = useCurrency();
  const { language } = useLanguage();
  const formatPrice = useFormattedPrice();

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const originalSizeClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
  };

  if (isLoading && currency !== "DZD") {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formattedPrice = formatPrice(priceDZD);
  const originalPrice = formatPriceUtil(priceDZD, "DZD", language);
  const showOriginalPrice = showOriginal && currency !== "DZD";

  return (
    <div className="flex flex-col">
      <span className={cn("font-semibold text-foreground", sizeClasses[size], className)}>
        {formattedPrice}
      </span>
      {showOriginalPrice && (
        <span className={cn(
          "text-muted-foreground",
          originalSizeClasses[size],
          originalClassName
        )}>
          ({originalPrice})
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;