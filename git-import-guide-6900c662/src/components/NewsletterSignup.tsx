import { useState, useEffect } from "react";
import { Mail, Gift, Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface NewsletterSignupProps {
  variant?: "modal" | "inline" | "footer" | "checkout";
  showIncentives?: boolean;
  className?: string;
}

const NewsletterSignup = ({
  variant = "inline",
  showIncentives = true,
  className = ""
}: NewsletterSignupProps) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIncentive, setSelectedIncentive] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const incentives = [
    {
      id: "discount",
      icon: Gift,
      title: {
        EN: "15% Off First Order",
        FR: "15% de Réduction",
        AR: "خصم 15% على الطلب الأول"
      },
      description: {
        EN: "Exclusive discount for subscribers",
        FR: "Remise exclusive pour les abonnés",
        AR: "خصم حصري للمشتركين"
      },
      value: "15%OFF"
    },
    {
      id: "early-access",
      icon: Sparkles,
      title: {
        EN: "Early Access",
        FR: "Accès Anticipé",
        AR: "الوصول المبكر"
      },
      description: {
        EN: "Be first to know about new collections",
        FR: "Soyez le premier à connaître les nouvelles collections",
        AR: "كن أول من يعرف عن المجموعات الجديدة"
      },
      value: "EARLYACCESS"
    },
    {
      id: "free-shipping",
      icon: Mail,
      title: {
        EN: "Free Shipping Alert",
        FR: "Alerte Livraison Gratuite",
        AR: "تنبيه الشحن المجاني"
      },
      description: {
        EN: "Get notified when you qualify for free shipping",
        FR: "Soyez notifié lorsque vous êtes éligible à la livraison gratuite",
        AR: "احصل على إشعار عند استيفاء شروط الشحن المجاني"
      },
      value: "FREESHIP"
    }
  ];

  const labels = {
    EN: {
      title: "Stay in the Loop",
      subtitle: "Get exclusive offers and be the first to know about new arrivals",
      emailPlaceholder: "Enter your email address",
      subscribe: "Subscribe Now",
      subscribed: "You're Subscribed!",
      selectIncentive: "Choose your welcome gift:",
      successMessage: "Welcome! Check your email for your special offer.",
      alreadySubscribed: "You're already subscribed to our newsletter.",
      invalidEmail: "Please enter a valid email address.",
      close: "Close"
    },
    FR: {
      title: "Restez Informé",
      subtitle: "Recevez des offres exclusives et soyez le premier à connaître les nouveaux arrivages",
      emailPlaceholder: "Entrez votre adresse email",
      subscribe: "S'abonner Maintenant",
      subscribed: "Vous êtes Abonné !",
      selectIncentive: "Choisissez votre cadeau de bienvenue :",
      successMessage: "Bienvenue ! Vérifiez votre email pour votre offre spéciale.",
      alreadySubscribed: "Vous êtes déjà abonné à notre newsletter.",
      invalidEmail: "Veuillez entrer une adresse email valide.",
      close: "Fermer"
    },
    AR: {
      title: "ابق على اطلاع",
      subtitle: "احصل على عروض حصرية وكن أول من يعرف عن المنتجات الجديدة",
      emailPlaceholder: "أدخل عنوان بريدك الإلكتروني",
      subscribe: "اشترك الآن",
      subscribed: "أنت مشترك!",
      selectIncentive: "اختر هديتك الترحيبية:",
      successMessage: "مرحباً! تحقق من بريدك الإلكتروني لعرضك الخاص.",
      alreadySubscribed: "أنت مشترك بالفعل في نشرتنا الإخبارية.",
      invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
      close: "إغلاق"
    }
  };

  const l = labels[language as keyof typeof labels];

  // Check if user is already subscribed
  useEffect(() => {
    const subscribed = localStorage.getItem("statio-newsletter-subscribed");
    if (subscribed === "true") {
      setIsSubscribed(true);
      const savedEmail = localStorage.getItem("statio-newsletter-email");
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error(l.invalidEmail);
      return;
    }

    if (isSubscribed) {
      toast.info(l.alreadySubscribed);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to localStorage
    localStorage.setItem("statio-newsletter-subscribed", "true");
    localStorage.setItem("statio-newsletter-email", email);
    localStorage.setItem("statio-newsletter-incentive", selectedIncentive || "discount");
    localStorage.setItem("statio-newsletter-date", new Date().toISOString());

    setIsSubscribed(true);
    setIsLoading(false);
    setIsOpen(false);

    toast.success(l.successMessage);
  };

  const NewsletterForm = () => (
    <form onSubmit={handleSubscribe} className="space-y-4">
      {showIncentives && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">{l.selectIncentive}</p>
          <div className="grid gap-2">
            {incentives.map((incentive) => {
              const Icon = incentive.icon;
              return (
                <button
                  key={incentive.id}
                  type="button"
                  onClick={() => setSelectedIncentive(incentive.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedIncentive === incentive.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    selectedIncentive === incentive.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{incentive.title[language as keyof typeof incentive.title]}</p>
                    <p className="text-xs text-muted-foreground">{incentive.description[language as keyof typeof incentive.description]}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {incentive.value}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="email"
            placeholder={l.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={isSubscribed}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSubscribed || !email.trim()}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </div>
          ) : isSubscribed ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {l.subscribed}
            </div>
          ) : (
            l.subscribe
          )}
        </Button>
      </div>
    </form>
  );

  if (variant === "modal") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={className}>
            <Mail className="w-4 h-4 mr-2" />
            {language === "AR" ? "اشترك في النشرة" : language === "FR" ? "S'abonner" : "Subscribe"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              {l.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{l.subtitle}</p>
            <NewsletterForm />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`bg-muted/30 rounded-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{l.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{l.subtitle}</p>
        <NewsletterForm />
      </div>
    );
  }

  if (variant === "checkout") {
    return (
      <div className={`border border-border rounded-lg p-4 bg-muted/20 ${className}`}>
        <div className="flex items-start gap-3">
          <Gift className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">
              {language === "AR" ? "احصل على عرض خاص" : language === "FR" ? "Obtenez une offre spéciale" : "Get a Special Offer"}
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              {language === "AR" ? "اشترك للحصول على خصم 15%" : language === "FR" ? "Abonnez-vous pour 15% de réduction" : "Subscribe for 15% off your next order"}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={l.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-8 text-xs"
                disabled={isSubscribed}
              />
              <Button type="submit" size="sm" disabled={isLoading || isSubscribed || !email.trim()}>
                {isLoading ? "..." : isSubscribed ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{l.title}</h3>
        <p className="text-muted-foreground mb-6">{l.subtitle}</p>
        <NewsletterForm />
      </div>
    </div>
  );
};

export default NewsletterSignup;