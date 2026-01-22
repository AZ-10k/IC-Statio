import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    EN: {
      title: "Privacy Policy",
      backToHome: "Back to Home",
      sections: [
        {
          title: "1. Information We Collect",
          content: "When you place an order via Instagram, we collect your name, delivery address (wilaya and commune), and order details. We do not store credit card information as all payments are made on delivery.",
        },
        {
          title: "2. How We Use Your Information",
          content: "We use your information solely to process and deliver your orders. Your delivery information is shared with ZR Express for shipping purposes only.",
        },
        {
          title: "3. Order Confirmation",
          content: "Orders are confirmed via Instagram Message. We will contact you through Instagram DM to confirm your order details and provide tracking information.",
        },
        {
          title: "4. Data Security",
          content: "We take appropriate measures to protect your personal information. Order details shared via Instagram are handled according to Instagram's privacy policies.",
        },
        {
          title: "5. Your Rights",
          content: "You have the right to request access to, correction, or deletion of your personal data. Contact us via Instagram to exercise these rights.",
        },
        {
          title: "6. Contact Us",
          content: "For privacy-related inquiries, please contact us via Instagram DM. We will respond to your request within a reasonable timeframe.",
        },
      ],
    },
    FR: {
      title: "Politique de Confidentialité",
      backToHome: "Retour à l'accueil",
      sections: [
        {
          title: "1. Informations Collectées",
          content: "Lorsque vous passez une commande via Instagram, nous collectons votre nom, adresse de livraison (wilaya et commune), et les détails de la commande. Nous ne stockons pas les informations de carte de crédit car tous les paiements sont effectués à la livraison.",
        },
        {
          title: "2. Utilisation de Vos Informations",
          content: "Nous utilisons vos informations uniquement pour traiter et livrer vos commandes. Vos informations de livraison sont partagées avec ZR Express uniquement à des fins d'expédition.",
        },
        {
          title: "3. Confirmation de Commande",
          content: "Les commandes sont confirmées via Message Instagram. Nous vous contacterons via Instagram DM pour confirmer les détails de votre commande et fournir les informations de suivi.",
        },
        {
          title: "4. Sécurité des Données",
          content: "Nous prenons les mesures appropriées pour protéger vos informations personnelles. Les détails de commande partagés via Instagram sont gérés selon les politiques de confidentialité d'Instagram.",
        },
        {
          title: "5. Vos Droits",
          content: "Vous avez le droit de demander l'accès, la correction ou la suppression de vos données personnelles. Contactez-nous via Instagram pour exercer ces droits.",
        },
        {
          title: "6. Nous Contacter",
          content: "Pour les demandes liées à la confidentialité, veuillez nous contacter via Instagram DM. Nous répondrons à votre demande dans un délai raisonnable.",
        },
      ],
    },
    AR: {
      title: "سياسة الخصوصية",
      backToHome: "العودة للرئيسية",
      sections: [
        {
          title: "1. المعلومات التي نجمعها",
          content: "عند تقديم طلب عبر انستغرام، نجمع اسمك وعنوان التوصيل (الولاية والبلدية) وتفاصيل الطلب. لا نخزن معلومات بطاقة الائتمان لأن جميع المدفوعات تتم عند الاستلام.",
        },
        {
          title: "2. كيف نستخدم معلوماتك",
          content: "نستخدم معلوماتك فقط لمعالجة وتوصيل طلباتك. يتم مشاركة معلومات التوصيل مع ZR Express لأغراض الشحن فقط.",
        },
        {
          title: "3. تأكيد الطلب",
          content: "يتم تأكيد الطلبات عبر رسالة انستغرام. سنتواصل معك عبر رسائل انستغرام لتأكيد تفاصيل طلبك وتوفير معلومات التتبع.",
        },
        {
          title: "4. أمان البيانات",
          content: "نتخذ التدابير المناسبة لحماية معلوماتك الشخصية. يتم التعامل مع تفاصيل الطلب المشاركة عبر انستغرام وفقاً لسياسات خصوصية انستغرام.",
        },
        {
          title: "5. حقوقك",
          content: "لديك الحق في طلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها. تواصل معنا عبر انستغرام لممارسة هذه الحقوق.",
        },
        {
          title: "6. تواصل معنا",
          content: "للاستفسارات المتعلقة بالخصوصية، يرجى التواصل معنا عبر رسائل انستغرام. سنرد على طلبك في إطار زمني معقول.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {t.backToHome}
          </Link>

          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-8">{t.title}</h1>

            <div className="space-y-8">
              {t.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h2 className="font-serif text-xl font-semibold text-primary">{section.title}</h2>
                  <p className="text-foreground leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Privacy;