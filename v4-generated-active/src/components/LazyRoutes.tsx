import { lazy } from "react";

export const LazyShop = lazy(() => import("@/pages/Shop"));
export const LazyProductDetail = lazy(() => import("@/pages/ProductDetail"));
export const LazyShippingTerms = lazy(() => import("@/pages/ShippingTerms"));
export const LazyCheckout = lazy(() => import("@/pages/Checkout"));
export const LazyAbout = lazy(() => import("@/pages/About"));
export const LazyContact = lazy(() => import("@/pages/Contact"));
export const LazyTerms = lazy(() => import("@/pages/Terms"));
export const LazyPrivacy = lazy(() => import("@/pages/Privacy"));
export const LazyFAQ = lazy(() => import("@/pages/FAQ"));
export const LazyNotFound = lazy(() => import("@/pages/NotFound"));
