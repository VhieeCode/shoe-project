"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { supabase } from "@/utils/supabase/client";

// Cart item type definition
type CartItem = Product & {
  quantity: number;
};

export default function ShoeStore() {
  // Replace the existing products constant with state
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("items").select("*");

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
      }
    }

    fetchProducts();
  }, []);

  // State for selected product and modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add to cart function with stock check
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity + 1 > product.stock) {
          toast(`Sorry, only ${product.stock} items available in stock.`);
          return prevCart;
        }

        // If item exists and stock available, increase quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist and stock available, add it with quantity 1
        if (product.stock > 0) {
          return [...prevCart, { ...product, quantity: 1 }];
        } else {
          toast("Sorry, this item is out of stock.");
          return prevCart;
        }
      }
    });
  };

  // Remove from cart function
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update quantity function with stock check
  const updateQuantity = (productId: number, change: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const product = products.find((p) => p.id === productId);
          const newQuantity = item.quantity + change;

          // Check if new quantity is valid
          if (newQuantity < 1) return item;
          if (product && newQuantity > product.stock) {
            toast(`Sorry, only ${product.stock} items available in stock.`);
            return item;
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Checkout function that updates stock
  const handleCheckout = () => {
    // Update product stock based on cart items
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity,
          };
        }
        return product;
      });
    });

    // Clear the cart
    setCart([]);

    // Success message for Checking Out
    toast("Checkout Complete!", {
      description: new Date()
        .toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", " |"),
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Nike Shoes</h1>
        <p className="text-muted-foreground">Just do it.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product listing - Left side */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Our Collection</h2>
            <Badge variant="outline" className="px-3 py-1">
              {products.length} Products
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`overflow-hidden cursor-pointer transition-all transform hover:scale-105 hover:shadow-lg ${
                  product.stock === 0 ? "opacity-60" : ""
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative h-64 bg-muted">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.stock <= 3 && product.stock > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-3 right-3"
                    >
                      Low Stock: {product.stock}
                    </Badge>
                  )}
                  {product.stock > 3 && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3"
                    >
                      In Stock: {product.stock}
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge
                      variant="outline"
                      className="absolute top-3 right-3 bg-background/80"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-xl">{product.name}</h3>
                    <span className="font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full"
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart - Right side */}
        <div className="lg:w-1/3">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Your Cart</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Your cart is empty
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[calc(60vh-300px)] pr-4">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <MinusCircle className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <PlusCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right font-medium">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="space-y-2">
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                    >
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Product Detail Dialog */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80">
              <Image
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.name}
                fill
                className="object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 rounded-full"
                onClick={() => setSelectedProduct(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-muted-foreground">
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                </div>
                {selectedProduct.stock > 0 ? (
                  <Badge variant="outline" className="px-3 py-1">
                    {selectedProduct.stock} in stock
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-destructive border-destructive"
                  >
                    Out of stock
                  </Badge>
                )}
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <h3 className="font-medium">Description</h3>
                <p>{selectedProduct.description}</p>
              </div>
              <div className="mt-6 flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
