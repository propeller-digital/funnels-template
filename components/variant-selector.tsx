"use client"

export interface VariantImage {
  src: string
  alt?: string
  width?: number
  height?: number
}

export interface SelectedOption {
  name: string
  value: string
}

export interface Variant {
  id: string
  gid: string
  title: string
  price: string
  compare_at_price?: string | null
  sku?: string
  barcode?: string
  available_for_sale?: boolean
  inventory_quantity?: number
  image?: VariantImage
  selected_options?: SelectedOption[]
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant | null
  onSelect: (variant: Variant) => void
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  if (variants.length <= 1) {
    return null
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Select Option</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            disabled={variant.available_for_sale === false}
            className={`px-4 py-2 border rounded text-sm transition-colors ${
              selectedVariant?.id === variant.id
                ? "border-black bg-black text-white"
                : variant.available_for_sale === false
                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
            }`}
          >
            {variant.title}
          </button>
        ))}
      </div>
    </div>
  )
}
