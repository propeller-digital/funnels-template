// Shopify Privacy Banner
//
// Integrates Shopify's official cookie consent banner with the Customer Privacy API.
// This component ensures consent is properly registered with Shopify for analytics
// to work correctly on headless storefronts.
//
// REQUIREMENTS:
// - Storefront Access Token (from config.ts)
// - Checkout Root Domain (your Shopify domain)
// - Storefront Root Domain (your deployed storefront domain)
//
// HOW IT WORKS:
// 1. Loads Shopify's privacy-banner script from CDN
// 2. Initializes the banner with your storefront credentials
// 3. Banner automatically shows based on user's region and privacy settings
// 4. Consent is registered directly with Shopify's Customer Privacy API
// 5. Analytics permissions (analyticsProcessingAllowed, etc.) become available
//
// USAGE:
//   import { ShopifyPrivacyBanner } from '@/lib/shopify-privacy-banner';
//
//   // In your layout.tsx:
//   <ShopifyPrivacyBanner />
//
// CHECKING PERMISSIONS:
//   import { isAnalyticsAllowed, isMarketingAllowed } from '@/lib/shopify-privacy-banner';
//
//   if (isAnalyticsAllowed()) {
//     // Safe to send analytics
//   }
//
// RE-SHOWING PREFERENCES:
//   import { showPrivacyPreferences } from '@/lib/shopify-privacy-banner';
//
//   <button onClick={showPrivacyPreferences}>Cookie Settings</button>
//
// REFERENCE: https://shopify.dev/docs/api/customer-privacy

"use client"

import Script from "next/script"
import { useEffect, useState, useCallback } from "react"
import {
  STOREFRONT_ACCESS_TOKEN,
  CHECKOUT_ROOT_DOMAIN,
  getStorefrontRootDomain,
} from "./config"

// Re-export config values for external use
export { CHECKOUT_ROOT_DOMAIN, getStorefrontRootDomain }

export function ShopifyPrivacyBanner() {
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const initBanner = useCallback(() => {
    if (typeof window === "undefined" || !window.privacyBanner) return

    const storefrontRootDomain = getStorefrontRootDomain()

    window.privacyBanner
      .loadBanner({
        storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
        checkoutRootDomain: CHECKOUT_ROOT_DOMAIN,
        storefrontRootDomain: storefrontRootDomain,
      })
      .then(() => {
        console.log("[ShopifyPrivacyBanner] Banner initialized successfully")

        // IMPORTANT: For headless storefronts, we need to explicitly register
        // consent with headless parameters. This is required even if no banner
        // is shown (e.g., user not in consent-required region).
        //
        // The Privacy Banner only calls setTrackingConsent when user interacts
        // with it. If no banner shows, we must call it ourselves to register
        // the headless storefront with Shopify.
        //
        // If user IS in consent region: they'll interact with banner which
        // will call setTrackingConsent again with their choice.
        // If user is NOT in consent region: this ensures analytics still work.
        if (
          window.Shopify?.customerPrivacy &&
          !window.Shopify.customerPrivacy.shouldShowBanner()
        ) {
          window.Shopify.customerPrivacy.setTrackingConsent(
            {
              analytics: true,
              marketing: true,
              preferences: true,
              headlessStorefront: true,
              checkoutRootDomain: CHECKOUT_ROOT_DOMAIN,
              storefrontRootDomain: storefrontRootDomain,
              storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
            },
            () => {
              console.log(
                "[ShopifyPrivacyBanner] Headless storefront registered with Shopify"
              )
            }
          )
        }

        // Always dispatch event so page components know the Privacy API is loaded
        // Analytics functions will check isAnalyticsAllowed() before sending
        window.dispatchEvent(new CustomEvent("shopify-analytics-ready"))
      })
      .catch((error) => {
        console.error(
          "[ShopifyPrivacyBanner] Failed to initialize banner:",
          error
        )
      })
  }, [])

  useEffect(() => {
    if (!scriptLoaded) return
    initBanner()
  }, [scriptLoaded, initBanner])

  return (
    <Script
      src="https://cdn.shopify.com/shopifycloud/privacy-banner/storefront-banner.js"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
      onError={(e) =>
        console.error("[ShopifyPrivacyBanner] Script failed to load:", e)
      }
    />
  )
}

// Helper to check if analytics processing is allowed
// Use this instead of custom getConsentStatus() from consent-context
//
// This combines:
// - Merchant privacy settings
// - User's geographic location
// - User's consent decision
//
// Returns true if:
// - User is not in a region requiring consent, OR
// - User is in a consent region AND has accepted analytics
export function isAnalyticsAllowed(): boolean {
  if (typeof window === "undefined") return false
  if (!window.Shopify?.customerPrivacy) {
    // API not loaded yet - default to false to be safe
    return false
  }
  return window.Shopify.customerPrivacy.analyticsProcessingAllowed()
}

// Helper to check if marketing/advertising is allowed
export function isMarketingAllowed(): boolean {
  if (typeof window === "undefined") return false
  if (!window.Shopify?.customerPrivacy) return false
  return window.Shopify.customerPrivacy.marketingAllowed()
}

// Helper to check if preferences (language, currency) tracking is allowed
export function isPreferencesAllowed(): boolean {
  if (typeof window === "undefined") return false
  if (!window.Shopify?.customerPrivacy) return false
  return window.Shopify.customerPrivacy.preferencesProcessingAllowed()
}

// Helper to check if sale of data is allowed (CCPA compliance)
export function isSaleOfDataAllowed(): boolean {
  if (typeof window === "undefined") return false
  if (!window.Shopify?.customerPrivacy) return false
  return window.Shopify.customerPrivacy.saleOfDataAllowed()
}

// Helper to re-show the preferences modal
// Use this to let users update their consent preferences
//
// USAGE:
//   import { showPrivacyPreferences } from '@/lib/shopify-privacy-banner';
//
//   // Add a "Cookie Settings" link in your footer:
//   <button onClick={showPrivacyPreferences}>Cookie Settings</button>
export async function showPrivacyPreferences(): Promise<void> {
  if (typeof window === "undefined" || !window.privacyBanner) {
    console.warn(
      "[ShopifyPrivacyBanner] Banner not loaded - cannot show preferences"
    )
    return
  }

  const storefrontRootDomain = getStorefrontRootDomain()

  await window.privacyBanner.showPreferences({
    storefrontAccessToken: STOREFRONT_ACCESS_TOKEN,
    checkoutRootDomain: CHECKOUT_ROOT_DOMAIN,
    storefrontRootDomain: storefrontRootDomain,
  })
}

// Helper to get current visitor consent status
// Returns the raw consent values as set by the user
//
// Values: 'yes' | 'no' | '' (empty = not yet decided)
export function getCurrentConsent(): {
  marketing: string
  analytics: string
  preferences: string
  sale_of_data: string
} | null {
  if (typeof window === "undefined") return null
  if (!window.Shopify?.customerPrivacy) return null
  return window.Shopify.customerPrivacy.currentVisitorConsent()
}

// Helper to check if the consent banner should be displayed
// Based on user's location and merchant settings
export function shouldShowBanner(): boolean {
  if (typeof window === "undefined") return false
  if (!window.Shopify?.customerPrivacy) return false
  return window.Shopify.customerPrivacy.shouldShowBanner()
}

// Helper to get user's detected region (ISO 3166-2 format)
// Examples: "USCA" (California), "CAON" (Ontario), "GBENG" (England)
export function getRegion(): string {
  if (typeof window === "undefined") return ""
  if (!window.Shopify?.customerPrivacy) return ""
  return window.Shopify.customerPrivacy.getRegion()
}
