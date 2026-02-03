import { useState, useRef, useEffect } from "react";
import { Truck, Home, Building2, Search, Check, ChevronDown } from "lucide-react";
import { shippingRates, wilayaNames, DeliveryMode } from "@/data/shippingRates";
import { communesWithArabic, Commune } from "@/data/communesWithArabic";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useCurrency, useFormattedPrice } from "@/contexts/CurrencyContext";
import { formatPrice as formatPriceUtil } from "@/utils/formatPrice";
import { cn } from "@/lib/utils";

const ShippingCalculator = () => {
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("desk");
  
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
  
  const { language, isRTL } = useLanguage();
  const { currency } = useCurrency();
  const formatPrice = useFormattedPrice();

  const getWilayaName = (code: number, lang: Language) => {
    const names = wilayaNames[code];
    if (!names) return `Wilaya ${code}`;
    switch (lang) {
      case "AR": return names.ar;
      case "FR": return names.fr;
      default: return names.en;
    }
  };

  const getDeliveryPrice = () => {
    if (!selectedWilaya) return null;
    const rate = shippingRates[parseInt(selectedWilaya)];
    if (!rate) return null;
    return rate[deliveryMode];
  };

  const deliveryPrice = getDeliveryPrice();

  const sortedWilayas = Object.keys(shippingRates).map(Number).sort((a, b) => a - b);

  const filteredWilayas = sortedWilayas.filter((code) => {
    const name = getWilayaName(code, language).toLowerCase();
    const codeStr = code.toString().padStart(2, "0");
    const query = wilayaSearch.toLowerCase();
    return name.includes(query) || codeStr.includes(query);
  });

  const availableCommunes: Commune[] = selectedWilaya ? (communesWithArabic[parseInt(selectedWilaya)] || []) : [];
  
  const getCommuneName = (commune: Commune, lang: Language): string => {
    return lang === "AR" ? commune.ar_name : commune.name;
  };
  
  const filteredCommunes = availableCommunes.filter((c) => {
    const name = getCommuneName(c, language).toLowerCase();
    const frName = c.name.toLowerCase();
    const query = communeSearch.toLowerCase();
    return name.includes(query) || frName.includes(query);
  });

  const labels = {
    EN: {
      estimateDelivery: "Estimate Delivery",
      wilaya: "Wilaya",
      commune: "Commune",
      selectWilaya: "Search or select your Wilaya",
      selectCommune: "Search or select your Commune",
      selectWilayaFirst: "Select a wilaya first",
      deliveryMode: "Delivery Mode",
      home: "Home Delivery",
      desk: "Stop Desk",
      deliveryCost: "Delivery Cost",
      contactUs: "Contact us for quote",
      noResults: "No results found",
    },
    FR: {
      estimateDelivery: "Estimer la Livraison",
      wilaya: "Wilaya",
      commune: "Commune",
      selectWilaya: "Rechercher ou sélectionner votre Wilaya",
      selectCommune: "Rechercher ou sélectionner votre Commune",
      selectWilayaFirst: "Sélectionnez d'abord une wilaya",
      deliveryMode: "Mode de Livraison",
      home: "Livraison à domicile",
      desk: "Stop Desk",
      deliveryCost: "Frais de Livraison",
      contactUs: "Contactez-nous pour un devis",
      noResults: "Aucun résultat",
    },
    AR: {
      estimateDelivery: "تقدير التوصيل",
      wilaya: "الولاية",
      commune: "البلدية",
      selectWilaya: "ابحث أو اختر ولايتك",
      selectCommune: "ابحث أو اختر بلديتك",
      selectWilayaFirst: "اختر الولاية أولاً",
      deliveryMode: "طريقة التوصيل",
      home: "توصيل للمنزل",
      desk: "Stop Desk",
      deliveryCost: "تكلفة التوصيل",
      contactUs: "اتصل بنا للحصول على عرض سعر",
      noResults: "لا توجد نتائج",
    },
  };

  const t = labels[language];

  // Reset commune when wilaya changes
  useEffect(() => {
    setSelectedCommune("");
    setCommuneSearch("");
  }, [selectedWilaya]);

  const handleWilayaSelect = (code: string) => {
    setSelectedWilaya(code);
    setWilayaSearch("");
    setIsWilayaOpen(false);
    setWilayaHighlight(0);
  };

  const handleCommuneSelect = (commune: string) => {
    setSelectedCommune(commune);
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

  // Scroll highlighted items into view
  useEffect(() => {
    if (isWilayaOpen && wilayaListRef.current) {
      const el = wilayaListRef.current.querySelector(`[data-index="${wilayaHighlight}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [wilayaHighlight, isWilayaOpen]);

  useEffect(() => {
    if (isCommuneOpen && communeListRef.current) {
      const el = communeListRef.current.querySelector(`[data-index="${communeHighlight}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [communeHighlight, isCommuneOpen]);

  const selectedWilayaName = selectedWilaya 
    ? `${selectedWilaya.padStart(2, "0")} - ${getWilayaName(parseInt(selectedWilaya), language)}`
    : "";

  return (
    <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-primary">
        <Truck className="h-5 w-5" />
        <span className="font-semibold text-base">{t.estimateDelivery}</span>
      </div>
      
      {/* Wilaya Combobox */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-medium">{t.wilaya}</label>
        <div className="relative wilaya-combo">
          <div
            className={cn(
              "flex items-center w-full rounded-lg border bg-background py-2.5 cursor-pointer transition-colors",
              "ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3",
              isWilayaOpen ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
            )}
            onClick={() => {
              setIsWilayaOpen(true);
              setTimeout(() => wilayaInputRef.current?.focus(), 0);
            }}
          >
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isWilayaOpen ? (
              <input
                ref={wilayaInputRef}
                type="text"
                value={wilayaSearch}
                onChange={(e) => setWilayaSearch(e.target.value)}
                onKeyDown={handleWilayaKeyDown}
                placeholder={t.selectWilaya}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                autoComplete="off"
              />
            ) : (
              <span className={cn("flex-1", selectedWilaya ? "text-foreground" : "text-muted-foreground")}>
                {selectedWilayaName || t.selectWilaya}
              </span>
            )}
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform ltr:ml-2 rtl:mr-2", isWilayaOpen && "rotate-180")} />
          </div>

          {isWilayaOpen && (
            <div ref={wilayaListRef} className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-background shadow-lg">
              {filteredWilayas.length === 0 ? (
                <div className="px-3 py-6 text-center text-muted-foreground text-sm">{t.noResults}</div>
              ) : (
                filteredWilayas.map((code, index) => (
                  <div
                    key={code}
                    data-index={index}
                    onClick={() => handleWilayaSelect(code.toString())}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors",
                      wilayaHighlight === index && "bg-primary/10",
                      selectedWilaya === code.toString() && "bg-primary/5"
                    )}
                  >
                    <span className="text-foreground">{code.toString().padStart(2, "0")} - {getWilayaName(code, language)}</span>
                    {selectedWilaya === code.toString() && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Commune Combobox */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-medium">{t.commune}</label>
        <div className="relative commune-combo">
          <div
            className={cn(
              "flex items-center w-full rounded-lg border bg-background py-2.5 cursor-pointer transition-colors",
              "ltr:pl-10 ltr:pr-3 rtl:pr-12 rtl:pl-3",
              isCommuneOpen ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50",
              !selectedWilaya && "opacity-50 pointer-events-none"
            )}
            onClick={() => {
              if (selectedWilaya) {
                setIsCommuneOpen(true);
                setTimeout(() => communeInputRef.current?.focus(), 0);
              }
            }}
          >
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isCommuneOpen ? (
              <input
                ref={communeInputRef}
                type="text"
                value={communeSearch}
                onChange={(e) => setCommuneSearch(e.target.value)}
                onKeyDown={handleCommuneKeyDown}
                placeholder={t.selectCommune}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                autoComplete="off"
              />
            ) : (
              <span className={cn("flex-1", selectedCommune ? "text-foreground" : "text-muted-foreground")}>
                {selectedCommune 
                  ? (language === "AR" 
                      ? availableCommunes.find(c => c.name === selectedCommune)?.ar_name || selectedCommune
                      : selectedCommune)
                  : (selectedWilaya ? t.selectCommune : t.selectWilayaFirst)}
              </span>
            )}
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform ltr:ml-2 rtl:mr-2", isCommuneOpen && "rotate-180")} />
          </div>

          {isCommuneOpen && (
            <div ref={communeListRef} className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg border border-border bg-background shadow-lg">
              {filteredCommunes.length === 0 ? (
                <div className="px-3 py-6 text-center text-muted-foreground text-sm">{t.noResults}</div>
              ) : (
                filteredCommunes.map((commune, index) => (
                  <div
                    key={commune.name}
                    data-index={index}
                    onClick={() => handleCommuneSelect(commune.name)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors",
                      communeHighlight === index && "bg-primary/10",
                      selectedCommune === commune.name && "bg-primary/5"
                    )}
                  >
                    <span className="text-foreground">{getCommuneName(commune, language)}</span>
                    {selectedCommune === commune.name && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delivery Mode Toggle */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-medium">{t.deliveryMode}</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDeliveryMode("desk")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm font-medium cursor-pointer",
              deliveryMode === "desk"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            <Building2 className="h-4 w-4" />
            <span>{t.desk}</span>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryMode("home")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm font-medium cursor-pointer",
              deliveryMode === "home"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            <Home className="h-4 w-4" />
            <span>{t.home}</span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {selectedWilaya && (
        <div 
          className={cn("flex items-center justify-between text-sm pt-3 border-t border-border")}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <span className="text-muted-foreground font-medium">{t.deliveryCost}:</span>
          {deliveryPrice === 0 ? (
            <span className="font-semibold text-amber-600">{t.contactUs}</span>
          ) : (
            <div className="text-right">
              <span className="font-bold text-lg text-primary block">
                {formatPrice(deliveryPrice || 0)}
              </span>
              {currency !== "DZD" && (
                <span className="text-xs text-muted-foreground">
                  ({formatPriceUtil(deliveryPrice || 0, "DZD", language)})
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
