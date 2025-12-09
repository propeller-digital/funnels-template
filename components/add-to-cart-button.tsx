"use client"

import { useState } from "react"
import { addToCart } from "@/lib/cart-utils"
import { sendAddToCartAnalytics, type AnalyticsProduct } from "@/lib/shopify-analytics"

interface ProductData {
  productGid?: string
  name?: string
  brand?: string
  category?: string
  sku?: string
}

interface AddToCartButtonProps {
  variantGid: string
  variantTitle?: string
  price?: string
  quantity?: number
  productData?: ProductData
  onSuccess?: () => void
  disabled?: boolean
}

export function AddToCartButton({
  variantGid,
  variantTitle = "",
  price = "0",
  quantity = 1,
  productData,
  onSuccess,
  disabled = false,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    if (loading || disabled) return

    setLoading(true)
    setAdded(false)

    try {
      const result = await addToCart(variantGid, quantity)

      if (result.success && result.cart) {
        setAdded(true)

        // Dispatch cart update with cart data (avoids refetch)
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: result.cart }))
        // Open the cart drawer
        window.dispatchEvent(new Event("open-cart"))

        // Send analytics
        const analyticsProduct: AnalyticsProduct = {
          productGid: productData?.productGid || variantGid.replace("ProductVariant", "Product"),
          variantGid: variantGid,
          name: productData?.name || "Product",
          variantName: variantTitle,
          brand: productData?.brand || "",
          category: productData?.category,
          price: price,
          sku: productData?.sku,
          quantity: quantity,
        }

        sendAddToCartAnalytics({
          cartId: result.cart.id,
          products: [analyticsProduct],
          totalValue: parseFloat(result.cart.cost.totalAmount.amount),
        })

        onSuccess?.()

        // Reset added state after 2 seconds
        setTimeout(() => setAdded(false), 2000)
      } else {
        console.error("Failed to add to cart:", result.error)
      }
    } catch (error) {
      console.error("Add to cart error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || disabled}
      className={`w-full py-3 px-6 rounded font-medium transition-colors ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : added
          ? "bg-green-600 text-white"
          : loading
          ? "bg-gray-400 text-white cursor-wait"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {loading ? "Adding..." : added ? "Added!" : "Add to Cart"}
    </button>
  )
}
