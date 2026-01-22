import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const StarRating = ({ 
  rating, 
  reviewCount, 
  showCount = true, 
  size = "sm",
  className 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = rating > star - 1 && rating < star;
          const percentage = partial ? ((rating - (star - 1)) * 100) : 0;

          return (
            <div key={star} className="relative">
              {partial ? (
                <>
                  <Star className={cn(sizeClasses[size], "text-muted-foreground/30")} />
                  <div 
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${percentage}%` }}
                  >
                    <Star className={cn(sizeClasses[size], "text-amber-400 fill-amber-400")} />
                  </div>
                </>
              ) : (
                <Star 
                  className={cn(
                    sizeClasses[size],
                    filled 
                      ? "text-amber-400 fill-amber-400" 
                      : "text-muted-foreground/30"
                  )} 
                />
              )}
            </div>
          );
        })}
      </div>
      
      {showCount && reviewCount !== undefined && (
        <span className={cn("text-muted-foreground font-medium", textSizes[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;
