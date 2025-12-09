// Analytics Tracker
//
// Client component that sends a PAGE_VIEW event on mount.
// Place in layout.tsx wrapped in Suspense for automatic page tracking.
//
// USAGE:
// 	import { AnalyticsTracker } from '@/lib/analytics-tracker';
//
// 	// In layout.tsx:
// 	<Suspense fallback={null}>
// 		<AnalyticsTracker />
// 	</Suspense>

"use client"

import { useEffect } from "react"
import { AnalyticsPageType } from "@shopify/hydrogen-react"
import { sendPageViewAnalytics } from "@/lib/shopify-analytics"

// Sends PAGE_VIEW analytics event on component mount
export function AnalyticsTracker() {
  useEffect(() => {
    const sendPageView = () => {
      sendPageViewAnalytics(AnalyticsPageType.home)
    }

    // Check if API already loaded
    if (typeof window !== "undefined" && window.Shopify?.customerPrivacy) {
      sendPageView()
    } else {
      // Wait for Privacy Banner initialization
      window.addEventListener("shopify-analytics-ready", sendPageView, {
        once: true,
      })
      return () =>
        window.removeEventListener("shopify-analytics-ready", sendPageView)
    }
  }, [])

  return null
}
