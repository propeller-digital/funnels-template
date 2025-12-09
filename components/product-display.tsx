"use client"

import { useState, useMemo } from "react"
import { VariantSelector, type Variant, type VariantImage } from "./variant-selector"
import { AddToCartButton } from "./add-to-cart-button"
import { formatPrice } from "@/lib/cart-utils"

export interface ProductImage {
  src: string
  alt?: string
  width?: number
  height?: number
}

export interface ProductData {
  id: string
  gid: string
  title: string
  handle?: string
  vendor?: string
  product_type?: string
  description?: string
  description_html?: string
  tags?: string[]
  featured_image?: ProductImage
  images?: ProductImage[]
  price_range?: {
    min: { amount: string; currency_code: string }
    max: { amount: string; currency_code: string }
  }
  options?: Array<{ name: string; values: string[] }>
  variants: Variant[]
  _storeId?: string
  _shopDomain?: string
}

interface ProductDisplayProps {
  product: ProductData
}

export function ProductDisplay({ product }: ProductDisplayProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] || null
  )

  // Calculate discount percentage
  const discount = useMemo(() => {
    if (!selectedVariant?.compare_at_price) return 0
    const compareAt = parseFloat(selectedVariant.compare_at_price)
    const current = parseFloat(selectedVariant.price)
    if (compareAt <= current || isNaN(compareAt)) return 0
    return Math.round(((compareAt - current) / compareAt) * 100)
  }, [selectedVariant])

  // Get currency code from price range or default to USD
  const currencyCode = product.price_range?.min?.currency_code || "USD"

  // Get the image to display (variant image or featured image)
  const displayImage = selectedVariant?.image || product.featured_image

  if (!selectedVariant) {
    return <p className="text-gray-500">No variants available</p>
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Product Image */}
      {displayImage && (
        <div className="mb-4">
          <img
            src={displayImage.src}
            alt={displayImage.alt || product.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

      {/* Vendor/Brand */}
      {product.vendor && (
        <p className="text-gray-500 text-sm mb-2">{product.vendor}</p>
      )}

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-semibold">
          {formatPrice(selectedVariant.price, currencyCode)}
        </span>
        {selectedVariant.compare_at_price && discount > 0 && (
          <>
            <span className="text-gray-400 line-through text-sm">
              {formatPrice(selectedVariant.compare_at_price, currencyCode)}
            </span>
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
      )}

      {/* Variant Selector */}
      <VariantSelector
        variants={product.variants}
        selectedVariant={selectedVariant}
        onSelect={setSelectedVariant}
      />

      {/* Add to Cart Button */}
      <AddToCartButton
        variantGid={selectedVariant.gid}
        variantTitle={selectedVariant.title}
        price={selectedVariant.price}
        disabled={selectedVariant.available_for_sale === false}
        productData={{
          productGid: product.gid,
          name: product.title,
          brand: product.vendor,
          category: product.product_type,
          sku: selectedVariant.sku,
        }}
      />
    </div>
  )
}
