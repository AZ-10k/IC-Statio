import { useState, useEffect } from "react";

interface ExchangeRates {
  EUR: number;
  USD: number;
}

const FALLBACK_RATES: ExchangeRates = {
  EUR: 151,
  USD: 130,
};

export const useLiveCurrency = () => {
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
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
          // To convert DZD to EUR: DZD * rate = EUR
          // So to get "1 EUR = X DZD", we do 1 / rate
          const eurRate = data.rates.EUR ? 1 / data.rates.EUR : FALLBACK_RATES.EUR;
          const usdRate = data.rates.USD ? 1 / data.rates.USD : FALLBACK_RATES.USD;

          setRates({
            EUR: eurRate,
            USD: usdRate,
          });
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        // Log warnings only in development mode
        if (import.meta.env.DEV) {
          console.warn("Using fallback exchange rates:", err);
        }
        setError("Using fallback rates");
        setRates(FALLBACK_RATES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, isLoading, error };
};
