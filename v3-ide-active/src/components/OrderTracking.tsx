import { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Copy,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrders, OrderDetails, OrderStatus } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPriceWithConversion } from "@/utils/formatPrice";
import { toast } from "sonner";

interface OrderTrackingProps {
  orderId?: string;
  showOrderDetails?: boolean;
}

const OrderTracking = ({ orderId, showOrderDetails = true }: OrderTrackingProps) => {
  const { currentOrder, getOrderStatus } = useOrders();
  const { language, isRTL } = useLanguage();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const targetOrder = orderId ? getOrderStatus(orderId) : currentOrder;
    setOrder(targetOrder);
  }, [orderId, currentOrder, getOrderStatus]);

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {language === "AR" ? "لم يتم العثور على الطلب" : language === "FR" ? "Commande introuvable" : "Order Not Found"}
        </h3>
        <p className="text-muted-foreground">
          {language === "AR" ? "تحقق من رقم الطلب أو اتصل بنا للمساعدة" : language === "FR" ? "Vérifiez le numéro de commande ou contactez-nous" : "Check your order number or contact us for help"}
        </p>
      </div>
    );
  }

  const statusSteps: { status: OrderStatus; label: { EN: string; FR: string; AR: string }; icon: any }[] = [
    {
      status: "pending",
      label: { EN: "Order Placed", FR: "Commande Passée", AR: "تم الطلب" },
      icon: Package
    },
    {
      status: "confirmed",
      label: { EN: "Confirmed", FR: "Confirmée", AR: "مؤكد" },
      icon: CheckCircle
    },
    {
      status: "processing",
      label: { EN: "Processing", FR: "En Cours", AR: "قيد المعالجة" },
      icon: Clock
    },
    {
      status: "shipped",
      label: { EN: "Shipped", FR: "Expédiée", AR: "تم الشحن" },
      icon: Truck
    },
    {
      status: "out-for-delivery",
      label: { EN: "Out for Delivery", FR: "En Livraison", AR: "في طريق التوصيل" },
      icon: MapPin
    },
    {
      status: "delivered",
      label: { EN: "Delivered", FR: "Livrée", AR: "تم التوصيل" },
      icon: CheckCircle
    }
  ];

  const getStatusIndex = (status: OrderStatus) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  const currentStatusIndex = getStatusIndex(order.status);

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      processing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      shipped: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "out-for-delivery": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[status] || colors.pending;
  };

  const copyTrackingNumber = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success(language === "AR" ? "تم نسخ رقم التتبع" : language === "FR" ? "Numéro de suivi copié" : "Tracking number copied");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {language === "AR" ? "تتبع الطلب" : language === "FR" ? "Suivi de Commande" : "Order Tracking"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "AR" ? "رقم الطلب:" : language === "FR" ? "N° de commande:" : "Order #:"} {order.id}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {statusSteps.find(step => step.status === order.status)?.label[language as keyof typeof statusSteps[0]["label"]] || order.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tracking Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={step.status} className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>

                  <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                    <h4 className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label[language as keyof typeof step.label]}
                    </h4>
                    {isCurrent && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "AR" ? "الحالة الحالية" : language === "FR" ? "Statut actuel" : "Current status"}
                      </p>
                    )}
                  </div>

                  {index < statusSteps.length - 1 && (
                    <div className={`w-px h-8 bg-border ${isRTL ? "mr-5" : "ml-5"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      {showOrderDetails && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "AR" ? "تفاصيل الطلب" : language === "FR" ? "Détails de la Commande" : "Order Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x • {formatPriceWithConversion(item.price, "DZD", language)}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatPriceWithConversion(item.price * item.quantity, "DZD", language)}
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{language === "AR" ? "المجموع الفرعي" : language === "FR" ? "Sous-total" : "Subtotal"}</span>
                  <span>{formatPriceWithConversion(order.subtotal, "DZD", language)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{language === "AR" ? "الشحن" : language === "FR" ? "Livraison" : "Shipping"}</span>
                  <span>{formatPriceWithConversion(order.shipping, "DZD", language)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{language === "AR" ? "المجموع" : language === "FR" ? "Total" : "Total"}</span>
                  <span>{formatPriceWithConversion(order.total, "DZD", language)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Tracking Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === "AR" ? "معلومات الشحن" : language === "FR" ? "Informations de Livraison" : "Shipping Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">
                  {language === "AR" ? "معلومات العميل" : language === "FR" ? "Informations Client" : "Customer Information"}
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{order.customerName}</p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </p>
                  {order.customerEmail && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      {order.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-2">
                  {language === "AR" ? "عنوان الشحن" : language === "FR" ? "Adresse de Livraison" : "Shipping Address"}
                </h4>
                <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
              </div>

              {order.trackingNumber && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      {language === "AR" ? "رقم التتبع" : language === "FR" ? "Numéro de Suivi" : "Tracking Number"}
                    </h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {order.trackingNumber}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyTrackingNumber}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {order.estimatedDelivery && (
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    {language === "AR" ? "تاريخ التوصيل المتوقع" : language === "FR" ? "Date de Livraison Estimée" : "Estimated Delivery"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.estimatedDelivery).toLocaleDateString(language === "AR" ? "ar-DZ" : language === "FR" ? "fr-FR" : "en-US")}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-2">
                  {language === "AR" ? "طريقة الدفع" : language === "FR" ? "Mode de Paiement" : "Payment Method"}
                </h4>
                <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Support */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">
            {language === "AR" ? "هل تحتاج مساعدة؟" : language === "FR" ? "Besoin d'aide ?" : "Need Help?"}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {language === "AR" ? "اتصل بنا إذا كان لديك أي أسئلة حول طلبك" : language === "FR" ? "Contactez-nous si vous avez des questions sur votre commande" : "Contact us if you have any questions about your order"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              {language === "AR" ? "اتصل بنا" : language === "FR" ? "Nous Contacter" : "Contact Us"}
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === "AR" ? "تتبع عبر الإنترنت" : language === "FR" ? "Suivi en Ligne" : "Track Online"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;