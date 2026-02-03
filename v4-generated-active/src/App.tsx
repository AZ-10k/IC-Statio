import React, { Suspense, useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { UserContentProvider } from "@/contexts/UserContentContext";
import { OrderProvider } from "@/contexts/OrderContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
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

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  // 🛡️ THE NUCLEAR SCROLL FIX & LAYOUT CLEANUP
  useLayoutEffect(() => {
    // 1. Prevent the browser from trying to "jump" to old scroll positions
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Global Sanity Reset: Force body and html to be scrollable.
    // This wipes away any "overflow: hidden" left behind by closed drawers/modals.
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.position = "static";
    document.body.style.height = "auto";
    document.body.style.pointerEvents = "auto";

    // 3. Reset scroll to top exactly once per route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <TopBar />
      <Navbar />
      
      <Suspense fallback={
        <div className="h-[60vh] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        <Routes location={location} key={location.key}>
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