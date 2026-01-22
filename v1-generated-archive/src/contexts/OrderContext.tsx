import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderDetails {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerSecondaryPhone?: string;
  shippingAddress: string;
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

interface OrderContextType {
  currentOrder: OrderDetails | null;
  createOrder: (orderData: Omit<OrderDetails, "id" | "status" | "orderDate">) => void;
  getOrderStatus: (orderId: string) => OrderDetails | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "statio-orders";

// Sample order data for demo
const SAMPLE_ORDERS: OrderDetails[] = [
  {
    id: "ORD-2024-001",
    items: [
      { id: "2026-daily-planner", name: "2026 Executive Planner", price: 6525, image: "/api/placeholder/100/100", quantity: 1 },
      { id: "gold-gel-pen", name: "Gold Gel Pen", price: 2610, image: "/api/placeholder/100/100", quantity: 2 }
    ],
    subtotal: 11750,
    shipping: 500,
    total: 12250,
    status: "delivered",
    customerName: "Ahmed K.",
    customerPhone: "+213-555-0123",
    customerEmail: "ahmed@example.com",
    shippingAddress: "123 Main St, Algiers, Algeria",
    paymentMethod: "Cash on Delivery",
    orderDate: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "TRK-2024-001-ALG"
  },
  {
    id: "ORD-2024-002",
    items: [
      { id: "marble-notebook", name: "Marble Notebook", price: 4060, image: "/api/placeholder/100/100", quantity: 1 }
    ],
    subtotal: 4060,
    shipping: 300,
    total: 4360,
    status: "shipped",
    customerName: "Sarah M.",
    customerPhone: "+213-555-0456",
    shippingAddress: "456 Oak Ave, Oran, Algeria",
    paymentMethod: "Cash on Delivery",
    orderDate: "2024-01-18T14:20:00Z",
    estimatedDelivery: "2024-01-23",
    trackingNumber: "TRK-2024-002-ORN"
  }
];

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(() => {
    try {
      const stored = localStorage.getItem("statio-current-order");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Auto-update order statuses for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders =>
        prevOrders.map(order => {
          // Simulate status progression
          const statusProgression: OrderStatus[] = [
            "pending", "confirmed", "processing", "shipped", "out-for-delivery", "delivered"
          ];
          const currentIndex = statusProgression.indexOf(order.status);

          // Only progress if not delivered or cancelled
          if (currentIndex < statusProgression.length - 1 && Math.random() < 0.1) {
            const newStatus = statusProgression[currentIndex + 1];
            // Add tracking number when shipped
            if (newStatus === "shipped" && !order.trackingNumber) {
              return {
                ...order,
                status: newStatus,
                trackingNumber: `TRK-${order.id.split('-').pop()}-ALG`
              };
            }
            return { ...order, status: newStatus };
          }

          return order;
        })
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, [orders]);

  // Save current order to localStorage
  useEffect(() => {
    try {
      if (currentOrder) {
        localStorage.setItem("statio-current-order", JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem("statio-current-order");
      }
    } catch (error) {
      console.error("Failed to save current order:", error);
    }
  }, [currentOrder]);

  const createOrder = (orderData: Omit<OrderDetails, "id" | "status" | "orderDate">) => {
    const newOrder: OrderDetails = {
      ...orderData,
      id: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    setOrders(prev => [...prev, newOrder]);
    setCurrentOrder(newOrder);
  };

  const getOrderStatus = (orderId: string) => {
    return orders.find(order => order.id === orderId) || null;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        createOrder,
        getOrderStatus,
        updateOrderStatus,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};