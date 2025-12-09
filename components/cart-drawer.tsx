"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice, generateCartPermalink } from "@/lib/cart-utils"
import { sendAddToCartAnalytics, type AnalyticsProduct } from "@/lib/shopify-analytics"

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, loading, itemCount, updateQuantity, removeFromCart } = useCart()

  // Listen for open/toggle events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleToggle = () => setIsOpen((prev) => !prev)

    window.addEventListener("open-cart", handleOpen)
    window.addEventListener("toggle-cart", handleToggle)

    return () => {
      window.removeEventListener("open-cart", handleOpen)
      window.removeEventListener("toggle-cart", handleToggle)
    }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const handleCheckout = () => {
    if (!cart) return
    const checkoutUrl = generateCartPermalink(cart)
    window.location.href = checkoutUrl
  }

  const handleUpdateQuantity = async (lineId: string, newQuantity: number, item: typeof cartItems[0]["node"]) => {
    const oldQuantity = item.quantity

    if (newQuantity < 1) {
      await removeFromCart(lineId)
    } else {
      const response = await updateQuantity(lineId, newQuantity)

      // Send ADD_TO_CART analytics when quantity increases
      if (response.success && response.cart && newQuantity > oldQuantity) {
        const quantityAdded = newQuantity - oldQuantity
        const analyticsProduct: AnalyticsProduct = {
          productGid: item.merchandise.id.replace("ProductVariant", "Product"),
          variantGid: item.merchandise.id,
          name: item.merchandise.product.title,
          variantName: item.merchandise.title,
          brand: "",
          price: item.merchandise.price.amount,
          quantity: quantityAdded,
        }

        sendAddToCartAnalytics({
          cartId: response.cart.id,
          products: [analyticsProduct],
          totalValue: parseFloat(response.cart.cost.totalAmount.amount),
        })
      }
    }
  }

  const cartItems = cart?.lines?.edges?.filter((edge) => edge?.node?.quantity > 0) || []
  const subtotal = cart?.cost?.subtotalAmount
    ? formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)
    : "$0.00"

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Cart ({itemCount})</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map(({ node: item }) => (
                <li key={item.id} className="flex gap-4 border-b pb-4">
                  {/* Image */}
                  {item.merchandise.image?.url && (
                    <img
                      src={item.merchandise.image.url}
                      alt={item.merchandise.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">
                      {item.merchandise.product.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.merchandise.title}</p>
                    <p className="text-sm mt-1">
                      {formatPrice(
                        item.merchandise.price.amount,
                        item.merchandise.price.currencyCode
                      )}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item)}
                        disabled={loading}
                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item)}
                        disabled={loading}
                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                        className="ml-auto text-red-500 text-sm hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || loading}
            className="w-full py-3 bg-black text-white rounded font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  )
}
