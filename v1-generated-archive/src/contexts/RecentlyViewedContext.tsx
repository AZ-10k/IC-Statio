import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, getProductById } from "@/data/products";

interface RecentlyViewedContextType {
  viewedProducts: Product[];
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  removeFromRecentlyViewed: (productId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const RECENTLY_VIEWED_STORAGE_KEY = "statio-recently-viewed";
const MAX_RECENTLY_VIEWED = 10;

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [viewedProductIds, setViewedProductIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to load recently viewed from localStorage:", error);
        }
        return [];
      }
    }
    return [];
  });

  // Get full product objects from IDs
  const viewedProducts = viewedProductIds
    .map(id => getProductById(id))
    .filter(Boolean) as Product[];

  const addToRecentlyViewed = (productId: string) => {
    setViewedProductIds(prev => {
      // Remove if already exists, then add to front
      const filtered = prev.filter(id => id !== productId);
      const updated = [productId, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      return updated;
    });
  };

  const removeFromRecentlyViewed = (productId: string) => {
    setViewedProductIds(prev => prev.filter(id => id !== productId));
  };

  const clearRecentlyViewed = () => {
    setViewedProductIds([]);
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(viewedProductIds));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save recently viewed to localStorage:", error);
      }
    }
  }, [viewedProductIds]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        viewedProducts,
        addToRecentlyViewed,
        clearRecentlyViewed,
        removeFromRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
};