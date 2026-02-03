import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopLoadingBar from "@/components/TopLoadingBar";
import TopBar from "@/components/TopBar";
import SkipToMainContent from "@/components/SkipToMainContent";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationTriggers } from "@/hooks/useNotificationTriggers";

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

export default function MainLayout() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useNotificationTriggers();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <TopLoadingBar isAnimating={isNavigating} />
      <SkipToMainContent />
      <Toaster />
      <Sonner />
      <TopBar />

      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
