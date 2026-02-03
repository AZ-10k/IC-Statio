import { Slider } from "@/components/ui/slider";
import { useFormattedPrice } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeSlider = ({ min, max, value, onChange }: PriceRangeSliderProps) => {
  const formatPrice = useFormattedPrice();
  const { isRTL } = useLanguage();

  const handleChange = (newValue: number[]) => {
    onChange([newValue[0], newValue[1]]);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {isRTL ? "نطاق السعر" : "Price Range"}
        </span>
        <span className="text-foreground font-medium">
          {formatPrice(value[0])} - {formatPrice(value[1])}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={100}
        value={value}
        onValueChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

export default PriceRangeSlider;
