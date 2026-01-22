import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, getProductById } from "@/data/products";

interface ComparisonContextType {
  comparedProducts: Product[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  maxComparisons: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const COMPARISON_STORAGE_KEY = "statio-product-comparison";
const MAX_COMPARISONS = 4;

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [comparedProductIds, setComparedProductIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(COMPARISON_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to load comparison from localStorage:", error);
        }
        return [];
      }
    }
    return [];
  });

  // Get full product objects from IDs
  const comparedProducts = comparedProductIds
    .map(id => getProductById(id))
    .filter(Boolean) as Product[];

  const addToComparison = (productId: string) => {
    setComparedProductIds(prev => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= MAX_COMPARISONS) return prev;
      return [...prev, productId];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparedProductIds(prev => prev.filter(id => id !== productId));
  };

  const clearComparison = () => {
    setComparedProductIds([]);
  };

  const isInComparison = (productId: string) => {
    return comparedProductIds.includes(productId);
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparedProductIds));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save comparison to localStorage:", error);
      }
    }
  }, [comparedProductIds]);

  return (
    <ComparisonContext.Provider
      value={{
        comparedProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        maxComparisons: MAX_COMPARISONS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
};