import Link from "next/link"
import CartButton from "./cart-button"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          ShoeStore
        </Link>
        <div className="flex items-center gap-4">
          <CartButton />
        </div>
      </div>
    </header>
  )
}

