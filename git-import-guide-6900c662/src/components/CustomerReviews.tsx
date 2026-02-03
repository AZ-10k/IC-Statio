import { Star, Quote, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
}

interface CustomerReviewsProps {
  reviews: Review[];
  showTitle?: boolean;
  maxReviews?: number;
  className?: string;
}

// Sample reviews data - in a real app, this would come from an API
const sampleReviews: Review[] = [
  {
    id: "1",
    customerName: "Sarah M.",
    rating: 5,
    comment: "Absolutely love this planner! The paper quality is exceptional and the layout is perfect for my busy schedule. Highly recommend!",
    date: "2024-01-15",
    verified: true,
    helpful: 12
  },
  {
    id: "2",
    customerName: "Ahmed K.",
    rating: 5,
    comment: "Beautiful craftsmanship. The attention to detail is amazing. This notebook has become my daily companion.",
    date: "2024-01-10",
    verified: true,
    helpful: 8
  },
  {
    id: "3",
    customerName: "Leila B.",
    rating: 4,
    comment: "Great quality and fast shipping. The design is elegant and practical. Will definitely order again.",
    date: "2024-01-08",
    verified: true,
    helpful: 15
  },
  {
    id: "4",
    customerName: "Mohamed T.",
    rating: 5,
    comment: "Perfect gift for stationery lovers. The packaging was beautiful and the product exceeded expectations.",
    date: "2024-01-05",
    verified: true,
    helpful: 6
  }
];

const CustomerReviews = ({
  reviews = sampleReviews,
  showTitle = true,
  maxReviews = 3,
  className = ""
}: CustomerReviewsProps) => {
  const { language } = useLanguage();

  const labels = {
    EN: {
      title: "Customer Reviews",
      verified: "Verified Purchase",
      helpful: "helpful",
      stars: "stars"
    },
    FR: {
      title: "Avis Clients",
      verified: "Achat Vérifié",
      helpful: "utile",
      stars: "étoiles"
    },
    AR: {
      title: "آراء العملاء",
      verified: "شراء موثق",
      helpful: "مفيد",
      stars: "نجوم"
    }
  };

  const l = labels[language as keyof typeof labels];
  const displayReviews = reviews.slice(0, maxReviews);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "AR" ? "ar-DZ" : language === "FR" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">{l.title}</h3>
        </div>
      )}

      <div className="grid gap-4">
        {displayReviews.map((review) => (
          <div
            key={review.id}
            className="bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{review.customerName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(review.date)}</span>
                    {review.verified && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 dark:text-green-400">{l.verified}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-muted-foreground ml-1">
                  {review.rating}
                </span>
              </div>
            </div>

            {/* Comment */}
            <blockquote className="text-foreground leading-relaxed mb-3">
              "{review.comment}"
            </blockquote>

            {/* Footer */}
            {review.helpful && review.helpful > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{review.helpful} {l.helpful}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more link */}
      {reviews.length > maxReviews && (
        <div className="text-center pt-4">
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            {language === "AR" ? "عرض جميع الآراء" : language === "FR" ? "Voir tous les avis" : "View all reviews"} ({reviews.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;