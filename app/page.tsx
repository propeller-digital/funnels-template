"use client";

import { CartButton } from "@/components/cart-button";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductDisplay } from "@/components/product-display";
import { PRODUCT_DATA } from "@/lib/product-data";
import cmsData from "@/lib/cms.json";

import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FooterSection } from "@/components/sections/footer-section";

// CMS component content types
interface HeroContent {
  headline: string;
  subheadline: string;
  ctas: Array<{ label: string; action: string; supportingText?: string }>;
  images: Array<{ alt: string; url: string }>;
}

interface ListicleContent {
  headline: string;
  items: Array<{ title: string; text: string; image: { alt: string; url: string } }>;
}

interface ProofContent {
  headline: string;
  body: string;
  items: Array<{ title: string; text: string; image: { alt: string; url: string } }>;
}

interface FaqContent {
  headline: string;
  items: Array<{ title: string; text: string }>;
}

interface CtaContent {
  headline: string;
  subheadline: string;
  ctas: Array<{ label: string; action: string; supportingText?: string }>;
}

interface CmsComponent<T> {
  type: string;
  name: string;
  enabled: boolean;
  content: T;
}

// Helper to find component by type
function findComponent<T>(type: string): CmsComponent<T> | undefined {
  const component = cmsData.components.find((c) => c.type === type);
  return component as CmsComponent<T> | undefined;
}

const heroData = findComponent<HeroContent>("hero");
const listicleData = findComponent<ListicleContent>("listicle");
const proofData = findComponent<ProofContent>("proof");
const faqData = findComponent<FaqContent>("faq");
const ctaData = findComponent<CtaContent>("cta");

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
      {heroData?.enabled && <HeroSection content={heroData.content} />}

      {/* Features Section */}
      {listicleData?.enabled && <FeaturesSection content={listicleData.content} />}

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
      <BenefitsSection messaging={cmsData.messaging} />

      {/* Testimonials Section */}
      {proofData?.enabled && <TestimonialsSection content={proofData.content} />}

      {/* FAQ Section */}
      {faqData?.enabled && <FaqSection content={faqData.content} />}

      {/* CTA Section */}
      {ctaData?.enabled && <CtaSection content={ctaData.content} />}

      {/* Footer Section */}
      <FooterSection pageTitle={cmsData.page.title} />

      {/* Cart Drawer */}
      <CartDrawer />
    </main>
  );
}
