import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { ShopifyAnalyticsProvider } from "@/lib/shopify-analytics-provider"
import { ShopifyPrivacyBanner } from "@/lib/shopify-privacy-banner"
import { AnalyticsTracker } from "@/lib/analytics-tracker"
import "./globals.css"

export const metadata: Metadata = {
  title: "Funnels Template",
  description: "Minimal Shopify landing page template",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ShopifyAnalyticsProvider>
          {children}
        </ShopifyAnalyticsProvider>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ShopifyPrivacyBanner />
      </body>
    </html>
  )
}
