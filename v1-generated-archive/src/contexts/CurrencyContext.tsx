import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { formatPriceWithConversion } from "@/utils/formatPrice";

type Currency = "DZD" | "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceDZD: number) => string;
  formatPrice: (priceDZD: number) => string;
  isLoading: boolean;
  rates: Record<Currency, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fallback rates (Critical safety fallback)
const FALLBACK_RATES: Record<Currency, number> = {
  DZD: 1,
  EUR: 151, // 1 EUR = 151 DZD
  USD: 130, // 1 USD = 130 DZD
};

const RATES_CACHE_KEY = "currency-rates-cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CachedRates {
  rates: Record<Currency, number>;
  timestamp: number;
}

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("preferred-currency");
        return (saved as Currency) || "DZD";
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Failed to load currency from localStorage:", error);
        }
        return "DZD";
      }
    }
    return "DZD";
  });
  const [rates, setRates] = useState<Record<Currency, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(RATES_CACHE_KEY);
        if (cached) {
          const parsed: CachedRates = JSON.parse(cached);
          const now = Date.now();
          if (now - parsed.timestamp < CACHE_DURATION) {
            return parsed.rates;
          }
        }
      } catch {
        // Ignore cache errors, will fetch fresh rates
      }
    }
    return FALLBACK_RATES;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Persist currency to localStorage
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("preferred-currency", newCurrency);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Failed to save currency to localStorage:", error);
      }
    }
  };

  useEffect(() => {
    const fetchRates = async () => {
      // Check cache first
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(RATES_CACHE_KEY);
          if (cached) {
            const parsed: CachedRates = JSON.parse(cached);
            const now = Date.now();
            if (now - parsed.timestamp < CACHE_DURATION) {
              setRates(parsed.rates);
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // Continue to fetch if cache is invalid
        }
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(
          "https://open.er-api.com/v6/latest/DZD",
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }

        const data = await response.json();

        if (data.result === "success" && data.rates) {
          // API gives value of 1 DZD in other currencies
          // To get "1 EUR = X DZD", we do 1 / rate
          const eurRate = data.rates.EUR ? 1 / data.rates.EUR : FALLBACK_RATES.EUR;
          const usdRate = data.rates.USD ? 1 / data.rates.USD : FALLBACK_RATES.USD;

          const newRates: Record<Currency, number> = {
            DZD: 1,
            EUR: eurRate,
            USD: usdRate,
          };

          setRates(newRates);

          // Cache the rates
          if (typeof window !== "undefined") {
            try {
              const cache: CachedRates = {
                rates: newRates,
                timestamp: Date.now(),
              };
              localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(cache));
            } catch {
              // Ignore cache errors
            }
          }
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        // Log warnings only in development mode
        if (import.meta.env.DEV) {
          console.warn("Using fallback exchange rates:", err);
        }
        setRates(FALLBACK_RATES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertPrice = (priceDZD: number): string => {
    if (currency === "DZD") {
      return priceDZD.toFixed(0);
    }
    const converted = priceDZD / rates[currency];
    return converted.toFixed(2);
  };

  // This wrapper uses the formatPriceWithConversion utility with a default language
  // Components should use useFormattedPrice hook for proper language support
  const formatPriceWrapper = (priceDZD: number): string => {
    // Use "EN" as default since we can't access language context here
    // For proper RTL support, components should use useFormattedPrice instead
    return formatPriceWithConversion(priceDZD, currency, "EN", rates);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice: formatPriceWrapper, isLoading, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Custom hook that combines currency and language for proper formatting
export const useFormattedPrice = () => {
  const { currency, rates } = useCurrency();
  const { language } = useLanguage();
  
  return (priceDZD: number): string => {
    return formatPriceWithConversion(priceDZD, currency, language, rates);
  };
};
