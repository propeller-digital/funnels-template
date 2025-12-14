import { z } from "zod";

/**
 * ONE JSON TO RULE THEM ALL:
 * - Acts as CMS content (final strings/images used by the page)
 * - Acts as AI/page spec (layout + style intent + composition)
 * - Avoids CSS/Tailwind and avoids rigid enums
 * - Remains flexible for new section/component types
 */

/* ============================================================
 * PRIMITIVES
 * ============================================================ */

const finalText = z
  .string()
  .describe(
    "Final user-facing copy that will be rendered on the landing page."
  );

const url = z
  .string()
  .describe("URL (absolute or relative). For images, use a valid URL string.");

/* ============================================================
 * STYLE & LAYOUT (DESCRIPTIVE, NOT CSS)
 * ============================================================ */

const styleIntentSchema = z
  .object({
    /**
     * A component can define both:
     * - 'tone' (how it should feel)
     * - 'visualGuidelines' (what to do)
     * - 'doNot' (what to avoid)
     */
    tone: z
      .string()
      .optional()
      .describe(
        "Descriptive tone for visuals/copy. Examples: 'premium and minimal', 'playful and colorful', 'rugged outdoors', 'technical and clean'."
      ),
    emphasis: z
      .string()
      .optional()
      .describe(
        "How visually strong it should be. Examples: 'high contrast', 'subtle', 'attention-grabbing', 'calm'."
      ),
    typography: z
      .object({
        headlineStyle: z
          .string()
          .optional()
          .describe(
            "Headline typography intent. Examples: 'large bold condensed', 'elegant serif', 'clean sans with wide tracking'."
          ),
        bodyStyle: z
          .string()
          .optional()
          .describe(
            "Body typography intent. Examples: 'comfortable reading', 'short punchy lines', 'dense technical'."
          ),
        alignment: z
          .string()
          .optional()
          .describe(
            "Text alignment intent. Examples: 'centered', 'left-aligned'."
          ),
      })
      .strict()
      .optional()
      .describe("Typography intent (not actual CSS)."),
    colorIntent: z
      .object({
        paletteDescription: z
          .string()
          .optional()
          .describe(
            "Palette description. Examples: 'black/white with one accent', 'warm neutrals', 'brand primary with soft gradients'."
          ),
        backgroundIntent: z
          .string()
          .optional()
          .describe(
            "Background intent. Examples: 'solid neutral background', 'subtle gradient', 'image with dark overlay'."
          ),
        accentUsage: z
          .string()
          .optional()
          .describe(
            "How accents are used. Examples: 'CTA only', 'icons and highlights', 'section dividers'."
          ),
      })
      .strict()
      .optional()
      .describe("Color intent (not hex codes)."),
    spacingIntent: z
      .string()
      .optional()
      .describe(
        "Spacing density intent. Examples: 'airy and spacious', 'compact', 'balanced'."
      ),
    imageryIntent: z
      .string()
      .optional()
      .describe(
        "Imagery direction. Examples: 'studio product shots', 'lifestyle action shots', 'technical close-ups'."
      ),
    bordersAndShadowsIntent: z
      .string()
      .optional()
      .describe(
        "Surface styling intent. Examples: 'soft shadows', 'no shadows', 'cards with subtle borders', 'brutalist outlines'."
      ),
    accessibilityNotes: z
      .array(z.string())
      .optional()
      .describe(
        "Accessibility notes. Examples: 'avoid light gray text', 'ensure CTA contrast', 'avoid text baked into images'."
      ),
  })
  .strict()
  .describe("Descriptive style guidance that an AI and renderer can follow.");

const layoutIntentSchema = z
  .object({
    pattern: z
      .string()
      .describe(
        "High-level layout pattern. Examples: 'single column', 'two columns (media left)', 'two columns (media right)', 'grid of cards', 'stacked sections', 'accordion'."
      ),
    flow: z
      .string()
      .optional()
      .describe(
        "Reading/conversion flow notes. Examples: 'headline -> benefits bullets -> CTA', 'list items each end with micro-CTA'."
      ),
    hierarchy: z
      .string()
      .optional()
      .describe(
        "What should be most prominent. Examples: 'headline and CTA dominate', 'listicle item titles are the focus'."
      ),
    responsiveNotes: z
      .string()
      .optional()
      .describe(
        "Responsive behavior in plain language. Examples: 'collapse to single column on mobile', 'CTA stays visible near top'."
      ),
  })
  .strict()
  .describe("Descriptive layout guidance (no grid numbers/pixels).");

/* ============================================================
 * CONTENT MODEL
 * ============================================================ *
 * Final content lives here. This should be safe to render directly.
 * This is also the CMS surface area.
 */

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

/* ============================================================
 * COMPONENT TREE
 * ============================================================ *
 * This is the key: components can represent sections and subcomponents.
 * - `type` is free-form (hero, listicle, cardGrid, trustBar, etc.)
 * - `content` holds final renderable fields
 * - `layoutIntent` + `styleIntent` guide AI + renderer
 */

