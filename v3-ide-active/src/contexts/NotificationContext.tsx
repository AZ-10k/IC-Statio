import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  type: "restock" | "price-drop" | "abandoned-cart";
  productId: string;
  productName: string;
  message: string;
  date: string;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "date" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Smart features
  subscribeToRestockAlert: (productId: string, productName: string) => void;
  subscribeToPriceAlert: (productId: string, productName: string, currentPrice: number) => void;
  checkForRestockAlerts: (availableProducts: any[]) => void;
  checkForPriceDrops: (products: any[]) => void;
  triggerAbandonedCartReminder: (cartItems: any[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = "statio-notifications";
const RESTOCK_SUBSCRIPTIONS_KEY = "statio-restock-subscriptions";
const PRICE_ALERTS_KEY = "statio-price-alerts";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  }, [notifications]);

  const addNotification = (notificationData: Omit<NotificationItem, "id" | "date" | "read">) => {
    const newNotification: NotificationItem = {
      ...notificationData,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast(notificationData.message, {
      duration: 5000,
      action: {
        label: "View",
        onClick: () => markAsRead(newNotification.id),
      },
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Restock alert subscription
  const subscribeToRestockAlert = (productId: string, productName: string) => {
    try {
      const subscriptions = JSON.parse(localStorage.getItem(RESTOCK_SUBSCRIPTIONS_KEY) || "{}");
      subscriptions[productId] = { productName, subscribedAt: new Date().toISOString() };
      localStorage.setItem(RESTOCK_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));

      toast.success(`You'll be notified when ${productName} is back in stock!`);
    } catch (error) {
      console.error("Failed to subscribe to restock alert:", error);
    }
  };

  // Price alert subscription
  const subscribeToPriceAlert = (productId: string, productName: string, currentPrice: number) => {
    try {
      const alerts = JSON.parse(localStorage.getItem(PRICE_ALERTS_KEY) || "{}");
      alerts[productId] = {
        productName,
        originalPrice: currentPrice,
        subscribedAt: new Date().toISOString()
      };
      localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));

      toast.success(`You'll be notified of price drops on ${productName}!`);
    } catch (error) {
      console.error("Failed to subscribe to price alert:", error);
    }
  };

  // Check for restock alerts
  const checkForRestockAlerts = (availableProducts: any[]) => {
    try {
      const subscriptions = JSON.parse(localStorage.getItem(RESTOCK_SUBSCRIPTIONS_KEY) || "{}");

      availableProducts.forEach(product => {
        if (subscriptions[product.id] && product.stockStatus === "in-stock") {
          addNotification({
            type: "restock",
            productId: product.id,
            productName: product.name,
            message: `🎉 ${product.name} is back in stock!`,
          });

          // Remove the subscription since it's now available
          delete subscriptions[product.id];
          localStorage.setItem(RESTOCK_SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
        }
      });
    } catch (error) {
      console.error("Failed to check restock alerts:", error);
    }
  };

  // Check for price drops
  const checkForPriceDrops = (products: any[]) => {
    try {
      const alerts = JSON.parse(localStorage.getItem(PRICE_ALERTS_KEY) || "{}");

      products.forEach(product => {
        if (alerts[product.id]) {
          const originalPrice = alerts[product.id].originalPrice;
          if (product.priceDZD < originalPrice) {
            const discountPercent = Math.round(((originalPrice - product.priceDZD) / originalPrice) * 100);

            addNotification({
              type: "price-drop",
              productId: product.id,
              productName: product.name,
              message: `💰 ${product.name} is now ${discountPercent}% off!`,
              data: { discountPercent, newPrice: product.priceDZD, oldPrice: originalPrice }
            });

            // Remove the alert since price has dropped
            delete alerts[product.id];
            localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
          }
        }
      });
    } catch (error) {
      console.error("Failed to check price drops:", error);
    }
  };

  // Trigger abandoned cart reminder
  const triggerAbandonedCartReminder = (cartItems: any[]) => {
    if (cartItems.length === 0) return;

    // Only trigger if cart hasn't been modified for 24 hours
    const lastCartActivity = localStorage.getItem("statio-last-cart-activity");
    if (lastCartActivity) {
      const hoursSinceActivity = (Date.now() - new Date(lastCartActivity).getTime()) / (1000 * 60 * 60);
      if (hoursSinceActivity < 24) return;
    }

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    addNotification({
      type: "abandoned-cart",
      productId: "cart",
      productName: "Your Cart",
      message: `🛒 You have ${totalItems} item${totalItems > 1 ? 's' : ''} waiting in your cart worth ${totalValue} DZD`,
      data: { itemCount: totalItems, totalValue }
    });

    // Update last activity
    localStorage.setItem("statio-last-cart-activity", new Date().toISOString());
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        subscribeToRestockAlert,
        subscribeToPriceAlert,
        checkForRestockAlerts,
        checkForPriceDrops,
        triggerAbandonedCartReminder,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};