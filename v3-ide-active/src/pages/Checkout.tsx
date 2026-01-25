import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Check, ChevronDown, Home, Building2, Trash2, Plus, Minus, ShoppingBag, Instagram, User, Phone, CheckCircle2, Package, Truck, Mail, MapPin, MessageSquare, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import CheckoutProgress from "@/components/CheckoutProgress";
import ExchangeRateIndicator from "@/components/ExchangeRateIndicator";
import PriceDisplay from "@/components/PriceDisplay";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useOrders } from "@/contexts/OrderContext";
import { shippingRates, wilayaNames, DeliveryMode } from "@/data/shippingRates";
import { communesWithArabic, Commune } from "@/data/communesWithArabic";
import { cn } from "@/lib/utils";
import { formatPriceWithConversion } from "@/utils/formatPrice";
import { toast } from "sonner";
import { INSTAGRAM_DM_URL } from "@/constants/socialLinks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, CheckoutFormData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Checkout = () => {
  const { language, t, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const { items, removeFromCart, updateQuantity, totalItems, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { currency, rates } = useCurrency();

  // Checkout step state - start at step 1 (Cart View)
  const [currentStep, setCurrentStep] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    items: typeof items;
    customerName: string;
    customerPhone: string;
    customerSecondaryPhone: string;
    customerEmail: string;
    wilayaName: string;
    communeName: string;
    address: string;
    landmark: string;
    orderNotes: string;
    deliveryModeLabel: string;
    subtotal: number;
    shipping: number;
    total: number;
  } | null>(null);

  // Keep state variables for UI logic (comboboxes, etc.)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");

  // Form state with react-hook-form
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema(language)),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      secondaryPhone: "",
      email: "",
      wilaya: "",
      commune: "",
      address: "",
      landmark: "",
      orderNotes: "",
      deliveryMode: "desk",
    },
    mode: "onBlur",
  });

  // Watch form values for conditional logic
  const watchedDeliveryMode = form.watch("deliveryMode");
  const watchedWilaya = form.watch("wilaya") || selectedWilaya;

  // Update form resolver when language changes
  useEffect(() => {
    form.clearErrors();
    // Re-validate with new schema
    form.trigger();
  }, [language, form]);

  // Wilaya combobox state
  const [isWilayaOpen, setIsWilayaOpen] = useState(false);
  const [wilayaSearch, setWilayaSearch] = useState("");
  const [wilayaHighlight, setWilayaHighlight] = useState(0);
  const wilayaInputRef = useRef<HTMLInputElement>(null);
  const wilayaListRef = useRef<HTMLDivElement>(null);

  // Commune combobox state
  const [isCommuneOpen, setIsCommuneOpen] = useState(false);
  const [communeSearch, setCommuneSearch] = useState("");
  const [communeHighlight, setCommuneHighlight] = useState(0);
  const communeInputRef = useRef<HTMLInputElement>(null);
  const communeListRef = useRef<HTMLDivElement>(null);

  const getWilayaName = (code: number, lang: Language) => {
    const names = wilayaNames[code];
    if (!names) return `Wilaya ${code}`;
    switch (lang) {
      case "AR": return names.ar;
      case "FR": return names.fr;
      default: return names.en;
    }
  };

  const sortedWilayas = Object.keys(shippingRates).map(Number).sort((a, b) => a - b);

  const filteredWilayas = sortedWilayas.filter((code) => {
    const name = getWilayaName(code, language).toLowerCase();
    const codeStr = code.toString().padStart(2, "0");
    const query = wilayaSearch.toLowerCase();
    return name.includes(query) || codeStr.includes(query);
  });

  const availableCommunes: Commune[] = (() => {
    const wilayaValue = watchedWilaya || selectedWilaya;
    if (!wilayaValue || wilayaValue === "") return [];
    const code = parseInt(wilayaValue, 10);
    if (isNaN(code)) return [];
    return communesWithArabic[code] || [];
  })();
  
  const getCommuneName = (commune: Commune, lang: Language): string => {
    return lang === "AR" ? commune.ar_name : commune.name;
  };
  
  const filteredCommunes = availableCommunes.filter((c) => {
    const name = getCommuneName(c, language).toLowerCase();
    const frName = c.name.toLowerCase();
    const query = communeSearch.toLowerCase();
    return name.includes(query) || frName.includes(query);
  });

  const getShippingCost = () => {
    const wilayaValue = watchedWilaya || selectedWilaya;
    if (!wilayaValue || wilayaValue === "") return 0;
    const wilayaCode = parseInt(wilayaValue, 10);
    if (isNaN(wilayaCode)) return 0;
    const rate = shippingRates[wilayaCode];
    const modeValue = watchedDeliveryMode || form.getValues("deliveryMode") || "desk";
    return rate ? rate[modeValue as DeliveryMode] : 0;
  };

  const shippingCost = getShippingCost();
  const grandTotal = subtotal + shippingCost;

  // Reset commune when wilaya changes
  useEffect(() => {
    const currentWilaya = watchedWilaya || selectedWilaya;
    if (currentWilaya) {
      setSelectedCommune("");
      form.setValue("commune", "");
      setCommuneSearch("");
    }
  }, [watchedWilaya, selectedWilaya, form]);

  const handleWilayaSelect = (code: string) => {
    setSelectedWilaya(code);
    form.setValue("wilaya", code);
    setWilayaSearch("");
    setIsWilayaOpen(false);
    setWilayaHighlight(0);
    // Clear commune when wilaya changes
    setSelectedCommune("");
    form.setValue("commune", "");
  };

  const handleCommuneSelect = (commune: string) => {
    setSelectedCommune(commune);
    form.setValue("commune", commune);
    setCommuneSearch("");
    setIsCommuneOpen(false);
    setCommuneHighlight(0);
  };

  const handleWilayaKeyDown = (e: React.KeyboardEvent) => {
    if (!isWilayaOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsWilayaOpen(true);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setWilayaHighlight((prev) => prev < filteredWilayas.length - 1 ? prev + 1 : prev);
        break;
      case "ArrowUp":
        e.preventDefault();
        setWilayaHighlight((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredWilayas[wilayaHighlight]) {
          handleWilayaSelect(filteredWilayas[wilayaHighlight].toString());
        }
        break;
      case "Escape":
        setIsWilayaOpen(false);
        break;
    }
  };

  const handleCommuneKeyDown = (e: React.KeyboardEvent) => {
    if (!isCommuneOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsCommuneOpen(true);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setCommuneHighlight((prev) => prev < filteredCommunes.length - 1 ? prev + 1 : prev);
        break;
      case "ArrowUp":
        e.preventDefault();
        setCommuneHighlight((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCommunes[communeHighlight]) {
          handleCommuneSelect(filteredCommunes[communeHighlight].name);
        }
        break;
      case "Escape":
        setIsCommuneOpen(false);
        break;
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wilayaInputRef.current && !wilayaInputRef.current.closest(".wilaya-combo")?.contains(e.target as Node)) {
        setIsWilayaOpen(false);
      }
      if (communeInputRef.current && !communeInputRef.current.closest(".commune-combo")?.contains(e.target as Node)) {
        setIsCommuneOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPriceDisplay = (price: number) => formatPriceWithConversion(price, currency, language, rates);

  // Validation functions
  const validateAlgerianPhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/[\s-]/g, "");
    const regex = /^0[567]\d{8}$/;
    return regex.test(cleaned);
  };

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) return true; // Optional field
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailValue);
  };

  const labels = {
    EN: {
      checkout: "Checkout",
      yourCart: "Your Cart",
      personalInfo: "Personal Information",
      shippingInfo: "Shipping Information",
      orderSummary: "Order Summary",
      empty: "Your cart is empty",
      startShopping: "Start Shopping",
      firstName: "First Name",
      firstNamePlaceholder: "Enter your first name",
      lastName: "Last Name",
      lastNamePlaceholder: "Enter your last name",
      phone: "Phone Number",
      phonePlaceholder: "05XXXXXXXX",
      secondaryPhone: "Secondary Phone (optional)",
      secondaryPhonePlaceholder: "05XXXXXXXX",
      email: "Email (optional)",
      emailPlaceholder: "your@email.com",
      address: "Address",
      addressPlaceholder: "Enter your full address",
      landmark: "Landmark/Reference (optional)",
      landmarkPlaceholder: "Near mosque, next to pharmacy...",
      orderNotes: "Order Notes (optional)",
      orderNotesPlaceholder: "Special instructions for delivery...",
      wilaya: "Wilaya",
      commune: "Commune",
      selectWilaya: "Search or select wilaya...",
      selectCommune: "Search or select commune...",
      deliveryMode: "Delivery Mode",
      home: "Home Delivery",
      desk: "Stop Desk",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingCost: "Shipping Cost",
      total: "Total",
      contactUs: "Contact us for quote",
      noResults: "No results found",
      selectWilayaFirst: "Select a wilaya first",
      backToShop: "Continue Shopping",
      orderConfirmation: "Order Confirmed!",
      thankYou: "Thank you for your order!",
      orderSent: "Your order has been saved.",
      deliveryTime: "Estimated delivery: 2-6 days",
      trackingNote: "You'll receive tracking updates via WhatsApp/SMS.",
      customerInfo: "Customer Information",
      deliveryInfo: "Delivery Information",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      emailLabel: "Email",
      secondaryPhoneLabel: "Secondary Phone",
      wilayaLabel: "Wilaya",
      communeLabel: "Commune",
      deliveryModeLabel: "Delivery Mode",
      addressLabel: "Address",
      landmarkLabel: "Landmark",
      continueShopping: "Continue Shopping",
      next: "Next",
      back: "Back",
      proceedToCheckout: "Proceed to Checkout",
      confirmOrder: "Confirm Order",
      sendOnInstagram: "Send on Instagram",
      step1Title: "Review your cart items",
      step2Title: "Enter your details and shipping information",
      step3Title: "Review and confirm your order",
      details: "Details",
      orderCopiedOpening: "Order copied! Opening Instagram...",
    },
    FR: {
      checkout: "Paiement",
      yourCart: "Votre Panier",
      personalInfo: "Informations Personnelles",
      shippingInfo: "Informations de Livraison",
      orderSummary: "Récapitulatif",
      empty: "Votre panier est vide",
      startShopping: "Commencer les achats",
      firstName: "Prénom",
      firstNamePlaceholder: "Entrez votre prénom",
      lastName: "Nom de famille",
      lastNamePlaceholder: "Entrez votre nom",
      phone: "Numéro de Téléphone",
      phonePlaceholder: "05XXXXXXXX",
      secondaryPhone: "Téléphone secondaire (optionnel)",
      secondaryPhonePlaceholder: "05XXXXXXXX",
      email: "Email (optionnel)",
      emailPlaceholder: "votre@email.com",
      address: "Adresse",
      addressPlaceholder: "Entrez votre adresse complète",
      landmark: "Point de repère (optionnel)",
      landmarkPlaceholder: "Près de la mosquée, à côté de la pharmacie...",
      orderNotes: "Notes de commande (optionnel)",
      orderNotesPlaceholder: "Instructions spéciales pour la livraison...",
      wilaya: "Wilaya",
      commune: "Commune",
      selectWilaya: "Rechercher ou sélectionner...",
      selectCommune: "Rechercher ou sélectionner...",
      deliveryMode: "Mode de livraison",
      home: "Livraison à domicile",
      desk: "Stop Desk",
      subtotal: "Sous-total",
      shipping: "Livraison",
      shippingCost: "Frais de livraison",
      total: "Total",
      contactUs: "Contactez-nous",
      noResults: "Aucun résultat",
      selectWilayaFirst: "Sélectionnez d'abord une wilaya",
      backToShop: "Continuer les achats",
      orderConfirmation: "Commande Confirmée !",
      thankYou: "Merci pour votre commande !",
      orderSent: "Votre commande a été enregistrée.",
      deliveryTime: "Livraison estimée : 2-6 jours",
      trackingNote: "Vous recevrez les mises à jour de suivi par WhatsApp/SMS.",
      customerInfo: "Informations Client",
      deliveryInfo: "Informations de Livraison",
      fullName: "Nom Complet",
      phoneNumber: "Numéro de Téléphone",
      emailLabel: "Email",
      secondaryPhoneLabel: "Téléphone Secondaire",
      wilayaLabel: "Wilaya",
      communeLabel: "Commune",
      deliveryModeLabel: "Mode de Livraison",
      addressLabel: "Adresse",
      landmarkLabel: "Point de Repère",
      continueShopping: "Continuer les achats",
      next: "Suivant",
      back: "Retour",
      proceedToCheckout: "Passer la commande",
      confirmOrder: "Confirmer la commande",
      sendOnInstagram: "Envoyer sur Instagram",
      step1Title: "Vérifiez les articles de votre panier",
      step2Title: "Entrez vos détails et informations de livraison",
      step3Title: "Vérifiez et confirmez votre commande",
      details: "Détails",
      orderCopiedOpening: "Commande copiée ! Ouverture d'Instagram...",
    },
    AR: {
      checkout: "الدفع",
      yourCart: "سلتك",
      personalInfo: "المعلومات الشخصية",
      shippingInfo: "معلومات الشحن",
      orderSummary: "ملخص الطلب",
      empty: "سلتك فارغة",
      startShopping: "ابدأ التسوق",
      firstName: "الاسم الأول",
      firstNamePlaceholder: "أدخل اسمك الأول",
      lastName: "اسم العائلة",
      lastNamePlaceholder: "أدخل اسم العائلة",
      phone: "رقم الهاتف",
      phonePlaceholder: "05XXXXXXXX",
      secondaryPhone: "رقم هاتف ثانوي (اختياري)",
      secondaryPhonePlaceholder: "05XXXXXXXX",
      email: "البريد الإلكتروني (اختياري)",
      emailPlaceholder: "your@email.com",
      address: "العنوان",
      addressPlaceholder: "أدخل عنوانك الكامل",
      landmark: "معلم قريب (اختياري)",
      landmarkPlaceholder: "بالقرب من المسجد، بجانب الصيدلية...",
      orderNotes: "ملاحظات الطلب (اختياري)",
      orderNotesPlaceholder: "تعليمات خاصة للتوصيل...",
      wilaya: "الولاية",
      commune: "البلدية",
      selectWilaya: "ابحث أو اختر...",
      selectCommune: "ابحث أو اختر...",
      deliveryMode: "طريقة التوصيل",
      home: "توصيل للمنزل",
      desk: "Stop Desk",
      subtotal: "المجموع الفرعي",
      shipping: "الشحن",
      shippingCost: "تكلفة الشحن",
      total: "المجموع",
      contactUs: "اتصل بنا",
      noResults: "لا توجد نتائج",
      selectWilayaFirst: "اختر الولاية أولاً",
      backToShop: "متابعة التسوق",
      orderConfirmation: "تم تأكيد الطلب!",
      thankYou: "شكراً لطلبك!",
      orderSent: "تم حفظ طلبك.",
      deliveryTime: "التوصيل المتوقع: 2-6 أيام",
      trackingNote: "ستصلك تحديثات التتبع عبر واتساب/SMS.",
      customerInfo: "معلومات العميل",
      deliveryInfo: "معلومات التوصيل",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      emailLabel: "البريد الإلكتروني",
      secondaryPhoneLabel: "رقم الهاتف الثانوي",
      wilayaLabel: "الولاية",
      communeLabel: "البلدية",
      deliveryModeLabel: "طريقة التوصيل",
      addressLabel: "العنوان",
      landmarkLabel: "معلم قريب",
      continueShopping: "متابعة التسوق",
      next: "التالي",
      back: "رجوع",
      proceedToCheckout: "متابعة الدفع",
      confirmOrder: "تأكيد الطلب",
      sendOnInstagram: "إرسال على انستغرام",
      step1Title: "راجع عناصر سلتك",
      step2Title: "أدخل تفاصيلك ومعلومات الشحن",
      step3Title: "راجع وأكد طلبك",
      details: "التفاصيل",
      orderCopiedOpening: "تم نسخ الطلب! جارٍ فتح انستغرام...",
    },
  };

  // Step 1 handler - simple, no async needed
  const handleGoToDetails = () => {
    setCurrentStep(2);
  };

  // Step 2 handler - validate form before proceeding
  const handleGoToConfirmation = async () => {
    // Validate only the required fields for step 2
    const fieldsToValidate: (keyof CheckoutFormData)[] = [
      "firstName",
      "lastName", 
      "phone",
      "wilaya",
      "commune",
      "deliveryMode",
    ];

    // Add address validation if home delivery is selected
    if (watchedDeliveryMode === "home") {
      fieldsToValidate.push("address");
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (!isValid) {
      // Show error toast if validation fails
      const errors = form.formState.errors;
      // Validation errors occurred, showing user feedback
      toast.error(language === "AR" ? "يرجى ملء جميع الحقول المطلوبة" : language === "FR" ? "Veuillez remplir tous les champs requis" : "Please fill in all required fields");
      return;
    }

    // Sync form values to selectedWilaya/selectedCommune for backward compatibility
    const formValues = form.getValues();
    setSelectedWilaya(formValues.wilaya);
    setSelectedCommune(formValues.commune);
    setCurrentStep(3);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const generateOrderMessage = () => {
    const formValues = form.getValues();
    const wilayaValue = formValues.wilaya || selectedWilaya;
    if (!wilayaValue || wilayaValue === "") {
      return "";
    }
    const wilayaCode = parseInt(wilayaValue, 10);
    if (isNaN(wilayaCode)) {
      return "";
    }
    const wilayaName = getWilayaName(wilayaCode, language);
    const modeLabel = formValues.deliveryMode === "home" 
      ? (language === "AR" ? "توصيل للمنزل" : language === "FR" ? "Livraison à domicile" : "Home Delivery")
      : "Stop Desk";

    const itemsText = items.map((item) => `- ${item.quantity} x ${item.name}`).join("\n");
    const fullName = `${formValues.firstName.trim()} ${formValues.lastName.trim()}`;

    let message = `Hello! I would like to order:\n${itemsText}\n\nCustomer Info:\n- Name: ${fullName}\n- Phone: ${formValues.phone.trim()}`;
    if (formValues.secondaryPhone?.trim()) {
      message += `\n- Secondary Phone: ${formValues.secondaryPhone.trim()}`;
    }
    if (formValues.email?.trim()) {
      message += `\n- Email: ${formValues.email.trim()}`;
    }
    message += `\n\nDelivery Info:\n- Wilaya: ${wilayaName}\n- Commune: ${formValues.commune}\n- Mode: ${modeLabel}`;
    if (formValues.deliveryMode === "home" && formValues.address?.trim()) {
      message += `\n- Address: ${formValues.address.trim()}`;
    }
    if (formValues.deliveryMode === "home" && formValues.landmark?.trim()) {
      message += `\n- Landmark: ${formValues.landmark.trim()}`;
    }
    if (formValues.orderNotes?.trim()) {
      message += `\n\nOrder Notes: ${formValues.orderNotes.trim()}`;
    }
    message += `\n\nSubtotal: ${subtotal} DZD\nShipping: ${shippingCost} DZD\nTotal: ${grandTotal} DZD`;

    return message;
  };

  const handleConfirmOrder = () => {
    const formValues = form.getValues();
    const wilayaValue = formValues.wilaya || selectedWilaya;
    if (!wilayaValue || wilayaValue === "") {
      return;
    }
    const wilayaCode = parseInt(wilayaValue, 10);
    if (isNaN(wilayaCode)) {
      return;
    }
    const wilayaName = getWilayaName(wilayaCode, language);
    const fullName = `${formValues.firstName.trim()} ${formValues.lastName.trim()}`;
    
    // Save order details for confirmation page
    setOrderDetails({
      items: [...items],
      customerName: fullName,
      customerPhone: formValues.phone.trim(),
      customerSecondaryPhone: formValues.secondaryPhone?.trim() || "",
      customerEmail: formValues.email?.trim() || "",
      wilayaName,
      communeName: language === "AR" 
        ? availableCommunes.find(c => c.name === formValues.commune)?.ar_name || formValues.commune
        : formValues.commune,
      address: formValues.address?.trim() || "",
      landmark: formValues.landmark?.trim() || "",
      orderNotes: formValues.orderNotes?.trim() || "",
      deliveryModeLabel: formValues.deliveryMode === "home" 
        ? (language === "AR" ? "توصيل للمنزل" : language === "FR" ? "Livraison à domicile" : "Home Delivery")
        : "Stop Desk",
      subtotal,
      shipping: shippingCost,
      total: grandTotal,
    });
    
    // Create order for tracking
    createOrder({
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      subtotal,
      shipping: shippingCost,
      total: grandTotal,
      customerName: fullName,
      customerPhone: formValues.phone.trim(),
      customerEmail: formValues.email?.trim(),
      customerSecondaryPhone: formValues.secondaryPhone?.trim(),
      shippingAddress: `${formValues.address?.trim() || ""}, ${language === "AR"
        ? availableCommunes.find(c => c.name === formValues.commune)?.ar_name || formValues.commune
        : formValues.commune}, ${wilayaName}, Algeria`,
      paymentMethod: formValues.paymentMethod === "cod"
        ? (language === "AR" ? "الدفع عند التسليم" : language === "FR" ? "Paiement à la livraison" : "Cash on Delivery")
        : (language === "AR" ? "الدفع عبر الإنترنت" : language === "FR" ? "Paiement en ligne" : "Online Payment")
    });

    // Mark order as confirmed
    setOrderConfirmed(true);

    // Clear cart
    clearCart();
  };

  const handleSendOnInstagram = async () => {
    // Generate order message
    const message = orderDetails ? 
      `Hello! I would like to order:\n${orderDetails.items.map((item) => `- ${item.quantity} x ${item.name}`).join("\n")}\n\nCustomer Info:\n- Name: ${orderDetails.customerName}\n- Phone: ${orderDetails.customerPhone}${orderDetails.customerSecondaryPhone ? `\n- Secondary Phone: ${orderDetails.customerSecondaryPhone}` : ""}${orderDetails.customerEmail ? `\n- Email: ${orderDetails.customerEmail}` : ""}\n\nDelivery Info:\n- Wilaya: ${orderDetails.wilayaName}\n- Commune: ${orderDetails.communeName}\n- Mode: ${orderDetails.deliveryModeLabel}${orderDetails.address ? `\n- Address: ${orderDetails.address}` : ""}${orderDetails.landmark ? `\n- Landmark: ${orderDetails.landmark}` : ""}${orderDetails.orderNotes ? `\n\nOrder Notes: ${orderDetails.orderNotes}` : ""}\n\nSubtotal: ${orderDetails.subtotal} DZD\nShipping: ${orderDetails.shipping} DZD\nTotal: ${orderDetails.total} DZD`
      : generateOrderMessage();

    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(message);
      
      // Show toast
      toast.success(l.orderCopiedOpening);
      
      // Open Instagram DM
      window.open(INSTAGRAM_DM_URL, "_blank");
    } catch {
      // Still try to open Instagram even if clipboard fails
      window.open(INSTAGRAM_DM_URL, "_blank");
    }
  };

  const l = labels[language];

  const selectedWilayaName = (() => {
    const wilayaValue = selectedWilaya || form.watch("wilaya");
    if (!wilayaValue || wilayaValue === "") return "";
    const code = parseInt(wilayaValue, 10);
    if (isNaN(code)) return "";
    return `${wilayaValue.padStart(2, "0")} - ${getWilayaName(code, language)}`;
  })();

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="pt-24 lg:pt-28">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <Link to={`/shop?lang=${(searchParams.get("lang") || language).toLowerCase()}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {l.backToShop}
          </Link>

          <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-primary mb-8">{l.checkout}</h1>

          {/* Progress Stepper */}
          <CheckoutProgress currentStep={currentStep} orderConfirmed={orderConfirmed} />

          {/* Order Confirmation View */}
          {orderConfirmed && orderDetails ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-lg p-8 shadow-card text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-primary mb-2">
                  {l.orderConfirmation}
                </h2>
                <p className="text-muted-foreground mb-6">{l.thankYou}</p>

                {/* Order Summary */}
                <div className={`bg-muted/30 rounded-lg p-4 mb-6 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                  <h3 className="font-semibold text-foreground mb-3">{l.orderSummary}</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map((item) => (
                      <div key={item.id} className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                        <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                        <PriceDisplay priceDZD={item.price * item.quantity} size="sm" showOriginal={false} />
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2">
                      <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                        <span className="text-muted-foreground">{l.subtotal}</span>
                        <PriceDisplay priceDZD={orderDetails.subtotal} size="sm" showOriginal={false} />
                      </div>
                      <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between text-sm`}>
                        <span className="text-muted-foreground">{l.shipping}</span>
                        <PriceDisplay priceDZD={orderDetails.shipping} size="sm" showOriginal={false} />
                      </div>
                      <div className={`flex ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between font-semibold text-lg mt-2 pt-2 border-t border-border`}>
                        <span>{l.total}</span>
                        <PriceDisplay priceDZD={orderDetails.total} size="lg" className="text-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer & Delivery Info */}
                <div className={`grid sm:grid-cols-2 gap-4 mb-6 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                      <User className={`h-4 w-4 text-primary flex-shrink-0 ${isRTL ? "order-2" : "order-1"}`} />
                      <h4 className={`font-medium text-foreground flex-1 ${isRTL ? "text-right order-1" : "text-left order-2"}`}>{l.customerInfo}</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">{l.fullName}: </span>
                        <span className="text-sm text-muted-foreground">{orderDetails.customerName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{l.phoneNumber}: </span>
                        <span className="text-sm text-muted-foreground">{orderDetails.customerPhone}</span>
                      </div>
                      {orderDetails.customerSecondaryPhone && (
                        <div>
                          <span className="text-sm font-medium text-foreground">{l.secondaryPhoneLabel}: </span>
                          <span className="text-sm text-muted-foreground">{orderDetails.customerSecondaryPhone}</span>
                        </div>
                      )}
                      {orderDetails.customerEmail && (
                        <div>
                          <span className="text-sm font-medium text-foreground">{l.emailLabel}: </span>
                          <span className="text-sm text-muted-foreground">{orderDetails.customerEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                      <Truck className={`h-4 w-4 text-primary flex-shrink-0 ${isRTL ? "order-2" : "order-1"}`} />
                      <h4 className={`font-medium text-foreground flex-1 ${isRTL ? "text-right order-1" : "text-left order-2"}`}>{l.deliveryInfo}</h4>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">{l.wilayaLabel}: </span>
                        <span className="text-sm text-muted-foreground">{orderDetails.wilayaName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{l.communeLabel}: </span>
                        <span className="text-sm text-muted-foreground">{orderDetails.communeName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{l.deliveryModeLabel}: </span>
                        <span className="text-sm text-muted-foreground">{orderDetails.deliveryModeLabel}</span>
                      </div>
                      {orderDetails.address && (
                        <div>
                          <span className="text-sm font-medium text-foreground">{l.addressLabel}: </span>
                          <span className="text-sm text-muted-foreground">{orderDetails.address}</span>
                        </div>
                      )}
                      {orderDetails.landmark && (
                        <div>
                          <span className="text-sm font-medium text-foreground">{l.landmarkLabel}: </span>
                          <span className="text-sm text-muted-foreground">{orderDetails.landmark}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Notes if any */}
                {orderDetails.orderNotes && (
                  <div className={`bg-muted/30 rounded-lg p-4 mb-6 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                      <MessageSquare className={`h-4 w-4 text-primary flex-shrink-0 ${isRTL ? "order-2" : "order-1"}`} />
                      <h4 className={`font-medium text-foreground flex-1 ${isRTL ? "text-right order-1" : "text-left order-2"}`}>{l.orderNotes.replace(" (optional)", "").replace(" (optionnel)", "").replace(" (اختياري)", "")}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{orderDetails.orderNotes}</p>
                  </div>
                )}

                {/* Tracking Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    <p className="font-medium text-primary">{l.deliveryTime}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{l.orderSent}</p>
                  <p className="text-sm text-muted-foreground mb-4">{l.trackingNote}</p>

                  {/* Track Order Button */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Navigate to order tracking or show tracking modal
                      toast.info(language === "AR" ? "تتبع الطلب متاح قريباً" : language === "FR" ? "Suivi de commande bientôt disponible" : "Order tracking coming soon");
                    }}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    {language === "AR" ? "تتبع طلبي" : language === "FR" ? "Suivre ma commande" : "Track My Order"}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/shop">
                      <ShoppingBag className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {l.continueShopping}
                    </Link>
                  </Button>
                  <Button 
                    onClick={handleSendOnInstagram}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-white px-8 py-6 text-lg"
                  >
                    <Instagram className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {l.sendOnInstagram}
                  </Button>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="h-20 w-20 text-muted-foreground mb-6" />
              <p className="text-xl text-muted-foreground mb-6">{l.empty}</p>
              <Link to="/shop">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {l.startShopping}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Step 1: Cart View */}
              {currentStep === 1 && (
                <div className="bg-card rounded-lg p-6 shadow-card animate-fade-in">
                  <h2 className="font-serif text-xl font-semibold text-primary mb-2">{l.yourCart}</h2>
                  <p className="text-muted-foreground text-sm mb-6">{l.step1Title}</p>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                          <PriceDisplay priceDZD={item.price} size="sm" showOriginal={false} className="mt-1" />
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <PriceDisplay priceDZD={item.price * item.quantity} size="md" showOriginal={false} className="font-semibold" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg mb-6">
                    <span className="font-medium text-foreground">{l.subtotal}</span>
                    <div className="flex items-center gap-2">
                      <PriceDisplay priceDZD={subtotal} size="lg" className="text-primary font-semibold" />
                      <ExchangeRateIndicator />
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-end">
                    <Button onClick={handleGoToDetails} type="button" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                      {l.proceedToCheckout}
                      <ArrowLeft className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2 rotate-180"}`} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Details (Personal Info + Shipping merged) */}
              {currentStep === 2 && (
                <div className="bg-card rounded-lg p-6 shadow-card animate-fade-in">
                  <h2 className={`font-serif text-xl font-semibold text-primary mb-2 ${isRTL ? "text-right" : "text-left"}`}>{l.details}</h2>
                  <p className={`text-muted-foreground text-sm mb-6 ${isRTL ? "text-right" : "text-left"}`}>{l.step2Title}</p>

                  <Form {...form}>
                    <form className="space-y-6 max-w-md" dir={isRTL ? "rtl" : "ltr"}>
                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground border-b border-border pb-2">{l.personalInfo}</h3>
                      {/* First Name Input */}
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>{l.firstName} *</FormLabel>
                            <div className="relative">
                              <User className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  placeholder={l.firstNamePlaceholder}
                                  className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                  {...field}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{l.lastName} *</FormLabel>
                          <div className="relative">
                            <User className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder={l.lastNamePlaceholder}
                                className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number Input */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{l.phone} *</FormLabel>
                          <div className="relative">
                            <Phone className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="tel"
                                inputMode="numeric"
                                placeholder={isRTL ? `\u202B${l.phonePlaceholder}\u202C` : l.phonePlaceholder}
                                dir={isRTL ? "rtl" : "ltr"}
                                className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                style={isRTL ? { direction: 'rtl', textAlign: 'right' } : undefined}
                                {...field}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                  field.onChange(numericValue);
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Secondary Phone Input */}
                    <FormField
                      control={form.control}
                      name="secondaryPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{l.secondaryPhone}</FormLabel>
                          <div className="relative">
                            <Phone className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="tel"
                                inputMode="numeric"
                                placeholder={isRTL ? `\u202B${l.secondaryPhonePlaceholder}\u202C` : l.secondaryPhonePlaceholder}
                                dir={isRTL ? "rtl" : "ltr"}
                                className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                style={isRTL ? { direction: 'rtl', textAlign: 'right' } : undefined}
                                {...field}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                                  field.onChange(numericValue);
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email Input */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{l.email}</FormLabel>
                          <div className="relative">
                            <Mail className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="email"
                                placeholder={l.emailPlaceholder}
                                className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>

                    {/* Shipping Information Section */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-semibold text-foreground border-b border-border pb-2">{l.shippingInfo}</h3>
                    {/* Wilaya Combobox */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{l.wilaya} *</label>
                      <div className="relative wilaya-combo">
                        <div
                          className={cn(
                            "flex items-center w-full rounded-md border bg-background py-3 cursor-pointer text-sm",
                            "ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3",
                            isWilayaOpen ? "border-primary ring-2 ring-primary/20" : "border-border",
                            errors.wilaya && "border-destructive"
                          )}
                          onClick={() => {
                            setIsWilayaOpen(true);
                            setTimeout(() => wilayaInputRef.current?.focus(), 0);
                            if (errors.wilaya) setErrors(prev => ({ ...prev, wilaya: undefined }));
                          }}
                        >
                          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          {isWilayaOpen ? (
                            <input
                              ref={wilayaInputRef}
                              type="text"
                              value={wilayaSearch}
                              onChange={(e) => setWilayaSearch(e.target.value)}
                              onKeyDown={handleWilayaKeyDown}
                              placeholder={l.selectWilaya}
                              className="flex-1 bg-transparent outline-none"
                            />
                          ) : (
                            <span className={cn("flex-1", !selectedWilaya && "text-muted-foreground")}>
                              {selectedWilayaName || l.selectWilaya}
                            </span>
                          )}
                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform ltr:ml-2 rtl:mr-2", isWilayaOpen && "rotate-180")} />
                        </div>
                        {isWilayaOpen && (
                          <div ref={wilayaListRef} className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-border bg-background shadow-lg">
                            {filteredWilayas.length === 0 ? (
                              <div className="px-4 py-6 text-center text-muted-foreground">{l.noResults}</div>
                            ) : (
                              filteredWilayas.map((code, i) => (
                                <div
                                  key={code}
                                  onClick={() => handleWilayaSelect(code.toString())}
                                  className={cn(
                                    "flex items-center justify-between px-4 py-2.5 cursor-pointer",
                                    wilayaHighlight === i && "bg-primary/10",
                                    selectedWilaya === code.toString() && "bg-primary/5"
                                  )}
                                >
                                  <span>{code.toString().padStart(2, "0")} - {getWilayaName(code, language)}</span>
                                  {selectedWilaya === code.toString() && <Check className="h-4 w-4 text-primary" />}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      {errors.wilaya && (
                        <p className="text-sm text-destructive">{errors.wilaya}</p>
                      )}
                    </div>

                    {/* Commune Combobox */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{l.commune} *</label>
                      <div className="relative commune-combo">
                        <div
                          className={cn(
                            "flex items-center w-full rounded-md border bg-background py-3 cursor-pointer text-sm",
                            "ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3",
                            isCommuneOpen ? "border-primary ring-2 ring-primary/20" : "border-border",
                            !selectedWilaya && "opacity-50 pointer-events-none",
                            errors.commune && "border-destructive"
                          )}
                          onClick={() => {
                            if (selectedWilaya) {
                              setIsCommuneOpen(true);
                              setTimeout(() => communeInputRef.current?.focus(), 0);
                              if (errors.commune) setErrors(prev => ({ ...prev, commune: undefined }));
                            }
                          }}
                        >
                          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          {isCommuneOpen ? (
                            <input
                              ref={communeInputRef}
                              type="text"
                              value={communeSearch}
                              onChange={(e) => setCommuneSearch(e.target.value)}
                              onKeyDown={handleCommuneKeyDown}
                              placeholder={l.selectCommune}
                              className="flex-1 bg-transparent outline-none"
                            />
                          ) : (
                            <span className={cn("flex-1", !selectedCommune && "text-muted-foreground")}>
                              {selectedCommune 
                                ? (language === "AR" 
                                    ? availableCommunes.find(c => c.name === selectedCommune)?.ar_name || selectedCommune
                                    : selectedCommune)
                                : (selectedWilaya ? l.selectCommune : l.selectWilayaFirst)}
                            </span>
                          )}
                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform ltr:ml-2 rtl:mr-2", isCommuneOpen && "rotate-180")} />
                        </div>
                        {isCommuneOpen && (
                          <div ref={communeListRef} className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-border bg-background shadow-lg">
                            {filteredCommunes.length === 0 ? (
                              <div className="px-4 py-6 text-center text-muted-foreground">{l.noResults}</div>
                            ) : (
                              filteredCommunes.map((commune, i) => (
                                <div
                                  key={commune.name}
                                  onClick={() => handleCommuneSelect(commune.name)}
                                  className={cn(
                                    "flex items-center justify-between px-4 py-2.5 cursor-pointer",
                                    communeHighlight === i && "bg-primary/10",
                                    selectedCommune === commune.name && "bg-primary/5"
                                  )}
                                >
                                  <span>{getCommuneName(commune, language)}</span>
                                  {selectedCommune === commune.name && <Check className="h-4 w-4 text-primary" />}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      {errors.commune && (
                        <p className="text-sm text-destructive">{errors.commune}</p>
                      )}
                    </div>

                    {/* Delivery Mode */}
                    <FormField
                      control={form.control}
                      name="deliveryMode"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{l.deliveryMode} *</FormLabel>
                          <FormControl>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => field.onChange("desk")}
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-sm font-medium transition-all",
                                  field.value === "desk"
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-border hover:bg-muted"
                                )}
                              >
                                <Building2 className="h-4 w-4" />
                                {l.desk}
                              </button>
                              <button
                                type="button"
                                onClick={() => field.onChange("home")}
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md border text-sm font-medium transition-all",
                                  field.value === "home"
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-border hover:bg-muted"
                                )}
                              >
                                <Home className="h-4 w-4" />
                                {l.home}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address Input - Only shown for Home Delivery */}
                    {watchedDeliveryMode === "home" && (
                      <>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>{l.address} *</FormLabel>
                              <div className="relative">
                                <MapPin className="absolute ltr:left-3 rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    placeholder={l.addressPlaceholder}
                                    className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Landmark Input */}
                        <FormField
                          control={form.control}
                          name="landmark"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>{l.landmark}</FormLabel>
                              <div className="relative">
                                <Navigation className="absolute ltr:left-3 rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input
                                    placeholder={l.landmarkPlaceholder}
                                    className="ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3"
                                    {...field}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Order Notes */}
                    <FormField
                      control={form.control}
                      name="orderNotes"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>{l.orderNotes}</FormLabel>
                          <div className="relative">
                            <MessageSquare className="absolute ltr:left-3 rtl:right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Textarea
                                placeholder={l.orderNotesPlaceholder}
                                className="text-base ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3 py-3 min-h-[80px] resize-none"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Shipping Cost Display */}
                    {(watchedWilaya || selectedWilaya) && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">{l.shippingCost}</span>
                          </div>
                          {shippingCost === 0 ? (
                            <span className="font-semibold text-amber-600">{l.contactUs}</span>
                          ) : (
                            <PriceDisplay priceDZD={shippingCost} size="lg" className="text-primary font-bold" />
                          )}
                        </div>
                      </div>
                    )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                      <Button onClick={handlePrevStep} variant="ghost" type="button">
                        <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                        {l.back}
                      </Button>
                      <Button onClick={handleGoToConfirmation} type="button" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                        {l.next}
                        <ArrowLeft className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2 rotate-180"}`} />
                      </Button>
                    </div>
                  </form>
                </Form>
                </div>
              )}

              {/* Step 3: Order Review & Confirmation */}
              {currentStep === 3 && (
                <div className="bg-card rounded-lg p-6 shadow-card animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
                  <h2 className={`font-serif text-xl font-semibold text-primary mb-2 ${isRTL ? "text-right" : "text-left"}`}>{l.orderSummary}</h2>
                  <p className={`text-muted-foreground text-sm mb-6 ${isRTL ? "text-right" : "text-left"}`}>{l.step3Title}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer & Shipping Info Summary */}
                    <div className="space-y-4">
                      <div className={`bg-muted/30 rounded-lg p-4 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                        <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                          <User className={`h-4 w-4 text-primary flex-shrink-0 ${isRTL ? "order-2" : "order-1"}`} />
                          <h4 className={`font-medium text-foreground flex-1 ${isRTL ? "text-right order-1" : "text-left order-2"}`}>{l.customerInfo}</h4>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-foreground">{l.fullName}: </span>
                            <span className="text-sm text-muted-foreground">{form.watch("firstName")} {form.watch("lastName")}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">{l.phoneNumber}: </span>
                            <span className="text-sm text-muted-foreground">{form.watch("phone")}</span>
                          </div>
                          {form.watch("secondaryPhone") && (
                            <div>
                              <span className="text-sm font-medium text-foreground">{l.secondaryPhoneLabel}: </span>
                              <span className="text-sm text-muted-foreground">{form.watch("secondaryPhone")}</span>
                            </div>
                          )}
                          {form.watch("email") && (
                            <div>
                              <span className="text-sm font-medium text-foreground">{l.emailLabel}: </span>
                              <span className="text-sm text-muted-foreground">{form.watch("email")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`bg-muted/30 rounded-lg p-4 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                        <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                          <Truck className={`h-4 w-4 text-primary flex-shrink-0 ${isRTL ? "order-2" : "order-1"}`} />
                          <h4 className={`font-medium text-foreground flex-1 ${isRTL ? "text-right order-1" : "text-left order-2"}`}>{l.deliveryInfo}</h4>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-foreground">{l.wilayaLabel}: </span>
                            <span className="text-sm text-muted-foreground">{form.watch("wilaya") ? getWilayaName(parseInt(form.watch("wilaya")), language) : ""}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">{l.communeLabel}: </span>
                            <span className="text-sm text-muted-foreground">
                              {(() => {
                                const communeValue = form.watch("commune");
                                if (!communeValue || communeValue === "") return "";
                                return language === "AR" 
                                  ? availableCommunes.find(c => c.name === communeValue)?.ar_name || communeValue
                                  : communeValue;
                              })()}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">{l.deliveryModeLabel}: </span>
                            <span className="text-sm text-muted-foreground">
                              {form.watch("deliveryMode") === "home" 
                                ? (language === "AR" ? "توصيل للمنزل" : language === "FR" ? "Livraison à domicile" : "Home Delivery")
                                : "Stop Desk"}
                            </span>
                          </div>
                          {form.watch("deliveryMode") === "home" && form.watch("address") && (
                            <div>
                              <span className="text-sm font-medium text-foreground">{l.addressLabel}: </span>
                              <span className="text-sm text-muted-foreground">{form.watch("address")}</span>
                            </div>
                          )}
                          {form.watch("deliveryMode") === "home" && form.watch("landmark") && (
                            <div>
                              <span className="text-sm font-medium text-foreground">{l.landmarkLabel}: </span>
                              <span className="text-sm text-muted-foreground">{form.watch("landmark")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {form.watch("orderNotes") && (
                        <div className={`bg-muted/30 rounded-lg p-4 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                          <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                            <MessageSquare className={`h-4 w-4 text-primary flex-shrink-0 ${isRTL ? "order-2" : "order-1"}`} />
                            <h4 className={`font-medium text-foreground flex-1 ${isRTL ? "text-right order-1" : "text-left order-2"}`}>{l.orderNotes.replace(" (optional)", "").replace(" (optionnel)", "").replace(" (اختياري)", "")}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{form.watch("orderNotes")}</p>
                        </div>
                      )}
                    </div>

                    {/* Cart Items & Totals */}
                    <div>
                      <div className="space-y-3 mb-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-3 p-2 bg-muted/20 rounded-lg">
                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-md" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-foreground truncate">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.quantity}x</p>
                              <PriceDisplay priceDZD={item.price * item.quantity} size="sm" showOriginal={false} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{l.subtotal}</span>
                          <PriceDisplay priceDZD={subtotal} size="sm" showOriginal={false} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{l.shipping}</span>
                          <PriceDisplay priceDZD={shippingCost} size="sm" showOriginal={false} />
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                          <span>{l.total}</span>
                          <PriceDisplay priceDZD={grandTotal} size="lg" className="text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation & Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button onClick={handlePrevStep} variant="ghost" className="sm:flex-none">
                      <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {l.back}
                    </Button>
                    
                    <div className="flex-1 flex justify-end">
                      <Button
                        onClick={handleConfirmOrder}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                      >
                        <CheckCircle2 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                        {l.confirmOrder}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Checkout;