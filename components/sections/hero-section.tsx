import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  content: {
    headline: string;
    subheadline: string;
    ctas: Array<{ label: string; action: string; supportingText?: string }>;
    images: Array<{ alt: string; url: string }>;
  };
  className?: string;
}

export function HeroSection({ content, className }: HeroSectionProps) {
  const backgroundImageUrl = content.images[0]?.url;
  const ctaButtonText = content.ctas[0]?.label ?? "Get Started";

  return (
    <section
      className={cn("relative py-20 px-4 text-center", className)}
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {content.headline}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {content.subheadline}
        </p>
        <Button size="lg">{ctaButtonText}</Button>
        {content.ctas[0]?.supportingText && (
          <p className="text-sm text-muted-foreground mt-2">
            {content.ctas[0].supportingText}
          </p>
        )}
      </div>
    </section>
  );
}
