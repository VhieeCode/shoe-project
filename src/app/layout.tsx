import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { CartProvider } from "@/context/cart-context"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shoe Store",
  description: "E-commerce website selling trendy shoes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} ShoeStore. All rights reserved.
              </footer>
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}