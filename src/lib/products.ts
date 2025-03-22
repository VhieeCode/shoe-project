"use server"

import type { Product } from "./types"
import { v4 as uuidv4 } from "uuid"

// In a real app, this would be a database
const products: Product[] = [
  {
    id: "1",
    name: "Air Max Runners",
    price: 129.99,
    stock: 10,
    description: "Lightweight running shoes with air cushioning for maximum comfort.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "2",
    name: "Classic Leather Loafers",
    price: 89.99,
    stock: 5,
    description: "Elegant leather loafers perfect for formal occasions.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "3",
    name: "Casual Canvas Sneakers",
    price: 59.99,
    stock: 15,
    description: "Comfortable canvas sneakers for everyday wear.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "4",
    name: "Hiking Boots",
    price: 149.99,
    stock: 8,
    description: "Durable hiking boots with excellent grip for outdoor adventures.",
    image: "/placeholder.svg?height=400&width=400",
  },
]

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...products]
}

export async function getProduct(id: string): Promise<Product | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return products.find((product) => product.id === id)
}

export async function addProduct(productData: Omit<Product, "id">): Promise<Product> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newProduct: Product = {
    ...productData,
    id: uuidv4(),
  }

  products.push(newProduct)
  return newProduct
}

export async function updateProductStock(id: string, newStock: number): Promise<Product | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex === -1) {
    return undefined
  }

  products[productIndex] = {
    ...products[productIndex],
    stock: Math.max(0, newStock),
  }

  return products[productIndex]
}

