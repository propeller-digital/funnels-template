import { z } from "zod";

// ============================================
// HERO SECTION SCHEMA
// ============================================
const heroSchema = z.object({
  headline: z
    .string()
    .describe(
      "The main headline text displayed prominently in the hero section"
    ),
  subheadline: z
    .string()
    .describe(
      "Supporting text below the headline that elaborates on the value proposition"
    ),
  ctaButtonText: z
    .string()
    .describe("Text displayed on the primary call-to-action button"),
  backgroundImageUrl: z
    .string()
    .describe(
      "URL of the background image for the hero section (leave empty for no background)"
    ),
});

// ============================================
// FEATURES SECTION SCHEMA
// ============================================
const featureItemSchema = z.object({
  icon: z
    .string()
    .describe("Lucide icon name (e.g., 'Zap', 'Shield', 'Star') or emoji"),
  title: z.string().describe("Short title for this feature"),
  description: z.string().describe("Brief description of this feature"),
});

const featuresSchema = z.object({
  title: z
    .string()
    .describe("Section heading displayed above the features list"),
  items: z
    .array(featureItemSchema)
    .describe("Array of feature items to display"),
});

// ============================================
// BENEFITS SECTION SCHEMA
// ============================================
const benefitItemSchema = z.object({
  text: z.string().describe("A single benefit statement"),
});

const benefitsSchema = z.object({
  title: z.string().describe("Section heading for the benefits list"),
  items: z.array(benefitItemSchema).describe("Array of benefit statements"),
});

// ============================================
// TESTIMONIALS SECTION SCHEMA
// ============================================
const testimonialItemSchema = z.object({
  name: z.string().describe("Name of the person giving the testimonial"),
  text: z.string().describe("The testimonial quote text"),
  avatarUrl: z
    .string()
    .describe("URL of the avatar image (leave empty for default avatar)"),
});

const testimonialsSchema = z.object({
  title: z.string().describe("Section heading displayed above testimonials"),
  items: z
    .array(testimonialItemSchema)
    .describe("Array of testimonials to display"),
});

// ============================================
// FAQ SECTION SCHEMA
// ============================================
const faqItemSchema = z.object({
  question: z.string().describe("The frequently asked question"),
  answer: z.string().describe("The answer to the question"),
});

const faqSchema = z.object({
  title: z.string().describe("Section heading for the FAQ section"),
  items: z.array(faqItemSchema).describe("Array of Q&A pairs"),
});

// ============================================
// CTA SECTION SCHEMA
// ============================================
const ctaSchema = z.object({
  headline: z
    .string()
    .describe("Compelling headline for the call-to-action section"),
  description: z
    .string()
    .describe("Supporting text that reinforces the call to action"),
  buttonText: z.string().describe("Text on the CTA button"),
});

// ============================================
// FOOTER SECTION SCHEMA
// ============================================
const footerLinkSchema = z.object({
  text: z.string().describe("Display text for the footer link"),
  url: z.string().describe("URL the link points to"),
});

const footerSchema = z.object({
  copyrightText: z
    .string()
    .describe(
      "Copyright text displayed in the footer (e.g., '2024 Company Name')"
    ),
  links: z.array(footerLinkSchema).describe("Array of footer links"),
});

// ============================================
// MAIN CMS SCHEMA
// ============================================
export const cmsSchema = z.object({
  hero: heroSchema.describe("Hero section content at the top of the page"),
  features: featuresSchema.describe(
    "Features section showcasing product capabilities"
  ),
  benefits: benefitsSchema.describe(
    "Benefits section listing customer advantages"
  ),
  testimonials: testimonialsSchema.describe(
    "Testimonials from satisfied customers"
  ),
  faq: faqSchema.describe("Frequently asked questions section"),
  cta: ctaSchema.describe("Call-to-action section to drive conversions"),
  footer: footerSchema.describe("Footer section with copyright and links"),
});

// ============================================
// TYPE EXPORTS (inferred from schemas)
// ============================================
export type HeroContent = z.infer<typeof heroSchema>;
export type FeatureItem = z.infer<typeof featureItemSchema>;
export type FeaturesContent = z.infer<typeof featuresSchema>;
export type BenefitItem = z.infer<typeof benefitItemSchema>;
export type BenefitsContent = z.infer<typeof benefitsSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TestimonialsContent = z.infer<typeof testimonialsSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqContent = z.infer<typeof faqSchema>;
export type CtaContent = z.infer<typeof ctaSchema>;
export type FooterLink = z.infer<typeof footerLinkSchema>;
export type FooterContent = z.infer<typeof footerSchema>;
export type CmsContent = z.infer<typeof cmsSchema>;

// ============================================
// DEFAULT CONTENT
// ============================================
export const CMS_CONTENT: CmsContent = {
  hero: {
    headline: "Transform Your Experience Today",
    subheadline:
      "Discover the product that will change how you work, play, and live.",
    ctaButtonText: "Get Started Now",
    backgroundImageUrl: "",
  },
  features: {
    title: "Why Choose Us",
    items: [
      {
        icon: "Zap",
        title: "Lightning Fast",
        description: "Experience unparalleled speed and performance.",
      },
      {
        icon: "Shield",
        title: "Secure & Reliable",
        description: "Your data is protected with enterprise-grade security.",
      },
      {
        icon: "Star",
        title: "Premium Quality",
        description: "Crafted with attention to every detail.",
      },
    ],
  },
  benefits: {
    title: "What You Get",
    items: [
      { text: "Free shipping on all orders" },
      { text: "30-day money-back guarantee" },
      { text: "24/7 customer support" },
      { text: "Lifetime updates included" },
    ],
  },
  testimonials: {
    title: "What Our Customers Say",
    items: [
      {
        name: "Sarah Johnson",
        text: "This product exceeded all my expectations. Highly recommend!",
        avatarUrl: "",
      },
      {
        name: "Mike Chen",
        text: "Best purchase I've made this year. Amazing quality.",
        avatarUrl: "",
      },
      {
        name: "Emily Davis",
        text: "Outstanding customer service and fantastic product.",
        avatarUrl: "",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day money-back guarantee. If you're not satisfied, return the product for a full refund.",
      },
      {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to over 50 countries worldwide.",
      },
    ],
  },
  cta: {
    headline: "Ready to Get Started?",
    description: "Join thousands of satisfied customers today.",
    buttonText: "Buy Now",
  },
  footer: {
    copyrightText: "2024 Your Company Name. All rights reserved.",
    links: [
      { text: "Privacy Policy", url: "/privacy" },
      { text: "Terms of Service", url: "/terms" },
      { text: "Contact Us", url: "/contact" },
    ],
  },
};
