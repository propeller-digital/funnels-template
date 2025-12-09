"use client";

import { CartButton } from "@/components/cart-button";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductDisplay } from "@/components/product-display";
import { PRODUCT_DATA } from "@/lib/product-data";
import { CMS_CONTENT } from "@/lib/cms";

import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Funnels Template</h1>
          <CartButton />
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection content={CMS_CONTENT.hero} />

      {/* Features Section */}
      <FeaturesSection content={CMS_CONTENT.features} />

      {/* Product Display */}
      <section className="py-16 px-4">
        {PRODUCT_DATA ? (
          <ProductDisplay product={PRODUCT_DATA} />
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p>No product configured.</p>
            <p className="text-sm mt-2">
              Generate product data using the CLI tool.
            </p>
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <BenefitsSection content={CMS_CONTENT.benefits} />

      {/* Testimonials Section */}
      <TestimonialsSection content={CMS_CONTENT.testimonials} />

      {/* FAQ Section */}
      <FaqSection content={CMS_CONTENT.faq} />

      {/* CTA Section */}
      <CtaSection content={CMS_CONTENT.cta} />

      {/* Footer Section */}
      <FooterSection content={CMS_CONTENT.footer} />

      {/* Cart Drawer */}
      <CartDrawer />
    </main>
  );
}
