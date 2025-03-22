"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProductStock } from "@/lib/products"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Update stock for each product
      for (const item of items) {
        await updateProductStock(item.product.id, item.product.stock - item.quantity)
      }

      // Clear the cart
      clearCart()

      // Redirect to success page
      router.push("/checkout/success")
    } catch (error) {
      console.error("Error processing checkout:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order before payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card">Card Number</Label>
                <Input id="card" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}

