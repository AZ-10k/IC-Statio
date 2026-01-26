import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { language, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();

  const content = {
    EN: {
      title: "Terms of Service",
      backToHome: "Back to Home",
      sections: [
        {
          title: "1. General Information",
          content: "Welcome to Instant Créatif Statio. By using our website and services, you agree to these Terms of Service. We reserve the right to update these terms at any time.",
        },
        {
          title: "2. Ordering Process",
          content: "Orders are confirmed via Instagram Message. Once you add items to your cart and proceed to checkout, you will be prompted to send your order details via Instagram DM. Your order is only confirmed once we respond with a confirmation message.",
        },
        {
          title: "3. Payment",
          content: "We accept Payment on Delivery (Cash on Delivery). Payment is due upon receipt of your order. We also accept BaridiMob and CCP transfers.",
        },
        {
          title: "4. Shipping & Delivery",
          content: "We ship via ZR Express to all 58 wilayas across Algeria. Delivery times vary depending on your location. Home delivery and Stop Desk options are available.",
        },
        {
          title: "5. Returns & Refunds",
          content: "Returns are accepted within 48 hours of delivery. Products must be in their original condition. Contact us via Instagram to initiate a return.",
        },
        {
          title: "6. Contact",
          content: "For any questions or concerns, please contact us via Instagram DM or through our contact form on the website.",
        },
      ],
    },
    FR: {
      title: "Conditions d'Utilisation",
      backToHome: "Retour à l'accueil",
      sections: [
        {
          title: "1. Informations Générales",
          content: "Bienvenue chez Instant Créatif Statio. En utilisant notre site et nos services, vous acceptez ces Conditions d'Utilisation. Nous nous réservons le droit de mettre à jour ces conditions à tout moment.",
        },
        {
          title: "2. Processus de Commande",
          content: "Les commandes sont confirmées via Message Instagram. Une fois que vous avez ajouté des articles à votre panier et procédé au paiement, vous serez invité à envoyer les détails de votre commande via Instagram DM. Votre commande n'est confirmée qu'une fois que nous répondons avec un message de confirmation.",
        },
        {
          title: "3. Paiement",
          content: "Nous acceptons le Paiement à la Livraison. Le paiement est dû à la réception de votre commande. Nous acceptons également les virements BaridiMob et CCP.",
        },
        {
          title: "4. Expédition & Livraison",
          content: "Nous expédions via ZR Express vers les 58 wilayas à travers l'Algérie. Les délais de livraison varient selon votre emplacement. Les options de livraison à domicile et Stop Desk sont disponibles.",
        },
        {
          title: "5. Retours & Remboursements",
          content: "Les retours sont acceptés dans les 48 heures suivant la livraison. Les produits doivent être dans leur état d'origine. Contactez-nous via Instagram pour initier un retour.",
        },
        {
          title: "6. Contact",
          content: "Pour toute question ou préoccupation, veuillez nous contacter via Instagram DM ou via notre formulaire de contact sur le site.",
        },
      ],
    },
    AR: {
      title: "شروط الخدمة",
      backToHome: "العودة للرئيسية",
      sections: [
        {
          title: "1. معلومات عامة",
          content: "مرحباً بكم في Instant Créatif Statio. باستخدام موقعنا وخدماتنا، فإنك توافق على شروط الخدمة هذه. نحتفظ بالحق في تحديث هذه الشروط في أي وقت.",
        },
        {
          title: "2. عملية الطلب",
          content: "يتم تأكيد الطلبات عبر رسالة انستغرام. بمجرد إضافة المنتجات إلى سلتك والمتابعة للدفع، سيُطلب منك إرسال تفاصيل طلبك عبر رسائل انستغرام. يتم تأكيد طلبك فقط عندما نرد برسالة تأكيد.",
        },
        {
          title: "3. الدفع",
          content: "نقبل الدفع عند الاستلام. يستحق الدفع عند استلام طلبك. كما نقبل تحويلات بريدي موب و CCP.",
        },
        {
          title: "4. الشحن والتوصيل",
          content: "نشحن عبر ZR Express إلى جميع الولايات الـ58 في الجزائر. تختلف أوقات التسليم حسب موقعك. تتوفر خيارات التوصيل للمنزل و Stop Desk.",
        },
        {
          title: "5. الإرجاع والاسترداد",
          content: "يتم قبول الإرجاع خلال 48 ساعة من التسليم. يجب أن تكون المنتجات في حالتها الأصلية. تواصل معنا عبر انستغرام لبدء عملية الإرجاع.",
        },
        {
          title: "6. التواصل",
          content: "لأي أسئلة أو استفسارات، يرجى التواصل معنا عبر رسائل انستغرام أو من خلال نموذج الاتصال على الموقع.",
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="w-full px-4 py-8 lg:py-12">
          <Link to={`/?lang=${(searchParams.get("lang") || language).toLowerCase()}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
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

export default Terms;