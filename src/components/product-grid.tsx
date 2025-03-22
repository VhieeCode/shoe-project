"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import ProductCard from "./product-card"
import ProductModal from "./product-modal"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
        ))}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  )
}

