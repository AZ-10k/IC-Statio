import { Check, ShoppingCart, User, Truck, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: number;
  orderConfirmed?: boolean;
}

const CheckoutProgress = ({ currentStep, orderConfirmed = false }: CheckoutProgressProps) => {
  const { language, isRTL } = useLanguage();

  const steps = {
    EN: [
      { label: "Cart", icon: ShoppingCart },
      { label: "Details", icon: User },
      { label: "Success", icon: CheckCircle },
    ],
    FR: [
      { label: "Panier", icon: ShoppingCart },
      { label: "Détails", icon: User },
      { label: "Succès", icon: CheckCircle },
    ],
    AR: [
      { label: "السلة", icon: ShoppingCart },
      { label: "التفاصيل", icon: User },
      { label: "تم التأكيد", icon: CheckCircle },
    ],
  };

  const currentSteps = steps[language] || steps.EN;
  // Reverse steps array for RTL languages so they display right-to-left
  const displaySteps = isRTL ? [...currentSteps].reverse() : currentSteps;

  return (
    <div className="w-full mb-8">
      <div className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
        {displaySteps.map((step, originalIndex) => {
          const StepIcon = step.icon;
          // Calculate original index position for step logic (RTL: 2,1,0 -> LTR: 0,1,2)
          const index = isRTL ? currentSteps.length - 1 - originalIndex : originalIndex;
          const stepNumber = index + 1;
          const isCompleted = orderConfirmed ? stepNumber <= currentSteps.length : stepNumber < currentStep;
          const isCurrent = !orderConfirmed && stepNumber === currentStep;

          return (
            <div key={originalIndex} className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {originalIndex < displaySteps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-12 md:w-20 mx-1 sm:mx-2 transition-all duration-300",
                    stepNumber < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;
