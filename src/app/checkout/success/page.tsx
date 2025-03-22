import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been processed successfully.
      </p>
      <Button asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  )
}