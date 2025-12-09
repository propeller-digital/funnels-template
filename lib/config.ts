// Shopify store URL (e.g., "funnels-test-2.myshopify.com")
export const SHOP_URL = "funnels-test-2.myshopify.com";

// Shopify Storefront Access Token (public-safe)
export const STOREFRONT_ACCESS_TOKEN = "4f7413ecd89392682c14e744ed5229f4";

// Shopify Shop ID (GID format)
export const SHOP_ID = "gid://shopify/Shop/66106916982";

// Shopify Storefront ID - used for analytics
// This is the PUBLIC_STOREFRONT_ID from Hydrogen/Headless channel
// Optional for headless storefronts - specific to Hydrogen deployments (leave it empty)
export const STOREFRONT_ID = "";

// Checkout Root Domain - used for Customer Privacy API
// This is typically your Shopify domain where checkout happens
export const CHECKOUT_ROOT_DOMAIN = SHOP_URL;

// Storefront Root Domain - used for Customer Privacy API
// This should match your deployed storefront domain (e.g., 'your-site.vercel.app')
// For local development, this will be 'localhost' but note that analytics
// won't appear in Shopify admin when testing from localhost
export function getStorefrontRootDomain(): string {
  if (typeof window === "undefined") return "localhost";
  return window.location.hostname;
}
