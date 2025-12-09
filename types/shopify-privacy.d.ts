// Shopify Customer Privacy API Type Declarations
//
// These types define the global window.Shopify.customerPrivacy API
// and the privacyBanner API loaded from Shopify's CDN.
//
// The Customer Privacy API is used to:
// - Check data processing permissions (analyticsProcessingAllowed, marketingAllowed, etc.)
// - Register consent with Shopify for headless storefronts
// - Manage cookie consent banners
//
// REFERENCE: https://shopify.dev/docs/api/customer-privacy

interface ShopifyCustomerPrivacy {
  // Permission check methods - combine merchant settings, user location, and consent
  analyticsProcessingAllowed(): boolean
  marketingAllowed(): boolean
  preferencesProcessingAllowed(): boolean
  saleOfDataAllowed(): boolean

  // Consent state methods
  currentVisitorConsent(): {
    marketing: string // 'yes' | 'no' | '' (empty = undeclared)
    analytics: string
    preferences: string
    sale_of_data: string
  }

  // Check if banner should be displayed
  shouldShowBanner(): boolean

  // Check if visitor is in a data sale opt-out region (e.g., California)
  saleOfDataRegion(): boolean

  // Get detected geolocation (ISO 3166-2 format, e.g., "USCA" for California)
  getRegion(): string

  // Get consent ID for audit purposes
  consentId(): string

  // Register consent - REQUIRED for headless storefronts
  setTrackingConsent(
    options: {
      analytics?: boolean
      marketing?: boolean
      preferences?: boolean
      sale_of_data?: boolean
      headlessStorefront?: boolean
      checkoutRootDomain?: string
      storefrontRootDomain?: string
      storefrontAccessToken?: string
      metafields?: Array<{ key: string; value: string | null }>
    },
    callback: () => void
  ): void

  // Get custom metafield value
  getTrackingConsentMetafield(key: string): string | null
}

interface PrivacyBanner {
  // Load and display the privacy banner
  loadBanner(options: {
    storefrontAccessToken: string
    checkoutRootDomain: string
    storefrontRootDomain: string
    locale?: string
    country?: string
  }): Promise<void>

  // Re-show the preferences modal for users to update consent
  showPreferences(options: {
    storefrontAccessToken: string
    checkoutRootDomain: string
    storefrontRootDomain: string
    locale?: string
    country?: string
  }): Promise<void>
}

declare global {
  interface Window {
    Shopify?: {
      customerPrivacy?: ShopifyCustomerPrivacy
      loadFeatures?(
        features: Array<{ name: string; version: string }>,
        callback: (error: Error | null) => void
      ): void
    }
    privacyBanner?: PrivacyBanner
  }
}

export {}
