import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck, Package, RotateCcw, Search, MessageCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQ = () => {
  const { language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const faqData: Record<string, FAQCategory[]> = {
    EN: [
      {
        title: "Delivery & Payment",
        icon: <Truck className="h-5 w-5" />,
        items: [
          {
            question: "How long does delivery take?",
            answer: "Delivery takes 2 to 6 days depending on your Wilaya, handled by ZR Express.",
          },
          {
            question: "Can I open the package before paying?",
            answer: "Yes, we allow you to open and verify your order before paying the delivery agent.",
          },
          {
            question: "What payment methods do you accept?",
            answer: "We accept Cash on Delivery (Payment upon delivery) only.",
          },
        ],
      },
      {
        title: "Products & Customization",
        icon: <Package className="h-5 w-5" />,
        items: [
          {
            question: "Are the planners dated for 2026?",
            answer: "Yes, all our agendas are updated for the 2026 calendar year.",
          },
          {
            question: "Do you offer custom designs?",
            answer: "Yes! For personalized notebooks or bulk corporate orders, please contact us directly on Instagram.",
          },
        ],
      },
      {
        title: "Returns",
        icon: <RotateCcw className="h-5 w-5" />,
        items: [
          {
            question: "Can I return a product?",
            answer: "Returns are only accepted at the moment of delivery. Once the delivery agent leaves, we cannot accept returns.",
          },
        ],
      },
    ],
    FR: [
      {
        title: "Livraison & Paiement",
        icon: <Truck className="h-5 w-5" />,
        items: [
          {
            question: "Combien de temps prend la livraison ?",
            answer: "La livraison prend de 2 à 6 jours selon votre Wilaya, assurée par ZR Express.",
          },
          {
            question: "Puis-je ouvrir le colis avant de payer ?",
            answer: "Oui, vous pouvez ouvrir et vérifier votre commande avant de payer le livreur.",
          },
          {
            question: "Quels modes de paiement acceptez-vous ?",
            answer: "Nous acceptons uniquement le paiement à la livraison (Cash on Delivery).",
          },
        ],
      },
      {
        title: "Produits & Personnalisation",
        icon: <Package className="h-5 w-5" />,
        items: [
          {
            question: "Les agendas sont-ils datés pour 2026 ?",
            answer: "Oui, tous nos agendas sont mis à jour pour l'année civile 2026.",
          },
          {
            question: "Proposez-vous des designs personnalisés ?",
            answer: "Oui ! Pour des carnets personnalisés ou des commandes en gros pour entreprises, contactez-nous directement sur Instagram.",
          },
        ],
      },
      {
        title: "Retours",
        icon: <RotateCcw className="h-5 w-5" />,
        items: [
          {
            question: "Puis-je retourner un produit ?",
            answer: "Les retours sont uniquement acceptés au moment de la livraison. Une fois que le livreur est parti, nous ne pouvons plus accepter de retours.",
          },
        ],
      },
    ],
    AR: [
      {
        title: "التوصيل والدفع",
        icon: <Truck className="h-5 w-5" />,
        items: [
          {
            question: "كم يستغرق التوصيل؟",
            answer: "يستغرق التوصيل من 2 إلى 6 أيام حسب ولايتك، عبر شركة ZR Express.",
          },
          {
            question: "هل يمكنني فتح الطرد قبل الدفع؟",
            answer: "نعم، يمكنك فتح طلبك والتحقق منه قبل الدفع لعامل التوصيل.",
          },
          {
            question: "ما هي طرق الدفع المقبولة؟",
            answer: "نقبل الدفع عند الاستلام فقط.",
          },
        ],
      },
      {
        title: "المنتجات والتخصيص",
        icon: <Package className="h-5 w-5" />,
        items: [
          {
            question: "هل المفكرات مؤرخة لعام 2026؟",
            answer: "نعم، جميع مفكراتنا محدثة للسنة التقويمية 2026.",
          },
          {
            question: "هل تقدمون تصاميم مخصصة؟",
            answer: "نعم! للدفاتر المخصصة أو الطلبات الجماعية للشركات، تواصلوا معنا مباشرة على انستغرام.",
          },
        ],
      },
      {
        title: "الإرجاع",
        icon: <RotateCcw className="h-5 w-5" />,
        items: [
          {
            question: "هل يمكنني إرجاع منتج؟",
            answer: "يتم قبول الإرجاع فقط عند لحظة التوصيل. بمجرد مغادرة عامل التوصيل، لا يمكننا قبول الإرجاع.",
          },
        ],
      },
    ],
  };

  const pageTitle = {
    EN: "Frequently Asked Questions",
    FR: "Questions Fréquentes",
    AR: "الأسئلة الشائعة",
  };

  const pageSubtitle = {
    EN: "Find answers to common questions about our products, delivery, and policies.",
    FR: "Trouvez les réponses aux questions courantes sur nos produits, la livraison et nos politiques.",
    AR: "اعثر على إجابات للأسئلة الشائعة حول منتجاتنا والتوصيل وسياساتنا.",
  };

  const searchPlaceholder = {
    EN: "Search questions...",
    FR: "Rechercher des questions...",
    AR: "ابحث عن الأسئلة...",
  };

  const noResultsText = {
    EN: "No questions found matching your search.",
    FR: "Aucune question trouvée correspondant à votre recherche.",
    AR: "لم يتم العثور على أسئلة مطابقة لبحثك.",
  };

  const stillHaveQuestions = {
    EN: "Still have questions?",
    FR: "Vous avez d'autres questions ?",
    AR: "هل لديك أسئلة أخرى؟",
  };

  const contactUsText = {
    EN: "Contact Us",
    FR: "Contactez-nous",
    AR: "تواصل معنا",
  };

  const contactDescription = {
    EN: "We're here to help! Reach out and we'll get back to you as soon as possible.",
    FR: "Nous sommes là pour vous aider ! Contactez-nous et nous vous répondrons dans les plus brefs délais.",
    AR: "نحن هنا للمساعدة! تواصل معنا وسنرد عليك في أقرب وقت ممكن.",
  };

  const categories = faqData[language] || faqData.EN;

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, searchQuery]);

  const hasResults = filteredCategories.some((cat) => cat.items.length > 0);

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-grow py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              {pageTitle[language]}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {pageSubtitle[language]}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder[language]}
                className="ltr:pl-12 ltr:pr-4 rtl:pr-12 rtl:pl-4 py-3 h-12 text-base"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-3xl mx-auto space-y-8">
            {hasResults ? (
              filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-card rounded-xl border p-6 shadow-sm">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  {/* Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left rtl:text-right hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{noResultsText[language]}</p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
              <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {stillHaveQuestions[language]}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {contactDescription[language]}
              </p>
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {contactUsText[language]}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
