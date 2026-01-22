import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { UserContentProvider } from "@/contexts/UserContentContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { useNotificationTriggers } from "@/hooks/useNotificationTriggers";
import ScrollToTop from "@/components/ScrollToTop";
import TopBar from "@/components/TopBar";
import { Skeleton } from "@/components/ui/skeleton";
import Index from "./pages/Index";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import {
  LazyShop,
  LazyProductDetail,
  LazyShippingTerms,
  LazyCheckout,
  LazyAbout,
  LazyContact,
  LazyTerms,
  LazyPrivacy,
  LazyFAQ,
  LazyNotFound,
} from "@/components/LazyRoutes";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-8">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full mt-4" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize notification triggers
  useNotificationTriggers();

  return (
    <>
      <Toaster />
      <Sonner />
      <TopBar />
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<LazyShop />} />
          <Route path="/product/:id" element={<LazyProductDetail />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="/shipping-terms" element={<LazyShippingTerms />} />
          <Route path="/checkout" element={<LazyCheckout />} />
          <Route path="/about" element={<LazyAbout />} />
          <Route path="/contact" element={<LazyContact />} />
          <Route path="/terms" element={<LazyTerms />} />
          <Route path="/privacy" element={<LazyPrivacy />} />
          <Route path="/faq" element={<LazyFAQ />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<LazyNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OrderProvider>
      <UserContentProvider>
        <NotificationProvider>
          <ComparisonProvider>
            <RecentlyViewedProvider>
              <WishlistProvider>
                <CartProvider>
                  <TooltipProvider>
                    <AppContent />
                  </TooltipProvider>
                </CartProvider>
              </WishlistProvider>
            </RecentlyViewedProvider>
          </ComparisonProvider>
        </NotificationProvider>
      </UserContentProvider>
    </OrderProvider>
  </QueryClientProvider>
);

export default App;
