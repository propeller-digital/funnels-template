// Shopify Analytics Provider
//
// Initializes Shopify tracking cookies for the storefront.
// Works in conjunction with ShopifyPrivacyBanner for consent management.
//
// NOTE: This component no longer manages consent directly.
// Consent is handled by the ShopifyPrivacyBanner component which integrates
// with Shopify's Customer Privacy API to properly register consent.
//
// USAGE:
//   import { ShopifyAnalyticsProvider } from '@/lib/shopify-analytics-provider';
//
//   // In your layout.tsx:
//   <ShopifyAnalyticsProvider>
//     {children}
//   </ShopifyAnalyticsProvider>
//   <ShopifyPrivacyBanner />
//
// IMPORTANT: Always render ShopifyPrivacyBanner alongside this provider
// to ensure consent is properly collected and registered with Shopify.

"use client"

import { useShopifyCookies } from "@shopify/hydrogen-react"
import { SHOP_URL } from "@/lib/config"

interface ShopifyAnalyticsProviderProps {
  children: React.ReactNode
}

export function ShopifyAnalyticsProvider({
  children,
}: ShopifyAnalyticsProviderProps) {
  // Initialize Shopify cookies for analytics tracking
  // The actual consent check happens in analytics functions via isAnalyticsAllowed()
  // which queries Shopify's Customer Privacy API
  useShopifyCookies({
    hasUserConsent: true, // Consent is managed by Customer Privacy API
    checkoutDomain: SHOP_URL,
  })

  return <>{children}</>
}
