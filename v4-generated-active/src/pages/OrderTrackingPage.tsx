import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderTracking from "@/components/OrderTracking";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const { language } = useLanguage();

  const seoLabels = {
    EN: {
      title: "Order Tracking - Instant Créatif Statio",
      description: "Track your order status and delivery updates for your stationery purchases.",
    },
    FR: {
      title: "Suivi de Commande - Instant Créatif Statio",
      description: "Suivez l'état de votre commande et les mises à jour de livraison pour vos achats de papeterie.",
    },
    AR: {
      title: "تتبع الطلب - إنستانت كرياتيف ستاتيو",
      description: "تابع حالة طلبك وتحديثات التوصيل لمشترياتك من القرطاسية.",
    }
  };

  const labels = seoLabels[language as keyof typeof seoLabels];

  return (
    <div className={`min-h-screen bg-background ${language === "AR" ? "rtl" : "ltr"}`} dir={language === "AR" ? "rtl" : "ltr"}>
      <SEO
        title={labels.title}
        description={labels.description}
        canonical={`/order-tracking${orderId ? `/${orderId}` : ""}`}
      />

      <Navbar />
      <main className="py-12">
        <OrderTracking orderId={orderId} />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default OrderTrackingPage;