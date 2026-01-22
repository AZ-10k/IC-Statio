import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReviewHighlightsProps {
  rating: number;
  reviewCount: number;
  featuredReview?: {
    text: string;
    author: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ReviewHighlights = ({
  rating,
  reviewCount,
  featuredReview,
  size = "sm",
  className = ""
}: ReviewHighlightsProps) => {
  const { language } = useLanguage();

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const starSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSizes[size]} ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  const labels = {
    EN: {
      reviews: "reviews",
      review: "review",
      stars: "stars"
    },
    FR: {
      reviews: "avis",
      review: "avis",
      stars: "étoiles"
    },
    AR: {
      reviews: "آراء",
      review: "رأي",
      stars: "نجوم"
    }
  };

  const l = labels[language as keyof typeof labels];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Rating and Review Count */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {renderStars(rating)}
          <span className={`font-medium text-foreground ${sizeClasses[size]}`}>
            {rating}
          </span>
        </div>
        <span className={`text-muted-foreground ${sizeClasses[size]}`}>
          ({reviewCount} {reviewCount === 1 ? l.review : l.reviews})
        </span>
      </div>

      {/* Featured Review */}
      {featuredReview && (
        <div className="bg-muted/30 rounded-md p-3 border-l-2 border-primary">
          <div className="flex items-start gap-2">
            <Quote className={`text-primary ${starSizes[size]} mt-0.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`text-foreground ${sizeClasses[size]} leading-relaxed line-clamp-3`}>
                "{featuredReview.text}"
              </p>
              <p className={`text-muted-foreground ${sizeClasses[size]} mt-1 font-medium`}>
                - {featuredReview.author}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewHighlights;