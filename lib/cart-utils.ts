// Cart Utilities
//
// This file provides functions to interact with Shopify's Storefront API directly.
// All cart operations are performed client-side with no backend dependency.
//
// IMPORTANT: The STOREFRONT_ACCESS_TOKEN is designed to be public and safe for client-side use.

import { SHOP_URL, STOREFRONT_ACCESS_TOKEN } from "./config"
import { PRODUCT_DATA } from "./product-data"

// Cart expiry matches Shopify's cart expiry (10 days)
const CART_EXPIRY_DAYS = 10

// Cookie Utilities
// Cart ID is stored in a cookie scoped by store ID to prevent conflicts
// between different landing pages from the SaaS

const getCartCookieName = (): string => {
  const storeId = PRODUCT_DATA?._storeId || "default"
  return `funnels_cart_${storeId}`
}

const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

// Save cart ID to cookie
export const saveCartId = (cartId: string): void => {
  try {
    setCookie(getCartCookieName(), cartId, CART_EXPIRY_DAYS)
  } catch (error) {
    console.error("Failed to save cart ID:", error)
  }
}

// Get cart ID from cookie
export const getCartId = (): string | null => {
  try {
    return getCookie(getCartCookieName())
  } catch (error) {
    console.error("Failed to get cart ID:", error)
    return null
  }
}

// Clear cart cookie
export const clearCartData = (): void => {
  try {
    deleteCookie(getCartCookieName())
  } catch (error) {
    console.error("Failed to clear cart data:", error)
  }
}

// TypeScript Types
export interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
    }
    price: {
      amount: string
      currencyCode: string
    }
    compareAtPrice?: {
      amount: string
      currencyCode: string
    }
    image?: {
      url: string
    }
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    amountPerQuantity?: {
      amount: string
      currencyCode: string
    }
    compareAtAmountPerQuantity?: {
      amount: string
      currencyCode: string
    }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{
      node: CartLine
    }>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

export interface CartResponse {
  success: boolean
  cart?: Cart
  error?: string
}

// Helper function to make Shopify Storefront API requests
export const shopifyStorefrontRequest = async (
  query: string,
  variables?: Record<string, unknown>,
): Promise<{ data?: Record<string, unknown>; errors?: Array<{ message: string }> }> => {
  const response = await fetch(`https://${SHOP_URL}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`)
  }

  return response.json()
}

// GraphQL fragment for cart fields
const CART_FRAGMENT = `
  id
  checkoutUrl
  lines(first: 10) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product {
              title
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          amountPerQuantity {
            amount
            currencyCode
          }
          compareAtAmountPerQuantity {
            amount
            currencyCode
          }
        }
      }
    }
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
  }
`

// Create a new cart with an initial item
export const createCart = async (merchandiseId: string, quantity = 1): Promise<CartResponse> => {
  try {
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            ${CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await shopifyStorefrontRequest(mutation, {
      input: {
        lines: [
          {
            merchandiseId,
            quantity,
          },
        ],
      },
    })

    if (response.errors) {
      console.error("GraphQL errors:", response.errors)
      return {
        success: false,
        error: "Failed to create cart",
      }
    }

    const data = response.data as { cartCreate: { cart: Cart; userErrors: Array<{ message: string }> } }

    if (data?.cartCreate.userErrors?.length) {
      console.error("User errors:", data.cartCreate.userErrors)
      return {
        success: false,
        error: data.cartCreate.userErrors[0].message,
      }
    }

    const cart = data.cartCreate.cart

    // Save cart ID to cookie
    saveCartId(cart.id)

    return {
      success: true,
      cart,
    }
  } catch (error) {
    console.error("Create cart error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Add an item to an existing cart
export const addToCart = async (merchandiseId: string, quantity = 1): Promise<CartResponse> => {
  try {
    // Get existing cart ID
    const cartId = getCartId()

    // If no cart exists, create one
    if (!cartId) {
      return await createCart(merchandiseId, quantity)
    }

    const mutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await shopifyStorefrontRequest(mutation, {
      cartId,
      lines: [{ merchandiseId, quantity }],
    })

    if (response.errors) {
      console.error("GraphQL errors:", response.errors)
      return {
        success: false,
        error: "Failed to add to cart",
      }
    }

    const data = response.data as { cartLinesAdd: { cart: Cart; userErrors: Array<{ message: string }> } }

    if (data?.cartLinesAdd.userErrors?.length) {
      console.error("User errors:", data.cartLinesAdd.userErrors)
      return {
        success: false,
        error: data.cartLinesAdd.userErrors[0].message,
      }
    }

    const cart = data.cartLinesAdd.cart

    return {
      success: true,
      cart,
    }
  } catch (error) {
    console.error("Add to cart error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Update the quantity of a cart line
export const updateCartLine = async (lineId: string, quantity: number): Promise<CartResponse> => {
  try {
    const cartId = getCartId()

    if (!cartId) {
      return {
        success: false,
        error: "No active cart found",
      }
    }

    const mutation = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await shopifyStorefrontRequest(mutation, {
      cartId,
      lines: [{ id: lineId, quantity }],
    })

    if (response.errors) {
      console.error("GraphQL errors:", response.errors)
      return {
        success: false,
        error: "Failed to update cart",
      }
    }

    const data = response.data as { cartLinesUpdate: { cart: Cart; userErrors: Array<{ message: string }> } }

    if (data?.cartLinesUpdate.userErrors?.length) {
      console.error("User errors:", data.cartLinesUpdate.userErrors)
      return {
        success: false,
        error: data.cartLinesUpdate.userErrors[0].message,
      }
    }

    const cart = data.cartLinesUpdate.cart

    return {
      success: true,
      cart,
    }
  } catch (error) {
    console.error("Update cart line error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Remove item from cart
export const removeFromCart = async (lineId: string): Promise<CartResponse> => {
  try {
    const cartId = getCartId()

    if (!cartId) {
      return {
        success: false,
        error: "No active cart found",
      }
    }

    const mutation = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${CART_FRAGMENT}
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const response = await shopifyStorefrontRequest(mutation, {
      cartId,
      lineIds: [lineId],
    })

    if (response.errors) {
      console.error("GraphQL errors:", response.errors)
      return {
        success: false,
        error: "Failed to remove from cart",
      }
    }

    const data = response.data as { cartLinesRemove: { cart: Cart; userErrors: Array<{ message: string }> } }

    if (data?.cartLinesRemove.userErrors?.length) {
      console.error("User errors:", data.cartLinesRemove.userErrors)
      return {
        success: false,
        error: data.cartLinesRemove.userErrors[0].message,
      }
    }

    const cart = data.cartLinesRemove.cart

    return {
      success: true,
      cart,
    }
  } catch (error) {
    console.error("Remove from cart error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Get current cart details from Shopify
export const getCart = async (): Promise<CartResponse> => {
  try {
    const cartId = getCartId()

    if (!cartId) {
      return {
        success: false,
        error: "No active cart found",
      }
    }

    const query = `
      query cart($cartId: ID!) {
        cart(id: $cartId) {
          ${CART_FRAGMENT}
        }
      }
    `

    const response = await shopifyStorefrontRequest(query, {
      cartId,
    })

    if (response.errors) {
      console.error("GraphQL errors:", response.errors)
      return {
        success: false,
        error: "Failed to get cart",
      }
    }

    const data = response.data as { cart: Cart | null }

    if (!data?.cart) {
      return {
        success: false,
        error: "Cart not found",
      }
    }

    const cart = data.cart

    return {
      success: true,
      cart,
    }
  } catch (error) {
    console.error("Get cart error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Clear the current cart (removes cookie)
export const clearCart = (): void => {
  clearCartData()
}

// Helper: Format price for display
export const formatPrice = (amount: string, currencyCode: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number.parseFloat(amount))
}

// Generate a cart permalink URL with sales channel attribution
// This URL format attributes orders to the sales channel in Shopify's "Sales by Channel" report
// See: https://shopify.dev/docs/apps/build/checkout/create-cart-permalinks
export const generateCartPermalink = (cart: Cart): string => {
  const items = cart.lines.edges
    .map(({ node }) => {
      // Extract numeric variant ID from GID (e.g., "gid://shopify/ProductVariant/123" -> "123")
      const variantId = node.merchandise.id.split("/").pop()
      return `${variantId}:${node.quantity}`
    })
    .join(",")

  return `https://${SHOP_URL}/cart/${items}?access_token=${STOREFRONT_ACCESS_TOKEN}`
}
