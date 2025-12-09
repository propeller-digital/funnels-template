// Shopify Analytics Utilities
//
// This file provides functions to send analytics events to Shopify
// using hydrogen-react's sendShopifyAnalytics and getClientBrowserParameters.
// All analytics are consent-aware and will not fire without user consent.
//
// IMPORTANT: Analytics check consent via Shopify's Customer Privacy API.
// The ShopifyPrivacyBanner component must be rendered to enable consent collection.

import {
  AnalyticsEventName,
  AnalyticsPageType,
  ShopifySalesChannel,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  type ShopifyAnalyticsProduct,
  type ShopifyPageViewPayload,
} from "@shopify/hydrogen-react";
import { SHOP_ID, SHOP_URL, STOREFRONT_ID } from "./config";
import {
  isAnalyticsAllowed,
  isMarketingAllowed,
} from "./shopify-privacy-banner";

// Type for page type values from AnalyticsPageType constant
type PageType = (typeof AnalyticsPageType)[keyof typeof AnalyticsPageType];

// Base shop analytics configuration (consent flags added dynamically)
const baseShopAnalytics = {
  shopId: SHOP_ID,
  storefrontId: STOREFRONT_ID,
  hydrogenSubchannelId: undefined,
  shopifySalesChannel: ShopifySalesChannel.headless,
  currency: "USD" as const,
  acceptedLanguage: "EN" as const,
};

// Get consent flags based on Shopify Customer Privacy API
// These values are determined by Shopify based on:
// - Merchant privacy settings
// - User's geographic location
// - User's consent decision (via Privacy Banner)
function getConsentFlags() {
  return {
    hasUserConsent: isAnalyticsAllowed(),
    analyticsAllowed: isAnalyticsAllowed(),
    marketingAllowed: isMarketingAllowed(),
    saleOfDataAllowed: false, // Usually false for CCPA compliance
  };
}

// Send PAGE_VIEW analytics event
// pageType - Type of page from AnalyticsPageType (home, product, cart, etc.)
// extra - Optional additional payload data
export async function sendPageViewAnalytics(
  pageType: PageType = AnalyticsPageType.page,
  extra?: Partial<ShopifyPageViewPayload>
) {
  if (typeof window === "undefined") return;

  // Check consent via Shopify Customer Privacy API
  if (!isAnalyticsAllowed()) return;

  const payload: ShopifyPageViewPayload = {
    ...getClientBrowserParameters(),
    ...baseShopAnalytics,
    ...getConsentFlags(),
    pageType,
    ...extra,
  };

  try {
    await sendShopifyAnalytics(
      {
        eventName: AnalyticsEventName.PAGE_VIEW,
        payload,
      },
      SHOP_URL
    );
  } catch (error) {
    console.error("Failed to send PAGE_VIEW analytics:", error);
  }
}

// Product type for analytics
export interface AnalyticsProduct {
  productGid: string; // Shopify Product GID (e.g., "gid://shopify/Product/123")
  variantGid: string; // Shopify ProductVariant GID (e.g., "gid://shopify/ProductVariant/456")
  name: string; // Product title
  variantName: string; // Variant title (e.g., "Size M / Blue")
  brand: string; // Brand or vendor name
  category?: string; // Product category (optional)
  price: string; // Price as string (e.g., "29.99")
  sku?: string; // Product SKU (optional)
  quantity: number; // Quantity being added
}

// Send ADD_TO_CART analytics event
// cartId - The Shopify cart GID (e.g., "gid://shopify/Cart/...")
// products - Array of AnalyticsProduct objects
// totalValue - Total cart value as number
export async function sendAddToCartAnalytics({
  cartId,
  products,
  totalValue,
}: {
  cartId: string;
  products: AnalyticsProduct[];
  totalValue: number;
}) {
  if (typeof window === "undefined") return;

  // Check consent via Shopify Customer Privacy API
  if (!isAnalyticsAllowed()) return;

  const payload = {
    ...getClientBrowserParameters(),
    ...baseShopAnalytics,
    ...getConsentFlags(),
    cartId,
    totalValue,
    products: products.map(
      (product): ShopifyAnalyticsProduct => ({
        productGid: product.productGid,
        variantGid: product.variantGid,
        name: product.name,
        variantName: product.variantName,
        brand: product.brand,
        category: product.category,
        price: product.price,
        sku: product.sku,
        quantity: product.quantity,
      })
    ),
  };

  try {
    await sendShopifyAnalytics({
      eventName: AnalyticsEventName.ADD_TO_CART,
      payload,
    });
  } catch (error) {
    console.error("Failed to send ADD_TO_CART analytics:", error);
  }
}

// Re-export AnalyticsPageType for consumers
export { AnalyticsPageType };
