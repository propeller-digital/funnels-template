import { z } from "zod";

const finalText = z
  .string()
  .describe(
    "Final user-facing copy that will be rendered on the landing page."
  );

const url = z
  .string()
  .describe("URL (absolute or relative). For images, use a valid URL string.");

const imageAssetSchema = z
  .object({
    url: url.describe("Final image URL to render"),
    alt: finalText.describe("Alt text"),
    caption: z.string().optional().describe("Optional caption"),
    intent: z
      .string()
      .optional()
      .describe(
        "Why this image exists. Examples: 'show product in action', 'build trust', 'demonstrate feature'."
      ),
  })
  .strict();

const ctaSchema = z
  .object({
    label: finalText.describe("Final CTA label text"),
    action: z
      .string()
      .describe(
        "Action intent. Examples: 'add_to_cart', 'open_cart', 'checkout', 'scroll_to:faq', 'link:https://...'"
      ),
    supportingText: z
      .string()
      .optional()
      .describe(
        "Optional reassurance near CTA. Example: 'Free shipping • 30-day returns'"
      ),
  })
  .strict();

const richTextSchema = z
  .object({
    format: z
      .string()
      .optional()
      .describe(
        "Format hint. Examples: 'markdown', 'plain', 'html' (prefer markdown/plain)"
      ),
    value: finalText.describe("Final rendered text in the chosen format"),
  })
  .strict();

const blockSchema = z
  .object({
    type: z
      .string()
      .describe(
        "Block type. Examples: 'hero', 'intro', 'listicle', 'proof', 'faq', 'cta', 'footer', 'card', 'trustBar', 'comparison', 'guarantee'."
      ),
    content: z
      .object({
        headline: z
          .string()
          .optional()
          .describe("Final headline text if this block has one"),
        subheadline: z.string().optional().describe("Final subheadline text"),
        body: z
          .union([finalText, richTextSchema])
          .optional()
          .describe("Final body content"),
        bullets: z
          .array(finalText)
          .optional()
          .describe("Final bullet list items"),
        images: z
          .array(imageAssetSchema)
          .optional()
          .describe("Images used by this block"),
        ctas: z
          .array(ctaSchema)
          .optional()
          .describe("CTAs used by this block"),
        items: z
          .array(
            z.object({
              title: z.string().optional().describe("Final item title"),
              text: z
                .union([finalText, richTextSchema])
                .optional()
                .describe("Final item text/body"),
              image: imageAssetSchema
                .optional()
                .describe("Optional item image"),
              cta: ctaSchema.optional().describe("Optional item CTA"),
              meta: z
                .record(z.string(), z.any())
                .optional()
                .describe(
                  "Optional metadata for the item (e.g., rating, author role, tag, sku hint)."
                ),
            })
          )
          .optional()
          .describe(
            "Generic items array. Used for listicle items, feature cards, testimonials, FAQs, etc."
          ),
      })
      .catchall(z.any())
      .describe("Final renderable content. This is the CMS surface area."),
  })
  .strict();

export const landingPageContentSchema = z
  .object({
    version: z.string().default("1.0").describe("Schema version"),
    blocks: z
      .array(blockSchema)
      .min(1)
      .describe("Ordered array of content blocks representing the page"),
  })
  .strict();

export type LandingPageContent = z.infer<typeof landingPageContentSchema>;
