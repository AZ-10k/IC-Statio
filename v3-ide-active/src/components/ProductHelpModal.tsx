import { useState } from "react";
import { Ruler, HelpCircle, Heart, Shield, Truck, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductHelpModalProps {
  product: {
    id: string;
    name: string;
    category: string;
    dimensions?: {
      width: number;
      height: number;
      thickness?: number;
    };
    weight?: number;
    pages?: number;
    material?: string;
  };
  children?: React.ReactNode;
}

const ProductHelpModal = ({ product, children }: ProductHelpModalProps) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    EN: {
      title: "Product Information",
      sizeGuide: "Size Guide",
      dimensions: "Dimensions",
      weight: "Weight",
      pages: "Pages",
      material: "Material",
      careInstructions: "Care Instructions",
      shippingInfo: "Shipping Info",
      width: "Width",
      height: "Height",
      thickness: "Thickness",
      close: "Close",
      helpfulTips: "Helpful Tips",
      quality: "Premium Quality",
      durability: "Durability",
      compatibility: "Compatibility"
    },
    FR: {
      title: "Informations Produit",
      sizeGuide: "Guide des Tailles",
      dimensions: "Dimensions",
      weight: "Poids",
      pages: "Pages",
      material: "Matériau",
      careInstructions: "Instructions d'Entretien",
      shippingInfo: "Info Livraison",
      width: "Largeur",
      height: "Hauteur",
      thickness: "Épaisseur",
      close: "Fermer",
      helpfulTips: "Conseils Utiles",
      quality: "Qualité Premium",
      durability: "Durabilité",
      compatibility: "Compatibilité"
    },
    AR: {
      title: "معلومات المنتج",
      sizeGuide: "دليل المقاسات",
      dimensions: "الأبعاد",
      weight: "الوزن",
      pages: "الصفحات",
      material: "المادة",
      careInstructions: "تعليمات العناية",
      shippingInfo: "معلومات الشحن",
      width: "العرض",
      height: "الارتفاع",
      thickness: "السُمك",
      close: "إغلاق",
      helpfulTips: "نصائح مفيدة",
      quality: "جودة ممتازة",
      durability: "المتانة",
      compatibility: "التوافق"
    }
  };

  const l = labels[language as keyof typeof labels];

  const getProductHelp = (category: string) => {
    const helpData = {
      "Planners": {
        dimensions: { width: 21, height: 29.7, thickness: 2 },
        weight: 450,
        pages: 365,
        material: language === "AR" ? "ورق عالي الجودة 80 جرام" : language === "FR" ? "Papier premium 80g" : "Premium 80g paper",
        careTips: [
          language === "AR" ? "احتفظ به بعيداً عن الرطوبة والشمس المباشرة" : language === "FR" ? "Éloignez de l'humidité et de la lumière directe du soleil" : "Keep away from moisture and direct sunlight",
          language === "AR" ? "استخدم أقلاماً مناسبة للورق الخاص" : language === "FR" ? "Utilisez des stylos adaptés au papier" : "Use pens suitable for the paper type",
          language === "AR" ? "لا تستخدم الممحاة القاسية على الغلاف" : language === "FR" ? "N'utilisez pas de gommes dures sur la couverture" : "Avoid harsh erasers on the cover"
        ],
        features: [
          language === "AR" ? "تخطيط شهري وأسبوعي مفصل" : language === "FR" ? "Mise en page mensuelle et hebdomadaire détaillée" : "Detailed monthly and weekly layouts",
          language === "AR" ? "مساحة للملاحظات اليومية" : language === "FR" ? "Espace pour les notes quotidiennes" : "Space for daily notes",
          language === "AR" ? "جيوب تخزين للوثائق المهمة" : language === "FR" ? "Poches de rangement pour documents importants" : "Storage pockets for important documents"
        ]
      },
      "Notebooks": {
        dimensions: { width: 14.8, height: 21, thickness: 1.2 },
        weight: 280,
        pages: 160,
        material: language === "AR" ? "ورق نقطي 80 جرام" : language === "FR" ? "Papier pointillé 80g" : "80g dotted paper",
        careTips: [
          language === "AR" ? "لا تثني الغلاف بشدة" : language === "FR" ? "Ne pliez pas la couverture de manière excessive" : "Do not bend the cover excessively",
          language === "AR" ? "استخدم سطح مستوٍ للكتابة" : language === "FR" ? "Utilisez une surface plane pour écrire" : "Use a flat surface for writing",
          language === "AR" ? "احتفظ به في مكان بارد وجاف" : language === "FR" ? "Rangez dans un endroit frais et sec" : "Store in a cool, dry place"
        ],
        features: [
          language === "AR" ? "ورق مناسب لجميع الأقلام" : language === "FR" ? "Papier adapté à tous les stylos" : "Paper suitable for all pens",
          language === "AR" ? "تخطيط نقطي للرسم والتخطيط" : language === "FR" ? "Mise en page pointillée pour le dessin et la planification" : "Dotted layout for drawing and planning",
          language === "AR" ? "غلاف مرن يتحمل الاستخدام اليومي" : language === "FR" ? "Couverture flexible résistante à l'usage quotidien" : "Flexible cover resistant to daily use"
        ]
      },
      "Accessories": {
        dimensions: product.id === "gold-gel-pen" ? { width: 1.2, height: 14, thickness: 0.8 } : { width: 5, height: 8, thickness: 2 },
        weight: product.id === "gold-gel-pen" ? 25 : 45,
        material: product.id === "gold-gel-pen" ? (language === "AR" ? "معدن مطلي بالذهب" : language === "FR" ? "Métal plaqué or" : "Gold-plated metal") : (language === "AR" ? "بلاستيك عالي الجودة" : language === "FR" ? "Plastique haute qualité" : "Premium plastic"),
        careTips: [
          language === "AR" ? "نظف بقطعة قماش ناعمة" : language === "FR" ? "Nettoyez avec un chiffon doux" : "Clean with a soft cloth",
          language === "AR" ? "تجنب التعرض للحرارة الشديدة" : language === "FR" ? "Évitez l'exposition à la chaleur extrême" : "Avoid exposure to extreme heat",
          language === "AR" ? "لا تستخدم مواد كيميائية قاسية" : language === "FR" ? "N'utilisez pas de produits chimiques agressifs" : "Do not use harsh chemicals"
        ],
        features: [
          language === "AR" ? "تصميم أنيق وعملي" : language === "FR" ? "Design élégant et pratique" : "Elegant and practical design",
          language === "AR" ? "مواد عالية الجودة" : language === "FR" ? "Matériaux de haute qualité" : "High-quality materials",
          language === "AR" ? "سهل الاستخدام والصيانة" : language === "FR" ? "Facile à utiliser et à entretenir" : "Easy to use and maintain"
        ]
      }
    };

    return helpData[category as keyof typeof helpData] || helpData["Notebooks"];
  };

  const productHelp = getProductHelp(product.category);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            {language === "AR" ? "مساعدة" : language === "FR" ? "Aide" : "Help"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            {l.title}: {product.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dimensions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dimensions" className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              {l.sizeGuide}
            </TabsTrigger>
            <TabsTrigger value="care" className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {l.careInstructions}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              {l.shippingInfo}
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {l.quality}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dimensions" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{l.dimensions}</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{l.width}: {productHelp.dimensions.width} cm</p>
                  <p>{l.height}: {productHelp.dimensions.height} cm</p>
                  {productHelp.dimensions.thickness && (
                    <p>{l.thickness}: {productHelp.dimensions.thickness} cm</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">{l.material}</h4>
                <p className="text-sm text-muted-foreground">{productHelp.material}</p>

                {productHelp.pages && (
                  <>
                    <h4 className="font-medium text-foreground mt-4">{l.pages}</h4>
                    <p className="text-sm text-muted-foreground">{productHelp.pages}</p>
                  </>
                )}

                <h4 className="font-medium text-foreground mt-4">{l.weight}</h4>
                <p className="text-sm text-muted-foreground">{productHelp.weight}g</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="care" className="space-y-4 mt-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">{l.helpfulTips}</h4>
              <ul className="space-y-2">
                {productHelp.careTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {language === "AR" ? "شحن مجاني" : language === "FR" ? "Livraison gratuite" : "Free Shipping"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "AR" ? "على الطلبات فوق 5000 دج" : language === "FR" ? "Sur les commandes > 5000 DZD" : "On orders over 5000 DZD"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {language === "AR" ? "إرجاع مجاني" : language === "FR" ? "Retour gratuit" : "Free Returns"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === "AR" ? "سياسة إرجاع 30 يوم" : language === "FR" ? "Politique de retour 30 jours" : "30-day return policy"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">
                {language === "AR" ? "مميزات المنتج" : language === "FR" ? "Caractéristiques du produit" : "Product Features"}
              </h4>
              <ul className="space-y-2">
                {productHelp.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={() => setIsOpen(false)}>
            {l.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductHelpModal;