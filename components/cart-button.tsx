"use client"

import { useCart } from "@/hooks/use-cart"

export function CartButton() {
  const { itemCount, isInitialized } = useCart()

  const handleClick = () => {
    window.dispatchEvent(new Event("toggle-cart"))
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 rounded transition-colors"
      aria-label="Open cart"
    >
      {/* Cart Icon (SVG) */}
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
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>

      {/* Badge */}
      {isInitialized && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  )
}
