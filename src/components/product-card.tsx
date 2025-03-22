"use client"

import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <Card className="overflow-hidden">
      <div className="relative h-60 cursor-pointer" onClick={onClick}>
        <Image
          src={product.image || "/placeholder.svg?height=240&width=240"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold">${product.price.toFixed(2)}</p>
          <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            addToCart(product)
          }}
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

