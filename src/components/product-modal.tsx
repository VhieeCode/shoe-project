"use client"

import Image from "next/image"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart()

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative h-60 sm:h-full">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-2xl font-bold mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mb-4">{product.description || "No description available."}</p>
              <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"} mb-4`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                addToCart(product)
                onClose()
              }}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

