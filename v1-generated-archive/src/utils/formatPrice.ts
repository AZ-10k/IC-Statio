import { Language } from "@/contexts/LanguageContext";

type Currency = "DZD" | "EUR" | "USD";

/**
 * Formats a number with thousands separators
 * Uses space as separator for consistency
 */
const formatWithSeparators = (value: number, decimals: number = 0): string => {
  const fixed = value.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

/**
 * Central price formatting utility
 * @param price - Price in the target currency (already converted)
 * @param currency - Currency code (DZD, EUR, USD)
 * @param language - Current language (EN, FR, AR)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: Currency,
  language: Language
): string => {
  switch (currency) {
    case "EUR":
      return `€${formatWithSeparators(price, 2)}`;
    case "USD":
      return `$${formatWithSeparators(price, 2)}`;
    case "DZD":
    default:
      if (language === "AR") {
        // Use non-breaking space and LTR mark to prevent number flipping in RTL context
        const formattedPrice = formatWithSeparators(price, 0).replace(/ /g, '\u00A0');
        return `\u200E${formattedPrice} د.ج`;
      }
      return `${formatWithSeparators(price, 0)} DA`;
  }
};

/**
 * Formats a DZD price with conversion and proper formatting
 * @param priceDZD - Price in Algerian Dinars
 * @param currency - Target currency
 * @param language - Current language
 * @param rates - Exchange rates object
 * @returns Formatted price string
 */
export const formatPriceWithConversion = (
  priceDZD: number,
  currency: Currency,
  language: Language,
  rates: Record<Currency, number>
): string => {
  let convertedPrice: number;
  
  if (currency === "DZD") {
    convertedPrice = priceDZD;
  } else {
    convertedPrice = priceDZD / rates[currency];
  }
  
  return formatPrice(convertedPrice, currency, language);
};
