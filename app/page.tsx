"use client"

import { CartButton } from "@/components/cart-button"
import { CartDrawer } from "@/components/cart-drawer"
import { ProductDisplay } from "@/components/product-display"
import { PRODUCT_DATA } from "@/lib/product-data"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Funnels Template</h1>
          <CartButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="py-8">
        {PRODUCT_DATA ? (
          <ProductDisplay product={PRODUCT_DATA} />
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>No product configured.</p>
            <p className="text-sm mt-2">
              Generate product data using the CLI tool.
            </p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </main>
  )
}
