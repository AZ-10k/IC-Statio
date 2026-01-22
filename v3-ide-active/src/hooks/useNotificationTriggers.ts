import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { products } from "@/data/products";

export const useNotificationTriggers = () => {
  const { items: cartItems } = useCart();
  const { checkForRestockAlerts, checkForPriceDrops, triggerAbandonedCartReminder } = useNotifications();

  // Check for restock alerts when component mounts and periodically
  useEffect(() => {
    const checkRestocks = () => {
      const availableProducts = products.filter(p => p.stockStatus === "in-stock");
      checkForRestockAlerts(availableProducts);
    };

    // Check immediately and then every 5 minutes
    checkRestocks();
    const restockInterval = setInterval(checkRestocks, 5 * 60 * 1000);

    return () => clearInterval(restockInterval);
  }, [checkForRestockAlerts]);

  // Check for price drops periodically
  useEffect(() => {
    const checkPriceDrops = () => {
      checkForPriceDrops(products);
    };

    // Check every 10 minutes (price changes are less frequent)
    const priceInterval = setInterval(checkPriceDrops, 10 * 60 * 1000);

    return () => clearInterval(priceInterval);
  }, [checkForPriceDrops]);

  // Check for abandoned cart reminders
  useEffect(() => {
    if (cartItems.length === 0) return;

    const checkAbandonedCart = () => {
      triggerAbandonedCartReminder(cartItems);
    };

    // Check after 30 seconds initially, then every hour
    const initialTimeout = setTimeout(checkAbandonedCart, 30 * 1000);
    const cartInterval = setInterval(checkAbandonedCart, 60 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(cartInterval);
    };
  }, [cartItems, triggerAbandonedCartReminder]);
};