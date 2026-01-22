import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

// Sample reviews (in production, these would come from a database)
const sampleReviews: Review[] = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    comment: "Absolutely love the quality! The planner is beautiful and well-made.",
    date: "2024-01-10",
  },
  {
    id: "2",
    name: "Amina K.",
    rating: 4,
    comment: "Great product, fast delivery. Very happy with my purchase.",
    date: "2024-01-08",
  },
  {
    id: "3",
    name: "Fatima B.",
    rating: 5,
    comment: "Perfect for organizing my daily tasks. Highly recommend!",
    date: "2024-01-05",
  },
];

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { language, isRTL } = useLanguage();
  const [reviews] = useState<Review[]>(sampleReviews);
  const [newReview, setNewReview] = useState({ name: "", comment: "", rating: 0 });
  const [hoveredRating, setHoveredRating] = useState(0);

  const labels = {
    EN: {
      reviews: "Customer Reviews",
      writeReview: "Write a Review",
      name: "Your Name",
      comment: "Your Review",
      submit: "Submit Review",
      averageRating: "Average Rating",
      basedOn: "based on",
      reviewsCount: "reviews",
      thankYou: "Thank you for your review!",
      fillAll: "Please fill in all fields and select a rating",
    },
    FR: {
      reviews: "Avis Clients",
      writeReview: "Écrire un Avis",
      name: "Votre Nom",
      comment: "Votre Avis",
      submit: "Soumettre",
      averageRating: "Note Moyenne",
      basedOn: "basé sur",
      reviewsCount: "avis",
      thankYou: "Merci pour votre avis!",
      fillAll: "Veuillez remplir tous les champs et sélectionner une note",
    },
    AR: {
      reviews: "آراء العملاء",
      writeReview: "اكتب تقييماً",
      name: "اسمك",
      comment: "تقييمك",
      submit: "إرسال",
      averageRating: "التقييم المتوسط",
      basedOn: "بناءً على",
      reviewsCount: "تقييمات",
      thankYou: "شكراً لتقييمك!",
      fillAll: "يرجى ملء جميع الحقول واختيار تقييم",
    },
  };

  const t = labels[language];

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      toast.error(t.fillAll);
      return;
    }
    // In production, this would send to a backend
    toast.success(t.thankYou);
    setNewReview({ name: "", comment: "", rating: 0 });
  };

  const StarRating = ({ rating, interactive = false, size = "md" }: { 
    rating: number; 
    interactive?: boolean; 
    size?: "sm" | "md" | "lg" 
  }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setNewReview(prev => ({ ...prev, rating: star }))}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                (interactive ? (hoveredRating || newReview.rating) : rating) >= star
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Average Rating Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-primary mb-2">{t.reviews}</h3>
          <div className="flex items-center gap-3">
            <StarRating rating={averageRating} size="lg" />
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">
              ({t.basedOn} {reviews.length} {t.reviewsCount})
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">{review.name}</span>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-foreground">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Write Review Form */}
      <div className="border-t border-border pt-6">
        <h4 className="font-medium text-lg mb-4">{t.writeReview}</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{t.averageRating}:</span>
            <StarRating rating={newReview.rating} interactive size="lg" />
          </div>
          <Input
            placeholder={t.name}
            value={newReview.name}
            onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
            className="bg-background"
          />
          <Textarea
            placeholder={t.comment}
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="bg-background min-h-[100px]"
          />
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.submit}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductReviews;