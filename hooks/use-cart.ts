"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import {
  getCartId,
  addToCart as addToCartUtil,
  updateCartLine,
  removeFromCart as removeFromCartUtil,
  getCart,
  type Cart,
} from "@/lib/cart-utils"

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const hasInitialized = useRef(false)

  // Fetch cart from API on mount if cart ID exists in cookie
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initCart = async () => {
      const cartId = getCartId()
      if (cartId) {
        const response = await getCart()
        if (response.success && response.cart) {
          setCart(response.cart)
        }
      }
      setIsInitialized(true)
      setLoading(false)
    }
    initCart()
  }, [])

  // Refresh cart from API
  const refreshCart = useCallback(async () => {
    setLoading(true)
    const response = await getCart()
    if (response.success && response.cart) {
      setCart(response.cart)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleCartUpdate = (event: Event) => {
      // If the event contains cart data, use it directly (no refetch needed)
      const customEvent = event as CustomEvent<Cart>
      if (customEvent.detail) {
        setCart(customEvent.detail)
      } else {
        // Fallback: refetch if no data provided
        refreshCart()
      }
    }
    window.addEventListener("cart-updated", handleCartUpdate)
    return () => window.removeEventListener("cart-updated", handleCartUpdate)
  }, [refreshCart])

  // Add item to cart
  const addToCart = useCallback(async (merchandiseId: string, quantity = 1) => {
    setLoading(true)
    const response = await addToCartUtil(merchandiseId, quantity)
    if (response.success && response.cart) {
      setCart(response.cart)
    }
    setLoading(false)
    return response
  }, [])

  // Update quantity
  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    setLoading(true)
    const response = await updateCartLine(lineId, quantity)
    if (response.success && response.cart) {
      setCart(response.cart)
    }
    setLoading(false)
    return response
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback(async (lineId: string) => {
    setLoading(true)
    const response = await removeFromCartUtil(lineId)
    if (response.success && response.cart) {
      setCart(response.cart)
    }
    setLoading(false)
    return response
  }, [])

  const itemCount = useMemo(() => {
    if (!cart?.lines?.edges) return 0
    return cart.lines.edges
      .filter((edge) => edge?.node && typeof edge.node.quantity === "number" && edge.node.quantity > 0)
      .reduce((total, edge) => total + edge.node.quantity, 0)
  }, [cart?.lines?.edges])

  return {
    cart,
    loading,
    itemCount,
    isInitialized,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
  }
}