const componentSchema: z.ZodType<LandingPageComponent> = z.lazy(() =>
  z
    .object({
      /**
       * Flexible component identity:
       * - type: drives rendering strategy
       * - name: human-friendly label in CMS/editor
       */
      type: z
        .string()
        .describe(
          "Component/section type. Examples: 'hero', 'intro', 'listicle', 'proof', 'faq', 'cta', 'footer', 'card', 'trustBar', 'comparison', 'guarantee'."
        ),
      name: z
        .string()
        .optional()
        .describe("Optional human-friendly name shown in your CMS UI"),
      enabled: z.boolean().default(true),

      /**
       * Descriptive layout and style guidance
       */
      layoutIntent: layoutIntentSchema.optional(),
      styleIntent: styleIntentSchema.optional(),

      /**
       * Final renderable content.
       * Use a flexible object with known common fields + allow arbitrary extra keys.
       * The renderer/AI will interpret based on component `type`.
       */
      content: z
        .object({
          headline: z
            .string()
            .optional()
            .describe("Final headline text if this component has one"),
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
            .describe("Images used by this component"),
          ctas: z
            .array(ctaSchema)
            .optional()
            .describe("CTAs used by this component"),
          /**
           * Common listicle/proof/faq items (free-form but structured)
           */
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

          /**
           * Open-ended extension point:
           * Your AI can add extra keys (e.g. 'rating', 'logos', 'pricingNote').
           * Your renderer can ignore what it doesn't understand.
           */
        })
        .catchall(z.any())
        .describe("Final renderable content. This is the CMS surface area."),

      /**
       * Instructional notes strictly for AI/implementation (not rendered).
       */
      instructions: z
        .object({
          purpose: z
            .string()
            .optional()
            .describe(
              "What this component must achieve for conversion. Example: 'state main promise and drive CTA'."
            ),
          constraints: z
            .array(z.string())
            .optional()
            .describe(
              "Hard requirements. Example: 'include variant selection before add-to-cart'."
            ),
          analyticsNotes: z
            .array(z.string())
            .optional()
            .describe(
              "What interactions to track. Example: 'track add_to_cart from each listicle item'."
            ),
          implementationNotes: z
            .array(z.string())
            .optional()
            .describe(
              "Notes for the page generator. Example: 'use accordion for FAQ', 'use card grid for items'."
            ),
        })
        .strict()
        .optional()
        .describe("Non-rendered instructions for downstream AI/codegen."),

      /**
       * Children for composition.
       */
      components: z
        .array(componentSchema)
        .optional()
        .describe("Nested child components/subsections"),
    })
    .strict()
);

/* ============================================================
 * PAGE-LEVEL SPEC
 * ============================================================ */

const messagingSchema = z
  .object({
    mainPromise: finalText.describe(
      "Single sentence promise the whole page reinforces"
    ),
    mainBenefit: finalText.describe("Primary benefit to emphasize"),
    pricePosition: finalText.describe(
      "Positioning text. Example: 'premium performance for pros'"
    ),
    audience: finalText.describe("Target audience description"),
    toneOfVoice: finalText.describe("Tone guidance in natural language"),
    keyObjections: z
      .array(finalText)
      .describe("Objections/concerns to address across the page"),
  })
  .strict();

const listicleStrategySchema = z
  .object({
    formatDescription: finalText.describe(
      "Final listicle framing. Example: '5 Reasons to Try The Complete Snowboard'."
    ),
    itemCount: z.number().int().describe("Number of listicle items"),
    orderingLogic: finalText.describe(
      "How items are ordered. Example: 'most important first, ending with the strongest proof'."
    ),
  })
  .strict();

/**
 * Main schema: renderable + instructive.
 */
export const landingPageSpecSchema = z
  .object({
    version: z.string().default("1.0").describe("Schema version"),
    page: z
      .object({
        title: finalText.describe("Page title / SEO title"),
        language: z.string().default("en").describe("Language code"),
      })
      .strict(),

    messaging: messagingSchema.describe("Global messaging decisions"),
    listicle: listicleStrategySchema.describe("Listicle structure decisions"),

    /**
     * Root component tree: typically a list of top-level sections (hero, intro, listicle, proof, faq, cta).
     */
    components: z
      .array(componentSchema)
      .min(1)
      .describe("Top-level component tree representing the entire page"),
  })
  .strict();

export type LandingPageSpec = z.infer<typeof landingPageSpecSchema>;

export type LandingPageComponent = {
  type: string;
  name?: string;
  enabled: boolean;
  layoutIntent?: z.infer<typeof layoutIntentSchema>;
  styleIntent?: z.infer<typeof styleIntentSchema>;
  content: {
    headline?: string;
    subheadline?: string;
    body?: string | z.infer<typeof richTextSchema>;
    bullets?: string[];
    images?: z.infer<typeof imageAssetSchema>[];
    ctas?: z.infer<typeof ctaSchema>[];
    items?: Array<{
      title?: string;
      text?: string | z.infer<typeof richTextSchema>;
      image?: z.infer<typeof imageAssetSchema>;
      cta?: z.infer<typeof ctaSchema>;
      meta?: Record<string, unknown>;
    }>;
    [key: string]: unknown;
  };
  instructions?: {
    purpose?: string;
    constraints?: string[];
    analyticsNotes?: string[];
    implementationNotes?: string[];
  };
  components?: LandingPageComponent[];
};
