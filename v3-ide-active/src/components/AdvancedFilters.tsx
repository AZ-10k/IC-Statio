import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { products } from "@/data/products";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  className?: string;
}

export interface FilterState {
  brands: string[];
  materials: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  inStock: boolean;
  onSale: boolean;
}

const AdvancedFilters = ({ onFiltersChange, currentFilters, className = "" }: AdvancedFiltersProps) => {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brand: true,
    material: false,
    size: false,
    color: false,
    tags: false,
    availability: false
  });

  // Extract unique values from products
  const filterOptions = {
    brands: Array.from(new Set(products.map(p => p.brand).filter(Boolean))),
    materials: Array.from(new Set(products.map(p => p.material).filter(Boolean))),
    sizes: Array.from(new Set(products.map(p => p.size).filter(Boolean))),
    colors: Array.from(new Set(products.flatMap(p => p.color || []).filter(Boolean))),
    tags: Array.from(new Set(products.flatMap(p => p.tags || []).filter(Boolean)))
  };

  const labels = {
    EN: {
      filters: "Filters",
      clearAll: "Clear All",
      brand: "Brand",
      material: "Material",
      size: "Size",
      color: "Color",
      tags: "Tags",
      availability: "Availability",
      inStock: "In Stock Only",
      onSale: "On Sale",
      apply: "Apply Filters",
      reset: "Reset",
      selected: "selected"
    },
    FR: {
      filters: "Filtres",
      clearAll: "Tout Effacer",
      brand: "Marque",
      material: "Matériau",
      size: "Taille",
      color: "Couleur",
      tags: "Étiquettes",
      availability: "Disponibilité",
      inStock: "En Stock Seulement",
      onSale: "En Promotion",
      apply: "Appliquer les Filtres",
      reset: "Réinitialiser",
      selected: "sélectionné(s)"
    },
    AR: {
      filters: "التصفية",
      clearAll: "مسح الكل",
      brand: "العلامة التجارية",
      material: "المادة",
      size: "الحجم",
      color: "اللون",
      tags: "العلامات",
      availability: "التوفر",
      inStock: "متوفر فقط",
      onSale: "في التخفيض",
      apply: "تطبيق التصفية",
      reset: "إعادة تعيين",
      selected: "محدد"
    }
  };

  const l = labels[language as keyof typeof labels];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (type: keyof FilterState, value: string | boolean, checked?: boolean) => {
    const newFilters = { ...currentFilters };

    if (type === 'inStock' || type === 'onSale') {
      newFilters[type] = value as boolean;
    } else {
      const arrayType = type as keyof Pick<FilterState, 'brands' | 'materials' | 'sizes' | 'colors' | 'tags'>;
      if (checked) {
        if (!newFilters[arrayType].includes(value as string)) {
          newFilters[arrayType] = [...newFilters[arrayType], value as string];
        }
      } else {
        newFilters[arrayType] = newFilters[arrayType].filter(item => item !== value);
      }
    }

    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      brands: [],
      materials: [],
      sizes: [],
      colors: [],
      tags: [],
      inStock: false,
      onSale: false
    });
  };

  const getActiveFilterCount = () => {
    return (
      currentFilters.brands.length +
      currentFilters.materials.length +
      currentFilters.sizes.length +
      currentFilters.colors.length +
      currentFilters.tags.length +
      (currentFilters.inStock ? 1 : 0) +
      (currentFilters.onSale ? 1 : 0)
    );
  };

  const FilterSection = ({
    title,
    sectionKey,
    children,
    count
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
    count?: number;
  }) => (
    <Collapsible
      open={expandedSections[sectionKey]}
      onOpenChange={() => toggleSection(sectionKey)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto font-medium"
        >
          <span className="flex items-center gap-2">
            {title}
          </span>
          {expandedSections[sectionKey] ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  const CheckboxList = ({
    options,
    selected,
    onChange,
    maxItems = 5
  }: {
    options: string[];
    selected: string[];
    onChange: (value: string, checked: boolean) => void;
    maxItems?: number;
  }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedOptions = showAll ? options : options.slice(0, maxItems);

    return (
      <div className="space-y-2">
        {displayedOptions.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Checkbox
              id={`filter-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={(checked) => onChange(option, checked as boolean)}
            />
            <label
              htmlFor={`filter-${option}`}
              className="text-sm cursor-pointer flex-1"
            >
              {option}
            </label>
          </div>
        ))}
        {options.length > maxItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs h-6 px-2"
          >
            {showAll ?
              (language === "AR" ? "عرض أقل" : language === "FR" ? "Voir moins" : "Show Less") :
              (language === "AR" ? `عرض المزيد (${options.length - maxItems})` : language === "FR" ? `Voir plus (${options.length - maxItems})` : `Show More (${options.length - maxItems})`)
            }
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{l.filters}</h3>
          {getActiveFilterCount() > 0 && (
            <Badge variant="default" className="text-xs">
              {getActiveFilterCount()} {l.selected}
            </Badge>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            {l.clearAll}
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {/* Brand Filter */}
        {filterOptions.brands.length > 0 && (
          <FilterSection
            title={l.brand}
            sectionKey="brand"
            count={currentFilters.brands.length}
          >
            <CheckboxList
              options={filterOptions.brands}
              selected={currentFilters.brands}
              onChange={(value, checked) => handleFilterChange('brands', value, checked)}
            />
          </FilterSection>
        )}

        {/* Material Filter */}
        {filterOptions.materials.length > 0 && (
          <FilterSection
            title={l.material}
            sectionKey="material"
            count={currentFilters.materials.length}
          >
            <CheckboxList
              options={filterOptions.materials}
              selected={currentFilters.materials}
              onChange={(value, checked) => handleFilterChange('materials', value, checked)}
            />
          </FilterSection>
        )}

        {/* Size Filter */}
        {filterOptions.sizes.length > 0 && (
          <FilterSection
            title={l.size}
            sectionKey="size"
            count={currentFilters.sizes.length}
          >
            <CheckboxList
              options={filterOptions.sizes}
              selected={currentFilters.sizes}
              onChange={(value, checked) => handleFilterChange('sizes', value, checked)}
            />
          </FilterSection>
        )}

        {/* Color Filter */}
        {filterOptions.colors.length > 0 && (
          <FilterSection
            title={l.color}
            sectionKey="color"
            count={currentFilters.colors.length}
          >
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.colors.map((color) => (
                <div key={color} className="flex items-center gap-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={currentFilters.colors.includes(color)}
                    onCheckedChange={(checked) => handleFilterChange('colors', color, checked)}
                  />
                  <label
                    htmlFor={`color-${color}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Tags Filter */}
        {filterOptions.tags.length > 0 && (
          <FilterSection
            title={l.tags}
            sectionKey="tags"
            count={currentFilters.tags.length}
          >
            <CheckboxList
              options={filterOptions.tags}
              selected={currentFilters.tags}
              onChange={(value, checked) => handleFilterChange('tags', value, checked)}
              maxItems={8}
            />
          </FilterSection>
        )}

        {/* Availability Filter */}
        <FilterSection title={l.availability} sectionKey="availability">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="in-stock"
                checked={currentFilters.inStock}
                onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">
                {l.inStock}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="on-sale"
                checked={currentFilters.onSale}
                onCheckedChange={(checked) => handleFilterChange('onSale', checked)}
              />
              <label htmlFor="on-sale" className="text-sm cursor-pointer">
                {l.onSale}
              </label>
            </div>
          </div>
        </FilterSection>
      </div>

      <Separator className="my-4" />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="flex-1"
        >
          {l.reset}
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters;