import ProductGrid from "@/components/product-grid"
import { getProducts } from "@/lib/products"

export default async function Home() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trendy Shoes</h1>
      <ProductGrid products={products} />
    </div>
  )
}