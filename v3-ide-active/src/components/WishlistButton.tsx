import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const WishlistButton = ({ productId, className, size = "md" }: WishlistButtonProps) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t } = useLanguage();
  const isFavorite = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const wasInWishlist = isInWishlist(productId);
    toggleWishlist(productId);
    
    // Show toast notification
    if (wasInWishlist) {
      toast.success(t.wishlist.removeFromWishlist, {
        duration: 2000,
      });
    } else {
      toast.success(t.wishlist.addToWishlist, {
        duration: 2000,
      });
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-200",
        "bg-background/90 backdrop-blur-sm hover:bg-background shadow-md",
        sizeClasses[size],
        className
      )}
      aria-label={isFavorite ? t.wishlist.removeFromWishlist : t.wishlist.addToWishlist}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          isFavorite
            ? "fill-primary text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
      />
    </button>
  );
};

export default WishlistButton;
