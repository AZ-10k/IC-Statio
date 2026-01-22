import { useState } from "react";
import { Ruler, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface SizeGuideProps {
  productType: "notebook" | "planner" | "accessory";
  dimensions?: {
    width: number;
    height: number;
    thickness?: number;
  };
  className?: string;
}

const SizeGuide = ({ productType, dimensions, className = "" }: SizeGuideProps) => {
  const { language } = useLanguage();
  const [showPreview, setShowPreview] = useState(true);

  const labels = {
    EN: {
      title: "Size Guide",
      dimensions: "Dimensions",
      width: "Width",
      height: "Height",
      thickness: "Thickness",
      preview: "Size Preview",
      hidePreview: "Hide Preview",
      showPreview: "Show Preview",
      perfectFor: "Perfect for",
      carrying: "Easy to carry",
      writing: "Comfortable writing",
      storage: "Good for storage"
    },
    FR: {
      title: "Guide des Tailles",
      dimensions: "Dimensions",
      width: "Largeur",
      height: "Hauteur",
      thickness: "Épaisseur",
      preview: "Aperçu des Dimensions",
      hidePreview: "Masquer l'Aperçu",
      showPreview: "Afficher l'Aperçu",
      perfectFor: "Parfait pour",
      carrying: "Facile à transporter",
      writing: "Écriture confortable",
      storage: "Bon pour le stockage"
    },
    AR: {
      title: "دليل المقاسات",
      dimensions: "الأبعاد",
      width: "العرض",
      height: "الارتفاع",
      thickness: "السُمك",
      preview: "معاينة المقاس",
      hidePreview: "إخفاء المعاينة",
      showPreview: "إظهار المعاينة",
      perfectFor: "مثالي لـ",
      carrying: "سهل الحمل",
      writing: "كتابة مريحة",
      storage: "جيد للتخزين"
    }
  };

  const l = labels[language as keyof typeof labels];

  // Default dimensions based on product type
  const defaultDimensions = {
    notebook: { width: 14.8, height: 21, thickness: 1.2 },
    planner: { width: 21, height: 29.7, thickness: 2 },
    accessory: { width: 5, height: 8, thickness: 2 }
  };

  const productDimensions = dimensions || defaultDimensions[productType];

  const getSizeDescription = (type: string) => {
    const descriptions = {
      EN: {
        notebook: "Standard A5 size, perfect for everyday note-taking",
        planner: "A4 size for detailed planning and organization",
        accessory: "Compact size for easy storage and portability"
      },
      FR: {
        notebook: "Taille A5 standard, parfaite pour les notes quotidiennes",
        planner: "Taille A4 pour une planification détaillée",
        accessory: "Taille compacte pour un stockage facile"
      },
      AR: {
        notebook: "حجم A5 قياسي، مثالي لتدوين الملاحظات اليومية",
        planner: "حجم A4 للتخطيط والتنظيم التفصيلي",
        accessory: "حجم صغير للتخزين والحمل السهل"
      }
    };

    return descriptions[language as keyof typeof descriptions][type as keyof typeof descriptions.EN] || descriptions.EN[type as keyof typeof descriptions.EN];
  };

  const getPerfectFor = (type: string) => {
    const perfectFor = {
      notebook: [l.writing, l.carrying, "Bullet journaling"],
      planner: ["Weekly planning", "Project management", l.storage],
      accessory: [l.carrying, "Desk organization", "Travel"]
    };

    return perfectFor[type as keyof typeof perfectFor] || perfectFor.notebook;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Ruler className="w-4 h-4 mr-2" />
          {l.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            {l.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-foreground mb-3">{l.dimensions}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm text-muted-foreground">{l.width}:</span>
                  <span className="font-medium">{productDimensions.width} cm</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm text-muted-foreground">{l.height}:</span>
                  <span className="font-medium">{productDimensions.height} cm</span>
                </div>
                {productDimensions.thickness && (
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm text-muted-foreground">{l.thickness}:</span>
                    <span className="font-medium">{productDimensions.thickness} cm</span>
                  </div>
                )}
              </div>
            </div>

            {/* Size Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">{l.preview}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {showPreview && (
                <div className="flex justify-center">
                  <div
                    className="bg-muted/30 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center text-muted-foreground text-sm"
                    style={{
                      width: `${Math.min(productDimensions.width * 2, 120)}px`,
                      height: `${Math.min(productDimensions.height * 2, 160)}px`,
                      minWidth: '80px',
                      minHeight: '100px'
                    }}
                  >
                    {productDimensions.width} × {productDimensions.height} cm
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Size Description */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {getSizeDescription(productType)}
            </p>
          </div>

          {/* Perfect For */}
          <div>
            <h3 className="font-medium text-foreground mb-3">{l.perfectFor}:</h3>
            <div className="flex flex-wrap gap-2">
              {getPerfectFor(productType).map((item, index) => (
                <Badge key={index} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Size Comparison */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">
              {language === "AR" ? "مقارنة الأحجام" : language === "FR" ? "Comparaison des tailles" : "Size Comparison"}
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• A4: 21 × 29.7 cm ({language === "AR" ? "ورق عادي" : language === "FR" ? "papier standard" : "standard paper"})</p>
              <p>• A5: 14.8 × 21 cm ({language === "AR" ? "نصف ورق" : language === "FR" ? "demi-feuille" : "half sheet"})</p>
              <p>• A6: 10.5 × 14.8 cm ({language === "AR" ? "جيب صغير" : language === "FR" ? "pochette" : "pocket size"})</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;