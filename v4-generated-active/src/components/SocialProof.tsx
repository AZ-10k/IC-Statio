import { Eye, ShoppingBag, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SocialProofProps {
  viewCount?: number;
  purchaseCount?: number;
  showPurchases?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SocialProof = ({
  viewCount,
  purchaseCount,
  showPurchases = true,
  size = "sm",
  className = ""
}: SocialProofProps) => {
  const { language } = useLanguage();

  if (!viewCount && !purchaseCount) return null;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className={`flex items-center gap-3 text-muted-foreground ${sizeClasses[size]} ${className}`}>
      {/* View Count */}
      {viewCount && viewCount > 0 && (
        <div className="flex items-center gap-1">
          <Eye className={`${iconSizes[size]} text-blue-500`} />
          <span>
            {formatNumber(viewCount)} {language === "AR" ? "مشاهدة" : language === "FR" ? "vues" : "views"}
          </span>
        </div>
      )}

      {/* Purchase Count */}
      {showPurchases && purchaseCount && purchaseCount > 0 && (
        <div className="flex items-center gap-1">
          <ShoppingBag className={`${iconSizes[size]} text-green-500`} />
          <span>
            {formatNumber(purchaseCount)} {language === "AR" ? "مُباع" : language === "FR" ? "achetés" : "sold"}
          </span>
        </div>
      )}
    </div>
  );
};

export default SocialProof;