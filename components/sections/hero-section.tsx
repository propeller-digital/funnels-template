import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroContent } from "@/lib/cms";

interface HeroSectionProps {
  content: HeroContent;
  className?: string;
}

export function HeroSection({ content, className }: HeroSectionProps) {
  return (
    <section
      className={cn("relative py-20 px-4 text-center", className)}
      style={
        content.backgroundImageUrl
          ? {
              backgroundImage: `url(${content.backgroundImageUrl})`,
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
        <Button size="lg">{content.ctaButtonText}</Button>
      </div>
    </section>
  );
}
