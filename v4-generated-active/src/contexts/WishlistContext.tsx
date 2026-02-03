import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistItem {
  productId: string;
  category: string;
  dateAdded: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  categories: string[];
  addToWishlist: (productId: string, category?: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string, category?: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCategory: (productId: string, newCategory: string) => void;
  addCategory: (categoryName: string) => void;
  removeCategory: (categoryName: string) => void;
  getWishlistByCategory: (category: string) => WishlistItem[];
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "statio-wishlist";
const WISHLIST_CATEGORIES_KEY = "statio-wishlist-categories";

const DEFAULT_CATEGORIES = [
  "Want to Buy",
  "Birthday Gifts",
  "Work Essentials",
  "Holiday Shopping",
  "Favorites"
];

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      // Migrate old format if needed
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          // Old format: array of strings
          return parsed.map((productId: string) => ({
            productId,
            category: "Want to Buy",
            dateAdded: new Date().toISOString()
          }));
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save wishlist to localStorage:", error);
      }
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save wishlist categories to localStorage:", error);
      }
    }
  }, [categories]);

  const addToWishlist = (productId: string, category: string = "Want to Buy") => {
    setWishlist(prev => {
      if (prev.some(item => item.productId === productId)) return prev;
      return [...prev, {
        productId,
        category,
        dateAdded: new Date().toISOString()
      }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.productId !== productId));
  };

  const toggleWishlist = (productId: string, category?: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId, category);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  const moveToCategory = (productId: string, newCategory: string) => {
    setWishlist(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, category: newCategory }
        : item
    ));
  };

  const addCategory = (categoryName: string) => {
    setCategories(prev => {
      if (!prev.includes(categoryName)) {
        return [...prev, categoryName];
      }
      return prev;
    });
  };

  const removeCategory = (categoryName: string) => {
    // Don't allow removing default categories
    if (DEFAULT_CATEGORIES.includes(categoryName)) return;

    setCategories(prev => prev.filter(cat => cat !== categoryName));

    // Move items from removed category to default
    setWishlist(prev => prev.map(item =>
      item.category === categoryName
        ? { ...item, category: "Want to Buy" }
        : item
    ));
  };

  const getWishlistByCategory = (category: string) => {
    return wishlist.filter(item => item.category === category);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        categories,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        moveToCategory,
        addCategory,
        removeCategory,
        getWishlistByCategory
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
