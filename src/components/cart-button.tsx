"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function CartButton() {
  const { items } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Button variant="outline" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5 mr-2" />
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}

