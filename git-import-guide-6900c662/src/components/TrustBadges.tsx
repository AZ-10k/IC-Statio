import { Shield, Truck, RefreshCw, Award, Lock, CreditCard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrustBadgesProps {
  variant?: "horizontal" | "vertical" | "compact";
  showLabels?: boolean;
  className?: string;
}

const TrustBadges = ({
  variant = "horizontal",
  showLabels = true,
  className = ""
}: TrustBadgesProps) => {
  const { language } = useLanguage();

  const badges = [
    {
      icon: Shield,
      label: {
        EN: "Secure Payment",
        FR: "Paiement Sécurisé",
        AR: "دفع آمن"
      },
      description: {
        EN: "SSL encrypted checkout",
        FR: "Paiement SSL chiffré",
        AR: "دفع مشفر بـ SSL"
      }
    },
    {
      icon: Truck,
      label: {
        EN: "Free Shipping",
        FR: "Livraison Gratuite",
        AR: "شحن مجاني"
      },
      description: {
        EN: "On orders over 5000 DZD",
        FR: "Sur commandes > 5000 DZD",
        AR: "على الطلبات فوق 5000 دج"
      }
    },
    {
      icon: RefreshCw,
      label: {
        EN: "Easy Returns",
        FR: "Retours Faciles",
        AR: "إرجاع سهل"
      },
      description: {
        EN: "30-day return policy",
        FR: "Politique de retour 30 jours",
        AR: "سياسة إرجاع 30 يوم"
      }
    },
    {
      icon: Award,
      label: {
        EN: "Premium Quality",
        FR: "Qualité Premium",
        AR: "جودة ممتازة"
      },
      description: {
        EN: "Handcrafted stationery",
        FR: "Papeterie artisanale",
        AR: "قرطاسية يدوية الصنع"
      }
    },
    {
      icon: Lock,
      label: {
        EN: "Data Protection",
        FR: "Protection des Données",
        AR: "حماية البيانات"
      },
      description: {
        EN: "Your privacy matters",
        FR: "Votre confidentialité compte",
        AR: "خصوصيتك مهمة"
      }
    },
    {
      icon: CreditCard,
      label: {
        EN: "Multiple Payments",
        FR: "Paiements Multiples",
        AR: "طرق دفع متعددة"
      },
      description: {
        EN: "Cash, card, or online",
        FR: "Espèces, carte ou en ligne",
        AR: "نقد أو بطاقة أو عبر الإنترنت"
      }
    }
  ];

  const containerClasses = {
    horizontal: "flex flex-wrap justify-center gap-4 md:gap-6",
    vertical: "flex flex-col gap-3",
    compact: "flex flex-wrap justify-center gap-2"
  };

  const badgeClasses = {
    horizontal: "flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:shadow-sm transition-shadow",
    vertical: "flex items-center gap-3 p-3 bg-background border border-border rounded-lg hover:shadow-sm transition-shadow",
    compact: "flex flex-col items-center gap-1 p-2 bg-background border border-border rounded-lg hover:shadow-sm transition-shadow text-center"
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        const label = badge.label[language as keyof typeof badge.label];
        const description = badge.description[language as keyof typeof badge.description];

        return (
          <div
            key={index}
            className={badgeClasses[variant]}
            title={description}
          >
            <Icon className={`text-primary ${variant === "compact" ? "w-5 h-5" : "w-5 h-5"}`} />
            {showLabels && (
              <div className={variant === "compact" ? "text-center" : ""}>
                <p className={`font-medium text-foreground ${variant === "compact" ? "text-xs" : "text-sm"}`}>
                  {label}
                </p>
                {variant !== "compact" && (
                  <p className="text-xs text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;